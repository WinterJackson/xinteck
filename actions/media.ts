"use server";

import { INTERNAL_getSecret } from "@/actions/settings";
import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse, PaginationParams } from "@/lib/pagination";

export type MediaFilter = PaginationParams & {
    search?: string;
    type?: "image" | "document" | "all";
};

export async function getMediaFiles(params: MediaFilter = {}): Promise<PaginatedResponse<any>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, type } = params;

    const where: any = { deletedAt: null };

    if (search) {
        where.originalName = { contains: search, mode: 'insensitive' };
    }

    if (type && type !== "all") {
        if (type === "image") {
            where.mimeType = { startsWith: "image/" };
        } else {
            where.mimeType = { not: { startsWith: "image/" } };
        }
    }

    const [files, total] = await Promise.all([
        prisma.mediaFile.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: { uploadedBy: { select: { name: true } } }
        }),
        prisma.mediaFile.count({ where })
    ]);

    const data = files.map(f => ({
        id: f.id,
        name: f.originalName,
        size: formatBytes(f.size),
        type: f.mimeType.startsWith('image/') ? 'image' : 'document',
        date: f.createdAt.toLocaleDateString(),
        url: f.url
    }));

    return createPaginatedResult(data, total, page, limit);
}

export async function uploadFile(formData: FormData) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    // ─── VALIDATION ───
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_MIME_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (file.size > MAX_SIZE) {
        throw new Error(`File size exceeds the limit of ${MAX_SIZE / (1024 * 1024)}MB.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic Config
    const cloud_name = await INTERNAL_getSecret("CLOUDINARY_CLOUD_NAME");
    const api_key = await INTERNAL_getSecret("CLOUDINARY_API_KEY");
    const api_secret = await INTERNAL_getSecret("CLOUDINARY_API_SECRET");

    if (!cloud_name || !api_key || !api_secret) {
        throw new Error("Cloudinary configuration missing. Please check System Settings.");
    }

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
        secure: true
    });

    try {
        // Upload to Cloudinary using a promise wrapper around the stream
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "xinteck_uploads",
                    resource_type: "auto", // Handle images, videos, raw files
                    public_id: file.name.split('.')[0] + "_" + Date.now(), // simple unique name logic
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Save metadata to DB
        const media = await prisma.mediaFile.create({
            data: {
                name: result.public_id,
                originalName: file.name,
                mimeType: file.type,
                size: result.bytes,
                url: result.secure_url,
                uploadedById: user.id
            }
        });

        await logAudit({
            action: "media.upload",
            entity: "MediaFile",
            entityId: media.id,
            userId: user.id,
            metadata: {
                fileName: file.name,
                cloudinaryId: result.public_id
            }
        });

        revalidatePath("/admin/files");
        return { success: true, url: result.secure_url };

    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload file to media storage");
    }
}

import { uuidSchema } from "@/lib/validations";

export async function deleteFile(id: string) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const file = await prisma.mediaFile.findUnique({ where: { id: validatedId } });
    if (!file) return;

    // Soft delete in DB
    await prisma.mediaFile.update({ where: { id: validatedId }, data: { deletedAt: new Date() } });

    // Remove from Cloudinary
    try {
        const cloud_name = await INTERNAL_getSecret("CLOUDINARY_CLOUD_NAME");
        const api_key = await INTERNAL_getSecret("CLOUDINARY_API_KEY");
        const api_secret = await INTERNAL_getSecret("CLOUDINARY_API_SECRET");

        if (cloud_name && api_key && api_secret) {
            cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
            // Use publicId for proper Cloudinary deletion
            const publicId = file.publicId || file.name;
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (e) {
        console.error("Failed to delete file from Cloudinary:", e);
    }

    await logAudit({
        action: "media.delete",
        entity: "MediaFile",
        entityId: id,
        userId: user.id,
        metadata: { fileName: file.originalName }
    });

    revalidatePath("/admin/files");
    return { success: true };
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
