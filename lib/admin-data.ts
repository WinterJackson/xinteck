import { Activity, Cloud, Code, FileText, MessageSquare, Monitor } from "lucide-react";

export const STAFF = [
    { id: 1, name: "Admin Key", role: "Super Admin", email: "admin@xinteck.com", status: "Active", lastActive: "Now" },
    { id: 2, name: "Sarah Editor", role: "Content Editor", email: "sarah@xinteck.com", status: "Active", lastActive: "2h ago" },
    { id: 3, name: "Mike Designer", role: "Designer", email: "mike@xinteck.com", status: "Away", lastActive: "5h ago" },
    { id: 4, name: "John Dev", role: "Developer", email: "john@xinteck.com", status: "Offline", lastActive: "2d ago" },
];

export const FILES = [
    { id: 1, name: "logo-dark.png", size: "245 KB", type: "image", date: "Oct 24, 2025", url: "" },
    { id: 2, name: "hero-banner.jpg", size: "1.2 MB", type: "image", date: "Oct 22, 2025", url: "" },
    { id: 3, name: "project-proposal.pdf", size: "4.5 MB", type: "document", date: "Oct 20, 2025", url: "" },
    { id: 4, name: "annual-report.pdf", size: "2.1 MB", type: "document", date: "Oct 18, 2025", url: "" },
    { id: 5, name: "team-photo.jpg", size: "3.4 MB", type: "image", date: "Oct 15, 2025", url: "" },
    { id: 6, name: "client-contract.docx", size: "890 KB", type: "document", date: "Oct 12, 2025", url: "" },
];

export const MESSAGES = [
    {
        id: 1,
        sender: "John Doe",
        email: "john@example.com",
        subject: "Project Inquiry: E-commerce App",
        preview: "Hi team, I'm looking to build a new mobile app for my store...",
        date: "10:30 AM",
        unread: true,
        avatar: "JD",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
        id: 2,
        sender: "Alice Smith",
        email: "alice@tech.com",
        subject: "Partnership Opportunity",
        preview: "We would like to discuss a potential partnership regarding cloud services...",
        date: "Yesterday",
        unread: false,
        avatar: "AS",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
        id: 3,
        sender: "Robert Brown",
        email: "bob@construction.com",
        subject: "Website Redesign Quote",
        preview: "Our current website is outdated and needs a refresh. Can we schedule a call?",
        date: "Oct 24",
        unread: false,
        avatar: "RB",
        color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
];

export const BLOG_POSTS = [
    {
        id: 1,
        title: "The Future of Edge Computing",
        category: "Technology",
        status: "Published",
        views: "1.2k",
        date: "Oct 24, 2025",
        author: "Admin"
    },
    {
        id: 2,
        title: "Scaling Fintech Infrastructure",
        category: "Engineering",
        status: "Draft",
        views: "-",
        date: "Oct 22, 2025",
        author: "Sarah Editor"
    },
    {
        id: 3,
        title: "UI/UX Trends for 2026",
        category: "Design",
        status: "Published",
        views: "3.4k",
        date: "Oct 20, 2025",
        author: "Mike Designer"
    },
    {
        id: 4,
        title: "Serverless Architecture Guide",
        category: "DevOps",
        status: "Published",
        views: "890",
        date: "Oct 18, 2025",
        author: "Admin"
    },
    {
        id: 5,
        title: "Green Energy in Tech",
        category: "Sustainability",
        status: "Draft",
        views: "-",
        date: "Oct 15, 2025",
        author: "Sarah Editor"
    }
];

export const PROJECTS = [
    {
        id: 1,
        title: "Global Fintech Scaling",
        client: "FinTech Corp",
        category: "Mobile App",
        status: "Active",
        image: "/images/portfolio/fintech.jpg"
    },
    {
        id: 2,
        title: "Smart Home Hub",
        client: "IoTech",
        category: "UI/UX Design",
        status: "Completed",
        image: "/images/portfolio/smart-home.jpg"
    },
    {
        id: 3,
        title: "E-Commerce Rebrand",
        client: "Shopify Store",
        category: "Web Dev",
        status: "Active",
        image: "/images/portfolio/ecommerce.jpg"
    },
    {
        id: 4,
        title: "Healthcare Analytics",
        client: "MedData",
        category: "Custom Software",
        status: "In Review",
        image: "/images/portfolio/health.jpg"
    },
];

export const DASHBOARD_STATS = [
    {
        title: "Total Views",
        value: "24.5k",
        trend: "+12%",
        isPositive: true,
        icon: Activity,
        href: "/admin/analytics",
        color: "text-blue-400"
    },
    {
        title: "Blog Reads",
        value: "8,234",
        trend: "+5%",
        isPositive: true,
        icon: FileText,
        href: "/admin/blog",
        color: "text-gold"
    },
    {
        title: "Design Projects",
        value: "12",
        trend: "+2",
        isPositive: true,
        icon: Monitor,
        href: "/admin/projects",
        color: "text-purple-400"
    },
    {
        title: "Pending Inquiries",
        value: "5",
        trend: "-2",
        isPositive: false,
        icon: MessageSquare,
        href: "/admin/inbox",
        color: "text-red-400"
    }
];

export const RECENT_ACTIVITY = [
    {
        id: 1,
        user: "John Doe",
        action: "submitted a contact form",
        time: "2 hours ago",
        type: "inbox"
    },
    {
        id: 2,
        user: "Admin",
        action: "published 'Future of Fintech'",
        time: "4 hours ago",
        type: "blog"
    },
    {
        id: 3,
        user: "Sarah Smith",
        action: "uploaded 'logo-v2.svg'",
        time: "5 hours ago",
        type: "file"
    },
    {
        id: 4,
        user: "System",
        action: "Backup completed successfully",
        time: "12 hours ago",
        type: "system"
    }
];

export const ANALYTICS_DATA = [
    { name: "Mon", visits: 4000, views: 2400, inquiries: 2 },
    { name: "Tue", visits: 3000, views: 1398, inquiries: 5 },
    { name: "Wed", visits: 2000, views: 9800, inquiries: 8 },
    { name: "Thu", visits: 2780, views: 3908, inquiries: 3 },
    { name: "Fri", visits: 1890, views: 4800, inquiries: 1 },
    { name: "Sat", visits: 2390, views: 3800, inquiries: 0 },
    { name: "Sun", visits: 3490, views: 4300, inquiries: 4 },
];

export const QUICK_ACTIONS = [
    { label: "New Article", icon: FileText, href: "/admin/blog/new", desc: "Write a blog post" },
    { label: "Add Project", icon: Code, href: "/admin/projects/new", desc: "Showcase work" },
    { label: "Upload File", icon: Cloud, href: "/admin/files", desc: "Media library" },
    { label: "Check Inbox", icon: MessageSquare, href: "/admin/inbox", desc: "View messages" },
];
