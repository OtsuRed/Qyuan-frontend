<template>
  <div class="journal-detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a href="#">首页</a> &gt; 
      <a href="#">期刊导航</a> &gt; 
      <a href="#" class="current">软件学报</a> &gt; 
      <span>2025年11期</span>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 右侧：期刊信息 -->
      <div class="right-column">
        <!-- 期刊标题和操作按钮 - 修改按钮为在线阅读、收藏 -->
        <div class="journal-header">
          <h1 class="journal-title">
            软件学报
            <span class="award-tag">获奖刊</span>
          </h1>
          <div class="journal-actions">
            <button class="btn online-reading">在线阅读</button>
            <!-- 核心修改：给收藏按钮绑定点击事件 -->
            <button class="btn favorite" @click="collectJournal">收藏</button>
          </div>
        </div>

        <!-- 期刊核心基础信息 - 整合主编、文献量、语种、ISSN、创刊年份 -->
        <div class="journal-basic-info">
          <p>Journal of Software <span class="korean-title">연구소학보</span></p>
          <div class="basic-info-list">
            <div class="basic-info-item">
              <span class="info-label">期刊链接：</span>
              <a href="https://example.com/journal/software" target="_blank" rel="noopener noreferrer" class="info-value">https://example.com/journal/software</a>
            </div>
            <div class="basic-info-item">
              <span class="info-label">DOAJ链接：</span>
              <a href="https://doaj.org/toc/1000-9825" target="_blank" rel="noopener noreferrer" class="info-value">https://doaj.org/toc/1000-9825</a>
            </div>
            <!-- 整合的核心基础信息 -->
            <div class="basic-info-item">
              <span class="info-label">ISSN：</span>
              <span class="info-value">1000-9825</span>
            </div>
            <div class="basic-info-item">
              <span class="info-label">创刊年份：</span>
              <span class="info-value">1990年</span>
            </div>
            <div class="basic-info-item">
              <span class="info-label">主编：</span>
              <span class="info-value">李明树</span>
            </div>
            <div class="basic-info-item">
              <span class="info-label">语种：</span>
              <span class="info-value">中文</span>
            </div>
            <div class="basic-info-item">
              <span class="info-label">文献量：</span>
              <span class="info-value">7026</span>
            </div>
          </div>
          <div class="journal-indexes">
            <span class="index-tag">CSCD核心(2025-2026)</span>
            <span class="index-tag">EI(2024)</span>
            <span class="index-tag">CSTPCD(2024)</span>
            <span class="index-tag">北大核心(2023)</span>
          </div>
        </div>

        <!-- 期刊简介 -->
        <div class="journal-section">
          <h2 class="section-title">期刊简介</h2>
          <p class="section-content">
            《软件学报》是一本刊登计算机软件各领域创造性研究成果的期刊,所刊登的论文均经过严格的同行专家评议。《软件学报》主要面向全球华人计算机软件学者,致力于创办与世界计算机科学和软件技术发展同步的以中文为主的"中国国际软件学术期刊",为全球华人同行提供学术交流平台。
          </p>
        </div>

        <!-- 关键词板块 -->
        <div class="journal-section">
          <h2 class="section-title">关键词</h2>
          <div class="keyword-tags">
            <span class="tag">计算机软件</span>
            <span class="tag">软件工程</span>
            <span class="tag">人工智能</span>
            <span class="tag">程序设计</span>
            <span class="tag">软件开发</span>
            <span class="tag">系统软件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：引入收藏夹弹窗组件 -->
    <CollectionModal 
      :visible="showCollectionModal" 
      :initItem="currentCollectItem"
      @close="showCollectionModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 引入收藏夹弹窗组件（确认路径和实际项目一致）
import CollectionModal from '@/views/components/CollectionModal/index.vue';

// 控制收藏夹弹窗显示/隐藏
const showCollectionModal = ref(false);
// 存储当前要收藏的期刊信息
const currentCollectItem = ref(null);

// 收藏期刊的点击事件处理函数
const collectJournal = () => {
  // 调试日志
  console.log('✅ 期刊收藏按钮被点击！');
  
  // 组装期刊核心信息（对应弹窗的journal分类）
  currentCollectItem.value = {
    type: 'journal', // 内容类型：期刊（和弹窗分类对应）
    title: '软件学报', // 期刊标题
    issn: '1000-9825', // 期刊ISSN
    url: 'https://example.com/journal/software', // 期刊链接
    founderYear: '1990年', // 创刊年份（扩展字段）
    editor: '李明树', // 主编（扩展字段）
    language: '中文', // 语种（扩展字段）
    documentCount: '7026', // 文献量（扩展字段）
    // 自动生成收藏时间
    collectTime: new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  };
  
  // 打开收藏夹弹窗
  showCollectionModal.value = true;
  console.log('✅ 期刊收藏弹窗已打开，收藏信息：', currentCollectItem.value);
};
</script>

<style scoped>
.journal-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
  line-height: 1.6;
}

/* 面包屑导航 */
.breadcrumb {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .current {
  color: #1a56db;
  font-weight: 500;
}

.breadcrumb span {
  color: #333;
}

/* 主要内容区 */
.main-content {
  display: flex;
  gap: 30px;
}

/* 右侧信息区 */
.right-column {
  flex: 1;
  width: 100%;
}

/* 期刊标题和操作按钮 - 新按钮样式 */
.journal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.journal-title {
  font-size: 28px;
  color: #222;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.award-tag {
  font-size: 14px;
  background-color: #e34724;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: normal;
}

.journal-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

/* 新增：提升收藏按钮层级，避免被遮挡 */
.journal-actions .favorite {
  position: relative;
  z-index: 999 !important;
}

/* 在线阅读按钮样式 */
.online-reading {
  background-color: #2563eb;
  color: white;
}

/* 收藏按钮样式 */
.favorite {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* 期刊核心基础信息 */
.journal-basic-info {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.journal-basic-info p {
  font-size: 16px;
  color: #555;
  margin: 0 0 10px 0;
}

.korean-title {
  font-style: italic;
  margin-left: 10px;
  color: #666;
}

/* 基础信息列表样式 - 适配更多项 */
.basic-info-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 10px 0;
  font-size: 15px;
}

.basic-info-item {
  display: flex;
  align-items: center;
  /* 限制单项宽度，避免换行混乱 */
  flex: 0 0 calc(33.33% - 10px);
}

.info-label {
  color: #666;
  margin-right: 5px;
  white-space: nowrap;
}

.info-value {
  color: #1a56db;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-value:hover {
  text-decoration: underline;
}

.journal-indexes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.index-tag {
  background-color: #f0f7ff;
  color: #1a56db;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 13px;
}

/* 期刊各部分通用样式 */
.journal-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 18px;
  color: #1a56db;
  margin: 0 0 10px 0;
  padding-left: 8px;
  border-left: 3px solid #1a56db;
}

.section-content {
  font-size: 15px;
  color: #333;
  margin: 0;
  line-height: 1.7;
}

/* 关键词标签样式 */
.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #f0f7ff;
  color: #1a56db;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
}

/* 收藏弹窗样式穿透（确保弹窗正常显示） */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .journal-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .basic-info-item {
    flex: 0 0 100%;
  }
}
</style>