# SASUCO Management System

Hệ thống Quản lý Học viên, Khóa học và Lượt đăng ký nội bộ dành cho trung tâm đào tạo nghề SASUCO. Đây là ứng dụng Single Page Application (SPA) chạy hoàn toàn dưới Client-side.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Core:** React 19, TypeScript, Vite
*   **State Management:** Zustand (kèm middleware `persist` lưu dữ liệu tự động vào LocalStorage)
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS, Radix UI (shadcn/ui base)
*   **Form & Validation:** React Hook Form, Zod
*   **Thông báo:** Sonner

---

## 📋 Yêu Cầu Hệ Thống

*   **Node.js**: Phiên bản `18.0.0` trở lên (Khuyến nghị sử dụng phiên bản LTS).
*   **NPM**: Đi kèm với cài đặt Node.js.
*   **Terminal (dành cho Windows):** Khuyến nghị sử dụng **Git Bash** thay vì CMD hay PowerShell để đảm bảo tính tương thích của các script chạy dòng lệnh.

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án

Làm theo các bước dưới đây để tải mã nguồn, cài đặt và khởi chạy dự án trên máy cục bộ của bạn:

### Bước 1: Tải mã nguồn dự án (Clone)
Khởi động **Git Bash** (hoặc Terminal) trên máy tính của bạn và chạy lệnh sau để clone dự án:
```bash
git clone https://github.com/tuan304201/sasuco.git
```
Sau đó, di chuyển vào thư mục của dự án:
```bash
cd sasuco
```

### Bước 2: Cài đặt các thư viện phụ thuộc
Chạy lệnh sau để cài đặt tất cả các package cần thiết:
```bash
npm install
```

### Bước 3: Chạy ứng dụng ở chế độ Phát triển (Development)
Khởi chạy local development server bằng lệnh:
```bash
npm run dev
```
Sau khi chạy lệnh thành công, hãy mở trình duyệt và truy cập địa chỉ: `http://localhost:5173` để trải nghiệm ứng dụng.

---

## 📦 Các Lệnh Scripts Khác

Trong quá trình phát triển, bạn có thể sử dụng các câu lệnh sau:

*   **Build dự án (Production):**
    ```bash
    npm run build
    ```
    Lệnh này sẽ biên dịch mã nguồn TypeScript và đóng gói ứng dụng tối ưu nhất vào thư mục `/dist`.

*   **Xem trước bản Build (Preview):**
    ```bash
    npm run preview
    ```
    Khởi chạy local server để chạy thử ứng dụng đã được đóng gói trong thư mục `/dist`.

*   **Kiểm tra lỗi cú pháp (Lint):**
    ```bash
    npm run lint
    ```
    Chạy ESLint để quét lỗi cú pháp và đảm bảo tính nhất quán của mã nguồn theo chuẩn dự án.

---

## 📂 Cấu Trúc Mã Nguồn Chính

```text
src/
├── components/     # Các thành phần giao diện (UI, common, dialog forms)
├── lib/            # Tiện ích chung, dữ liệu giả lập (mockData) và zod schemas
├── pages/          # Các trang chính (Dashboard, Students, Courses, Enrollments)
├── store/          # Zustand stores quản lý State và Business Logic nghiệp vụ
├── types/          # Định nghĩa kiểu dữ liệu TypeScript (Domain types)
├── App.tsx         # Component gốc và cấu hình định tuyến (routing)
└── main.tsx        # Điểm khởi đầu của ứng dụng
```
