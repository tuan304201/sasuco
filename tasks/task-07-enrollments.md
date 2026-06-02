# Task 07 — Đăng Ký & Huỷ Đăng Ký (Nghiệp Vụ 3)

## Goal
Xây dựng màn hình quản lý lượt đăng ký. Nhân viên đăng ký học viên vào khoá học với đầy đủ business rule validation, có filter và huỷ đăng ký.

## Phụ Thuộc
- Task 02 (stores + business rules), Task 05 (ConfirmDialog), Task 06 (StatusBadge) hoàn thành

---

## Checklist

### Bước 1: Tạo `src/components/enrollments/EnrollmentFormDialog.tsx`

Dialog "Đăng ký học viên vào khoá học":

**Fields:**
- **Chọn học viên**: `<Select>` searchable — hiển thị `fullName (SĐT)`, giá trị là `studentId`
- **Chọn khoá học**: `<Select>` — **chỉ hiển thị khoá `open` VÀ còn chỗ trống**

**Logic submit:**
```typescript
const result = useEnrollmentStore.getState().enrollStudent(studentId, courseId);
if (result.success) {
  toast.success('Đăng ký thành công');
  onOpenChange(false);
} else {
  toast.error(ENROLLMENT_ERROR_MESSAGES[result.error]);
  // Không đóng dialog để nhân viên chọn lại
}
```

**Lọc khoá học trong dropdown:**
```typescript
const availableCourses = courses.filter(c => {
  if (c.status === 'closed') return false;
  const enrolled = getEnrolledCount(c.id);
  return enrolled < c.maxCapacity;
});
```

> **Lưu ý:** Dropdown khoá học hiển thị thêm: `(còn X chỗ)` bên cạnh tên.

- [ ] Verify: chỉ khoá open + còn chỗ mới xuất hiện trong dropdown
- [ ] Verify: đăng ký trùng → toast error không đóng dialog
- [ ] Verify: đăng ký thành công → dialog đóng + bảng cập nhật

### Bước 2: Implement `src/pages/EnrollmentsPage.tsx`

**Layout:**
```
[Page Header: "Quản Lý Đăng Ký" | Button "Đăng Ký Học Viên"]
[Filter: Select "Tất cả học viên" | Select "Tất cả khoá học"    ]
[Table: Học viên | SĐT | Khoá học | Trạng thái khoá | Ngày ĐK | Hành động]
```

**State:**
```typescript
const [filterStudentId, setFilterStudentId] = useState<string>('');
const [filterCourseId, setFilterCourseId] = useState<string>('');
const [dialogOpen, setDialogOpen] = useState(false);
const [cancelingId, setCancelingId] = useState<string | null>(null);
```

**Computed data — join enrollments với students và courses:**
```typescript
const displayedEnrollments = useMemo(() => {
  return enrollments
    .filter(e => {
      if (filterStudentId && e.studentId !== filterStudentId) return false;
      if (filterCourseId && e.courseId !== filterCourseId) return false;
      return true;
    })
    .map(e => ({
      ...e,
      student: getStudentById(e.studentId),
      course: getCourseById(e.courseId),
    }))
    .filter(e => e.student && e.course); // lọc orphan data (phòng ngừa)
}, [enrollments, filterStudentId, filterCourseId]);
```

**Huỷ đăng ký:**
- Click Huỷ → mở ConfirmDialog
- Description: `"Huỷ đăng ký của [tên học viên] khỏi khoá [tên khoá]?"`
- Confirm → `cancelEnrollment(id)` + toast "Đã huỷ đăng ký"

**Bảng — cột cần có:**
| Cột | Nội dung |
|-----|---------|
| Học viên | `student.fullName` |
| SĐT | `student.phone` |
| Khoá học | `course.name` |
| Trạng thái | `<StatusBadge status={course.status} />` |
| Ngày đăng ký | `formatDate(enrollment.enrolledAt)` |
| Hành động | Button Huỷ |

- [ ] Verify: filter học viên → chỉ hiện enrollment của học viên đó
- [ ] Verify: filter khoá học → chỉ hiện enrollment của khoá đó
- [ ] Verify: huỷ đăng ký → CapacityBar ở trang Khoá Học cập nhật
- [ ] Verify: empty state khi không có enrollment

---

## Done When
- [ ] Đăng ký học viên → validation BR-01, BR-02, BR-03 đều hoạt động
- [ ] Error messages rõ ràng bằng tiếng Việt
- [ ] Filter theo học viên / khoá học hoạt động
- [ ] Huỷ đăng ký → dữ liệu nhất quán trên tất cả màn hình
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-08-polish.md**
