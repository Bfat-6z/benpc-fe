const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

async function request(path, options = {}) {
  const { method = 'GET', headers, body } = options

  // Lấy userId từ localStorage để gửi kèm header
  const userStr = localStorage.getItem('user')
  let userId = null
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      // Thử nhiều field name có thể có (camelCase và PascalCase)
      userId = user.maNguoiDung || user.MaNguoiDung || user.id || user.userId
      
      // Debug: Log userId để kiểm tra
      if (path.includes('gio-hang') || path.includes('cart')) {
        console.log('[apiClient] User from localStorage:', user)
        console.log('[apiClient] All possible userId fields:')
        console.log('  - maNguoiDung:', user.maNguoiDung)
        console.log('  - MaNguoiDung:', user.MaNguoiDung)
        console.log('  - id:', user.id)
        console.log('  - userId:', user.userId)
        console.log('[apiClient] Extracted userId:', userId)
      }
    } catch (e) {
      console.error('[apiClient] Error parsing user from localStorage:', e)
    }
  } else {
    // Debug: Log khi không có user
    if (path.includes('gio-hang') || path.includes('cart')) {
      console.warn('[apiClient] No user found in localStorage for path:', path)
    }
  }

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Thêm X-User-Id header nếu có userId
  if (userId) {
    requestHeaders['X-User-Id'] = userId.toString()
    // Debug: Log header được gửi
    if (path.includes('gio-hang') || path.includes('cart')) {
      console.log('[apiClient] Sending X-User-Id header:', userId.toString())
    }
  } else {
    // Debug: Log khi không có userId
    if (path.includes('gio-hang') || path.includes('cart')) {
      console.warn('[apiClient] No userId to send in X-User-Id header for path:', path)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorText = 'Unknown error'
    try {
      errorText = await response.text()
      // Thử parse JSON nếu có
      try {
        const errorJson = JSON.parse(errorText)
        errorText = errorJson.message || errorJson.error || errorText
      } catch (e) {
        // Không phải JSON, giữ nguyên errorText
      }
    } catch (e) {
      errorText = `Request failed with status ${response.status}`
    }
    // Nếu phát hiện thông báo khóa tài khoản -> auto logout phía client
    if (errorText && (errorText.toLowerCase().includes('khoá') || errorText.toLowerCase().includes('khoa') || errorText.toLowerCase().includes('locked'))) {
      try {
        localStorage.removeItem('user')
        localStorage.removeItem('loginMethod')
        window.dispatchEvent(new Event('user-updated'))
      } catch (e) {
        // ignore
      }
    }
    const error = new Error(errorText || `Request failed with ${response.status}`)
    error.status = response.status
    throw error
  }

  // Xử lý response rỗng hoặc 204 No Content
  if (response.status === 204 || response.status === 201) {
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return null
    }
  }

  // Kiểm tra xem có body không trước khi parse JSON
  const text = await response.text()
  if (!text || text.trim() === '') {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    // Nếu không parse được JSON, trả về null
    return null
  }
}

export const get = (path, options) => request(path, { ...options, method: 'GET' })
export const post = (path, body, options) =>
  request(path, { ...options, method: 'POST', body })
export const put = (path, body, options) =>
  request(path, { ...options, method: 'PUT', body })
export const del = (path, options) => request(path, { ...options, method: 'DELETE' })

export default {
  get,
  post,
  put,
  del,
}

