// =============================================
// Domain Types — SASUCO Management System
// =============================================

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
