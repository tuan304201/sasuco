import { z } from 'zod';

export const studentSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone:    z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ (9-11 số)'),
  email:    z.string().email('Email không hợp lệ'),
  address:  z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  idCard:   z.string().regex(/^[0-9]{9}$|^[0-9]{12}$/, 'CCCD phải có 9 hoặc 12 chữ số'),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const courseBaseSchema = z.object({
  name:        z.string().min(3, 'Tên khoá học phải có ít nhất 3 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  maxCapacity: z.coerce.number().int().min(1, 'Sĩ số tối thiểu là 1'),
  status:      z.enum(['open', 'closed']),
  startDate:   z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate:     z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
});

export const courseSchema = courseBaseSchema.refine((d) => d.endDate >= d.startDate, {
  message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
  path: ['endDate'],
});

export type CourseSchema = z.infer<typeof courseBaseSchema>;

