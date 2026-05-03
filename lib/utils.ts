import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(path: string | null | undefined) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  // Clean the path
  let cleanPath = path;
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

  // If the path doesn't already start with media/, add it
  if (!cleanPath.startsWith('media/')) {
    cleanPath = `media/${cleanPath}`;
  }
  
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '');
  return `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${cleanPath}`;
}
