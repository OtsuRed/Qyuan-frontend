<template>
  <div class="search-page">
    <!-- 顶部导航栏 -->
    <Navigation />
    <!-- 搜索页面内容 -->
    <main class="search-container">
      <!-- 紧凑型搜索头部 (替换原来的搜索头部) -->
      <section class="compact-search-section">
        <div class="compact-search-wrapper">
          <!-- 主搜索框 -->
          <div class="compact-search-box">
            <div class="search-input-compact">
              <input
                  v-model="searchKeyword"
                  type="text"
                  class="search-input-field"
                  placeholder="搜索论文、期刊、专利..."
                  @keyup.enter="handleSearch"
              />
              <button class="search-btn-compact" @click="handleSearch">
                <span class="search-btn-icon">🔍</span>
                <span class="search-btn-text">搜索</span>
              </button>
            </div>
            <!-- 搜索类型切换 -->
            <div class="search-type-compact">
              <div class="type-tabs-compact">
                <button
                    v-for="type in searchTypes"
                    :key="type.value"
                    class="type-tab-compact"
                    :class="{ active: activeSearchType === type.value }"
                    @click="setSearchType(type.value)"
                >
                  <span class="type-icon-small">{{ type.icon }}</span>
                  {{ type.label }}
                </button>
              </div>
            </div>
            <!-- 热门搜索 -->
            <div class="hot-search-compact">
              <span class="hot-label-compact">热门搜索：</span>
              <div class="hot-tags-compact">
                <span
                    v-for="tag in hotSearchTags"
                    :key="tag"
                    class="hot-tag-compact"
                    @click="searchByTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 高级筛选区域 -->
      <section class="filter-section" v-if="showAdvancedFilters">
        <div class="filter-container">
          <div class="filter-header">
            <h3 class="filter-title">高级筛选</h3>
            <button
                class="collapse-filter-btn"
                @click="toggleAdvancedFilters"
            >
              {{ showAdvancedFilters ? '收起筛选' : '展开筛选' }}
            </button>
          </div>

          <div class="filter-content">
            <!-- 论文/期刊/专利通用筛选 -->
            <div class="filter-grid">
              <!-- 关键词筛选 -->
              <div class="filter-group">
                <label class="filter-label">关键词</label>
                <input
                    v-model="filters.keyword"
                    type="text"
                    class="filter-input"
                    placeholder="输入关键词..."
                />
              </div>

              <!-- 分类筛选 -->
              <div class="filter-group" v-if="activeSearchType !== 'patent'">
                <label class="filter-label">分类</label>
                <select
                    v-model="filters.categoryId"
                    class="filter-select"
                >
                  <option value="">全部分类</option>
                  <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- 提交者/作者 -->
              <div class="filter-group">
                <label class="filter-label">
                  {{ activeSearchType === 'patent' ? '发明人' : '作者' }}
                </label>
                <input
                    v-model="filters.submitter"
                    type="text"
                    class="filter-input"
                    :placeholder="activeSearchType === 'patent' ? '输入发明人...' : '输入作者...'"
                />
              </div>

              <!-- 期刊来源/专利号 -->
              <div class="filter-group">
                <label class="filter-label">
                  {{ activeSearchType === 'patent' ? '专利号' : '期刊来源' }}
                </label>
                <input
                    v-model="filters.journalSource"
                    type="text"
                    class="filter-input"
                    :placeholder="activeSearchType === 'patent' ? '输入专利号...' : '输入期刊来源...'"
                />
              </div>

              <!-- 时间范围 -->
              <div class="filter-group double-input">
                <label class="filter-label">发布时间</label>
                <div class="date-range">
                  <input
                      v-model="filters.startTime"
                      type="date"
                      class="filter-date"
                      placeholder="开始时间"
                  />
                  <span class="date-separator">至</span>
                  <input
                      v-model="filters.endTime"
                      type="date"
                      class="filter-date"
                      placeholder="结束时间"
                  />
                </div>
              </div>

              <!-- 阅读量/浏览量范围 -->
              <div class="filter-group double-input" v-if="activeSearchType !== 'patent'">
                <label class="filter-label">阅读量</label>
                <div class="range-input">
                  <input
                      v-model="filters.minReadCount"
                      type="number"
                      class="range-number"
                      placeholder="最小"
                      min="0"
                  />
                  <span class="range-separator">-</span>
                  <input
                      v-model="filters.maxReadCount"
                      type="number"
                      class="range-number"
                      placeholder="最大"
                      min="0"
                  />
                </div>
              </div>

              <!-- 收藏量范围 -->
              <div class="filter-group double-input" v-if="activeSearchType !== 'patent'">
                <label class="filter-label">收藏量</label>
                <div class="range-input">
                  <input
                      v-model="filters.minFavoriteCount"
                      type="number"
                      class="range-number"
                      placeholder="最小"
                      min="0"
                  />
                  <span class="range-separator">-</span>
                  <input
                      v-model="filters.maxFavoriteCount"
                      type="number"
                      class="range-number"
                      placeholder="最大"
                      min="0"
                  />
                </div>
              </div>

              <!-- 排序选项 -->
              <div class="filter-group">
                <label class="filter-label">排序方式</label>
                <div class="sort-options">
                  <select
                      v-model="filters.sortField"
                      class="filter-select"
                  >
                    <option value="default">默认排序</option>
                    <option value="read_count">阅读量</option>
                    <option value="favorite_count">收藏量</option>
                    <option value="updated">更新时间</option>
                    <option value="published">发布时间</option>
                  </select>
                  <select
                      v-model="filters.sortOrder"
                      class="filter-select"
                  >
                    <option value="desc">降序</option>
                    <option value="asc">升序</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 筛选操作按钮 -->
            <div class="filter-actions">
              <button class="reset-btn" @click="resetFilters">
                重置
              </button>
              <button class="apply-btn" @click="applyFilters">
                应用筛选
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 搜索结果区域 -->
      <section class="results-section">
        <div class="results-container">
          <!-- 搜索结果头部 -->
          <div class="results-header">
            <div class="results-info">
              <h2 class="results-title">
                {{ getResultsTitle() }}
              </h2>
              <p class="results-count">
                找到 {{ totalResults }} 个结果
                <span class="search-time" v-if="searchTime">({{ searchTime }}秒)</span>
              </p>
            </div>
            <div class="results-controls">
              <button
                  class="filter-toggle-btn"
                  @click="toggleAdvancedFilters"
              >
                <span class="filter-icon">⚙️</span>
                {{ showAdvancedFilters ? '隐藏筛选' : '高级筛选' }}
              </button>
              <div class="view-toggle">
                <button
                    class="view-btn"
                    :class="{ active: viewMode === 'list' }"
                    @click="setViewMode('list')"
                    title="列表视图"
                >
                  📋
                </button>
                <button
                    class="view-btn"
                    :class="{ active: viewMode === 'grid' }"
                    @click="setViewMode('grid')"
                    title="网格视图"
                >
                  ⏹️
                </button>
              </div>
            </div>
          </div>

          <!-- 搜索结果列表/网格 -->
          <div :class="['results-content', viewMode]">
            <!-- 论文结果 -->
            <template v-if="activeSearchType === 'paper'">
              <div
                  v-for="paper in searchResults"
                  :key="paper.id"
                  :class="['result-item', viewMode]"
              >
                <div class="result-content">
                  <div class="result-header">
                    <span class="result-type paper-type">论文</span>
                    <span class="result-source">{{ paper.journal || paper.source }}</span>
                  </div>
                  <h3 class="result-title">
                    <router-link :to="`/paper/${paper.id}`" class="result-link">
                      {{ paper.title }}
                    </router-link>
                  </h3>
                  <p class="result-abstract">
                    {{ paper.abstract || paper.description }}
                  </p>
                  <div class="result-meta">
                    <div class="meta-left">
                      <span class="author">
                        <img :src="paper.authorAvatar" class="author-avatar" alt="作者头像" />
                        {{ paper.author || paper.submitter }}
                      </span>
                      <span class="date">{{ formatDate(paper.published || paper.updated) }}</span>
                    </div>
                    <div class="meta-right">
                      <span class="stat">
                        <i class="stat-icon">👁️</i> {{ paper.readCount || paper.views || 0 }}
                      </span>
                      <span class="stat">
                        <i class="stat-icon">❤️</i> {{ paper.favoriteCount || paper.likes || 0 }}
                      </span>
                      <span class="stat" v-if="paper.citations">
                        <i class="stat-icon">📈</i> {{ paper.citations }}
                      </span>
                    </div>
                  </div>
                  <div class="result-tags">
                    <span
                        v-for="tag in paper.tags"
                        :key="tag"
                        class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <!-- 期刊结果 -->
            <template v-else-if="activeSearchType === 'journal'">
              <div
                  v-for="journal in searchResults"
                  :key="journal.id"
                  :class="['result-item', viewMode]"
              >
                <div class="result-content">
                  <div class="result-header">
                    <span class="result-type journal-type">期刊</span>
                    <span class="result-issn">ISSN: {{ journal.issn }}</span>
                  </div>
                  <h3 class="result-title">
                    <router-link :to="`/journal/${journal.id}`" class="result-link">
                      {{ journal.name }}
                    </router-link>
                  </h3>
                  <p class="result-description">
                    {{ journal.description }}
                  </p>
                  <div class="result-meta">
                    <div class="meta-left">
                      <span class="publisher">
                        <i class="meta-icon">🏢</i> {{ journal.publisher }}
                      </span>
                      <span class="impact-factor" v-if="journal.impactFactor">
                        <i class="meta-icon">📊</i> 影响因子: {{ journal.impactFactor }}
                      </span>
                    </div>
                    <div class="meta-right">
                      <span class="stat">
                        <i class="stat-icon">📄</i> {{ journal.articleCount || 0 }} 篇文章
                      </span>
                      <span class="stat">
                        <i class="stat-icon">⭐</i> {{ journal.followers || 0 }} 关注
                      </span>
                    </div>
                  </div>
                  <div class="result-tags">
                    <span
                        v-for="field in journal.fields"
                        :key="field"
                        class="tag"
                    >
                      {{ field }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <!-- 专利结果 -->
            <template v-else-if="activeSearchType === 'patent'">
              <div
                  v-for="patent in searchResults"
                  :key="patent.id"
                  :class="['result-item', viewMode]"
              >
                <div class="result-content">
                  <div class="result-header">
                    <span class="result-type patent-type">专利</span>
                    <span class="patent-number">{{ patent.patentNumber }}</span>
                  </div>
                  <h3 class="result-title">
                    <router-link :to="`/patent/${patent.id}`" class="result-link">
                      {{ patent.title }}
                    </router-link>
                  </h3>
                  <p class="result-abstract">
                    {{ patent.abstract }}
                  </p>
                  <div class="result-meta">
                    <div class="meta-left">
                      <span class="inventor">
                        <i class="meta-icon">👤</i> {{ patent.inventor }}
                      </span>
                      <span class="assignee" v-if="patent.assignee">
                        <i class="meta-icon">🏢</i> {{ patent.assignee }}
                      </span>
                    </div>
                    <div class="meta-right">
                      <span class="stat">
                        <i class="stat-icon">📅</i> {{ formatDate(patent.filingDate) }}
                      </span>
                      <span class="stat" v-if="patent.status">
                        <i class="stat-icon">📋</i> {{ patent.status }}
                      </span>
                    </div>
                  </div>
                  <div class="result-tags">
                    <span
                        v-for="category in patent.categories"
                        :key="category"
                        class="tag"
                    >
                      {{ category }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <!-- 无结果提示 -->
            <div v-if="searchResults.length === 0 && hasSearched" class="no-results">
              <div class="no-results-icon">🔍</div>
              <h3 class="no-results-title">未找到相关结果</h3>
              <p class="no-results-message">尝试调整搜索关键词或筛选条件</p>
              <button class="no-results-btn" @click="resetFilters">
                重置搜索条件
              </button>
            </div>

            <!-- 加载中提示 -->
            <div v-if="isLoading" class="loading-results">
              <div class="loading-spinner"></div>
              <p class="loading-text">正在搜索中...</p>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-section" v-if="totalResults > 0">
            <div class="pagination-info">
              显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalResults) }} 条，共 {{ totalResults }} 条
            </div>
            <div class="pagination-controls">
              <button
                  class="pagination-btn prev"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
              >
                上一页
              </button>

              <div class="page-numbers">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    class="page-number"
                    :class="{ active: page === currentPage }"
                    @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span class="page-ellipsis" v-if="showEllipsis">...</span>
              </div>

              <button
                  class="pagination-btn next"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)"
              >
                下一页
              </button>
            </div>
            <div class="page-size-selector">
              <span class="page-size-label">每页显示：</span>
              <select v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
                <option value="10">10 条</option>
                <option value="20">20 条</option>
                <option value="50">50 条</option>
                <option value="100">100 条</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- 底部信息 -->
    <Foot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";
import Foot from "@/views/components/Foot.vue";

import {
  searchTypes, hotSearchTags, categories
} from './mockData.js';

const route = useRoute();
const router = useRouter();

// 搜索相关状态
const searchKeyword = ref('');
const activeSearchType = ref('paper'); // paper, journal, patent
const showAdvancedFilters = ref(false);
const viewMode = ref('list'); // list, grid
const hasSearched = ref(false);
const isLoading = ref(false);
const searchTime = ref(0);

// 分页状态
const currentPage = ref(1);
const pageSize = ref(20);
const totalResults = ref(0);
const totalPages = computed(() => Math.ceil(totalResults.value / pageSize.value));


// 筛选条件
const filters = ref({
  keyword: '',
  categoryId: '',
  categoryIds: [],
  submitter: '',
  journalSource: '',
  startTime: '',
  endTime: '',
  minReadCount: '',
  maxReadCount: '',
  minFavoriteCount: '',
  maxFavoriteCount: '',
  page: 0,
  size: 20,
  sortField: 'default',
  sortOrder: 'desc',
  sortOptions: [],
});

// 搜索结果
const searchResults = ref([]);

// 计算显示的页码
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > visiblePages.value.length;
});

// 获取结果标题
const getResultsTitle = () => {
  const typeMap = {
    paper: '论文',
    journal: '期刊',
    patent: '专利',
  };
  const keyword = searchKeyword.value || filters.value.keyword;
  return keyword ? `"${keyword}" 的${typeMap[activeSearchType.value]}搜索结果` :
      `${typeMap[activeSearchType.value]}搜索`;
};

// 处理搜索
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    alert('请输入搜索关键词');
    return;
  }

  hasSearched.value = true;
  isLoading.value = true;
  currentPage.value = 1;

  const startTime = Date.now();

  try {
    // 构建搜索参数
    const searchParams = {
      keyword: searchKeyword.value.trim(),
      page: currentPage.value - 1,
      size: pageSize.value,
      ...filters.value
    };

    // 根据搜索类型调用不同的API
    let result;
    if (activeSearchType.value === 'paper') {
      if (showAdvancedFilters.value && hasAdvancedFilters()) {
        result = await esPaperSearchWithRequest(searchParams);
      } else {
        result = await esPaperSearchSimple({
          keyword: searchParams.keyword,
          page: searchParams.page,
          size: searchParams.size
        });
      }
    } else if (activeSearchType.value === 'journal') {
      result = await esJournalSearch(searchParams);
    } else if (activeSearchType.value === 'patent') {
      result = await esPatentSearch(searchParams);
    }

    // 处理结果
    searchResults.value = result.data || result.content || [];
    totalResults.value = result.total || result.totalElements || 0;

    // 更新URL
    updateURL();

  } catch (error) {
    console.error('搜索失败:', error);
    alert('搜索失败，请稍后重试');
    searchResults.value = [];
    totalResults.value = 0;
  } finally {
    isLoading.value = false;
    searchTime.value = ((Date.now() - startTime) / 1000).toFixed(2);
  }
};

// 检查是否有高级筛选条件
const hasAdvancedFilters = () => {
  const advancedFields = [
    'categoryId', 'submitter', 'journalSource',
    'startTime', 'endTime', 'minReadCount',
    'maxReadCount', 'minFavoriteCount', 'maxFavoriteCount'
  ];
  return advancedFields.some(field => filters.value[field]);
};

// 设置搜索类型
const setSearchType = (type) => {
  activeSearchType.value = type;
  if (searchKeyword.value.trim() && hasSearched.value) {
    handleSearch();
  }
};

// 标签搜索
const searchByTag = (tag) => {
  searchKeyword.value = tag;
  handleSearch();
};

// 切换高级筛选
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

// 应用筛选
const applyFilters = () => {
  currentPage.value = 1;
  handleSearch();
};

// 重置筛选
const resetFilters = () => {
  filters.value = {
    keyword: '',
    categoryId: '',
    categoryIds: [],
    submitter: '',
    journalSource: '',
    startTime: '',
    endTime: '',
    minReadCount: '',
    maxReadCount: '',
    minFavoriteCount: '',
    maxFavoriteCount: '',
    page: 0,
    size: pageSize.value,
    sortField: 'default',
    sortOrder: 'desc',
    sortOptions: [],
  };

  if (searchKeyword.value.trim()) {
    handleSearch();
  }
};

// 设置视图模式
const setViewMode = (mode) => {
  viewMode.value = mode;
};

// 分页导航
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return;
  }

  currentPage.value = page;
  filters.value.page = page - 1;
  handleSearch();
};

// 更改每页显示数量
const handlePageSizeChange = () => {
  currentPage.value = 1;
  filters.value.size = pageSize.value;
  if (searchKeyword.value.trim() && hasSearched.value) {
    handleSearch();
  }
};

// 更新URL参数
const updateURL = () => {
  const query = {
    q: searchKeyword.value,
    type: activeSearchType.value,
    page: currentPage.value,
    size: pageSize.value,
    ...filters.value
  };

  // 清理空值
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  });

  router.push({ query });
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

// API 调用函数（需要根据实际API实现）
const esPaperSearchWithRequest = async (params) => {
  // 实现论文高级搜索API调用
  console.log('调用 esPaperSearchWithRequest:', params);
  // 返回模拟数据
  return {
    data: [],
    total: 0
  };
};

const esPaperSearchSimple = async (params) => {
  // 实现论文简单搜索API调用
  console.log('调用 esPaperSearchSimple:', params);
  // 返回模拟数据
  return {
    data: [],
    total: 0
  };
};

const esJournalSearch = async (params) => {
  // 实现期刊搜索API调用
  console.log('调用 esJournalSearch:', params);
  // 返回模拟数据
  return {
    data: [],
    total: 0
  };
};

const esPatentSearch = async (params) => {
  // 实现专利搜索API调用
  console.log('调用 esPatentSearch:', params);
  // 返回模拟数据
  return {
    data: [],
    total: 0
  };
};

// 监听路由参数变化
watch(
    () => route.query,
    (newQuery) => {
      if (newQuery.q) {
        searchKeyword.value = newQuery.q;
      }
      if (newQuery.type) {
        activeSearchType.value = newQuery.type;
      }
      if (newQuery.page) {
        currentPage.value = parseInt(newQuery.page);
      }
      if (newQuery.size) {
        pageSize.value = parseInt(newQuery.size);
      }

      // 如果有搜索关键词，执行搜索
      if (newQuery.q && !hasSearched.value) {
        handleSearch();
      }
    },
    { immediate: true }
);

// 组件挂载时初始化
onMounted(() => {
  if (route.query.q) {
    handleSearch();
  }
});
</script>

<style scoped src="./Search.styles.css"></style>