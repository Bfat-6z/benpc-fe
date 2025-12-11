# Hướng dẫn sửa lỗi mật khẩu không hash trong Database

## Vấn đề
- Mật khẩu trong database đang lưu dạng plain text ("123456")
- Backend sử dụng BCryptPasswordEncoder để so sánh
- BCrypt không thể verify plain text password → Lỗi "Encoded password does not look like BCrypt"

## Giải pháp

### Cách 1: Tạo lại user qua hệ thống đăng ký (KHUYẾN NGHỊ)
1. Xóa các user cũ trong database (hoặc giữ lại)
2. Sử dụng chức năng đăng ký trong frontend để tạo lại user admin/nhân viên
3. Mật khẩu sẽ được hash đúng cách

### Cách 2: Tạo endpoint tạm thời để hash mật khẩu

Thêm vào `NguoiDungApiController.java`:

```java
@PostMapping("/hash-passwords")
public ResponseEntity<?> hashAllPasswords() {
    try {
        List<NguoiDung> users = nguoiDungRepository.findAll();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        for (NguoiDung user : users) {
            // Chỉ hash nếu mật khẩu chưa được hash (không bắt đầu bằng $2a$ hoặc $2b$)
            if (user.getMatKhau() != null && !user.getMatKhau().startsWith("$2")) {
                String hashedPassword = encoder.encode(user.getMatKhau());
                user.setMatKhau(hashedPassword);
                nguoiDungRepository.save(user);
            }
        }
        
        return ResponseEntity.ok("Đã hash tất cả mật khẩu thành công");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
    }
}
```

Sau đó gọi endpoint này một lần:
```bash
POST http://localhost:8080/api/nguoi-dung/hash-passwords
```

**LƯU Ý:** Xóa endpoint này sau khi đã sử dụng xong để bảo mật!

### Cách 3: Cập nhật trực tiếp trong database

1. Tạo hash BCrypt cho mật khẩu "123456":
   - Sử dụng online tool: https://bcrypt-generator.com/
   - Hoặc chạy script Node.js: `node hash-password.js`
   - Hoặc sử dụng Spring Boot:

```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashed = encoder.encode("123456");
System.out.println(hashed);
```

2. Cập nhật trong database:
```sql
UPDATE NguoiDung 
SET MatKhau = '$2a$10$[hash_here]'
WHERE Email = 'admin@gmail.com' AND MatKhau = '123456';
```

## Kiểm tra

Sau khi cập nhật, thử đăng nhập lại với:
- Email: admin@gmail.com
- Password: 123456

## Lưu ý bảo mật

1. **Xóa endpoint hash-passwords** sau khi sử dụng
2. **Không commit** file chứa mật khẩu plain text
3. **Đảm bảo** tất cả mật khẩu mới đều được hash khi đăng ký

