import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-gold text-black font-bold hover:bg-white dark:hover:bg-white",
        secondary: "bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 font-bold",
        destructive: "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold",
        ghost: "text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10",
        outline: "border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 font-bold",
        glass: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
      },
      size: {
        sm: "px-2.5 py-1 text-[10px] md:text-xs rounded-md gap-1",
        md: "px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg gap-1.5",
        lg: "px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-xl gap-2",
        icon: "h-9 w-9 rounded-md", 
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant, size, loading, icon, children, className, disabled, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
});

export { Button, buttonVariants };
