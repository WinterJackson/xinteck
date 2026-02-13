import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";

interface StatusCardProps {
    title: string;
    isConfigured: boolean;
    envKey: string;
    description: string;
    docsLink?: string;
    docsLabel?: string;
}

export function StatusCard({ title, isConfigured, envKey, description, docsLink, docsLabel }: StatusCardProps) {
    return (
        <div className={`relative overflow-hidden rounded-[12px] border backdrop-blur-md p-4 transition-all shadow-sm ${
            isConfigured 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-red-500/10 border-red-500/20"
        }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className={`mt-0.5 rounded-full p-1 ${
                        isConfigured ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                    }`}>
                        {isConfigured ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex flex-col gap-1">
                         <h3 className={`font-bold text-sm ${isConfigured ? "text-white" : "text-red-200"}`}>
                            {title}
                         </h3>
                         <code className="text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded text-white/40 w-fit">
                            {envKey}
                         </code>
                         <p className="text-xs text-white/50 leading-relaxed max-w-md mt-1">
                            {description}
                         </p>
                    </div>
                </div>

                {docsLink && (
                    <a 
                        href={docsLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-gold transition-colors shrink-0 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 px-2 py-1 rounded-md"
                    >
                        <span>{docsLabel || "Docs"}</span>
                        <ExternalLink size={10} />
                    </a>
                )}
            </div>
            
            {!isConfigured && (
                <div className="mt-3 pl-[38px]">
                    <p className="text-[10px] text-red-400 font-medium flex items-center gap-1">
                        Currently missing from environment variables.
                    </p>
                </div>
            )}
        </div>
    );
}
