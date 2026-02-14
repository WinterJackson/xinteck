"use client";

import { createService, updateService } from "@/actions/service";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PageContainer, PageHeader, useToast } from "@/components/admin/ui";
import { serviceSchema } from "@/lib/validations";
import {
    ServiceBuyNowSection,
    ServiceDetailsSection,
    ServiceProcessStep,
    ServiceSection,
    ServiceStat
} from "@/types/service";
import { Service } from "@prisma/client";
import { Image as ImageIcon, Loader2, Plus, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";

type ServiceFormValues = z.infer<typeof serviceSchema>;

// Helper to safely cast JSON to specific types
function safeCast<T>(data: any, fallback: T): T {
    if (!data) return fallback;
    
    if (Array.isArray(fallback)) {
        return Array.isArray(data) ? (data as unknown as T) : fallback;
    }
    
    if (typeof data === 'object' && data !== null) {
        return { ...fallback, ...data } as T;
    }
    
    return fallback;
}

interface ServiceFormProps {
    service?: Service | null;
}

export function ServiceForm({ service }: ServiceFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'main' | 'section1' | null>(null);

    // Initial Values with Safe Casting
    const initialSection1 = safeCast<ServiceSection>(service?.section1, { title: "" });
    const initialSection2 = safeCast<ServiceSection>(service?.section2, { title: "" });
    const initialSection3 = safeCast<ServiceSection>(service?.section3, { title: "" });
    const initialSection4 = safeCast<{ title: string; steps: ServiceProcessStep[] }>(service?.section4, { title: "", steps: [] });
    const initialDetails = safeCast<ServiceDetailsSection>(service?.detailsSection, { title: "", description: "" });
    const initialFreshness = safeCast<ServiceSection>(service?.freshnessSection, { title: "" });
    const initialBuyNow = safeCast<ServiceBuyNowSection>(service?.buyNowSection, { title: "", description: "", button: "" });
    const initialStats = safeCast<ServiceStat[]>(service?.stats, [{ label: "", val: "" }]);
    const initialFeatures = service?.features || [];

    // Core Form State
    const [formData, setFormData] = useState({
        name: service?.name || "",
        subName: service?.subName || "",
        slug: service?.slug || "",
        description: service?.description || "",
        image: (service as any)?.image || "", // Add image field
        themeColor: service?.themeColor || "#B8860B", // Default to Gold
        
        // Flattened JSON Sections
        section1Title: initialSection1.title || "",
        section1Subtitle: initialSection1.subtitle || "",
        section1Image: initialSection1.image || "", 
        
        section2Title: initialSection2.title || "",
        section2Desc: initialSection2.description || "",
        
        section3Title: initialSection3.title || "",
        section3Desc: initialSection3.description || "",
        
        capabilitiesTitle: initialDetails.title || "",
        
        processTitle: initialSection4.title || "",
        
        freshnessTitle: initialFreshness.title || "",
        freshnessDesc: initialFreshness.description || "",
        
        ctaTitle: initialBuyNow.title || "",
        ctaDesc: initialBuyNow.description || "",
        ctaButton: initialBuyNow.button || "",
        version: (service as any)?.version // Cast to any to handle potential stale type definition
    });

    // Dynamic Arrays
    const [features, setFeatures] = useState<string[]>(initialFeatures);
    const [stats, setStats] = useState<ServiceStat[]>(initialStats);
    const [processSteps, setProcessSteps] = useState<ServiceProcessStep[]>(
         initialSection4.steps || [{ title: "", description: "" }]
    );

    async function onSubmit() {
        setError("");
        if (!formData.name || !formData.slug) {
            setError("Service Name and Slug are required.");
            return;
        }

        startTransition(async () => {
            try {
                const payload = {
                    name: formData.name,
                    subName: formData.subName,
                    slug: formData.slug,
                    description: formData.description,
                    image: formData.image, // Include image in payload
                    themeColor: formData.themeColor,
                    version: formData.version, // Pass version

                    features: features.filter(f => f.trim() !== ""),
                    stats: stats.filter(s => s.label && s.val),
                    
                    section1: {
                        title: formData.section1Title,
                        subtitle: formData.section1Subtitle,
                        image: formData.section1Image
                    }, 
                    section2: {
                        title: formData.section2Title,
                        description: formData.section2Desc
                    },
                    section3: {
                        title: formData.section3Title,
                        description: formData.section3Desc
                    },
                    
                    section4: {
                        title: formData.processTitle,
                        steps: processSteps
                    },
                    
                    detailsSection: {
                        title: formData.capabilitiesTitle,
                        description: ""
                    },
                    
                    freshnessSection: {
                        title: formData.freshnessTitle,
                        description: formData.freshnessDesc
                    },
        
                    buyNowSection: {
                        title: formData.ctaTitle,
                        description: formData.ctaDesc,
                        button: formData.ctaButton
                    }
                };

                if (service) {
                    await updateService(service.id, payload);
                    toast("Service updated successfully", "success");
                } else {
                    await createService(payload);
                    toast("Service created successfully", "success");
                }
                router.push("/admin/services");
                router.refresh();
            } catch (error: any) {
                console.error(error);
                const msg = error.message || "Something went wrong";
                
                if (msg.includes("Concurrency conflict")) {
                    if (confirm("This service has been modified by another user. Reload to get the latest version?")) {
                        window.location.reload();
                        return;
                    }
                }

                setError(msg);
                toast(msg, "error");
            }
        });
    }

    // Helper for updating array items
    const updateProcessStep = (index: number, field: keyof ServiceProcessStep, value: string) => {
        const newSteps = [...processSteps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setProcessSteps(newSteps);
    };

    const updateStat = (index: number, field: keyof ServiceStat, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setStats(newStats);
    };

    return (
    <PageContainer>
            
            <MediaPicker 
                isOpen={showMediaPicker} 
                onClose={() => setShowMediaPicker(false)} 
                onSelect={(url) => {
                    if (pickerTarget === 'main') {
                        setFormData({ ...formData, image: url });
                    } else if (pickerTarget === 'section1') {
                         setFormData({ ...formData, section1Image: url });
                    }
                    setShowMediaPicker(false);
                }} 
            />

            {/* Action Bar */}
            <PageHeader 
                title={service ? "Edit Service" : "New Service"}
                backUrl="/admin/services"
                backLabel="Back to Services"
                actions={
                  <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                    <button 
                         onClick={onSubmit}
                         disabled={isPending}
                         className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-black font-bold text-[10px] md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                         {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={12} className="md:w-4 md:h-4" />}
                         Save Service
                    </button>
                  </div>
                }
            />

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[8px] text-sm">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
                
                {/* Main Content Column */}
                <div className="lg:col-span-2 flex flex-col gap-3 md:gap-6 min-w-0">
                     
                     {/* Core Details */}
                     <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md overflow-hidden">

                        <div className="flex flex-col gap-3 md:gap-4">
                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Service Name</label>
                                <input 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Web Development" 
                                    className="bg-white/5 border border-white/10 rounded-[8px] px-3 md:px-4 py-2 md:py-3 text-white text-sm md:text-lg font-bold outline-none focus:border-gold/50 placeholder:font-normal placeholder:text-white/20"
                                />
                            </div>
                            
                            


                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Service Caricature / Image</label>
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="w-full flex gap-2">
                                        <input 
                                            value={formData.image || ""}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                            placeholder="/images/services/..." 
                                            className="flex-1 bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm outline-none focus:border-gold/50 font-mono placeholder:text-white/20"
                                        />
                                        <button 
                                            onClick={() => {
                                                setPickerTarget('main');
                                                setShowMediaPicker(true);
                                            }}
                                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-[8px] transition-colors"
                                            title="Select Image"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                    </div>
                                    {formData.image && (
                                        <div className="relative w-full aspect-square max-w-[300px] rounded-[12px] overflow-hidden border border-white/10 bg-black/50 shadow-xl">
                                            <Image 
                                                src={formData.image} 
                                                alt="Preview" 
                                                fill 
                                                className="object-contain p-2" 
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                                <div className="flex flex-col gap-1 md:gap-2">
                                    <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Sub Name (Tag)</label>
                                    <input 
                                        value={formData.subName}
                                        onChange={(e) => setFormData({...formData, subName: e.target.value})}
                                        placeholder="SERVICE" 
                                        className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50 placeholder:text-white/20"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 md:gap-2">
                                    <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Slug (URL)</label>
                                    <input 
                                        value={formData.slug}
                                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                        placeholder="web-development" 
                                        className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50 font-mono placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">Short Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Brief overview for the card..."
                                    rows={3}
                                    className="bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-4 py-2 md:py-3 text-white text-xs md:text-sm outline-none focus:border-gold/50 resize-y placeholder:text-white/20"
                                />
                            </div>
                        </div>
                     </div>

                     {/* Content Blocks */}
                     <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md overflow-hidden">
                        <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2 mb-3 md:mb-4">
                            Content Sections
                        </h3>
                        
                        <div className="space-y-6">
                            {/* Hero */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block">Hero Section</label>
                                <div className="grid gap-3">
                                    <input 
                                        value={formData.section1Title}
                                        onChange={(e) => setFormData({...formData, section1Title: e.target.value})}
                                        placeholder="Hero Title (e.g. Turn Vision Into Reality)" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                    />
                                    <input 
                                        value={formData.section1Subtitle}
                                        onChange={(e) => setFormData({...formData, section1Subtitle: e.target.value})}
                                        placeholder="Hero Subtitle" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                    />
                                    {/* Image Picker */}
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <div className="flex gap-2">
                                                <input 
                                                    value={formData.section1Image}
                                                    onChange={(e) => setFormData({...formData, section1Image: e.target.value})}
                                                    placeholder="Hero Image URL" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none font-mono"
                                                />
                                                <button 
                                                    onClick={() => {
                                                        setPickerTarget('section1');
                                                        setShowMediaPicker(true);
                                                    }}
                                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-[8px] transition-colors"
                                                    title="Select Image"
                                                >
                                                    <ImageIcon size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        {formData.section1Image && (
                                            <div className="relative w-16 h-16 rounded-[8px] overflow-hidden border border-white/10 shrink-0 bg-black/50">
                                                <Image 
                                                    src={formData.section1Image} 
                                                    alt="Preview" 
                                                    fill 
                                                    className="object-cover" 
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Block 1 */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block">Content Block 1</label>
                                <div className="grid gap-3">
                                    <input 
                                        value={formData.section2Title}
                                        onChange={(e) => setFormData({...formData, section2Title: e.target.value})}
                                        placeholder="Initial Challenge Title" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                    />
                                    <textarea 
                                        value={formData.section2Desc}
                                        onChange={(e) => setFormData({...formData, section2Desc: e.target.value})}
                                        placeholder="Description..." 
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Block 2 */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block">Content Block 2</label>
                                <div className="grid gap-3">
                                    <input 
                                        value={formData.section3Title}
                                        onChange={(e) => setFormData({...formData, section3Title: e.target.value})}
                                        placeholder="Solution/Approach Title" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                    />
                                    <textarea 
                                        value={formData.section3Desc}
                                        onChange={(e) => setFormData({...formData, section3Desc: e.target.value})}
                                        placeholder="Description..." 
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Freshness */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block">Freshness / Innovation</label>
                                <div className="grid gap-3">
                                    <input 
                                        value={formData.freshnessTitle}
                                        onChange={(e) => setFormData({...formData, freshnessTitle: e.target.value})}
                                        placeholder="Title (e.g. Always Cutting Edge)" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                    />
                                    <textarea 
                                        value={formData.freshnessDesc}
                                        onChange={(e) => setFormData({...formData, freshnessDesc: e.target.value})}
                                        placeholder="Innovation description..." 
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none resize-none"
                                    />
                                </div>
                            </div>

                             {/* Capabilities Title */}
                             <div className="space-y-3 pt-4 border-t border-white/10">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block">Capabilities Section Title</label>
                                <input 
                                    value={formData.capabilitiesTitle}
                                    onChange={(e) => setFormData({...formData, capabilitiesTitle: e.target.value})}
                                    placeholder="WHAT WE BUILD." 
                                    className="w-full bg-white/5 border border-white/10 rounded-[8px] px-3 py-2 text-white text-sm focus:border-gold/50 placeholder:text-white/20 outline-none"
                                />
                            </div>
                        </div>
                     </div>
                </div>

                {/* Sidebar Column */}
                <div className="flex flex-col gap-3 md:gap-6 min-w-0">
                    
                    {/* Theme */}
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                        <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">
                            Branding
                        </h3>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <label className="text-[8px] md:text-xs font-bold text-white/60">Theme Color</label>
                            <div className="flex gap-2">
                                <input 
                                    type="color" 
                                    value={formData.themeColor} 
                                    onChange={(e) => setFormData({...formData, themeColor: e.target.value})}
                                    className="h-9 w-12 bg-transparent border border-white/10 rounded-[6px] p-0 cursor-pointer" 
                                />
                                <input 
                                    value={formData.themeColor} 
                                    onChange={(e) => setFormData({...formData, themeColor: e.target.value})}
                                    placeholder="#000000" 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-white text-xs md:text-sm outline-none focus:border-gold/50 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="font-bold text-white text-xs md:text-sm">
                                Features
                            </h3>
                            <button 
                                onClick={() => setFeatures([...features, ""])}
                                className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-[4px] font-bold transition-all flex items-center gap-1"
                            >
                                <Plus size={10} /> Add
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {features.map((feat, i) => (
                                <div key={i} className="flex gap-2">
                                    <input 
                                        value={feat}
                                        onChange={(e) => {
                                            const newF = [...features];
                                            newF[i] = e.target.value;
                                            setFeatures(newF);
                                        }}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-[6px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50"
                                        placeholder="Feature..."
                                    />
                                    <button 
                                        onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                                        className="text-white/20 hover:text-red-400 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {features.length === 0 && <p className="text-white/20 text-[10px] italic">No features added.</p>}
                        </div>
                    </div>

                    {/* Process */}
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                         <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="font-bold text-white text-xs md:text-sm">
                                Process Steps
                            </h3>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                             <input 
                                value={formData.processTitle}
                                onChange={(e) => setFormData({...formData, processTitle: e.target.value})}
                                placeholder="Section Title (HOW WE DELIVER)" 
                                className="w-full bg-white/5 border border-white/10 rounded-[8px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50 text-gold font-bold mb-2"
                            />
                            {processSteps.map((step, i) => (
                                <div key={i} className="bg-white/5 p-2 rounded-[6px] border border-white/5 relative group">
                                     <button 
                                        onClick={() => setProcessSteps(processSteps.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                    <input 
                                        value={step.title}
                                        onChange={(e) => updateProcessStep(i, 'title', e.target.value)}
                                        placeholder="Step Title"
                                        className="w-full bg-transparent border-0 border-b border-white/5 px-0 py-1 text-white font-bold text-xs focus:ring-0 mb-1 focus:border-gold/50 placeholder:text-white/20"
                                    />
                                     <textarea 
                                        value={step.description}
                                        onChange={(e) => updateProcessStep(i, 'description', e.target.value)}
                                        placeholder="Description..."
                                        rows={2}
                                        className="w-full bg-transparent border-0 px-0 py-0 text-white/60 text-[10px] focus:ring-0 resize-none placeholder:text-white/10"
                                    />
                                </div>
                            ))}
                             <button 
                                onClick={() => setProcessSteps([...processSteps, { title: "", description: "" }])}
                                className="text-[10px] bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-2 py-1.5 rounded-[4px] font-bold transition-all w-full text-center"
                            >
                                + Add Process Step
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="font-bold text-white text-xs md:text-sm">
                                Key Stats
                            </h3>
                            <button 
                                onClick={() => setStats([...stats, { label: "", val: "" }])}
                                className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-[4px] font-bold transition-all flex items-center gap-1"
                            >
                                <Plus size={10} /> Add
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                             {stats.map((stat, i) => (
                                <div key={i} className="flex gap-2">
                                    <input 
                                        value={stat.val}
                                        onChange={(e) => updateStat(i, 'val', e.target.value)}
                                        className="w-16 bg-white/5 border border-white/10 rounded-[6px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50 font-mono text-center"
                                        placeholder="Value"
                                    />
                                     <input 
                                        value={stat.label}
                                        onChange={(e) => updateStat(i, 'label', e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-[6px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50"
                                        placeholder="Label"
                                    />
                                    <button 
                                        onClick={() => setStats(stats.filter((_, idx) => idx !== i))}
                                        className="text-white/20 hover:text-red-400 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                             ))}
                              {stats.length === 0 && <p className="text-white/20 text-[10px] italic">No stats added.</p>}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-6 backdrop-blur-md flex flex-col gap-3 md:gap-4">
                        <h3 className="font-bold text-white text-xs md:text-sm border-b border-white/10 pb-2">
                             Call To Action
                        </h3>
                         <div className="flex flex-col gap-2">
                            <input 
                                value={formData.ctaTitle}
                                onChange={(e) => setFormData({...formData, ctaTitle: e.target.value})}
                                placeholder="Title (READY?)" 
                                className="w-full bg-white/5 border border-white/10 rounded-[8px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50 placeholder:text-white/20"
                            />
                            <input 
                                value={formData.ctaDesc}
                                onChange={(e) => setFormData({...formData, ctaDesc: e.target.value})}
                                placeholder="Description" 
                                className="w-full bg-white/5 border border-white/10 rounded-[8px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50 placeholder:text-white/20"
                            />
                            <input 
                                value={formData.ctaButton}
                                onChange={(e) => setFormData({...formData, ctaButton: e.target.value})}
                                placeholder="Button Label" 
                                className="w-full bg-white/5 border border-white/10 rounded-[8px] px-2 py-1.5 text-white text-xs outline-none focus:border-gold/50 placeholder:text-white/20"
                            />
                        </div>
                    </div>

                </div>
            </div>
    </PageContainer>
    );
}
