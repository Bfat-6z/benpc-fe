import { get, post, put, del } from './apiClient'

// ========== USER MANAGEMENT ==========
export const fetchUsers = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.role) queryParams.append('vaiTro', params.role)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  
  const query = queryParams.toString()
  return get(`/admin/nguoi-dung${query ? '?' + query : ''}`)
}

export const updateUserRole = async (userId, newRole) => {
  return put(`/admin/nguoi-dung/${userId}/role`, { vaiTro: newRole })
}

export const updateUserStatus = async (userId, newStatus) => {
  return put(`/admin/nguoi-dung/${userId}/status`, { trangThai: newStatus })
}

// ========== PRODUCT MANAGEMENT ==========
export const fetchAllProducts = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.categoryId) queryParams.append('maDanhMuc', params.categoryId)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  
  const query = queryParams.toString()
  return get(`/admin/san-pham${query ? '?' + query : ''}`)
}

export const createProduct = async (productData) => {
  return post('/admin/san-pham', productData)
}

export const updateProduct = async (productId, productData) => {
  return put(`/admin/san-pham/${productId}`, productData)
}

export const deleteProduct = async (productId) => {
  return del(`/admin/san-pham/${productId}`)
}

// ========== CATEGORY MANAGEMENT ==========
export const fetchAllCategories = async () => {
  return get('/admin/danh-muc')
}

export const createCategory = async (categoryData) => {
  return post('/admin/danh-muc', categoryData)
}

export const updateCategory = async (categoryId, categoryData) => {
  return put(`/admin/danh-muc/${categoryId}`, categoryData)
}

export const deleteCategory = async (categoryId) => {
  return del(`/admin/danh-muc/${categoryId}`)
}

// ========== ORDER MANAGEMENT ==========
export const fetchAllOrders = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.status) queryParams.append('trangThai', params.status)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  
  const query = queryParams.toString()
  return get(`/admin/hoa-don${query ? '?' + query : ''}`)
}

export const updateOrderStatus = async (orderId, newStatus) => {
  return put(`/admin/hoa-don/${orderId}/status`, { trangThai: newStatus })
}

export const fetchOrderById = async (orderId) => {
  // Admin endpoint để xem chi tiết đơn hàng (không cần check ownership)
  return get(`/admin/hoa-don/${orderId}`)
}

// ========== STATISTICS ==========
export const fetchStatistics = async () => {
  return get('/admin/thong-ke')
}

