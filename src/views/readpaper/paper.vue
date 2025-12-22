<template>
  <div class="paper-detail-page">
    <div class="paper-title">
      <h1>论文标题：这是一篇学术论文的示例标题</h1>
      <p class="doi">DOI: 10.xxxx/j.cnki.xxxx.xxxx.xxxx</p>
      <p class="paper-link">论文链接: <a href="https://example.com/paper" target="_blank" rel="noopener noreferrer">https://example.com/paper</a></p>
    </div>

    <div class="info-block author-info">
      <div class="info-content">
        <p><span class="info-label">作者:</span> 作者1、作者2、作者3</p>
        <p><span class="info-label">提交者:</span> 提交者信息1; 提交者信息2; 提交者信息3</p>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn online-reading">在线阅读</button>
      <button class="btn download">下载</button>
      <button class="btn favorite" @click="collectPaper">收藏</button>
      <button class="btn share">分享</button>
      <button class="btn claim" @click="showClaimModal = true">认领</button>
    </div>

    <div class="main-content">
      <div class="left-column">
        <div class="info-block integrated-block">
          <div class="section abstract-section">
            <h3 class="section-title">摘要</h3>
            <div class="section-content">
              <p>论文摘要内容...（此处省略具体内容）这是一段示例摘要文本，用于展示摘要区域的显示效果。摘要通常概括了论文的主要内容、研究方法、重要发现和结论等关键信息。
                <button class="toggle-btn" @click="showFullAbstract = !showFullAbstract">
                  {{ showFullAbstract ? '收起' : '展开' }}
                </button>
              </p>
            </div>
          </div>

          <div class="section keywords-section">
            <h3 class="section-title">关键词</h3>
            <div class="section-content">
              <div class="keyword-tags">
                <span class="tag">关键词1</span>
                <span class="tag">关键词2</span>
                <span class="tag">关键词3</span>
                <span class="tag">关键词4</span>
              </div>
            </div>
          </div>

          <div class="section journal-section">
            <h3 class="section-title">期刊来源</h3>
            <div class="section-content">
              <p><span class="info-label">期刊名称:</span> 计算机工程与应用</p>
            </div>
          </div>

          <div class="section publication-section">
            <h3 class="section-title">发表信息</h3>
            <div class="section-content">
              <p><span class="info-label">论文发表日期:</span> 2025-06-15</p>
              <p><span class="info-label">在线出版日期:</span> 2025-06-20 (平台首次上网日期,不代表论文的发表时间)</p>
              <p><span class="info-label">页数:</span> 25 (10-35)</p>
              <button class="toggle-english" @click="showEnglishInfo = !showEnglishInfo">
                英文信息 {{ showEnglishInfo ? '收起' : '展开' }}
              </button>
              <div v-if="showEnglishInfo" class="english-info">
                <p><span class="info-label">Title:</span> English title of the paper</p>
                <p><span class="info-label">Authors:</span> Author 1, Author 2, Author 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="info-block references-block">
          <div class="block-header">
            参考文献(15)
            <div class="reference-controls">
              <label class="checkbox-label">
                <input type="checkbox" v-model="onlyFullText"> 仅看全文
              </label>
              <select v-model="sortType" class="sort-select">
                <option value="date">按发表时间排序</option>
                <option value="citation">按被引量排序</option>
              </select>
              <button class="network-btn">查看引文网络</button>
            </div>
          </div>
          <div class="block-content">
            <ul class="reference-list">
              <li class="reference-item">1. 作者. 文献标题[J]. 期刊名称, 年份, 卷(期):页码. DOI:xxxx.xxxx</li>
              <li class="reference-item">2. 作者. 文献标题[J]. 期刊名称, 年份, 卷(期):页码.</li>
              <li class="reference-item">3. 作者. 文献标题[M]. 出版社, 年份.</li>
              <li class="reference-item">4. 作者. 文献标题[C]. 会议名称, 年份:页码.</li>
              <li class="reference-item">5. 作者. 文献标题[P]. 专利号, 公开日期.</li>
            </ul>
          </div>
        </div>

        <div class="info-block related-topics-block">
          <div class="block-header">论文类别</div>
          <div class="block-content">
            <div class="topics-container">
              <a href="#" class="topic-tag">计算机科学</a>
              <a href="#" class="topic-tag">人工智能</a>
              <a href="#" class="topic-tag">机器学习</a>
              <a href="#" class="topic-tag">数据挖掘</a>
              <a href="#" class="topic-tag">深度学习</a>
              <a href="#" class="topic-tag">自然语言处理</a>
              <a href="#" class="topic-tag">计算机视觉</a>
              <a href="#" class="topic-tag">大数据</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <p>© 2025 千源学术 版权所有</p>
      <p>万方数据知识服务平台提供技术支持</p>
    </footer>

    <CollectionModal 
      :visible="showCollectionModal" 
      :initItem="currentCollectItem"
      @close="showCollectionModal = false"
    />

    <ClaimModal
      :visible="showClaimModal"
      title="论文认领申请"
      descriptionPlaceholder="请输入认领该论文的原因、相关证明说明等内容..."
      @close="showClaimModal = false"
      @submit="handlePaperClaimSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CollectionModal from '@/views/components/CollectionModal/index.vue';
import ClaimModal from '@/views/components/ClaimModal/index.vue';

const showFullAbstract = ref(false);
const showEnglishInfo = ref(false);
const onlyFullText = ref(false);
const sortType = ref('date');

const showCollectionModal = ref(false);
const currentCollectItem = ref(null);
const showClaimModal = ref(false);

const collectPaper = () => {
  console.log('✅ 收藏按钮被点击！');
  
  currentCollectItem.value = {
    type: 'paper',
    title: '这是一篇学术论文的示例标题',
    doi: '10.xxxx/j.cnki.xxxx.xxxx.xxxx',
    url: 'https://example.com/paper',
    collectTime: new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  };
  
  showFullAbstract.value = false;
  showCollectionModal.value = true;
  console.log('✅ 收藏弹窗状态已设置为：', showCollectionModal.value);
  console.log('✅ 要收藏的论文信息：', currentCollectItem.value);
};

const handlePaperClaimSubmit = (submitData) => {
  console.log('📄 论文认领提交数据：', submitData);
  alert('论文认领申请已提交，我们将在1-3个工作日内审核并回复您！');
  showClaimModal.value = false;
};
</script>

<style scoped>
.paper-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 1.6;
  color: #333;
}

.paper-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.paper-title h1 {
  font-size: 22px;
  color: #1a56db;
  margin-bottom: 10px;
  line-height: 1.4;
}

.doi {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.paper-link {
  color: #2563eb;
  font-size: 14px;
  text-decoration: none;
}

.paper-link a {
  color: #2563eb;
  text-decoration: none;
  margin-left: 5px;
}

.paper-link a:hover {
  text-decoration: underline;
}

.info-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.author-info .info-content {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

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

.claim {
  background-color: #fb923c;
  color: white;
}

.claim:hover {
  background-color: #f97316;
}

.action-buttons .favorite {
  position: relative;
  z-index: 999 !important;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.main-content {
  display: flex;
  gap: 20px;
}

.left-column {
  flex: 2;
}

.right-column {
  flex: 1;
}

.integrated-block {
  padding: 20px;
}

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

.section-content {
  color: #475569;
  font-size: 14px;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.toggle-english {
  color: #2563eb;
  background: none;
  border: none;
  padding: 5px 0;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.english-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e0e7ff;
}

.block-header {
  background: #eff6ff;
  padding: 12px 15px;
  font-weight: 600;
  color: #1e40af;
  border-bottom: 1px solid #dbeafe;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.block-content {
  padding: 15px;
}

.references-block .block-content {
  overflow-y: auto;
  max-height: 300px;
}

.reference-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-select {
  padding: 3px 8px;
  border: 1px solid #94a3b8;
  border-radius: 4px;
  font-size: 13px;
  background-color: white;
}

.network-btn {
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px 5px;
  font-size: 13px;
  font-weight: 500;
}

.reference-item {
  padding: 10px 0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 14px;
  color: #475569;
}

.topics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  background: #f0f9ff;
  color: #0369a1;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #bae6fd;
}

.topic-tag:hover {
  background: #e0f2fe;
  color: #0284c7;
  transform: translateY(-1px);
}

.page-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.info-label {
  font-weight: 600;
  color: #1e293b;
  margin-right: 5px;
}

.toggle-btn {
  color: #2563eb;
  background: none;
  border: none;
  padding: 0 5px;
  cursor: pointer;
  font-size: 14px;
}

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