<template>
  <div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p class="text-primary text-uppercase fw-semibold mb-1">Giỏ hàng</p>
        <h1 class="h4 mb-0">Sản phẩm đã chọn</h1>
      </div>
      <RouterLink class="btn btn-outline-primary" to="/">Tiếp tục mua</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="!cart.items || !cart.items.length" class="alert alert-info">
        Chưa có sản phẩm trong giỏ hàng
      </div>

      <div v-else class="row gy-3">
        <div class="col-12">
          <div class="list-group">
            <div
              v-for="item in cart.items"
              :key="item.maGH"
              class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
            >
              <div>
                <h6 class="mb-1">{{ item.sanPham?.tenSP || 'Sản phẩm' }}</h6>
                <p class="mb-1 text-muted">{{ formatCurrency(item.sanPham?.gia) }}</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <input
                  v-model.number="item.soLuong"
                  type="number"
                  min="1"
                  class="form-control"
                  style="width: 90px"
                />
                <button class="btn btn-outline-secondary btn-sm" @click="updateItem(item)">Cập nhật</button>
                <button class="btn btn-outline-danger btn-sm" @click="removeItem(item.maGH)">Xóa</button>
              </div>
              <div class="fw-semibold text-primary">
                {{ formatCurrency((item.sanPham?.gia || 0) * item.soLuong) }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-1 text-muted">Tổng cộng</p>
                <h5 class="mb-0 text-primary">{{ formatCurrency(cart.total) }}</h5>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-danger" @click="handleClearCart">Xóa giỏ</button>
                <RouterLink class="btn btn-primary" to="/checkout">Thanh toán</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../services/cartApi'

const cart = reactive({ items: [], total: 0 })
const loading = ref(true)
const error = ref('')

const formatCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : value || ''

const loadCart = async () => {
  loading.value = true
  error.value = ''
  
  // Debug: Kiểm tra user trong localStorage
  const userStr = localStorage.getItem('user')
  console.log('[CartView] Loading cart...')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      console.log('[CartView] Current user:', user)
      console.log('[CartView] User maNguoiDung:', user.maNguoiDung)
      console.log('[CartView] User MaNguoiDung:', user.MaNguoiDung)
    } catch (e) {
      console.error('[CartView] Error parsing user:', e)
    }
  } else {
    console.warn('[CartView] No user found in localStorage')
  }
  
  try {
    const data = await fetchCart()
    cart.items = data.items || []
    cart.total = data.tongTien || 0
  } catch (err) {
    console.error('[CartView] Error loading cart:', err)
    error.value = err.message || 'Không thể tải giỏ hàng'
    
    // Nếu lỗi là "Cần đăng nhập", có thể redirect về login
    if (err.message && err.message.includes('đăng nhập')) {
      console.warn('[CartView] User not authenticated, may need to login')
    }
  } finally {
    loading.value = false
  }
}

const updateItem = async (item) => {
  try {
    await updateCartItem(item.maGH, item.soLuong)
    await loadCart()
  } catch (err) {
    alert(err.message || 'Không thể cập nhật sản phẩm')
  }
}

const removeItem = async (itemId) => {
  try {
    await removeCartItem(itemId)
    await loadCart()
  } catch (err) {
    alert(err.message || 'Không thể xóa sản phẩm')
  }
}

const handleClearCart = async () => {
  try {
    await clearCart(cart.items)
    await loadCart()
  } catch (err) {
    alert(err.message || 'Không thể xóa giỏ hàng')
  }
}

onMounted(loadCart)
</script>

