# Task 01 — Types, Utils & Mock Data

## Goal
Định nghĩa toàn bộ domain types, helper functions, storage constants và seed data ban đầu. Đây là nền tảng cho tất cả các task sau.

## Phụ Thuộc
- Task 00 hoàn thành (project đã khởi tạo)

---

## Checklist

### Bước 1: Tạo `src/types/index.ts`

Định nghĩa tất cả interfaces/types cho domain:

```typescript
// Học viên
export interface Student {
  id: string;
  fullName: string;   // Họ và tên
  phone: string;      // Số điện thoại
  email: string;      // Email
  address: string;    // Địa chỉ
  idCard: string;     // Số CCCD (9 hoặc 12 số)
  createdAt: string;  // ISO date string
}

// Khoá học
export interface Course {
  id: string;
  name: string;
  description: string;
  maxCapacity: number;          // Sĩ số tối đa, >= 1
  status: 'open' | 'closed';
  startDate: string;            // ISO date string
  endDate: string;              // ISO date string
  createdAt: string;
}

// Lượt đăng ký
export interface Enrollment {
  id: string;
  studentId: string;  // FK → Student.id
  courseId: string;   // FK → Course.id
  enrolledAt: string; // ISO date string
}

// --- Computed types (không lưu vào store) ---

export interface CourseWithStats extends Course {
  enrolledCount: number;
  availableSlots: number;
  isFull: boolean;
}

export interface EnrollmentWithDetails extends Enrollment {
  student: Student;
  course: Course;
}

// --- Form types ---

export type StudentFormData = Omit<Student, 'id' | 'createdAt'>;
export type CourseFormData = Omit<Course, 'id' | 'createdAt'>;

// --- Business rule result ---

export type EnrollmentError =
  | 'ALREADY_ENROLLED'
  | 'COURSE_CLOSED'
  | 'COURSE_FULL';

export type EnrollmentResult =
  | { success: true; enrollment: Enrollment }
  | { success: false; error: EnrollmentError };
```

- [ ] Verify: không có TypeScript lỗi, `npx tsc --noEmit` pass

### Bước 2: Tạo `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn utility (đã có nếu shadcn init tạo, bổ sung thêm)
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
```

- [ ] Verify: `generateId()` trả về string 8 ký tự, `formatDate()` ra đúng định dạng VN

### Bước 3: Tạo `src/lib/storage.ts`

```typescript
// Centralised localStorage key constants
// Dùng chung giữa Zustand persist và mock data initializer

export const STORAGE_KEYS = {
  STUDENTS: 'sasuco_students',
  COURSES: 'sasuco_courses',
  ENROLLMENTS: 'sasuco_enrollments',
  INITIALIZED: 'sasuco_initialized', // flag để biết đã seed chưa
} as const;
```

- [ ] Verify: export đúng, không có lỗi

### Bước 4: Tạo `src/lib/mockData.ts`

Dữ liệu mẫu ban đầu (5 học viên, 3 khoá học, 6 lượt đăng ký):

```typescript
import type { Student, Course, Enrollment } from '@/types';
import { generateId } from '@/lib/utils';

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stu-001',
    fullName: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'an.nguyen@email.com',
    address: '12 Nguyễn Trãi, Q1, TP.HCM',
    idCard: '079201234567',
    createdAt: '2024-01-10T07:00:00.000Z',
  },
  {
    id: 'stu-002',
    fullName: 'Trần Thị Bình',
    phone: '0912345678',
    email: 'binh.tran@email.com',
    address: '45 Lê Lợi, Q3, TP.HCM',
    idCard: '079205678901',
    createdAt: '2024-01-12T07:00:00.000Z',
  },
  {
    id: 'stu-003',
    fullName: 'Lê Văn Cường',
    phone: '0923456789',
    email: 'cuong.le@email.com',
    address: '78 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM',
    idCard: '079209012345',
    createdAt: '2024-01-15T07:00:00.000Z',
  },
  {
    id: 'stu-004',
    fullName: 'Phạm Thị Dung',
    phone: '0934567890',
    email: 'dung.pham@email.com',
    address: '23 Võ Văn Tần, Q3, TP.HCM',
    idCard: '079202345678',
    createdAt: '2024-01-18T07:00:00.000Z',
  },
  {
    id: 'stu-005',
    fullName: 'Hoàng Văn Em',
    phone: '0945678901',
    email: 'em.hoang@email.com',
    address: '56 Cách Mạng Tháng 8, Q10, TP.HCM',
    idCard: '079206789012',
    createdAt: '2024-01-20T07:00:00.000Z',
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs-001',
    name: 'May Công Nghiệp',
    description: 'Đào tạo kỹ thuật may công nghiệp: vận hành máy may, cắt may cơ bản đến nâng cao.',
    maxCapacity: 20,
    status: 'open',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    createdAt: '2024-01-05T07:00:00.000Z',
  },
  {
    id: 'crs-002',
    name: 'Điện Dân Dụng',
    description: 'Đào tạo lắp đặt, sửa chữa điện dân dụng trong gia đình và tòa nhà.',
    maxCapacity: 15,
    status: 'open',
    startDate: '2024-02-15',
    endDate: '2024-06-15',
    createdAt: '2024-01-05T07:00:00.000Z',
  },
  {
    id: 'crs-003',
    name: 'Tin Học Văn Phòng',
    description: 'Đào tạo Word, Excel, PowerPoint cơ bản đến nâng cao cho nhân viên văn phòng.',
    maxCapacity: 25,
    status: 'closed',
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    createdAt: '2023-08-01T07:00:00.000Z',
  },
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: 'enr-001', studentId: 'stu-001', courseId: 'crs-001', enrolledAt: '2024-01-25T08:00:00.000Z' },
  { id: 'enr-002', studentId: 'stu-002', courseId: 'crs-002', enrolledAt: '2024-01-26T08:00:00.000Z' },
  { id: 'enr-003', studentId: 'stu-003', courseId: 'crs-001', enrolledAt: '2024-01-27T08:00:00.000Z' },
  { id: 'enr-004', studentId: 'stu-003', courseId: 'crs-002', enrolledAt: '2024-01-27T09:00:00.000Z' },
  { id: 'enr-005', studentId: 'stu-004', courseId: 'crs-002', enrolledAt: '2024-01-28T08:00:00.000Z' },
  { id: 'enr-006', studentId: 'stu-001', courseId: 'crs-003', enrolledAt: '2023-08-25T08:00:00.000Z' },
];
```

- [ ] Verify: đúng kiểu dữ liệu, không có TypeScript lỗi
- [ ] Verify: không có enrollment nào trùng `(studentId, courseId)`

---

## Done When
- [ ] `src/types/index.ts` — đầy đủ interfaces, không lỗi
- [ ] `src/lib/utils.ts` — các helper functions hoạt động
- [ ] `src/lib/storage.ts` — STORAGE_KEYS constants
- [ ] `src/lib/mockData.ts` — seed data hợp lệ
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-02-stores.md**
