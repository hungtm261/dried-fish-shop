# 🐟 Vựa Cá Khô Phương Nam (`dried-fish-shop`)

Hệ thống thương mại điện tử chuyên biệt cho mặt hàng **Cá Khô & Hải Sản Khô Đặc Sản Vùng Miền** gồm 2 phân hệ:
- **Customer Portal (`/`)**: Trang chủ quảng cáo đặc sản, danh mục lọc theo loại cá & xuất xứ vùng miền, trang chi tiết chọn quy cách đóng gói (`250g`, `500g`, `1kg`), giỏ hàng trượt (Cart Drawer), đặt hàng nhanh không cần đăng nhập (COD / VietQR) và tra cứu trạng thái đơn hàng.
- **Admin Dashboard (`/admin`)**: Thống kê doanh thu & tồn kho, quản lý đơn hàng, quản lý sản phẩm cá khô kèm nhiều mức trọng lượng, và quản lý danh mục.

---

## 🚀 Cách Chạy Nhanh (Quick Start)

Tại thư mục gốc của dự án, chạy lệnh:

```bash
npm run dev
```

- **Frontend (Portal & Admin):** `http://localhost:5173`
  - Trang khách hàng (Portal): `http://localhost:5173/`
  - Trang quản trị (Admin): `http://localhost:5173/admin`
- **Backend API:** `http://localhost:4000`

---

## 🛠️ Các Lệnh Hữu Ích

- **Nạp lại dữ liệu mẫu (Reset & Seed DB):**
  ```bash
  npm run seed
  ```
- **Kiểm tra Build Production:**
  ```bash
  npm run build
  ```

---

## 🔄 Hướng Dẫn Mở Rộng & Chuyển Đổi Database Sau Này

Dự án sử dụng **Prisma ORM** tại [`backend/prisma/schema.prisma`](file:///Users/kaneki_tmh/Documents/VNPT_Project/fish/dried-fish-shop/backend/prisma/schema.prisma). Khi đưa lên môi trường Production (PostgreSQL hoặc MySQL), bạn chỉ cần đổi `provider = "postgresql"` và cập nhật `DATABASE_URL` trong `backend/.env` mà không cần sửa lại code Backend hay Frontend.
