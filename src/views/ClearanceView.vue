<template>
  <div class="clearance-page">
    <div class="clearance-shell">
      <div class="clearance-header">
        <div class="header-left">
          <div class="header-text">
            <div class="header-kicker">
              <span class="kicker-dot" aria-hidden="true"></span>
              Clearance
            </div>
            <h1 class="header-title">Hàng thanh lý</h1>
            <p class="header-subtitle">Sản phẩm đã qua sử dụng • Giá tốt • Cập nhật liên tục</p>
          </div>
        </div>
        <div class="header-right">
          <div class="count-pill">
            <span class="count-dot" aria-hidden="true"></span>
            Tổng: <b>{{ products.length }}</b>
          </div>
        </div>
      </div>

      <div v-if="loading" class="state state--loading">
        <div class="loading-spinner" role="status" aria-label="Đang tải"></div>
        <div class="state-title">Đang tải sản phẩm…</div>
        <div class="state-subtitle">Vui lòng chờ trong giây lát</div>
      </div>

      <div v-else-if="error" class="state state--error" role="alert">
        <div class="state-icon" aria-hidden="true">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div class="state-title">Không thể tải dữ liệu</div>
        <div class="state-subtitle">{{ error }}</div>
      </div>

      <div v-else-if="!products.length" class="state state--empty">
        <div class="state-icon" aria-hidden="true">
          <i class="bi bi-inboxes"></i>
        </div>
        <div class="state-title">Chưa có sản phẩm thanh lý</div>
        <div class="state-subtitle">Bạn có thể quay lại sau hoặc khám phá sản phẩm mới ở trang chủ.</div>
        <RouterLink to="/" class="cta-link">
          Về trang chủ <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </div>

      <div v-else class="clearance-grid">
        <article
          v-for="(sp, index) in products"
          :key="sp.maSP"
          class="c-card"
          :style="{ '--d': `${index * 45}ms` }"
        >
          <RouterLink :to="`/products/${sp.maSP}`" class="c-media" :aria-label="`Xem chi tiết ${sp.tenSP}`">
            <div class="c-media-inner">
              <img :src="getImageUrl(sp.hinhAnh)" :alt="sp.tenSP" loading="lazy" />
            </div>
            <div class="c-badge-used">
              <i class="bi bi-recycle"></i>
              Đã qua sử dụng
            </div>
          </RouterLink>

          <div class="c-body">
            <div class="c-main">
              <h3 class="c-name" :title="sp.tenSP">{{ sp.tenSP }}</h3>
              <div class="c-price">{{ formatCurrency(sp.gia) }}</div>
            </div>

            <div class="c-actions">
              <RouterLink class="c-btn c-btn--secondary" :to="`/products/${sp.maSP}`">
                <i class="bi bi-eye"></i>
                Chi tiết
              </RouterLink>
              <button class="c-btn c-btn--primary" type="button" @click="buyNow(sp.maSP)">
                <i class="bi bi-lightning-charge"></i>
                Mua ngay
              </button>
              <button class="c-btn c-btn--ghost" type="button" @click="handleAddToCart(sp.maSP)">
                <i class="bi bi-cart-plus"></i>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </article>
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
/* ========== PAGE ========== */
.clearance-page {
  min-height: 100vh;
  padding-top: 84px; /* navbar fixed-top */
  background: #f5f5f7;
}

.clearance-shell {
  max-width: 1240px;
  margin: 0 auto;
  padding: 22px 16px 56px;
}

/* ========== HEADER ========== */
.clearance-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 8px 0 18px;
  animation: pageIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.header-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.55);
  margin-bottom: 6px;
}
.kicker-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ff3b30;
  box-shadow: 0 0 0 6px rgba(255, 59, 48, 0.12);
}

.header-title {
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #111827;
  font-size: 1.55rem;
}
.header-subtitle {
  margin: 4px 0 0;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.95rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.05);
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
}
.count-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 0 4px rgba(255, 59, 48, 0.12);
}

/* ========== STATES ========== */
.state {
  margin-top: 18px;
  padding: 26px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
  text-align: center;
  animation: pageIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.state-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  color: #fff;
  background: #111827;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.16);
}
.state--error .state-icon {
  background: #ef4444;
}
.state--empty .state-icon {
  background: #6b7280;
}
.state-title {
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
}
.state-subtitle {
  color: #6b7280;
  font-weight: 500;
}
.cta-link {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #ff3b30;
  font-weight: 800;
  text-decoration: none;
}
.cta-link:hover {
  text-decoration: underline;
}
.loading-spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin: 0 auto 14px;
  border: 3px solid rgba(17, 24, 39, 0.08);
  border-top-color: #ff3b30;
  animation: spin 850ms linear infinite;
}

/* ========== GRID & CARD ========== */
.clearance-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}

.c-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(17, 24, 39, 0.10);
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.06);
  overflow: hidden;
  transform: translateY(10px);
  opacity: 0;
  animation: cardIn 560ms cubic-bezier(0.2, 0.85, 0.2, 1) both;
  animation-delay: var(--d, 0ms);
}

.c-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 46px rgba(17, 24, 39, 0.10);
  border-color: rgba(255, 59, 48, 0.22);
}

.c-media {
  display: block;
  position: relative;
  text-decoration: none;
  color: inherit;
}
.c-media-inner {
  height: 220px;
  padding: 12px;
  display: grid;
  place-items: center;
  background: #ffffff;
}
.c-media-inner img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: translateZ(0);
  transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.c-card:hover .c-media-inner img {
  transform: scale(1.03);
}

.c-badge-used {
  position: absolute;
  left: 14px;
  top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: rgba(17, 24, 39, 0.82);
  font-weight: 700;
  font-size: 0.78rem;
  border: 1px solid rgba(17, 24, 39, 0.10);
  backdrop-filter: blur(10px);
}
.c-badge-used i {
  color: #ff3b30;
}

.c-body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.c-main {
  display: grid;
  gap: 8px;
}
.c-name {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.2px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(1.25em * 2);
}
.c-price {
  font-weight: 900;
  color: #ff3b30;
  letter-spacing: -0.2px;
}

.c-actions {
  margin-top: 2px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.c-actions .c-btn--ghost {
  grid-column: 1 / -1;
}

.c-btn {
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 800;
  font-size: 0.92rem;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 180ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease;
  user-select: none;
  white-space: nowrap;
}
.c-btn i {
  font-size: 1rem;
}
.c-btn--primary {
  color: #fff;
  background: #ff3b30;
  border-color: rgba(255, 59, 48, 0.25);
  box-shadow: 0 10px 22px rgba(255, 59, 48, 0.22);
}
.c-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(255, 59, 48, 0.26);
}
.c-btn--secondary {
  color: #111827;
  background: #ffffff;
  border-color: rgba(17, 24, 39, 0.14);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.05);
}
.c-btn--secondary:hover {
  transform: translateY(-1px);
  border-color: rgba(17, 24, 39, 0.20);
  box-shadow: 0 12px 24px rgba(17, 24, 39, 0.07);
}
.c-btn--ghost {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.06);
  border-color: rgba(255, 59, 48, 0.20);
}
.c-btn--ghost:hover {
  transform: translateY(-1px);
  background: rgba(255, 59, 48, 0.10);
  border-color: rgba(255, 59, 48, 0.28);
}

/* ========== ANIMATIONS ========== */
@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1200px) {
  .clearance-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .clearance-header { flex-direction: column; align-items: flex-start; }
  .header-right { width: 100%; }
  .count-pill { width: 100%; justify-content: center; }
  .clearance-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 520px) {
  .clearance-shell { padding: 18px 12px 46px; }
  .clearance-grid { grid-template-columns: 1fr; }
  .c-media-inner { height: 210px; }
}
</style>

