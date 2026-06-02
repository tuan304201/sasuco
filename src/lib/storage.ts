// Centralised localStorage key constants
// Dùng chung giữa Zustand persist và mock data initializer

export const STORAGE_KEYS = {
  STUDENTS: 'sasuco_students',
  COURSES: 'sasuco_courses',
  ENROLLMENTS: 'sasuco_enrollments',
  INITIALIZED: 'sasuco_initialized', // flag để biết đã seed chưa
} as const;
