"use server";

import { prisma } from "@/lib/prisma";
import { ContentStatus, ProjectStatus } from "@prisma/client";
import { format } from "date-fns";

// Re-export types for use in components if needed, or define public DTOs
export interface PublicPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    readTime: string;
    tag: string;
    content?: string;
    image?: string;
}

export interface PublicProject {
    slug: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    year: string;
    client: string;
    role: string; // Not in DB schema? Need to check.
    image: string;
    content?: string;
}

export interface PublicService {
    slug: string;
    title: string;
    description: string;
    features: string[];
    iconName?: string; // We might need to map icons
}


export async function getPublicPosts(): Promise<PublicPost[]> {
    const posts = await prisma.blogPost.findMany({
        where: { status: ContentStatus.PUBLISHED, publishedAt: { not: null } },
        orderBy: { publishedAt: 'desc' },
        include: { author: true, category: true }
    });

    return posts.map(post => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        date: post.publishedAt ? format(post.publishedAt, "MMM dd, yyyy") : "",
        author: post.author.name || "Team Xinteck",
        readTime: "5 min read", // Mock or calc
        tag: post.category?.name || "Tech",
        image: post.featuredImage || ""
    }));
}

export async function getPublicPost(slug: string): Promise<PublicPost | null> {
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true, category: true }
    });

    if (!post || post.status !== ContentStatus.PUBLISHED) return null;

    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        date: post.publishedAt ? format(post.publishedAt, "MMM dd, yyyy") : "",
        author: post.author.name || "Team Xinteck",
        readTime: "5 min read",
        tag: post.category?.name || "Tech",
        content: post.content,
        image: post.featuredImage || ""
    };
}

export async function getPublicProjects(): Promise<PublicProject[]> {
    const projects = await prisma.project.findMany({
        where: { status: { in: [ProjectStatus.COMPLETED, ProjectStatus.ACTIVE] } },
        orderBy: { completionDate: 'desc' }
    });

    return projects.map(p => ({
        slug: p.slug,
        title: p.title,
        category: p.category.replace(/_/g, ' '), // Simple mapping
        description: p.description || "",
        tags: [], // Tags not in DB schema yet
        year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
        client: p.client || "",
        role: "Development", // Hardcoded or add field to DB
        image: p.coverImage || "/images/placeholder.jpg"
    }));
}

export async function getPublicProject(slug: string): Promise<PublicProject | null> {
    const p = await prisma.project.findUnique({
        where: { slug },
    });

    if (!p || (p.status !== ProjectStatus.COMPLETED && p.status !== ProjectStatus.ACTIVE)) return null;

    return {
        slug: p.slug,
        title: p.title,
        category: p.category.replace(/_/g, ' '),
        description: p.description || "",
        tags: [], // Tags not in DB
        year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
        client: p.client || "",
        role: "Development",
        image: p.coverImage || "/images/placeholder.jpg",
        content: p.description || ""
    };
}

export async function getFeaturedProject(): Promise<PublicProject | null> {
    const p = await prisma.project.findFirst({
        where: { status: ProjectStatus.COMPLETED },
        orderBy: { completionDate: 'desc' }
    });

    if (!p) {
        // Fallback Data
        return {
            slug: "fintech-revolution",
            title: "Fintech Revolution",
            category: "Financial Tech",
            description: "A complete overhaul of a legacy banking system, migrating 5M+ users to a secure, cloud-native infrastructure with zero downtime.",
            tags: ["Cloud", "Security", "Migration"],
            year: "2024",
            client: "Global Bank Corp",
            role: "Full Stack Development",
            image: "/images/project-1.jpg", // Ensure this exists or use placeholder
            content: "Full case study content..."
        };
    }

    return {
        slug: p.slug,
        title: p.title,
        category: p.category.replace(/_/g, ' '),
        description: p.description || "",
        tags: [],
        year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
        client: p.client || "",
        role: "Development",
        image: p.coverImage || "/public/images/placeholder.jpg",
        content: p.description || ""
    };
}

export async function getPublicServices() {
    const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
    });

    // Map to the shape expected by ServicesPage
    // The icon is a component in the static array. We can't pass components from Server Actions.
    // We pass the name/slug and let the client component map it to an icon.
    return services.map(s => ({
        slug: s.slug,
        title: s.name,
        description: s.description,
        features: s.features,
        // layout properties
    }));
}

export async function getPublicService(slug: string): Promise<PublicService | null> {
    const s = await prisma.service.findUnique({
        where: { slug },
    });

    if (!s || !s.isActive) return null;

    return {
        slug: s.slug,
        title: s.name,
        description: s.description,
        features: s.features,
    };
}
