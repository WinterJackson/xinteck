import { HTMLAttributes, ReactNode } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string; // Allow minor overrides if absolutely necessary, but default should be used
}

export function PageContainer({ children, className = "", ...props }: PageContainerProps) {
  return (
    <div 
        className={`flex flex-col gap-4 md:gap-8 w-full max-w-[1600px] mx-auto min-w-0 ${className}`}
        {...props}
    >
      {children}
    </div>
  );
}
