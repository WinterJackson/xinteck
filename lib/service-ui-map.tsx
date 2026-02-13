import {
    Cloud,
    Code,
    Globe,
    Palette,
    Smartphone
} from "lucide-react";

// Mockups placeholders
const WebDevMockup = () => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center">
         <Globe size={120} className="text-primary/20" />
    </div>
);

const MobileMockup = () => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center">
         <Smartphone size={120} className="text-primary/20" />
    </div>
);

const DesignMockup = () => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center">
         <Palette size={120} className="text-primary/20" />
    </div>
);

const CloudMockup = () => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center">
         <Cloud size={120} className="text-primary/20" />
    </div>
);


export const SERVICE_UI_MAP: Record<string, { icon: any, mockup: any }> = {
    "web-development": {
        icon: Globe,
        mockup: WebDevMockup
    },
    "mobile-app-development": {
        icon: Smartphone,
        mockup: MobileMockup
    },
    "ui-ux-design": {
        icon: Palette,
        mockup: DesignMockup
    },
    "cloud-devops": {
        icon: Cloud,
        mockup: CloudMockup
    },
    // Defaults for others
    "default": {
        icon: Code,
        mockup: WebDevMockup
    }
};
