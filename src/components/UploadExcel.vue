<template>
    <div>
      <el-upload
        class="upload-demo"
        action=""
        :show-file-list="false"
        :before-upload="handleFileUpload"
        accept=".xls,.xlsx"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>
      <div style="padding-top: 10px;">
        <el-alert v-if="successMessage" :title="successMessage" type="success" show-icon />
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon />
      </div>
      
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
      // 新增消息清理方法
      resetState() {
        this.successMessage = '';
        this.errorMessage = '';
      },
      async handleFileUpload(file) {
        this.resetState();
  
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          const response = await axios.post("/api/upload-excel", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
          if (response.data.success) {
            this.successMessage = response.data.message;  // 只显示成功消息
            setTimeout(() => {
              this.$emit("upload-success");  // 触发成功事件
              this.$emit("close-dialog");    // 关闭弹窗
            }, 3000); // 3000 毫秒（3 秒）
          } else {
            this.errorMessage = response.data.message;  // 显示失败消息
          }
        } catch (error) {
          this.errorMessage = "上传失败，请检查网络连接或文件格式";  // 显示上传错误消息
        }
      },
    },
  };
  </script>
  