import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import type { Student } from '@/types';
import { useStudentStore, useEnrollmentStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { SearchInput } from '@/components/common/SearchInput';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { StudentFormDialog } from '@/components/students/StudentFormDialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const students = useStudentStore((s) => s.students);
  const deleteStudent = useStudentStore((s) => s.deleteStudent);
  const deleteByStudentId = useEnrollmentStore((s) => s.deleteByStudentId);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const query = searchQuery.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(query) ||
        s.phone.includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.idCard.includes(query)
    );
  }, [students, searchQuery]);

  const getEnrollmentCount = useCallback(
    (id: string) => useEnrollmentStore.getState().getEnrollmentsByStudent(id).length,
    []
  );

  const handleSearch = useCallback((value: string) => setSearchQuery(value), []);

  function handleAddClick() {
    setEditingStudent(null);
    setDialogOpen(true);
  }

  function handleEditClick(student: Student) {
    setEditingStudent(student);
    setDialogOpen(true);
  }

  function handleDeleteClick(student: Student) {
    setDeletingStudent(student);
  }

  function handleConfirmDelete() {
    if (!deletingStudent) return;
    deleteByStudentId(deletingStudent.id);
    deleteStudent(deletingStudent.id);
    toast.success(`Đã xoá học viên ${deletingStudent.fullName}`);
    setDeletingStudent(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Học Viên</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredStudents.length} học viên
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm Học Viên
        </Button>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Tìm theo tên, SĐT, email, CCCD..."
        onSearch={handleSearch}
      />

      {/* Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={searchQuery ? 'Không tìm thấy học viên nào' : 'Chưa có học viên nào'}
          description={searchQuery ? 'Thử tìm kiếm với từ khoá khác' : 'Bấm "Thêm Học Viên" để bắt đầu'}
          action={!searchQuery && (
            <Button onClick={handleAddClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm học viên đầu tiên
            </Button>
          )}
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CCCD</TableHead>
                <TableHead>Khoá học</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[100px] text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const count = getEnrollmentCount(student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="font-mono text-sm">{student.idCard}</TableCell>
                    <TableCell>
                      <span className="text-sm">{count} khoá</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(student.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(student)}
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(student)}
                          title="Xoá"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <StudentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingStudent}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
        title="Xoá học viên"
        description={
          deletingStudent
            ? `Học viên <strong>${deletingStudent.fullName}</strong> đang đăng ký <strong>${getEnrollmentCount(deletingStudent.id)} khoá học</strong>. Tất cả lượt đăng ký cũng sẽ bị xoá.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        confirmLabel="Xoá học viên"
        variant="destructive"
      />
    </div>
  );
}
