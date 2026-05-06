import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Hàm cn (className) giúp gộp class thông minh, loại bỏ các class Tailwind trùng lặp
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}