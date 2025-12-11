import { post, get, put } from './apiClient'

export const register = async (userData) => {
  return post('/nguoi-dung/register', {
    ho: userData.ho,
    ten: userData.ten,
    email: userData.email,
    soDienThoai: userData.soDienThoai,
    password: userData.password,
    diaChi: userData.diaChi,
    avatar: userData.avatar || null,
    vaiTro: 'user', // Mặc định role là "user" cho tất cả tài khoản đăng ký
  })
}

export const login = async (email, password) => {
  return post('/nguoi-dung/login', {
    email,
    password,
  })
}

export const getCurrentUser = async (userId) => {
  return get(`/nguoi-dung/current?userId=${userId}`)
}

export const updateProfile = async (userId, profileData) => {
  return put(`/nguoi-dung/update-profile?userId=${userId}`, {
    tenNguoiDung: profileData.tenNguoiDung,
    dienThoai: profileData.dienThoai,
    gioiTinh: profileData.gioiTinh,
    diaChi: profileData.diaChi,
  })
}

export const changePassword = async (userId, matKhauCu, matKhauMoi) => {
  return put(`/nguoi-dung/change-password?userId=${userId}`, {
    matKhauCu,
    matKhauMoi,
  })
}

export const updateAvatar = async (userId, avatarUrl) => {
  return put(`/nguoi-dung/update-avatar?userId=${userId}`, {
    avatar: avatarUrl,
  })
}

export const loginWithGoogle = async (credential) => {
  return post('/nguoi-dung/google-login', {
    credential,
    vaiTro: 'user', // Mặc định role là "user" cho tài khoản đăng nhập bằng Google
  })
}

