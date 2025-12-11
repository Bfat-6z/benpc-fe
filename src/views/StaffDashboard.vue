<template>
  <div class="bg-light min-vh-100" style="margin-top: 80px; padding: 2rem 0">
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-danger mb-4">
                <i class="bi bi-person-badge me-2"></i>Nhân viên
              </h5>
              <nav class="nav flex-column">
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'orders' }"
                  @click="activeTab = 'orders'"
                >
                  <i class="bi bi-receipt me-2"></i>Quản lý Đơn hàng
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'products' }"
                  @click="activeTab = 'products'"
                >
                  <i class="bi bi-box-seam me-2"></i>Quản lý Sản phẩm
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'categories' }"
                  @click="activeTab = 'categories'"
                >
                  <i class="bi bi-tags me-2"></i>Quản lý Danh mục
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'statistics' }"
                  @click="activeTab = 'statistics'"
                >
                  <i class="bi bi-graph-up me-2"></i>Thống kê Đơn hàng
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
          <!-- Quản lý Đơn hàng -->
          <div v-if="activeTab === 'orders'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-receipt me-2"></i>Quản lý Đơn hàng
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="row g-2">
                  <div class="col-md-4">
                    <input
                      v-model="orderSearchKeyword"
                      type="text"
                      class="form-control"
                      placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                      @input="searchOrders"
                    />
                  </div>
                  <div class="col-md-4">
                    <select v-model="orderStatusFilter" class="form-select" @change="searchOrders">
                      <option value="">Tất cả trạng thái</option>
                      <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                      <option value="DANG_XU_LY">Đang xử lý</option>
                      <option value="DANG_GIAO">Đang giao</option>
                      <option value="DA_GIAO">Đã giao</option>
                      <option value="DA_HUY">Đã hủy</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <input
                      v-model="orderDateFilter"
                      type="date"
                      class="form-control"
                      @change="searchOrders"
                    />
                  </div>
                </div>
              </div>

              <div v-if="ordersLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="ordersError" class="alert alert-danger">
                {{ ordersError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Email</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in orders" :key="order.maHoaDon">
                        <td class="fw-semibold">#{{ order.maHoaDon }}</td>
                        <td>{{ order.nguoiDung?.tenNguoiDung || '-' }}</td>
                        <td>{{ order.nguoiDung?.email || '-' }}</td>
                        <td>{{ formatDate(order.ngayLap) }}</td>
                        <td class="text-danger fw-bold">{{ formatCurrency(order.tongTien) }}</td>
                        <td>
                          <select
                            v-model="order.trangThai"
                            class="form-select form-select-sm"
                            @change="updateOrderStatus(order)"
                          >
                            <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                            <option value="DANG_XU_LY">Đang xử lý</option>
                            <option value="DANG_GIAO">Đang giao</option>
                            <option value="DA_GIAO">Đã giao</option>
                            <option value="DA_HUY">Đã hủy</option>
                          </select>
                        </td>
                        <td>
                          <RouterLink
                            :to="`/orders/${order.maHoaDon}`"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="bi bi-eye me-1"></i>Chi tiết
                          </RouterLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý Sản phẩm -->
          <div v-if="activeTab === 'products'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-box-seam me-2"></i>Quản lý Sản phẩm
                </h5>
                <button class="btn btn-light btn-sm" @click="openAddProductModal">
                  <i class="bi bi-plus-circle me-1"></i>Thêm sản phẩm
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <input
                  v-model="productSearchKeyword"
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm sản phẩm..."
                  @input="searchProducts"
                />
              </div>

              <div v-if="productsLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="productsError" class="alert alert-danger">
                {{ productsError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in products" :key="product.maSP">
                        <td>{{ product.maSP }}</td>
                        <td>
                          <img
                            :src="getImageUrl(product.hinhAnh)"
                            alt=""
                            style="width: 50px; height: 50px; object-fit: cover"
                            class="rounded"
                          />
                        </td>
                        <td>{{ product.tenSP }}</td>
                        <td>{{ product.danhMuc?.tenDanhMuc || '-' }}</td>
                        <td>{{ formatCurrency(product.gia) }}</td>
                        <td>
                          <input
                            v-model.number="product.tonKho"
                            type="number"
                            class="form-control form-control-sm"
                            style="width: 80px"
                            @blur="updateProductStock(product)"
                          />
                        </td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            @click="openEditProductModal(product)"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteProduct(product)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý Danh mục -->
          <div v-if="activeTab === 'categories'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-tags me-2"></i>Quản lý Danh mục
                </h5>
                <button class="btn btn-light btn-sm" @click="openAddCategoryModal">
                  <i class="bi bi-plus-circle me-1"></i>Thêm danh mục
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="categoriesLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="categoriesError" class="alert alert-danger">
                {{ categoriesError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Số sản phẩm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in categories" :key="category.maDanhMuc">
                        <td>{{ category.maDanhMuc }}</td>
                        <td>{{ category.tenDanhMuc }}</td>
                        <td>{{ category.soSanPham || 0 }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            @click="openEditCategoryModal(category)"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteCategory(category)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Thống kê Đơn hàng -->
          <div v-if="activeTab === 'statistics'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-graph-up me-2"></i>Thống kê Đơn hàng
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-4 mb-4">
                <div class="col-md-3">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Tổng đơn hàng</h6>
                      <h3 class="card-title">{{ orderStats.totalOrders }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-success text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Đã giao</h6>
                      <h3 class="card-title">{{ orderStats.delivered }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-warning text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Đang xử lý</h6>
                      <h3 class="card-title">{{ orderStats.processing }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-secondary text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Đã hủy</h6>
                      <h3 class="card-title">{{ orderStats.cancelled }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">Đơn hàng theo trạng thái</h6>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Chờ xác nhận</span>
                          <span class="badge bg-primary">{{ orderStatusSummary.CHO_XAC_NHAN }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Đang xử lý</span>
                          <span class="badge bg-warning text-dark">{{ orderStatusSummary.DANG_XU_LY }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Đang giao</span>
                          <span class="badge bg-info text-dark">{{ orderStatusSummary.DANG_GIAO }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Đã giao</span>
                          <span class="badge bg-success">{{ orderStatusSummary.DA_GIAO }}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                          <span>Đã hủy</span>
                          <span class="badge bg-secondary">{{ orderStatusSummary.DA_HUY }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-light">
                      <h6 class="mb-0">Đơn hàng theo tháng</h6>
                    </div>
                    <div class="card-body">
                      <div class="text-muted small">Đang cập nhật...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<!-- Product Modal -->
<div class="modal-backdrop fade show" v-if="showProductModal"></div>
<div class="modal fade" v-if="showProductModal" style="display:block;" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h5>
        <button type="button" class="btn-close" @click="closeProductModal"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên sản phẩm</label>
            <input v-model="productForm.tenSP" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Giá</label>
            <input v-model.number="productForm.gia" type="number" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label">Tồn kho</label>
            <input v-model.number="productForm.soLuong" type="number" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Danh mục</label>
            <select v-model="productForm.maDanhMuc" class="form-select">
              <option v-for="c in categories" :key="c.maDanhMuc" :value="c.maDanhMuc">
                {{ c.tenDanhMuc }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Hình ảnh (link hoặc tên file)</label>
            <input v-model="productForm.hinhAnh" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label">Mô tả</label>
            <textarea v-model="productForm.moTa" class="form-control" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeProductModal">Đóng</button>
        <button class="btn btn-danger" @click="saveProduct">Lưu</button>
      </div>
    </div>
  </div>
</div>

<!-- Category Modal -->
<div class="modal-backdrop fade show" v-if="showCategoryModal"></div>
<div class="modal fade" v-if="showCategoryModal" style="display:block;" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditingCategory ? 'Sửa danh mục' : 'Thêm danh mục' }}</h5>
        <button type="button" class="btn-close" @click="closeCategoryModal"></button>
      </div>
      <div class="modal-body">
        <label class="form-label">Tên danh mục</label>
        <input v-model="categoryForm.tenDanhMuc" class="form-control" />
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeCategoryModal">Đóng</button>
        <button class="btn btn-danger" @click="saveCategory">Lưu</button>
      </div>
    </div>
  </div>
</div>

  <!-- Product Modal -->
  <div
    class="modal fade show"
    v-if="showProductModal"
    style="display:block;"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h5>
          <button type="button" class="btn-close" @click="closeProductModal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tên sản phẩm</label>
              <input v-model="productForm.tenSP" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Giá</label>
              <input v-model.number="productForm.gia" type="number" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Tồn kho</label>
              <input v-model.number="productForm.soLuong" type="number" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Danh mục</label>
              <select v-model="productForm.maDanhMuc" class="form-select">
                <option v-for="c in categories" :key="c.maDanhMuc" :value="c.maDanhMuc">
                  {{ c.tenDanhMuc }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Hình ảnh (link hoặc tên file)</label>
              <input v-model="productForm.hinhAnh" class="form-control" />
            </div>
            <div class="col-12">
              <label class="form-label">Mô tả</label>
              <textarea v-model="productForm.moTa" class="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeProductModal">Đóng</button>
          <button class="btn btn-danger" @click="saveProduct">Lưu</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showProductModal"></div>

  <!-- Category Modal -->
  <div
    class="modal fade show"
    v-if="showCategoryModal"
    style="display:block;"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditingCategory ? 'Sửa danh mục' : 'Thêm danh mục' }}</h5>
          <button type="button" class="btn-close" @click="closeCategoryModal"></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Tên danh mục</label>
          <input v-model="categoryForm.tenDanhMuc" class="form-control" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCategoryModal">Đóng</button>
          <button class="btn btn-danger" @click="saveCategory">Lưu</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showCategoryModal"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  fetchOrders,
  updateOrderStatus as staffUpdateOrderStatus,
  fetchProducts,
  updateProductStock as staffUpdateProductStock,
  fetchCategories,
  createProduct as staffCreateProduct,
  updateProduct as staffUpdateProduct,
  createCategory as staffCreateCategory,
  updateCategory as staffUpdateCategory,
} from '../services/staffApi'

const router = useRouter()

const activeTab = ref('orders')
const currentUser = ref(null)

// Orders
const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')
const orderSearchKeyword = ref('')
const orderStatusFilter = ref('')
const orderDateFilter = ref('')
const orderStatusSummary = ref({
  CHO_XAC_NHAN: 0,
  DANG_XU_LY: 0,
  DANG_GIAO: 0,
  DA_GIAO: 0,
  DA_HUY: 0,
})

// Products
const products = ref([])
const productsLoading = ref(false)
const productsError = ref('')
const productSearchKeyword = ref('')
const showProductModal = ref(false)
const isEditingProduct = ref(false)
const productForm = ref({
  maSP: null,
  tenSP: '',
  gia: 0,
  soLuong: 0,
  moTa: '',
  hinhAnh: '',
  maDanhMuc: null,
})

// Categories
const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref('')
const showCategoryModal = ref(false)
const isEditingCategory = ref(false)
const categoryForm = ref({
  maDanhMuc: null,
  tenDanhMuc: '',
})

// Statistics
const orderStats = ref({
  totalOrders: 0,
  delivered: 0,
  processing: 0,
  pending: 0,
  cancelled: 0,
})

// Helper functions
const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return '0đ'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
  } catch (e) {
    return dateStr
  }
}

const canonicalizeStatus = (status) => {
  if (!status) return ''
  // bỏ dấu tiếng Việt, lowercase, bỏ khoảng trắng/gạch
  return String(status)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]/g, '')
}

const normalizeStatus = (status) => {
  const c = canonicalizeStatus(status)
  if (!c) return 'CHO_XAC_NHAN'
  if (c.includes('choxacnhan') || c === 'cho') return 'CHO_XAC_NHAN'
  if (c.includes('dangxuly') || c.includes('xuly')) return 'DANG_XU_LY'
  if (c.includes('danggiao') || c.includes('giaohang')) return 'DANG_GIAO'
  if (c.includes('dagiao') || c === 'giao') return 'DA_GIAO'
  if (c.includes('dahuy') || c.includes('huy')) return 'DA_HUY'
  return 'CHO_XAC_NHAN'
}

const getStatusLabel = (status) => {
  const map = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DANG_XU_LY: 'Đang xử lý',
    DANG_GIAO: 'Đang giao',
    DA_GIAO: 'Đã giao',
    DA_HUY: 'Đã hủy',
  }
  return map[normalizeStatus(status)] || status
}

const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/images/${path}`
}

// Order functions
const searchOrders = async () => {
  await loadOrders()
}

const updateOrderStatus = async (order) => {
  try {
    const normalized = normalizeStatus(order.trangThai)
    await staffUpdateOrderStatus(order.maHoaDon, normalized || 'CHO_XAC_NHAN')
    loadOrders()
  } catch (err) {
    console.error(err)
    alert(err.message || 'Không thể cập nhật trạng thái đơn hàng')
  }
}

// Product functions
const searchProducts = async () => {
  await loadProducts()
}

const openAddProductModal = () => {
  isEditingProduct.value = false
  productForm.value = {
    maSP: null,
    tenSP: '',
    gia: 0,
    soLuong: 0,
    moTa: '',
    hinhAnh: '',
    maDanhMuc: categories.value[0]?.maDanhMuc || null,
  }
  showProductModal.value = true
}

const openEditProductModal = (product) => {
  isEditingProduct.value = true
  productForm.value = {
    maSP: product.maSP,
    tenSP: product.tenSP,
    gia: product.gia,
    soLuong: product.tonKho ?? product.soLuong ?? 0,
    moTa: product.moTa,
    hinhAnh: product.hinhAnh,
    maDanhMuc: product.danhMuc?.maDanhMuc || null,
  }
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
}

const saveProduct = async () => {
  try {
    const payload = {
      tenSP: productForm.value.tenSP,
      gia: productForm.value.gia,
      soLuong: productForm.value.soLuong,
      moTa: productForm.value.moTa,
      hinhAnh: productForm.value.hinhAnh,
      danhMuc: productForm.value.maDanhMuc ? { maDanhMuc: productForm.value.maDanhMuc } : null,
    }
    if (isEditingProduct.value && productForm.value.maSP) {
      await staffUpdateProduct(productForm.value.maSP, payload)
    } else {
      await staffCreateProduct(payload)
    }
    closeProductModal()
    loadProducts()
    alert('Lưu sản phẩm thành công')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Không thể lưu sản phẩm')
  }
}

const updateProductStock = async (product) => {
  try {
    await staffUpdateProductStock(product.maSP, product.tonKho ?? product.soLuong ?? 0)
    alert('Cập nhật tồn kho thành công')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Không thể cập nhật tồn kho')
  }
}

// Category functions
const openAddCategoryModal = () => {
  isEditingCategory.value = false
  categoryForm.value = {
    maDanhMuc: null,
    tenDanhMuc: '',
  }
  showCategoryModal.value = true
}

const openEditCategoryModal = (category) => {
  isEditingCategory.value = true
  categoryForm.value = {
    maDanhMuc: category.maDanhMuc,
    tenDanhMuc: category.tenDanhMuc,
  }
  showCategoryModal.value = true
}

const confirmDeleteCategory = (category) => {
  if (confirm(`Bạn có chắc muốn xóa danh mục "${category.tenDanhMuc}"?`)) {
    // TODO: Implement delete category
    console.log('Delete category:', category.maDanhMuc)
  }
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
}

const saveCategory = async () => {
  try {
    const payload = {
      tenDanhMuc: categoryForm.value.tenDanhMuc,
    }
    if (isEditingCategory.value && categoryForm.value.maDanhMuc) {
      await staffUpdateCategory(categoryForm.value.maDanhMuc, payload)
    } else {
      await staffCreateCategory(payload)
    }
    closeCategoryModal()
    loadCategories()
    alert('Lưu danh mục thành công')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Không thể lưu danh mục')
  }
}

// Load data
const loadCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
}

const loadOrders = async () => {
  ordersLoading.value = true
  ordersError.value = ''
  try {
    const params = {
      keyword: orderSearchKeyword.value || undefined,
      // luôn lấy full, lọc client để tránh lệch format backend
      page: 0,
      size: 200
    }
    const response = await fetchOrders(params)
    const list = Array.isArray(response) ? response : response?.content || []
    const normalized = list
      .map((o) => ({
        ...o,
        trangThai: normalizeStatus(o.trangThai) || 'CHO_XAC_NHAN',
      }))
      .sort((a, b) => {
        const priority = {
          CHO_XAC_NHAN: 1,
          DANG_XU_LY: 2,
          DANG_GIAO: 3,
          DA_GIAO: 4,
          DA_HUY: 5,
        }
        return (priority[a.trangThai] || 99) - (priority[b.trangThai] || 99)
      })
    const selectedStatus = orderStatusFilter.value
      ? normalizeStatus(orderStatusFilter.value)
      : ''
    const filtered = normalized.filter((o) => {
      const statusOk = !selectedStatus || normalizeStatus(o.trangThai) === selectedStatus
      const dateOk =
        !orderDateFilter.value ||
        (o.ngayLap &&
          new Date(o.ngayLap).toISOString().slice(0, 10) === orderDateFilter.value)
      return statusOk && dateOk
    })
    orders.value = filtered
    calculateOrderStats()
  } catch (err) {
    ordersError.value = err.message || 'Không thể tải danh sách đơn hàng'
  } finally {
    ordersLoading.value = false
  }
}

const loadProducts = async () => {
  productsLoading.value = true
  productsError.value = ''
  try {
    const params = {
      keyword: productSearchKeyword.value || undefined,
      page: 0,
      size: 500
    }
    const response = await fetchProducts(params)
    const list = Array.isArray(response) ? response : response?.content || []
    products.value = list.map((p) => ({
      ...p,
      tonKho: p.tonKho ?? p.soLuong ?? 0,
    }))
  } catch (err) {
    productsError.value = err.message || 'Không thể tải danh sách sản phẩm'
  } finally {
    productsLoading.value = false
  }
}

const loadCategories = async () => {
  categoriesLoading.value = true
  categoriesError.value = ''
  try {
    const list = await fetchCategories()
    categories.value = Array.isArray(list) ? list : []
  } catch (err) {
    categoriesError.value = err.message || 'Không thể tải danh sách danh mục'
  } finally {
    categoriesLoading.value = false
  }
}

const calculateOrderStats = () => {
  const summary = {
    CHO_XAC_NHAN: 0,
    DANG_XU_LY: 0,
    DANG_GIAO: 0,
    DA_GIAO: 0,
    DA_HUY: 0,
  }
  orders.value.forEach((o) => {
    const st = normalizeStatus(o.trangThai)
    if (summary[st] !== undefined) summary[st]++
  })
  orderStatusSummary.value = summary

  orderStats.value = {
    totalOrders: orders.value.length,
    delivered: summary.DA_GIAO,
    processing: summary.DANG_XU_LY + summary.DANG_GIAO,
    pending: summary.CHO_XAC_NHAN,
    cancelled: summary.DA_HUY,
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

onMounted(() => {
  loadCurrentUser()
  // Check if user is staff or admin
  const userRole = getUserRole(currentUser.value)
  console.log('StaffDashboard - Current user role:', userRole)
  console.log('StaffDashboard - Current user:', currentUser.value)
  
  if (userRole !== 'nhanVien' && userRole !== 'admin') {
    alert('Bạn không có quyền truy cập trang này.')
    router.push('/')
    return
  }
  loadOrders()
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.nav-link {
  color: #6c757d;
  border: none;
  background: none;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.nav-link.active {
  background-color: #dc3545;
  color: white;
  font-weight: 600;
}

.card {
  border-radius: 10px;
}

/* Giữ tiêu đề bảng gọn gàng, không xuống dòng lộn xộn */
.table thead th {
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
}
</style>

