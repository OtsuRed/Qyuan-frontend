<template>
  <div class="audit-claims">
    <div class="page-header">
      <h2>认领审核</h2>
      <div class="header-actions">
        <el-select v-model="filter.status" placeholder="状态筛选" style="width: 120px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="未认领" :value="0"></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="驳回" :value="2"></el-option>
          <el-option label="通过" :value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="refresh" @click="loadClaims">刷新</el-button>
      </div>
    </div>

    <div class="audit-list">
      <el-table :data="claimList" style="width: 100%" v-loading="loading">
        <el-table-column prop="claimId" label="ID" width="80" />
        <el-table-column prop="paperTitle" label="论文标题" min-width="200" />
        <el-table-column label="认领人" width="120">
          <template #default="{ row }">
            <span>用户{{ row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="论文ID" width="100">
          <template #default="{ row }">
            <span>#{{ row.paperId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="认领凭证" width="120">
          <template #default="{ row }">
            <el-button
                v-if="row.claimPicture"
                type="text"
                @click="viewClaimPicture(row.claimPicture)"
            >
              查看凭证
            </el-button>
            <span v-else>无凭证</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-button
                size="small"
                type="success"
                v-if=" row.status === 1"
                @click="approveClaim(row)"
            >
              通过
            </el-button>
            <el-button
                size="small"
                type="danger"
                v-if=" row.status === 1"
                @click="rejectClaim(row)"
            >
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 凭证预览对话框 -->
    <el-dialog
        v-model="pictureDialog.visible"
        title="认领凭证"
        width="600px"
    >
      <div class="picture-preview">
        <img
            :src="pictureDialog.imageUrl"
            alt="认领凭证"
            v-if="pictureDialog.imageUrl"
            style="max-width: 100%; max-height: 500px;"
        />
        <p v-else>暂无凭证图片</p>
      </div>
    </el-dialog>

    <!-- 详情对话框 -->

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ClaimDetail from './components/ClaimDetail.vue'
import {getClaimList,updateClaim} from "@/api/audit.js";

// 筛选条件
const filter = ref({
  status: 1
})

// 分页
const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 认领列表
const claimList = ref([
  {
    claim_id: 1,
    user_id: 1001,
    paper_id: 5001,
    paper_title: '基于深度学习的图像识别研究',
    claim_picture: 'https://example.com/claim1.jpg',
    status: 0,
    submit_time: '2024-01-15 14:30:25'
  },
  {
    claim_id: 2,
    user_id: 1002,
    paper_id: 6001,
    paper_title: '人工智能在医疗诊断中的应用',
    claim_picture: 'https://example.com/claim2.jpg',
    status: 1,
    submit_time: '2024-01-15 13:15:42'
  }
])

// 对话框
const pictureDialog = ref({
  visible: false,
  imageUrl: ''
})

const detailDialog = ref({
  visible: false,
  claimId: null,
  title: ''
})

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '未认领',
    1: '待审核',
    2: '驳回',
    3: '通过'
  }
  return statusMap[status] || '未知'
}

// 获取标签类型
const getStatusTag = (status) => {
  const tagMap = {
    0: 'info',
    1: 'warning',
    2: 'danger',
    3: 'success'
  }
  return tagMap[status] || 'info'
}

// 查看凭证
const viewClaimPicture = (url) => {
  pictureDialog.value.imageUrl = url
  pictureDialog.value.visible = true
}

// 查看详情
const viewClaimDetail = (row) => {
  detailDialog.value.claimId = row.claim_id
  detailDialog.value.title = `认领详情 #${row.claim_id}`
  detailDialog.value.visible = true
}

// 通过认领
const approveClaim = async (row) => {
  try {
    await ElMessageBox.confirm(
        `确定要通过用户${row.userId}对论文"${row.paperTitle}"的认领吗？`,
        '确认通过',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }
    )

    // 这里调用API
    // await axios.post(`/api/audit/claims/${row.claim_id}/approve`)
    await updateClaim({"status":3},row.claimId);
    ElMessage.success('认领已通过')
    loadClaims()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + error.message)
    }
  }
}

// 拒绝认领
const rejectClaim = async (row) => {
  try {
    const { value: reason } = await ElMessageBox.confirm(
        `确定要拒绝用户${row.userId}对论文"${row.paperTitle}"的认领吗？`,
        '确认通过',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

      // 这里调用API
      // await axios.post(`/api/audit/claims/${row.claim_id}/reject`, {
      //   reason: reason
      // })
        await updateClaim({"status":2},row.claimId);
      ElMessage.success('认领已拒绝')
      loadClaims()

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + error.message)
    }
  }
}

// 加载认领列表
const loadClaims = async () => {
  loading.value = true
  try {
    getClaimList(pagination.value.current, pagination.value.size, filter.value.status).then(
        (response) => {
          claimList.value =[];
          response.data.records.forEach(item => {
            claimList.value.push(item)
          })
          pagination.value.total = response.data.total
          console.log(claimList.value)
        }
    )

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 100))
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 审核完成回调
const handleAuditComplete = () => {
  detailDialog.value.visible = false
  loadClaims()
}

// 分页事件
const handleSizeChange = (size) => {
  pagination.value.size = size
  loadClaims()
}

const handleCurrentChange = (current) => {
  pagination.value.current = current
  loadClaims()
}

// 监听筛选条件变化
watch(() => filter.value.status, () => {
  pagination.value.current = 1
  loadClaims()
})

// 初始化加载
onMounted(() => {
  loadClaims()
})
</script>

<style scoped>
.audit-claims {
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.audit-list {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

:deep(.el-table) {
  background: var(--bg-card);
  border-color: var(--border-color);
}

:deep(.el-table th) {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
  font-weight: 600;
}

:deep(.el-table td) {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-color);
}

:deep(.el-table tr) {
  background-color: var(--bg-card);
}

:deep(.el-table tr:nth-child(even)) {
  background-color: var(--bg-secondary);
}

:deep(.el-table tr:hover > td) {
  background-color: var(--bg-tertiary);
}

:deep(.el-table .el-table__row--striped) {
  background-color: var(--bg-secondary);
}

:deep(.el-table .el-table__row--striped td) {
  background-color: var(--bg-secondary);
}

:deep(.el-table .el-table__row--striped:hover > td) {
  background-color: var(--bg-tertiary);
}

:deep(.el-table__body tr:hover > td) {
  background-color: var(--bg-tertiary) !important;
}

:deep(.el-table .el-table__header th) {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
.picture-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  background: var(--bg-card);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

/* 深色模式分页组件样式 */
:deep(.el-pagination) {
  --el-pagination-bg-color: var(--bg-card);
  --el-pagination-text-color: var(--text-primary);
  --el-pagination-button-disabled-bg-color: var(--bg-tertiary);
  --el-pagination-button-bg-color: var(--bg-secondary);
  --el-pagination-button-hover-color: var(--primary-color);
  --el-pagination-hover-color: var(--primary-color);
}

/* 分页按钮样式 */
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next),
:deep(.el-pagination .el-pager li),
:deep(.el-pagination .el-pagination__sizes .el-select .el-input .el-input__inner),
:deep(.el-pagination .el-pagination__jump .el-input .el-input__inner) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  transition: all 0.3s ease;
}

/* 分页按钮悬停效果 */
:deep(.el-pagination .btn-prev:not(.disabled):hover),
:deep(.el-pagination .btn-next:not(.disabled):hover),
:deep(.el-pagination .el-pager li:not(.disabled):hover) {
  background-color: var(--bg-tertiary) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
}

/* 激活页码样式 */
:deep(.el-pagination .el-pager li.active) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 600;
}

/* 禁用按钮样式 */
:deep(.el-pagination .btn-prev.disabled),
:deep(.el-pagination .btn-next.disabled),
:deep(.el-pagination .el-pager li.disabled) {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-tertiary) !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 下拉选择框样式 */
:deep(.el-pagination .el-select) {
  --el-select-input-focus-border-color: var(--primary-color);
}

:deep(.el-pagination .el-select .el-input .el-input__inner) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
}

:deep(.el-pagination .el-select .el-input .el-input__inner:hover),
:deep(.el-pagination .el-select .el-input .el-input__inner:focus) {
  border-color: var(--primary-color) !important;
}

/* 跳转输入框样式 */
:deep(.el-pagination .el-pagination__jump .el-input .el-input__inner) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
}

:deep(.el-pagination .el-pagination__jump .el-input .el-input__inner:focus) {
  border-color: var(--primary-color) !important;
}

/* 分页文本样式 */
:deep(.el-pagination .el-pagination__total),
:deep(.el-pagination .el-pagination__jump) {
  color: var(--text-secondary) !important;
}

/* 下拉菜单样式 */
:deep(.el-select-dropdown) {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
}

:deep(.el-select-dropdown__item) {
  color: var(--text-primary) !important;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: var(--bg-secondary) !important;
}

:deep(.el-select-dropdown__item.selected) {
  background-color: var(--primary-color) !important;
  color: white !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pagination {
    padding: 10px;
  }

  :deep(.el-pagination) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  :deep(.el-pagination__total),
  :deep(.el-pagination__sizes),
  :deep(.el-pagination__jump) {
    margin-top: 10px;
  }
}
:deep(.el-pagination .el-select .el-input) {
  --el-input-bg-color: var(--bg-secondary) !important;
  --el-input-text-color: var(--text-primary) !important;
  --el-input-border-color: var(--border-color) !important;
  --el-input-hover-border-color: var(--primary-color) !important;
  --el-input-focus-border-color: var(--primary-color) !important;
}

/* 选择器输入框 */
:deep(.el-pagination .el-select .el-input__wrapper) {
  background-color: var(--bg-secondary) !important;
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
  border-radius: 4px !important;
}

:deep(.el-pagination .el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.el-pagination .el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

/* 选择器图标 */
:deep(.el-pagination .el-select .el-input__suffix) {
  color: var(--text-secondary) !important;
}

:deep(.el-pagination .el-select .el-input__suffix:hover) {
  color: var(--primary-color) !important;
}

/* 选择器下拉图标 */
:deep(.el-pagination .el-select .el-icon) {
  color: var(--text-secondary) !important;
}

:deep(.el-pagination .el-select .el-icon:hover) {
  color: var(--primary-color) !important;
}

/* 如果使用Element Plus的箭头图标 */
:deep(.el-pagination .el-select .el-input__suffix .el-icon) {
  color: var(--text-secondary) !important;
}

/* 选择器文本颜色 */
:deep(.el-pagination .el-select .el-input__inner) {
  color: var(--text-primary) !important;
}

/* 选择器占位符颜色 */
:deep(.el-pagination .el-select .el-input__inner::placeholder) {
  color: var(--text-tertiary) !important;
}

/* 修复选择器下拉菜单 */
:deep(.el-pagination .el-select .el-select__popper) {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  box-shadow: var(--shadow-lg) !important;
}

:deep(.el-pagination .el-select .el-select-dropdown__item) {
  color: var(--text-primary) !important;
  background-color: var(--bg-card) !important;
}

:deep(.el-pagination .el-select .el-select-dropdown__item.hover),
:deep(.el-pagination .el-select .el-select-dropdown__item:hover) {
  background-color: var(--bg-secondary) !important;
}

:deep(.el-pagination .el-select .el-select-dropdown__item.selected) {
  background-color: var(--primary-color) !important;
  color: white !important;
}

/* 修复分页器中的选择器特定位样式 */
:deep(.el-pagination__sizes .el-select .el-input .el-input__inner) {
  background-color: transparent !important;
  color: var(--text-primary) !important;
}

:deep(.el-pagination__sizes .el-select .el-input__wrapper) {
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
}

/* 修复分页器中的跳转输入框 */
:deep(.el-pagination__jump .el-input .el-input__wrapper) {
  background-color: var(--bg-secondary) !important;
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
}

:deep(.el-pagination__jump .el-input .el-input__wrapper:hover),
:deep(.el-pagination__jump .el-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.el-pagination__jump .el-input__inner) {
  color: var(--text-primary) !important;
}

:deep(.el-pagination__jump .el-input__inner::placeholder) {
  color: var(--text-tertiary) !important;
}
</style>