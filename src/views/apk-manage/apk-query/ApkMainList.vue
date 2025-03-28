<template>
  <div>
    <!-- 查询区域 -->
    <el-row :gutter="5">
      <el-col :span="8">
        <el-input
          v-model="searchQuery.appName"
          placeholder="请输入App名称"
          clearable
          prefix-icon="Search"
        />
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="searchQuery.packageName"
          placeholder="请输入包名"
          clearable
          prefix-icon="Search"
        />
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="searchQuery.fileMd5"
          placeholder="请输入MD5值"
          prefix-icon="Search"
          clearable
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align: center; margin-top: 10px;">
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-col>
    </el-row>
    <!-- 操作栏 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24" style="text-align: left;">
        <el-button type="primary" @click="goToDetail('add')">新增</el-button>
        <!-- 在此处添加更多按钮 -->
        <el-button type="success" @click="showUploadDialog = true" style="margin-left: 10px;">上传</el-button>
      </el-col>
    </el-row>

    <!-- Excel 上传对话框 -->
    <!-- <el-dialog
      v-model="showUploadDialog"
      title="上传 Excel1"
      width="600px"
      class="custom-upload-dialog"
    >
      <UploadExcel
        @upload-success="fetchApks"
        @close-dialog="closeDialog"
      />
    </el-dialog> -->
    <el-dialog v-model="showUploadDialog" :show-close="true" @closed="$refs.uploadExcel.resetState()">
      <template #header="{ titleId, titleClass }">
        <div class="dialog-header">
          <span :id="titleId" :class="titleClass">上传文件</span>
        </div>
      </template>
      <div style="padding: 30px;">
        <UploadExcel  ref="uploadExcel"
          @upload-success="fetchApks"
          @close-dialog="showUploadDialog = false"
        />
      </div>
      
    </el-dialog>

    <el-table :data="apks_data" height="490" border stripe style="width: 100%">
      <el-table-column fixed="left" min-width="100" label="App名称" prop="app_name"></el-table-column>
      <el-table-column min-width="200" label="包名" prop="package_name"></el-table-column>
      <el-table-column min-width="200" label="MD5" prop="file_md5"></el-table-column>
      <el-table-column min-width="200" label="主活动" prop="main_activity"></el-table-column>
      <el-table-column min-width="200" label="安卓版本" prop="android_version"></el-table-column>
      <el-table-column min-width="200" label="APK大小" prop="apk_size" :formatter="apkSizeFormatter"></el-table-column>
      <el-table-column min-width="200" label="SHA1" prop="file_sha1"></el-table-column>
      <el-table-column min-width="200" label="SHA256" prop="file_sha256"></el-table-column>
      <el-table-column min-width="200" label="apk文件路径" prop="apk_location"></el-table-column>
      <el-table-column min-width="200" label="apk下载链接" prop="apk_download_url"></el-table-column>
      <el-table-column min-width="200" label="下载页面url" prop="download_page_url"></el-table-column>
      <el-table-column min-width="200" label="创建人" prop="create_user"></el-table-column>
      <el-table-column min-width="200" label="创建时间" prop="create_time"></el-table-column>
      <el-table-column fixed="right" label="图标" min-width="150">
        <template #default="{ row }">
          <el-link v-if="row.icon_location" type="primary" @click="viewImage(row.icon_location)">
            查看
          </el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="截图" min-width="150">
        <template #default="{ row }">
          <el-link v-if="row.screenshot_location" type="primary" @click="viewImage(row.screenshot_location)">
            查看
          </el-link>
        </template>
      </el-table-column>
      <el-table-column min-width="250" fixed="right" label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="goToDetail('edit',row.id)" type="primary">编辑</el-button>
          <el-button size="small" @click="deleteApk(row.id)" type="danger">删除</el-button>
          <el-button size="small" v-if="row.apk_location && row.apk_location.trim() !== ''" 
            @click="analysisApk(row.id)" type="warning">静态解析</el-button>
          <el-button size="small" v-if="row.apk_location && row.apk_location.trim() !== ''" 
            @click="screenshotApk(row.id)" type="warning">截图</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      v-if="totalCounts > pageSize"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalCounts"
      @current-change="handlePageChange"
      layout="total, prev, pager, next, jumper"
      style="margin-top: 20px;display: flex;justify-content: flex-end;
      "
    />
    <el-image-viewer :hide-on-click-modal="true"
      v-if="showImagePreview"
      :zoom-rate="1.2"
      @close="closePreview"
      :url-list="imgPreviewList"
      ref="imageViewer"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import UploadExcel from "@/components/UploadExcel.vue";
import loading from '@/main';

export default {
  components: {
    UploadExcel,
  },
  data() {
    return {
      apks_data: [],
      searchQuery: {
        appName: '',
        packageName: '',
        fileMd5: '',
      },
      currentPage: 1,
      pageSize: 10,
      totalCounts: 0,
      showUploadDialog: false, // 控制上传对话框隐藏
      showImagePreview: false,
      currentImage: "",
      imgPreviewList:[]
    }
  },
  mounted() {
    this.fetchApks()
  },
  computed: {
    paginatedApks() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.apks_data.slice(start, end)
    }
  },
  methods: {
    fetchApks() {
      const params = {
        app_name: this.searchQuery.appName,
        package_name: this.searchQuery.packageName,
        file_md5: this.searchQuery.fileMd5,
        page: this.currentPage,
        page_size: this.pageSize,
      }
      axios.get('/api/apkMain', { params })
        .then((response) => {
          console.log('response:', response)
          this.apks_data = response.data.items
          this.totalCounts = response.data.total
        })
        .catch((error) => {
          console.error('Error fetching apks:', error)
        })
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchApks()
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchApks()
    },
    goToDetail(mode, id = null) {
      if (mode === 'add') {
        this.$router.push({ name: 'apk-main-detail', query: { mode: 'add',id:''} });
      } else if (mode === 'edit' && id) {
        this.$router.push({ name: 'apk-main-detail', query: { mode: 'edit', id:id } });
      }
    },
    deleteApk(id) {
      axios.delete(`/api/apkMain/${id}`)
        .then(() => {
          ElMessage.success('删除成功')
          this.fetchApks()
        })
        .catch((error) => {
          ElMessage.error('删除失败')
          console.error('Error deleting apk:', error)
        })
    },
    analysisApk(id) {
      loading('open')
      axios.post(`/api/apkMain/analysis/${id}`)
        .then(() => {
          loading('close')
          ElMessage.success('解析成功')
          this.fetchApks()
        })
        .catch((error) => {
          loading('close')
          ElMessage.error('解析失败')
          console.error('Error analysising apk:', error)
        })
    },
    screenshotApk(id) {
      loading('open')
      axios.post(`/api/apkMain/screenshot/${id}`)
        .then(() => {
          loading('close')
          ElMessage.success('截图成功')
          this.fetchApks()
        })
        .catch((error) => {
          loading('close')
          ElMessage.error('截图失败')
          console.error('Error analysising apk:', error)
        })
    },
    apkSizeFormatter(row,column,cellValue){
      return `${parseFloat(cellValue/1024/1024).toFixed(2)} MB`
    },
    async viewImage(imgUrl){
      try {
        const response = await axios.get("/get_image", {
          params: { path: imgUrl },
          responseType: "blob", // 返回二进制数据
        });
        console.log("response:", response);  
        console.log("response.data:", response.data);  
        // 将 Blob 转换成 URL
        const imageUrl = URL.createObjectURL(response.data);
        this.currentImage = imageUrl;
        this.imgPreviewList = [this.currentImage]
        this.showImagePreview = true;
        this.$nextTick(() => {
          if (this.$refs.imageViewer) {
            // 调用方法
          }
        });
        
      } catch (error) {
        console.error("图片加载失败:", error);
      }
    },
    closePreview() {
      this.imgPreviewList = []
      this.showImagePreview = false
    },
  }
}
</script>
<style scoped>
:deep(.dialog-header ){
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
:deep(.el-dialog) {
  width: 450px;
  height: 200px;  /* 根据需要调整 */
}
:deep(.custom-dialog) {
  height: 200px ; /* 设置固定高度 */
  max-height: 80vh; /* 设置最大高度为视口高度的 80% */
  background-color: transparent !important;  /* 透明底部 */
  box-shadow: none; /* 去掉阴影 */
}

</style>