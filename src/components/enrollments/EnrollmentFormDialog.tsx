import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentStore, useCourseStore, useEnrollmentStore } from '@/store';
import { ENROLLMENT_ERROR_MESSAGES } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface EnrollmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentFormDialog({ open, onOpenChange }: EnrollmentFormDialogProps) {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');

  const students = useStudentStore((s) => s.students);
  const courses = useCourseStore((s) => s.courses);

  // Chỉ hiển thị khoá open VÀ còn chỗ trống
  const availableCourses = courses.filter((c) => {
    if (c.status === 'closed') return false;
    const enrolled = useEnrollmentStore.getState().getEnrolledCount(c.id);
    return enrolled < c.maxCapacity;
  });

  function handleSubmit() {
    if (!studentId || !courseId) {
      toast.error('Vui lòng chọn học viên và khoá học');
      return;
    }

    const result = useEnrollmentStore.getState().enrollStudent(studentId, courseId);
    if (result.success) {
      toast.success('Đã đăng ký học viên thành công');
      setStudentId('');
      setCourseId('');
      onOpenChange(false);
    } else {
      toast.error(ENROLLMENT_ERROR_MESSAGES[result.error]);
      // Không đóng dialog để nhân viên chọn lại
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setStudentId('');
      setCourseId('');
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Đăng Ký Học Viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Chọn học viên */}
          <div className="space-y-2">
            <Label>Học viên</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn học viên..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.fullName} ({s.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chọn khoá học */}
          <div className="space-y-2">
            <Label>Khoá học</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoá học..." />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Không có khoá học nào còn chỗ trống
                  </div>
                ) : (
                  availableCourses.map((c) => {
                    const enrolled = useEnrollmentStore.getState().getEnrolledCount(c.id);
                    const remaining = c.maxCapacity - enrolled;
                    return (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} (còn {remaining} chỗ)
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={!studentId || !courseId}>
            Đăng ký
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
