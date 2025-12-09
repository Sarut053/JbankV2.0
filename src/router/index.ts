import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import AddExpenseView from '../views/AddExpenseView.vue'
import ScanBillView from '../views/ScanBillView.vue'
import NotificationView from '../views/NotificationView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/add', name: 'add', component: AddExpenseView },
  { path: '/scan', name: 'scan', component: ScanBillView },
  { path: '/notification', name: 'notification', component: NotificationView }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router