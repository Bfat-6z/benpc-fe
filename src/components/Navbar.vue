<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold text-danger" to="/">
        <i class="bi bi-pc-display me-2"></i>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link text-danger fw-bold" to="/">Trang chủ</RouterLink>
          </li>

          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle text-white bg-transparent border-0"
              type="button"
              id="productsDropdown"
              aria-expanded="false"
              ref="productsDropdownRef"
              @click.prevent="toggleProductsDropdown"
            >
              Sản phẩm
            </button>
            <ul class="dropdown-menu products-menu" aria-labelledby="productsDropdown" ref="productsMenuRef">
              <li v-if="!danhMucs.length" class="dropdown-item text-muted small">Đang tải...</li>
              <li v-for="dm in danhMucs" :key="dm.maDanhMuc">
                <RouterLink class="dropdown-item d-flex align-items-center" :to="`/danhmuc/${dm.maDanhMuc}`">
                  <i class="bi me-2" :class="getCategoryIcon(dm.tenDanhMuc)"></i>
                  <span>{{ dm.tenDanhMuc }}</span>
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link text-white" to="/clearance">Hàng thanh lý</RouterLink>
          </li>
        </ul>

        <div class="d-flex align-items-center">
          <div class="position-relative me-2" style="max-width: 400px">
            <input
              id="searchInput"
              v-model="searchQuery"
              class="form-control form-control-lg"
              type="search"
              placeholder="Tìm kiếm sản phẩm…"
              aria-label="Search"
              @keyup.enter="handleSearch"
              style="border-radius: 25px; padding-left: 45px; padding-right: 45px;"
            />
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style="pointer-events: none;"></i>
            <button
              v-if="searchQuery"
              type="button"
              class="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3"
              @click="clearSearch"
              style="border: none; background: none; color: #6c757d; padding: 0;"
            >
              <i class="bi bi-x-circle"></i>
            </button>
          </div>

          <button
            class="btn btn-outline-danger ms-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#cartOffcanvas"
            aria-controls="cartOffcanvas"
            @click="refreshCart"
          >
            <i class="bi bi-cart3 me-2"></i>Giỏ hàng
            <span class="badge bg-danger ms-1" id="cartCount">{{ cartCount }}</span>
          </button>

          <div v-if="currentUser" class="d-flex align-items-center gap-2 ms-2">
            <!-- Dashboard links for Admin/Staff -->
            <RouterLink
              v-if="getUserRole(currentUser) === 'admin'"
              class="btn btn-danger"
              to="/admin"
              title="Admin Panel"
            >
              <i class="bi bi-shield-check me-1"></i>Admin Panel
            </RouterLink>
            <RouterLink
              v-if="getUserRole(currentUser) === 'nhanVien'"
              class="btn btn-danger"
              to="/staff"
              title="Staff Panel"
            >
              <i class="bi bi-person-badge me-1"></i>Staff Panel
            </RouterLink>
            <RouterLink 
              class="btn btn-outline-danger user-name-btn" 
              to="/profile"
              :title="currentUser.tenNguoiDung || 'Tài khoản'"
            >
              <img
                v-if="currentUser.avatar"
                :src="currentUser.avatar"
                alt="Avatar"
                class="rounded-circle me-2"
                style="width: 24px; height: 24px; object-fit: cover"
              />
              <i v-else class="bi bi-person-circle me-2"></i>
              <span class="user-name-text">{{ shortenName(currentUser.tenNguoiDung) || 'Tài khoản' }}</span>
            </RouterLink>
            <button
              class="btn btn-outline-danger"
              @click="handleLogout"
              title="Đăng xuất"
            >
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
          <RouterLink v-else class="btn btn-outline-danger ms-2" to="/login">
            <i class="bi bi-person-circle me-2"></i>Tài khoản
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Dropdown } from 'bootstrap'
import { useRouter, useRoute } from 'vue-router'
import { fetchCart } from '../services/cartApi'
import { fetchCategories } from '../services/categoryApi'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const cartCount = ref(0)
const danhMucs = ref([])
const productsDropdownRef = ref(null)
const productsMenuRef = ref(null)
let productsDropdownInstance = null

// Sync search query with route
watch(() => route.query.search, (newVal) => {
  if (newVal) {
    searchQuery.value = newVal
  } else if (!newVal && searchQuery.value) {
    // Only clear if route doesn't have search param
    searchQuery.value = ''
  }
}, { immediate: true })

// Lấy thông tin user từ localStorage (realtime)
const currentUser = ref(null)
const loadCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    currentUser.value = userStr ? JSON.parse(userStr) : null
  } catch (e) {
    currentUser.value = null
  }
}

// Helper function để lấy và normalize role (giống với LoginView)
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

const shortenName = (fullName) => {
  if (!fullName) return ''
  
  const maxLength = 20 // Độ dài tối đa trước khi rút ngắn
  if (fullName.length <= maxLength) {
    return fullName
  }
  
  // Tách tên thành các phần
  const parts = fullName.trim().split(/\s+/)
  
  if (parts.length <= 1) {
    // Nếu chỉ có 1 từ, cắt ngắn
    return fullName.substring(0, maxLength - 3) + '...'
  }
  
  if (parts.length === 2) {
    // Nếu có 2 phần (họ và tên), giữ cả 2 nhưng rút ngắn nếu cần
    const ho = parts[0]
    const ten = parts[parts.length - 1]
    const shortened = ho + '...' + ten
    if (shortened.length <= maxLength) {
      return shortened
    }
    // Nếu vẫn dài, rút ngắn từng phần
    const hoShort = ho.substring(0, Math.max(1, ho.length - 3))
    const tenShort = ten.substring(0, Math.max(1, ten.length - 3))
    return hoShort + '...' + tenShort
  }
  
  // Nếu có nhiều phần (họ, tên đệm, tên), lấy họ và tên cuối
  const ho = parts[0]
  const ten = parts[parts.length - 1]
  return ho + '...' + ten
}

const getCategoryIcon = (tenDanhMuc) => {
  if (!tenDanhMuc) return 'bi-box'
  const name = tenDanhMuc.trim()
  const nameLower = name.toLowerCase()
  
  // Logic giống bài cũ: equalsIgnoreCase cho CPU, GPU, RAM, Bàn phím
  // containsIgnoreCase cho các trường hợp khác
  if (nameLower === 'cpu') return 'bi-cpu'
  if (nameLower === 'gpu') return 'bi-gpu-card'
  if (nameLower === 'ram') return 'bi-memory'
  if (nameLower.includes('ssd')) return 'bi-hdd'
  if (nameLower.includes('main')) return 'bi-motherboard'
  if (nameLower.includes('case')) return 'bi-pc'
  if (nameLower.includes('nguồn') || nameLower.includes('psu')) return 'bi-plug'
  if (nameLower === 'bàn phím' || nameLower.includes('phím') || nameLower.includes('keyboard')) return 'bi-keyboard'
  if (nameLower.includes('màn hình') || nameLower.includes('monitor')) return 'bi-display'
  return 'bi-box'
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { search: searchQuery.value.trim() } })
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (router.currentRoute.value.query.search) {
    router.push({ path: '/', query: {} })
  }
}

const refreshCart = async () => {
  try {
    const cart = await fetchCart()
    // Tính tổng số lượng sản phẩm (tổng soLuong của tất cả items)
    if (cart.items && Array.isArray(cart.items)) {
      cartCount.value = cart.items.reduce((total, item) => {
        return total + (item.soLuong || 0)
      }, 0)
    } else {
      cartCount.value = 0
    }
  } catch (err) {
    cartCount.value = 0
  }
}

const loadCategories = async () => {
  try {
    danhMucs.value = await fetchCategories()
  } catch (err) {
    console.error('Error loading categories:', err)
    danhMucs.value = []
  }
}

const handleLogout = () => {
  const role = getUserRole(currentUser.value)
  const isAdminOrStaff = role === 'admin' || role === 'nhanVien'
  localStorage.removeItem('user')
  localStorage.removeItem('loginMethod')
  window.dispatchEvent(new Event('user-updated'))
  // Với admin/staff: điều hướng thẳng bằng location để chắc chắn rời khỏi /admin|/staff
  if (isAdminOrStaff) {
    window.location.href = '/login'
  } else {
    router.push('/').finally(() => window.location.reload())
  }
}

onMounted(() => {
  refreshCart()
  loadCategories()
  loadCurrentUser()
  
  // Khởi tạo dropdown thủ công để chắc chắn hoạt động
  setTimeout(() => {
    if (productsDropdownRef.value) {
      try {
        productsDropdownInstance = new Dropdown(productsDropdownRef.value, { autoClose: true })
      } catch (e) {
        console.warn('Dropdown init error', e)
      }
    }
  }, 0)
  
  // Lắng nghe event refreshCart để cập nhật số lượng ngay lập tức
  window.addEventListener('refreshCart', () => {
    refreshCart()
  })
  
  // Lắng nghe event từ CartOffcanvas khi cart được update
  window.addEventListener('cartUpdated', () => {
    refreshCart()
  })

  // Lắng nghe cập nhật user (phát từ LoginView hoặc logout)
  window.addEventListener('user-updated', loadCurrentUser)
  // Lắng nghe storage (đăng nhập/đăng xuất từ tab khác)
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      loadCurrentUser()
    }
  })

  // Đóng dropdown sản phẩm khi click ra ngoài hoặc đổi route
  document.addEventListener('click', handleClickOutside)
  router.afterEach(() => {
    hideProductsDropdown()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleProductsDropdown = () => {
  try {
    if (!productsDropdownInstance && productsDropdownRef.value) {
      productsDropdownInstance = new Dropdown(productsDropdownRef.value, { autoClose: true })
    }
    productsDropdownInstance?.toggle()
  } catch (e) {
    console.warn('Dropdown toggle error', e)
  }
}

const hideProductsDropdown = () => {
  try {
    productsDropdownInstance?.hide()
  } catch (e) {
    // ignore
  }
}

const handleClickOutside = (event) => {
  const btn = productsDropdownRef.value
  const menu = productsMenuRef.value
  if (!btn || !menu) return
  if (!btn.contains(event.target) && !menu.contains(event.target)) {
    hideProductsDropdown()
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #1a1d21, #2c3036);
  padding: 15px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.navbar-brand {
  font-size: 1.8rem;
  letter-spacing: 1px;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.nav-link {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 10px 15px !important;
  transition: all 0.3s ease;
}

.nav-link.active,
.nav-link:hover {
  color: #dc3545 !important;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(220, 53, 69, 0.6);
}

.search-input {
  border-radius: 25px;
  padding-left: 40px;
  border: 1px solid #dc3545;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.4);
  border-color: #b02a37;
}

.dropdown-menu {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  padding: 10px 0;
  animation: fadeIn 0.2s ease-in;
}

.products-menu {
  display: block; /* giữ block để transition hoạt động */
  visibility: hidden;
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  animation: none; /* tắt animation fadeIn mặc định */
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}

.products-menu.show {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}


.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-weight: 500;
  color: #333;
  border-radius: 5px;
  margin: 0;
  width: 100%;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background: #dc3545;
  color: #fff;
}

.dropdown-item i {
  margin-right: 10px;
  color: #dc3545;
  transition: color 0.5s ease;
}

.dropdown-item:hover i {
  color: #fff;
}

.dropdown-item:hover i {
  color: #fff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.user-name-btn {
  max-width: 250px;
  overflow: hidden;
}

.user-name-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
