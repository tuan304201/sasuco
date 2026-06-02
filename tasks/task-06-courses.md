# Task 06 — Quản Lý Khoá Học (Nghiệp Vụ 2)

## Goal
Xây dựng màn hình CRUD khoá học. Phân biệt rõ khoá đang mở/đóng, hiển thị capacity, ngăn cascade khi xoá.

## Phụ Thuộc
- Task 02 (stores), Task 03 (layout), Task 05 (ConfirmDialog, SearchInput đã có) hoàn thành

---

## Checklist

### Bước 1: Thêm course schema vào `src/lib/schemas.ts`

```typescript
export const courseSchema = z.object({
  name:        z.string().min(3, 'Tên khoá học phải có ít nhất 3 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  maxCapacity: z.coerce.number().int().min(1, 'Sĩ số tối thiểu là 1'),
  status:      z.enum(['open', 'closed']),
  startDate:   z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate:     z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
}).refine(d => d.endDate >= d.startDate, {
  message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
  path: ['endDate'],
});

export type CourseSchema = z.infer<typeof courseSchema>;
```

- [ ] Verify: `refine` validate ngày đúng

### Bước 2: Tạo `src/components/common/StatusBadge.tsx`

```tsx
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/types';

interface StatusBadgeProps {
  status: Course['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return status === 'open' ? (
    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
      Đang mở
    </Badge>
  ) : (
    <Badge variant="secondary">Đã đóng</Badge>
  );
}
```

- [ ] Verify: 2 trạng thái render màu đúng

### Bước 3: Tạo `src/components/common/CapacityBar.tsx`

```tsx
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CapacityBarProps {
  enrolled: number;
  max: number;
}

export function CapacityBar({ enrolled, max }: CapacityBarProps) {
  const pct = max === 0 ? 0 : Math.round((enrolled / max) * 100);
  return (
    <div className="space-y-1 min-w-[100px]">
      <Progress
        value={pct}
        className={cn('h-2', pct >= 100 && '[&>div]:bg-red-500')}
      />
      <p className="text-xs text-muted-foreground text-right">
        {enrolled}/{max} chỗ
      </p>
    </div>
  );
}
```

- [ ] Verify: khi đầy (100%) progress bar đổi đỏ

### Bước 4: Tạo `src/components/courses/CourseFormDialog.tsx`

Dùng shadcn `Dialog` + `Form` + Zod `courseSchema`:
- Mode: add (không có `course` prop) hoặc edit (`course` prop)
- Fields: Tên / Mô tả (textarea) / Sĩ số / Trạng thái (Select: Đang mở / Đã đóng) / Ngày bắt đầu / Ngày kết thúc
- Submit: gọi `addCourse` hoặc `updateCourse` + toast
- Đóng dialog sau submit thành công

- [ ] Verify: form validation đúng, refine ngày hoạt động

### Bước 5: Implement `src/pages/CoursesPage.tsx`

Layout:
```
[Page Header: "Quản Lý Khoá Học" | Button "Thêm Khoá Học"]
[Table: Tên | Mô tả | Sĩ số | Đã ĐK | Trống | Trạng thái | Khai giảng | Bế giảng | Hành động]
```

Computed data per row:
```typescript
const enrolledCount = useEnrollmentStore.getState().getEnrolledCount(course.id);
const availableSlots = course.maxCapacity - enrolledCount;
```

Row actions:
1. **Sửa** → mở `CourseFormDialog` với data hiện tại
2. **Đóng/Mở** → gọi `toggleCourseStatus(id)` + toast  
3. **Xoá** → mở ConfirmDialog:
   - Description: `"Khoá học [tên] có [N] học viên đang đăng ký. Tất cả lượt đăng ký sẽ bị huỷ."`
   - Confirm → `deleteCourse(id)` + `deleteByCourseId(id)` + toast

Badge Đầy / Còn X chỗ: hiển thị inline bên cạnh CapacityBar.

- [ ] Verify: xoá khoá → enrollment của khoá đó biến khỏi trang Đăng Ký
- [ ] Verify: toggle status → badge cập nhật ngay, enrollment cũ không bị xoá

---

## Done When
- [ ] CRUD khoá học đầy đủ hoạt động
- [ ] StatusBadge + CapacityBar hiển thị đúng
- [ ] Toggle open/closed hoạt động đúng (BR-06)
- [ ] Xoá cascade + cảnh báo đúng (BR-05)
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-07-enrollments.md**
