.tabs-header {
  background: #12151a;
  border-bottom: 1px solid #1f252d;
}
.tabs-header .nav-link {
  color: #b5c0d0;
  border: none;
  border-radius: 10px 10px 0 0;
  padding: 10px 16px;
  margin-right: 6px;
  transition: all 0.2s ease;
}
.tabs-header .nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.tabs-header .nav-link.active {
  color: #e33b4e;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
.tabs-header .nav-link i {
  color: #e33b4e;
}
<template>
  <div class="bg-light">
    <div class="container my-4">
      <!-- breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <RouterLink to="/" class="text-decoration-none">Trang chủ</RouterLink>
          </li>
          <li class="breadcrumb-item">
            <span v-if="product?.danhMuc">
              <RouterLink :to="`/danhmuc/${product.danhMuc.maDanhMuc}`" class="text-decoration-none">
                {{ product.danhMuc.tenDanhMuc }}
              </RouterLink>
            </span>
            <span v-else>Danh mục</span>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product?.tenSP || 'Chi tiết' }}</li>
        </ol>
      </nav>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-else-if="product" class="row g-4">
        <!-- LEFT: gallery -->
        <div class="col-lg-6">
          <img
            class="hero-photo mb-3"
            id="heroImg"
            :src="getImageUrl(product.hinhAnh)"
            :alt="product.tenSP"
          />
          <div class="d-flex gap-2 flex-wrap">
            <img
              class="thumb active"
              :src="getImageUrl(product.hinhAnh)"
              :alt="product.tenSP"
              @click="swapHero"
            />
          </div>
        </div>

        <!-- RIGHT: info -->
        <div class="col-lg-6 related-products">
          <div class="card shadow-sm sticky-md">
            <div class="card-body">
              <h1 class="h3 fw-bold mb-2">{{ product.tenSP }}</h1>

              <div class="d-flex flex-wrap gap-3 small text-muted mb-2">
                <span>Mã SP: <strong>{{ product.maSP }}</strong></span>
                <span v-if="product.nhaCungCap">
                  Nhà cung cấp: <strong>{{ product.nhaCungCap.tenNCC }}</strong>
                </span>
                <span :class="product.soLuong > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi me-1" :class="product.soLuong > 0 ? 'bi-check2-circle' : 'bi-x-circle'"></i>
                  <span>{{ product.soLuong > 0 ? 'Còn hàng' : 'Hết hàng' }}</span>
                </span>
              </div>

              <div class="d-flex align-items-end gap-3 mb-3 price-box">
                <div>
                  <div class="display-6 text-danger fw-bold m-0">{{ formatCurrency(product.gia) }}</div>
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge rounded-pill bg-danger-soft">
                      <i class="bi bi-lightning-charge me-1"></i> Ưu đãi tháng này
                    </span>
                    <span class="badge rounded-pill bg-success-subtle text-success">
                      <i class="bi bi-check2-circle me-1"></i> Chính hãng 100%
                    </span>
                    <span class="badge rounded-pill bg-info-subtle text-info">
                      <i class="bi bi-truck me-1"></i> Freeship nội thành
                    </span>
                  </div>
                </div>
              </div>

              <div class="info-bar mb-3">
                <div class="info-item">
                  <i class="bi bi-box-seam"></i>
                  <span>Đổi trả 7 ngày</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Bảo hành chính hãng</span>
                </div>
                <div class="info-item">
                  <i class="bi bi-credit-card"></i>
                  <span>Thanh toán khi nhận hàng</span>
                </div>
              </div>

              <p class="text-secondary lead-sm">{{ product.moTa }}</p>

              <hr />

              <!-- qty + actions -->
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="input-group" style="width: 140px">
                  <button class="btn btn-outline-secondary" type="button" @click="changeQty(-1)">−</button>
                  <input id="buyQty" v-model.number="quantity" type="number" class="form-control text-center" min="1" />
                  <button class="btn btn-outline-secondary" type="button" @click="changeQty(1)">+</button>
                </div>

                <button class="btn btn-outline-danger flex-grow-1" @click="handleAddToCart">
                  <i class="bi bi-cart-plus me-1"></i> Thêm vào giỏ
                </button>

                <button class="btn btn-danger flex-grow-1" @click="handleBuyNow">
                  <i class="bi bi-lightning-charge me-1"></i> Mua ngay
                </button>
              </div>

              <div class="small text-muted d-flex flex-wrap gap-3 align-items-center support-line">
                <span><i class="bi bi-truck me-1 accent-danger"></i> Giao nhanh nội thành</span>
                <span><i class="bi bi-shield-check me-1 accent-danger"></i> Bảo hành chính hãng</span>
                <span><i class="bi bi-telephone-outbound me-1 accent-danger"></i> Hotline: 1900 0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tabs: mô tả / thông số / bảo hành -->
      <div v-if="product" class="card mt-4 shadow-sm">
        <div class="card-header tabs-header">
          <ul class="nav nav-tabs card-header-tabs" id="detailTabs">
            <li class="nav-item">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabDesc">
                <i class="bi bi-info-circle me-1"></i> Mô tả
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabSpec">
                <i class="bi bi-cpu me-1"></i> Thông số kỹ thuật
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabPolicy">
                <i class="bi bi-shield-check me-1"></i> Bảo hành & đổi trả
              </button>
            </li>
          </ul>
        </div>
        <div class="card-body tab-content">
          <div class="tab-pane fade show active" id="tabDesc">
            <p>{{ product.moTa }}</p>
          </div>
          <div class="tab-pane fade" id="tabSpec">
            <div class="table-responsive">
              <table class="table table-bordered align-middle spec-table">
                <tbody>
                  <tr>
                    <th>Danh mục</th>
                    <td>{{ product.danhMuc ? product.danhMuc.tenDanhMuc : '—' }}</td>
                  </tr>
                  <tr>
                    <th>Nhà cung cấp</th>
                    <td>{{ product.nhaCungCap ? product.nhaCungCap.tenNCC : '—' }}</td>
                  </tr>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <td>{{ product.maSP }}</td>
                  </tr>
                  <tr>
                    <th>Tình trạng</th>
                    <td>{{ product.soLuong > 0 ? 'Còn hàng' : 'Hết hàng' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="tab-pane fade" id="tabPolicy">
            <ul class="mb-0">
              <li>Đổi mới trong 7 ngày nếu lỗi nhà sản xuất.</li>
              <li>Bảo hành theo chính sách hãng (12–36 tháng).</li>
              <li>Hỗ trợ kỹ thuật miễn phí trọn đời.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- related -->
      <div v-if="product && relatedProducts.length" class="mt-5">
        <h4 class="text-danger fw-bold mb-3">Sản phẩm liên quan</h4>
        <div class="row g-3">
          <div v-for="r in relatedProducts" :key="r.maSP" class="col-6 col-md-3">
            <div class="card h-100 related-tile">
              <img :src="getImageUrl(r.hinhAnh)" :alt="r.tenSP" class="card-img-top" style="height: 150px; object-fit: contain" />
              <div class="card-body text-center d-flex flex-column gap-2">
                <div class="small mb-0 text-truncate">{{ r.tenSP }}</div>
                <div class="fw-bold text-danger mb-1">{{ formatCurrency(r.gia) }}</div>
                <div class="d-grid gap-2 mt-auto">
                  <RouterLink class="btn btn-outline-secondary btn-sm" :to="`/products/${r.maSP}`">
                    Xem chi tiết
                  </RouterLink>
                  <button class="btn btn-danger btn-sm" @click.prevent="handleAddToCart(r.maSP)">
                    <i class="bi bi-cart-plus me-1"></i> Thêm giỏ
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
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Offcanvas } from 'bootstrap'
import { fetchProductById, fetchProducts } from '../services/productApi'
import { addToCart } from '../services/cartApi'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const relatedProducts = ref([])
const loading = ref(true)
const error = ref('')
const quantity = ref(1)

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

const swapHero = (e) => {
  document.querySelectorAll('.thumb').forEach((t) => t.classList.remove('active'))
  e.target.classList.add('active')
  const hero = document.getElementById('heroImg')
  if (hero) hero.src = e.target.src
}

const changeQty = (delta) => {
  quantity.value = Math.max(1, quantity.value + delta)
}

const loadProduct = async () => {
  loading.value = true
  error.value = ''
  try {
    product.value = await fetchProductById(route.params.id)
    // Load related products (same category)
    if (product.value?.danhMuc?.maDanhMuc) {
      const related = await fetchProducts({ categoryId: product.value.danhMuc.maDanhMuc, pageSize: 4 })
      relatedProducts.value = related.filter((p) => p.maSP !== product.value.maSP).slice(0, 4)
    }
  } catch (err) {
    error.value = err.message || 'Không thể tải chi tiết sản phẩm'
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async () => {
  if (!product.value) return
  
  // Kiểm tra user đã đăng nhập chưa
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    router.push('/login')
    return
  }

  try {
    await addToCart(product.value.maSP, quantity.value)
    
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

const handleBuyNow = async () => {
  if (!product.value) return
  
  // Kiểm tra user đã đăng nhập chưa
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    alert('Vui lòng đăng nhập để mua hàng')
    router.push('/login')
    return
  }

  try {
    await addToCart(product.value.maSP, quantity.value)
    
    // Cập nhật số lượng giỏ hàng ngay lập tức
    const refreshEvent = new CustomEvent('refreshCart')
    window.dispatchEvent(refreshEvent)
    
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

onMounted(loadProduct)
</script>

<style scoped>
.accent-danger {
  color: #dc3545;
}
.btn-danger,
.badge.bg-danger {
  --bs-danger: #dc3545;
}
.hero-photo {
  width: 100%;
  max-height: 420px;
  border-radius: 14px;
  object-fit: contain;
  background: #fff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  padding: 12px;
}
.thumb {
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.thumb:hover {
  transform: translateY(-2px);
  border-color: #dc3545;
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.15);
}
.thumb.active {
  border-color: #dc3545;
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.2);
}
.spec-table th {
  width: 30%;
  background: #f8f9fb;
  color: #212529;
}
.spec-table td,
.spec-table th {
  border-color: #e8e8e8;
}
@media (min-width: 992px) {
  .sticky-md {
    position: sticky;
    top: 90px;
  }
}
.btn-tall {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
.related-products .card {
  border: 1px solid #f1f1f1;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.related-products .card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}
.related-tile .card-img-top {
  padding: 8px;
}
.input-group button,
.input-group input {
  border-radius: 10px;
}
.small.text-muted i {
  color: #dc3545;
}
.info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(90deg, rgba(220, 53, 69, 0.08), rgba(220, 53, 69, 0.02));
  border: 1px solid rgba(220, 53, 69, 0.15);
  border-radius: 14px;
  padding: 12px 16px;
  color: #d6334c;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(220, 53, 69, 0.08);
}
.info-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  white-space: nowrap;
}
.info-item i {
  font-size: 18px;
}
.info-item span {
  display: inline-block;
}
.bg-danger-soft {
  background: rgba(220, 53, 69, 0.1);
  color: #d6334c;
}
.lead-sm {
  font-size: 15px;
  line-height: 1.6;
}
.price-box .badge {
  font-weight: 600;
}
.support-line span {
  display: inline-flex;
  align-items: center;
}
</style>
