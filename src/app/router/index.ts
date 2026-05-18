import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/auth',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      { path: 'login', component: () => import('@/views/auth/LoginView.vue') },
      { path: 'register', component: () => import('@/views/auth/RegisterView.vue') },
      { path: 'forgot', component: () => import('@/views/auth/ForgotPasswordView.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('@/app/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
      { path: 'projects', component: () => import('@/views/projects/ProjectListView.vue') },
      { path: 'projects/new', component: () => import('@/views/projects/ProjectCreateView.vue') },
      { path: 'projects/:id', component: () => import('@/views/projects/ProjectDetailsView.vue') },
      { path: 'projects/:id/editor', component: () => import('@/views/editor/PatternEditorView.vue') },
      { path: 'projects/:id/grid', component: () => import('@/views/grid/CrochetGridEditorView.vue') },
      { path: 'settings', component: () => import('@/views/settings/SettingsView.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/auth/login', query: { redirect: to.fullPath } };
  }
  if (to.path.startsWith('/auth') && auth.isAuthenticated) {
    return { path: '/dashboard' };
  }
});

export default router;
