# Task 08 — Polish, Empty States & Final Verification

## Goal
Hoàn thiện UX: empty states, responsive layout, toast notifications nhất quán, kiểm tra tính nhất quán dữ liệu, build clean.

## Phụ Thuộc
- Task 00–07 toàn bộ hoàn thành

---

## Checklist

### Bước 1: Tạo `src/components/common/EmptyState.tsx`

```tsx
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

Dùng tại:
- StudentsPage: "Chưa có học viên nào" + Button "Thêm học viên đầu tiên"
- StudentsPage (search rỗng): "Không tìm thấy học viên nào"
- CoursesPage: "Chưa có khoá học nào"
- EnrollmentsPage: "Chưa có lượt đăng ký nào"

- [ ] Verify: 4 empty states đều hiển thị đúng context

### Bước 2: Chuẩn hoá Toast Notifications

Thống nhất messages trên toàn app:

| Action | Toast |
|--------|-------|
| Thêm học viên | `"Đã thêm học viên [tên]"` |
| Sửa học viên | `"Đã cập nhật thông tin học viên"` |
| Xoá học viên | `"Đã xoá học viên [tên]"` |
| Thêm khoá học | `"Đã thêm khoá học [tên]"` |
| Sửa khoá học | `"Đã cập nhật khoá học"` |
| Xoá khoá học | `"Đã xoá khoá học [tên]"` |
| Mở khoá | `"Đã mở khoá học [tên]"` |
| Đóng khoá | `"Đã đóng khoá học [tên]"` |
| Đăng ký thành công | `"Đã đăng ký học viên thành công"` |
| Huỷ đăng ký | `"Đã huỷ đăng ký"` |

- [ ] Verify: mỗi action đều có toast tương ứng

### Bước 3: Kiểm tra tính nhất quán dữ liệu

Test thủ công các scenario:

**Scenario A — Cascade xoá học viên:**
1. Học viên A đang đăng ký 2 khoá
2. Xoá học viên A
3. Vào trang Đăng Ký → không còn enrollment của A
4. Vào Dashboard → tổng lượt đăng ký giảm 2
5. Vào Khoá Học → CapacityBar của 2 khoá giảm đúng

- [ ] Pass

**Scenario B — Cascade xoá khoá học:**
1. Khoá X có 3 học viên đăng ký
2. Xoá khoá X
3. Vào Đăng Ký → không còn enrollment nào của khoá X
4. Dashboard → tổng lượt ĐK giảm 3, tỷ lệ lấp đầy cập nhật

- [ ] Pass

**Scenario C — Business rules:**
1. Khoá Y đang mở, sĩ số 2, đã có 2 ĐK → isFull
2. Thử đăng ký thêm → toast "Khoá học đã đầy"
3. Đóng khoá Y
4. Thử đăng ký vào khoá Y → toast "Khoá học đã đóng"
5. Học viên B đã ĐK khoá Z → thử ĐK lại khoá Z → toast "Học viên đã đăng ký khoá học này rồi"

- [ ] Pass tất cả 3 sub-scenarios

**Scenario D — Persist dữ liệu:**
1. Thêm 1 học viên mới
2. F5 trình duyệt
3. Học viên mới vẫn còn trong bảng

- [ ] Pass

### Bước 4: Responsive check

Đảm bảo layout hợp lý ở các breakpoint:
- Desktop 1280px+: sidebar + table đầy đủ columns
- Tablet 768px–1279px: sidebar thu hẹp hoặc ẩn, table scroll ngang
- Mobile < 768px: không phải target chính nhưng không bị broken

- [ ] Verify: không có horizontal overflow ở desktop
- [ ] Verify: table có `overflow-x-auto` wrapper

### Bước 5: TypeScript & Lint final check

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **0 TypeScript errors**
- [ ] **0 lint errors** (warnings có thể chấp nhận nếu justified)
- [ ] Không có `any` hoặc `unknown` được dùng vô lý

### Bước 6: Production build

```bash
npm run build
```

- [ ] Build thành công không có errors
- [ ] Bundle size hợp lý (< 2MB total)

---

## Done When
- [ ] Tất cả 4 scenario kiểm thử đều pass
- [ ] `npm run build` — 0 errors
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] App chạy được tại `npm run dev`
- [ ] Dữ liệu persist qua F5
- [ ] Toàn bộ toast notifications nhất quán

---

## Tổng Kết Tiêu Chí Nghiệm Thu

| Tiêu chí | Check |
|----------|-------|
| Tách biệt logic (store) và giao diện (page/component) | ☐ |
| TypeScript strict — không có `any` vô lý | ☐ |
| Validate đúng nghiệp vụ tại store layer | ☐ |
| Không có lỗi build | ☐ |
| Dữ liệu persist qua refresh | ☐ |
| Cascade delete nhất quán | ☐ |
| Search realtime không cần submit | ☐ |
| Error messages rõ ràng bằng tiếng Việt | ☐ |
