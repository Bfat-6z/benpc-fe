import { get } from './apiClient'

// Backend expects /san-pham with pagination params: tuKhoa, maDanhMuc, trang, kichThuoc
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams()
  if (params.keyword) query.append('tuKhoa', params.keyword)
  if (params.categoryId) query.append('maDanhMuc', params.categoryId)
  if (params.page != null) query.append('trang', params.page)
  if (params.pageSize != null) query.append('kichThuoc', params.pageSize)

  const data = await get(`/san-pham${query.toString() ? `?${query.toString()}` : ''}`)
  // API trả về Page<SanPham>; lấy content để hiển thị
  return Array.isArray(data?.content) ? data.content : []
}

export const fetchProductById = (id) => get(`/san-pham/${id}`)

