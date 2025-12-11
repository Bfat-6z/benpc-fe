<template>
  <div class="py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p class="text-primary text-uppercase fw-semibold mb-1">Đơn hàng</p>
        <h1 class="h4 mb-0">Lịch sử mua hàng</h1>
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
      <div v-if="!orders.length" class="alert alert-info">
        Chưa có đơn hàng nào.
      </div>

      <div v-else class="card">
        <div class="card-body table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th class="text-end">Tổng tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.maHoaDon">
                <td class="fw-semibold">#{{ order.maHoaDon }}</td>
                <td>{{ order.nguoiDung?.hoTen || 'Khách lẻ' }}</td>
                <td>{{ formatDate(order.ngayLap) }}</td>
                <td>
                  <span class="badge bg-primary-subtle text-primary fw-semibold">
                    {{ order.trangThai || 'Đang xử lý' }}
                  </span>
                </td>
                <td class="text-end text-primary fw-semibold">{{ formatCurrency(order.tongTien) }}</td>
                <td class="text-end">
                  <RouterLink class="btn btn-sm btn-outline-primary" :to="`/orders/${order.maHoaDon}`">
                    Xem
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchOrders } from '../services/orderApi'

const orders = ref([])
const loading = ref(true)
const error = ref('')

const formatCurrency = (value) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : value || ''

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN')}`
}

const loadOrders = async () => {
  loading.value = true
  error.value = ''
  try {
    orders.value = await fetchOrders()
  } catch (err) {
    error.value = err.message || 'Không thể tải danh sách đơn hàng'
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

