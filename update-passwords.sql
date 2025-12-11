-- Script SQL để cập nhật mật khẩu đã hash bằng BCrypt
-- LƯU Ý: Các hash dưới đây là ví dụ, bạn cần tạo hash mới bằng BCrypt

-- Cách 1: Sử dụng Spring Boot để hash mật khẩu
-- Tạo một endpoint tạm thời trong backend để hash mật khẩu, hoặc

-- Cách 2: Sử dụng online BCrypt generator hoặc script
-- Ví dụ hash của "123456" với BCrypt (10 rounds):
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Cập nhật mật khẩu cho admin
-- UPDATE NguoiDung 
-- SET MatKhau = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
-- WHERE Email = 'admin@gmail.com';

-- Cập nhật mật khẩu cho nhân viên
-- UPDATE NguoiDung 
-- SET MatKhau = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
-- WHERE Email = 'nhanvien@gmail.com';

-- Cập nhật mật khẩu cho khách hàng
-- UPDATE NguoiDung 
-- SET MatKhau = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
-- WHERE Email = 'khachhang@gmail.com';

-- LƯU Ý QUAN TRỌNG:
-- 1. Bạn cần tạo hash BCrypt mới cho từng mật khẩu
-- 2. Hash phải bắt đầu bằng $2a$10$ hoặc $2b$10$
-- 3. Mỗi lần hash sẽ tạo ra chuỗi khác nhau (do salt), nhưng đều có thể verify được

