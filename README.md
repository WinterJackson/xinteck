<div align="center">
  <img src="public/logos/logo-light.png" alt="Xinteck Logo" width="120" />
  <h1>X I N T E C K</h1>
  <p><strong>Next-Gen Digital Transformation Agency</strong></p>
  
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
     <a href="https://www.prisma.io/">
      <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    </a>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-legal-compliance">Legal & Privacy</a>
  </p>
</div>

<br />

## 🚀 Overview

**Xinteck** is a premium, high-performance corporate website designed for a modern technology agency. It showcases services ranging from **Web Development** to **Cloud & DevOps**, utilizing state-of-the-art web technologies to deliver an immersive user experience.

The platform is built with a focus on **aesthetics, performance, and legal compliance**, tailored specifically for the Kenyan market while maintaining global standards. It features glassmorphism UI, scroll-triggered video animations, and comprehensive service details.

---

## ✨ Features

### 🎨 **Immersive UI/UX**
*   **Glassmorphism Design**: Modern, translucent visuals with a unified Gold & Black premium aesthetic.
*   **Video Scroll Layout**: Dynamic video backgrounds that react to user scrolling `[VideoScrollLayout]`.
*   **Framer Motion Animations**: Smooth transitions, staggered reveals, and interactive elements.
*   **Responsive & Accessible**: Fully optimized for all devices with WCAG compliance considerations.

### 🛠 **Service Showcases**
Dedicated, feature-rich pages for core services:
*   **Web Development**: Next.js & modern web standards.
*   **Mobile App Development**: React Native & cross-platform solutions.
*   **Custom Software**: Enterprise-grade bespoke systems.
*   **UI/UX Design**: User-centric design systems & prototyping.
*   **Cloud & DevOps**: Infrastructure as Code & scalable architecture.

### ⚖️ **Legal & Compliance (Kenya DPA 2019)**
*   **Privacy Policy**: Comprehensive 13-section policy compliant with the **Kenya Data Protection Act 2019**, including data subject rights and ODPC references.
*   **Terms of Service**: legally robust 16-section agreement covering IP rights (Kenya Copyright Act), payment terms (16% VAT), and dispute resolution (Arbitration Act 1995).
*   **Cookie Policy**: Dedicated page with detailed cookie categorization and management options.

### 📝 **Content & Engagement**
*   **Blog System**: Markdown-based blog with categories, search, and reading time estimation.
*   **Portfolio**: Case studies with rich media support.
*   **Contact Forms**: Integrated with **Resend** for reliable email notifications and newsletter subscriptions.

---

## 💻 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | App Router, Server Components, SSR/SSG |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static typing for robust code |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Relational database (via Prisma) |
| **ORM** | [Prisma](https://www.prisma.io/) | Type-safe database client |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Production-ready declarative animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful & consistent open-source icons |
| **Email** | [Resend](https://resend.com/) | Developer-first email API |
| **Content** | [MDX](https://mdxjs.com/) | Markdown + JSX for blog & portfolio |

---

## 📂 Project Structure

```bash
Xinteck/
├── app/                    # Next.js App Router pages
│   ├── api/                # API Routes (Contact, Newsletter)
│   ├── services/           # Service-specific landing pages
│   ├── privacy/            # Privacy Policy
│   ├── terms/              # Terms of Service
│   └── ...
├── components/             # Reusable React components
│   ├── layout/             # Navbar, Footer, VideoScrollLayout
│   ├── sections/           # Hero, Services, Features
│   └── ui/                 # Buttons, Cards, Inputs
├── lib/                    # Utilities & Helper functions
│   ├── db.ts               # Database client (Prisma)
│   ├── utils.ts            # CN & formatting helpers
│   └── videoStats.ts       # Video asset configurations
├── prisma/                 # Database schema & seeds
├── public/                 # Static assets (Images, Videos, Logos)
└── ...
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn
*   PostgreSQL Database (Local or Cloud)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Muhol/Xinteck.git
    cd Xinteck
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/xinteck?schema=public"
    RESEND_API_KEY="re_..."
    RESEND_AUDIENCE_ID="..."
    ```

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    # Optional: Seed data
    npx prisma db seed
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Legal & License

This project is proprietary software developed by **Xinteck**.

*   **Copyright**: © 2026 Xinteck. All rights reserved.
*   **Privacy**: See `/privacy` for data handling practices.
*   **Terms**: See `/terms` for usage conditions.

---

<div align="center">
  <sub>Built with precision by Xinteck Engineering Team.</sub>
</div>
