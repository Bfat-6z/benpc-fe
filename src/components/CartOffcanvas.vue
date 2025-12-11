<template>
  <div
    class="offcanvas offcanvas-end text-bg-dark"
    tabindex="-1"
    id="cartOffcanvas"
    aria-labelledby="cartLabel"
  >
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title fw-bold" id="cartLabel">
        <i class="bi bi-cart3 me-2 text-danger"></i>Giỏ hàng
      </h5>
      <button
        type="button"
        class="btn-close btn-close-white"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body d-flex flex-column">
      <div v-if="showAlert" class="alert alert-success py-2 px-3">
        <i class="bi bi-check2-circle me-1"></i> Đã thêm vào giỏ.
      </div>
      <div class="flex-grow-1">
        <div v-if="!cartItems.length" class="text-muted text-center my-4">Giỏ hàng trống</div>
        <div v-else>
          <div
            v-for="item in cartItems"
            :key="item.maGH"
            class="d-flex align-items-start gap-3 py-3 border-bottom border-secondary cart-row"
          >
            <img
              :src="getImageUrl(item.sanPham?.hinhAnh)"
              class="rounded"
              style="width: 72px; height: 72px; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.15)"
              :alt="item.sanPham?.tenSP"
            />
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <div class="me-2">
                  <div class="fw-semibold">{{ item.sanPham?.tenSP }}</div>
                  <div class="text-secondary small">{{ formatCurrency(item.donGia) }} / sản phẩm</div>
                </div>
                <div class="fw-bold text-danger">{{ formatCurrency(Number(item.donGia) * Number(item.soLuong)) }}</div>
              </div>

              <div class="d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-outline-secondary btn-sm" @click="updateQty(item.maGH, item.soLuong - 1)">
                  −
                </button>

                <input
                  class="form-control form-control-sm text-bg-dark border-secondary text-center"
                  style="width: 64px"
                  :value="item.soLuong"
                  @change="updateQty(item.maGH, $event.target.value)"
                  aria-label="Số lượng"
                />

                <button class="btn btn-outline-secondary btn-sm" @click="updateQty(item.maGH, item.soLuong + 1)">
                  +
                </button>

                <button class="btn btn-outline-danger btn-sm ms-2" @click="removeItem(item.maGH)" title="Xoá">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-top border-secondary pt-3 mt-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-semibold">Tổng phụ</span>
          <span class="fw-bold text-danger">{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-danger btn-lg" @click="goCheckout">
            <i class="bi bi-credit-card me-2"></i>Thanh toán
          </button>
          <button class="btn btn-outline-light" @click="handleClearCart">
            <i class="bi bi-trash3 me-2"></i>Xoá tất cả
          </button>
        </div>
        <small class="text-muted d-block mt-2">Phí & thuế tính ở bước sau.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../services/cartApi'

const router = useRouter()

const cartItems = ref([])
const showAlert = ref(false)

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return '0đ'
}

const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/images/${path}`
}

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + Number(item.donGia || 0) * Number(item.soLuong || 0)
  }, 0)
})

const loadCart = async () => {
  try {
    const data = await fetchCart()
    cartItems.value = data.items || []
  } catch (err) {
    console.error('Load cart error:', err)
    cartItems.value = []
  }
}

const updateQty = async (itemId, newQty) => {
  const qty = Math.max(1, parseInt(newQty, 10))
  try {
    await updateCartItem(itemId, qty)
    await loadCart()
    // Cập nhật số lượng giỏ hàng trong Navbar ngay lập tức
    window.dispatchEvent(new CustomEvent('refreshCart'))
  } catch (err) {
    alert(err.message || 'Không thể cập nhật số lượng')
  }
}

const removeItem = async (itemId) => {
  try {
    await removeCartItem(itemId)
    await loadCart()
    // Cập nhật số lượng giỏ hàng trong Navbar ngay lập tức
    window.dispatchEvent(new CustomEvent('refreshCart'))
  } catch (err) {
    alert(err.message || 'Không thể xóa sản phẩm')
  }
}

const handleClearCart = async () => {
  if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) return
  try {
    await clearCart(cartItems.value)
    await loadCart()
    // Cập nhật số lượng giỏ hàng trong Navbar ngay lập tức
    window.dispatchEvent(new CustomEvent('refreshCart'))
  } catch (err) {
    alert(err.message || 'Không thể xóa giỏ hàng')
  }
}

const goCheckout = () => {
  router.push('/checkout')
}

// Watch for offcanvas show event to refresh cart
onMounted(() => {
  loadCart()
  const offcanvasEl = document.getElementById('cartOffcanvas')
  if (offcanvasEl) {
    // Refresh dữ liệu khi offcanvas mở
    offcanvasEl.addEventListener('shown.bs.offcanvas', loadCart)
  }
  
  // Lắng nghe event refreshCart từ các component khác
  window.addEventListener('refreshCart', loadCart)
})

// Expose methods for global use
defineExpose({
  refreshCart: loadCart,
  showAddedAlert: () => {
    showAlert.value = true
    setTimeout(() => {
      showAlert.value = false
    }, 1500)
  },
})
</script>

<style scoped>
.cart-row {
  transition: background-color 0.2s;
}
.cart-row:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Giữ lại style nội bộ tối thiểu, ưu tiên global ở style.css */
</style>

<!-- Global override to đảm bảo transition hoạt động, không bị scoped hạn chế -->
<style>
#cartOffcanvas.offcanvas-end {
  transform: translateX(100%) !important;
  transition: transform 0.4s ease-in-out !important;
}
#cartOffcanvas.offcanvas-end.show {
  transform: translateX(0) !important;
}
</style>

