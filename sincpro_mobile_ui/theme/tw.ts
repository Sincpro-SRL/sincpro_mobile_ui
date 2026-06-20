import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes with proper precedence.
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export tailwind-variants for component variants
export { tv, type VariantProps } from "tailwind-variants";
