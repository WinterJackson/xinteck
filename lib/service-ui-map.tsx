import { motion } from "framer-motion";
import {
    Cloud,
    Code,
    Globe,
    Palette,
    Smartphone
} from "lucide-react";
import Image from "next/image";

interface MockupProps {
    imageSrc?: string | null;
}

// Mockups placeholders
const WebDevMockup = ({ imageSrc }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt="Web Development" 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Globe size={120} className="text-primary/20" />
         )}
    </div>
);

const MobileMockup = ({ imageSrc }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt="Mobile App Development" 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Smartphone size={120} className="text-primary/20" />
         )}
    </div>
);

const CustomSoftwareMockup = ({ imageSrc }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt="Custom Software" 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Code size={120} className="text-primary/20" />
         )}
    </div>
);

const DesignMockup = ({ imageSrc }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt="UI/UX Design" 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Palette size={120} className="text-primary/20" />
         )}
    </div>
);

const CloudMockup = ({ imageSrc }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt="Cloud & DevOps" 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Cloud size={120} className="text-primary/20" />
         )}
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
    "custom-software-development": {
        icon: Code,
        mockup: CustomSoftwareMockup
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
