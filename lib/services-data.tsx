import { CloudDevOpsMockup } from "@/components/services/mockups/CloudDevOpsMockup";
import { CustomSoftwareMockup } from "@/components/services/mockups/CustomSoftwareMockup";
import { MobileAppMockup } from "@/components/services/mockups/MobileAppMockup";
import { UiUxMockup } from "@/components/services/mockups/UiUxMockup";
import { WebDevMockup } from "@/components/services/mockups/WebDevMockup";
import {
    Activity, Box, Cloud, Code2, Container, Database, Eye, Fingerprint, GitBranch, Globe,
    Layers, Layout, LayoutTemplate, Monitor, MousePointerClick, Palette, PenTool, RefreshCcw,
    Rocket, Server, ShieldCheck, Smartphone, Sparkles, Tablet, Wifi, Workflow, Zap
} from "lucide-react";

export const SERVICES_DATA = {
  "web-development": {
    slug: "web-development",
    heroTop: "Digital Platforms",
    heroMain: "WEB \n DEVELOPMENT.",
    heroDesc: "We craft high-performance, secure, and infinitely scalable web applications. Our engineering team focuses on lightning-fast load times and seamless user experiences.",
    heroIcon: Globe,
    summaryFeatures: [
      "Custom web applications built to scale",
      "Optimized for speed and SEO performance",
      "Secure, maintainable, and future-proof",
    ],
    MockupComponent: WebDevMockup,
    capabilitiesTitle: "WHAT WE BUILD.",
    processTitle: "HOW WE DELIVER.",
    ctaTitle: "READY TO BUILD?",
    ctaDesc: "Let's discuss your web development project and create something extraordinary together.",
    ctaButton: "Get a Custom Proposal",
    features: [
      { title: "React & Next.js Architecture", icon: Code2, desc: "Modern component-based development with server-side rendering." },
      { title: "E-commerce Ecosystems", icon: Layers, desc: "Scalable online stores with payment integration and inventory." },
      { title: "Headless CMS Integration", icon: Server, desc: "Content management that separates front-end from back-end." },
      { title: "PWA & Responsive Labs", icon: Globe, desc: "Progressive web apps that work offline and on any device." },
      { title: "Global CDN Deployment", icon: Rocket, desc: "Lightning-fast delivery from edge servers worldwide." },
      { title: "API First Development", icon: Zap, desc: "RESTful and GraphQL APIs built for maximum flexibility." },
    ],
    process: [
      { step: "01", title: "Blueprint", desc: "Detailed technical specification and architecture design tailored to your needs." },
      { step: "02", title: "Sprint", desc: "High-velocity development with continuous integration and daily progress updates." },
      { step: "03", title: "Audit", desc: "Rigorous performance, security, and accessibility testing before launch." },
      { step: "04", title: "Launch", desc: "Deployment to global edge servers with 99.9% uptime guarantee." },
    ]
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    heroTop: "Native Experiences",
    heroMain: "MOBILE APP \n DEVELOPMENT.",
    heroDesc: "Creating stunning, intuitive mobile apps for iOS and Android. We focus on deep system integration and fluid animations that users love.",
    heroIcon: Smartphone,
    summaryFeatures: [
      "Native performance across all devices",
      "Touch-optimized UI/UX design",
      "Seamless cloud synchronization",
    ],
    MockupComponent: MobileAppMockup,
    capabilitiesTitle: "WHAT WE CRAFT.",
    processTitle: "HOW WE EXECUTE.",
    ctaTitle: "HAVE AN IDEA?",
    ctaDesc: "Let's turn your mobile app concept into a top-charting reality.",
    ctaButton: "Get a Free Consultation",
    features: [
      { title: "iOS Swift Development", icon: Smartphone, desc: "Native iOS applications built with Swift and SwiftUI for maximum performance." },
      { title: "Android Kotlin Apps", icon: Tablet, desc: "Modern Android experiences leveraging the latest Jetpack libraries." },
      { title: "Cross-Platform React Native", icon: Layers, desc: "Code once, deploy everywhere without compromising on native feel." },
      { title: "App Store Optimization", icon: Layout, desc: "Strategic positioning to maximize visibility and downloads." },
      { title: "Biometric Security", icon: Fingerprint, desc: "Integration of FaceID and TouchID for secure, frictionless authentication." },
      { title: "Offline-First Logic", icon: Wifi, desc: "Robust data synchronization ensuring app works perfectly without internet." },
    ],
    process: [
      { step: "01", title: "Prototype", desc: "Interactive low-fidelity and high-fidelity wireframing to validate flow." },
      { step: "02", title: "Develop", desc: "Clean, native-feel coding with modular architectures and TDD." },
      { step: "03", title: "Connect", desc: "Deep integration with cloud backends, databases, and third-party APIs." },
      { step: "04", title: "Quality", desc: "Rigorous testing across 50+ real device types and OS versions." },
    ]
  },
  "ui-ux-design": {
    slug: "ui-ux-design",
    heroTop: "Visual Strategy",
    heroMain: "UI/UX \n DESIGN.",
    heroDesc: "Design that transcends aesthetics. We create user-centric interfaces that convert visitors into loyal customers through science and art.",
    heroIcon: PenTool,
    summaryFeatures: [
      "Psychology-driven user interfaces",
      "Pixel-perfect visual harmony",
      "Accessibility first approach (WCAG)",
    ],
    MockupComponent: UiUxMockup,
    capabilitiesTitle: "WHAT WE DESIGN.",
    processTitle: "HOW WE THINK.",
    ctaTitle: "NEED A MAKEOVER?",
    ctaDesc: "Let's craft a digital experience that your users will fall in love with.",
    ctaButton: "Start Design Sprint",
    features: [
      { title: "Visual Identity Systems", icon: Palette, desc: "Comprehensive design languages that communicate your brand's essence instantly." },
      { title: "Conversion Optimization", icon: MousePointerClick, desc: "Data-driven design adjustments that turn visitors into loyal customers." },
      { title: "Design System Creation", icon: Layout, desc: "Scalable component libraries ensuring consistency across all digital touchpoints." },
      { title: "User Research & Testing", icon: Eye, desc: "In-depth behavioral analysis to validate decisions before writing code." },
      { title: "Interactive Prototyping", icon: Monitor, desc: "High-fidelity clickable models to visualize the flow and feel of the product." },
      { title: "Motion Design Labs", icon: Sparkles, desc: "Fluid animations and micro-interactions that delight and guide users." },
    ],
    process: [
      { step: "01", title: "Research", desc: "Deep dive into user behavior, psychological triggers, and market gaps." },
      { step: "02", title: "Wireframe", desc: "Architecting the information hierarchy and user journey bone structure." },
      { step: "03", title: "Style", desc: "Applying premium aesthetics, typography, and color theory to bring it to life." },
      { step: "04", title: "Iterate", desc: "Rigorous testing with real users and refining based on heatmaps and feedback." },
    ]
  },
  "cloud-devops": {
    slug: "cloud-devops",
    heroTop: "Infra Excellence",
    heroMain: "CLOUD & \n DEVOPS.",
    heroDesc: "Modernizing your infrastructure with cloud-native automation. We ensure your systems are resilient, secure, and ready for global traffic peaks.",
    heroIcon: Server,
    summaryFeatures: [
      "Infinite scalability on demand",
      "Automated self-healing infrastructure",
      "Enterprise-grade security standards",
    ],
    MockupComponent: CloudDevOpsMockup,
    capabilitiesTitle: "WHAT WE MANAGE.",
    processTitle: "HOW WE DEPLOY.",
    ctaTitle: "READY TO SCALE?",
    ctaDesc: "Let's build an infrastructure that grows with your ambition.",
    ctaButton: "Get a Cloud Audit",
    features: [
      { title: "AWS/Azure/GCP Logic", icon: Cloud, desc: "Multi-cloud architectures optimizing for cost, performance, and redundancy." },
      { title: "CI/CD Pipeline Mastery", icon: GitBranch, desc: "Automated deployment workflows that push code from commit to production in minutes." },
      { title: "Kubernetes Orchestration", icon: Container, desc: "Scalable container management for microservices with self-healing capabilities." },
      { title: "Serverless Scaling", icon: Zap, desc: "Event-driven compute that scales to zero and handles infinite traffic spikes." },
      { title: "Security Hardening", icon: ShieldCheck, desc: "DevSecOps integration ensuring compliance and security at every layer." },
      { title: "Site Reliability Labs", icon: Activity, desc: "Proactive monitoring and incident response to maintain 99.99% uptime." },
    ],
    process: [
      { step: "01", title: "Assess", desc: "Comprehensive audit of current infrastructure security, cost, and performance." },
      { step: "02", title: "Automate", desc: "Codifying infrastructure (IaC) to ensure reproducible and consistent environments." },
      { step: "03", title: "Secure", desc: "Implementing zero-trust architecture, encryption, and automated compliance checks." },
      { step: "04", title: "Monitor", desc: "Setting up real-time observability dashboards and intelligent alerting systems." },
    ]
  },
  "custom-software-development": {
    slug: "custom-software-development",
    heroTop: "Enterprise Solutions",
    heroMain: "CUSTOM \n SOFTWARE.",
    heroDesc: "Tailor-made software built to solve unique business challenges. We automate the complex and streamline the legacy for modern growth.",
    heroIcon: Layers,
    summaryFeatures: [
      "Automate complex business logic",
      "Secure enterprise-grade architecture",
      "Seamless 3rd-party integrations",
    ],
    MockupComponent: CustomSoftwareMockup,
    capabilitiesTitle: "WHAT WE SOLVE.",
    processTitle: "HOW WE SCALE.",
    ctaTitle: "NEED A SOLUTION?",
    ctaDesc: "Let's engineer a custom software solution that puts you miles ahead of the competition.",
    ctaButton: "Get a Technical Audit",
    features: [
      { title: "Legacy Modernization", icon: RefreshCcw, desc: "Transform outdated systems into modern, scalable cloud architectures." },
      { title: "Custom ERP/CRM Systems", icon: LayoutTemplate, desc: "Tailor-made management tools that fit your unique business processes perfectly." },
      { title: "Automated Workflows", icon: Workflow, desc: "Eliminate manual tasks with intelligent business process automation." },
      { title: "Data Lake Architecture", icon: Database, desc: "Centralized data repositories for advanced analytics and reporting." },
      { title: "Microservices Design", icon: Box, desc: "Decoupled architecture for improved scalability and easier maintenance." },
      { title: "Internal Admin Tools", icon: ShieldCheck, desc: "Secure dashes and portals to empower your internal teams." },
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Deep dive workshops to understand the complex roadblocks in your current system." },
      { step: "02", title: "Architect", desc: "Building a rock-solid technical foundation designed for long-term scalability." },
      { step: "03", title: "Integrate", desc: "Seamlessly connecting new custom tools with your existing tech stack." },
      { step: "04", title: "Support", desc: "Continuous maintenance, updates, and dedicated 24/7 technical support." },
    ]
  }
};
