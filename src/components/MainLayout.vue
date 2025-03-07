<template>
  <div class="main-container">
    <el-container>
      <!-- 新增顶部导航栏 -->
      <el-header class="main-header">
        <div class="header-content">
          <div class="left-section">
            <span class="project-name">{{ projectName }}</span>
          </div>
          <div class="right-section">
            <span class="username">{{ username }}</span>
            <el-button type="text" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside width="220px">
          <el-menu
            router
            :default-active="$route.path"
            class="side-menu"
          >
            <!-- 首页 -->
            <el-menu-item index="/home">
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <!-- APK获取 -->
            <el-sub-menu index="apk-acquisition">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>APK获取</span>
              </template>
              <el-menu-item index="/apk/acquisition/scene-import"><el-icon><Download /></el-icon><span>现勘导入</span></el-menu-item>
              <el-menu-item index="/apk/acquisition/pinghang"><el-icon><Download /></el-icon><span>平航对接</span></el-menu-item>
              <el-menu-item index="/apk/acquisition/meya"><el-icon><Download /></el-icon><span>美亚下载</span></el-menu-item>
            </el-sub-menu>
            
            <!-- APK管理 -->
            <el-sub-menu index="apk-management">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>APK管理</span>
              </template>
              <el-menu-item index="/apk/management/list"><el-icon><HelpFilled /></el-icon><span>APK查询</span></el-menu-item>
            </el-sub-menu>

            <!-- APK工具 -->
            <el-sub-menu index="apk-tools">
              <template #title>
                <el-icon><Menu /></el-icon>
                <span>APK工具</span>
              </template>
              <el-menu-item index="/apk/tools/static-analysis"><el-icon><Tools /></el-icon><span>APK静态解析</span></el-menu-item>
              <el-menu-item index="/apk/tools/image-search"><el-icon><Tools /></el-icon><span>以图搜图</span></el-menu-item>
            </el-sub-menu>

            <!-- 用户管理 -->
            <el-menu-item index="/user">
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const projectName = ref('项目管理系统')
const username = ref(sessionStorage.getItem('userName') || '用户')

const handleLogout = () => {
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('userName')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.main-container {
  height: 100vh;
}

.main-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.left-section {
  font-size: 18px;
  font-weight: bold;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #666;
}

.side-menu {
  height: calc(100vh - 60px); /* 根据header高度调整 */
  /* 保持菜单项对齐 */
  .el-sub-menu__title,
  .el-menu-item {
    height: 45px;
    line-height: 45px;
  }
  /* 激活状态指示线 */
  .el-menu-item.is-active {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: #409eff;
    }
  }
}

.el-main {
  padding: 20px;
  height: calc(100vh - 60px); /* 防止内容溢出 */
}


</style>