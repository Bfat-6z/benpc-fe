import { get, post, put, del } from './apiClient'

export const fetchCart = () => get('/gio-hang')

export const addToCart = (productId, quantity = 1) =>
  post('/gio-hang', { maSP: Number(productId), soLuong: Number(quantity) })

export const updateCartItem = (itemId, quantity) =>
  put(`/gio-hang/${itemId}`, { soLuong: Number(quantity) })

export const removeCartItem = (itemId) => del(`/gio-hang/${itemId}`)

// Backend không có endpoint xóa toàn bộ, tạm thời xóa từng item
export const clearCart = async (items = []) => {
  await Promise.all(items.map((item) => removeCartItem(item.maGH || item.id)))
}

