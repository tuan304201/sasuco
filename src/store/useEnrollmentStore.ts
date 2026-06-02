import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enrollment, EnrollmentResult } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/storage';
import { MOCK_ENROLLMENTS } from '@/lib/mockData';
import { useCourseStore } from './useCourseStore';

interface EnrollmentStore {
  enrollments: Enrollment[];

  // Đăng ký: trả về result (success | failure + lý do)
  enrollStudent: (studentId: string, courseId: string) => EnrollmentResult;

  // Huỷ đăng ký theo enrollmentId
  cancelEnrollment: (enrollmentId: string) => void;

  // Cascade delete khi xoá học viên
  deleteByStudentId: (studentId: string) => void;

  // Cascade delete khi xoá khoá học
  deleteByCourseId: (courseId: string) => void;

  // Selectors
  getEnrollmentsByStudent: (studentId: string) => Enrollment[];
  getEnrollmentsByCourse: (courseId: string) => Enrollment[];
  getEnrolledCount: (courseId: string) => number;
  isStudentEnrolled: (studentId: string, courseId: string) => boolean;
}

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set, get) => ({
      enrollments: MOCK_ENROLLMENTS,

      enrollStudent: (studentId, courseId) => {
        const { enrollments } = get();
        const course = useCourseStore.getState().getCourseById(courseId);

        // BR-01: Khoá học phải đang mở
        if (!course || course.status === 'closed') {
          return { success: false, error: 'COURSE_CLOSED' };
        }

        // BR-03: Không đăng ký trùng
        const alreadyEnrolled = enrollments.some(
          (e) => e.studentId === studentId && e.courseId === courseId
        );
        if (alreadyEnrolled) {
          return { success: false, error: 'ALREADY_ENROLLED' };
        }

        // BR-02: Còn chỗ trống
        const enrolledCount = enrollments.filter(
          (e) => e.courseId === courseId
        ).length;
        if (enrolledCount >= course.maxCapacity) {
          return { success: false, error: 'COURSE_FULL' };
        }

        // Tất cả rules pass → tạo enrollment
        const enrollment: Enrollment = {
          id: generateId(),
          studentId,
          courseId,
          enrolledAt: nowISO(),
        };
        set((state) => ({
          enrollments: [...state.enrollments, enrollment],
        }));
        return { success: true, enrollment };
      },

      cancelEnrollment: (enrollmentId) =>
        set((state) => ({
          enrollments: state.enrollments.filter((e) => e.id !== enrollmentId),
        })),

      // BR-04: Cascade khi xoá học viên
      deleteByStudentId: (studentId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => e.studentId !== studentId
          ),
        })),

      // BR-05: Cascade khi xoá khoá học
      deleteByCourseId: (courseId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => e.courseId !== courseId
          ),
        })),

      getEnrollmentsByStudent: (studentId) =>
        get().enrollments.filter((e) => e.studentId === studentId),

      getEnrollmentsByCourse: (courseId) =>
        get().enrollments.filter((e) => e.courseId === courseId),

      getEnrolledCount: (courseId) =>
        get().enrollments.filter((e) => e.courseId === courseId).length,

      isStudentEnrolled: (studentId, courseId) =>
        get().enrollments.some(
          (e) => e.studentId === studentId && e.courseId === courseId
        ),
    }),
    { name: STORAGE_KEYS.ENROLLMENTS }
  )
);
