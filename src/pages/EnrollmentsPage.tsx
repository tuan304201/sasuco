import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { ClipboardPlus, XCircle } from 'lucide-react';
import { useStudentStore, useCourseStore, useEnrollmentStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { SearchInput } from '@/components/common/SearchInput';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EnrollmentFormDialog } from '@/components/enrollments/EnrollmentFormDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ALL = 'all';

export function EnrollmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStudentId, setFilterStudentId] = useState<string>(ALL);
  const [filterCourseId, setFilterCourseId] = useState<string>(ALL);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const students = useStudentStore((s) => s.students);
  const courses = useCourseStore((s) => s.courses);
  const enrollments = useEnrollmentStore((s) => s.enrollments);
  const cancelEnrollment = useEnrollmentStore((s) => s.cancelEnrollment);

  const getStudentById = useStudentStore((s) => s.getStudentById);
  const getCourseById = useCourseStore((s) => s.getCourseById);

  // Join enrollments với students/courses + filter và tìm kiếm
  const displayedEnrollments = useMemo(() => {
    return enrollments
      .filter((e) => {
        if (filterStudentId !== ALL && e.studentId !== filterStudentId) return false;
        if (filterCourseId !== ALL && e.courseId !== filterCourseId) return false;
        return true;
      })
      .map((e) => ({
        ...e,
        student: getStudentById(e.studentId),
        course: getCourseById(e.courseId),
      }))
      .filter((e) => {
        if (!e.student || !e.course) return false; // lọc orphan data
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase().trim();
        return (
          e.student.fullName.toLowerCase().includes(query) ||
          e.student.phone.includes(query) ||
          e.course.name.toLowerCase().includes(query)
        );
      });
  }, [enrollments, filterStudentId, filterCourseId, searchQuery, getStudentById, getCourseById]);

  const handleSearch = useCallback((value: string) => setSearchQuery(value), []);

  // Tìm enrollment đang confirm cancel
  const cancelingEnrollment = cancelingId
    ? displayedEnrollments.find((e) => e.id === cancelingId)
    : null;

  function handleConfirmCancel() {
    if (!cancelingId) return;
    cancelEnrollment(cancelingId);
    toast.success('Đã huỷ đăng ký');
    setCancelingId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Đăng Ký</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {enrollments.length} lượt đăng ký
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <ClipboardPlus className="mr-2 h-4 w-4" />
          Đăng Ký Học Viên
        </Button>
      </div>

      {/* Search */}
      {enrollments.length > 0 && (
        <SearchInput
          placeholder="Tìm theo tên học viên, số điện thoại, tên khoá học..."
          onSearch={handleSearch}
        />
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterStudentId} onValueChange={setFilterStudentId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả học viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả học viên</SelectItem>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCourseId} onValueChange={setFilterCourseId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả khoá học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả khoá học</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filterStudentId !== ALL || filterCourseId !== ALL || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterStudentId(ALL);
              setFilterCourseId(ALL);
              setSearchQuery('');
            }}
          >
            Xoá bộ lọc
          </Button>
        )}
      </div>

      {/* Table */}
      {displayedEnrollments.length === 0 ? (
        <EmptyState
          icon={ClipboardPlus}
          title={
            enrollments.length === 0
              ? 'Chưa có lượt đăng ký nào'
              : 'Không tìm thấy kết quả phù hợp'
          }
          description={
            enrollments.length === 0
              ? 'Bấm "\u0110ăng Ký Học Viên" để tạo lượt đăng ký đầu tiên'
              : 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm khác'
          }
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Khoá học</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead className="w-[80px] text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedEnrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.student!.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{e.student!.phone}</TableCell>
                  <TableCell>{e.course!.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={e.course!.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(e.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCancelingId(e.id)}
                      title="Huỷ đăng ký"
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Enrollment Form Dialog */}
      <EnrollmentFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={!!cancelingId}
        onOpenChange={(open) => !open && setCancelingId(null)}
        title="Huỷ đăng ký"
        description={
          cancelingEnrollment
            ? `Huỷ đăng ký của <strong>${cancelingEnrollment.student!.fullName}</strong> khỏi khoá <strong>${cancelingEnrollment.course!.name}</strong>?`
            : ''
        }
        onConfirm={handleConfirmCancel}
        confirmLabel="Huỷ đăng ký"
        variant="destructive"
      />
    </div>
  );
}
