<template>
  <div class="wanfang-search-page">
    <!-- 顶部导航栏（完全清空） -->
    <header class="page-header"></header>

    <!-- 分类导航 -->
    <nav class="category-nav">
      <div class="nav-wrapper">
        <span class="category-item active">全部</span>
        <span class="category-item">期刊</span>
        <span class="category-item">学位</span>
        <span class="category-item">会议</span>
        <span class="category-item">专利</span>
        <span class="category-item more">更多>></span>
      </div>
    </nav>

    <!-- 搜索区域（仅保留搜索框+按钮） -->
    <section class="search-area">
      <div class="search-wrapper">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="请输入关键词/标题/作者/DOI"
          class="search-input"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
    </section>

    <!-- 主体内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 左侧筛选栏 -->
        <aside class="filter-sidebar">
          <!-- 论文类别筛选 -->
          <div class="filter-block">
            <h3 class="filter-title" @click="toggleFilter('category')">
              论文类别
              <span class="arrow" :class="{ expand: filterStatus.category }">▼</span>
            </h3>
            <div class="filter-content" v-show="filterStatus.category">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.category" value="computer" />
                计算机科学
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.category" value="ai" />
                人工智能
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.category" value="electronics" />
                电子工程
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.category" value="biology" />
                生物科学
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.category" value="physics" />
                物理学
              </label>
            </div>
          </div>

          <!-- 资源类型筛选（仅保留论文、期刊、专利） -->
          <div class="filter-block">
            <h3 class="filter-title" @click="toggleFilter('type')">
              资源类型
              <span class="arrow" :class="{ expand: filterStatus.type }">▼</span>
            </h3>
            <div class="filter-content" v-show="filterStatus.type">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.type" value="paper" />
                论文
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.type" value="journal" />
                期刊
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.type" value="patent" />
                专利
              </label>
            </div>
          </div>

          <!-- 年份筛选 -->
          <div class="filter-block">
            <h3 class="filter-title" @click="toggleFilter('year')">
              发表年份
              <span class="arrow" :class="{ expand: filterStatus.year }">▼</span>
            </h3>
            <div class="filter-content" v-show="filterStatus.year">
              <label class="filter-checkbox" v-for="year in yearList" :key="year">
                <input type="checkbox" v-model="filterForm.year" :value="year" />
                {{ year }}
              </label>
            </div>
          </div>

          <!-- 语种筛选 -->
          <div class="filter-block">
            <h3 class="filter-title" @click="toggleFilter('language')">
              语种
              <span class="arrow" :class="{ expand: filterStatus.language }">▼</span>
            </h3>
            <div class="filter-content" v-show="filterStatus.language">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.language" value="cn" />
                中文
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.language" value="en" />
                英文
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterForm.language" value="jp" />
                日文
              </label>
            </div>
          </div>
        </aside>

        <!-- 右侧结果展示区 -->
        <section class="result-content">
          <!-- 结果概览（仅保留结果数量） -->
          <div class="result-overview">
            <span class="result-count">找到 {{ literatureList.length }} 条文献</span>
          </div>

          <!-- 文献列表（无核心标识） -->
          <div class="literature-list">
            <div class="literature-item" v-for="(item, index) in literatureList" :key="index">
              <div class="literature-top">
                <span class="literature-index">{{ index + 1 }}</span>
                <h4 class="literature-title">
                  {{ item.title }}
                </h4>
              </div>
              <div class="literature-source">
                <span class="resource-type">[{{ item.resourceType }}]</span>
                <span class="author">{{ item.author }}</span>
                <span class="journal">· 《{{ item.journal }}》</span>
                <span class="publish-time">· {{ item.publishTime }}</span>
              </div>
              <div class="literature-abstract">
                摘要：{{ item.abstract }}
              </div>
              <div class="literature-keywords">
                关键词：{{ item.keywords.join('；') }}
              </div>
              <div class="literature-action">
                <button class="action-btn">在线阅读</button>
                <button class="action-btn">下载</button>
                <button class="action-btn">引用</button>
                <button class="action-btn">收藏</button>
                <span class="literature-stat">被引：{{ item.citation }} | 下载：{{ item.download }}</span>
              </div>
            </div>
          </div>

          <!-- 分页组件 -->
          <div class="pagination-wrapper">
            <div class="pagination">
              <button class="page-btn" :disabled="currentPage === 1">上一页</button>
              <button 
                class="page-number" 
                :class="{ active: page === currentPage }"
                v-for="page in pageNumberList" 
                :key="page"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </button>
              <button class="page-btn" :disabled="currentPage === totalPage">下一页</button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="page-footer">
      <div class="footer-text">© 2025 XX知识服务平台 版权所有</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 搜索关键词
const searchKeyword = ref('');

// 筛选状态（是否展开）
const filterStatus = ref({
  category: true,
  type: true,
  year: true,
  language: true
});

// 筛选表单数据
const filterForm = ref({
  category: [],
  type: [],
  year: [],
  language: []
});

// 年份列表
const yearList = ref([2025, 2024, 2023, 2022, 2021, 2020]);

// 分页参数
const currentPage = ref(1);
const totalPage = ref(7);
const pageSize = ref(10);

// 生成分页数字列表
const pageNumberList = computed(() => {
  return Array.from({ length: totalPage.value }, (_, i) => i + 1);
});

// 文献列表数据
const literatureList = ref([
  {
    title: '基于Vue 3的学术搜索页面设计与实现',
    resourceType: '论文',
    author: '张三, 李四',
    journal: '计算机工程与应用',
    publishTime: '2025-06',
    abstract: '针对学术平台搜索页面的专业性和易用性需求，结合Vue 3的Composition API特性，设计并实现了一套包含搜索、筛选、结果展示的完整页面，提升了用户检索文献的效率。',
    keywords: ['Vue 3', '学术搜索', '前端开发', '组件化'],
    citation: 12,
    download: 256
  },
  {
    title: '学术文献检索系统的优化策略研究',
    resourceType: '期刊',
    author: '王五, 赵六',
    journal: '情报杂志',
    publishTime: '2025-03',
    abstract: '分析了当前学术文献检索系统存在的检索精度不足、筛选逻辑繁琐等问题，提出了基于关键词权重和用户行为的优化策略，通过实验验证了策略的有效性。',
    keywords: ['文献检索', '优化策略', '关键词权重', '用户行为'],
    citation: 8,
    download: 198
  },
  {
    title: '大数据时代学术资源整合与共享平台构建',
    resourceType: '专利',
    author: '孙七',
    journal: '清华大学',
    publishTime: '2024-12',
    abstract: '以大数据技术为支撑，结合云计算和区块链技术，构建了一套跨机构的学术资源整合与共享平台，解决了学术资源分散、共享困难等痛点，为科研工作者提供了便捷的资源获取渠道。',
    keywords: ['大数据', '学术资源', '资源共享', '区块链'],
    citation: 5,
    download: 156
  }
]);

// 切换筛选栏展开/折叠
const toggleFilter = (type) => {
  filterStatus.value[type] = !filterStatus.value[type];
};

// 搜索事件
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    alert('请输入搜索关键词');
    return;
  }
  console.log('搜索关键词：', searchKeyword.value);
};

// 分页切换事件
const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
/* 全局样式 */
.wanfang-search-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: "Microsoft YaHei", "SimSun", sans-serif;
  color: #333;
}

.content-wrapper {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  padding: 20px 0;
}

/* 顶部导航（仅保留极窄高度） */
.page-header {
  width: 100%;
  height: 10px;
  background-color: #fff;
}

/* 分类导航 */
.category-nav {
  width: 100%;
  background-color: #fff;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.nav-wrapper {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 25px;
}

.category-item {
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: color 0.3s;
}

.category-item.active {
  color: #1e88e5;
  font-weight: bold;
}

.category-item:hover {
  color: #1e88e5;
}

/* 搜索区域 */
.search-area {
  width: 100%;
  padding: 30px 0;
  background-color: #fff;
  margin-top: 10px;
}

.search-wrapper {
  width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: 2px solid #1e88e5;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 14px;
}

.search-btn {
  height: 40px;
  width: 80px;
  background-color: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1976d2;
}

/* 左侧筛选栏 */
.filter-sidebar {
  width: 200px;
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-block {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
}

.filter-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.arrow {
  font-size: 12px;
  transition: transform 0.3s;
}

.arrow.expand {
  transform: rotate(180deg);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-checkbox {
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

/* 右侧结果区 */
.result-content {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.result-overview {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.result-count {
  font-size: 14px;
  color: #666;
}

/* 文献列表 */
.literature-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
}

.literature-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.literature-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.literature-index {
  font-size: 14px;
  color: #999;
  margin-top: 2px;
}

.literature-title {
  font-size: 16px;
  margin: 0;
  color: #1e88e5;
  cursor: pointer;
  transition: color 0.3s;
}

.literature-title:hover {
  color: #1976d2;
  text-decoration: underline;
}

.literature-source {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.resource-type {
  color: #f57c00;
  font-weight: bold;
}

.literature-abstract {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 8px;
}

.literature-keywords {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.literature-action {
  display: flex;
  gap: 15px;
  align-items: center;
}

.action-btn {
  padding: 4px 10px;
  border: 1px solid #1e88e5;
  background-color: #fff;
  color: #1e88e5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #1e88e5;
  color: #fff;
}

.literature-stat {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:disabled {
  cursor: not-allowed;
  color: #ccc;
  border-color: #eee;
}

.page-number {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-number.active {
  background-color: #1e88e5;
  color: #fff;
  border-color: #1e88e5;
}

.page-number:hover:not(.active) {
  border-color: #1e88e5;
  color: #1e88e5;
}

/* 底部 */
.page-footer {
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.footer-text {
  font-size: 13px;
  color: #999;
}
</style>