import { useMemo } from 'react';
import { Users, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';
import { useStudentStore, useCourseStore, useEnrollmentStore } from '@/store';
import { calcPercent } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/StatCard';
import { Progress } from '@/components/ui/progress';

export function DashboardPage() {
  const students = useStudentStore((s) => s.students);
  const courses = useCourseStore((s) => s.courses);
  const enrollments = useEnrollmentStore((s) => s.enrollments);

  const stats = useMemo(() => ({
    totalStudents: students.length,
    openCourses: courses.filter((c) => c.status === 'open').length,
    totalEnrollments: enrollments.length,
    fillRate: calcPercent(
      enrollments.length,
      courses.reduce((sum, c) => sum + c.maxCapacity, 0)
    ),
  }), [students, courses, enrollments]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tổng Quan</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Thống kê hoạt động của trung tâm đào tạo nghề SASUCO
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng Học Viên"
          value={stats.totalStudents}
          subtitle="Học viên đã đăng ký"
          icon={Users}
        />
        <StatCard
          title="Khoá Đang Mở"
          value={stats.openCourses}
          subtitle={`Trong tổng số ${courses.length} khoá học`}
          icon={BookOpen}
          iconClassName="text-emerald-500"
        />
        <StatCard
          title="Tổng Lượt Đăng Ký"
          value={stats.totalEnrollments}
          subtitle="Lượt đăng ký học viên"
          icon={ClipboardList}
        />
        <StatCard
          title="Tỷ Lệ Lấp Đầy"
          value={`${stats.fillRate}%`}
          subtitle="Tổng chỗ đã sử dụng"
          icon={TrendingUp}
          iconClassName={stats.fillRate >= 80 ? 'text-red-500' : 'text-muted-foreground'}
        />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tỷ lệ lấp đầy toàn hệ thống</span>
          <span className="font-medium">{stats.fillRate}%</span>
        </div>
        <Progress value={stats.fillRate} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {stats.totalEnrollments} / {courses.reduce((sum, c) => sum + c.maxCapacity, 0)} chỗ
        </p>
      </div>
    </div>
  );
}
