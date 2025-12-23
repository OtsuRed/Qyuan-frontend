<template>
  <div class="report-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-content">
      <!-- 基本信息 -->
      <div class="basic-info">
        <h3>举报详情 #{{ reportDetail.reportId }}</h3>
        <div class="status">
          状态:
          <span :class="'status-' + reportDetail.status">
            {{ getStatusText(reportDetail.status) }}
          </span>
        </div>
      </div>

      <!-- 举报信息 -->
      <div class="info-section">
        <div class="info-item">
          <label>举报人:</label>
          <span>用户 {{ reportDetail.userId }}</span>
        </div>
        <div class="info-item">
          <label>举报类型:</label>
          <span>{{ getTargetTypeText(reportDetail.targetType) }}</span>
        </div>
        <div class="info-item">
          <label>目标ID:</label>
          <span>{{ reportDetail.targetId }}</span>
        </div>
        <div class="info-item">
          <label>举报时间:</label>
          <span>{{ formatTime(reportDetail.submitTime) }}</span>
        </div>
      </div>

      <!-- 举报理由 -->
      <div class="reason-section">
        <h4>举报理由</h4>
        <div class="reason-content">
          {{ reportDetail.reportReason || '无举报理由' }}
        </div>
      </div>

      <!-- 审核结果输入 -->
      <div class="audit-section" v-if="reportDetail.status === 0">
        <h4>审核处理</h4>

        <div class="audit-input">
          <label>审核意见:</label>
          <el-input
              v-model="auditOpinion"
              type="textarea"
              :rows="3"
              placeholder="请输入审核处理意见"
              maxlength="200"
              show-word-limit
          />
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
              type="success"
              @click="handleAudit('approve')"
              :loading="loadingAction === 'approve'"
              :disabled="!auditOpinion.trim()"
          >
            通过审核
          </el-button>

          <el-button
              type="danger"
              @click="handleAudit('reject')"
              :loading="loadingAction === 'reject'"
              :disabled="!auditOpinion.trim()"
          >
            驳回举报
          </el-button>
        </div>
      </div>

      <!-- 已处理状态显示 -->
      <div class="processed-info" v-else>
        <h4>审核结果</h4>
        <div class="result-content">
          <div class="result-status">
            处理结果:
            <span :class="'result-' + (reportDetail.status === 2 ? 'approved' : 'rejected')">
              {{ reportDetail.status === 2 ? '已通过' : '已驳回' }}
            </span>
          </div>
          <div class="result-opinion" v-if="reportDetail.auditOpinion">
            审核意见: {{ reportDetail.auditOpinion }}
          </div>
          <div class="result-time" v-if="reportDetail.auditTime">
            处理时间: {{ formatTime(reportDetail.auditTime) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {auditReport} from "@/api/audit.js";

const props = defineProps({
  report:{type: Object, required: true}
})

const emit = defineEmits(['audit-complete'])

// 数据
const loading = ref(false)
const loadingAction = ref('')
const reportDetail = ref({})
const auditOpinion = ref('')

// 加载举报详情
const loadReportDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const response = await axios.get(`/api/report/${props.reportId}`)
    // reportDetail.value = response.data

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 100))
    reportDetail.value = props.report
    console.log('获取举报详情成功：', reportDetail.value)
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 处理审核
const handleAudit = async (action) => {
  if (!auditOpinion.value.trim()) {
    ElMessage.warning('请输入审核意见')
    return
  }

  const actionName = action === 'approve' ? '通过' : '驳回'

  try {
    // 确认操作
    await ElMessageBox.confirm(
        `确定要${actionName}该举报吗？`,
        `确认${actionName}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: action === 'approve' ? 'success' : 'warning'
        }
    )

    loadingAction.value = action

    const response = auditReport({"reportId": reportDetail.value.reportId, "result": action === 'approve' ? 2 : 1, "opinion": auditOpinion.value.trim()})

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(`举报已${actionName}`)

    // 通知父组件审核完成
    emit('audit-complete')

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionName}失败：` + error.message)
    }
  } finally {
    loadingAction.value = ''
  }
}

// 工具函数
const getStatusText = (status) => {
  const statusMap = {
    0: '待审核',
    1: '驳回',
    2: '已审核'
  }
  return statusMap[status] || '未知'
}

const getTargetTypeText = (type) => {
  const types = {
    1: '论文',
    2: '用户'
  }
  return types[type] || '未知'
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN')
}

// 初始化加载
onMounted(() => {
  loadReportDetail()
})
</script>

<style scoped>
.report-detail {
  padding: 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.basic-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.basic-info h3 {
  margin: 0;
  color: var(--text-primary);
}

.status {
  font-size: 14px;
}

.status-0 {
  color: var(--warning-color);
  font-weight: bold;
}

.status-1 {
  color: var(--info-color);
  font-weight: bold;
}

.status-2 {
  color: var(--success-color);
  font-weight: bold;
}

.status-3 {
  color: var(--error-color);
  font-weight: bold;
}

.info-section {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  width: 80px;
  color: var(--text-tertiary);
}

.info-item span {
  flex: 1;
  color: var(--text-primary);
}

.reason-section {
  margin-bottom: 30px;
}

.reason-section h4 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.reason-content {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  border-left: 3px solid var(--info-color);
  line-height: 1.6;
}

.audit-section {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.audit-section h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.audit-input {
  margin-bottom: 20px;
}

.audit-input label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.processed-info {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  margin-top: 20px;
}

.processed-info h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.result-content {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
}

.result-status {
  margin-bottom: 10px;
  font-weight: 500;
}

.result-approved {
  color: var(--success-color);
  font-weight: bold;
}

.result-rejected {
  color: var(--error-color);
  font-weight: bold;
}

.result-opinion {
  margin-bottom: 8px;
  line-height: 1.6;
}

.result-time {
  color: var(--text-tertiary);
  font-size: 14px;
}

:deep(.el-textarea__inner) {
  background: var(--input-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
</style>