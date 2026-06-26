import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formattingQueryString = (
  params: Record<string, any> | string
): string => {
  const queryString = Object.entries(params)
    .filter(([, value]) => value != null)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}[]=${encodeURIComponent(v)}`);
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join("&");
  return queryString ? `?${queryString}` : "";
};
