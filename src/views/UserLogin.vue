<template>
  <div class="login-page">
    <div class="login-container">
      <el-tabs v-model="activeTab" class="center-tabs">
        <el-tab-pane label="账号登录" name="account">
          <el-form :model="form" ref="form" label-width="0px" @submit.prevent="handleSubmit">
            <el-form-item prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
              <el-input v-model="form.username" autocomplete="off" placeholder="用户名">
                <template v-slot:prefix>
                  <i class="el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
              <el-input type="password" v-model="form.password" autocomplete="off" placeholder="密码">
                <template v-slot:prefix>
                  <i class="el-icon-lock"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item class="center-button">
              <el-button type="primary" native-type="submit" class="blue-theme">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="扫码登录" name="scan">
          <div class="scan-login">
            <p>请使用手机扫码登录</p>
            <!-- 这里可以添加二维码图片 -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'account',
      form: {
        username: '',
        password: ''
      },
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await this.$axios.post('/api/login', this.form);
        console.log(response);
        let res = response.data
        if (res.success) {
          console.log(res.msg);  // "Login successful!"
          console.log(res.data.authToken);  // 获取并存储 Token
          // 将 Token 存储在 sessionStorage 或 cookie 中
          sessionStorage.setItem('authToken', res.data.authToken);
          sessionStorage.setItem('userName', res.data.userName);
        } else {
          alert(res.msg);  // "Invalid credentials"
          console.error(res.msg);  // "Invalid credentials"
        }
        // 登录成功后做相关操作，例如保存token、跳转页面等
        this.$router.push('/home'); // 登录成功后跳转到仪表盘
      } catch (error) {
        this.errorMessage = '登录失败，请检查用户名和密码';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.login-page {
  background-image: url('@/assets/login.jpeg'); /* 请确保背景图片路径正确 */
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.login-container {
  width: 350px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-right: 10%
}

.el-form-item {
  margin-top: 30px;
  margin-bottom: 20px;
}
/* 给按钮的父容器添加 flex 来居中 */
.center-button {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中（如果有多行内容） */
}
.blue-theme {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  width: 100%; /* 修改按钮的宽度 */
}

.blue-theme:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.scan-login {
  text-align: center;
  padding: 20px;
}

.center-tabs >>> .el-tabs__header {
  display: flex;
  justify-content: center;
}

.center-tabs >>> .el-tabs__item {
  flex: 1;
  text-align: center;
}
</style>