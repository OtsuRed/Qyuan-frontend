<template>
  <div class="patent-detail-page">
    <!-- 专利标题区 - 与论文页风格统一 -->
    <div class="patent-title">
      <h1>专利名称：{{ patent.patent_name || '暂无数据' }}</h1>
      <p class="patent-number">专利编号：{{ patent.patent_number || '暂无数据' }}</p>
    </div>

    <!-- 操作按钮区 - 参考论文页按钮样式，新增认领按钮 -->
    <div class="action-buttons">
      <button class="btn online-reading">在线阅读</button>
      <button class="btn download">下载</button>
      <button class="btn favorite" @click="collectPatent">收藏</button>
      <button class="btn share">分享</button>
      <!-- 新增：专利认领按钮 -->
      <button class="btn claim" @click="showClaimModal = true">认领</button>
    </div>

    <!-- 专利信息卡片 - 分块布局，与论文页信息块风格一致 -->
    <div class="main-content">
      <div class="info-block integrated-block">
        <!-- 摘要部分 -->
        <div class="section abstract-section">
          <h3 class="section-title">摘要</h3>
          <div class="section-content">
            <p>{{ patent.abstract || '暂无数据' }}</p>
          </div>
        </div>

        <!-- 核心信息部分 - 两列布局 -->
        <div class="section core-info-section">
          <h3 class="section-title">核心信息</h3>
          <div class="section-content core-info-content">
            <div class="info-group">
              <p><span class="info-label">发明人:</span> {{ patent.inventor || '暂无数据' }}</p>
              <p><span class="info-label">专利权人:</span> {{ patent.assignee || '暂无数据' }}</p>
              <p><span class="info-label">国家:</span> {{ patent.country || '暂无数据' }}</p>
            </div>
            <div class="info-group">
              <p><span class="info-label">申请日期:</span> {{ formatDate(patent.application_date) || '暂无数据' }}</p>
              <p><span class="info-label">授权日期:</span> {{ formatDate(patent.authorization_date) || '暂无数据' }}</p>
              <p><span class="info-label">被引次数:</span> {{ patent.citation_count || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 - 与论文页风格统一 -->
    <footer class="page-footer">
      <p>© 2025 千源学术 版权所有</p>
      <p>万方数据知识服务平台提供技术支持</p>
    </footer>

    <!-- 收藏夹弹窗组件 -->
    <CollectionModal 
      :visible="showCollectionModal" 
      :initItem="currentCollectItem"
      @close="showCollectionModal = false"
    />

    <!-- 新增：专利认领弹窗组件 -->
    <ClaimModal
      :visible="showClaimModal"
      title="专利认领申请"
      descriptionPlaceholder="请输入认领该专利的原因、相关权属证明说明等内容..."
      @close="showClaimModal = false"
      @submit="handlePatentClaimSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 引入收藏夹弹窗组件
import CollectionModal from '@/views/components/CollectionModal/index.vue';
// 新增：引入认领弹窗组件
import ClaimModal from '@/views/components/ClaimModal/index.vue';

// 模拟专利数据（实际项目从接口获取）
const patent = ref({
  patent_number: 'US12345678',
  patent_name: '一种智能终端交互方法',
  abstract: '本发明公开了一种智能终端的交互方法，通过多模态识别技术实现用户指令的精准解析，提升交互效率。该方法包括以下步骤：1) 采集用户多模态输入信息；2) 对输入信息进行预处理和特征提取；3) 基于深度学习模型进行指令意图识别；4) 执行对应操作并反馈结果。本发明解决了现有技术中交互精准度低、响应速度慢的问题，适用于各类智能终端设备，具有广泛的应用前景。',
  inventor: '张三, 李四',
  assignee: '某科技有限公司',
  application_date: '2023-05-10T00:00:00',
  authorization_date: '2024-02-15T00:00:00',
  citation_count: 12,
  country: '中国',
  url: 'https://example.com/patent/US12345678'
});

// 日期格式化函数
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// ========== 收藏夹相关逻辑 ==========
const showCollectionModal = ref(false);
const currentCollectItem = ref(null);

const collectPatent = () => {
  console.log('✅ 专利收藏按钮被点击！');
  
  currentCollectItem.value = {
    type: 'patent',
    title: patent.value.patent_name,
    patentNo: patent.value.patent_number,
    url: patent.value.url,
    inventor: patent.value.inventor,
    assignee: patent.value.assignee,
    country: patent.value.country,
    applicationDate: formatDate(patent.value.application_date),
    authorizationDate: formatDate(patent.value.authorization_date),
    collectTime: new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  };
  
  showCollectionModal.value = true;
  console.log('✅ 专利收藏弹窗已打开，收藏信息：', currentCollectItem.value);
};
// ========== 收藏夹逻辑结束 ==========

// ========== 专利认领相关逻辑 ==========
// 控制认领弹窗显示/隐藏
const showClaimModal = ref(false);

// 处理专利认领提交
const handlePatentClaimSubmit = (submitData) => {
  // 组装完整的专利认领数据（包含专利基础信息 + 用户提交的认领信息）
  const claimData = {
    patentInfo: {
      patentNumber: patent.value.patent_number,
      patentName: patent.value.patent_name,
      inventor: patent.value.inventor,
      assignee: patent.value.assignee
    },
    userSubmitInfo: submitData.formData,
    uploadFiles: submitData.files,
    submitTime: new Date().toLocaleString('zh-CN')
  };
  
  // 调试日志：打印完整的认领提交数据
  console.log('📄 专利认领申请提交数据：', claimData);
  
  // 实际项目中此处调用接口提交认领申请
  // 示例：await api.submitPatentClaim(claimData);
  
  // 提交成功提示
  alert('专利认领申请已提交，我们将在1-3个工作日内审核并回复您！');
  
  // 关闭认领弹窗
  showClaimModal.value = false;
};
// ========== 专利认领逻辑结束 ==========
</script>

<style scoped>
/* 全局样式 - 与论文页保持一致 */
.patent-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 专利标题样式 - 参考论文标题设计 */
.patent-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.patent-title h1 {
  font-size: 22px;
  color: #1a56db;
  margin-bottom: 10px;
  line-height: 1.4;
}

.patent-number {
  color: #666;
  font-size: 14px;
}

/* 按钮样式 - 复用论文页按钮样式，新增认领按钮样式 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.btn {
  padding: 7px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  font-weight: 500;
}

/* 收藏按钮层级 */
.action-buttons .favorite {
  position: relative;
  z-index: 999 !important;
}

/* 新增：认领按钮样式（与论文页保持一致） */
.claim {
  background-color: #fb923c;
  color: white;
}

.claim:hover {
  background-color: #f97316;
}

.online-reading {
  background-color: #2563eb;
  color: white;
}

.download {
  background-color: #10b981;
  color: white;
}

.favorite, .share {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* 主要内容区 - 与论文页布局一致 */
.main-content {
  margin-bottom: 30px;
}

/* 信息块通用样式 - 复用论文页信息块设计 */
.info-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.integrated-block {
  padding: 20px;
}

/* 板块标题样式 - 与论文页一致 */
.section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1e40af;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: #3b82f6;
  margin-right: 8px;
  border-radius: 2px;
}

/* 内容区域样式 */
.section-content {
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
}

/* 核心信息两列布局 */
.core-info-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.info-group {
  flex: 1;
  min-width: 250px;
}

/* 标签样式 - 复用论文页信息标签 */
.info-label {
  font-weight: 600;
  color: #1e293b;
  margin-right: 5px;
}

/* 页脚样式 - 与论文页完全一致 */
.page-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

/* 收藏弹窗样式穿透 */
:deep(.collection-modal-overlay) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.7) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
}

:deep(.collection-modal) {
  background: white !important;
  padding: 20px !important;
  border-radius: 8px !important;
  min-width: 500px !important;
  z-index: 10000 !important;
}
</style>