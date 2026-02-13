import { prisma } from "@/lib/prisma";
import { ContentStatus, ProjectStatus } from "@prisma/client";
import { format } from "date-fns";

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
    role: string;
    image: string;
    content?: string;
}


export interface PublicService {
    slug: string;
    title: string;
    subName?: string;
    description: string;
    features: string[];
    iconName?: string;
    capabilitiesTitle?: string; // Mapped from detailsSection.title or similar
    stats?: any[];
    process?: any[]; // Mapped from section4?
    cta?: any;
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
        readTime: "5 min read",
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
        category: p.category.replace(/_/g, ' '),
        description: p.description || "",
        tags: [],
        year: p.completionDate ? p.completionDate.getFullYear().toString() : new Date().getFullYear().toString(),
        client: p.client || "",
        role: "Development",
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
        // Fallback data when database is empty
        return {
            slug: "fintech-revolution",
            title: "Fintech Revolution",
            category: "Financial Tech",
            description: "A complete overhaul of a legacy banking system, migrating 5M+ users to a secure, cloud-native infrastructure with zero downtime.",
            tags: ["Cloud", "Security", "Migration"],
            year: "2024",
            client: "Global Bank Corp",
            role: "Full Stack Development",
            image: "/images/placeholder.jpg",
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
        image: p.coverImage || "/images/placeholder.jpg",
        content: p.description || ""
    };
}

export async function getPublicServices() {
    const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
    });

    return services.map(s => ({
        slug: s.slug,
        title: s.name,
        description: s.description,
        features: s.features,
    }));
}


export async function getPublicService(slug: string): Promise<PublicService | null> {
    const s = await prisma.service.findUnique({
        where: { slug },
    });

    if (!s || !s.isActive) return null;

    // Helper to safely access JSON
    const section1 = s.section1 as any || {};
    const section4 = s.section4 as any || {};
    const details = s.detailsSection as any || {};
    const buyNow = s.buyNowSection as any || {};

    return {
        slug: s.slug,
        title: s.name,
        subName: s.subName,
        description: s.description,
        features: s.features,
        capabilitiesTitle: details.title || "WHAT WE BUILD.",
        process: section4.steps || [], // Assuming section4 has steps
        cta: {
            title: buyNow.title || "READY TO BUILD?",
            desc: buyNow.description || "Let's discuss your project.",
            button: "Start Now"
        }
    };
}
