<template>
  <div class="bg-light min-vh-100" style="margin-top: 80px; padding: 2rem 0">
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-danger mb-4">
                <i class="bi bi-shield-check me-2"></i>Admin Panel
              </h5>
              <nav class="nav flex-column">
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'users' }"
                  @click="activeTab = 'users'"
                >
                  <i class="bi bi-people me-2"></i>Quản lý Người dùng
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'products' }"
                  @click="activeTab = 'products'"
                >
                  <i class="bi bi-box-seam me-2"></i>Quản lý Sản phẩm
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'categories' }"
                  @click="activeTab = 'categories'"
                >
                  <i class="bi bi-tags me-2"></i>Quản lý Danh mục
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'orders' }"
                  @click="activeTab = 'orders'"
                >
                  <i class="bi bi-receipt me-2"></i>Quản lý Đơn hàng
                </button>
                <button
                  class="nav-link text-start"
                  :class="{ active: activeTab === 'statistics' }"
                  @click="activeTab = 'statistics'"
                >
                  <i class="bi bi-graph-up me-2"></i>Thống kê
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10">
          <!-- Quản lý Người dùng -->
          <div v-if="activeTab === 'users'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-people me-2"></i>Quản lý Người dùng
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="row g-2">
                  <div class="col-md-6">
                    <input
                      v-model="userSearchKeyword"
                      type="text"
                      class="form-control"
                      placeholder="Tìm kiếm theo tên, email..."
                      @input="searchUsers"
                    />
                  </div>
                  <div class="col-md-6">
                    <select v-model="userRoleFilter" class="form-select" @change="loadUsers">
                      <option value="">Tất cả role</option>
                      <option value="user">Khách hàng</option>
                      <option value="nhanVien">Nhân viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-if="usersLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="usersError" class="alert alert-danger">
                {{ usersError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Role</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th class="text-end">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.maNguoiDung">
                        <td>{{ user.maNguoiDung }}</td>
                        <td>{{ user.tenNguoiDung }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.dienThoai || '-' }}</td>
                        <td>
                          <span class="badge" :class="getRoleBadgeClass(user.vaiTro)">
                            {{ getRoleLabel(user.vaiTro) }}
                          </span>
                        </td>
                        <td>
                          <span class="badge" :class="user.trangThai === false ? 'bg-secondary' : 'bg-success'">
                            {{ user.trangThai === false ? 'Đã khóa' : 'Hoạt động' }}
                          </span>
                        </td>
                        <td>{{ formatDate(user.ngayTao) }}</td>
                        <td>
                          <div class="d-flex justify-content-end flex-wrap gap-1">
                            <button
                              class="btn btn-sm btn-outline-primary"
                              @click="openEditUserModal(user)"
                              :disabled="user.vaiTro === 'admin' && currentUser?.vaiTro !== 'admin'"
                            >
                              <i class="bi bi-sliders"></i> Tùy chỉnh
                            </button>
                            <button
                              class="btn btn-sm btn-outline-secondary"
                              @click="viewOrdersOfUser(user)"
                              title="Xem đơn hàng của người dùng này"
                            >
                              <i class="bi bi-receipt"></i> Đơn
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý Sản phẩm -->
          <div v-if="activeTab === 'products'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-box-seam me-2"></i>Quản lý Sản phẩm
                </h5>
                <button class="btn btn-light btn-sm" @click="openAddProductModal">
                  <i class="bi bi-plus-circle me-1"></i>Thêm sản phẩm
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <input
                  v-model="productSearchKeyword"
                  type="text"
                  class="form-control"
                  placeholder="Tìm kiếm sản phẩm..."
                  @input="searchProducts"
                />
              </div>

              <div v-if="productsLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="productsError" class="alert alert-danger">
                {{ productsError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Tồn kho</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in products" :key="product.maSP">
                        <td>{{ product.maSP }}</td>
                        <td>
                          <img
                            :src="getImageUrl(product.hinhAnh)"
                            alt=""
                            style="width: 50px; height: 50px; object-fit: cover"
                            class="rounded"
                          />
                        </td>
                        <td>{{ product.tenSP }}</td>
                        <td>{{ product.danhMuc?.tenDanhMuc || '-' }}</td>
                        <td>{{ formatCurrency(product.gia) }}</td>
                        <td>{{ product.tonKho || 0 }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            @click="openEditProductModal(product)"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteProduct(product)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý Danh mục -->
          <div v-if="activeTab === 'categories'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-tags me-2"></i>Quản lý Danh mục
                </h5>
                <button class="btn btn-light btn-sm" @click="openAddCategoryModal">
                  <i class="bi bi-plus-circle me-1"></i>Thêm danh mục
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="categoriesLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="categoriesError" class="alert alert-danger">
                {{ categoriesError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Số sản phẩm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in categories" :key="category.maDanhMuc">
                        <td>{{ category.maDanhMuc }}</td>
                        <td>{{ category.tenDanhMuc }}</td>
                        <td>{{ category.soSanPham || 0 }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            @click="openEditCategoryModal(category)"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDeleteCategory(category)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý Đơn hàng -->
          <div v-if="activeTab === 'orders'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-receipt me-2"></i>Quản lý Đơn hàng
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="row g-2">
                  <div class="col-md-4">
                    <input
                      v-model="orderSearchKeyword"
                      type="text"
                      class="form-control"
                      placeholder="Tìm kiếm theo mã đơn..."
                      @keyup.enter="loadOrders"
                    />
                  </div>
                  <div class="col-md-4">
                    <select v-model="orderStatusFilter" class="form-select" @change="loadOrders">
                      <option value="">Tất cả trạng thái</option>
                      <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                      <option value="DANG_XU_LY">Đang xử lý</option>
                      <option value="DANG_GIAO">Đang giao</option>
                      <option value="DA_GIAO">Đã giao</option>
                      <option value="DA_HUY">Đã hủy</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-danger w-100" @click="loadOrders">
                      <i class="bi bi-search me-1"></i>Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="ordersLoading" class="text-center py-5">
                <div class="spinner-border text-danger" role="status"></div>
              </div>
              <div v-else-if="ordersError" class="alert alert-danger">
                {{ ordersError }}
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in orders" :key="order.maHoaDon">
                        <td>#{{ order.maHoaDon }}</td>
                        <td>{{ order.nguoiDung?.tenNguoiDung || '-' }}</td>
                        <td>{{ formatDate(order.ngayLap) }}</td>
                        <td>{{ formatCurrency(order.tongTien) }}</td>
                        <td>
                            <select
                            :value="order.trangThai || 'CHO_XAC_NHAN'"
                            class="form-select form-select-sm"
                            @change="handleUpdateOrderStatus(order, $event)"
                          >
                            <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                            <option value="DANG_XU_LY">Đang xử lý</option>
                            <option value="DANG_GIAO">Đang giao</option>
                            <option value="DA_GIAO">Đã giao</option>
                            <option value="DA_HUY">Đã hủy</option>
                          </select>
                        </td>
                        <td>
                          <RouterLink
                            :to="{
                              path: `/orders/${order.maHoaDon}`,
                              query: { fromAdmin: 'orders', adminTab: activeTab }
                            }"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="bi bi-eye"></i> Chi tiết
                          </RouterLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Thống kê -->
          <div v-if="activeTab === 'statistics'" class="card shadow-sm">
            <div class="card-header bg-danger text-white">
              <h5 class="mb-0">
                <i class="bi bi-graph-up me-2"></i>Thống kê Tổng quan
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-4 mb-3">
                <div class="col-md-3">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Tổng doanh thu</h6>
                      <h3 class="card-title">{{ formatCurrency(statistics.totalRevenue) }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-success text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Tổng đơn hàng</h6>
                      <h3 class="card-title">{{ statistics.totalOrders }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-info text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Tổng sản phẩm</h6>
                      <h3 class="card-title">{{ statistics.totalProducts }}</h3>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card bg-warning text-white">
                    <div class="card-body">
                      <h6 class="card-subtitle mb-2">Tổng người dùng</h6>
                      <h3 class="card-title">{{ statistics.totalUsers }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Thống kê chi tiết -->
              <div class="row g-4">
                <div class="col-lg-4">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <h6 class="fw-bold mb-3"><i class="bi bi-cash-coin me-2 text-success"></i>Doanh thu theo tiến trình</h6>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Đã giao</span>
                        <span class="fw-semibold text-success">{{ formatCurrency(revenueDelivered) }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Đang xử lý / chờ</span>
                        <span class="fw-semibold text-primary">{{ formatCurrency(revenueInProgress) }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Đã hủy</span>
                        <span class="fw-semibold text-muted">{{ formatCurrency(revenueCancelled) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <h6 class="fw-bold mb-3"><i class="bi bi-list-check me-2 text-info"></i>Đơn hàng theo trạng thái</h6>
                      <div class="d-flex justify-content-between mb-2" v-for="(cnt, key) in orderStatusSummary" :key="key">
                        <span>{{ getStatusLabel(key) }}</span>
                        <span class="badge bg-light text-dark">{{ cnt }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <h6 class="fw-bold mb-3"><i class="bi bi-people me-2 text-warning"></i>Người dùng theo vai trò</h6>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Admin</span>
                        <span class="badge bg-danger">{{ userRoleSummary.admin }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Nhân viên</span>
                        <span class="badge bg-info text-dark">{{ userRoleSummary.nhanVien }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Khách hàng</span>
                        <span class="badge bg-secondary">{{ userRoleSummary.user }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4 mt-1">
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <h6 class="fw-bold mb-3"><i class="bi bi-box-seam me-2 text-danger"></i>Sản phẩm tồn kho thấp (≤ 5)</h6>
                      <div v-if="lowStockProducts.length === 0" class="text-muted small">Không có sản phẩm tồn kho thấp</div>
                      <ul v-else class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="p in lowStockProducts" :key="p.maSP">
                          <span>{{ p.tenSP }}</span>
                          <span class="badge bg-warning text-dark">Tồn: {{ p.tonKho ?? p.soLuong ?? 0 }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                      <h6 class="fw-bold mb-3"><i class="bi bi-calendar-range me-2 text-primary"></i>Tóm tắt nhanh</h6>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Đơn đang xử lý (chờ/đang xử lý/đang giao)</span>
                        <span class="badge bg-primary">{{ orderStatusSummary.CHO_XAC_NHAN + orderStatusSummary.DANG_XU_LY + orderStatusSummary.DANG_GIAO }}</span>
                      </div>
                      <div class="d-flex justify-content-between mb-2">
                        <span>Đơn đã giao</span>
                        <span class="badge bg-success">{{ orderStatusSummary.DA_GIAO }}</span>
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Đơn đã hủy</span>
                        <span class="badge bg-secondary">{{ orderStatusSummary.DA_HUY }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Sửa Role User -->
    <div
      v-if="showEditUserModal"
      class="modal fade show"
      style="display: block"
      tabindex="-1"
      @click.self="closeEditUserModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tùy chỉnh người dùng</h5>
            <button type="button" class="btn-close" @click="closeEditUserModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">User: {{ selectedUser?.tenNguoiDung }}</label>
              <label class="form-label d-block">Email: {{ selectedUser?.email }}</label>
            </div>
            <div class="mb-3">
              <label class="form-label d-block">Role hiện tại:</label>
              <span class="badge" :class="getRoleBadgeClass(selectedUser?.vaiTro)">
                {{ getRoleLabel(selectedUser?.vaiTro) }}
              </span>
            </div>
            <div class="mb-3">
              <label class="form-label">Chọn Role mới:</label>
              <select v-model="newUserRole" class="form-select">
                <option value="user">Khách hàng</option>
                <option value="nhanVien">Nhân viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="userStatusSwitch" v-model="newUserStatus" />
              <label class="form-check-label" for="userStatusSwitch">
                {{ newUserStatus ? 'Hoạt động' : 'Đã khóa' }}
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditUserModal">Hủy</button>
            <button type="button" class="btn btn-danger" @click="saveUserRole" :disabled="updatingRole">
              <span v-if="updatingRole" class="spinner-border spinner-border-sm me-2"></span>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditUserModal" class="modal-backdrop fade show"></div>

    <!-- Modal Thêm/Sửa Sản phẩm -->
    <div
      v-if="showAddProductModal || showEditProductModal"
      class="modal fade show"
      style="display: block !important; z-index: 1050;"
      tabindex="-1"
      role="dialog"
      @click.self="showAddProductModal ? closeAddProductModal() : closeEditProductModal()"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h5>
            <button type="button" class="btn-close" @click="showAddProductModal ? closeAddProductModal() : closeEditProductModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên sản phẩm <span class="text-danger">*</span></label>
              <input v-model="productForm.tenSP" type="text" class="form-control" required />
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Giá <span class="text-danger">*</span></label>
                <input v-model.number="productForm.gia" type="number" class="form-control" min="0" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Tồn kho</label>
                <input v-model.number="productForm.tonKho" type="number" class="form-control" min="0" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Danh mục</label>
              <select v-model.number="productForm.maDanhMuc" class="form-select">
                <option :value="null">Chọn danh mục</option>
                <option v-for="cat in categories" :key="cat.maDanhMuc" :value="cat.maDanhMuc">
                  {{ cat.tenDanhMuc }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea v-model="productForm.moTa" class="form-control" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Hình ảnh (URL)</label>
              <input v-model="productForm.hinhAnh" type="text" class="form-control" placeholder="https://..." />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddProductModal ? closeAddProductModal() : closeEditProductModal()">
              Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="saveProduct">
              {{ selectedProduct ? 'Cập nhật' : 'Thêm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddProductModal || showEditProductModal" class="modal-backdrop fade show" style="z-index: 1040; display: block !important;"></div>

    <!-- Modal Thêm/Sửa Danh mục -->
    <div
      v-if="showAddCategoryModal || showEditCategoryModal"
      class="modal fade show"
      style="display: block !important; z-index: 1050;"
      tabindex="-1"
      role="dialog"
      @click.self="showAddCategoryModal ? closeAddCategoryModal() : closeEditCategoryModal()"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới' }}</h5>
            <button type="button" class="btn-close" @click="showAddCategoryModal ? closeAddCategoryModal() : closeEditCategoryModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên danh mục <span class="text-danger">*</span></label>
              <input v-model="categoryForm.tenDanhMuc" type="text" class="form-control" required />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddCategoryModal ? closeAddCategoryModal() : closeEditCategoryModal()">
              Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="saveCategory">
              {{ selectedCategory ? 'Cập nhật' : 'Thêm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddCategoryModal || showEditCategoryModal" class="modal-backdrop fade show" style="z-index: 1040; display: block !important;"></div>

    <!-- Notification Toast -->
    <div
      v-if="notification.show"
      class="position-fixed top-0 end-0 p-3"
      style="z-index: 9999; margin-top: 80px;"
    >
      <div
        class="toast show"
        :class="{
          'bg-success text-white': notification.type === 'success',
          'bg-danger text-white': notification.type === 'error',
          'bg-info text-white': notification.type === 'info'
        }"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header" :class="{
          'bg-success text-white': notification.type === 'success',
          'bg-danger text-white': notification.type === 'error',
          'bg-info text-white': notification.type === 'info'
        }">
          <i
            class="bi me-2"
            :class="{
              'bi-check-circle-fill': notification.type === 'success',
              'bi-exclamation-triangle-fill': notification.type === 'error',
              'bi-info-circle-fill': notification.type === 'info'
            }"
          ></i>
          <strong class="me-auto">
            {{ notification.type === 'success' ? 'Thành công' : notification.type === 'error' ? 'Lỗi' : 'Thông báo' }}
          </strong>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="notification.show = false"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Import các API sẽ tạo sau
import { 
  fetchUsers, 
  updateUserRole,
  updateUserStatus,
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAllOrders,
  updateOrderStatus,
  fetchStatistics
} from '../services/adminApi'

const router = useRouter()
const route = useRoute()

// Đồng bộ tab với query param để tránh lỗi và giữ tab khi quay lại
const activeTab = ref(route.query.tab || 'users')
const currentUser = ref(null)

// Users
const users = ref([])
const usersLoading = ref(false)
const usersError = ref('')
const userSearchKeyword = ref('')
const userRoleFilter = ref('')
const showEditUserModal = ref(false)
const selectedUser = ref(null)
const newUserRole = ref('user')
const newUserStatus = ref(true)
const updatingRole = ref(false)

// Products
const products = ref([])
const productsLoading = ref(false)
const productsError = ref('')
const productSearchKeyword = ref('')
const showAddProductModal = ref(false)
const showEditProductModal = ref(false)
const selectedProduct = ref(null)
const productForm = ref({
  tenSP: '',
  gia: 0,
  soLuong: 0,
  tonKho: 0, // Backend có thể dùng tonKho
  moTa: '',
  hinhAnh: '',
  maDanhMuc: null,
  maNCC: null,
})

// Categories
const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref('')
const showAddCategoryModal = ref(false)
const showEditCategoryModal = ref(false)
const selectedCategory = ref(null)
const categoryForm = ref({
  tenDanhMuc: '',
})

// Orders
const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')
const orderSearchKeyword = ref('')
const orderStatusFilter = ref('')

// Notifications
const notification = ref({ show: false, message: '', type: 'success' }) // type: 'success' | 'error' | 'info'

// Statistics
const statistics = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalUsers: 0,
})

// ========== STATISTICS HELPERS ==========
const orderStatusSummary = computed(() => {
  const summary = {
    CHO_XAC_NHAN: 0,
    DANG_XU_LY: 0,
    DANG_GIAO: 0,
    DA_GIAO: 0,
    DA_HUY: 0,
  }
  orders.value.forEach((o) => {
    const st = normalizeStatus(o.trangThai) || 'CHO_XAC_NHAN'
    if (summary[st] !== undefined) summary[st]++
  })
  return summary
})

const revenueDelivered = computed(() => {
  return orders.value
    .filter((o) => normalizeStatus(o.trangThai) === 'DA_GIAO')
    .reduce((sum, o) => sum + (o.tongTien || 0), 0)
})

const revenueInProgress = computed(() => {
  return orders.value
    .filter((o) => {
      const st = normalizeStatus(o.trangThai)
      return st === 'CHO_XAC_NHAN' || st === 'DANG_XU_LY' || st === 'DANG_GIAO'
    })
    .reduce((sum, o) => sum + (o.tongTien || 0), 0)
})

const revenueCancelled = computed(() => {
  return orders.value
    .filter((o) => normalizeStatus(o.trangThai) === 'DA_HUY')
    .reduce((sum, o) => sum + (o.tongTien || 0), 0)
})

const userRoleSummary = computed(() => {
  const summary = { admin: 0, nhanVien: 0, user: 0 }
  users.value.forEach((u) => {
    const roleLower = String(u.vaiTro || '').toLowerCase()
    if (roleLower.includes('admin')) summary.admin++
    else if (roleLower.includes('nhan') || roleLower.includes('viên')) summary.nhanVien++
    else summary.user++
  })
  return summary
})

const lowStockProducts = computed(() => {
  return products.value
    .filter((p) => (p.tonKho ?? p.soLuong ?? 0) <= 5)
    .sort((a, b) => (a.tonKho ?? a.soLuong ?? 0) - (b.tonKho ?? b.soLuong ?? 0))
    .slice(0, 5)
})

// Helper functions
const formatCurrency = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + 'đ'
  }
  return '0đ'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
  } catch (e) {
    return dateStr
  }
}

const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `/images/${path}`
}

const getRoleLabel = (role) => {
  if (!role) return 'Khách hàng'
  const roleLower = String(role).toLowerCase()
  const roleMap = {
    user: 'Khách hàng',
    'khách hàng': 'Khách hàng',
    'khach hang': 'Khách hàng',
    nhanvien: 'Nhân viên',
    'nhan_vien': 'Nhân viên',
    'nhân viên': 'Nhân viên',
    'nhan vien': 'Nhân viên',
    admin: 'Admin',
    administrator: 'Admin',
  }
  return roleMap[roleLower] || roleMap[role] || role
}

const getRoleBadgeClass = (role) => {
  const classMap = {
    user: 'bg-secondary',
    nhanVien: 'bg-info',
    admin: 'bg-danger',
  }
  return classMap[role] || 'bg-secondary'
}

const getStatusLabel = (status) => {
  if (!status) return 'Chờ xác nhận'
  const statusMap = {
    'CHO_XAC_NHAN': 'Chờ xác nhận',
    'Chờ xác nhận': 'Chờ xác nhận',
    'DANG_XU_LY': 'Đang xử lý',
    'Đang xử lý': 'Đang xử lý',
    'DANG_GIAO': 'Đang giao',
    'Đang giao': 'Đang giao',
    'DA_GIAO': 'Đã giao',
    'Đã giao': 'Đã giao',
    'DA_HUY': 'Đã hủy',
    'Đã hủy': 'Đã hủy',
  }
  return statusMap[status] || status
}

const normalizeStatus = (status) => {
  if (!status) return 'CHO_XAC_NHAN'
  const statusMap = {
    'Chờ xác nhận': 'CHO_XAC_NHAN',
    'Đang xử lý': 'DANG_XU_LY',
    'Đang giao': 'DANG_GIAO',
    'Đã giao': 'DA_GIAO',
    'Đã hủy': 'DA_HUY',
  }
  return statusMap[status] || status
}

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// User functions
const searchUsers = async () => {
  // Debounce search để tránh gọi API quá nhiều
  await loadUsers()
}

const openEditUserModal = (user) => {
  selectedUser.value = user
  newUserRole.value = user.vaiTro || 'user'
  newUserStatus.value = user.trangThai !== false
  showEditUserModal.value = true
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  selectedUser.value = null
  newUserRole.value = 'user'
  newUserStatus.value = true
}

const saveUserRole = async () => {
  if (!selectedUser.value) return
  
  updatingRole.value = true
  try {
    // Cập nhật role
    await updateUserRole(selectedUser.value.maNguoiDung, newUserRole.value)
    // Cập nhật trạng thái nếu có thay đổi
    if ((selectedUser.value.trangThai !== false) !== newUserStatus.value) {
      await updateUserStatus(selectedUser.value.maNguoiDung, newUserStatus.value)
    }

    closeEditUserModal()
    showNotification('Cập nhật người dùng thành công!', 'success')
    await loadUsers() // Reload users
  } catch (err) {
    console.error('Error updating user role:', err)
    showNotification('Cập nhật thất bại: ' + (err.message || 'Lỗi không xác định'), 'error')
  } finally {
    updatingRole.value = false
  }
}

const toggleUserStatus = async (user) => {
  if (!user || user.vaiTro === 'admin') {
    showNotification('Không thể khóa/mở khóa tài khoản admin.', 'error')
    return
  }
  togglingStatus.value = true
  try {
    const isLocked = user.trangThai === false
    const targetStatus = isLocked ? true : false // true = mở khóa, false = khóa
    await updateUserStatus(user.maNguoiDung, targetStatus)
    showNotification(`${targetStatus ? 'Mở khóa' : 'Khóa'} tài khoản thành công`, 'success')
    await loadUsers()
  } catch (err) {
    console.error('Error toggle user status:', err)
    showNotification('Lỗi: ' + (err.message || 'Không thể cập nhật trạng thái'), 'error')
  } finally {
    togglingStatus.value = false
  }
}

const viewOrdersOfUser = async (user) => {
  // Chuyển sang tab Đơn hàng và tìm theo tên/email của user
  orderSearchKeyword.value = user.tenNguoiDung || user.email || user.maNguoiDung || ''
  orderStatusFilter.value = ''
  activeTab.value = 'orders'
  await nextTick()
  await loadOrders()
  showNotification(`Đang lọc đơn hàng của ${user.tenNguoiDung || user.email || 'người dùng'}`, 'info')
}

// Product functions
const searchProducts = async () => {
  await loadProducts()
}

const openAddProductModal = () => {
  console.log('Opening add product modal')
  // Đảm bảo categories đã được load
  if (categories.value.length === 0) {
    loadCategories().then(() => {
      productForm.value = {
        tenSP: '',
        gia: 0,
        soLuong: 0,
        tonKho: 0,
        moTa: '',
        hinhAnh: '',
        maDanhMuc: null,
        maNCC: null,
      }
      selectedProduct.value = null
      showAddProductModal.value = true
      console.log('showAddProductModal set to:', showAddProductModal.value)
    })
  } else {
    productForm.value = {
      tenSP: '',
      gia: 0,
      soLuong: 0,
      tonKho: 0,
      moTa: '',
      hinhAnh: '',
      maDanhMuc: null,
      maNCC: null,
    }
    selectedProduct.value = null
    showAddProductModal.value = true
    console.log('showAddProductModal set to:', showAddProductModal.value)
  }
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
  productForm.value = {
    tenSP: '',
    gia: 0,
    soLuong: 0,
    tonKho: 0,
    moTa: '',
    hinhAnh: '',
    maDanhMuc: null,
    maNCC: null,
  }
}

const openEditProductModal = (product) => {
  selectedProduct.value = product
  productForm.value = {
    tenSP: product.tenSP || '',
    gia: product.gia || 0,
    soLuong: product.soLuong || product.tonKho || 0,
    tonKho: product.tonKho || product.soLuong || 0, // Backend có thể dùng tonKho
    moTa: product.moTa || '',
    hinhAnh: product.hinhAnh || '',
    maDanhMuc: product.danhMuc?.maDanhMuc || null,
    maNCC: product.nhaCungCap?.maNCC || null,
  }
  showEditProductModal.value = true
}

const closeEditProductModal = () => {
  showEditProductModal.value = false
  selectedProduct.value = null
}

const saveProduct = async () => {
  try {
    if (!productForm.value.tenSP || !productForm.value.gia) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
      return
    }
    
    if (productForm.value.gia <= 0) {
      showNotification('Giá sản phẩm phải lớn hơn 0', 'error')
      return
    }
    
    // Chuẩn hóa dữ liệu trước khi gửi
    const productData = {
      tenSP: productForm.value.tenSP.trim(),
      gia: Number(productForm.value.gia),
      tonKho: Number(productForm.value.tonKho || productForm.value.soLuong || 0),
      moTa: productForm.value.moTa || '',
      hinhAnh: productForm.value.hinhAnh || '',
    }
    
    // Chỉ thêm maDanhMuc nếu có giá trị
    if (productForm.value.maDanhMuc) {
      productData.maDanhMuc = Number(productForm.value.maDanhMuc)
    }
    
    if (selectedProduct.value) {
      // Update
      console.log('Updating product:', selectedProduct.value.maSP, productData)
      await updateProduct(selectedProduct.value.maSP, productData)
      showNotification('Cập nhật sản phẩm thành công!', 'success')
      closeEditProductModal()
    } else {
      // Create
      console.log('Creating product:', productData)
      await createProduct(productData)
      showNotification('Thêm sản phẩm thành công!', 'success')
      closeAddProductModal()
    }
    await loadProducts()
    await loadCategories() // Reload để cập nhật số sản phẩm
  } catch (err) {
    console.error('Error saving product:', err)
    const errorMsg = err.message || 'Không thể lưu sản phẩm'
    showNotification('Lỗi: ' + errorMsg, 'error')
  }
}

const confirmDeleteProduct = async (product) => {
  if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.tenSP}"?`)) {
    try {
      await deleteProduct(product.maSP)
      showNotification('Xóa sản phẩm thành công!', 'success')
      await loadProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      showNotification('Lỗi: ' + (err.message || 'Không thể xóa sản phẩm'), 'error')
    }
  }
}

// Category functions
const openAddCategoryModal = () => {
  console.log('Opening add category modal')
  categoryForm.value = { tenDanhMuc: '' }
  selectedCategory.value = null
  showAddCategoryModal.value = true
  console.log('showAddCategoryModal set to:', showAddCategoryModal.value)
}

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false
  categoryForm.value = { tenDanhMuc: '' }
}

const openEditCategoryModal = (category) => {
  selectedCategory.value = category
  categoryForm.value = { tenDanhMuc: category.tenDanhMuc || '' }
  showEditCategoryModal.value = true
}

const closeEditCategoryModal = () => {
  showEditCategoryModal.value = false
  selectedCategory.value = null
}

const saveCategory = async () => {
  try {
    if (!categoryForm.value.tenDanhMuc || !categoryForm.value.tenDanhMuc.trim()) {
      showNotification('Vui lòng nhập tên danh mục', 'error')
      return
    }
    
    if (selectedCategory.value) {
      // Update
      await updateCategory(selectedCategory.value.maDanhMuc, categoryForm.value)
      showNotification('Cập nhật danh mục thành công!', 'success')
      closeEditCategoryModal()
    } else {
      // Create
      await createCategory(categoryForm.value)
      showNotification('Thêm danh mục thành công!', 'success')
      closeAddCategoryModal()
    }
    await loadCategories()
  } catch (err) {
    console.error('Error saving category:', err)
    showNotification('Lỗi: ' + (err.message || 'Không thể lưu danh mục'), 'error')
  }
}

const confirmDeleteCategory = async (category) => {
  if (confirm(`Bạn có chắc muốn xóa danh mục "${category.tenDanhMuc}"?`)) {
    try {
      await deleteCategory(category.maDanhMuc)
      showNotification('Xóa danh mục thành công!', 'success')
      await loadCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      showNotification('Lỗi: ' + (err.message || 'Không thể xóa danh mục'), 'error')
    }
  }
}

// Order functions
const searchOrders = async () => {
  await loadOrders()
}

const handleUpdateOrderStatus = async (order, event) => {
  const oldStatus = order.trangThai
  const newStatus = event.target.value
  const normalizedStatus = normalizeStatus(newStatus)
  
  try {
    await updateOrderStatus(order.maHoaDon, normalizedStatus)
    order.trangThai = normalizedStatus
    showNotification('Cập nhật trạng thái đơn hàng thành công!', 'success')
  } catch (err) {
    console.error('Error updating order status:', err)
    order.trangThai = oldStatus // Revert về trạng thái cũ
    event.target.value = oldStatus // Revert select về giá trị cũ
    showNotification('Cập nhật trạng thái đơn hàng thất bại: ' + (err.message || 'Lỗi không xác định'), 'error')
  }
}

// Load data
const loadCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
}

// Map role từ frontend sang backend format
// Backend sẽ tự động match với nhiều format (user/Khách hàng, nhanVien/Nhân viên, admin/Admin)
// Nên chỉ cần gửi giá trị chuẩn
const mapRoleToBackend = (role) => {
  if (!role) return undefined
  // Giữ nguyên giá trị để backend tự match (backend dùng toLowerCase().contains())
  return role
}

const loadUsers = async () => {
  usersLoading.value = true
  usersError.value = ''
  try {
    // Thử nhiều format role để tìm
    let roleToSearch = userRoleFilter.value || undefined
    if (roleToSearch) {
      roleToSearch = mapRoleToBackend(roleToSearch)
    }
    
    const params = {}
    if (userSearchKeyword.value && userSearchKeyword.value.trim()) {
      params.keyword = userSearchKeyword.value.trim()
    }
    if (roleToSearch) {
      params.role = roleToSearch
    }
    params.page = 0
    params.size = 100
    
    console.log('Loading users with params:', params)
    const response = await fetchUsers(params)
    console.log('Users response:', response)
    // Backend có thể trả về Page hoặc array
    users.value = Array.isArray(response) ? response : (response?.content || [])
    console.log('Loaded users:', users.value.length)
    
    if (users.value.length === 0 && (userSearchKeyword.value || userRoleFilter.value)) {
      usersError.value = 'Không tìm thấy người dùng nào với điều kiện tìm kiếm này'
    }
  } catch (err) {
    console.error('Error loading users:', err)
    const errorMsg = err.message || 'Không thể tải danh sách người dùng'
    usersError.value = errorMsg
    users.value = []
  } finally {
    usersLoading.value = false
  }
}

const loadProducts = async () => {
  productsLoading.value = true
  productsError.value = ''
  try {
    const params = {}
    if (productSearchKeyword.value && productSearchKeyword.value.trim()) {
      params.keyword = productSearchKeyword.value.trim()
    }
    params.page = 0
    params.size = 1000
    
    console.log('Loading products with params:', params)
    const response = await fetchAllProducts(params)
    console.log('Products response:', response)
    // Backend có thể trả về Page hoặc array
    products.value = Array.isArray(response) ? response : (response?.content || [])
    console.log('Loaded products:', products.value.length)
  } catch (err) {
    console.error('Error loading products:', err)
    const errorMsg = err.message || 'Không thể tải danh sách sản phẩm'
    productsError.value = errorMsg
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

const loadCategories = async () => {
  categoriesLoading.value = true
  categoriesError.value = ''
  try {
    const response = await fetchAllCategories()
    categories.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error loading categories:', err)
    categoriesError.value = err.message || 'Không thể tải danh sách danh mục'
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

const loadOrders = async () => {
  ordersLoading.value = true
  ordersError.value = ''
  try {
    const params = {}
    if (orderSearchKeyword.value && orderSearchKeyword.value.trim()) {
      params.keyword = orderSearchKeyword.value.trim()
    }
    if (orderStatusFilter.value) {
      params.status = orderStatusFilter.value
    }
    params.page = 0
    params.size = 100
    
    console.log('Loading orders with params:', params)
    const response = await fetchAllOrders(params)
    console.log('Orders response:', response)
    // Backend có thể trả về Page hoặc array
    const ordersList = Array.isArray(response) ? response : (response?.content || [])
    // Normalize status cho tất cả orders
    orders.value = ordersList.map(order => ({
      ...order,
      trangThai: normalizeStatus(order.trangThai)
    }))
    console.log('Loaded orders:', orders.value.length)
  } catch (err) {
    console.error('Error loading orders:', err)
    const errorMsg = err.message || 'Không thể tải danh sách đơn hàng'
    ordersError.value = errorMsg
    orders.value = []
  } finally {
    ordersLoading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const data = await fetchStatistics()
    statistics.value = {
      totalRevenue: data?.totalRevenue || data?.tongDoanhThu || 0,
      totalOrders: data?.totalOrders || data?.tongDonHang || 0,
      totalProducts: data?.totalProducts || data?.tongSanPham || 0,
      totalUsers: data?.totalUsers || data?.tongNguoiDung || 0,
    }
  } catch (err) {
    console.error('Error loading statistics:', err)
    // Fallback: tính từ data hiện có
    statistics.value = {
      totalRevenue: orders.value.reduce((sum, o) => sum + (o.tongTien || 0), 0),
      totalOrders: orders.value.length,
      totalProducts: products.value.length,
      totalUsers: users.value.length,
    }
  }
}

// Helper function để lấy và normalize role (giống với LoginView)
const getUserRole = (user) => {
  if (!user) return 'user'
  
  // Ưu tiên: quyen.TenQuyen (từ bảng Quyen) > vaiTro > role > maQuyen
  // Vì backend dùng MaQuyen và bảng Quyen với TenQuyen
  const possibleRoles = [
    user.quyen?.tenQuyen,  // Ưu tiên cao nhất - tên quyền từ bảng Quyen
    user.quyen?.vaiTro,    // Nếu có trong object quyen
    user.vaiTro,           // Field vaiTro trực tiếp
    user.role,             // Field role
    user.maQuyen,          // ID quyền (sẽ cần map nếu là số)
  ]
  
  // Tìm role đầu tiên có giá trị
  let role = null
  for (const r of possibleRoles) {
    if (r !== null && r !== undefined && r !== '') {
      role = String(r).trim()
      break
    }
  }
  
  if (!role) return 'user'
  
  // Normalize role về lowercase để so sánh
  const normalizedRole = role.toLowerCase()
  
  // Map các giá trị có thể có về role chuẩn
  // Xử lý cả số (MaQuyen) nếu backend trả về ID
  if (normalizedRole === 'admin' || normalizedRole === 'administrator' || normalizedRole === '1') {
    return 'admin'
  }
  if (normalizedRole === 'nhanvien' || normalizedRole === 'nhan_vien' || normalizedRole === 'staff' || normalizedRole === 'employee' || normalizedRole === '2') {
    return 'nhanVien'
  }
  if (normalizedRole === 'user' || normalizedRole === '3' || normalizedRole === '0') {
    return 'user'
  }
  
  return 'user'
}

onMounted(() => {
  loadCurrentUser()
  // Check if user is admin
  const userRole = getUserRole(currentUser.value)
  console.log('AdminDashboard - Current user role:', userRole)
  console.log('AdminDashboard - Current user:', currentUser.value)
  
  if (userRole !== 'admin') {
    showNotification('Bạn không có quyền truy cập trang này.', 'error')
    setTimeout(() => {
      router.push('/')
    }, 2000)
    return
  }
  // Load categories trước để dùng trong product form
  loadCategories().then(() => {
    loadUsers()
    loadProducts()
    loadOrders()
    loadStatistics()
  })
})

// Khi tab thay đổi, cập nhật query param để back/forward vẫn đúng tab
watch(activeTab, (val) => {
  router.replace({ query: { ...route.query, tab: val } })
})

// Nếu query tab thay đổi (do back/forward), cập nhật activeTab
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  }
)

</script>

<style scoped>
.nav-link {
  color: #6c757d;
  border: none;
  background: none;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.nav-link.active {
  background-color: #dc3545;
  color: white;
  font-weight: 600;
}

.card {
  border-radius: 10px;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

