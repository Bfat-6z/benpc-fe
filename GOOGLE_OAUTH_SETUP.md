# Hướng dẫn cấu hình Google OAuth

## Bước 1: Tạo Google OAuth Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một dự án mới hoặc chọn dự án hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Nếu chưa có, cấu hình **OAuth consent screen**:
   - Chọn **External** (hoặc Internal nếu dùng Google Workspace)
   - Điền thông tin: App name, User support email, Developer contact email
   - Click **Save and Continue**
6. Tạo **OAuth client ID**:
   - Application type: **Web application**
   - Name: Tên ứng dụng của bạn
   - Authorized JavaScript origins: 
     - `http://localhost:5173` (cho development)
     - `http://localhost:3000` (nếu dùng port khác)
     - URL production của bạn (ví dụ: `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:5173` (cho development)
     - URL production của bạn
   - Click **Create**
7. Copy **Client ID** (dạng: `xxxxx-xxxxx.apps.googleusercontent.com`)

## Bước 2: Cấu hình trong code

Mở file `src/views/LoginView.vue` và thay thế:

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'
```

Bằng Client ID bạn vừa copy:

```javascript
const GOOGLE_CLIENT_ID = 'xxxxx-xxxxx.apps.googleusercontent.com'
```

## Bước 3: Cấu hình Backend

Backend cần có endpoint `/api/nguoi-dung/google-login` để xử lý Google credential token.

Endpoint này sẽ:
1. Verify Google credential token
2. Lấy thông tin user từ Google (email, name, avatar)
3. Tạo hoặc tìm user trong database
4. Trả về thông tin user đã đăng nhập

## Lưu ý

- Không commit Client ID vào Git nếu là public repository
- Sử dụng environment variables cho production
- Đảm bảo Authorized JavaScript origins và redirect URIs khớp với domain của bạn

