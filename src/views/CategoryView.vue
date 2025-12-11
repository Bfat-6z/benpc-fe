<template>
  <div class="bg-light">
    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/" class="text-decoration-none">Trang chủ</RouterLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ categoryName || 'Danh mục' }}</li>
        </ol>
      </nav>

      <h2 class="mb-4 text-danger fw-bold">{{ categoryName || 'Danh mục' }}</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else-if="!products.length" class="alert alert-info">
        Không có sản phẩm nào trong danh mục này.
      </div>

      <div v-else class="row g-4">
        <div v-for="p in products" :key="p.maSP" class="col-sm-6 col-md-4 col-lg-3">
          <div class="card product-card h-100">
            <RouterLink class="img-link" :to="`/products/${p.maSP}`">
              <div class="img-wrap">
                <img
                  :src="getImageUrl(p.hinhAnh)"
                  class="card-img-top"
                  :alt="p.tenSP"
                  @error="onImgError"
                />
              </div>
            </RouterLink>

            <div class="card-body text-center d-flex flex-column">
              <h5 class="card-title text-truncate">{{ p.tenSP }}</h5>
              <p class="card-text fw-bold">{{ formatCurrency(p.gia) }}</p>

              <div class="mt-auto w-100">
                <div class="row g-2 mb-2">
                  <div class="col-6">
                    <RouterLink class="btn btn-dark w-100 btn-tall text-nowrap" :to="`/products/${p.maSP}`">
                      <i class="bi bi-eye me-1"></i> Chi tiết
                    </RouterLink>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-danger w-100 btn-tall text-nowrap" @click="buyNow(p.maSP)">
                      <i class="bi bi-lightning-charge me-1"></i> Mua ngay
                    </button>
                  </div>
                </div>
                <button class="btn btn-outline-danger w-100 btn-tall text-nowrap" @click="handleAddToCart(p.maSP)">
                  <i class="bi bi-cart-plus me-1"></i> Thêm vào giỏ
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
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Offcanvas } from 'bootstrap'
import { fetchProducts } from '../services/productApi'
import { addToCart } from '../services/cartApi'

const route = useRoute()
const router = useRouter()

const products = ref([])
const categoryName = ref('')
const loading = ref(true)
const error = ref('')

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return value || ''
}

const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/images/${path}`
}

const onImgError = (e) => {
  e.target.src = '/images/placeholder.jpg'
}

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const categoryId = Number(route.params.id)
    products.value = await fetchProducts({ categoryId, pageSize: 100 })
    if (products.value.length && products.value[0].danhMuc) {
      categoryName.value = products.value[0].danhMuc.tenDanhMuc
    }
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

const buyNow = (productId) => {
  router.push(`/checkout?productId=${productId}&qty=1`)
}

onMounted(loadProducts)

// Tải lại khi đổi danh mục (không cần F5)
watch(
  () => route.params.id,
  () => {
    loadProducts()
  }
)
</script>

<style scoped>
.product-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-body h5 {
  font-size: 1.1rem;
  color: #212529;
  min-height: 48px;
}

.card-text {
  font-size: 1rem;
  color: #dc3545;
}

.btn-dark {
  background-color: #dc3545;
  border: none;
}

.btn-dark:hover {
  background-color: #b02a37;
}

.img-link {
  display: block;
  line-height: 0;
}

.product-card .img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #fff;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.product-card .img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.25rem;
}

.btn-tall {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
</style>

