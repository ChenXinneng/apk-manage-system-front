<template>
  <div>
    <el-form :model="apkData" ref="apkForm" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="App名称">
            <el-input v-model="apkData.app_name" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包名">
            <el-input v-model="apkData.package_name" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="主活动">
            <el-input v-model="apkData.main_activity" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安卓版本">
            <el-input v-model="apkData.android_version" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="解析时间">
            <el-input v-model="apkData.parse_time" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APK大小">
            <el-input v-model="apkData.apk_size" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="MD5值">
            <el-input v-model="apkData.file_md5" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SHA1值">
            <el-input v-model="apkData.file_sha1" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="SHA256值">
            <el-input v-model="apkData.file_sha256" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APK文件路径">
            <el-input v-model="apkData.apk_location" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="APK下载链接">
            <el-input v-model="apkData.apk_download_url" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下载页面url">
            <el-input v-model="apkData.download_page_url" :disabled="isDisabled" />
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <el-button type="primary" @click="save">{{ mode === 'add' ? '新增' : '保存' }}</el-button>
        <el-button @click="goBack" type="primary">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      apkData: {
        app_name: '',
        package_name: '',
        main_activity: '',
        android_version: '',
        parse_time: '',
        apk_size: '',
        file_md5: '',
        file_sha1: '',
        file_sha256: '',
        apk_location: '',
        apk_download_url: '',
        download_page_url: '',
      },
      isDisabled: false
    };
  },
  mounted() {
    const mode = this.$route.query.mode;
    if (mode === 'add') {
      this.isDisabled = false;
      // 初始化为空或默认值
      this.apkData = {
        app_name: '',
        package_name: '',
        main_activity: '',
        android_version: '',
        parse_time: '',
        apk_size: '',
        file_md5: '',
        file_sha1: '',
        file_sha256: '',
        apk_location: '',
        apk_download_url: '',
        download_page_url: '',
      };
    } else if (mode === 'edit') {
      this.isDisabled = false;
      const id = this.$route.query.id;
      // 根据 id 获取数据并赋值给 apk
      this.fetchApkDetail(id);
    }
  },
  methods: {
    fetchApkDetail(id) {
      axios.get(`/api/apkMain/${id}`)
        .then((response) => {
          this.apkData = response.data
        })
        .catch((error) => {
          console.error('Error fetching apk detail:', error)
        })
    },
    save() {
      if (this.$route.query.mode === 'add') {
        this.createApk();
      } else if (this.$route.query.mode === 'edit') {
        this.updateApk();
      }
    },  
    createApk() {
      axios.post('/api/apkMain', this.apkData)
        .then(response => {
          console.log('response:', response);
          this.$message({
            message: '新增成功',
            type: 'success',
            delay: 1000
          });
          this.$router.push('/apk/management/list');
        })
        .catch(error => {
          console.error('Error creating apk:', error);
        });
    },
    updateApk() {
      const id = this.$route.query.id;
      axios.put(`/api/apkMain/${id}`, this.apkData, {
  headers: {
    'Content-Type': 'application/json',
  }})
        .then(response => {
          console.log('response:', response);
          this.$message({
            message: '更新成功',
            type: 'success'
          });
        })
        .catch(error => {
          console.error('Error updating apk:', error);
        });
    },
    goBack() {
      this.$router.push({ name: 'apk-main-list' })
    }
  }
}
</script>