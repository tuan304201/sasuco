# Task 00 — Project Bootstrap ✅ DONE

## Goal
Khởi tạo Vite + React + TypeScript project tại `d:\LAB\TEST-FE`, cài đặt toàn bộ dependencies, cấu hình shadcn/ui sẵn sàng để phát triển.

## Phụ Thuộc
- Không có (task đầu tiên)

---

## Checklist

### Bước 1: Khởi tạo Vite project
- [x] Verify: có `vite.config.ts`, `src/main.tsx`, `package.json`

### Bước 2: Cài base dependencies
- [x] Verify: `node_modules/` tồn tại, không có peer dep errors nghiêm trọng

### Bước 3: Cài Tailwind CSS v3
- [x] Verify: có `tailwind.config.js`, `postcss.config.js`

### Bước 4: Cài Radix UI + tiện ích shadcn
- [x] Verify: không có install errors

### Bước 5: Init shadcn/ui (v2.5.0)
> Dùng `npx shadcn@2.5.0` — stable với Tailwind v3
- [x] Verify: `components.json` tồn tại, `src/lib/utils.ts` tồn tại

### Bước 6: Add shadcn components cần thiết
- [x] Verify: `src/components/ui/` chứa **12 files**: button, card, dialog, form, input, label, select, table, badge, progress, sonner, separator

### Bước 7: Cấu hình Path Alias `@`
- [x] Verify: `vite.config.ts` có `resolve.alias`, `tsconfig.app.json` có `paths`

### Bước 8: Cấu hình Tailwind content paths
- [x] Verify: `tailwind.config.js` đúng content paths

### Bước 9: Update `src/index.css`
- [x] Verify: có `@tailwind base/components/utilities` + shadcn Zinc CSS variables

### Bước 10: Xoá boilerplate Vite mặc định
- [x] Verify: `src/App.tsx` clean, không có broken imports

### Bước 11: Verify build sạch
- [x] **0 TypeScript errors**
- [x] **0 build errors** — `✓ built in 12.13s`

---

## Done When
- [x] `npm run build` — pass hoàn toàn ✓
- [x] `src/components/ui/` — có 12 shadcn components
- [x] Path alias `@/` hoạt động trong mọi import
- [x] `src/vite-env.d.ts` — Vite client types đã khai báo

## Completed At
2026-06-02T08:23:32Z

## Notes
- `npm create vite@latest` bị cancel vì thư mục không rỗng → tạo thủ công các file scaffold
- Tailwind v4 không tương thích shadcn v2.5.0 → downgrade về Tailwind v3
- shadcn `init` dùng flag `--yes` thay vì `-d` defaults
- Thêm `"ignoreDeprecations": "6.0"` vào tsconfig do TypeScript 6 deprecate `baseUrl`

## Next Task
→ **task-01-types-utils.md**
