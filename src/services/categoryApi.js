import { get } from './apiClient'

// Tạm thời: fetch danh mục từ products (lấy unique)
// Nếu backend có endpoint /api/danh-muc thì dùng endpoint đó
export const fetchCategories = async () => {
  try {
    // Thử fetch từ endpoint danh mục nếu có
    try {
      const data = await get('/danh-muc')
      if (Array.isArray(data)) return data
    } catch (err) {
      // Nếu không có endpoint, fetch từ products và lấy unique danh mục
      // Không log lỗi 404 vì đây là fallback hợp lệ
      if (err.message && !err.message.includes('404')) {
        console.warn('Error fetching categories from endpoint, using fallback:', err)
      }
      const products = await get('/san-pham?kichThuoc=1000')
      const content = products?.content || products || []
      const categoryMap = new Map()
      content.forEach((p) => {
        if (p.danhMuc && p.danhMuc.maDanhMuc) {
          if (!categoryMap.has(p.danhMuc.maDanhMuc)) {
            categoryMap.set(p.danhMuc.maDanhMuc, p.danhMuc)
          }
        }
      })
      return Array.from(categoryMap.values())
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
    // Fallback: danh mục mẫu
    return [
      { maDanhMuc: 1, tenDanhMuc: 'CPU' },
      { maDanhMuc: 2, tenDanhMuc: 'GPU' },
      { maDanhMuc: 3, tenDanhMuc: 'RAM' },
      { maDanhMuc: 4, tenDanhMuc: 'SSD' },
      { maDanhMuc: 5, tenDanhMuc: 'Mainboard' },
      { maDanhMuc: 6, tenDanhMuc: 'Case' },
      { maDanhMuc: 7, tenDanhMuc: 'Nguồn' },
      { maDanhMuc: 8, tenDanhMuc: 'Bàn phím' },
      { maDanhMuc: 9, tenDanhMuc: 'Màn hình' },
    ]
  }
}

