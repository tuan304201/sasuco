# Task 04 — Dashboard Page (Nghiệp Vụ 4)

## Goal
Xây dựng trang Tổng Quan với 4 stat cards tự động cập nhật khi có thay đổi dữ liệu.

## Phụ Thuộc
- Task 02 (stores), Task 03 (layout) hoàn thành

---

## Checklist

### Bước 1: Tạo `src/components/dashboard/StatCard.tsx`
Component card tái sử dụng nhận: `title`, `value`, `subtitle`, `icon: LucideIcon`, `iconClassName?`
- Dùng shadcn `<Card>` + `<CardHeader>` + `<CardContent>`
- [ ] Verify: render đúng, props typed rõ ràng

### Bước 2: Implement `src/pages/DashboardPage.tsx`

Dùng `useMemo` để tính:
```typescript
const stats = useMemo(() => ({
  totalStudents: students.length,
  openCourses: courses.filter(c => c.status === 'open').length,
  totalEnrollments: enrollments.length,
  fillRate: calcPercent(enrollments.length, courses.reduce((s, c) => s + c.maxCapacity, 0))
}), [students, courses, enrollments]);
```

4 StatCards:
1. **Tổng Học Viên** — `Users` icon
2. **Khoá Đang Mở** — `BookOpen` icon, xanh
3. **Tổng Lượt Đăng Ký** — `ClipboardList` icon
4. **Tỷ Lệ Lấp Đầy** — `TrendingUp` icon, đỏ nếu >= 80%

Thêm `<Progress value={fillRate} />` bên dưới cards.

- [ ] Verify: 4 cards hiển thị đúng từ mock data (6/60 = 10%)
- [ ] Verify: số liệu reactive — thêm học viên ở trang khác → dashboard tự cập nhật

---

## Done When
- [ ] 4 stat cards đúng số liệu
- [ ] Progress bar đúng tỷ lệ  
- [ ] `npx tsc --noEmit` — 0 errors

## Next Task
→ **task-05-students.md**
