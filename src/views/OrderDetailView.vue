<template>
  <div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p class="text-primary text-uppercase fw-semibold mb-1">Chi tiết đơn hàng</p>
        <h1 class="h4 mb-0">Đơn #{{ route.params.id }}</h1>
      </div>
    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary" @click="handleBack">Quay lại</button>
      <RouterLink class="btn btn-primary" to="/">Tiếp tục mua</RouterLink>
    </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="order" class="row gy-3">
      <div class="col-12 col-lg-7">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div class="text-muted">Trạng thái</div>
                <div class="fw-semibold">{{ order.trangThai || 'Đang xử lý' }}</div>
              </div>
              <div class="text-end">
                <div class="text-muted">Tổng cộng</div>
                <div class="h5 text-primary mb-0">{{ formatCurrency(order.tongTien) }}</div>
              </div>
            </div>

            <div class="list-group">
              <div
                v-for="item in order.danhSachChiTiet"
                :key="item.maCT"
                class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
              >
                <div>
                  <div class="fw-semibold">{{ item.sanPham?.tenSP || 'Sản phẩm' }}</div>
                  <small class="text-muted">
                    Đơn giá: {{ formatCurrency(item.donGia) }} | SL: {{ item.soLuong }}
                  </small>
                </div>
                <div class="fw-semibold text-primary">
                  {{ formatCurrency((item.donGia || 0) * item.soLuong) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">Thông tin giao hàng</h5>
            <div class="mb-2">
              <div class="text-muted">Khách hàng</div>
              <div class="fw-semibold">{{ order.nguoiDung?.hoTen || 'Khách lẻ' }}</div>
            </div>
            <div class="mb-2" v-if="order.diaChi">
              <div class="text-muted">Địa chỉ</div>
              <div class="fw-semibold">{{ formatAddress(order.diaChi) }}</div>
            </div>
            <div class="mb-2">
              <div class="text-muted">Ngày lập</div>
              <div class="fw-semibold">{{ formatDate(order.ngayLap) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchOrderById as fetchOrderByIdUser } from '../services/orderApi'
import { fetchOrderById as fetchOrderByIdAdmin } from '../services/adminApi'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(true)
const error = ref('')

// Helper function để lấy role của user (giống với LoginView và AdminDashboard)
// Backend trả về quyen.TenQuyen từ bảng Quyen
const getUserRole = (user) => {
  if (!user) return 'user'
  
  console.log('OrderDetailView - Full user object:', user)
  
  // Ưu tiên: quyen.TenQuyen (từ bảng Quyen) > quyen.tenQuyen > vaiTro > role > maQuyen
  const possibleRoles = [
    user.quyen?.TenQuyen,  // PascalCase (từ database)
    user.quyen?.tenQuyen,  // camelCase
    user.quyen?.vaiTro,
    user.vaiTro,
    user.role,
    user.maQuyen,
  ]
  
  let role = null
  for (const r of possibleRoles) {
    if (r !== null && r !== undefined && r !== '') {
      role = String(r).trim()
      break
    }
  }
  
  console.log('OrderDetailView - Extracted role:', role)
  
  if (!role) return 'user'
  
  const normalizedRole = role.toLowerCase()
  
  // Check các format có thể có của admin (tiếng Anh và tiếng Việt)
  if (normalizedRole === 'admin' || normalizedRole === 'administrator' || normalizedRole === '1' || 
      normalizedRole.includes('admin') || role === 'Admin') {
    console.log('OrderDetailView - Detected as admin')
    return 'admin'
  }
  // Check các format có thể có của nhân viên (tiếng Anh và tiếng Việt)
  if (normalizedRole === 'nhanvien' || normalizedRole === 'nhan_vien' || normalizedRole === 'staff' || 
      normalizedRole === 'employee' || normalizedRole === '2' || normalizedRole.includes('nhan') ||
      normalizedRole.includes('viên') || normalizedRole.includes('staff') || 
      role === 'Nhân viên' || role === 'NhanVien') {
    console.log('OrderDetailView - Detected as nhanVien')
    return 'nhanVien'
  }
  // Check các format có thể có của user (tiếng Anh và tiếng Việt)
  if (normalizedRole === 'user' || normalizedRole === '3' || normalizedRole === '0' ||
      normalizedRole.includes('khách') || normalizedRole.includes('customer') ||
      role === 'Khách hàng' || role === 'User') {
    console.log('OrderDetailView - Detected as user')
    return 'user'
  }
  
  console.log('OrderDetailView - Default to user')
  return 'user'
}

const formatCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : value || ''

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return `${date.toLocaleDateString('vi-VN')}`
}

const formatAddress = (addr) =>
  [addr.soNha, addr.duong, addr.phuongXa, addr.quanHuyen, addr.tinhThanh]
    .filter(Boolean)
    .join(', ')

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    // Kiểm tra nếu user là admin hoặc staff thì dùng admin endpoint
    const userStr = localStorage.getItem('user')
    let isAdminOrStaff = false
    let userRole = 'user'
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userRole = getUserRole(user)
        isAdminOrStaff = userRole === 'admin' || userRole === 'nhanVien'
        console.log('OrderDetailView - User:', user)
        console.log('OrderDetailView - Detected role:', userRole)
        console.log('OrderDetailView - isAdminOrStaff:', isAdminOrStaff)
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    } else {
      console.warn('OrderDetailView - No user found in localStorage')
    }
    
    // LUÔN thử admin endpoint trước nếu là admin/staff
    if (isAdminOrStaff) {
      console.log('OrderDetailView - User is admin/staff, using admin endpoint:', `/admin/hoa-don/${route.params.id}`)
      console.log('OrderDetailView - User object:', JSON.stringify(userStr ? JSON.parse(userStr) : null, null, 2))
      
      // Admin/Staff PHẢI dùng admin endpoint, không fallback về user endpoint
      try {
        order.value = await fetchOrderByIdAdmin(route.params.id)
        console.log('OrderDetailView - Successfully loaded from admin endpoint')
        return // Thành công
      } catch (adminErr) {
        console.error('OrderDetailView - Admin endpoint error:', adminErr)
        console.error('OrderDetailView - Error status:', adminErr.status)
        console.error('OrderDetailView - Error message:', adminErr.message)
        
        // Nếu admin endpoint không tồn tại (404), có thể backend chưa được rebuild
        // Trong trường hợp này, vẫn KHÔNG fallback về user endpoint vì user endpoint sẽ check ownership
        // Thay vào đó, throw lỗi rõ ràng
        if (adminErr.status === 404) {
          throw new Error('Admin endpoint chưa được triển khai. Vui lòng rebuild backend và đảm bảo endpoint /api/admin/hoa-don/{id} tồn tại.')
        }
        
        // Các lỗi khác (403, 500, etc) - throw luôn, không fallback
        const errorMsg = adminErr.message || 'Không thể tải đơn hàng từ admin endpoint'
        throw new Error(errorMsg)
      }
    } else {
      // User thường, dùng user endpoint
      console.log('OrderDetailView - User is regular user, using user endpoint:', `/hoa-don/${route.params.id}`)
      order.value = await fetchOrderByIdUser(route.params.id)
      console.log('OrderDetailView - Successfully loaded from user endpoint')
    }
  } catch (err) {
    console.error('OrderDetailView - Final error loading order:', err)
    const errorMsg = err.message || 'Không thể tải đơn hàng'
    error.value = errorMsg
    
    // Hiển thị thông báo lỗi rõ ràng hơn
    if (errorMsg.includes('quyền') || errorMsg.includes('permission')) {
      error.value = 'Bạn không có quyền xem đơn hàng này. Vui lòng đảm bảo bạn đã đăng nhập với tài khoản phù hợp.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)

// Quay lại: ưu tiên quay về Admin nếu có query fromAdmin
const handleBack = () => {
  const fromAdmin = route.query.fromAdmin
  const adminTab = route.query.adminTab || 'users'
  if (fromAdmin) {
    router.push({ path: '/admin', query: { tab: adminTab } })
  } else {
    router.push('/orders')
  }
}
</script>

