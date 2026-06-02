import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tạo ID ngẫu nhiên dạng 8 ký tự
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Format ISO date → DD/MM/YYYY
export function formatDate(isoString: string): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN');
}

// Lấy ISO date string hiện tại
export function nowISO(): string {
  return new Date().toISOString();
}

// Tính tỷ lệ phần trăm, làm tròn 1 chữ số thập phân
export function calcPercent(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

// Error message map cho business rule violations
export const ENROLLMENT_ERROR_MESSAGES: Record<string, string> = {
  ALREADY_ENROLLED: 'Học viên đã đăng ký khoá học này rồi',
  COURSE_CLOSED: 'Khoá học đã đóng, không thể đăng ký mới',
  COURSE_FULL: 'Khoá học đã đầy, không còn chỗ trống',
};
