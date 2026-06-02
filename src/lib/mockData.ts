import type { Student, Course, Enrollment } from '@/types';

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
