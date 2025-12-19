<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <div class="dashboard-layout">
        <!-- Modern Sidebar -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">
              <i class="bi bi-shield-check-fill"></i>
              <span>Admin Panel</span>
            </div>
          </div>
          <nav class="sidebar-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'users' }"
              @click="activeTab = 'users'"
            >
              <div class="nav-icon">
                <i class="bi bi-people-fill"></i>
              </div>
              <span class="nav-label">Người dùng</span>
              <div class="nav-indicator"></div>
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'products' }"
              @click="activeTab = 'products'"
            >
              <div class="nav-icon">
                <i class="bi bi-box-seam-fill"></i>
              </div>
              <span class="nav-label">Sản phẩm</span>
              <div class="nav-indicator"></div>
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'categories' }"
              @click="activeTab = 'categories'"
            >
              <div class="nav-icon">
                <i class="bi bi-tags-fill"></i>
              </div>
              <span class="nav-label">Danh mục</span>
              <div class="nav-indicator"></div>
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'orders' }"
              @click="activeTab = 'orders'"
            >
              <div class="nav-icon">
                <i class="bi bi-receipt-cutoff"></i>
              </div>
              <span class="nav-label">Đơn hàng</span>
              <div class="nav-indicator"></div>
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'statistics' }"
              @click="activeTab = 'statistics'"
            >
              <div class="nav-icon">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
              <span class="nav-label">Thống kê</span>
              <div class="nav-indicator"></div>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="dashboard-main">
          <!-- Quản lý Người dùng -->
          <div v-if="activeTab === 'users'" class="users-management">
            <!-- Header -->
            <div class="section-header">
              <div>
                <h3 class="section-title">
                  <i class="bi bi-people-fill me-2"></i>Quản lý Người dùng
                </h3>
                <p class="section-subtitle">Quản lý tài khoản và quyền truy cập của người dùng</p>
              </div>
            </div>

            <!-- Filters -->
            <div class="filters-bar">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="userSearchKeyword"
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm theo tên, email..."
                  @input="searchUsers"
                />
                <button
                  v-if="userSearchKeyword"
                  class="search-clear"
                  @click="userSearchKeyword = ''; searchUsers()"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <select v-model="userRoleFilter" class="filter-select" @change="loadUsers">
                <option value="">Tất cả role</option>
                <option value="user">Khách hàng</option>
                <option value="nhanVien">Nhân viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Loading -->
            <div v-if="usersLoading" class="loading-state">
              <div class="spinner-wrapper">
                <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted">Đang tải người dùng...</p>
              </div>
            </div>

            <!-- Error -->
            <div v-else-if="usersError" class="error-state">
              <div class="alert alert-danger border-0 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ usersError }}
              </div>
            </div>

            <!-- Users Grid -->
            <div v-else-if="users.length > 0" class="users-grid">
              <div
                v-for="(user, index) in users"
                :key="user.maNguoiDung"
                class="user-card"
                :style="{ animationDelay: `${index * 0.03}s` }"
              >
                <div class="user-card-inner">
                  <div class="user-header-section">
                    <div class="user-avatar-wrapper">
                      <div class="user-avatar">
                        <i class="bi bi-person-fill"></i>
                      </div>
                      <div class="user-status-dot" :class="user.trangThai === false ? 'status-offline' : 'status-online'"></div>
                    </div>
                    <div class="user-badges-section">
                      <span class="role-badge-modern" :class="getRoleBadgeClass(user.vaiTro)">
                        {{ getRoleLabel(user.vaiTro) }}
                      </span>
                      <span class="status-badge-modern" :class="user.trangThai === false ? 'status-locked' : 'status-active'">
                        <i class="bi" :class="user.trangThai === false ? 'bi-lock-fill' : 'bi-check-circle-fill'"></i>
                        {{ user.trangThai === false ? 'Đã khóa' : 'Hoạt động' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="user-content-section">
                    <h5 class="user-name-modern">{{ user.tenNguoiDung }}</h5>
                    <div class="user-info-modern">
                      <div 
                        class="info-item-modern info-item-clickable"
                        @click.stop.prevent="handleInfoItemClick(user, $event)"
                        :class="{ 'disabled': user.vaiTro === 'admin' && currentUser?.vaiTro !== 'admin' }"
                        title="Nhấp để tùy chỉnh"
                      >
                        <div class="info-icon">
                          <i class="bi bi-envelope"></i>
                        </div>
                        <span class="info-text">{{ user.email }}</span>
                      </div>
                      <div 
                        class="info-item-modern info-item-clickable"
                        v-if="user.dienThoai"
                        @click.stop.prevent="handleInfoItemClick(user, $event)"
                        :class="{ 'disabled': user.vaiTro === 'admin' && currentUser?.vaiTro !== 'admin' }"
                        title="Nhấp để tùy chỉnh"
                      >
                        <div class="info-icon">
                          <i class="bi bi-telephone"></i>
                        </div>
                        <span class="info-text">{{ user.dienThoai }}</span>
                      </div>
                      <div 
                        class="info-item-modern info-item-clickable"
                        @click.stop.prevent="handleInfoItemClick(user, $event)"
                        :class="{ 'disabled': user.vaiTro === 'admin' && currentUser?.vaiTro !== 'admin' }"
                        title="Nhấp để tùy chỉnh"
                      >
                        <div class="info-icon">
                          <i class="bi bi-calendar3"></i>
                        </div>
                        <span class="info-text">Ngày tạo: {{ formatDate(user.ngayTao) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="user-actions-section">
                    <button
                      class="user-action-btn user-edit-btn"
                      @click="openEditUserModal(user)"
                      :disabled="user.vaiTro === 'admin' && currentUser?.vaiTro !== 'admin'"
                      title="Tùy chỉnh"
                    >
                      <i class="bi bi-sliders"></i>
                    </button>
                    <button
                      class="user-action-btn user-orders-btn"
                      @click="viewOrdersOfUser(user)"
                      title="Xem đơn hàng"
                    >
                      <i class="bi bi-receipt"></i>
                    </button>
                    <button
                      class="user-action-btn user-delete-btn"
                      @click="confirmDeleteUser(user)"
                      :disabled="user.vaiTro === 'admin' || user.maNguoiDung === currentUser?.maNguoiDung"
                      title="Xóa tài khoản"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="user-card-shine"></div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <i class="bi bi-people empty-icon"></i>
              <h5 class="mt-3 mb-2">Không tìm thấy người dùng</h5>
              <p class="text-muted">
                {{ userSearchKeyword || userRoleFilter ? 'Thử thay đổi bộ lọc' : 'Chưa có người dùng nào' }}
              </p>
            </div>
          </div>

          <!-- Quản lý Sản phẩm -->
          <div v-if="activeTab === 'products'" class="products-management">
            <!-- Header Section -->
            <div class="products-header">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 class="mb-1 fw-bold text-dark">
                    <i class="bi bi-box-seam me-2 text-danger"></i>Quản lý Sản phẩm
                  </h4>
                  <p class="text-muted small mb-0">Quản lý và theo dõi tất cả sản phẩm trong hệ thống</p>
                </div>
                <button class="btn btn-danger btn-add-product" @click="openAddProductModal">
                  <i class="bi bi-plus-circle me-2"></i>Thêm sản phẩm
                </button>
              </div>

              <!-- Search Bar -->
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="productSearchKeyword"
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm sản phẩm theo tên, danh mục..."
                  @input="searchProducts"
                />
                <button
                  v-if="productSearchKeyword"
                  class="search-clear"
                  @click="productSearchKeyword = ''; searchProducts()"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="productsLoading" class="products-loading">
              <div class="spinner-wrapper">
                <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted">Đang tải sản phẩm...</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="productsError" class="products-error">
              <div class="alert alert-danger border-0 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ productsError }}
              </div>
            </div>

            <!-- Products Grid -->
            <div v-else-if="products.length > 0" class="products-grid">
              <div
                v-for="(product, index) in products"
                :key="product.maSP"
                class="product-card"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <div class="product-image-wrapper">
                  <img
                    :src="getImageUrl(product.hinhAnh)"
                    :alt="product.tenSP"
                    class="product-image"
                  />
                  <div class="product-id-badge">#{{ product.maSP }}</div>
                </div>
                
                <div class="product-content">
                  <div class="product-category">
                    <i class="bi bi-tag-fill me-1"></i>
                    {{ product.danhMuc?.tenDanhMuc || 'Chưa phân loại' }}
                  </div>
                  
                  <h6 class="product-name" :title="product.tenSP">
                    {{ product.tenSP }}
                  </h6>
                  
                  <div class="product-info">
                    <div class="product-price">
                      <i class="bi bi-currency-exchange me-1"></i>
                      {{ formatCurrency(product.gia) }}
                    </div>
                    <div class="product-stock" :class="{ 'stock-low': (product.tonKho ?? product.soLuong ?? 0) <= 5, 'stock-out': (product.tonKho ?? product.soLuong ?? 0) === 0 }">
                      <i class="bi me-1" :class="(product.tonKho ?? product.soLuong ?? 0) === 0 ? 'bi-x-circle-fill' : (product.tonKho ?? product.soLuong ?? 0) <= 5 ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'"></i>
                      Tồn kho: <strong>{{ product.tonKho ?? product.soLuong ?? 0 }}</strong>
                    </div>
                  </div>
                </div>
                
                <div class="product-actions">
                  <button
                    class="btn-action btn-edit"
                    @click="openEditProductModal(product)"
                    title="Chỉnh sửa"
                  >
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    class="btn-action btn-delete"
                    @click="confirmDeleteProduct(product)"
                    title="Xóa"
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="products-empty">
              <div class="empty-state">
                <i class="bi bi-inbox empty-icon"></i>
                <h5 class="mt-3 mb-2">Không tìm thấy sản phẩm</h5>
                <p class="text-muted mb-4">
                  {{ productSearchKeyword ? 'Thử tìm kiếm với từ khóa khác' : 'Bắt đầu bằng cách thêm sản phẩm mới' }}
                </p>
                <button v-if="!productSearchKeyword" class="btn btn-danger" @click="openAddProductModal">
                  <i class="bi bi-plus-circle me-2"></i>Thêm sản phẩm đầu tiên
                </button>
              </div>
            </div>
          </div>

          <!-- Quản lý Danh mục -->
          <div v-if="activeTab === 'categories'" class="categories-management">
            <!-- Header -->
            <div class="section-header">
              <div>
                <h3 class="section-title">
                  <i class="bi bi-tags-fill me-2"></i>Quản lý Danh mục
                </h3>
                <p class="section-subtitle">Tổ chức và quản lý các danh mục sản phẩm</p>
              </div>
              <button class="btn btn-danger btn-add" @click="openAddCategoryModal">
                <i class="bi bi-plus-circle me-2"></i>Thêm danh mục
              </button>
            </div>

            <!-- Loading -->
            <div v-if="categoriesLoading" class="loading-state">
              <div class="spinner-wrapper">
                <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted">Đang tải danh mục...</p>
              </div>
            </div>

            <!-- Error -->
            <div v-else-if="categoriesError" class="error-state">
              <div class="alert alert-danger border-0 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ categoriesError }}
              </div>
            </div>

            <!-- Categories Grid -->
            <div v-else-if="categories.length > 0" class="categories-grid">
              <div
                v-for="(category, index) in categories"
                :key="category.maDanhMuc"
                class="category-card"
                :style="{ animationDelay: `${index * 0.05}s` }"
              >
                <div class="category-icon">
                  <i class="bi" :class="getCategoryIcon(category.tenDanhMuc)"></i>
                </div>
                <div class="category-content">
                  <h6 class="category-name">{{ category.tenDanhMuc }}</h6>
                  <div class="category-count">
                    <i class="bi bi-box-seam me-1"></i>
                    <span>{{ category.soSanPham || 0 }} sản phẩm</span>
                  </div>
                </div>
                <div class="category-actions">
                  <button
                    class="category-btn category-edit-btn"
                    @click="openEditCategoryModal(category)"
                    title="Chỉnh sửa"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="category-btn category-delete-btn"
                    @click="confirmDeleteCategory(category)"
                    title="Xóa"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <i class="bi bi-tags empty-icon"></i>
              <h5 class="mt-3 mb-2">Chưa có danh mục</h5>
              <p class="text-muted mb-4">Bắt đầu bằng cách thêm danh mục đầu tiên</p>
              <button class="btn btn-danger" @click="openAddCategoryModal">
                <i class="bi bi-plus-circle me-2"></i>Thêm danh mục
              </button>
            </div>
          </div>

          <!-- Quản lý Đơn hàng -->
          <div v-if="activeTab === 'orders'" class="orders-management">
            <!-- Header -->
            <div class="section-header">
              <div>
                <h3 class="section-title">
                  <i class="bi bi-receipt-cutoff me-2"></i>Quản lý Đơn hàng
                </h3>
                <p class="section-subtitle">Theo dõi và quản lý tất cả đơn hàng</p>
              </div>
            </div>

            <!-- Filters -->
            <div class="filters-bar">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input
                  v-model="orderSearchKeyword"
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm theo mã đơn..."
                  @keyup.enter="loadOrders"
                />
                <button
                  v-if="orderSearchKeyword"
                  class="search-clear"
                  @click="orderSearchKeyword = ''; loadOrders()"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <select v-model="orderStatusFilter" class="filter-select" @change="loadOrders">
                <option value="">Tất cả trạng thái</option>
                <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                <option value="DANG_XU_LY">Đang xử lý</option>
                <option value="DANG_GIAO">Đang giao</option>
                <option value="DA_GIAO">Đã giao</option>
                <option value="DA_HUY">Đã hủy</option>
              </select>
              <button class="btn btn-danger btn-filter" @click="loadOrders">
                <i class="bi bi-search me-1"></i>Tìm kiếm
              </button>
            </div>

            <!-- Loading -->
            <div v-if="ordersLoading" class="loading-state">
              <div class="spinner-wrapper">
                <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted">Đang tải đơn hàng...</p>
              </div>
            </div>

            <!-- Error -->
            <div v-else-if="ordersError" class="error-state">
              <div class="alert alert-danger border-0 shadow-sm">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ ordersError }}
              </div>
            </div>

            <!-- Orders List -->
            <div v-else-if="orders.length > 0" class="orders-list">
              <div
                v-for="(order, index) in orders"
                :key="order.maHoaDon"
                class="order-card"
                :style="{ animationDelay: `${index * 0.03}s` }"
              >
                <div class="order-header">
                  <div class="order-id">
                    <i class="bi bi-receipt me-2"></i>
                    <strong>#{{ order.maHoaDon }}</strong>
                  </div>
                  <div class="order-status-badge" :class="getOrderStatusClass(order.trangThai)">
                    {{ getStatusLabel(order.trangThai) }}
                  </div>
                </div>
                
                <div class="order-content">
                  <div class="order-info">
                    <div class="info-row">
                      <i class="bi bi-person"></i>
                      <span>{{ order.nguoiDung?.tenNguoiDung || 'Khách hàng' }}</span>
                    </div>
                    <div class="info-row">
                      <i class="bi bi-calendar"></i>
                      <span>{{ formatDate(order.ngayLap) }}</span>
                    </div>
                    <div class="info-row price-row">
                      <i class="bi bi-currency-exchange"></i>
                      <strong class="order-price">{{ formatCurrency(order.tongTien) }}</strong>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <select
                    :value="order.trangThai || 'CHO_XAC_NHAN'"
                    class="status-select"
                    @change="handleUpdateOrderStatus(order, $event)"
                  >
                    <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                    <option value="DANG_XU_LY">Đang xử lý</option>
                    <option value="DANG_GIAO">Đang giao</option>
                    <option value="DA_GIAO">Đã giao</option>
                    <option value="DA_HUY">Đã hủy</option>
                  </select>
                  <RouterLink
                    :to="{
                      path: `/orders/${order.maHoaDon}`,
                      query: { fromAdmin: 'orders', adminTab: activeTab }
                    }"
                    class="btn btn-primary btn-detail"
                  >
                    <i class="bi bi-eye me-1"></i>Chi tiết
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <i class="bi bi-receipt empty-icon"></i>
              <h5 class="mt-3 mb-2">Không tìm thấy đơn hàng</h5>
              <p class="text-muted">
                {{ orderSearchKeyword || orderStatusFilter ? 'Thử thay đổi bộ lọc' : 'Chưa có đơn hàng nào' }}
              </p>
            </div>
          </div>

          <!-- Thống kê -->
          <div v-if="activeTab === 'statistics'" class="statistics-management">
            <!-- Header -->
            <div class="section-header">
              <div>
                <h3 class="section-title">
                  <i class="bi bi-graph-up-arrow me-2"></i>Thống kê Tổng quan
                </h3>
                <p class="section-subtitle">Tổng hợp dữ liệu và phân tích hệ thống</p>
              </div>
            </div>

            <!-- Main Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card revenue-card" :style="{ animationDelay: '0.1s' }">
                <div class="stat-card-inner">
                  <div class="stat-header-revenue">
                    <div class="stat-icon-wrapper-revenue">
                      <i class="bi bi-cash-coin stat-icon-revenue"></i>
                    </div>
                    <p class="stat-label-revenue">Tổng doanh thu</p>
                  </div>
                  <div class="stat-value-wrapper-revenue">
                    <div class="stat-value-revenue">{{ formatCurrency(statistics.totalRevenue) }}</div>
                  </div>
                  <div class="stat-footer-revenue">
                    <div class="stat-badge-revenue">
                      <i class="bi bi-arrow-up"></i>
                      <span>Tổng doanh thu</span>
                    </div>
                  </div>
                </div>
                <div class="stat-shine"></div>
              </div>
              
              <div class="stat-card orders-card" :style="{ animationDelay: '0.2s' }">
                <div class="stat-card-inner">
                  <div class="stat-top-section">
                    <div class="stat-icon-wrapper">
                      <div class="stat-icon-bg"></div>
                      <i class="bi bi-receipt-cutoff stat-icon"></i>
                    </div>
                    <div class="stat-label-wrapper">
                      <p class="stat-label">Tổng đơn hàng</p>
                    </div>
                  </div>
                  <div class="stat-value-section">
                    <h2 class="stat-value">{{ statistics.totalOrders }}</h2>
                  </div>
                  <div class="stat-footer-section">
                    <div class="stat-indicator">
                      <i class="bi bi-arrow-up"></i>
                      <span>Tất cả đơn hàng</span>
                    </div>
                  </div>
                </div>
                <div class="stat-shine"></div>
              </div>
              
              <div class="stat-card products-card" :style="{ animationDelay: '0.3s' }">
                <div class="stat-card-inner">
                  <div class="stat-top-section">
                    <div class="stat-icon-wrapper">
                      <div class="stat-icon-bg"></div>
                      <i class="bi bi-box-seam stat-icon"></i>
                    </div>
                    <div class="stat-label-wrapper">
                      <p class="stat-label">Tổng sản phẩm</p>
                    </div>
                  </div>
                  <div class="stat-value-section">
                    <h2 class="stat-value">{{ statistics.totalProducts }}</h2>
                  </div>
                  <div class="stat-footer-section">
                    <div class="stat-indicator">
                      <i class="bi bi-arrow-up"></i>
                      <span>Sản phẩm trong kho</span>
                    </div>
                  </div>
                </div>
                <div class="stat-shine"></div>
              </div>
              
              <div class="stat-card users-card" :style="{ animationDelay: '0.4s' }">
                <div class="stat-card-inner">
                  <div class="stat-top-section">
                    <div class="stat-icon-wrapper">
                      <div class="stat-icon-bg"></div>
                      <i class="bi bi-people stat-icon"></i>
                    </div>
                    <div class="stat-label-wrapper">
                      <p class="stat-label">Tổng người dùng</p>
                    </div>
                  </div>
                  <div class="stat-value-section">
                    <h2 class="stat-value">{{ statistics.totalUsers }}</h2>
                  </div>
                  <div class="stat-footer-section">
                    <div class="stat-indicator">
                      <i class="bi bi-arrow-up"></i>
                      <span>Người dùng hệ thống</span>
                    </div>
                  </div>
                </div>
                <div class="stat-shine"></div>
              </div>
            </div>

            <!-- Detailed Stats -->
            <div class="detailed-stats">
              <div class="detail-card">
                <div class="detail-header">
                  <i class="bi bi-cash-coin me-2"></i>
                  <h6>Doanh thu theo tiến trình</h6>
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span>Đã giao</span>
                    <strong class="text-success">{{ formatCurrency(revenueDelivered) }}</strong>
                  </div>
                  <div class="detail-item">
                    <span>Đang xử lý / chờ</span>
                    <strong class="text-primary">{{ formatCurrency(revenueInProgress) }}</strong>
                  </div>
                  <div class="detail-item">
                    <span>Đã hủy</span>
                    <strong class="text-muted">{{ formatCurrency(revenueCancelled) }}</strong>
                  </div>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-header">
                  <i class="bi bi-list-check me-2"></i>
                  <h6>Đơn hàng theo trạng thái</h6>
                </div>
                <div class="detail-content">
                  <div class="detail-item" v-for="(cnt, key) in orderStatusSummary" :key="key">
                    <span>{{ getStatusLabel(key) }}</span>
                    <span class="badge-count">{{ cnt }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-header">
                  <i class="bi bi-people me-2"></i>
                  <h6>Người dùng theo vai trò</h6>
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span>Admin</span>
                    <span class="badge-count bg-danger">{{ userRoleSummary.admin }}</span>
                  </div>
                  <div class="detail-item">
                    <span>Nhân viên</span>
                    <span class="badge-count bg-info">{{ userRoleSummary.nhanVien }}</span>
                  </div>
                  <div class="detail-item">
                    <span>Khách hàng</span>
                    <span class="badge-count bg-secondary">{{ userRoleSummary.user }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-header">
                  <i class="bi bi-box-seam me-2"></i>
                  <h6>Sản phẩm tồn kho thấp (≤ 5)</h6>
                </div>
                <div class="detail-content">
                  <div v-if="lowStockProducts.length === 0" class="text-muted small">Không có sản phẩm tồn kho thấp</div>
                  <div v-else class="low-stock-list">
                    <div class="low-stock-item" v-for="p in lowStockProducts" :key="p.maSP">
                      <span>{{ p.tenSP }}</span>
                      <span class="badge-count bg-warning">{{ p.tonKho ?? p.soLuong ?? 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modal Sửa Role User -->
    <div
      v-if="showEditUserModal"
      class="modal fade show custom-modal"
      style="display: block; z-index: 1055;"
      tabindex="-1"
      @click.self="closeEditUserModal"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content-custom" @click.stop>
          <div class="modal-header-custom">
            <div class="modal-header-content">
              <div class="modal-icon-wrapper">
                <i class="bi bi-person-gear"></i>
              </div>
              <div>
                <h5 class="modal-title-custom">Tùy chỉnh người dùng</h5>
                <p class="modal-subtitle">Cập nhật quyền và trạng thái tài khoản</p>
              </div>
            </div>
          </div>
          
          <div class="modal-body-custom">
            <!-- User Info Card -->
            <div class="user-info-card">
              <div class="user-info-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <div class="user-info-details">
                <h6 class="user-info-name">{{ selectedUser?.tenNguoiDung }}</h6>
                <p class="user-info-email">{{ selectedUser?.email }}</p>
              </div>
            </div>

            <!-- Current Role -->
            <div class="form-section">
              <label class="form-label-custom">
                <i class="bi bi-shield-check me-2"></i>Role hiện tại
              </label>
              <div class="current-role-badge">
                <span class="role-badge-display" :class="getRoleBadgeClass(selectedUser?.vaiTro || selectedUser?.tenQuyen || selectedUser?.quyen?.tenQuyen)">
                  <i class="bi" :class="normalizeRole(selectedUser?.vaiTro || selectedUser?.tenQuyen || selectedUser?.quyen?.tenQuyen) === 'admin' ? 'bi-shield-fill' : normalizeRole(selectedUser?.vaiTro || selectedUser?.tenQuyen || selectedUser?.quyen?.tenQuyen) === 'nhanVien' ? 'bi-briefcase-fill' : 'bi-person-fill'"></i>
                  {{ getRoleLabel(selectedUser?.vaiTro || selectedUser?.tenQuyen || selectedUser?.quyen?.tenQuyen) }}
                </span>
              </div>
            </div>

            <!-- New Role Selection -->
            <div class="form-section">
              <label class="form-label-custom">
                <i class="bi bi-arrow-repeat me-2"></i>Chọn Role mới
              </label>
              <div class="select-wrapper-custom">
                <select v-model="newUserRole" class="select-custom">
                  <option value="user">Khách hàng</option>
                  <option value="nhanVien">Nhân viên</option>
                  <option value="admin">Admin</option>
                </select>
                <i class="bi bi-chevron-down select-arrow"></i>
              </div>
            </div>

            <!-- Status Toggle -->
            <div class="form-section">
              <label class="form-label-custom">
                <i class="bi bi-toggle-on me-2"></i>Trạng thái tài khoản
              </label>
              <div class="toggle-wrapper-custom">
                <label class="toggle-switch-custom">
                  <input type="checkbox" v-model="newUserStatus" />
                  <span class="toggle-slider"></span>
                  <span class="toggle-label">
                    <i class="bi" :class="newUserStatus ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                    {{ newUserStatus ? 'Hoạt động' : 'Đã khóa' }}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-footer-custom">
            <button type="button" class="btn-cancel" @click="closeEditUserModal">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn-save" @click="saveUserRole" :disabled="updatingRole">
              <span v-if="updatingRole" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-circle me-2"></i>
              {{ updatingRole ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditUserModal" class="modal-backdrop fade show" style="z-index: 1054;"></div>

    <!-- Modal Xác nhận Xóa User -->
    <div
      v-if="showDeleteUserModal"
      class="modal fade show"
      style="display: block; z-index: 1055;"
      tabindex="-1"
      @click.self="closeDeleteUserModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
          <div class="modal-header border-0 bg-danger text-white" style="padding: 1.5rem;">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
              <h5 class="modal-title mb-0 fw-bold">Xác nhận xóa tài khoản</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="closeDeleteUserModal"></button>
          </div>
          <div class="modal-body" style="padding: 2rem;">
            <div class="mb-4">
              <p class="fs-5 fw-semibold mb-3">
                Bạn có chắc muốn <span class="text-danger">XÓA VĨNH VIỄN</span> tài khoản này?
              </p>
              <div class="bg-light rounded p-3 mb-3">
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-person-circle text-primary me-2"></i>
                  <strong>{{ userToDelete?.tenNguoiDung || 'Người dùng' }}</strong>
                </div>
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-envelope me-2"></i>
                  <small>{{ userToDelete?.email }}</small>
                </div>
              </div>
            </div>
            
            <div class="alert alert-warning border-warning mb-4" style="border-left: 4px solid #ffc107;">
              <div class="d-flex align-items-start">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2 mt-1"></i>
                <div>
                  <strong class="d-block mb-2">⚠️ CẢNH BÁO: Hành động này sẽ xóa:</strong>
                  <ul class="mb-0 ps-3" style="line-height: 1.8;">
                    <li>Tài khoản người dùng</li>
                    <li>Tất cả đơn hàng và chi tiết đơn hàng</li>
                    <li>Tất cả giỏ hàng</li>
                    <li>Tất cả địa chỉ</li>
                  </ul>
                  <p class="mb-0 mt-2 fw-bold text-danger">
                    <i class="bi bi-x-circle-fill me-1"></i>
                    Hành động này KHÔNG THỂ hoàn tác!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 bg-light" style="padding: 1.5rem;">
            <button 
              type="button" 
              class="btn btn-light border" 
              @click="closeDeleteUserModal"
              :disabled="deletingUser"
              style="min-width: 100px;"
            >
              <i class="bi bi-x-circle me-1"></i>Hủy
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="executeDeleteUser"
              :disabled="deletingUser"
              style="min-width: 120px;"
            >
              <span v-if="deletingUser" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-trash-fill me-1"></i>
              {{ deletingUser ? 'Đang xóa...' : 'Xóa vĩnh viễn' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteUserModal" class="modal-backdrop fade show" style="z-index: 1054;"></div>

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

    <!-- Centered Success Notification (for delete) -->
    <transition name="fade-scale">
      <div
        v-if="deleteSuccessNotification.show"
        class="position-fixed top-50 start-50 translate-middle"
        style="z-index: 10000; pointer-events: none;"
      >
        <div class="delete-success-notification">
          <div class="success-icon-wrapper">
            <i class="bi bi-check-circle-fill success-icon"></i>
          </div>
          <div class="success-message">
            {{ deleteSuccessNotification.message }}
          </div>
        </div>
      </div>
    </transition>

    <!-- Notification Toast -->
    <div
      v-if="notification.show && !deleteSuccessNotification.show"
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
            @click="closeNotification"
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
  deleteUser,
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
const showDeleteUserModal = ref(false)
const userToDelete = ref(null)
const deletingUser = ref(false)

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
let notificationTimer = null // Timer để tự động đóng thông báo

// Centered delete success notification
const deleteSuccessNotification = ref({ show: false, message: '' })
let deleteSuccessTimer = null

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

// Normalize role về format chuẩn: 'user', 'nhanVien', 'admin'
const normalizeRole = (role) => {
  if (!role) return 'user'
  const roleStr = String(role).toLowerCase().trim()
  
  // Map các format khác nhau về format chuẩn
  if (roleStr === 'admin' || roleStr === 'administrator' || roleStr === 'quản trị viên') {
    return 'admin'
  }
  if (roleStr === 'nhanvien' || roleStr === 'nhan_vien' || roleStr === 'nhan vien' || 
      roleStr === 'nhân viên' || roleStr === 'staff' || roleStr === 'nhânviên') {
    return 'nhanVien'
  }
  if (roleStr === 'user' || roleStr === 'khách hàng' || roleStr === 'khach hang' || 
      roleStr === 'customer' || roleStr === 'khachhang') {
    return 'user'
  }
  
  // Fallback: nếu không match, kiểm tra maQuyen
  // maQuyen: 1 = admin, 2 = staff/nhanVien, 3 = user
  return 'user'
}

const getRoleLabel = (role) => {
  if (!role) return 'Khách hàng'
  const normalized = normalizeRole(role)
  const labelMap = {
    user: 'Khách hàng',
    nhanVien: 'Nhân viên',
    admin: 'Admin',
  }
  return labelMap[normalized] || 'Khách hàng'
}

const getRoleBadgeClass = (role) => {
  const normalized = normalizeRole(role)
  const classMap = {
    user: 'bg-secondary',
    nhanVien: 'bg-info',
    admin: 'bg-danger',
  }
  return classMap[normalized] || 'bg-secondary'
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

const getOrderStatusClass = (status) => {
  const normalized = normalizeStatus(status)
  const classMap = {
    'CHO_XAC_NHAN': 'status-pending',
    'DANG_XU_LY': 'status-processing',
    'DANG_GIAO': 'status-shipping',
    'DA_GIAO': 'status-delivered',
    'DA_HUY': 'status-cancelled',
  }
  return classMap[normalized] || 'status-pending'
}

const getCategoryIcon = (categoryName) => {
  if (!categoryName) return 'bi-tag-fill'
  const name = categoryName.toLowerCase()
  if (name.includes('cpu')) return 'bi-cpu-fill'
  if (name.includes('gpu') || name.includes('card')) return 'bi-gpu-card'
  if (name.includes('ram')) return 'bi-memory'
  if (name.includes('ssd') || name.includes('hdd')) return 'bi-hdd-stack-fill'
  if (name.includes('mainboard') || name.includes('bo mạch')) return 'bi-motherboard-fill'
  if (name.includes('case') || name.includes('vỏ')) return 'bi-pc-display-horizontal'
  if (name.includes('psu') || name.includes('nguồn')) return 'bi-lightning-charge-fill'
  return 'bi-tag-fill'
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

const showNotification = (message, type = 'success', autoClose = true, duration = 5000) => {
  // Xóa timer cũ nếu có
  if (notificationTimer) {
    clearTimeout(notificationTimer)
    notificationTimer = null
  }
  
  // Đóng thông báo cũ ngay lập tức
  notification.value.show = false
  
  // Sử dụng nextTick để đảm bảo DOM đã cập nhật
  nextTick(() => {
    notification.value = { show: true, message, type }
    
    if (autoClose && duration > 0) {
      notificationTimer = setTimeout(() => {
        notification.value.show = false
        notificationTimer = null
        console.log('Notification auto-closed after', duration, 'ms')
      }, duration)
    }
  })
}

const closeNotification = () => {
  if (notificationTimer) {
    clearTimeout(notificationTimer)
    notificationTimer = null
  }
  notification.value.show = false
}

// User functions
const searchUsers = async () => {
  // Debounce search để tránh gọi API quá nhiều
  await loadUsers()
}

const openEditUserModal = (user) => {
  selectedUser.value = user
  // Normalize role về format chuẩn để đảm bảo dropdown hiển thị đúng
  const normalizedRole = normalizeRole(user.vaiTro || user.tenQuyen || user.quyen?.tenQuyen || 'user')
  newUserRole.value = normalizedRole
  newUserStatus.value = user.trangThai !== false
  showEditUserModal.value = true
  
  // Debug log
  console.log('Opening edit modal for user:', user)
  console.log('User vaiTro:', user.vaiTro)
  console.log('User tenQuyen:', user.tenQuyen)
  console.log('User quyen?.tenQuyen:', user.quyen?.tenQuyen)
  console.log('Normalized role:', normalizedRole)
}

// 标记是否正在打开模态框，防止背景点击事件关闭
const isOpeningModal = ref(false)

const handleInfoItemClick = (user, event) => {
  // 立即阻止所有事件传播 - 必须最先执行
  if (event) {
    event.stopImmediatePropagation()
    event.stopPropagation()
    event.preventDefault()
    if (event.cancelBubble !== undefined) {
      event.cancelBubble = true
    }
  }
  // 检查权限
  if (user.vaiTro === 'admin' && currentUser.value?.vaiTro !== 'admin') {
    return false
  }
  // 直接打开模态框，不使用延迟
  openEditUserModal(user)
  return false
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

const confirmDeleteUser = (user) => {
  if (!user) return
  
  // Kiểm tra không cho xóa admin hoặc chính mình
  if (user.vaiTro === 'admin' || user.maNguoiDung === currentUser.value?.maNguoiDung) {
    showNotification('Không thể xóa tài khoản admin hoặc tài khoản của chính bạn.', 'error')
    return
  }
  
  userToDelete.value = user
  showDeleteUserModal.value = true
}

const closeDeleteUserModal = () => {
  if (!deletingUser.value) {
    showDeleteUserModal.value = false
    userToDelete.value = null
  }
}

const showDeleteSuccessNotification = (message) => {
  // Xóa timer cũ nếu có
  if (deleteSuccessTimer) {
    clearTimeout(deleteSuccessTimer)
    deleteSuccessTimer = null
  }
  
  // Đóng thông báo cũ
  deleteSuccessNotification.value.show = false
  
  // Hiển thị thông báo mới
  nextTick(() => {
    deleteSuccessNotification.value = { show: true, message }
    
    // Tự động đóng sau 2 giây
    deleteSuccessTimer = setTimeout(() => {
      deleteSuccessNotification.value.show = false
      deleteSuccessTimer = null
    }, 2000)
  })
}

const executeDeleteUser = async () => {
  if (!userToDelete.value) return
  
  deletingUser.value = true
  const userIdToDelete = userToDelete.value.maNguoiDung
  
  // Đóng modal ngay lập tức
  showDeleteUserModal.value = false
  userToDelete.value = null
  
  try {
    console.log('Deleting user with ID:', userIdToDelete)
    const result = await deleteUser(userIdToDelete)
    console.log('Delete user result:', result)
    
    // Hiển thị thông báo thành công ở giữa màn hình (tự động đóng sau 2 giây)
    showDeleteSuccessNotification('Xóa tài khoản thành công!')
    
    // Reload dữ liệu
    await loadUsers() // Reload danh sách người dùng
    await loadStatistics() // Reload thống kê
  } catch (err) {
    console.error('Error deleting user:', err)
    console.error('Error details:', {
      message: err.message,
      status: err.status,
      stack: err.stack
    })
    const errorMsg = err.message || 'Không thể xóa tài khoản'
    showNotification('Lỗi: ' + errorMsg, 'error', true, 3000)
  } finally {
    deletingUser.value = false
  }
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

// Helper function để lấy và normalize role (giống với LoginView và Navbar)
const getUserRole = (user) => {
  if (!user) return 'user'
  
  // Nếu vaiTro đã được normalize (từ LoginView), ưu tiên dùng trực tiếp
  // Vì LoginView đã normalize và lưu vào localStorage với vaiTro = 'admin' | 'nhanVien' | 'user'
  if (user.vaiTro && typeof user.vaiTro === 'string') {
    const normalizedVaiTro = user.vaiTro.toLowerCase().trim()
    if (normalizedVaiTro === 'admin' || normalizedVaiTro === 'nhanvien' || normalizedVaiTro === 'user') {
      return normalizedVaiTro === 'nhanvien' ? 'nhanVien' : normalizedVaiTro
    }
  }
  
  // Nếu vaiTro chưa normalize, check các nguồn khác
  const possibleRoles = [
    user.tenQuyen,         // Tên quyền trực tiếp trên user object (backend có thể trả về đây)
    user.quyen?.tenQuyen,  // Tên quyền từ object quyen (ADMIN / STAFF / USER ...)
    user.quyen?.vaiTro,    // Nếu có trong object quyen
    user.role,             // Field role tự do
  ]
  
  // Tìm role đầu tiên có giá trị dạng chuỗi
  let role = null
  for (const r of possibleRoles) {
    if (typeof r === 'string' && r.trim() !== '') {
      role = r.trim()
      break
    }
  }
  
  if (!role) return 'user'
  
  // Chuẩn hóa: lowercase + bỏ dấu tiếng Việt để so sánh an toàn
  const raw = role.toLowerCase().trim()
  const ascii = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Map các giá trị có thể có về role chuẩn (admin / staff / user) CHỈ dựa trên chuỗi tên
  if (ascii.includes('admin') || ascii.includes('quantri') || ascii.includes('quan_tri')) {
    return 'admin'
  }
  if (
    ascii.includes('nhanvien') ||
    ascii.includes('nhan vien') ||
    ascii.includes('nhan_vien') ||
    ascii.includes('staff') ||
    ascii.includes('employee')
  ) {
    return 'nhanVien'
  }
  if (
    ascii.includes('user') ||
    ascii.includes('khach') ||
    ascii.includes('khachhang') ||
    ascii.includes('khach_hang') ||
    ascii.includes('customer')
  ) {
    return 'user'
  }
  
  // Nếu không match gì, mặc định là user (khách hàng)
  // Fallback cuối: dùng maQuyen nếu backend chỉ trả ID
  const maQuyen = user.maQuyen || user.quyen?.maQuyen
  if (maQuyen === 1 || maQuyen === '1') return 'admin'
  if (maQuyen === 2 || maQuyen === '2') return 'nhanVien'
  return 'user'
}

onMounted(async () => {
  // Debug: Check localStorage trực tiếp
  const userStr = localStorage.getItem('user')
  console.log('=== AdminDashboard Debug (onMounted) ===')
  console.log('Raw user string from localStorage:', userStr)
  
  loadCurrentUser()
  
  // Đợi một chút để đảm bảo currentUser đã được load từ localStorage
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Check if user is admin
  const userRole = getUserRole(currentUser.value)
  console.log('Current user object:', JSON.stringify(currentUser.value, null, 2))
  console.log('Current user role (detected):', userRole)
  console.log('User.vaiTro:', currentUser.value?.vaiTro)
  console.log('User.quyen?.tenQuyen:', currentUser.value?.quyen?.tenQuyen)
  console.log('User.quyen?.vaiTro:', currentUser.value?.quyen?.vaiTro)
  console.log('User.quyen object:', currentUser.value?.quyen)
  console.log('========================')
  
  if (userRole !== 'admin') {
    console.warn('Access denied - User role:', userRole, 'Expected: admin')
    console.warn('Full user object for debugging:', currentUser.value)
    showNotification('Bạn không có quyền truy cập trang này.', 'error')
    setTimeout(() => {
      router.push('/')
    }, 3000) // Tăng thời gian để có thể xem log
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
/* ========== DASHBOARD LAYOUT ========== */
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  padding-top: 80px;
  padding-bottom: 2rem;
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.dashboard-layout {
  display: flex;
  gap: 2rem;
}

/* ========== SIDEBAR ========== */
.dashboard-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #dc3545;
}

.sidebar-logo i {
  font-size: 1.5rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: #6c757d;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #dc3545;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.nav-label {
  flex: 1;
  font-weight: 500;
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: white;
  border-radius: 0 4px 4px 0;
  transition: height 0.3s ease;
}

.nav-item.active .nav-indicator {
  height: 60%;
}

/* ========== MAIN CONTENT ========== */
.dashboard-main {
  flex: 1;
  min-width: 0;
}

/* ========== SECTION HEADER ========== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6c757d;
  margin: 0;
  font-size: 0.95rem;
}

.btn-add {
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

/* ========== FILTERS BAR ========== */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem 0.875rem 3.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #dc3545;
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #e9ecef;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.search-clear:hover {
  background: #dc3545;
  color: white;
}

.filter-select {
  padding: 0.875rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  min-width: 200px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #dc3545;
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

.btn-filter {
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
}

/* ========== LOADING & ERROR STATES ========== */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

/* ========== USERS MANAGEMENT ========== */
.users-management {
  animation: fadeInUp 0.5s ease-out;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.user-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: cardFadeIn 0.5s ease-out both;
  overflow: hidden;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.1);
}

.user-card-inner {
  position: relative;
  z-index: 2;
  padding: 2rem;
  background: white;
}

.user-header-section {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f5f5f5;
}

.user-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.user-card:hover .user-avatar {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.35);
}

.user-status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  z-index: 3;
}

.status-online {
  background: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.status-offline {
  background: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.user-badges-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  min-width: 0;
}

.role-badge-modern,
.status-badge-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.role-badge-modern {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.7rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.role-badge-modern.bg-danger {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
}

.role-badge-modern.bg-info {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #22d3ee;
  border-color: rgba(34, 211, 238, 0.3);
}

.role-badge-modern.bg-secondary {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.3);
}

.role-badge-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
  transition: left 0.5s ease;
}

.role-badge-modern:hover::before {
  left: 100%;
}

.status-badge-modern.status-active {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: none;
  font-weight: 600;
}

.status-badge-modern.status-locked {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border: none;
  font-weight: 600;
}

.user-content-section {
  margin-bottom: 1.5rem;
}

.user-name-modern {
  font-size: 1.375rem;
  font-weight: 800;
  color: #0d1117;
  margin-bottom: 1.25rem;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.user-info-modern {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.info-item-modern {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.info-item-clickable {
  cursor: pointer;
  position: relative;
}

.info-item-clickable:hover:not(.disabled) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.info-item-clickable:hover:not(.disabled) .info-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.info-item-clickable.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.info-item-clickable.disabled:hover {
  transform: none;
  border-color: #e9ecef;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.info-text {
  color: #212529;
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  word-break: break-word;
  letter-spacing: -0.1px;
}

.user-actions-section {
  display: flex;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 2px solid #f5f5f5;
}

.user-action-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.user-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.user-action-btn:hover::before {
  left: 100%;
}

.user-edit-btn {
  background: linear-gradient(135deg, #e7f3ff 0%, #cfe2ff 100%);
  color: #0d6efd;
}

.user-edit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
}

.user-orders-btn {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  color: #ffc107;
}

.user-orders-btn:hover {
  background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3);
}

.user-delete-btn {
  background: linear-gradient(135deg, #ffe7e7 0%, #ffd7d7 100%);
  color: #dc3545;
}

.user-delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

.user-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.user-action-btn:disabled::before {
  display: none;
}

.user-card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
  z-index: 3;
  pointer-events: none;
}

.user-card:hover .user-card-shine {
  left: 100%;
}

/* ========== CATEGORIES MANAGEMENT ========== */
.categories-management {
  animation: fadeInUp 0.5s ease-out;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: cardFadeIn 0.5s ease-out both;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.category-content {
  flex: 1;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}

.category-count {
  color: #6c757d;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.category-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.category-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.category-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.category-btn:hover::before {
  left: 100%;
}

.category-edit-btn {
  background: linear-gradient(135deg, #e7f3ff 0%, #cfe2ff 100%);
  color: #0d6efd;
}

.category-edit-btn:hover {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
}

.category-delete-btn {
  background: linear-gradient(135deg, #ffe7e7 0%, #ffd7d7 100%);
  color: #dc3545;
}

.category-delete-btn:hover {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

/* ========== ORDERS MANAGEMENT ========== */
.orders-management {
  animation: fadeInUp 0.5s ease-out;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: cardFadeIn 0.5s ease-out both;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.order-id {
  display: flex;
  align-items: center;
  color: #212529;
  font-size: 1.1rem;
}

.order-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cfe2ff;
  color: #084298;
}

.status-shipping {
  background: #d1e7dd;
  color: #0f5132;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-content {
  margin-bottom: 1rem;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6c757d;
  font-size: 0.95rem;
}

.info-row i {
  width: 20px;
  color: #dc3545;
}

.price-row {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e9ecef;
}

.order-price {
  font-size: 1.25rem;
  color: #dc3545;
}

.order-footer {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.status-select {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.status-select:focus {
  outline: none;
  border-color: #dc3545;
}

.btn-detail {
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
}

/* ========== STATISTICS MANAGEMENT ========== */
.statistics-management {
  animation: fadeInUp 0.5s ease-out;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 0;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: statCardFadeIn 0.6s ease-out both;
  min-width: 0;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

@keyframes statCardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.08);
}

.stat-card-inner {
  position: relative;
  z-index: 2;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.stat-top-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f5f5f5;
}

.stat-icon-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.stat-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  transition: all 0.4s ease;
  opacity: 0.15;
}

.revenue-card .stat-icon-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.orders-card .stat-icon-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.products-card .stat-icon-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.users-card .stat-icon-bg {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card:hover .stat-icon-bg {
  opacity: 0.25;
  transform: scale(1.1);
}

.stat-icon {
  position: relative;
  z-index: 1;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.4s ease;
}

.revenue-card .stat-icon {
  color: #667eea;
}

.orders-card .stat-icon {
  color: #f5576c;
}

.products-card .stat-icon {
  color: #4facfe;
}

.users-card .stat-icon {
  color: #fa709a;
}

.stat-card:hover .stat-icon {
  transform: scale(1.15) rotate(5deg);
}

.stat-label-wrapper {
  flex: 1;
  min-width: 0;
}

.stat-label {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.4;
}

.stat-value-section {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.1;
  display: block;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  letter-spacing: -1px;
}

/* ========== REVENUE CARD SPECIAL STYLING ========== */
.stat-header-revenue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.stat-icon-wrapper-revenue {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.4s ease;
}

.stat-card:hover .stat-icon-wrapper-revenue {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.stat-icon-revenue {
  font-size: 1.875rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.stat-label-revenue {
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  flex: 1;
  text-align: right;
}

.stat-value-wrapper-revenue {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  margin-bottom: 1.25rem;
  padding: 1rem 0;
}

.stat-value-revenue {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  letter-spacing: -0.5px;
  width: 100%;
  display: block;
}

.stat-footer-revenue {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.stat-badge-revenue {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  transition: all 0.3s ease;
}

.stat-badge-revenue i {
  color: #667eea;
  font-size: 0.875rem;
}

.stat-card:hover .stat-badge-revenue {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.18) 0%, rgba(118, 75, 162, 0.18) 100%);
  transform: translateY(-2px);
}

.stat-footer-section {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f5f5f5;
}

.stat-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.revenue-card .stat-indicator {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
}

.revenue-card .stat-indicator i {
  color: #667eea;
}

.orders-card .stat-indicator {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  color: #f5576c;
}

.orders-card .stat-indicator i {
  color: #f5576c;
}

.products-card .stat-indicator {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  color: #4facfe;
}

.products-card .stat-indicator i {
  color: #4facfe;
}

.users-card .stat-indicator {
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%);
  color: #fa709a;
}

.users-card .stat-indicator i {
  color: #fa709a;
}

.stat-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
  z-index: 3;
  pointer-events: none;
}

.stat-card:hover .stat-shine {
  left: 100%;
}

.detailed-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.detail-header h6 {
  margin: 0;
  font-weight: 600;
  color: #212529;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.badge-count {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e9ecef;
  color: #212529;
}

.low-stock-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.low-stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.875rem;
}

/* ========== PRODUCTS MANAGEMENT (Already styled) ========== */
.products-management {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== MODAL STYLES ========== */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  pointer-events: auto;
}

.modal-dialog-centered {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
  border-radius: 16px;
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== CUSTOM EDIT USER MODAL ========== */
.custom-modal {
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.custom-modal .modal-dialog {
  pointer-events: auto;
}

.modal-content-custom {
  background: white;
  border-radius: 28px;
  border: none;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalSlideInCustom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 560px;
  position: relative;
  z-index: 1056;
  pointer-events: auto;
}

@keyframes modalSlideInCustom {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

.modal-header-custom::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(40px);
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.modal-icon-wrapper {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.modal-icon-wrapper:hover {
  transform: scale(1.05) rotate(5deg);
  background: rgba(255, 255, 255, 0.35);
}

.modal-title-custom {
  color: white;
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9375rem;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.btn-close-custom {
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  font-size: 1.125rem;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-body-custom {
  padding: 2.5rem 2rem;
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  margin-bottom: 2.5rem;
  border: 2px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.user-info-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.user-info-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35), 0 4px 12px rgba(118, 75, 162, 0.25);
  position: relative;
  overflow: hidden;
}

.user-info-avatar::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.user-info-details {
  flex: 1;
  min-width: 0;
}

.user-info-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.3px;
}

.user-info-email {
  font-size: 0.9375rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

.form-section {
  margin-bottom: 2rem;
}

.form-label-custom {
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  letter-spacing: 0.2px;
}

.form-label-custom i {
  color: #667eea;
  font-size: 1.125rem;
  margin-right: 0.5rem;
}

.current-role-badge {
  display: flex;
  align-items: center;
}

.role-badge-display {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  border-radius: 14px;
  font-size: 0.9375rem;
  font-weight: 700;
  border: 2px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.role-badge-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.role-badge-display.bg-danger,
.role-badge-display.bg-info,
.role-badge-display.bg-secondary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3), 0 2px 6px rgba(118, 75, 162, 0.2);
}

.select-wrapper-custom {
  position: relative;
}

.select-custom {
  width: 100%;
  padding: 1rem 3.5rem 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 1rem;
  background: white;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.select-custom:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.select-custom:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15), 0 4px 16px rgba(102, 126, 234, 0.1);
}

.select-arrow {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
  font-size: 1rem;
}

.toggle-wrapper-custom {
  display: flex;
  align-items: center;
}

.toggle-switch-custom {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch-custom input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 60px;
  height: 34px;
  background: #e5e7eb;
  border-radius: 17px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  top: 4px;
  left: 4px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle-switch-custom input:checked + .toggle-slider {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch-custom input:checked + .toggle-slider::before {
  transform: translateX(26px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.2);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #495057;
  transition: color 0.3s ease;
}

.toggle-switch-custom input:checked ~ .toggle-label {
  color: #10b981;
}

.toggle-switch-custom input:not(:checked) ~ .toggle-label {
  color: #ef4444;
}

.modal-footer-custom {
  padding: 2rem;
  background: linear-gradient(to top, #ffffff 0%, #fafbfc 100%);
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: nowrap;
}

.btn-cancel {
  padding: 0.875rem 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  color: #6b7280;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  min-width: 120px;
  flex-shrink: 1;
  white-space: nowrap;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-save {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35), 0 4px 12px rgba(118, 75, 162, 0.25);
  position: relative;
  overflow: hidden;
  flex: 1;
  min-width: 140px;
  flex-shrink: 1;
  white-space: nowrap;
}

.btn-save::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-save:hover:not(:disabled)::before {
  left: 100%;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.45), 0 6px 16px rgba(118, 75, 162, 0.35);
}

.btn-save:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* ========== DELETE SUCCESS NOTIFICATION ========== */
.delete-success-notification {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 20px;
  padding: 2rem 3rem;
  box-shadow: 0 20px 60px rgba(40, 167, 69, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  text-align: center;
  min-width: 320px;
  backdrop-filter: blur(10px);
}

.success-icon-wrapper {
  margin-bottom: 1rem;
  animation: successIconBounce 0.6s ease-out;
}

.success-icon {
  font-size: 4rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: successIconScale 0.5s ease-out;
}

.success-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

@keyframes successIconBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes successIconScale {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.fade-scale-enter-active {
  animation: fadeScaleIn 0.4s ease-out;
}

.fade-scale-leave-active {
  animation: fadeScaleOut 0.3s ease-in;
}

@keyframes fadeScaleIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeScaleOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1200px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    position: static;
  }
  
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .nav-item {
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters-bar {
    flex-direction: column;
  }
  
  .search-wrapper {
    min-width: 100%;
  }
  
  .users-grid,
  .categories-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .detailed-stats {
    grid-template-columns: 1fr;
  }
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

/* Delete User Modal Styles */
.modal-dialog-centered {
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Centered Delete Success Notification */
.delete-success-notification {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 20px;
  padding: 2rem 3rem;
  box-shadow: 0 20px 60px rgba(40, 167, 69, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  text-align: center;
  min-width: 320px;
  backdrop-filter: blur(10px);
}

.success-icon-wrapper {
  margin-bottom: 1rem;
  animation: successIconBounce 0.6s ease-out;
}

.success-icon {
  font-size: 4rem;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: successIconScale 0.5s ease-out;
}

.success-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

@keyframes successIconBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes successIconScale {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Fade and Scale Transition */
.fade-scale-enter-active {
  animation: fadeScaleIn 0.4s ease-out;
}

.fade-scale-leave-active {
  animation: fadeScaleOut 0.3s ease-in;
}

@keyframes fadeScaleIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeScaleOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

/* Products Management Styles */
.products-management {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.products-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.btn-add-product {
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease;
}

.btn-add-product:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.search-wrapper {
  position: relative;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem 0.875rem 3.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #dc3545;
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #e9ecef;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.search-clear:hover {
  background: #dc3545;
  color: white;
}

.products-loading,
.products-error {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: productCardFadeIn 0.5s ease-out both;
  position: relative;
  display: flex;
  flex-direction: column;
}

@keyframes productCardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(220, 53, 69, 0.2);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-id-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.product-content {
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc3545;
  display: flex;
  align-items: center;
}

.product-stock {
  font-size: 0.875rem;
  color: #28a745;
  display: flex;
  align-items: center;
}

.product-stock.stock-low {
  color: #ffc107;
}

.product-stock.stock-out {
  color: #dc3545;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.btn-action {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #e7f3ff;
  color: #0d6efd;
}

.btn-edit:hover {
  background: #0d6efd;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.btn-delete {
  background: #ffe7e7;
  color: #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.products-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .products-header {
    padding: 1.5rem;
  }
  
  .btn-add-product {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>

