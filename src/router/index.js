import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrderListView from '../views/OrderListView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import ClearanceView from '../views/ClearanceView.vue'
import CategoryView from '../views/CategoryView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import OrderSuccessView from '../views/OrderSuccessView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import StaffDashboard from '../views/StaffDashboard.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailView, props: true },
  { path: '/danhmuc/:id', name: 'category', component: CategoryView, props: true },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/checkout', name: 'checkout', component: CheckoutView },
  { path: '/orders', name: 'orders', component: OrderListView },
  { path: '/orders/:id', name: 'order-detail', component: OrderDetailView, props: true },
  { path: '/order-success/:id?', name: 'order-success', component: OrderSuccessView, props: true },
  { path: '/clearance', name: 'clearance', component: ClearanceView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: UserProfileView },
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard },
  { path: '/staff', name: 'staff-dashboard', component: StaffDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

