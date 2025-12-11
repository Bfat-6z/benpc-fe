<template>
  <div class="bg-light min-vh-100 py-5" style="margin-top: 80px">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Success Header -->
          <div class="card shadow-lg border-0 mb-4">
            <div class="card-body p-5 text-center">
              <div class="success-icon mb-3">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <h2 class="text-success fw-bold mb-2">Đặt hàng thành công!</h2>
              <p class="text-muted mb-0">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
              </p>
            </div>
          </div>

          <div class="row g-4">
            <!-- Order Details -->
            <div class="col-lg-7">
              <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0 fw-bold">CHI TIẾT ĐƠN HÀNG</h5>
                </div>
                <div class="card-body p-4">
                  <div v-if="order">
                    <div class="mb-3 pb-3 border-bottom">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted">Đơn #{{ order.maHoaDon }}</span>
                        <span class="badge bg-warning text-dark">{{ order.trangThai || 'Chờ xác nhận' }}</span>
                      </div>
                      <div class="text-muted small">Ngày lập: {{ formatDate(order.ngayLap) }}</div>
                    </div>

                    <!-- Order Items -->
                    <div v-if="order.danhSachChiTiet && order.danhSachChiTiet.length" class="mb-3">
                      <div
                        v-for="(item, index) in order.danhSachChiTiet"
                        :key="index"
                        class="d-flex align-items-center justify-content-between mb-3 pb-3"
                        :class="{ 'border-bottom': index < order.danhSachChiTiet.length - 1 }"
                      >
                        <div class="d-flex align-items-center gap-3">
                          <div class="order-item-info">
                            <div class="fw-semibold">{{ item.sanPham?.tenSP || 'Sản phẩm' }}</div>
                            <div class="text-muted small">
                              Đơn giá: {{ formatCurrency(item.donGia) }} × SL: {{ item.soLuong }}
                            </div>
                          </div>
                        </div>
                        <div class="fw-bold text-danger">
                          {{ formatCurrency((item.donGia || 0) * (item.soLuong || 0)) }}
                        </div>
                      </div>
                    </div>

                    <!-- Total -->
                    <div class="border-top pt-3">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-semibold">Tổng cộng</span>
                        <span class="h5 text-danger m-0 fw-bold">{{ formatCurrency(order.tongTien) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="col-lg-5">
              <div class="card shadow-sm border-0 h-100">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0 fw-bold">Thông tin giao hàng</h5>
                </div>
                <div class="card-body p-4">
                  <div v-if="order && order.diaChi">
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Khách hàng</div>
                      <div class="fw-semibold">{{ order.nguoiDung?.tenNguoiDung || 'Khách lẻ' }}</div>
                    </div>
                    <div class="mb-3">
                      <div class="text-muted small mb-1">Địa chỉ</div>
                      <div class="fw-semibold">{{ order.diaChi?.diaChiChiTiet || 'Chưa có địa chỉ' }}</div>
                    </div>
                    <div>
                      <div class="text-muted small mb-1">Ngày lập</div>
                      <div class="fw-semibold">{{ formatDate(order.ngayLap) }}</div>
                    </div>
                  </div>
                  <div v-else class="text-muted">
                    Đang tải thông tin...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button @click="$router.back()" class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-arrow-left me-2"></i>Quay lại
            </button>
            <RouterLink to="/" class="btn btn-danger btn-lg">
              <i class="bi bi-cart me-2"></i>Tiếp tục mua
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchOrderById } from '../services/orderApi'

const route = useRoute()
const router = useRouter()
const order = ref(null)

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
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

onMounted(async () => {
  const orderId = route.params.id || route.query.orderId
  if (orderId) {
    try {
      order.value = await fetchOrderById(orderId)
    } catch (err) {
      console.error('Error loading order:', err)
    }
  }
})
</script>

<style scoped>
.success-icon {
  font-size: 80px;
  color: #28a745;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.card {
  border-radius: 15px;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
  min-width: 200px;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  transition: all 0.3s ease;
}
</style>

