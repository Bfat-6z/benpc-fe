import { get, put } from './apiClient'

export const fetchOrders = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.status) queryParams.append('trangThai', params.status)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  const query = queryParams.toString()
  return get(`/staff/hoa-don${query ? '?' + query : ''}`)
}

export const updateOrderStatus = async (orderId, newStatus) => {
  return put(`/staff/hoa-don/${orderId}/status`, { trangThai: newStatus })
}

export const fetchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.categoryId) queryParams.append('maDanhMuc', params.categoryId)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  const query = queryParams.toString()
  return get(`/staff/san-pham${query ? '?' + query : ''}`)
}

export const updateProductStock = async (productId, tonKho) => {
  return put(`/staff/san-pham/${productId}/stock`, { tonKho })
}

export const fetchCategories = async () => {
  return get('/staff/danh-muc')
}

export const createProduct = async (payload) => {
  return post('/staff/san-pham', payload)
}

export const updateProduct = async (id, payload) => {
  return put(`/staff/san-pham/${id}`, payload)
}

export const createCategory = async (payload) => {
  return post('/staff/danh-muc', payload)
}

export const updateCategory = async (id, payload) => {
  return put(`/staff/danh-muc/${id}`, payload)
}

