# Backend API Requirements cho Admin Dashboard

## Tổng quan
Frontend đã được cấu hình để gọi các API endpoints sau. Backend cần implement các endpoints này với authentication và authorization (chỉ admin mới được truy cập).

## Base URL
Tất cả endpoints dưới đây nằm dưới `/api/admin/`

## Authentication
Frontend sẽ gửi `X-User-Id` header trong mọi request. Backend cần:
1. Đọc `X-User-Id` từ header
2. Verify user có role `admin` (từ bảng `Quyen` với `TenQuyen = 'admin'`)
3. Nếu không phải admin, trả về 403 Forbidden

---

## 1. User Management APIs

### GET `/api/admin/nguoi-dung`
Lấy danh sách tất cả users (có phân trang và filter)

**Query Parameters:**
- `tuKhoa` (optional): Tìm kiếm theo tên, email
- `vaiTro` (optional): Filter theo role (user, nhanVien, admin)
- `trang` (optional): Số trang (default: 0)
- `kichThuoc` (optional): Số items mỗi trang (default: 20)

**Response:**
```json
{
  "content": [
    {
      "maNguoiDung": 1,
      "tenNguoiDung": "Nguyễn Văn A",
      "email": "user@example.com",
      "dienThoai": "0909123456",
      "vaiTro": "user",
      "quyen": {
        "maQuyen": 3,
        "tenQuyen": "user"
      },
      "ngayTao": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

Hoặc trả về array đơn giản:
```json
[
  {
    "maNguoiDung": 1,
    "tenNguoiDung": "Nguyễn Văn A",
    "email": "user@example.com",
    "dienThoai": "0909123456",
    "vaiTro": "user",
    "quyen": {
      "maQuyen": 3,
      "tenQuyen": "user"
    },
    "ngayTao": "2024-01-01T00:00:00"
  }
]
```

### PUT `/api/admin/nguoi-dung/{userId}/role`
Cập nhật role của user

**Request Body:**
```json
{
  "vaiTro": "nhanVien"
}
```

**Response:**
```json
{
  "maNguoiDung": 1,
  "tenNguoiDung": "Nguyễn Văn A",
  "email": "user@example.com",
  "vaiTro": "nhanVien",
  "quyen": {
    "maQuyen": 2,
    "tenQuyen": "nhanVien"
  }
}
```

---

## 2. Product Management APIs

### GET `/api/admin/san-pham`
Lấy danh sách tất cả sản phẩm (có phân trang và filter)

**Query Parameters:**
- `tuKhoa` (optional): Tìm kiếm theo tên sản phẩm
- `maDanhMuc` (optional): Filter theo danh mục
- `trang` (optional): Số trang
- `kichThuoc` (optional): Số items mỗi trang

**Response:** Tương tự như GET `/api/san-pham` nhưng không có giới hạn quyền

### POST `/api/admin/san-pham`
Tạo sản phẩm mới

**Request Body:**
```json
{
  "tenSP": "CPU Intel Core i9",
  "gia": 15000000,
  "moTa": "Mô tả sản phẩm",
  "soLuong": 100,
  "maDanhMuc": 1,
  "maNCC": 1,
  "hinhAnh": "cpu-i9.jpg"
}
```

### PUT `/api/admin/san-pham/{productId}`
Cập nhật sản phẩm

**Request Body:** Tương tự POST

### DELETE `/api/admin/san-pham/{productId}`
Xóa sản phẩm

**Response:** 204 No Content hoặc 200 OK

---

## 3. Category Management APIs

### GET `/api/admin/danh-muc`
Lấy danh sách tất cả danh mục

**Response:**
```json
[
  {
    "maDanhMuc": 1,
    "tenDanhMuc": "CPU",
    "soSanPham": 50
  }
]
```

### POST `/api/admin/danh-muc`
Tạo danh mục mới

**Request Body:**
```json
{
  "tenDanhMuc": "SSD"
}
```

### PUT `/api/admin/danh-muc/{categoryId}`
Cập nhật danh mục

**Request Body:**
```json
{
  "tenDanhMuc": "SSD M.2"
}
```

### DELETE `/api/admin/danh-muc/{categoryId}`
Xóa danh mục

**Response:** 204 No Content hoặc 200 OK

---

## 4. Order Management APIs

### GET `/api/admin/hoa-don`
Lấy danh sách tất cả đơn hàng (có phân trang và filter)

**Query Parameters:**
- `tuKhoa` (optional): Tìm kiếm theo mã đơn, tên khách hàng
- `trangThai` (optional): Filter theo trạng thái (CHO_XAC_NHAN, DANG_XU_LY, DANG_GIAO, DA_GIAO, DA_HUY)
- `trang` (optional): Số trang
- `kichThuoc` (optional): Số items mỗi trang

**Response:**
```json
{
  "content": [
    {
      "maHoaDon": 1,
      "nguoiDung": {
        "maNguoiDung": 1,
        "tenNguoiDung": "Nguyễn Văn A",
        "email": "user@example.com"
      },
      "tongTien": 5000000,
      "trangThai": "CHO_XAC_NHAN",
      "ngayLap": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 50,
  "totalPages": 3
}
```

### PUT `/api/admin/hoa-don/{orderId}/status`
Cập nhật trạng thái đơn hàng

**Request Body:**
```json
{
  "trangThai": "DANG_XU_LY"
}
```

**Response:** Order object đã được cập nhật

---

## 5. Statistics API

### GET `/api/admin/thong-ke`
Lấy thống kê tổng quan

**Response:**
```json
{
  "totalRevenue": 100000000,
  "totalOrders": 500,
  "totalProducts": 1000,
  "totalUsers": 200
}
```

Hoặc:
```json
{
  "tongDoanhThu": 100000000,
  "tongDonHang": 500,
  "tongSanPham": 1000,
  "tongNguoiDung": 200
}
```

---

## Lưu ý quan trọng

1. **Authentication**: Tất cả endpoints phải verify `X-User-Id` header và kiểm tra role admin
2. **Authorization**: Chỉ user có role `admin` mới được truy cập các endpoints này
3. **Error Handling**: 
   - 401 Unauthorized: Không có user hoặc không đăng nhập
   - 403 Forbidden: User không phải admin
   - 404 Not Found: Resource không tồn tại
   - 400 Bad Request: Dữ liệu không hợp lệ
4. **Response Format**: Backend có thể trả về Page object (Spring Data) hoặc array đơn giản, frontend đã xử lý cả 2 trường hợp

---

## Endpoints hiện tại cần kiểm tra

Frontend đang gọi các endpoint sau, cần đảm bảo chúng hoạt động:
- `/api/danh-muc` - Có thể trả về 404 (đã có fallback)
- `/api/gio-hang` - Cần verify `X-User-Id` header
- `/api/nguoi-dung/current?userId={id}` - Cần trả về user với `quyen` object

