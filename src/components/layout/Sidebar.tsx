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
