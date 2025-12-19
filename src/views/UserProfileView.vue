<template>
  <div class="profile-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-9">
          <div class="header-row">
            <div>
              <p class="tiny-label">Hồ sơ khách hàng</p>
              <h2 class="title">Quản lý tài khoản của bạn</h2>
              <p class="muted">Cập nhật thông tin, xem đơn và bảo mật tài khoản trong một nơi.</p>
            </div>
          </div>

          <div class="glass-card">
            <!-- Tabs -->
            <div class="pill-tabs mb-4">
              <button
                class="pill-tab"
                :class="{ active: activeTab === 'profile' }"
                @click="activeTab = 'profile'"
                type="button"
              >
                <i class="bi bi-person"></i> Thông tin cá nhân
              </button>
              <button
                class="pill-tab"
                :class="{ active: activeTab === 'orders' }"
                @click="activeTab = 'orders'"
                type="button"
              >
                <i class="bi bi-receipt"></i> Đơn hàng
              </button>
              <button
                class="pill-tab"
                :class="{ active: activeTab === 'password' }"
                @click="activeTab = 'password'"
                type="button"
              >
                <i class="bi bi-key"></i> Đổi mật khẩu
              </button>
              <button
                class="pill-tab"
                :class="{ active: activeTab === 'avatar' }"
                @click="activeTab = 'avatar'"
                type="button"
              >
                <i class="bi bi-image"></i> Ảnh đại diện
              </button>
            </div>

            <!-- Tab Content: Profile -->
            <div v-if="activeTab === 'profile'" class="tab-content">
              <form @submit.prevent="handleUpdateProfile">
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label">Họ và tên</label>
                    <div class="input-shell">
                      <i class="bi bi-person"></i>
                      <input
                        v-model="profileForm.tenNguoiDung"
                        type="text"
                        class="form-control"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <div class="input-shell disabled-shell">
                      <i class="bi bi-envelope"></i>
                      <input
                        v-model="profileForm.email"
                        type="email"
                        class="form-control"
                        disabled
                      />
                    </div>
                    <small class="text-muted">Email không thể thay đổi</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Số điện thoại</label>
                    <div class="input-shell">
                      <i class="bi bi-phone"></i>
                      <input
                        v-model="profileForm.dienThoai"
                        type="tel"
                        class="form-control"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Giới tính</label>
                    <div class="input-shell">
                      <i class="bi bi-gender-ambiguous"></i>
                      <select v-model="profileForm.gioiTinh" class="form-select">
                        <option :value="null">Chọn giới tính</option>
                        <option :value="true">Nam</option>
                        <option :value="false">Nữ</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label">Địa chỉ</label>
                    <div class="input-shell">
                      <i class="bi bi-geo-alt"></i>
                      <input
                        v-model="profileForm.diaChi"
                        type="text"
                        class="form-control"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="profileError" class="alert alert-danger modern-alert mt-3" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ profileError }}
                </div>
                <div v-if="profileSuccess" class="alert alert-success modern-alert success mt-3" role="alert">
                  <i class="bi bi-check-circle me-2"></i>{{ profileSuccess }}
                </div>

                <div class="mt-4">
                  <button class="primary-btn" type="submit" :disabled="profileLoading">
                    <span v-if="profileLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-save me-2"></i>
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>

            <!-- Tab Content: Orders -->
            <div v-if="activeTab === 'orders'" class="tab-content">
              <div v-if="ordersLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="ordersError" class="alert alert-danger modern-alert" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ ordersError }}
              </div>
              <div v-else>
                <div v-if="!orders.length" class="alert alert-info modern-alert">
                  <i class="bi bi-info-circle me-2"></i>Chưa có đơn hàng nào.
                </div>
                <div v-else class="table-responsive modern-table">
                  <table class="table align-middle">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th class="text-end">Tổng tiền</th>
                        <th class="text-end">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in orders" :key="order.maHoaDon">
                        <td class="fw-semibold">#{{ order.maHoaDon }}</td>
                        <td>{{ formatDate(order.ngayLap) }}</td>
                        <td>
                          <span class="badge bg-warning text-dark">
                            {{ order.trangThai || 'Chờ xác nhận' }}
                          </span>
                        </td>
                        <td class="text-end text-danger fw-bold">{{ formatCurrency(order.tongTien) }}</td>
                        <td class="text-end">
                          <RouterLink class="btn btn-sm btn-outline-danger" :to="`/orders/${order.maHoaDon}`">
                            <i class="bi bi-eye me-1"></i>Xem chi tiết
                          </RouterLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Tab Content: Password -->
            <div v-if="activeTab === 'password'" class="tab-content">
              <form @submit.prevent="handleChangePassword">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label">Mật khẩu hiện tại</label>
                    <div class="input-shell password-shell">
                      <i class="bi bi-lock"></i>
                      <input
                        v-model="passwordForm.matKhauCu"
                        :type="showOldPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                      <button
                        type="button"
                        class="ghost-btn"
                        @click="showOldPassword = !showOldPassword"
                      >
                        <i :class="showOldPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Mật khẩu mới</label>
                    <div class="input-shell password-shell">
                      <i class="bi bi-shield-lock"></i>
                      <input
                        v-model="passwordForm.matKhauMoi"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        required
                        minlength="6"
                      />
                      <button
                        type="button"
                        class="ghost-btn"
                        @click="showNewPassword = !showNewPassword"
                      >
                        <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Xác nhận mật khẩu mới</label>
                    <div class="input-shell password-shell">
                      <i class="bi bi-check2-circle"></i>
                      <input
                        v-model="passwordForm.xacNhanMatKhau"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập lại mật khẩu mới"
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
                    <div
                      v-if="passwordForm.matKhauMoi && passwordForm.xacNhanMatKhau && passwordForm.matKhauMoi !== passwordForm.xacNhanMatKhau"
                      class="text-danger small mt-1"
                    >
                      <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
                    </div>
                  </div>
                </div>

                <div v-if="passwordError" class="alert alert-danger modern-alert mt-3" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ passwordError }}
                </div>
                <div v-if="passwordSuccess" class="alert alert-success modern-alert success mt-3" role="alert">
                  <i class="bi bi-check-circle me-2"></i>{{ passwordSuccess }}
                </div>

                <div class="mt-4">
                  <button
                    class="primary-btn"
                    type="submit"
                    :disabled="passwordLoading || passwordForm.matKhauMoi !== passwordForm.xacNhanMatKhau"
                  >
                    <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-key me-2"></i>
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>

            <!-- Tab Content: Avatar -->
            <div v-if="activeTab === 'avatar'" class="tab-content">
              <div class="text-center mb-4">
                <div class="avatar-frame mb-3">
                  <img
                    v-if="avatarPreview || currentUser?.avatar"
                    :src="avatarPreview || currentUser?.avatar"
                    alt="Avatar"
                  />
                  <div v-else class="avatar-placeholder">
                    <i class="bi bi-person-circle"></i>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">URL ảnh đại diện</label>
                  <div class="input-shell">
                    <i class="bi bi-link-45deg"></i>
                    <input
                      v-model="avatarForm.avatar"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com/avatar.jpg"
                      @input="avatarPreview = avatarForm.avatar"
                    />
                  </div>
                  <small class="text-muted">Nhập URL ảnh từ internet</small>
                </div>
              </div>

              <div v-if="avatarError" class="alert alert-danger modern-alert mt-3" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ avatarError }}
              </div>
              <div v-if="avatarSuccess" class="alert alert-success modern-alert success mt-3" role="alert">
                <i class="bi bi-check-circle me-2"></i>{{ avatarSuccess }}
              </div>

              <div class="mt-4 text-center">
                <button
                  class="primary-btn"
                  @click="handleUpdateAvatar"
                  :disabled="avatarLoading || !avatarForm.avatar"
                >
                  <span v-if="avatarLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-image me-2"></i>
                  Cập nhật ảnh đại diện
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, updateProfile, changePassword, updateAvatar } from '../services/authApi'
import { fetchOrders, createAddress } from '../services/orderApi'

const router = useRouter()
const route = useRoute()

const activeTab = ref('profile')
const currentUser = ref(null)

// Profile form
const profileForm = ref({
  tenNguoiDung: '',
  email: '',
  dienThoai: '',
  gioiTinh: null,
  diaChi: '',
})
const profileLoading = ref(false)
const profileError = ref('')
const profileSuccess = ref('')

// Password form
const passwordForm = ref({
  matKhauCu: '',
  matKhauMoi: '',
  xacNhanMatKhau: '',
})
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

// Avatar form
const avatarForm = ref({
  avatar: '',
})
const avatarPreview = ref('')
const avatarLoading = ref(false)
const avatarError = ref('')
const avatarSuccess = ref('')

// Orders
const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')

// Load địa chỉ gần nhất từ lịch sử
const getLatestAddress = (userId) => {
  try {
    const historyKey = `addressHistory_${userId || 'guest'}`
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]')
    
    // Trả về địa chỉ gần nhất (đầu tiên trong danh sách)
    if (history.length > 0) {
      return history[0].diaChiChiTiet || history[0].diaChi || ''
    }
    return ''
  } catch (e) {
    console.error('Error loading latest address:', e)
    return ''
  }
}

// Lưu lịch sử địa chỉ vào localStorage
const saveAddressHistory = (address) => {
  if (!address || !address.trim()) return
  
  try {
    const historyKey = `addressHistory_${currentUser.value?.maNguoiDung || 'guest'}`
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]')
    
    // Loại bỏ địa chỉ trùng lặp
    history = history.filter(addr => addr.diaChiChiTiet !== address.trim())
    
    // Thêm địa chỉ mới vào đầu danh sách
    history.unshift({
      diaChiChiTiet: address.trim(),
      createdAt: new Date().toISOString()
    })
    
    // Giới hạn tối đa 3 địa chỉ gần nhất
    if (history.length > 3) {
      history = history.slice(0, 3)
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history))
  } catch (e) {
    console.error('Error saving address history:', e)
  }
}

const loadUserData = async () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    currentUser.value = user

    // Load full user data from API
    const fullUser = await getCurrentUser(user.maNguoiDung)
    currentUser.value = fullUser

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(fullUser))

    // Populate forms
    // Ưu tiên dùng địa chỉ từ user, nếu không có thì dùng địa chỉ gần nhất từ lịch sử
    const userAddress = fullUser.diaChi || ''
    const latestAddress = getLatestAddress(fullUser.maNguoiDung)
    const addressToUse = userAddress || latestAddress
    
    profileForm.value = {
      tenNguoiDung: fullUser.tenNguoiDung || '',
      email: fullUser.email || '',
      dienThoai: fullUser.dienThoai || '',
      gioiTinh: fullUser.gioiTinh,
      diaChi: addressToUse,
    }
    avatarForm.value.avatar = fullUser.avatar || ''
    avatarPreview.value = fullUser.avatar || ''
  } catch (err) {
    console.error('Error loading user data:', err)
    router.push('/login')
  }
}

const handleUpdateProfile = async () => {
  profileLoading.value = true
  profileError.value = ''
  profileSuccess.value = ''

  try {
    // Lưu địa chỉ cũ để so sánh
    const oldAddress = currentUser.value?.diaChi || ''
    const newAddress = profileForm.value.diaChi || ''
    
    // Cập nhật profile
    const updated = await updateProfile(currentUser.value.maNguoiDung, profileForm.value)
    currentUser.value = updated
    localStorage.setItem('user', JSON.stringify(updated))
    
    // Nếu địa chỉ thay đổi và có giá trị, tự động tạo địa chỉ mới và lưu vào lịch sử
    if (newAddress && newAddress.trim() !== oldAddress.trim()) {
      try {
        // Tạo địa chỉ mới trong hệ thống
        await createAddress({ diaChiChiTiet: newAddress.trim() })
        
        // Lưu vào lịch sử địa chỉ
        saveAddressHistory(newAddress.trim())
      } catch (addrErr) {
        console.error('Error creating address:', addrErr)
        // Không block việc cập nhật profile nếu tạo địa chỉ thất bại
      }
    }
    
    profileSuccess.value = 'Cập nhật thông tin thành công!'
  } catch (err) {
    profileError.value = err.message || 'Cập nhật thất bại. Vui lòng thử lại.'
  } finally {
    profileLoading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.value.matKhauMoi !== passwordForm.value.xacNhanMatKhau) {
    passwordError.value = 'Mật khẩu mới và xác nhận không khớp'
    return
  }

  passwordLoading.value = true
  passwordError.value = ''
  passwordSuccess.value = ''

  try {
    await changePassword(
      currentUser.value.maNguoiDung,
      passwordForm.value.matKhauCu,
      passwordForm.value.matKhauMoi
    )
    passwordSuccess.value = 'Đổi mật khẩu thành công!'
    passwordForm.value = {
      matKhauCu: '',
      matKhauMoi: '',
      xacNhanMatKhau: '',
    }
  } catch (err) {
    passwordError.value = err.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
  } finally {
    passwordLoading.value = false
  }
}

const handleUpdateAvatar = async () => {
  avatarLoading.value = true
  avatarError.value = ''
  avatarSuccess.value = ''

  try {
    const updated = await updateAvatar(currentUser.value.maNguoiDung, avatarForm.value.avatar)
    currentUser.value = updated
    localStorage.setItem('user', JSON.stringify(updated))
    avatarSuccess.value = 'Cập nhật ảnh đại diện thành công!'
  } catch (err) {
    avatarError.value = err.message || 'Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.'
  } finally {
    avatarLoading.value = false
  }
}

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return '0đ'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

const loadOrders = async () => {
  ordersLoading.value = true
  ordersError.value = ''
  try {
    orders.value = await fetchOrders()
  } catch (err) {
    ordersError.value = err.message || 'Không thể tải danh sách đơn hàng'
  } finally {
    ordersLoading.value = false
  }
}

onMounted(() => {
  // Check if tab is specified in query
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
  loadUserData()
  loadOrders()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 72px 0 80px;
  background: radial-gradient(circle at 18% 10%, rgba(230, 244, 255, 0.5), transparent 25%),
    radial-gradient(circle at 85% 8%, rgba(255, 231, 231, 0.5), transparent 22%),
    linear-gradient(135deg, #f8fafc 0%, #f5f7fa 70%, #eef2f7 100%);
}

.header-row {
  margin-bottom: 18px;
  animation: fadeUp 0.6s ease both;
}

.title {
  font-weight: 800;
  color: #111827;
  margin: 2px 0 6px;
}

.muted {
  color: #6b7280;
}

.glass-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: fadeUp 0.65s ease 0.1s both;
}

.pill-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill-tab {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.pill-tab.active {
  border-color: rgba(230, 57, 70, 0.4);
  color: #e63946;
  box-shadow: 0 12px 24px rgba(230, 57, 70, 0.08);
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

.disabled-shell {
  background: #f3f4f6;
}

.input-shell .form-control,
.input-shell .form-select {
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

.primary-btn {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
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

.modern-table table {
  border-radius: 12px;
  overflow: hidden;
}

.modern-table thead {
  background: #f9fafb;
  color: #4b5563;
}

.modern-table .table {
  margin-bottom: 0;
}

.avatar-frame {
  width: 160px;
  height: 160px;
  border-radius: 24px;
  overflow: hidden;
  margin: 0 auto;
  background: #f3f4f6;
  border: 2px solid rgba(230, 57, 70, 0.25);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.avatar-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #e63946;
  font-size: 100px;
  background: linear-gradient(135deg, #fff, #fef2f2);
}

.tiny-label {
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
  font-size: 12px;
  margin: 0;
}

.tab-content {
  animation: fadeUp 0.35s ease both;
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

@media (max-width: 768px) {
  .glass-card {
    padding: 18px;
  }
}
</style>

