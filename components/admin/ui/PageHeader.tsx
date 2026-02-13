import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backUrl?: string;
  backLabel?: string;
}

export function PageHeader({ title, subtitle, actions, backUrl, backLabel }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-8 shrink-0">
      <div className="flex flex-col gap-1">
        {backUrl && (
             <Link href={backUrl} className="flex items-center gap-1 md:gap-2 text-white/60 hover:text-white transition-colors text-[10px] md:text-sm font-bold mb-1 w-fit">
                 <ArrowLeft size={12} className="md:w-4 md:h-4" />
                 {backLabel || "Back"}
             </Link>
        )}
        <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && (
            <p className="text-white/60 text-[10px] md:text-sm leading-tight">{subtitle}</p>
        )}
      </div>
      {actions && (
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
              {actions}
          </div>
      )}
    </div>
  );
}
