import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { BookPlus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { Course } from "@/types";
import { useCourseStore, useEnrollmentStore } from "@/store";
import { formatDate } from "@/lib/utils";
import { SearchInput } from "@/components/common/SearchInput";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CapacityBar } from "@/components/common/CapacityBar";
import { CourseFormDialog } from "@/components/courses/CourseFormDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const courses = useCourseStore((s) => s.courses);
  const deleteCourse = useCourseStore((s) => s.deleteCourse);
  const toggleCourseStatus = useCourseStore((s) => s.toggleCourseStatus);
  const deleteByCourseId = useEnrollmentStore((s) => s.deleteByCourseId);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    const query = searchQuery.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  const getEnrolledCount = useCallback((id: string) => useEnrollmentStore.getState().getEnrolledCount(id), []);

  const handleSearch = useCallback((value: string) => setSearchQuery(value), []);

  function handleAddClick() {
    setEditingCourse(null);
    setDialogOpen(true);
  }

  function handleEditClick(course: Course) {
    setEditingCourse(course);
    setDialogOpen(true);
  }

  function handleToggle(course: Course) {
    toggleCourseStatus(course.id);
    const nextStatus = course.status === "open" ? "đóng" : "mở";
    toast.success(`Đã ${nextStatus} khoá học "${course.name}"`);
  }

  function handleDeleteClick(course: Course) {
    setDeletingCourse(course);
  }

  function handleConfirmDelete() {
    if (!deletingCourse) return;
    deleteByCourseId(deletingCourse.id);
    deleteCourse(deletingCourse.id);
    toast.success(`Đã xoá khoá học "${deletingCourse.name}"`);
    setDeletingCourse(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Khoá Học</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {courses.length} khoá học · {courses.filter((c) => c.status === "open").length} đang mở
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <BookPlus className="mr-2 h-4 w-4" />
          Thêm Khoá Học
        </Button>
      </div>

      {/* Search */}
      {courses.length > 0 && (
        <SearchInput
          placeholder="Tìm theo tên khoá học, mô tả..."
          onSearch={handleSearch}
        />
      )}

      {/* Table */}
      {courses.length === 0 ? (
        <EmptyState
          icon={BookPlus}
          title="Chưa có khoá học nào"
          description="Bấm 'Thêm Khoá Học' để bắt đầu"
          action={
            <Button onClick={handleAddClick}>
              <BookPlus className="mr-2 h-4 w-4" />
              Thêm khoá học đầu tiên
            </Button>
          }
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookPlus}
          title="Không tìm thấy khoá học nào"
          description="Thử tìm kiếm với từ khoá khác"
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khoá học</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Sĩ số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khai giảng</TableHead>
                <TableHead>Bế giảng</TableHead>
                <TableHead className="w-[130px] text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const enrolled = getEnrolledCount(course.id);
                const available = course.maxCapacity - enrolled;
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm text-muted-foreground">{course.description}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CapacityBar enrolled={enrolled} max={course.maxCapacity} />
                        <span className="text-xs whitespace-nowrap text-muted-foreground">
                          {available <= 0 ? (
                            <span className="text-red-500 font-medium">Đầy</span>
                          ) : (
                            `Còn ${available} chỗ`
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={course.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(course.startDate)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(course.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(course)} title="Chỉnh sửa">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggle(course)}
                          title={course.status === "open" ? "Đóng khoá học" : "Mở khoá học"}
                        >
                          {course.status === "open" ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(course)}
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
      <CourseFormDialog open={dialogOpen} onOpenChange={setDialogOpen} course={editingCourse} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingCourse}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
        title="Xoá khoá học"
        description={
          deletingCourse
            ? `Khoá học <strong>${deletingCourse.name}</strong> có <strong>${getEnrolledCount(deletingCourse.id)} học viên</strong> đang đăng ký. Tất cả lượt đăng ký sẽ bị huỷ.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        confirmLabel="Xoá khoá học"
        variant="destructive"
      />
    </div>
  );
}
