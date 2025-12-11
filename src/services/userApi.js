import { get, put } from './apiClient'

// Lấy danh sách tất cả users (admin only)
export const fetchUsers = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('tuKhoa', params.keyword)
  if (params.role) queryParams.append('vaiTro', params.role)
  if (params.page) queryParams.append('trang', params.page)
  if (params.size) queryParams.append('kichThuoc', params.size)
  
  const query = queryParams.toString()
  return get(`/nguoi-dung${query ? '?' + query : ''}`)
}

// Cập nhật role của user (admin only)
export const updateUserRole = async (userId, newRole) => {
  return put(`/nguoi-dung/${userId}/role`, { vaiTro: newRole })
}

// Lấy thông tin user theo ID
export const getUserById = async (userId) => {
  return get(`/nguoi-dung/${userId}`)
}

