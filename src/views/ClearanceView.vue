<template>
  <div class="bg-light">
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h4 class="m-0">
          <i class="bi bi-bag-dash me-2 text-danger"></i>Hàng thanh lý
        </h4>
        <span class="text-muted small">Tổng: {{ products.length }} sản phẩm</span>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else-if="!products.length" class="alert alert-warning">
        Hiện chưa có sản phẩm thanh lý. Vui lòng quay lại sau!
      </div>

      <div v-else class="row g-4">
        <div v-for="sp in products" :key="sp.maSP" class="col-sm-6 col-md-4 col-lg-3">
          <div class="card product-card h-100 shadow-sm">
            <RouterLink :to="`/products/${sp.maSP}`" class="img-link">
              <div class="img-box">
                <img :src="getImageUrl(sp.hinhAnh)" :alt="sp.tenSP" loading="lazy" />
              </div>
            </RouterLink>

            <div class="card-body text-center d-flex flex-column">
              <h5 class="card-title text-truncate">{{ sp.tenSP }}</h5>
              <p class="card-text fw-bold text-danger">{{ formatCurrency(sp.gia) }}</p>

              <!-- Cụm nút giống index (2 nút trên + 1 nút dưới) -->
              <div class="mt-auto w-100">
                <div class="row g-2 mb-2">
                  <div class="col-6">
                    <RouterLink class="btn btn-danger w-100 btn-tall text-nowrap" :to="`/products/${sp.maSP}`">
                      <i class="bi bi-eye me-1"></i> Chi tiết
                    </RouterLink>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-danger w-100 btn-tall text-nowrap" @click="buyNow(sp.maSP)">
                      <i class="bi bi-lightning-charge me-1"></i> Mua ngay
                    </button>
                  </div>
                </div>
                <button class="btn btn-outline-danger w-100 btn-tall text-nowrap" @click="handleAddToCart(sp.maSP)">
                  <i class="bi bi-cart-plus me-1"></i> Thêm vào giỏ
                </button>
              </div>
            </div>

            <div class="card-footer bg-transparent small text-muted">
              <i class="bi bi-recycle me-1"></i>Đã qua sử dụng
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Offcanvas } from 'bootstrap'
import { fetchProducts } from '../services/productApi'
import { addToCart } from '../services/cartApi'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const error = ref('')

const isUsed = (product) => {
  // Chỉ kiểm tra tên sản phẩm, không kiểm tra mô tả
  const tenSP = (product?.tenSP || '').toLowerCase()
  return tenSP.includes('đã sử dụng') || tenSP.includes('da su dung')
}

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

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const allProducts = await fetchProducts()
    products.value = allProducts.filter((p) => isUsed(p))
  } catch (err) {
    error.value = err.message || 'Không thể tải sản phẩm'
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async (productId) => {
  // Kiểm tra user đã đăng nhập chưa
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    router.push('/login')
    return
  }

  try {
    await addToCart(productId, 1)
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    const refreshEvent = new CustomEvent('refreshCart')
    window.dispatchEvent(refreshEvent)
    
    // Tự động mở CartOffcanvas
    const offcanvasElement = document.getElementById('cartOffcanvas')
    if (offcanvasElement) {
      const offcanvas = new Offcanvas(offcanvasElement)
      offcanvas.show()
      
      // Refresh cart trong offcanvas
      setTimeout(() => {
        window.dispatchEvent(refreshEvent)
      }, 300)
    }
  } catch (err) {
    const errorMsg = err.message || 'Không thể thêm giỏ hàng'
    if (errorMsg.includes('đăng nhập') || errorMsg.includes('login')) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      router.push('/login')
    } else {
      alert(errorMsg)
    }
  }
}

const buyNow = async (productId) => {
  // Kiểm tra user đã đăng nhập chưa
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    alert('Vui lòng đăng nhập để mua hàng')
    router.push('/login')
    return
  }

  try {
    // Thêm sản phẩm vào giỏ hàng trước
    await addToCart(productId, 1)
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    const refreshEvent = new CustomEvent('refreshCart')
    window.dispatchEvent(refreshEvent)
    
    // Sau đó redirect đến checkout
    router.push('/checkout')
  } catch (err) {
    const errorMsg = err.message || 'Không thể thêm giỏ hàng'
    if (errorMsg.includes('đăng nhập') || errorMsg.includes('login')) {
      alert('Vui lòng đăng nhập để mua hàng')
      router.push('/login')
    } else {
      alert(errorMsg)
    }
  }
}

onMounted(loadProducts)
</script>

<style scoped>
.product-card .card-img-top {
  height: 200px;
  object-fit: cover;
}
.img-link {
  display: block;
  line-height: 0;
}
.btn-tall {
  min-height: 40px;
}
.product-card .img-box {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0.75rem 0.75rem 0 0;
  overflow: hidden;
  padding: 8px;
}
.product-card .img-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

