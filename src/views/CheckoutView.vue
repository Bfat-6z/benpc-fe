<template>
  <div class="checkout-page">
    <div class="container">
      <div class="row g-4 align-items-start">
        <!-- =================== FORM =================== -->
        <div class="col-lg-7">
          <div class="section-head d-flex align-items-center gap-3 mb-3">
            <div class="icon-circle"><i class="bi bi-clipboard-check"></i></div>
            <div>
              <p class="tiny-label">Bước cuối</p>
              <h3 class="section-title">Hoàn tất thông tin đơn hàng</h3>
            </div>
          </div>

          <form class="glass-card" @submit.prevent="handleSubmit">
            <div class="block">
              <div class="block-title">
                <span class="step-pill">1</span>
                Thông tin liên hệ
              </div>
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-shell">
                    <i class="bi bi-envelope"></i>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="form-control"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-shell">
                    <i class="bi bi-person"></i>
                    <input
                      v-model="formData.ho"
                      class="form-control"
                      placeholder="Họ"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-shell">
                    <i class="bi bi-person-badge"></i>
                    <input
                      v-model="formData.ten"
                      class="form-control"
                      placeholder="Tên"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-shell">
                    <i class="bi bi-phone"></i>
                    <input
                      v-model="formData.dienThoai"
                      class="form-control"
                      placeholder="Điện thoại"
                      :required="!isGoogleLogin"
                    />
                  </div>
                  <small v-if="isGoogleLogin" class="text-muted">Có thể để trống nếu đăng nhập bằng Google</small>
                </div>
              </div>
            </div>

            <div class="block">
              <div class="block-title">
                <span class="step-pill">2</span>
                Giao hàng
              </div>
              <label class="form-label">Địa chỉ giao hàng</label>
              <div class="pill-switch mb-3">
                <label class="switch-option" :class="{ active: addressMode === 'saved' }">
                  <input
                    id="useSaved"
                    class="d-none"
                    type="radio"
                    value="saved"
                    v-model="addressMode"
                    @change="onAddressModeChange"
                  />
                  <span>Địa chỉ đã lưu</span>
                </label>
                <label class="switch-option" :class="{ active: addressMode === 'custom' }">
                  <input
                    id="useCustom"
                    class="d-none"
                    type="radio"
                    value="custom"
                    v-model="addressMode"
                    @change="onAddressModeChange"
                  />
                  <span>Nhập địa chỉ mới</span>
                </label>
              </div>

              <div v-if="addressMode === 'saved' && addresses.length" class="mb-3">
                <select v-model="selectedAddressId" class="form-select fancy-select" @change="onAddressSelect">
                  <option v-for="addr in addresses" :key="addr.maDiaChi" :value="addr.maDiaChi">
                    {{ formatAddress(addr) }}{{ addr.macDinh ? ' (Mặc định)' : '' }}{{ addr.isHistory ? ' (Đã dùng trước đó)' : '' }}
                  </option>
                </select>
                <div v-if="selectedAddressId" class="selected-box">
                  <small class="text-muted d-block mb-1">Địa chỉ đã chọn:</small>
                  <div class="fw-semibold">{{ getSelectedAddressText() }}</div>
                </div>
              </div>

              <div v-if="addressMode === 'custom'" class="mt-2">
                <div class="input-shell textarea-shell">
                  <i class="bi bi-geo-alt"></i>
                  <textarea
                    v-model="formData.diaChi"
                    class="form-control"
                    rows="2"
                    placeholder="Nhập địa chỉ giao hàng (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="block">
              <div class="block-title">
                <span class="step-pill">3</span>
                Vận chuyển & Thanh toán
              </div>
              <div class="option-card">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="ship"
                      id="shipFree"
                      checked
                    />
                    <label class="form-check-label" for="shipFree">FREE SHIP</label>
                  </div>
                  <span class="badge-free">Miễn phí</span>
                </div>
              </div>

              <div class="option-card mt-2" :class="{ active: formData.payment === 'COD' }">
                <div class="d-flex align-items-start gap-2">
                  <input
                    class="form-check-input mt-1"
                    type="radio"
                    name="payment"
                    id="cod"
                    value="COD"
                    v-model="formData.payment"
                    checked
                  />
                  <label class="form-check-label w-100" for="cod">
                    <div class="fw-semibold">Thanh toán khi nhận hàng (COD)</div>
                    <div class="small muted">Trả tiền cho đơn vị vận chuyển khi nhận hàng.</div>
                  </label>
                </div>
              </div>
              <div class="option-card mt-2 disabled-card">
                <div class="d-flex align-items-start gap-2">
                  <input
                    class="form-check-input mt-1"
                    type="radio"
                    name="payment"
                    id="bank"
                    value="BANK"
                    v-model="formData.payment"
                    disabled
                  />
                  <label class="form-check-label text-muted" for="bank">
                    <div class="fw-semibold">Chuyển khoản ngân hàng</div>
                    <div class="small text-muted">Đang phát triển</div>
                  </label>
                </div>
              </div>

              <div class="mt-3">
                <div class="option-card" :class="{ active: formData.sameAddress }">
                  <div class="d-flex align-items-center gap-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="sameaddr"
                      v-model="formData.sameAddress"
                      checked
                    />
                    <label class="form-check-label" for="sameaddr">Địa chỉ thanh toán giống địa chỉ giao hàng</label>
                  </div>
                </div>
                
                <div v-if="!formData.sameAddress" class="mt-3">
                  <label class="form-label fw-semibold">Địa chỉ thanh toán</label>
                  <div class="input-shell">
                    <i class="bi bi-house"></i>
                    <input
                      v-model="formData.diaChiThanhToan"
                      type="text"
                      class="form-control"
                      placeholder="Nhập địa chỉ thanh toán (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                      :required="!formData.sameAddress"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 d-grid">
              <button class="primary-btn w-100" type="submit" :disabled="submitting">
                <i class="bi bi-bag-check me-2"></i>
                <span v-if="submitting">Đang xử lý...</span>
                <span v-else>Đặt hàng</span>
              </button>
            </div>

            <div class="mt-3 tiny text-center">
              <a class="link-muted" href="javascript:history.back()">
                <i class="bi bi-arrow-left-short"></i> Quay lại
              </a>
              <span class="mx-2">•</span>
              <RouterLink class="link-accent" to="/">Tiếp tục mua sắm</RouterLink>
            </div>
          </form>
        </div>

        <!-- =================== SUMMARY =================== -->
        <div class="col-lg-5">
          <div class="glass-card summary-card">
            <div class="section-head d-flex align-items-center gap-2 mb-3">
              <div class="icon-circle sm"><i class="bi bi-receipt"></i></div>
              <h5 class="m-0">Đơn hàng</h5>
            </div>

            <div v-if="!cartItems.length" class="alert alert-warning modern-alert warn py-2">
              Giỏ hàng trống. <RouterLink to="/" class="link-accent">Quay lại mua sắm</RouterLink>.
            </div>

            <div v-else class="stagger-list">
              <div
                v-for="item in cartItems"
                :key="item.maGH || item.id"
                class="summary-item"
              >
                <div class="d-flex align-items-center gap-2">
                  <div class="thumb">
                    <img
                      :src="getImageUrl(item.sanPham?.hinhAnh || item.hinhAnh)"
                      :alt="item.sanPham?.tenSP || item.tenSP"
                    />
                  </div>
                  <div class="text-truncate">
                    <div class="small fw-semibold text-truncate" style="max-width: 260px">
                      {{ item.sanPham?.tenSP || item.tenSP }}
                    </div>
                    <div class="small muted">x{{ item.soLuong || item.quantity }}</div>
                  </div>
                </div>
                <div class="fw-semibold">
                  {{ formatCurrency((item.sanPham?.gia || item.donGia || item.price || 0) * (item.soLuong || item.quantity || 1)) }}
                </div>
              </div>
            </div>

            <hr />
            <div class="d-flex justify-content-between">
              <span class="muted">Tổng phụ</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="muted">Vận chuyển</span>
              <span class="fw-semibold text-success">MIỄN PHÍ</span>
            </div>
            <hr />
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-semibold">Tổng</span>
              <span class="h5 text-danger m-0">{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCheckoutData, createOrder, createAddress } from '../services/orderApi'

const router = useRouter()

const addresses = ref([])
const cartItems = ref([])
const selectedAddressId = ref('')
const addressMode = ref('saved') // 'saved' | 'custom'
const submitting = ref(false)

// Kiểm tra xem user có đăng nhập bằng Google không
const isGoogleLogin = computed(() => {
  return localStorage.getItem('loginMethod') === 'google'
})

const formData = ref({
  email: '',
  ho: '',
  ten: '',
  diaChi: '',
  dienThoai: '',
  payment: 'COD',
  sameAddress: true,
  diaChiThanhToan: '',
})

const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return '0đ'
}

const formatAddress = (addr) => {
  // Backend mới có thể có cấu trúc khác, tạm thời dùng các field có thể có
  return addr.diaChiChiTiet || addr.diaChi || `${addr.soNha || ''} ${addr.duong || ''}`.trim() || 'Địa chỉ'
}

const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/images/${path}`
}

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.sanPham?.gia || item.donGia || item.price || 0
    const qty = item.soLuong || item.quantity || 1
    return sum + Number(price) * Number(qty)
  }, 0)
})

const total = computed(() => subtotal.value)

const findExistingAddressByNorm = (norm) => {
  if (!norm) return null
  return addresses.value.find((a) => a._norm && a._norm === norm && !a.isHistory)
}

const onAddressSelect = () => {
  if (selectedAddressId.value) {
    const addr = addresses.value.find((a) => a.maDiaChi === selectedAddressId.value)
    if (addr) {
      // Fill form từ địa chỉ đã chọn
      formData.value.diaChi = addr.diaChiChiTiet || addr.diaChi || ''

      // Nếu chọn địa chỉ từ lịch sử, chỉ tạo mới khi chưa có bản ghi non-history trùng
      if (addr.isHistory && addr.diaChiChiTiet) {
        const norm = normalizeAddressKey(addr.diaChiChiTiet)
        const existed = findExistingAddressByNorm(norm)
        if (!existed) {
          createAddress({ diaChiChiTiet: addr.diaChiChiTiet })
            .then((res) => {
              // Sau khi tạo, thêm vào danh sách để tránh tạo trùng
              if (res?.maDiaChi) {
                addresses.value.unshift({
                  ...res,
                  _norm: norm,
                  isHistory: false,
                })
              }
            })
            .catch((err) => {
              console.error('Error creating address from history:', err)
            })
        }
      }
    }
  }
}

const onAddressModeChange = () => {
  if (addressMode.value === 'custom') {
    selectedAddressId.value = ''
    formData.value.diaChi = ''
  } else if (addressMode.value === 'saved' && addresses.value.length) {
    // Chọn lại default nếu chuyển từ custom về saved
    const defaultNonHistory = addresses.value.find((a) => a.macDinh && !a.isHistory)
    const defaultHistory = addresses.value.find((a) => a.macDinh && a.isHistory)
    const first = addresses.value[0]
    const chosen = defaultNonHistory || defaultHistory || first
    if (chosen) {
      selectedAddressId.value = chosen.maDiaChi
      onAddressSelect()
    }
  }
}

const getSelectedAddressText = () => {
  if (!selectedAddressId.value) return ''
  const addr = addresses.value.find((a) => a.maDiaChi === selectedAddressId.value)
  return addr ? (addr.diaChiChiTiet || addr.diaChi || '') : ''
}

// Load lịch sử địa chỉ từ localStorage, loại trùng (theo chuỗi địa chỉ đã normalize)
const loadAddressHistory = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return []

    const user = JSON.parse(userStr)
    const historyKey = `addressHistory_${user.maNguoiDung || 'guest'}`
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]')

    const seen = new Set()
    const unique = []
    history.forEach((item, index) => {
      const raw = item.diaChiChiTiet || item.diaChi || ''
      const norm = normalizeAddressKey(raw)
      if (!norm) return
      if (seen.has(norm)) return
      seen.add(norm)
      unique.push({
        maDiaChi: `history_${index}`, // ID tạm thời cho lịch sử
        diaChiChiTiet: raw,
        diaChi: raw,
        isHistory: true, // Đánh dấu là địa chỉ từ lịch sử
        createdAt: item.createdAt,
      })
    })
    return unique
  } catch (e) {
    console.error('Error loading address history:', e)
    return []
  }
}

const normalizeAddressKey = (str) => {
  if (!str) return ''
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const loadData = async () => {
  try {
    const data = await fetchCheckoutData()
    cartItems.value = data.gioHangList || []
    const apiAddresses = (data.diaChiList || []).map((addr) => ({
      ...addr,
      _norm: normalizeAddressKey(addr.diaChiChiTiet || addr.diaChi || ''),
    }))
    addresses.value = apiAddresses
    
    // Load lịch sử địa chỉ và thêm vào danh sách
    const addressHistory = loadAddressHistory()
    if (addressHistory.length > 0) {
      const seen = new Set(addresses.value.map((a) => a._norm).filter(Boolean))
      const historyFiltered = addressHistory.filter((h) => {
        if (!h._norm) return false
        if (seen.has(h._norm)) return false
        seen.add(h._norm)
        return true
      })
      // Thêm lịch sử địa chỉ vào đầu danh sách (sau địa chỉ mặc định)
      addresses.value = [...historyFiltered, ...addresses.value]
    }
    
    // Tự động điền thông tin từ user đã đăng nhập
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        formData.value.email = user.email || ''
        
        // Tách họ và tên từ tenNguoiDung
        if (user.tenNguoiDung) {
          const nameParts = user.tenNguoiDung.trim().split(' ')
          if (nameParts.length > 1) {
            formData.value.ho = nameParts.slice(0, -1).join(' ')
            formData.value.ten = nameParts[nameParts.length - 1]
          } else {
            formData.value.ten = user.tenNguoiDung
          }
        }
        
        formData.value.dienThoai = user.dienThoai || ''
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    
    const pickDefaultAddress = () => {
      if (!addresses.value.length) return
      const defaultNonHistory = addresses.value.find((a) => a.macDinh && !a.isHistory)
      const defaultHistory = addresses.value.find((a) => a.macDinh && a.isHistory)
      const first = addresses.value[0]
      const chosen = defaultNonHistory || defaultHistory || first
      if (chosen) {
        selectedAddressId.value = chosen.maDiaChi
        onAddressSelect()
      }
    }

    if (addresses.value.length) {
      pickDefaultAddress()
    } else {
      const savedAddress = localStorage.getItem('userAddress')
      if (savedAddress) {
        try {
          const addr = JSON.parse(savedAddress)
          formData.value.diaChi = addr.diaChi || ''
        } catch (e) {
          // Ignore
        }
      }
    }
  } catch (err) {
    alert(err.message || 'Không thể tải dữ liệu')
  }
}

const handleSubmit = async () => {
  if (!cartItems.value.length) {
    alert('Giỏ hàng đang trống')
    return
  }

  // Validate form
  if (!formData.value.email || !formData.value.ho || !formData.value.ten || !formData.value.diaChi) {
    alert('Vui lòng điền đầy đủ thông tin: Email, Họ, Tên, Địa chỉ')
    return
  }

  if (!isGoogleLogin.value && !formData.value.dienThoai) {
    alert('Vui lòng nhập số điện thoại')
    return
  }

  if (!formData.value.sameAddress && !formData.value.diaChiThanhToan) {
    alert('Vui lòng nhập địa chỉ thanh toán')
    return
  }

  submitting.value = true
  try {
    let addressId = selectedAddressId.value
    let diaChiMoi = null

    // Kiểm tra nếu địa chỉ được chọn là từ lịch sử
    const selectedAddr = addresses.value.find((a) => a.maDiaChi === selectedAddressId.value)
    const isHistoryAddress = selectedAddr?.isHistory

    // Kiểm tra addressId có giá trị hợp lệ không (không phải null, undefined, hoặc chuỗi rỗng)
    const hasValidAddressId = addressId != null && addressId !== '' && addressId !== undefined && !isHistoryAddress

    const inputAddr = (formData.value.diaChi || '').trim()
    const inputNorm = normalizeAddressKey(inputAddr)

    // Nếu user chọn địa chỉ từ lịch sử: nếu có bản ghi non-history trùng, dùng ID đó; ngược lại gửi diaChiMoi
    if (addressMode.value === 'custom') {
      // Người dùng nhập tay: ưu tiên địa chỉ trùng sẵn có, nếu không thì tạo mới
      const existed = findExistingAddressByNorm(inputNorm)
      if (existed?.maDiaChi) {
        addressId = Number(existed.maDiaChi)
        diaChiMoi = null
      } else if (inputAddr) {
        diaChiMoi = inputAddr
        addressId = null
      }
    } else if (isHistoryAddress) {
      const existed = findExistingAddressByNorm(inputNorm)
      if (existed?.maDiaChi) {
        addressId = Number(existed.maDiaChi)
        diaChiMoi = null
      } else if (inputAddr) {
        diaChiMoi = inputAddr
      }
    } else if (hasValidAddressId) {
      addressId = Number(addressId)
    } else if (inputAddr) {
      // Nếu user nhập địa chỉ mới, kiểm tra trùng
      const existed = findExistingAddressByNorm(inputNorm)
      if (existed?.maDiaChi) {
        addressId = Number(existed.maDiaChi)
        diaChiMoi = null
      } else {
        diaChiMoi = inputAddr
      }
    } else {
      // Nếu không có cả hai, thử dùng địa chỉ đầu tiên trong danh sách (không phải lịch sử)
      const firstNonHistoryAddr = addresses.value.find((addr) => !addr.isHistory && addr.maDiaChi)
      if (firstNonHistoryAddr) {
        addressId = Number(firstNonHistoryAddr.maDiaChi)
      }
    }

    if (!addressId && !diaChiMoi) {
      alert('Vui lòng chọn hoặc nhập địa chỉ giao hàng')
      submitting.value = false
      return
    }

    // Tạo đơn hàng - backend sẽ tự động tạo địa chỉ nếu cần
    const orderPayload = addressId && !isHistoryAddress
      ? { maDiaChi: addressId }
      : { diaChiMoi: diaChiMoi }

    console.log('Creating order with payload:', orderPayload) // Debug

    const order = await createOrder(orderPayload)
    if (order?.maHoaDon) {
      // Chuyển đến trang đặt hàng thành công
      router.push(`/order-success/${order.maHoaDon}`)
    } else {
      router.push('/order-success')
    }
  } catch (err) {
    const errorMsg = err.message || 'Không thể tạo đơn hàng'
    
    // Kiểm tra nếu lỗi là về tồn kho
    if (errorMsg.includes('không đủ tồn') || errorMsg.includes('không đủ')) {
      alert('⚠️ ' + errorMsg + '\n\nVui lòng giảm số lượng sản phẩm trong giỏ hàng hoặc liên hệ với chúng tôi để được hỗ trợ.')
    } else {
      alert('❌ ' + errorMsg)
    }
    
    console.error('Error creating order:', err)
  } finally {
    submitting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: radial-gradient(circle at 12% 18%, rgba(230, 244, 255, 0.55), transparent 25%),
    radial-gradient(circle at 90% 10%, rgba(255, 231, 231, 0.55), transparent 22%),
    linear-gradient(135deg, #f8fafc 0%, #f5f7fa 70%, #eef2f7 100%);
  padding: 48px 0 64px;
}

.section-head .icon-circle {
  width: 48px;
  height: 48px;
}

.section-title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffe9ec, #fff);
  color: #e63946;
  display: grid;
  place-items: center;
  font-size: 20px;
  box-shadow: 0 10px 30px rgba(230, 57, 70, 0.18);
}

.icon-circle.sm {
  width: 38px;
  height: 38px;
  font-size: 17px;
}

.tiny-label {
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
  font-size: 12px;
  margin: 0;
}

.glass-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  animation: fadeUp 0.6s ease both;
}

.summary-card {
  position: sticky;
  top: 18px;
}

.block {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.03);
}

.block-title {
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-pill {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #ffe9ec;
  color: #e63946;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
}

.input-shell i {
  color: #9ca3af;
  font-size: 16px;
}

.input-shell:focus-within {
  background: #fff;
  border-color: rgba(230, 57, 70, 0.45);
  box-shadow: 0 8px 26px rgba(230, 57, 70, 0.12);
}

.input-shell .form-control {
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 600;
  color: #111827;
  box-shadow: none;
}

.input-shell .form-control::placeholder {
  color: #b5becd;
  font-weight: 500;
}

.textarea-shell .form-control {
  resize: none;
  min-height: 80px;
}

.pill-switch {
  display: inline-flex;
  gap: 10px;
  background: #f3f4f6;
  padding: 6px;
  border-radius: 12px;
}

.switch-option {
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
}

.switch-option.active {
  background: #fff;
  color: #e63946;
  box-shadow: 0 10px 24px rgba(230, 57, 70, 0.08);
  border: 1px solid rgba(230, 57, 70, 0.18);
}

.fancy-select {
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.selected-box {
  margin-top: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px dashed rgba(230, 57, 70, 0.25);
}

.option-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  transition: all 0.2s ease;
}

.option-card.active {
  border-color: rgba(230, 57, 70, 0.4);
  box-shadow: 0 12px 24px rgba(230, 57, 70, 0.08);
}

.option-card.disabled-card {
  opacity: 0.6;
  background: #f3f4f6;
}

.badge-free {
  background: #ecfdf3;
  color: #15803d;
  border-radius: 10px;
  padding: 6px 10px;
  font-weight: 700;
}

.primary-btn {
  border: none;
  border-radius: 12px;
  padding: 14px 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #f25561, #e63946);
  color: #fff;
  box-shadow: 0 16px 32px rgba(230, 57, 70, 0.35);
  transition: transform 0.2s ease, box-shadow 0.25s ease, filter 0.2s ease;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 18px 36px rgba(230, 57, 70, 0.45);
  filter: brightness(1.03);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 10px 24px rgba(230, 57, 70, 0.3);
}

.primary-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.tiny {
  font-size: 13px;
  color: #6c757d;
}

.link-accent {
  color: #e63946;
  font-weight: 700;
  text-decoration: none;
  position: relative;
}

.link-accent::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(226, 57, 70, 0.8), rgba(242, 85, 97, 0.5));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.link-accent:hover::after {
  transform: scaleX(1);
}

.link-muted {
  color: #6b7280;
  text-decoration: none;
  font-weight: 600;
}

.link-muted:hover {
  color: #111827;
}

.muted {
  color: #6c757d;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.thumb {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #f5f7fa;
  border: 1px solid #eef2f7;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stagger-list {
  animation: fadeUp 0.6s ease both;
}

.modern-alert {
  border-radius: 12px;
  border: none;
  padding: 12px 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  background: #fff6f6;
  color: #c53030;
}

.modern-alert.warn {
  background: #fff8eb;
  color: #b45309;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 32px 0 48px;
  }

  .glass-card {
    padding: 18px;
  }
}
</style>
