# Task 02 — Zustand Stores & Business Rules

## Goal
Xây dựng 3 Zustand stores với `persist` middleware để tự động sync localStorage. Toàn bộ business rules được validate tại store layer, tách biệt khỏi UI.

## Phụ Thuộc
- Task 01 hoàn thành (types, utils, storage keys, mock data đã có)

---

## Checklist

### Bước 1: Tạo `src/store/useStudentStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student, StudentFormData } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/storage';
import { MOCK_STUDENTS } from '@/lib/mockData';

interface StudentStore {
  students: Student[];
  addStudent: (data: StudentFormData) => void;
  updateStudent: (id: string, data: StudentFormData) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  searchStudents: (query: string) => Student[];
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: MOCK_STUDENTS,  // seed data (persist middleware sẽ override nếu đã có localStorage)

      addStudent: (data) =>
        set((state) => ({
          students: [
            ...state.students,
            { ...data, id: generateId(), createdAt: nowISO() },
          ],
        })),

      updateStudent: (id, data) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      getStudentById: (id) => get().students.find((s) => s.id === id),

      searchStudents: (query) => {
        const q = query.toLowerCase().trim();
        if (!q) return get().students;
        return get().students.filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.phone.includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.idCard.includes(q)
        );
      },
    }),
    { name: STORAGE_KEYS.STUDENTS }
  )
);
```

- [ ] Verify: store khởi tạo được, persist key đúng

### Bước 2: Tạo `src/store/useCourseStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, CourseFormData } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/storage';
import { MOCK_COURSES } from '@/lib/mockData';

interface CourseStore {
  courses: Course[];
  addCourse: (data: CourseFormData) => void;
  updateCourse: (id: string, data: CourseFormData) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: MOCK_COURSES,

      addCourse: (data) =>
        set((state) => ({
          courses: [
            ...state.courses,
            { ...data, id: generateId(), createdAt: nowISO() },
          ],
        })),

      updateCourse: (id, data) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
        })),

      toggleCourseStatus: (id) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id
              ? { ...c, status: c.status === 'open' ? 'closed' : 'open' }
              : c
          ),
        })),

      getCourseById: (id) => get().courses.find((c) => c.id === id),
    }),
    { name: STORAGE_KEYS.COURSES }
  )
);
```

- [ ] Verify: `toggleCourseStatus` đổi 'open' ↔ 'closed' đúng

### Bước 3: Tạo `src/store/useEnrollmentStore.ts`

> ⚠️ Store này chứa toàn bộ business rules (BR-01..06)

```typescript
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
```

- [ ] Verify: Gọi `enrollStudent` với khoá closed → `{ success: false, error: 'COURSE_CLOSED' }`
- [ ] Verify: Gọi `enrollStudent` 2 lần cùng `(studentId, courseId)` → lần 2 trả `ALREADY_ENROLLED`
- [ ] Verify: Gọi `deleteByStudentId` → tất cả enrollment của student đó biến mất

### Bước 4: Tạo `src/store/index.ts` (re-export barrel)

```typescript
export { useStudentStore } from './useStudentStore';
export { useCourseStore } from './useCourseStore';
export { useEnrollmentStore } from './useEnrollmentStore';
```

- [ ] Verify: import từ `@/store` hoạt động

---

## Business Rules Summary

| Rule | Store | Điều kiện | Error code |
|------|-------|-----------|------------|
| BR-01 | EnrollmentStore | `course.status === 'open'` | `COURSE_CLOSED` |
| BR-02 | EnrollmentStore | `enrolledCount < maxCapacity` | `COURSE_FULL` |
| BR-03 | EnrollmentStore | `(studentId, courseId)` unique | `ALREADY_ENROLLED` |
| BR-04 | EnrollmentStore | xoá student → xoá enrollments | cascade |
| BR-05 | EnrollmentStore | xoá course → xoá enrollments | cascade |
| BR-06 | CourseStore | đóng course → không chặn enrollments cũ | toggle status only |

---

## Done When
- [ ] 3 stores tạo thành công, không có TypeScript errors
- [ ] Persist middleware dùng đúng `STORAGE_KEYS`
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-03-layout.md**
