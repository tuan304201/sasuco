# Task 05 — Quản Lý Học Viên (Nghiệp Vụ 1)

## Goal
Xây dựng màn hình CRUD học viên với real-time search, form thêm/sửa có validation Zod, xoá cascade với cảnh báo.

## Phụ Thuộc
- Task 02 (stores), Task 03 (layout) hoàn thành

---

## Checklist

### Bước 1: Tạo `src/lib/schemas.ts` — Zod schemas

```typescript
import { z } from 'zod';

export const studentSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone:    z.string().regex(/^[0-9]{9,11}$/, 'Số điện thoại không hợp lệ (9-11 số)'),
  email:    z.string().email('Email không hợp lệ'),
  address:  z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  idCard:   z.string().regex(/^[0-9]{9}$|^[0-9]{12}$/, 'CCCD phải có 9 hoặc 12 chữ số'),
});

export type StudentSchema = z.infer<typeof studentSchema>;
```

- [ ] Verify: schema đúng, `z.infer` ra đúng type

### Bước 2: Tạo `src/components/common/SearchInput.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({ placeholder = 'Tìm kiếm...', onSearch, debounceMs = 300 }: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
```

- [ ] Verify: debounce 300ms — không gọi `onSearch` liên tục khi gõ nhanh

### Bước 3: Tạo `src/components/students/StudentFormDialog.tsx`

Dùng shadcn `Dialog` + `Form` (react-hook-form) + Zod resolver:
- Mode: **add** (không có `student` prop) hoặc **edit** (`student` prop)
- Fields: Họ tên / SĐT / Email / Địa chỉ / CCCD
- Submit: gọi `addStudent` hoặc `updateStudent` từ store
- Sau submit thành công: đóng dialog + toast "Đã lưu học viên"
- Validation lỗi hiển thị ngay dưới từng field

Cài thêm nếu chưa có:
```bash
npm install react-hook-form @hookform/resolvers
```

- [ ] Verify: form mở/đóng đúng, validate đúng, submit đúng store action

### Bước 4: Tạo `src/components/common/ConfirmDialog.tsx`

Component tái dùng cho tất cả confirm actions:

```tsx
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;        // HTML string với cảnh báo cascade
  onConfirm: () => void;
  confirmLabel?: string;      // mặc định "Xác nhận"
  variant?: 'default' | 'destructive';
}
```

- [ ] Verify: dialog hiển thị `description` đúng, click Xác nhận → gọi `onConfirm`

### Bước 5: Implement `src/pages/StudentsPage.tsx`

Layout:
```
[Page Header: "Quản Lý Học Viên" | Button "Thêm Học Viên"]
[SearchInput                                               ]
[Table: Họ tên | SĐT | Email | Địa chỉ | CCCD | Khoá học | Hành động]
[EmptyState nếu không có data / không có kết quả search   ]
```

Logic:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [dialogOpen, setDialogOpen] = useState(false);
const [editingStudent, setEditingStudent] = useState<Student | null>(null);
const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

// Dùng store selector
const filteredStudents = useStudentStore(s => s.searchStudents(searchQuery));
const enrollmentCount = (id: string) => useEnrollmentStore.getState().getEnrollmentsByStudent(id).length;
```

Xoá học viên:
- Click Xoá → mở ConfirmDialog
- Description: `"Học viên [tên] đang đăng ký [N] khoá học. Tất cả lượt đăng ký cũng sẽ bị xoá."`
- Confirm → `deleteStudent(id)` + `deleteByStudentId(id)` + toast "Đã xoá học viên"

Cột "Khoá học" trong bảng: hiển thị số lượng khoá đang đăng ký.

- [ ] Verify: search realtime không cần submit
- [ ] Verify: xoá student → enrollments biến khỏi trang Đăng Ký, dashboard cập nhật
- [ ] Verify: empty state hiển thị khi search không có kết quả

---

## Done When
- [ ] CRUD học viên đầy đủ hoạt động
- [ ] Search debounce 300ms hoạt động
- [ ] Xoá cascade đúng + cảnh báo rõ ràng
- [ ] Form validation Zod đúng tất cả fields
- [ ] Toast notifications hiển thị sau mỗi action
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-06-courses.md**
