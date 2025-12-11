<template>
      <div>
    <!-- Hero Section -->
    <section class="hero text-center position-relative">
      <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
        <div class="carousel-inner">
          <div class="carousel-item active" style="background-image: url('/images/banner1.jpg')">
            <div class="carousel-caption">
              <h1 class="display-3 fw-bold animated-text neon-text">Xây dựng PC mơ ước của bạn</h1>
              <p class="lead animated-text">CPU, GPU, RAM, SSD chính hãng – Giá tốt, bảo hành uy tín</p>
              <a href="#products" class="btn btn-danger btn-lg mt-3 animated-button neon-border">Mua ngay</a>
            </div>
            <div class="particle-overlay"></div>
          </div>

          <div class="carousel-item" style="background-image: url('/images/bannerpcstore.jpg')">
            <div class="carousel-caption">
              <h1 class="display-3 fw-bold animated-text neon-text">Xây dựng PC mơ ước của bạn</h1>
              <p class="lead animated-text">CPU, GPU, RAM, SSD chính hãng – Giá tốt, bảo hành uy tín</p>
              <a href="#products" class="btn btn-danger btn-lg mt-3 animated-button neon-border">Mua ngay</a>
            </div>
            <div class="particle-overlay"></div>
          </div>

          <div class="carousel-item" style="background-image: url('/images/banner3.jpg')">
            <div class="carousel-caption">
              <h1 class="display-3 fw-bold animated-text neon-text">Xây dựng PC mơ ước của bạn</h1>
              <p class="lead animated-text">CPU, GPU, RAM, SSD chính hãng – Giá tốt, bảo hành uy tín</p>
              <a href="#products" class="btn btn-danger btn-lg mt-3 animated-button neon-border">Mua ngay</a>
            </div>
            <div class="particle-overlay"></div>
          </div>

          <div class="carousel-item" style="background-image: url('/images/banner4.jpg')">
            <div class="carousel-caption">
              <h1 class="display-3 fw-bold animated-text neon-text">Xây dựng PC mơ ước của bạn</h1>
              <p class="lead animated-text">CPU, GPU, RAM, SSD chính hãng – Giá tốt, bảo hành uy tín</p>
              <a href="#products" class="btn btn-danger btn-lg mt-3 animated-button neon-border">Mua ngay</a>
            </div>
            <div class="particle-overlay"></div>
          </div>
        </div>

        <button
          class="carousel-control-prev custom-control"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next custom-control"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </section>

    <!-- Product Section -->
    <div class="container my-5">
      <h2 class="text-center mb-4 text-danger fw-bold">Sản phẩm nổi bật</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else id="products" class="row g-4">
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

              <!-- Cụm nút -->
              <div class="mt-auto w-100">
                <!-- Hàng trên: Chi tiết + Mua ngay -->
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
                <!-- Hàng dưới: Thêm vào giỏ -->
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
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Offcanvas } from 'bootstrap'
import { fetchProducts } from '../services/productApi'
import { addToCart } from '../services/cartApi'

const router = useRouter()
const route = useRoute()
const products = ref([])
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

const isNewProduct = (product) => {
  // Sản phẩm mới là sản phẩm KHÔNG có chữ "đã sử dụng" trong tên
  const tenSP = (product?.tenSP || '').toLowerCase()
  return !tenSP.includes('đã sử dụng') && !tenSP.includes('da su dung')
}

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const allProducts = await fetchProducts()
    // Chỉ hiển thị sản phẩm mới (không có "đã sử dụng" trong tên)
    const filteredNew = allProducts.filter((p) => isNewProduct(p))

    // Áp dụng tìm kiếm (nếu có)
    const term = (route.query.search || '').toString().trim().toLowerCase()
    if (term) {
      products.value = filteredNew.filter((p) => (p.tenSP || '').toLowerCase().includes(term))
    } else {
      products.value = filteredNew
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

// Watch for search query changes
watch(() => route.query.search, () => {
  loadProducts()
})

// Also refresh when route changes (avoid stale list)
watch(() => route.fullPath, () => {
  loadProducts()
})

onMounted(loadProducts)
</script>

<style scoped>
body {
  padding-top: 70px;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}

/* Hero */
.hero {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.carousel-item {
  height: 600px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
}

.carousel-caption {
  padding-bottom: 100px;
}

.carousel-caption {
  opacity: 1;
  transition: none;
}

.carousel-caption h1 {
  font-size: 3rem;
  color: #fff;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
}

/* .carousel-item.active .carousel-caption h1 {
  animation: fadeInUp 1s ease-out;
} */

.carousel-caption p {
  font-size: 1.5rem;
  color: #f8f9fa;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

/* .carousel-item.active .carousel-caption p {
  animation: fadeInUp 1.2s ease-out;
} */

.animated-text {
  opacity: 0;
}

.carousel-item.active .animated-text {
  animation: fadeInUp 1s ease-out forwards;
}

.carousel-item.active .animated-text:nth-child(2) {
  animation-delay: 0.2s;
}

.animated-button {
  opacity: 0;
  border-radius: 25px;
  padding: 12px 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carousel-item.active .animated-button {
  animation: fadeInUp 1.4s ease-out forwards;
  animation-delay: 0.4s;
}

.animated-button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  height: 60px;
  width: 60px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  background: rgba(0, 0, 0, 0.4);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: drop-shadow(0 0 8px rgba(220, 53, 69, 0.8));
}

/* Product card */
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

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
