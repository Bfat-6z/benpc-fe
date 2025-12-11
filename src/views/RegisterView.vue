<template>
  <div class="bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-danger mb-2">
                  <i class="bi bi-person-plus me-2"></i>Đăng ký
                </h2>
                <p class="text-muted">Tạo tài khoản mới để bắt đầu mua sắm</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="ho" class="form-label">Họ</label>
                    <input
                      id="ho"
                      v-model="formData.ho"
                      type="text"
                      class="form-control"
                      placeholder="Nhập họ"
                      required
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="ten" class="form-label">Tên</label>
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

                <div class="mb-3 mt-3">
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
                  <label for="phone" class="form-label">Số điện thoại</label>
                  <input
                    id="phone"
                    v-model="formData.soDienThoai"
                    type="tel"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="address" class="form-label">Địa chỉ</label>
                  <input
                    id="address"
                    v-model="formData.diaChi"
                    type="text"
                    class="form-control"
                    placeholder="Nhập địa chỉ (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">
                    Mật khẩu
                    <span class="text-danger">*</span>
                  </label>
                  <div class="position-relative">
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
                      class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                      @click="showPassword = !showPassword"
                      style="border: none; background: none; color: #6c757d"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div class="form-text" :class="formData.password && formData.password.length > 0 && formData.password.length < 6 ? 'text-danger fw-semibold' : 'text-muted'">
                    <i class="bi me-1" :class="formData.password && formData.password.length > 0 && formData.password.length < 6 ? 'bi-exclamation-triangle' : 'bi-info-circle'"></i>
                    <span v-if="formData.password && formData.password.length > 0">
                      Mật khẩu phải có tối thiểu <strong>6 ký tự</strong> (hiện tại: <strong>{{ formData.password.length }}/6</strong> ký tự)
                    </span>
                    <span v-else>
                      Mật khẩu phải có tối thiểu <strong>6 ký tự</strong>
                    </span>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
                  <div class="position-relative">
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
                      class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                      @click="showConfirmPassword = !showConfirmPassword"
                      style="border: none; background: none; color: #6c757d"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword" class="text-danger small mt-1">
                    <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                </div>

                <div v-if="success" class="alert alert-success" role="alert">
                  <i class="bi bi-check-circle me-2"></i>{{ success }}
                </div>

                <button class="btn btn-danger w-100 btn-lg mb-3" type="submit" :disabled="loading || !isFormValid">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-person-plus me-2"></i>
                  Đăng ký
                </button>

                <div class="text-center">
                  <p class="text-muted mb-0">
                    Đã có tài khoản?
                    <RouterLink to="/login" class="text-danger text-decoration-none fw-semibold">
                      Đăng nhập ngay
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

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  transition: all 0.3s ease;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

