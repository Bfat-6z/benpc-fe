<template>
  <div class="od-page">
    <div class="od-shell">
      <div class="od-top">
        <div class="od-title">
          <div class="od-kicker">CHI TIẾT ĐƠN HÀNG</div>
          <h1 class="od-h1">Đơn #{{ route.params.id }}</h1>
        </div>
        <div class="od-actions">
          <button class="od-btn od-btn--ghost" type="button" @click="handleBack">
            <i class="bi bi-arrow-left"></i>
            Quay lại
          </button>
          <RouterLink class="od-btn od-btn--primary" to="/">
            <i class="bi bi-bag-check"></i>
            Tiếp tục mua
          </RouterLink>
        </div>
      </div>

      <div v-if="loading" class="od-state od-state--loading">
        <div class="od-spinner" role="status" aria-label="Đang tải"></div>
        <div class="od-state-title">Đang tải chi tiết đơn hàng…</div>
        <div class="od-state-sub">Vui lòng chờ trong giây lát</div>
      </div>

      <div v-else-if="error" class="od-state od-state--error" role="alert">
        <div class="od-state-icon" aria-hidden="true">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="od-state-title">Không thể tải đơn hàng</div>
        <div class="od-state-sub">{{ error }}</div>
      </div>

      <div v-else-if="order" class="od-grid">
        <!-- LEFT: items -->
        <section class="od-card od-card--items">
          <header class="od-card-head">
            <div class="od-meta">
              <div class="od-meta-label">Trạng thái</div>
              <div
                class="od-status"
                :data-status="String(order.trangThai || '').toLowerCase()"
              >
                <span class="od-status-dot" aria-hidden="true"></span>
                {{ order.trangThai || 'Đang xử lý' }}
              </div>
            </div>
            <div class="od-total">
              <div class="od-meta-label">Tổng cộng</div>
              <div class="od-total-value">{{ formatCurrency(order.tongTien) }}</div>
            </div>
          </header>

          <div class="od-list">
            <article
              v-for="(item, idx) in (order.danhSachChiTiet || [])"
              :key="item.maCT"
              class="od-item"
              :style="{ '--d': `${idx * 40}ms` }"
            >
              <div class="od-item-main">
                <div class="od-item-name">{{ item.sanPham?.tenSP || 'Sản phẩm' }}</div>
                <div class="od-item-sub">
                  <span>Đơn giá: <b>{{ formatCurrency(item.donGia) }}</b></span>
                  <span class="od-sep">•</span>
                  <span>SL: <b>{{ item.soLuong }}</b></span>
                </div>
              </div>
              <div class="od-item-right">
                <div class="od-item-sum">{{ formatCurrency((item.donGia || 0) * item.soLuong) }}</div>
              </div>
            </article>
          </div>
        </section>

        <!-- RIGHT: shipping -->
        <aside class="od-card od-card--ship">
          <header class="od-side-head">
            <div class="od-side-title">Thông tin giao hàng</div>
            <div class="od-side-sub">Tóm tắt đơn hàng</div>
          </header>

          <div class="od-kv">
            <div class="od-kv-row">
              <div class="od-kv-label">Khách hàng</div>
              <div class="od-kv-value">{{ order.nguoiDung?.hoTen || 'Khách lẻ' }}</div>
            </div>
            <div class="od-kv-row" v-if="order.diaChi">
              <div class="od-kv-label">Địa chỉ</div>
              <div class="od-kv-value">{{ formatAddress(order.diaChi) }}</div>
            </div>
            <div class="od-kv-row">
              <div class="od-kv-label">Ngày lập</div>
              <div class="od-kv-value">{{ formatDate(order.ngayLap) }}</div>
            </div>
          </div>

          <div class="od-side-total">
            <div class="od-side-total-label">Tổng thanh toán</div>
            <div class="od-side-total-value">{{ formatCurrency(order.tongTien) }}</div>
          </div>
        </aside>
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

<style scoped>
.od-page {
  min-height: 100vh;
  padding-top: 84px; /* navbar fixed-top */
  padding-bottom: 56px;
  background: radial-gradient(1200px 520px at 15% 0%, rgba(240, 245, 255, 0.9), rgba(245, 246, 248, 0)),
    radial-gradient(900px 520px at 90% 10%, rgba(255, 240, 247, 0.75), rgba(245, 246, 248, 0)),
    #f5f6f8;
}

.od-shell {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 16px 0;
}

.od-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 14px;
  margin-bottom: 18px;
  animation: odIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.od-kicker {
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.55);
  margin-bottom: 6px;
}

.od-h1 {
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.6px;
  color: #111827;
  font-size: 1.8rem;
}

.od-actions {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
}

.od-btn {
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 180ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease;
  user-select: none;
  white-space: nowrap;
}
.od-btn i {
  font-size: 1rem;
}

.od-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  box-shadow: 0 10px 22px rgba(102, 126, 234, 0.28), 0 4px 14px rgba(118, 75, 162, 0.22);
}
.od-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(102, 126, 234, 0.36), 0 6px 18px rgba(118, 75, 162, 0.26);
}
.od-btn--ghost {
  color: #111827;
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(17, 24, 39, 0.12);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.06);
}
.od-btn--ghost:hover {
  transform: translateY(-1px);
  border-color: rgba(17, 24, 39, 0.18);
  box-shadow: 0 14px 28px rgba(17, 24, 39, 0.08);
}

/* STATES */
.od-state {
  margin-top: 14px;
  padding: 26px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
  text-align: center;
  animation: odIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.od-state-icon {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #ef4444, #fb7185);
  box-shadow: 0 14px 30px rgba(239, 68, 68, 0.22);
}
.od-state-title {
  font-weight: 900;
  color: #111827;
  margin-bottom: 6px;
}
.od-state-sub {
  color: #6b7280;
  font-weight: 600;
}
.od-spinner {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin: 0 auto 14px;
  border: 3px solid rgba(17, 24, 39, 0.08);
  border-top-color: #667eea;
  animation: odSpin 850ms linear infinite;
}

/* GRID */
.od-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 16px;
  align-items: start;
}

.od-card {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 18px 44px rgba(17, 24, 39, 0.06);
  overflow: hidden;
}

.od-card-head {
  padding: 18px 18px 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 251, 252, 0.96));
}

.od-meta-label {
  color: rgba(107, 114, 128, 0.95);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.od-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.18);
  color: #1f2937;
  font-weight: 800;
  white-space: nowrap;
}
.od-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

/* status mapping by text */
.od-status[data-status*="chờ"],
.od-status[data-status*="cho"] {
  background: rgba(245, 158, 11, 0.10);
  border-color: rgba(245, 158, 11, 0.22);
}
.od-status[data-status*="chờ"] .od-status-dot,
.od-status[data-status*="cho"] .od-status-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.14);
}
.od-status[data-status*="giao"],
.od-status[data-status*="vận chuyển"],
.od-status[data-status*="van chuyen"] {
  background: rgba(14, 165, 233, 0.10);
  border-color: rgba(14, 165, 233, 0.22);
}
.od-status[data-status*="giao"] .od-status-dot,
.od-status[data-status*="vận chuyển"] .od-status-dot,
.od-status[data-status*="van chuyen"] .od-status-dot {
  background: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.14);
}
.od-status[data-status*="hoàn thành"],
.od-status[data-status*="hoan thanh"],
.od-status[data-status*="thành công"],
.od-status[data-status*="thanh cong"] {
  background: rgba(16, 185, 129, 0.10);
  border-color: rgba(16, 185, 129, 0.22);
}
.od-status[data-status*="hoàn thành"] .od-status-dot,
.od-status[data-status*="hoan thanh"] .od-status-dot,
.od-status[data-status*="thành công"] .od-status-dot,
.od-status[data-status*="thanh cong"] .od-status-dot {
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.14);
}
.od-status[data-status*="hủy"],
.od-status[data-status*="huy"],
.od-status[data-status*="huỷ"] {
  background: rgba(239, 68, 68, 0.10);
  border-color: rgba(239, 68, 68, 0.22);
}
.od-status[data-status*="hủy"] .od-status-dot,
.od-status[data-status*="huy"] .od-status-dot,
.od-status[data-status*="huỷ"] .od-status-dot {
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.14);
}

.od-total {
  text-align: right;
}
.od-total-value {
  font-weight: 900;
  letter-spacing: -0.4px;
  font-size: 1.35rem;
  color: #111827;
  white-space: nowrap;
}

/* ITEMS */
.od-list {
  padding: 14px 14px 18px;
  display: grid;
  gap: 10px;
}
.od-item {
  padding: 14px 14px;
  border-radius: 18px;
  border: 1px solid rgba(17, 24, 39, 0.10);
  background: #fff;
  box-shadow: 0 10px 22px rgba(17, 24, 39, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  opacity: 0;
  transform: translateY(10px);
  animation: odItemIn 520ms cubic-bezier(0.2, 0.85, 0.2, 1) both;
  animation-delay: var(--d, 0ms);
}
.od-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.08);
  border-color: rgba(102, 126, 234, 0.20);
}
.od-item-name {
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.2px;
  line-height: 1.25;
}
.od-item-sub {
  margin-top: 6px;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.92rem;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.od-sep {
  opacity: 0.6;
}
.od-item-sum {
  font-weight: 900;
  color: #2563eb;
  white-space: nowrap;
}

/* SIDE */
.od-side-head {
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 251, 252, 0.96));
}
.od-side-title {
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.2px;
}
.od-side-sub {
  margin-top: 4px;
  color: #6b7280;
  font-weight: 600;
}

.od-kv {
  padding: 14px 18px 6px;
  display: grid;
  gap: 12px;
}
.od-kv-row {
  display: grid;
  gap: 6px;
}
.od-kv-label {
  color: rgba(107, 114, 128, 0.95);
  font-weight: 700;
  font-size: 0.85rem;
}
.od-kv-value {
  font-weight: 800;
  color: #111827;
}

.od-side-total {
  margin: 10px 18px 18px;
  padding: 14px 14px;
  border-radius: 18px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.18);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.od-side-total-label {
  font-weight: 800;
  color: rgba(31, 41, 55, 0.9);
}
.od-side-total-value {
  font-weight: 900;
  color: #111827;
  white-space: nowrap;
}

@keyframes odIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes odItemIn {
  from { opacity: 0; transform: translateY(12px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes odSpin {
  to { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .od-grid { grid-template-columns: 1fr; }
  .od-total { text-align: left; }
  .od-card-head { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 520px) {
  .od-shell { padding: 16px 12px 0; }
  .od-h1 { font-size: 1.55rem; }
  .od-actions { width: 100%; }
  .od-btn { flex: 1; justify-content: center; }
  .od-item { flex-direction: column; align-items: flex-start; }
  .od-item-sum { color: #111827; }
}
</style>

