import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/*
Purpose: Utility to merge Tailwind classes conditionally.
Decision: Using clsx + tailwind-merge is the standard for handling dynamic class names without conflict.
*/
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
