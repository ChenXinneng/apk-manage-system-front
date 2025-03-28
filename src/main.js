import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router';  // 导入路由
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


// 设置全局默认的 API 地址
axios.defaults.baseURL = 'http://127.0.0.1:5000'; // 假设 Flask 后端接口运行在 localhost:5000
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // 发送凭据
// 全局拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) { //&& error.response.data.msg === 'Token has expired'
      // 清除 sessionStorage 中的 authToken
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userName');
      
      // 跳转到登录页面
      window.location.href = '/login'; // 根据实际路径调整
      // this.$router.push('/login');
    }
    return Promise.reject(error);
  }
);

// 定义特性标志
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

// 创建 Vue 应用并挂载到 DOM
const app = createApp(App);
app.config.globalProperties.$axios = axios;  // 将 axios 挂载到 Vue 实例上
app.use(router);  // 使用 Vue 路由
app.use(ElementPlus,{locale:zhCn});  // 使用 ElementPlus
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);  // 全局注册图标
  }
app.mount('#app');


// 创建loading遮罩层
import { ElLoading } from 'element-plus'

let loadingInstance = null

const loading = (action = 'open', text = 'loading...') => {
  if (action === 'open') {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)',
    })
  } else if (action === 'close' && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

export default loading



