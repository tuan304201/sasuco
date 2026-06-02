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
