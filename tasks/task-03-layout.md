# Task 03 — Routing & App Layout

## Goal
Xây dựng shell ứng dụng: React Router v6 với 4 routes, Sidebar navigation, AppLayout wrapper. Đây là khung hiển thị cho toàn bộ pages.

## Phụ Thuộc
- Task 00, 01, 02 hoàn thành

---

## Checklist

### Bước 1: Tạo `src/components/layout/Sidebar.tsx`

```tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',            label: 'Tổng Quan',    icon: LayoutDashboard },
  { to: '/students',    label: 'Học Viên',     icon: Users },
  { to: '/courses',     label: 'Khoá Học',     icon: BookOpen },
  { to: '/enrollments', label: 'Đăng Ký',      icon: ClipboardList },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r bg-background flex flex-col h-screen sticky top-0">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-xl font-bold tracking-tight">SASUCO</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Quản lý đào tạo nghề</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] Verify: active route được highlight, các link điều hướng đúng

### Bước 2: Tạo `src/components/layout/AppLayout.tsx`

```tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
```

- [ ] Verify: `<Toaster>` render đúng, `<Outlet>` hiển thị page content

### Bước 3: Tạo placeholder pages (sẽ implement chi tiết ở task sau)

Tạo 4 files với nội dung tạm:

**`src/pages/DashboardPage.tsx`**
```tsx
export function DashboardPage() {
  return <div className="text-2xl font-bold">Dashboard — coming soon</div>;
}
```

**`src/pages/StudentsPage.tsx`**
```tsx
export function StudentsPage() {
  return <div className="text-2xl font-bold">Học Viên — coming soon</div>;
}
```

**`src/pages/CoursesPage.tsx`**
```tsx
export function CoursesPage() {
  return <div className="text-2xl font-bold">Khoá Học — coming soon</div>;
}
```

**`src/pages/EnrollmentsPage.tsx`**
```tsx
export function EnrollmentsPage() {
  return <div className="text-2xl font-bold">Đăng Ký — coming soon</div>;
}
```

- [ ] Verify: 4 files tạo xong, không có import errors

### Bước 4: Tạo `src/App.tsx` với Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { EnrollmentsPage } from '@/pages/EnrollmentsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] Verify: navigate giữa 4 routes không có lỗi

### Bước 5: Update `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] Verify: không có `document.getElementById` null error

### Bước 6: Update `index.html` — title & meta

```html
<title>SASUCO — Quản Lý Đào Tạo Nghề</title>
<meta name="description" content="Hệ thống quản lý học viên và khoá học trung tâm đào tạo nghề SASUCO" />
```

- [ ] Verify: tab browser hiển thị đúng title

---

## Done When
- [ ] `npm run dev` — layout hiển thị: sidebar trái + content phải
- [ ] 4 NavLink điều hướng đúng, active state highlight đúng
- [ ] Toast `<Toaster>` không báo lỗi
- [ ] Không có console errors

## Next Task
→ **task-04-dashboard.md**
