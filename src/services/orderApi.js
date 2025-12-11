import { get, post } from './apiClient'

export const fetchCheckoutData = () => get('/checkout-data')
export const createOrder = (payload) => {
  // Nếu có maDiaChi (và không phải null/undefined) thì dùng, nếu không thì gửi diaChiMoi
  if (payload.maDiaChi != null && payload.maDiaChi !== undefined && payload.maDiaChi !== '') {
    return post('/hoa-don', { maDiaChi: Number(payload.maDiaChi) })
  } else if (payload.diaChiMoi && payload.diaChiMoi.trim()) {
    return post('/hoa-don', { diaChiMoi: payload.diaChiMoi.trim() })
  } else {
    throw new Error('Vui lòng chọn hoặc nhập địa chỉ giao hàng')
  }
}
export const fetchOrders = () => get('/hoa-don')
export const fetchOrderById = (id) => get(`/hoa-don/${id}`)
// Tạo địa chỉ mới (dùng khi user nhập địa chỉ mới)
export const createAddress = (addressData) => post('/dia-chi', {
  diaChiChiTiet: addressData.diaChiChiTiet || addressData.diaChi
})

