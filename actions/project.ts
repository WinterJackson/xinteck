"use server";

import { logAudit } from "@/lib/audit";
import { requireRole } from "@/lib/auth-check";
import { prisma } from "@/lib/prisma";
import { projectSchema, uuidSchema } from "@/lib/validations";
import { ProjectCategory, ProjectStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createPaginatedResult, getPaginationParams, PaginatedResponse } from "@/lib/pagination";
import { ProjectSummary } from "@/types";
import { PaginationParams } from "@/types/pagination";
import { Prisma } from "@prisma/client";

export type ProjectFilter = PaginationParams & {
    category?: string;
    status?: string;
    search?: string;
};

export async function getProjects(params: ProjectFilter = {}): Promise<PaginatedResponse<ProjectSummary>> {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    const { page, pageSize: limit, skip } = getPaginationParams(params);
    const { search, category } = params;

    const where: Prisma.ProjectWhereInput = {
        deletedAt: null,
    };

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { client: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (category && category !== "All Categories") {
        const cat = mapCategoryToEnum(category);
        if (cat) where.category = cat;
    }

    const [projects, total] = await Promise.all([
        prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } }
            },
            skip,
            take: limit,
        }),
        prisma.project.count({ where })
    ]);

    const data: ProjectSummary[] = projects.map(p => ({
        id: p.id,
        title: p.title,
        client: p.client || "N/A",
        category: mapEnumToCategory(p.category),
        status: mapEnumToStatus(p.status),
        image: p.coverImage
    }));

    return createPaginatedResult(data, total, page, limit);
}

export async function getProject(id: string) {
    await requireRole([Role.ADMIN, Role.SUPER_ADMIN, Role.SUPPORT_STAFF]);

    // Check if new
    if (id === 'new') return null;
    const validatedId = uuidSchema.parse(id);

    const project = await prisma.project.findUnique({
        where: { id: validatedId },
        include: { author: { select: { name: true } } }
    });

    if (!project) return null;

    return {
        ...project,
        author: project.author.name,
        category: mapEnumToCategory(project.category),
        status: mapEnumToStatus(project.status),
        image: project.coverImage,
        completionDate: project.completionDate ? project.completionDate.toISOString().split('T')[0] : ""
    };
}

export async function createProject(data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const parsed = projectSchema.parse(data);

    // Auto slug
    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const project = await prisma.project.create({
        data: {
            title: data.title,
            slug,
            client: data.client,
            url: data.url,
            description: data.description,
            coverImage: data.image,
            category: mapCategoryToEnum(data.category) || ProjectCategory.WEB_DEV,
            status: mapStatusToEnum(data.status) || ProjectStatus.IN_REVIEW,
            completionDate: data.completionDate ? new Date(data.completionDate) : null,
            authorId: user.id
        }
    });

    await logAudit({
        action: "project.create",
        entity: "Project",
        entityId: project.id,
        userId: user.id,
        metadata: { title: project.title }
    });

    revalidatePath("/admin/projects");
    return { success: true, id: project.id };
}

export async function updateProject(id: string, data: any) {
    const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
    const validatedId = uuidSchema.parse(id);
    const parsed = projectSchema.partial().parse(data);

    // Handle slug update if title changed? Optional.
    // For now keep slug stable or update if explicitly needed?
    // Let's keep simple.

    const { category, status, completionDate, ...rest } = parsed;

    // Optimistic locking (Phase 3)
    const currentVersion = data.version;

    try {
        const project = await prisma.project.update({
            where: {
                id: validatedId,
                ...(typeof currentVersion === 'number' ? { version: currentVersion } : {})
            },
            data: {
                ...rest,
                ...(category && mapCategoryToEnum(category) ? { category: mapCategoryToEnum(category) } : {}),
                ...(status && mapStatusToEnum(status) ? { status: mapStatusToEnum(status) } : {}),
                completionDate: completionDate ? new Date(completionDate) : (completionDate === null ? null : undefined),
                version: { increment: 1 }
            }
        });

        await logAudit({
            action: "project.update",
            entity: "Project",
            entityId: project.id,
            userId: user.id,
            metadata: { title: project.title }
        });

        revalidatePath("/admin/projects");
        revalidatePath(`/admin/projects/${id}`);
        return { success: true, id };

    } catch (error: any) {
        if (error.code === 'P2025') {
            throw new Error("Concurrency conflict: This project has been modified by another user. Please refresh and try again.");
        }
        throw error;
    }
}

export async function deleteProject(id: string) {
    const user = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
    const validatedId = uuidSchema.parse(id);

    const project = await prisma.project.update({
        where: { id: validatedId },
        data: { deletedAt: new Date() }
    });

    await logAudit({
        action: "project.delete",
        entity: "Project",
        entityId: project.id,
        userId: user.id,
        metadata: { title: project.title }
    });

    revalidatePath("/admin/projects");
    return { success: true };
}

// Helpers
function mapEnumToCategory(cat: ProjectCategory): string {
    const map: Record<ProjectCategory, string> = {
        WEB_DEV: "Web Dev",
        MOBILE_APP: "Mobile App",
        UI_UX_DESIGN: "UI/UX Design",
        CUSTOM_SOFTWARE: "Custom Software",
        CONSULTING: "Consulting"
    };
    return map[cat] || "Web Dev";
}

function mapCategoryToEnum(cat: string): ProjectCategory | undefined {
    // Reverse map
    const map: Record<string, ProjectCategory> = {
        "Web Dev": ProjectCategory.WEB_DEV,
        "Mobile App": ProjectCategory.MOBILE_APP,
        "UI/UX Design": ProjectCategory.UI_UX_DESIGN,
        "Custom Software": ProjectCategory.CUSTOM_SOFTWARE,
        "Consulting": ProjectCategory.CONSULTING,
        // Fallbacks
        "Web Development": ProjectCategory.WEB_DEV
    };
    return map[cat];
}

function mapEnumToStatus(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
        ACTIVE: "Active",
        COMPLETED: "Completed",
        IN_REVIEW: "In Review",
        ARCHIVED: "Archived"
    };
    return map[status] || "In Review";
}

function mapStatusToEnum(status: string): ProjectStatus | undefined {
    const map: Record<string, ProjectStatus> = {
        "Active": ProjectStatus.ACTIVE,
        "Completed": ProjectStatus.COMPLETED,
        "In Review": ProjectStatus.IN_REVIEW,
        "Archived": ProjectStatus.ARCHIVED
    };
    return map[status];
}
