<template>
  <div class="auth-page">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-lg-6 hero-col">
          <div class="eyebrow">AGM Store · Sign in</div>
          <h1 class="hero-title">
            Truy cập nhanh
            <span class="highlight">kho linh kiện cao cấp</span>
          </h1>
          <p class="hero-sub">
            Đăng nhập để đồng bộ giỏ hàng, theo dõi đơn hàng và nhận ưu đãi dành riêng cho bạn.
          </p>
          <div class="hero-pills d-flex flex-wrap">
            <span class="pill"><i class="bi bi-shield-lock"></i> Bảo mật OAuth</span>
            <span class="pill"><i class="bi bi-graph-up-arrow"></i> Ưu đãi thành viên</span>
            <span class="pill"><i class="bi bi-box-seam"></i> Theo dõi đơn realtime</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="glass-card">
            <div class="card-header-modern">
              <div class="icon-circle"><i class="bi bi-person-circle"></i></div>
              <div>
                <p class="tiny-label">Đăng nhập</p>
                <h3 class="card-title">Chào mừng trở lại</h3>
              </div>
            </div>

            <form class="modern-form" @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-shell">
                  <i class="bi bi-envelope"></i>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu</label>
                <div class="input-shell password-shell">
                  <i class="bi bi-lock"></i>
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    class="ghost-btn"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <label class="d-flex align-items-center gap-2 form-check m-0">
                  <input
                    id="remember"
                    v-model="formData.remember"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" class="link-accent small">Quên mật khẩu?</a>
              </div>

              <div v-if="error" class="alert alert-danger modern-alert" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              </div>

              <button class="primary-btn w-100 mb-3" type="submit" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                Đăng nhập
              </button>

              <div class="divider d-flex align-items-center my-3">
                <div class="flex-grow-1 border-top"></div>
                <span class="px-3 text-muted small">Hoặc</span>
                <div class="flex-grow-1 border-top"></div>
              </div>

              <div id="google-signin-button" class="mb-3"></div>
              
              <div v-if="!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE'" class="alert alert-warning small modern-alert warn">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Vui lòng cấu hình Google Client ID. Xem file GOOGLE_OAUTH_SETUP.md để biết chi tiết.
              </div>

              <div class="text-center">
                <p class="text-muted mb-0">
                  Chưa có tài khoản?
                  <RouterLink to="/register" class="link-accent">
                    Đăng ký ngay
                  </RouterLink>
                </p>
              </div>
            </form>
          </div>

          <div class="text-center mt-3">
            <RouterLink to="/" class="link-muted">
              <i class="bi bi-arrow-left me-1"></i>Quay lại trang chủ
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginWithGoogle } from '../services/authApi'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  remember: false,
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Google OAuth Client ID
// Cách 1: Sử dụng environment variable (khuyến nghị)
// Tạo file .env và thêm: VITE_GOOGLE_CLIENT_ID=your-client-id-here
// Cách 2: Thay thế trực tiếp 'YOUR_GOOGLE_CLIENT_ID_HERE' bằng Client ID của bạn
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '121345999016-k1nkk5k51560ioqqs4e9icmclfj6qc27.apps.googleusercontent.com'

// Helper function để lấy và normalize role
const getUserRole = (user) => {
  if (!user) return 'user'
  
  // Ưu tiên: tenQuyen (có thể ở user.tenQuyen hoặc user.quyen.tenQuyen) > vaiTro > role
  const possibleRoles = [
    user.tenQuyen,         // Tên quyền trực tiếp trên user object (backend có thể trả về đây)
    user.quyen?.tenQuyen,  // Tên quyền từ object quyen (ADMIN / STAFF / USER ...)
    user.quyen?.vaiTro,    // Nếu có trong object quyen
    user.vaiTro,           // Field vaiTro trực tiếp
    user.role,             // Field role tự do
  ]
  
  // Tìm role đầu tiên có giá trị dạng chuỗi
  let role = null
  for (const r of possibleRoles) {
    if (typeof r === 'string' && r.trim() !== '') {
      role = r.trim()
      break
    }
  }
  
  if (!role) return 'user'
  
  // Chuẩn hóa: lowercase + bỏ dấu tiếng Việt để so sánh an toàn
  const raw = role.toLowerCase().trim()
  const ascii = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Map các giá trị có thể có về role chuẩn (admin / staff / user) CHỈ dựa trên chuỗi tên
  if (ascii.includes('admin') || ascii.includes('quantri') || ascii.includes('quan_tri')) {
    return 'admin'
  }
  if (
    ascii.includes('nhanvien') ||
    ascii.includes('nhan vien') ||
    ascii.includes('nhan_vien') ||
    ascii.includes('staff') ||
    ascii.includes('employee')
  ) {
    return 'nhanVien'
  }
  if (
    ascii.includes('user') ||
    ascii.includes('khach') ||
    ascii.includes('khachhang') ||
    ascii.includes('khach_hang') ||
    ascii.includes('customer')
  ) {
    return 'user'
  }
  
  // Nếu không match gì, mặc định là user (khách hàng)
  // Fallback cuối: dùng maQuyen nếu backend chỉ trả ID
  const maQuyen = user.maQuyen || user.quyen?.maQuyen
  if (maQuyen === 1 || maQuyen === '1') return 'admin'
  if (maQuyen === 2 || maQuyen === '2') return 'nhanVien'
  return 'user'
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const user = await login(formData.value.email, formData.value.password)
    
    // Debug: Log user object để kiểm tra structure
    console.log('=== LOGIN DEBUG ===')
    console.log('Full user object:', JSON.stringify(user, null, 2))
    console.log('User.vaiTro:', user.vaiTro)
    console.log('User.role:', user.role)
    console.log('User.maQuyen:', user.maQuyen)
    console.log('User.quyen:', user.quyen)
    console.log('User.quyen?.tenQuyen:', user.quyen?.tenQuyen)
    console.log('User.quyen?.vaiTro:', user.quyen?.vaiTro)
    console.log('User.quyen?.maQuyen:', user.quyen?.maQuyen)
    
    // Lấy role đã được normalize
    const userRole = getUserRole(user)
    console.log('Detected role (normalized):', userRole)
    console.log('Role source check:')
    console.log('  - quyen.tenQuyen:', user.quyen?.tenQuyen || 'null')
    console.log('  - quyen.vaiTro:', user.quyen?.vaiTro || 'null')
    console.log('  - vaiTro:', user.vaiTro || 'null')
    console.log('  - role:', user.role || 'null')
    console.log('  - maQuyen:', user.maQuyen || 'null')
    
    // Normalize user object: đảm bảo có maNguoiDung (camelCase) từ MaNguoiDung (PascalCase)
    const userId = user.maNguoiDung || user.MaNguoiDung || user.id || user.userId
    console.log('User ID fields:')
    console.log('  - maNguoiDung:', user.maNguoiDung)
    console.log('  - MaNguoiDung:', user.MaNguoiDung)
    console.log('  - id:', user.id)
    console.log('  - userId:', user.userId)
    console.log('  - Normalized userId:', userId)
    
    // Lưu thông tin user vào localStorage (đảm bảo có vaiTro và maNguoiDung)
    const userToSave = {
      ...user,
      vaiTro: userRole, // Lưu role đã normalize
      maNguoiDung: userId, // Đảm bảo có maNguoiDung (camelCase)
    }
    console.log('Saving user to localStorage:', userToSave)
    localStorage.setItem('user', JSON.stringify(userToSave))
    localStorage.removeItem('loginMethod') // Xóa flag Google login

    // Remember me (chỉ lưu email, không lưu mật khẩu để tránh rủi ro)
    if (formData.value.remember) {
      setCookie('remember_email', formData.value.email, 30)
      setCookie('remember_flag', '1', 30)
    } else {
      deleteCookie('remember_email')
      deleteCookie('remember_flag')
    }
    
    // Thông báo cho Navbar cập nhật ngay mà không cần F5
    window.dispatchEvent(new Event('user-updated'))

    // Với admin/staff: về trang chủ, tự chọn vào Admin/Staff Panel nếu muốn
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async (response) => {
  loading.value = true
  error.value = ''

  try {
    // Google callback trả về object { credential: "...", select_by: "..." }
    // Cần extract credential từ response
    const credential = typeof response === 'string' ? response : response.credential
    
    if (!credential) {
      throw new Error('Không nhận được credential từ Google')
    }
    
    // Gửi credential token về backend để xác thực
    const user = await loginWithGoogle(credential)
    
    // Debug: Log user object để kiểm tra structure
    console.log('=== GOOGLE LOGIN DEBUG ===')
    console.log('Full user object:', JSON.stringify(user, null, 2))
    
    // Lấy role đã được normalize
    const userRole = getUserRole(user)
    console.log('Detected role (normalized):', userRole)
    
    // Normalize user object: đảm bảo có maNguoiDung (camelCase) từ MaNguoiDung (PascalCase)
    const userId = user.maNguoiDung || user.MaNguoiDung || user.id || user.userId
    console.log('Google Login - User ID fields:')
    console.log('  - maNguoiDung:', user.maNguoiDung)
    console.log('  - MaNguoiDung:', user.MaNguoiDung)
    console.log('  - Normalized userId:', userId)
    
    // Lưu thông tin user vào localStorage (đảm bảo có vaiTro và maNguoiDung)
    const userToSave = {
      ...user,
      vaiTro: userRole, // Lưu role đã normalize
      maNguoiDung: userId, // Đảm bảo có maNguoiDung (camelCase)
    }
    console.log('Saving user to localStorage:', userToSave)
    localStorage.setItem('user', JSON.stringify(userToSave))
    localStorage.setItem('loginMethod', 'google') // Đánh dấu đăng nhập bằng Google

    // Remember me: lưu email nếu chọn
    if (formData.value.remember) {
      setCookie('remember_email', formData.value.email, 30)
      setCookie('remember_flag', '1', 30)
    } else {
      deleteCookie('remember_email')
      deleteCookie('remember_flag')
    }
    
    // Thông báo cho Navbar cập nhật ngay mà không cần F5
    window.dispatchEvent(new Event('user-updated'))

    // Với admin/staff: về trang chủ, tự chọn vào Admin/Staff Panel nếu muốn
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

// Khởi tạo Google Sign-In khi component mount
onMounted(() => {
  // Prefill email/remember từ cookie
  const remembered = getCookie('remember_email')
  if (remembered) {
    formData.value.email = remembered
    formData.value.remember = true
  }

  // Đợi Google Identity Services load xong
  const initGoogleSignIn = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      })
      
      // Render button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          locale: 'vi',
        }
      )
    } else {
      // Retry sau 100ms nếu chưa load xong
      setTimeout(initGoogleSignIn, 100)
    }
  }
  
  // Kiểm tra xem script đã load chưa
  if (document.readyState === 'complete') {
    initGoogleSignIn()
  } else {
    window.addEventListener('load', initGoogleSignIn)
  }
})

// Helpers: cookie đơn giản
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift())
  return null
}

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: radial-gradient(circle at 15% 20%, rgba(230, 244, 255, 0.5), transparent 25%),
    radial-gradient(circle at 85% 0%, rgba(255, 231, 231, 0.5), transparent 22%),
    linear-gradient(135deg, #f8fafc 0%, #f5f7fa 70%, #eef2f7 100%);
  display: flex;
  align-items: center;
  padding: 64px 0;
}

.hero-col {
  animation: fadeUp 0.6s ease 0.1s both;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 13px;
  background: #fff;
  color: #e63946;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(230, 57, 70, 0.15);
}

.hero-title {
  font-size: 38px;
  line-height: 1.2;
  margin: 18px 0 12px;
  font-weight: 700;
  color: #121826;
}

.highlight {
  color: #e63946;
}

.hero-sub {
  color: #5f6b7a;
  max-width: 520px;
  font-size: 16px;
  margin-bottom: 16px;
}

.hero-pills {
  gap: 10px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: #fff;
  color: #1f2937;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  font-weight: 600;
  font-size: 14px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: fadeUp 0.7s ease 0.2s both;
}

.card-header-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffe9ec, #fff);
  color: #e63946;
  display: grid;
  place-items: center;
  font-size: 20px;
  box-shadow: 0 10px 30px rgba(230, 57, 70, 0.18);
}

.tiny-label {
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
  font-size: 12px;
  margin: 0;
}

.card-title {
  margin: 2px 0 0;
  color: #111827;
  font-weight: 700;
}

.modern-form {
  margin-top: 10px;
}

.form-label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
}

.input-shell i {
  color: #9ca3af;
  font-size: 16px;
}

.input-shell:focus-within {
  background: #fff;
  border-color: rgba(230, 57, 70, 0.45);
  box-shadow: 0 8px 26px rgba(230, 57, 70, 0.12);
}

.input-shell .form-control {
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 600;
  color: #111827;
  box-shadow: none;
}

.input-shell .form-control::placeholder {
  color: #b5becd;
  font-weight: 500;
}

.password-shell {
  padding-right: 10px;
}

.ghost-btn {
  border: none;
  background: transparent;
  color: #9ca3af;
  padding: 6px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.ghost-btn:hover {
  color: #e63946;
  background: rgba(230, 57, 70, 0.07);
}

.modern-alert {
  border-radius: 12px;
  border: none;
  padding: 12px 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  background: #fff6f6;
  color: #c53030;
}

.modern-alert.warn {
  background: #fff8eb;
  color: #b45309;
}

.primary-btn {
  border: none;
  border-radius: 12px;
  padding: 14px 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #f25561, #e63946);
  color: #fff;
  box-shadow: 0 16px 32px rgba(230, 57, 70, 0.35);
  transition: transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 18px 36px rgba(230, 57, 70, 0.45);
  filter: brightness(1.03);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 10px 24px rgba(230, 57, 70, 0.3);
}

.primary-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.link-accent {
  color: #e63946;
  font-weight: 700;
  text-decoration: none;
  position: relative;
}

.link-accent::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(226, 57, 70, 0.8), rgba(242, 85, 97, 0.5));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.link-accent:hover::after {
  transform: scaleX(1);
}

.link-muted {
  color: #6b7280;
  text-decoration: none;
  font-weight: 600;
}

.link-muted:hover {
  color: #111827;
}

.divider {
  color: #6c757d;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 991px) {
  .auth-page {
    padding: 40px 0 56px;
  }

  .hero-title {
    font-size: 32px;
  }
}
</style>

