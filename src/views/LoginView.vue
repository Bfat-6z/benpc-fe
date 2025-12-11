<template>
  <div class="bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-danger mb-2">
                  <i class="bi bi-person-circle me-2"></i>Đăng nhập
                </h2>
                <p class="text-muted">Chào mừng bạn quay trở lại AGM Store</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <div class="position-relative">
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
                      class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                      @click="showPassword = !showPassword"
                      style="border: none; background: none; color: #6c757d"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    id="remember"
                    v-model="formData.remember"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <label class="form-check-label" for="remember"> Ghi nhớ đăng nhập </label>
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                </div>

                <button class="btn btn-danger w-100 btn-lg mb-3" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  Đăng nhập
                </button>

                <div class="text-center mb-3">
                  <a href="#" class="text-decoration-none text-muted small">Quên mật khẩu?</a>
                </div>

                <div class="divider d-flex align-items-center my-4">
                  <div class="flex-grow-1 border-top"></div>
                  <span class="px-3 text-muted small">Hoặc</span>
                  <div class="flex-grow-1 border-top"></div>
                </div>

                <div id="google-signin-button" class="mb-3"></div>
                
                <div v-if="!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE'" class="alert alert-warning small">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  Vui lòng cấu hình Google Client ID. Xem file GOOGLE_OAUTH_SETUP.md để biết chi tiết.
                </div>

                <hr class="my-4" />

                <div class="text-center">
                  <p class="text-muted mb-0">
                    Chưa có tài khoản?
                    <RouterLink to="/register" class="text-danger text-decoration-none fw-semibold">
                      Đăng ký ngay
                    </RouterLink>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="text-center mt-3">
            <RouterLink to="/" class="text-decoration-none text-muted">
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
  
  // Ưu tiên: quyen.TenQuyen (từ bảng Quyen) > vaiTro > role > maQuyen
  // Vì backend dùng MaQuyen và bảng Quyen với TenQuyen
  const possibleRoles = [
    user.quyen?.tenQuyen,  // Ưu tiên cao nhất - tên quyền từ bảng Quyen
    user.quyen?.vaiTro,    // Nếu có trong object quyen
    user.vaiTro,           // Field vaiTro trực tiếp
    user.role,             // Field role
    user.maQuyen,          // ID quyền (sẽ cần map nếu là số)
  ]
  
  // Tìm role đầu tiên có giá trị
  let role = null
  for (const r of possibleRoles) {
    if (r !== null && r !== undefined && r !== '') {
      role = String(r).trim()
      break
    }
  }
  
  if (!role) return 'user'
  
  // Normalize role về lowercase để so sánh
  const normalizedRole = role.toLowerCase()
  
  // Map các giá trị có thể có về role chuẩn
  // Xử lý cả số (MaQuyen) nếu backend trả về ID
  if (normalizedRole === 'admin' || normalizedRole === 'administrator' || normalizedRole === '1') {
    return 'admin'
  }
  if (normalizedRole === 'nhanvien' || normalizedRole === 'nhan_vien' || normalizedRole === 'staff' || normalizedRole === 'employee' || normalizedRole === '2') {
    return 'nhanVien'
  }
  if (normalizedRole === 'user' || normalizedRole === '3' || normalizedRole === '0') {
    return 'user'
  }
  
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
.card {
  border-radius: 15px;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.btn-danger {
  border-radius: 8px;
  font-weight: 600;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
  transition: all 0.3s ease;
}

.divider {
  color: #6c757d;
}
</style>

