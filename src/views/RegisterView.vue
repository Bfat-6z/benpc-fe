<template>
  <div class="register-page">
    <div class="register-hero">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-6 hero-copy">
            <div class="eyebrow badge-soft">New account · Premium gear</div>
            <h1 class="headline">
              Mua sắm phần cứng cao cấp
              <span class="highlight">nhanh & an tâm</span>
            </h1>
            <p class="subhead">
              Đăng ký để lưu thông tin giao hàng, nhận ưu đãi dành riêng cho bạn và cập nhật các sản phẩm mới nhất.
            </p>
            <div class="hero-stats d-flex flex-wrap">
              <div class="stat-chip">
                <i class="bi bi-truck"></i>
                Giao nhanh toàn quốc
              </div>
              <div class="stat-chip">
                <i class="bi bi-shield-check"></i>
                Bảo hành chính hãng
              </div>
              <div class="stat-chip">
                <i class="bi bi-gift"></i>
                Ưu đãi thành viên
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="glass-card">
              <div class="card-header-modern">
                <div class="icon-circle">
                  <i class="bi bi-person-plus"></i>
                </div>
                <div>
                  <p class="tiny-label">Tạo tài khoản</p>
                  <h3 class="card-title">Bắt đầu hành trình mua sắm</h3>
                </div>
              </div>

              <form class="modern-form" @submit.prevent="handleRegister">
                <div class="row gx-3 gy-3">
                  <div class="col-md-6">
                    <label for="ho" class="form-label">Họ</label>
                    <div class="input-shell">
                      <i class="bi bi-person"></i>
                      <input
                        id="ho"
                        v-model="formData.ho"
                        type="text"
                        class="form-control"
                        placeholder="Nhập họ"
                        required
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="ten" class="form-label">Tên</label>
                    <div class="input-shell">
                      <i class="bi bi-person-badge"></i>
                      <input
                        id="ten"
                        v-model="formData.ten"
                        type="text"
                        class="form-control"
                        placeholder="Nhập tên"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div class="row gx-3 gy-3">
                  <div class="col-12">
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

                  <div class="col-12">
                    <label for="phone" class="form-label">Số điện thoại</label>
                    <div class="input-shell">
                      <i class="bi bi-phone"></i>
                      <input
                        id="phone"
                        v-model="formData.soDienThoai"
                        type="tel"
                        class="form-control"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div class="row gx-3 gy-3">
                  <div class="col-12">
                    <label for="address" class="form-label">Địa chỉ</label>
                    <div class="input-shell">
                      <i class="bi bi-geo-alt"></i>
                      <input
                        id="address"
                        v-model="formData.diaChi"
                        type="text"
                        class="form-control"
                        placeholder="Nhập địa chỉ (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div class="row gx-3 gy-3">
                  <div class="col-md-6">
                    <label for="password" class="form-label">
                      Mật khẩu
                      <span class="text-danger">*</span>
                    </label>
                    <div class="input-shell password-shell">
                      <i class="bi bi-lock"></i>
                      <input
                        id="password"
                        v-model="formData.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        :class="{ 'is-invalid': formData.password && formData.password.length < 6 }"
                        placeholder="Nhập mật khẩu"
                        required
                        minlength="6"
                        @input="validatePassword"
                      />
                      <button
                        type="button"
                        class="ghost-btn"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div class="helper-text" :class="formData.password && formData.password.length > 0 && formData.password.length < 6 ? 'text-danger fw-semibold' : 'text-muted'">
                      <i class="bi me-1" :class="formData.password && formData.password.length > 0 && formData.password.length < 6 ? 'bi-exclamation-triangle' : 'bi-info-circle'"></i>
                      <span v-if="formData.password && formData.password.length > 0">
                        Mật khẩu phải có tối thiểu <strong>6 ký tự</strong> (hiện tại: <strong>{{ formData.password.length }}/6</strong> ký tự)
                      </span>
                      <span v-else>
                        Mật khẩu phải có tối thiểu <strong>6 ký tự</strong>
                      </span>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
                    <div class="input-shell password-shell">
                      <i class="bi bi-shield-lock"></i>
                      <input
                        id="confirmPassword"
                        v-model="formData.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        class="ghost-btn"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div v-if="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword" class="text-danger small mt-1">
                      <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
                    </div>
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger modern-alert" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                </div>

                <div v-if="success" class="alert alert-success modern-alert success" role="alert">
                  <i class="bi bi-check-circle me-2"></i>{{ success }}
                </div>

                <button class="primary-btn w-100 mb-2" type="submit" :disabled="loading || !isFormValid">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-person-plus me-2"></i>
                  Đăng ký
                </button>

                <div class="text-center mt-2">
                  <p class="text-muted mb-0">
                    Đã có tài khoản?
                    <RouterLink to="/login" class="link-accent">
                      Đăng nhập ngay
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authApi'

const router = useRouter()

const formData = ref({
  ho: '',
  ten: '',
  email: '',
  soDienThoai: '',
  diaChi: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const validatePassword = () => {
  // Validation được xử lý bởi HTML5 và computed property
}

const isFormValid = computed(() => {
  return (
    formData.value.ho &&
    formData.value.ten &&
    formData.value.email &&
    formData.value.soDienThoai &&
    formData.value.diaChi &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.password === formData.value.confirmPassword &&
    formData.value.password.length >= 6
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu khớp nhau'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const user = await register({
      ho: formData.value.ho,
      ten: formData.value.ten,
      email: formData.value.email,
      soDienThoai: formData.value.soDienThoai,
      diaChi: formData.value.diaChi,
      password: formData.value.password,
    })
    
    // Lưu địa chỉ vào localStorage để dùng khi thanh toán
    if (formData.value.diaChi) {
      localStorage.setItem('userAddress', JSON.stringify({
        diaChi: formData.value.diaChi,
      }))
    }
    
    success.value = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Đăng ký thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(230, 244, 255, 0.6), transparent 25%),
    radial-gradient(circle at 80% 0%, rgba(255, 231, 231, 0.55), transparent 22%),
    linear-gradient(135deg, #f8fafc 0%, #f5f7fa 70%, #eef2f7 100%);
  display: flex;
  align-items: stretch;
  padding: 56px 0 64px;
}

.register-hero {
  position: relative;
  overflow: hidden;
}

.register-hero::after {
  content: '';
  position: absolute;
  inset: 30px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.15));
  filter: blur(24px);
  z-index: 0;
}

.hero-copy {
  position: relative;
  z-index: 1;
  padding-right: 24px;
  animation: fadeUp 0.7s ease 0.1s both;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 13px;
  letter-spacing: 0.3px;
  background: #fff;
  color: #e63946;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.badge-soft {
  border: 1px solid rgba(230, 57, 70, 0.15);
}

.headline {
  font-size: 38px;
  line-height: 1.2;
  margin: 18px 0 12px;
  font-weight: 700;
  color: #121826;
}

.highlight {
  color: #e63946;
}

.subhead {
  color: #5f6b7a;
  font-size: 16px;
  margin-bottom: 18px;
  max-width: 540px;
}

.hero-stats {
  gap: 10px;
}

.stat-chip {
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
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: fadeUp 0.8s ease 0.15s both;
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
  margin-top: 12px;
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

.helper-text {
  margin-top: 6px;
  font-size: 13px;
}

.modern-alert {
  border-radius: 12px;
  border: none;
  padding: 12px 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  background: #fff6f6;
  color: #c53030;
}

.modern-alert.success {
  background: #f0fdf4;
  color: #15803d;
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

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 991px) {
  .register-page {
    padding: 32px 0 48px;
  }

  .headline {
    font-size: 32px;
  }

  .glass-card {
    margin-top: 6px;
  }
}

@media (max-width: 575px) {
  .input-shell {
    padding: 12px;
  }

  .card-header-modern {
    flex-direction: row;
    align-items: center;
  }
}
</style>

