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
      <!-- 左侧：期刊封面 -->
      <div class="left-column">
        <div class="journal-cover">
          <img src="https://picsum.photos/300/400" alt="软件学报封面" class="cover-image">
        </div>
      </div>

      <!-- 右侧：期刊信息 -->
      <div class="right-column">
        <!-- 期刊标题和操作按钮 -->
        <div class="journal-header">
          <h1 class="journal-title">
            软件学报
            <span class="award-tag">获奖刊</span>
          </h1>
          <div class="journal-actions">
            <button class="btn subscribe-journal">期刊订阅</button>
            <button class="btn feed-subscribe">
              feed订阅
              <i class="arrow-down"></i>
            </button>
          </div>
        </div>

        <!-- 期刊英文信息 -->
        <div class="journal-english-info">
          <p>Journal of Software <span class="korean-title">연구소학보</span></p>
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

        <!-- 两列信息布局 -->
        <div class="two-column-info">
          <div class="left-info">
            <div class="journal-section">
              <h2 class="section-title">获奖情况</h2>
              <p class="section-content">
                百种中国杰出学术期刊,1997年,<br>
                《软件学报》荣获第二届全国优秀科技期刊三等奖; 1996年,《软件学报》荣获中国科学院优秀科技期刊二等奖; 1992年,《软件学报》获得北京科技期刊四通奖的编辑质量奖、期刊效益奖和办刊条件奖;
              </p>
            </div>

            <div class="journal-metrics">
              <div class="metric-item">
                <span class="metric-label">影响因子:</span>
                <span class="metric-value">2.99</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">被引量:</span>
                <span class="metric-value">291930</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">下载量:</span>
                <span class="metric-value">867570</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">基金论文量:</span>
                <span class="metric-value">5515</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">邮政编码:</span>
                <span class="metric-value">100190</span>
              </div>
            </div>
          </div>

          <div class="right-info">
            <div class="journal-details">
              <div class="detail-item">
                <span class="detail-label">主办单位:</span>
                <span class="detail-value">中国科学院软件研究所 中国计算机学会</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">主编:</span>
                <span class="detail-value">李明树</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">出版周期:</span>
                <span class="detail-value">月刊</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">语种:</span>
                <span class="detail-value">中文</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">国际刊号:</span>
                <span class="detail-value">1000-9825</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">国内刊号:</span>
                <span class="detail-value">11-2560/TP</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">文献量:</span>
                <span class="detail-value">7026</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">电话:</span>
                <span class="detail-value">010-62562563</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">地址:</span>
                <span class="detail-value">北京8718信箱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 可以在这里添加交互逻辑
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

/* 左侧封面区 */
.left-column {
  flex: 0 0 300px;
}

.journal-cover {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: #fff;
  padding: 15px;
}

.cover-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 右侧信息区 */
.right-column {
  flex: 1;
}

/* 期刊标题和操作按钮 */
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

.subscribe-journal {
  background-color: #1a56db;
  color: white;
}

.feed-subscribe {
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.arrow-down::after {
  content: "▼";
  font-size: 10px;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 期刊英文信息 */
.journal-english-info {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.journal-english-info p {
  font-size: 16px;
  color: #555;
  margin: 0 0 10px 0;
}

.korean-title {
  font-style: italic;
  margin-left: 10px;
  color: #666;
}

.journal-indexes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

/* 两列信息布局 */
.two-column-info {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.left-info, .right-info {
  flex: 1;
}

/* 左侧指标信息 */
.journal-metrics {
  margin-top: 25px;
}

.metric-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 15px;
}

.metric-label {
  flex: 0 0 100px;
  color: #666;
}

.metric-value {
  color: #333;
  font-weight: 500;
}

/* 右侧详细信息 */
.journal-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  font-size: 15px;
}

.detail-label {
  flex: 0 0 100px;
  color: #666;
}

.detail-value {
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-column {
    flex: none;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .two-column-info {
    flex-direction: column;
    gap: 20px;
  }
  
  .journal-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>