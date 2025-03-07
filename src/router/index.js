import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios'
const routes = [
  {
    path: '/',
    component: () => import('@/components/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: 'home' },
      { path: 'home', component: () => import('@/views/Home.vue') },
      // APK获取子路由
      // { path: 'apk/acquisition/scene-import', component: () => import('@/views/apk/SceneImport.vue') },
      // { path: 'apk/acquisition/pinghang', component: () => import('@/views/apk/Pinghang.vue') },
      // { path: 'apk/acquisition/meya', component: () => import('@/views/apk/Meya.vue') },
      
      // // APK管理子路由
      { path: '/apk/management/list', name:'apk-main-list',component: () => import('@/views/apk-manage/apk-query/ApkMainList.vue') },
      { path: '/apk/management/detail', name:'apk-main-detail', component: () => import('@/views/apk-manage/apk-query/ApkMainDetail.vue') },
      
      // // APK工具子路由
      // { path: 'apk/tools/static-analysis', component: () => import('@/views/apk/StaticAnalysis.vue') },
      // { path: 'apk/tools/image-search', component: () => import('@/views/apk/ImageSearch.vue') },
      { path: 'user', component: () => import('@/views/User.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/UserLogin.vue'),
    meta: { guest: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('authToken')
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // 已登录用户禁止访问登录页
  else if (to.meta.guest && isAuthenticated) {
    next('/home')
  }
  else {
    if (isAuthenticated) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${isAuthenticated}`;
    }
    next()
  }
})

export default router;



