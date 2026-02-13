import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, icon, error, className = "", ...props },
    ref
) {
    return (
        <div className="flex flex-col gap-1 md:gap-2">
            {label && (
                <label className="text-[8px] md:text-xs font-bold text-white/60 uppercase">{label}</label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/30">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-black/5 dark:bg-white/5 border rounded-[10px] px-3 md:px-4 py-2 md:py-3 text-gray-900 dark:text-white text-xs md:text-sm outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-white/30 ${
                        icon ? "pl-9" : ""
                    } ${
                        error ? "border-red-500/50 focus:border-red-500" : "border-black/5 dark:border-white/10 focus:border-gold/50"
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-[10px] text-red-400">{error}</span>}
        </div>
    );
});
