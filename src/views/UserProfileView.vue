<template>
  <div class="bg-light min-vh-100 py-5" style="margin-top: 80px">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-danger text-white">
              <h4 class="mb-0">
                <i class="bi bi-person-circle me-2"></i>Thông tin tài khoản
              </h4>
            </div>
            <div class="card-body p-4">
              <!-- Tabs -->
              <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'profile' }"
                    @click="activeTab = 'profile'"
                    type="button"
                  >
                    <i class="bi bi-person me-2"></i>Thông tin cá nhân
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'orders' }"
                    @click="activeTab = 'orders'"
                    type="button"
                  >
                    <i class="bi bi-receipt me-2"></i>Đơn hàng
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'password' }"
                    @click="activeTab = 'password'"
                    type="button"
                  >
                    <i class="bi bi-key me-2"></i>Đổi mật khẩu
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'avatar' }"
                    @click="activeTab = 'avatar'"
                    type="button"
                  >
                    <i class="bi bi-image me-2"></i>Ảnh đại diện
                  </button>
                </li>
              </ul>

              <!-- Tab Content: Profile -->
              <div v-if="activeTab === 'profile'" class="tab-content">
                <form @submit.prevent="handleUpdateProfile">
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label">Họ và tên</label>
                      <input
                        v-model="profileForm.tenNguoiDung"
                        type="text"
                        class="form-control"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input
                        v-model="profileForm.email"
                        type="email"
                        class="form-control"
                        disabled
                      />
                      <small class="text-muted">Email không thể thay đổi</small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Số điện thoại</label>
                      <input
                        v-model="profileForm.dienThoai"
                        type="tel"
                        class="form-control"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Giới tính</label>
                      <select v-model="profileForm.gioiTinh" class="form-select">
                        <option :value="null">Chọn giới tính</option>
                        <option :value="true">Nam</option>
                        <option :value="false">Nữ</option>
                      </select>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label">Địa chỉ</label>
                      <input
                        v-model="profileForm.diaChi"
                        type="text"
                        class="form-control"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>

                  <div v-if="profileError" class="alert alert-danger mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>{{ profileError }}
                  </div>
                  <div v-if="profileSuccess" class="alert alert-success mt-3" role="alert">
                    <i class="bi bi-check-circle me-2"></i>{{ profileSuccess }}
                  </div>

                  <div class="mt-4">
                    <button class="btn btn-danger" type="submit" :disabled="profileLoading">
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
                <div v-else-if="ordersError" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ ordersError }}
                </div>
                <div v-else>
                  <div v-if="!orders.length" class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>Chưa có đơn hàng nào.
                  </div>
                  <div v-else class="table-responsive">
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
                  <div class="mb-3">
                    <label class="form-label">Mật khẩu hiện tại</label>
                    <div class="position-relative">
                      <input
                        v-model="passwordForm.matKhauCu"
                        :type="showOldPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                      <button
                        type="button"
                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                        @click="showOldPassword = !showOldPassword"
                        style="border: none; background: none; color: #6c757d"
                      >
                        <i :class="showOldPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Mật khẩu mới</label>
                    <div class="position-relative">
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
                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                        @click="showNewPassword = !showNewPassword"
                        style="border: none; background: none; color: #6c757d"
                      >
                        <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Xác nhận mật khẩu mới</label>
                    <div class="position-relative">
                      <input
                        v-model="passwordForm.xacNhanMatKhau"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        placeholder="Nhập lại mật khẩu mới"
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
                    <div
                      v-if="passwordForm.matKhauMoi && passwordForm.xacNhanMatKhau && passwordForm.matKhauMoi !== passwordForm.xacNhanMatKhau"
                      class="text-danger small mt-1"
                    >
                      <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
                    </div>
                  </div>

                  <div v-if="passwordError" class="alert alert-danger mt-3" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>{{ passwordError }}
                  </div>
                  <div v-if="passwordSuccess" class="alert alert-success mt-3" role="alert">
                    <i class="bi bi-check-circle me-2"></i>{{ passwordSuccess }}
                  </div>

                  <div class="mt-4">
                    <button
                      class="btn btn-danger"
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
                  <div class="mb-3">
                    <img
                      v-if="avatarPreview || currentUser?.avatar"
                      :src="avatarPreview || currentUser?.avatar"
                      alt="Avatar"
                      class="rounded-circle border border-3 border-danger"
                      style="width: 150px; height: 150px; object-fit: cover"
                    />
                    <div
                      v-else
                      class="rounded-circle border border-3 border-danger d-inline-flex align-items-center justify-content-center bg-light"
                      style="width: 150px; height: 150px"
                    >
                      <i class="bi bi-person-circle" style="font-size: 100px; color: #dc3545"></i>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">URL ảnh đại diện</label>
                    <input
                      v-model="avatarForm.avatar"
                      type="url"
                      class="form-control"
                      placeholder="https://example.com/avatar.jpg"
                      @input="avatarPreview = avatarForm.avatar"
                    />
                    <small class="text-muted">Nhập URL ảnh từ internet</small>
                  </div>
                </div>

                <div v-if="avatarError" class="alert alert-danger mt-3" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>{{ avatarError }}
                </div>
                <div v-if="avatarSuccess" class="alert alert-success mt-3" role="alert">
                  <i class="bi bi-check-circle me-2"></i>{{ avatarSuccess }}
                </div>

                <div class="mt-4 text-center">
                  <button
                    class="btn btn-danger"
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
.card {
  border-radius: 15px;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #dc3545;
  color: #dc3545;
}

.nav-tabs .nav-link.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
  background: none;
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
</style>

