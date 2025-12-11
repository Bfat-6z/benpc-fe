# Hướng dẫn sửa lỗi phân quyền xem chi tiết đơn hàng cho Admin

## Vấn đề
Admin không thể xem chi tiết đơn hàng, lỗi: "Không có quyền xem hoá đơn này" từ `HoaDonService.xemChiTiet` line 119.

## Giải pháp

### Option 1: Tạo endpoint admin riêng (Khuyến nghị)

Tạo endpoint mới trong `AdminApiController.java`:

```java
@GetMapping("/admin/hoa-don/{maHoaDon}")
public ResponseEntity<?> xemChiTietHoaDonAdmin(
    @PathVariable Integer maHoaDon,
    @RequestHeader(value = "X-User-Id", required = false) String userIdHeader
) {
    try {
        // Verify admin
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Cần đăng nhập");
        }
        
        Integer userId = Integer.parseInt(userIdHeader);
        NguoiDung user = nguoiDungRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        
        // Check if user is admin or staff
        String role = user.getQuyen() != null ? user.getQuyen().getTenQuyen() : "";
        String roleLower = role.toLowerCase();
        if (!roleLower.contains("admin") && !roleLower.contains("nhan") && !roleLower.contains("viên")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Chỉ admin và nhân viên mới có quyền xem đơn hàng");
        }
        
        // Admin/Staff can view any order
        HoaDon hoaDon = hoaDonService.xemChiTietAdmin(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(e.getMessage());
    }
}
```

Thêm method mới trong `HoaDonService.java`:

```java
public HoaDon xemChiTietAdmin(Integer maHoaDon) {
    return hoaDonRepo.findById(maHoaDon)
        .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
}
```

### Option 2: Sửa logic trong `HoaDonService.xemChiTiet` (Nếu không muốn tạo endpoint mới)

Sửa method `xemChiTiet` trong `HoaDonService.java`:

```java
public HoaDon xemChiTiet(Integer maHoaDon, Integer maNguoiDung) {
    HoaDon hoaDon = hoaDonRepo.findById(maHoaDon)
        .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
    
    // Check if user is admin or staff
    NguoiDung user = nguoiDungRepo.findById(maNguoiDung)
        .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    
    String role = user.getQuyen() != null ? user.getQuyen().getTenQuyen() : "";
    String roleLower = role.toLowerCase();
    boolean isAdminOrStaff = roleLower.contains("admin") || 
                             roleLower.contains("nhan") || 
                             roleLower.contains("viên");
    
    // Admin/Staff can view any order, regular users can only view their own
    if (!isAdminOrStaff && !hoaDon.getMaNguoiDung().equals(maNguoiDung)) {
        throw new RuntimeException("Không có quyền xem hoá đơn này");
    }
    
    return hoaDon;
}
```

Và sửa `HoaDonApiController.chiTietDon` để pass `maNguoiDung`:

```java
@GetMapping("/hoa-don/{maHoaDon}")
public ResponseEntity<?> chiTietDon(
    @PathVariable Integer maHoaDon,
    @RequestHeader(value = "X-User-Id", required = false) String userIdHeader
) {
    try {
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Cần đăng nhập");
        }
        
        Integer userId = Integer.parseInt(userIdHeader);
        HoaDon hoaDon = hoaDonService.xemChiTiet(maHoaDon, userId);
        return ResponseEntity.ok(hoaDon);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(e.getMessage());
    }
}
```

## Lưu ý
- Frontend đã được cập nhật để gọi `/admin/hoa-don/{id}` khi user là admin/staff
- Nếu chọn Option 2, frontend vẫn sẽ hoạt động vì nó sẽ fallback về `/hoa-don/{id}` nếu admin endpoint không tồn tại
- Đảm bảo role check sử dụng `toLowerCase().contains()` để match các format khác nhau (Admin, admin, Nhân viên, nhanVien, etc.)

