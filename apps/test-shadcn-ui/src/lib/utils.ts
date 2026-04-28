import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function combining clsx and tailwind-merge
 * This is the standard shadcn/ui pattern
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
