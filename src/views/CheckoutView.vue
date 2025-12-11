<template>
  <div class="bg-white">
    <div class="container py-4">
      <div class="row g-4">
        <!-- =================== FORM =================== -->
        <div class="col-lg-7">
          <h4 class="mb-3">Thông tin liên hệ</h4>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                v-model="formData.email"
                type="email"
                class="form-control"
                placeholder="Email"
                required
              />
            </div>

            <h4 class="mt-4 mb-3">Giao hàng</h4>
            <div class="mb-3">
              <label class="form-label">Địa chỉ giao hàng</label>
              <div class="d-flex align-items-center gap-2 mb-2">
                <div class="form-check">
                  <input
                    id="useSaved"
                    class="form-check-input"
                    type="radio"
                    value="saved"
                    v-model="addressMode"
                    @change="onAddressModeChange"
                  />
                  <label class="form-check-label" for="useSaved">Chọn địa chỉ đã lưu</label>
                </div>
                <div class="form-check">
                  <input
                    id="useCustom"
                    class="form-check-input"
                    type="radio"
                    value="custom"
                    v-model="addressMode"
                    @change="onAddressModeChange"
                  />
                  <label class="form-check-label" for="useCustom">Nhập địa chỉ mới</label>
                </div>
              </div>

              <div v-if="addressMode === 'saved' && addresses.length" class="mb-2">
                <select v-model="selectedAddressId" class="form-select" @change="onAddressSelect">
                  <option v-for="addr in addresses" :key="addr.maDiaChi" :value="addr.maDiaChi">
                    {{ formatAddress(addr) }}{{ addr.macDinh ? ' (Mặc định)' : '' }}{{ addr.isHistory ? ' (Đã dùng trước đó)' : '' }}
                  </option>
                </select>
                <div v-if="selectedAddressId" class="mt-2 p-3 bg-light rounded border">
                  <small class="text-muted d-block mb-1">Địa chỉ đã chọn:</small>
                  <div class="fw-semibold">{{ getSelectedAddressText() }}</div>
                </div>
              </div>

              <div v-if="addressMode === 'custom'" class="mt-2">
                <textarea
                  v-model="formData.diaChi"
                  class="form-control"
                  rows="2"
                  placeholder="Nhập địa chỉ giao hàng (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                  required
                ></textarea>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-md-6">
                <input
                  v-model="formData.ho"
                  class="form-control"
                  placeholder="Họ"
                  required
                />
              </div>
              <div class="col-md-6">
                <input
                  v-model="formData.ten"
                  class="form-control"
                  placeholder="Tên"
                  required
                />
              </div>
              <!-- <div class="col-12">
                <input
                  v-model="formData.diaChi"
                  class="form-control"
                  placeholder="Địa chỉ (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành, mã bưu chính)"
                  required
                />
              </div> -->
              <div class="col-md-6">
                <input
                  v-model="formData.dienThoai"
                  class="form-control"
                  placeholder="Điện thoại"
                  :required="!isGoogleLogin"
                />
                <small v-if="isGoogleLogin" class="text-muted">Có thể để trống nếu đăng nhập bằng Google</small>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="mb-3">Phương thức vận chuyển</h4>
              <div class="form-check border rounded-3 p-3 border-muted shadow-s">
                <input
                  class="form-check-input"
                  type="radio"
                  name="ship"
                  id="shipFree"
                  checked
                />
                <label class="form-check-label w-100 d-flex justify-content-between" for="shipFree">
                  <span>FREE SHIP</span>
                  <span class="fw-semibold">MIỄN PHÍ</span>
                </label>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="mb-3">Thanh toán</h4>
              <div class="form-check border rounded-3 p-3 border-muted mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="payment"
                  id="cod"
                  value="COD"
                  v-model="formData.payment"
                  checked
                />
                <label class="form-check-label w-100" for="cod">
                  <span class="fw-semibold">Thanh toán khi nhận hàng (COD)</span>
                  <div class="small muted">Trả tiền cho đơn vị vận chuyển khi nhận hàng.</div>
                </label>
              </div>
              <div class="form-check border rounded-3 p-3 border-muted bg-light">
                <input
                  class="form-check-input"
                  type="radio"
                  name="payment"
                  id="bank"
                  value="BANK"
                  v-model="formData.payment"
                  disabled
                />
                <label class="form-check-label text-muted" for="bank">
                  <span class="fw-semibold">Chuyển khoản ngân hàng</span>
                  <div class="small text-muted">Đang phát triển</div>
                </label>
              </div>
            </div>

            <div class="mt-4">
              <div class="form-check border rounded-3 p-3 border-muted">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="sameaddr"
                  v-model="formData.sameAddress"
                  checked
                />
                <label class="form-check-label" for="sameaddr">Địa chỉ thanh toán giống địa chỉ giao hàng</label>
              </div>
              
              <div v-if="!formData.sameAddress" class="mt-3">
                <label class="form-label fw-semibold">Địa chỉ thanh toán</label>
                <input
                  v-model="formData.diaChiThanhToan"
                  type="text"
                  class="form-control"
                  placeholder="Nhập địa chỉ thanh toán (Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
                  :required="!formData.sameAddress"
                />
              </div>
            </div>

            <div class="mt-4 d-grid">
              <button class="btn btn-danger btn-lg fw-bold" type="submit" :disabled="submitting">
                <i class="bi bi-bag-check me-2"></i>
                <span v-if="submitting">Đang xử lý...</span>
                <span v-else>Đặt hàng</span>
              </button>
            </div>

            <div class="mt-3 tiny">
              <a class="text-decoration-none" href="javascript:history.back()">
                <i class="bi bi-arrow-left-short"></i> Quay lại
              </a>
              <span class="mx-2">•</span>
              <RouterLink class="text-decoration-none" to="/">Tiếp tục mua sắm</RouterLink>
            </div>
          </form>
        </div>

        <!-- =================== SUMMARY =================== -->
        <div class="col-lg-5">
          <div class="border rounded-3 p-3 border-muted shadow-s">
            <h4 class="mb-3">Đơn hàng</h4>

            <div v-if="!cartItems.length" class="alert alert-warning py-2">
              Giỏ hàng trống. <RouterLink to="/" class="alert-link">Quay lại mua sắm</RouterLink>.
            </div>

            <div v-else>
              <div
                v-for="item in cartItems"
                :key="item.maGH || item.id"
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <div class="d-flex align-items-center gap-2">
                  <img
                    class="summary-img"
                    :src="getImageUrl(item.sanPham?.hinhAnh || item.hinhAnh)"
                    :alt="item.sanPham?.tenSP || item.tenSP"
                  />
                  <div>
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
              <span class="fw-semibold">MIỄN PHÍ</span>
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
:root {
  --brand: #dc3545;
}
.brand {
  color: var(--brand);
}
.btn-brand {
  background: var(--brand);
  color: #fff;
}
.btn-brand:hover {
  filter: brightness(0.95);
  color: #fff;
}
.border-muted {
  border-color: #e5e7eb !important;
}
.shadow-s {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.summary-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #eee;
}
.muted {
  color: #6b7280;
}
.tiny {
  font-size: 0.875rem;
}
</style>
