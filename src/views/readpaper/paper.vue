<template>
  <div class="paper-detail-page">
    <!-- 论文标题 -->
    <div class="paper-title">
      <h1>论文标题：这是一篇学术论文的示例标题</h1>
      <p class="doi">DOI: 10.xxxx/j.cnki.xxxx.xxxx.xxxx</p>
    </div>

    <!-- 作者和单位信息区 -->
    <div class="info-block author-info">
      <div class="info-content">
        <p><span class="info-label">作者:</span> 作者1、作者2、作者3</p>
        <p><span class="info-label">单位:</span> 单位信息1; 单位信息2; 单位信息3</p>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-buttons">
      <button class="btn ai-reading">AI文献伴读</button>
      <button class="btn online-reading">在线阅读</button>
      <button class="btn html-reading">HTML阅读</button>
      <button class="btn download">下载</button>
      <button class="btn review">评审材料</button>
      <button class="btn cite">引用</button>
      <button class="btn favorite">收藏</button>
      <button class="btn share">分享</button>
      <button class="btn print">打印</button>
    </div>

    <!-- 主要内容区 - 左右分栏 -->
    <div class="main-content">
      <!-- 左侧：整合的信息板块 -->
      <div class="left-column">
        <div class="info-block integrated-block">
          <!-- 摘要部分 -->
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

          <!-- 关键词部分 -->
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

          <!-- 分类号部分 -->
          <div class="section classification-section">
            <h3 class="section-title">分类号</h3>
            <div class="section-content">
              <p>分类号信息：TP311.13；TP391.1</p>
            </div>
          </div>

          <!-- 发表信息部分 -->
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

      <!-- 右侧：参考文献及新增板块 -->
      <div class="right-column">
        <!-- 参考文献板块 -->
        <div class="info-block references-block">
          <div class="block-header">
            参考文献(15)
            <div class="reference-controls">
              <label class="checkbox-label">
                <input type="checkbox" v-model="onlyFullText"> 仅看全文
              </label>
              <select v-model="sortType" class="sort-select">
                <option value="date">按发表时间排序</option>
                <option value="citation">按被引频次排序</option>
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

        <!-- 相关文献板块 -->
        <div class="info-block related-docs-block">
          <div class="block-header">
            相关文献
            <button class="refresh-btn" @click="refreshRelatedDocs">换一批</button>
          </div>
          <div class="block-content">
            <ul class="related-docs-list">
              <li class="related-doc-item">
                <a href="#" class="doc-title">相关文献标题1：与本文主题相关的研究内容</a>
                <p class="doc-meta">作者 · 期刊名称 · 2024</p>
              </li>
              <li class="related-doc-item">
                <a href="#" class="doc-title">相关文献标题2：涉及相似研究方法的论文</a>
                <p class="doc-meta">作者 · 期刊名称 · 2023</p>
              </li>
              <li class="related-doc-item">
                <a href="#" class="doc-title">相关文献标题3：探讨同一领域问题的文献</a>
                <p class="doc-meta">作者 · 期刊名称 · 2024</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- 相关主题板块 -->
        <div class="info-block related-topics-block">
          <div class="block-header">相关主题</div>
          <div class="block-content">
            <div class="topics-container">
              <a href="#" class="topic-tag">主题标签1</a>
              <a href="#" class="topic-tag">主题标签2</a>
              <a href="#" class="topic-tag">主题标签3</a>
              <a href="#" class="topic-tag">主题标签4</a>
              <a href="#" class="topic-tag">主题标签5</a>
              <a href="#" class="topic-tag">主题标签6</a>
              <a href="#" class="topic-tag">主题标签7</a>
              <a href="#" class="topic-tag">主题标签8</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="page-footer">
      <p>© 2025 千源学术 版权所有</p>
      <p>万方数据知识服务平台提供技术支持</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 状态管理
const showFullAbstract = ref(false);
const showEnglishInfo = ref(false);
const onlyFullText = ref(false);
const sortType = ref('date');

// 相关文献刷新功能
const refreshRelatedDocs = () => {
  // 实际项目中这里会发起请求获取新的相关文献
  alert('已刷新相关文献列表');
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

/* 论文标题样式 */
.paper-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.paper-title h1 {
  font-size: 22px;
  color: #1a56db; /* 更鲜艳的蓝色标题 */
  margin-bottom: 10px;
  line-height: 1.4;
}

.doi {
  color: #666;
  font-size: 14px;
}

/* 信息块通用样式 */
.info-block {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

/* 作者信息样式 */
.author-info .info-content {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

/* 按钮样式 */
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

/* 按钮色彩增强 */
.ai-reading {
  background-color: #7c3aed; /* 鲜艳的紫色 */
  color: white;
}

.online-reading {
  background-color: #2563eb; /* 鲜艳的蓝色 */
  color: white;
}

.html-reading {
  background-color: #0ea5e9; /* 亮蓝色 */
  color: white;
}

.download {
  background-color: #10b981; /* 鲜绿色 */
  color: white;
}

.review {
  background-color: #f59e0b; /* 橙色 */
  color: white;
}

.cite, .favorite, .share, .print {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* 主要内容区 - 左右分栏 */
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

/* 整合信息板块样式 */
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
  color: #1e40af; /* 更深的蓝色标题 */
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

/* 关键词样式 */
.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #dbeafe; /* 更鲜艳的蓝色背景 */
  color: #1e40af; /* 更深的蓝色文字 */
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

/* 发表信息样式 */
.toggle-english {
  color: #2563eb; /* 更鲜艳的蓝色 */
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

/* 右侧各板块通用样式 */
.block-header {
  background: #eff6ff; /* 浅蓝色背景 */
  padding: 12px 15px;
  font-weight: 600;
  color: #1e40af; /* 蓝色标题 */
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

/* 参考文献样式 */
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

/* 相关文献样式 */
.refresh-btn {
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 5px;
  font-weight: 500;
}

.related-doc-item {
  padding: 10px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.doc-title {
  color: #1d4ed8; /* 更深的蓝色 */
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.doc-title:hover {
  text-decoration: underline;
  color: #0f766e;
}

.doc-meta {
  color: #64748b;
  font-size: 12px;
  margin: 0;
}

/* 相关主题样式 */
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

/* 页脚样式 */
.page-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

/* 辅助样式 */
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
</style>