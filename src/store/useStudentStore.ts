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
      students: MOCK_STUDENTS, // seed data (persist middleware sẽ override nếu đã có localStorage)

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
