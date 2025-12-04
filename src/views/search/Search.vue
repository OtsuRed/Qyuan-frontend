<template>
  <div class="search-page">
    <!-- 顶部导航栏 -->
    <Navigation />

    <!-- 搜索页面内容 -->
    <div class="search-container">
      <!-- 顶部搜索条 -->
      <div class="search-bar-section">
        <div class="search-bar-wrapper">
          <div class="search-input-group">
            <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="输入关键词搜索..."
                @keyup.enter="performSearch"
            />
            <button class="search-btn" @click="performSearch">
              <span class="search-icon">🔍</span>
              搜索
            </button>
          </div>

          <!-- 搜索统计 -->
          <div class="search-stats">
            <span class="stat-item">
              找到 <strong>{{ totalResults }}</strong> 个结果
            </span>
            <span class="stat-item">
              用时 <strong>{{ searchTime }}</strong> 秒
            </span>
            <span class="stat-item">
              关键词: <strong>{{ currentKeyword }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧固定筛选栏 -->
        <div class="sidebar-filter" ref="filterSidebar">
          <div class="filter-sticky-wrapper">
            <!-- 筛选头部 -->
            <div class="filter-header">
              <h3 class="filter-title">筛选条件</h3>
              <button
                  class="clear-filters-btn"
                  @click="clearAllFilters"
                  :disabled="!hasActiveFilters"
              >
                清除全部
              </button>
            </div>

            <!-- 内容类型筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">内容类型</h4>
              <div class="filter-options">
                <label
                    v-for="type in contentTypes"
                    :key="type.value"
                    class="filter-option"
                    :class="{ active: selectedTypes.value.includes(type.value) }"
                >
                  <input
                      type="checkbox"
                      :value="type.value"
                      v-model="selectedTypes"
                      @change="updateFilters"
                  />
                  <span class="option-label">{{ type.label }}</span>
                  <span class="option-count">{{ type.count }}</span>
                </label>
              </div>
            </div>

            <!-- 发表时间筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">发表时间</h4>
              <div class="filter-options">
                <label
                    v-for="period in publishPeriods"
                    :key="period.value"
                    class="filter-option"
                    :class="{ active: publishPeriod === period.value }"
                >
                  <input
                      type="radio"
                      :value="period.value"
                      v-model="publishPeriod"
                      name="publishPeriod"
                      @change="updateFilters"
                  />
                  <span class="option-label">{{ period.label }}</span>
                </label>
              </div>
            </div>

            <!-- 学科领域筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">学科领域</h4>
              <div class="filter-options">
                <label
                    v-for="field in subjectFields"
                    :key="field.value"
                    class="filter-option"
                    :class="{ active: selectedFields.value.includes(field.value) }"
                >
                  <input
                      type="checkbox"
                      :value="field.value"
                      v-model="selectedFields"
                      @change="updateFilters"
                  />
                  <span class="option-label">{{ field.label }}</span>
                  <span class="option-count">{{ field.count }}</span>
                </label>
              </div>
            </div>

            <!-- 排序方式 -->
            <div class="filter-section">
              <h4 class="filter-section-title">排序方式</h4>
              <div class="filter-options">
                <label
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="filter-option"
                    :class="{ active: sortBy === option.value }"
                >
                  <input
                      type="radio"
                      :value="option.value"
                      v-model="sortBy"
                      name="sortBy"
                      @change="updateFilters"
                  />
                  <span class="option-label">{{ option.label }}</span>
                </label>
              </div>
            </div>

            <!-- 作者筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">作者</h4>
              <div class="filter-author-search">
                <input
                    v-model="authorSearch"
                    type="text"
                    class="author-search-input"
                    placeholder="搜索作者..."
                    @input="searchAuthors"
                />
              </div>
              <div class="author-list">
                <label
                    v-for="author in filteredAuthors"
                    :key="author.id"
                    class="filter-option"
                    :class="{ active: selectedAuthors.value.includes(author.id) }"
                >
                  <input
                      type="checkbox"
                      :value="author.id"
                      v-model="selectedAuthors"
                      @change="updateFilters"
                  />
                  <span class="author-info">
                    <img :src="author.avatar" class="author-avatar"  alt="作者头像"/>
                    <span class="author-name">{{ author.name }}</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- 活跃筛选器 -->
            <div v-if="hasActiveFilters" class="active-filters">
              <h4 class="filter-section-title">活跃筛选</h4>
              <div class="active-tags">
                <span
                    v-for="type in selectedTypes"
                    :key="`type-${type}`"
                    class="active-tag"
                    @click="removeTypeFilter(type)"
                >
                  {{ getTypeLabel(type) }} ×
                </span>
                <span
                    v-if="publishPeriod !== 'all'"
                    class="active-tag"
                    @click="publishPeriod = 'all'; updateFilters()"
                >
                  {{ getPeriodLabel(publishPeriod) }} ×
                </span>
                <span
                    v-for="field in selectedFields"
                    :key="`field-${field}`"
                    class="active-tag"
                    @click="removeFieldFilter(field)"
                >
                  {{ getFieldLabel(field) }} ×
                </span>
                <span
                    v-for="authorId in selectedAuthors"
                    :key="`author-${authorId}`"
                    class="active-tag"
                    @click="removeAuthorFilter(authorId)"
                >
                  {{ getAuthorName(authorId) }} ×
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧搜索结果 -->
        <div class="search-results">
          <!-- 结果头部 -->
          <div class="results-header">
            <div class="results-title">
              <h2>搜索结果</h2>
              <span class="results-count">{{ showingResultsCount }} 条结果</span>
            </div>

            <!-- 结果排序选项 -->
            <div class="results-sort">
              <span class="sort-label">排序:</span>
              <select v-model="sortBy" @change="updateFilters" class="sort-select">
                <option
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="view-toggle">
                <button
                    class="view-btn"
                    :class="{ active: viewMode === 'list' }"
                    @click="viewMode = 'list'"
                    title="列表视图"
                >
                  ☰
                </button>
                <button
                    class="view-btn"
                    :class="{ active: viewMode === 'grid' }"
                    @click="viewMode = 'grid'"
                    title="网格视图"
                >
                  ⬛
                </button>
              </div>
            </div>
          </div>

          <!-- 搜索结果内容 -->
          <div class="results-container" :class="`view-${viewMode}`">
            <div v-if="loading" class="loading-indicator">
              <div class="spinner"></div>
              <p>正在搜索中...</p>
            </div>

            <div v-else-if="filteredResults.length === 0" class="no-results">
              <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>未找到相关结果</h3>
                <p>尝试调整筛选条件或使用不同的关键词</p>
                <button class="clear-filters-btn-large" @click="clearAllFilters">
                  清除所有筛选条件
                </button>
              </div>
            </div>

            <div v-else>
              <!-- 列表视图 -->
              <div v-if="viewMode === 'list'" class="results-list">
                <div
                    v-for="result in paginatedResults"
                    :key="result.id"
                    class="result-item list-item"
                >
                  <div class="result-type-badge" :class="result.type">
                    {{ getTypeLabel(result.type) }}
                  </div>

                  <div class="result-content">
                    <h3 class="result-title">
                      <router-link :to="`/${result.type}/${result.id}`">
                        {{ result.title }}
                      </router-link>
                    </h3>

                    <div class="result-meta">
                      <span class="meta-item">
                        <img :src="result.author.avatar" class="meta-avatar"  alt="作者头像"/>
                        {{ result.author.name }}
                      </span>
                      <span class="meta-item">
                        📅 {{ result.date }}
                      </span>
                      <span v-if="result.journal" class="meta-item">
                        📚 {{ result.journal }}
                      </span>
                    </div>

                    <p class="result-excerpt">
                      {{ result.excerpt }}
                    </p>

                    <div class="result-footer">
                      <div class="result-tags">
                        <span
                            v-for="tag in result.tags"
                            :key="tag"
                            class="tag"
                            @click="addTagFilter(tag)"
                        >
                          {{ tag }}
                        </span>
                      </div>

                      <div class="result-stats">
                        <span class="stat">
                          <i class="stat-icon">👁️</i> {{ result.views }}
                        </span>
                        <span class="stat">
                          <i class="stat-icon">👍</i> {{ result.likes }}
                        </span>
                        <span class="stat">
                          <i class="stat-icon">💬</i> {{ result.comments }}
                        </span>
                        <span class="stat">
                          <i class="stat-icon">⭐</i> {{ result.stars }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 网格视图 -->
              <div v-else class="results-grid">
                <div
                    v-for="result in paginatedResults"
                    :key="result.id"
                    class="result-item grid-item"
                >
                  <div class="result-header">
                    <span class="result-type-badge" :class="result.type">
                      {{ getTypeLabel(result.type) }}
                    </span>
                    <span class="result-date">{{ result.date }}</span>
                  </div>

                  <h3 class="result-title">
                    <router-link :to="`/${result.type}/${result.id}`">
                      {{ result.title }}
                    </router-link>
                  </h3>

                  <div class="result-author">
                    <img :src="result.author.avatar" class="author-avatar"  alt="作者头像"/>
                    <span class="author-name">{{ result.author.name }}</span>
                  </div>

                  <p class="result-excerpt">
                    {{ result.excerpt }}
                  </p>

                  <div class="result-tags">
                    <span
                        v-for="tag in result.tags"
                        :key="tag"
                        class="tag"
                        @click="addTagFilter(tag)"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <div class="result-footer">
                    <div class="result-stats">
                      <span class="stat">
                        <i class="stat-icon">👁️</i> {{ result.views }}
                      </span>
                      <span class="stat">
                        <i class="stat-icon">👍</i> {{ result.likes }}
                      </span>
                    </div>

                    <button class="save-btn" @click="saveResult(result.id)">
                      ⭐
                    </button>
                  </div>
                </div>
              </div>

              <!-- 分页控件 -->
              <div class="pagination" v-if="totalPages > 1">
                <button
                    class="page-btn"
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                >
                  ← 上一页
                </button>

                <div class="page-numbers">
                  <button
                      v-for="page in visiblePages"
                      :key="page"
                      class="page-number"
                      :class="{ active: currentPage === page }"
                      @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>

                  <span v-if="showEllipsis" class="page-ellipsis">...</span>
                </div>

                <button
                    class="page-btn"
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                >
                  下一页 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 搜索查询
const searchQuery = ref('');
const currentKeyword = ref('');

// 筛选条件
const selectedTypes = ref(['paper', 'project']);
const publishPeriod = ref('all');
const selectedFields = ref([]);
const sortBy = ref('relevance');
const selectedAuthors = ref([]);
const authorSearch = ref('');

// 视图设置
const viewMode = ref('list');
const loading = ref(false);
const currentPage = ref(1);
const pageSize = 10;

// 模拟数据
const contentTypes = ref([
  { label: '论文', value: 'paper', count: 156 },
  { label: '项目', value: 'project', count: 89 },
  { label: '专利', value: 'patent', count: 34 },
  { label: '数据', value: 'dataset', count: 67 }
]);

const publishPeriods = ref([
  { label: '全部时间', value: 'all' },
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' },
  { label: '最近一年', value: 'year' },
  { label: '最近三年', value: 'three_years' }
]);

const subjectFields = ref([
  { label: '人工智能', value: 'ai', count: 78 },
  { label: '计算机科学', value: 'cs', count: 123 },
  { label: '数据科学', value: 'data_science', count: 56 },
  { label: '机器学习', value: 'ml', count: 89 },
  { label: '深度学习', value: 'dl', count: 67 },
  { label: '自然语言处理', value: 'nlp', count: 45 },
  { label: '计算机视觉', value: 'cv', count: 52 },
  { label: '区块链', value: 'blockchain', count: 34 }
]);

const sortOptions = ref([
  { label: '相关度', value: 'relevance' },
  { label: '最新发表', value: 'newest' },
  { label: '最多引用', value: 'citations' },
  { label: '最多浏览', value: 'views' },
  { label: '最多点赞', value: 'likes' }
]);

// 模拟作者数据
const allAuthors = ref([
  { id: 1, name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三' },
  { id: 2, name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四' },
  { id: 3, name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五' },
  { id: 4, name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六' },
  { id: 5, name: '孙七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=孙七' }
]);

// 模拟搜索结果数据
const allResults = ref([
  {
    id: 1,
    type: 'paper',
    title: '基于深度学习的图像识别技术研究与应用',
    excerpt: '本文系统研究了基于深度学习的图像识别技术，提出了改进的卷积神经网络结构...',
    author: { id: 1, name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三' },
    date: '2023-10-15',
    journal: '计算机学报',
    fields: ['ai', 'dl', 'cv'],
    tags: ['深度学习', '图像识别', '卷积神经网络'],
    views: 2450,
    likes: 156,
    comments: 42,
    stars: 89,
    citations: 123
  },
  {
    id: 2,
    type: 'project',
    title: 'DeepLearning-For-All: 深度学习教学项目',
    excerpt: '一个面向初学者的深度学习教程项目，包含从基础到实践的完整代码示例...',
    author: { id: 2, name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四' },
    date: '2023-11-20',
    fields: ['ai', 'ml', 'dl'],
    tags: ['深度学习', '教程', 'Python', 'PyTorch'],
    views: 1876,
    likes: 98,
    comments: 31,
    stars: 2456,
    citations: 0
  },
  {
    id: 3,
    type: 'paper',
    title: '联邦学习中的隐私保护机制研究',
    excerpt: '本文针对联邦学习中的数据隐私问题，提出了一种基于差分隐私的梯度保护机制...',
    author: { id: 3, name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五' },
    date: '2023-09-28',
    journal: '计算机研究与发展',
    fields: ['ai', 'ml'],
    tags: ['联邦学习', '隐私保护', '差分隐私'],
    views: 2156,
    likes: 142,
    comments: 28,
    stars: 67,
    citations: 89
  },
  {
    id: 4,
    type: 'dataset',
    title: '中文自然语言处理语料库',
    excerpt: '大规模中文文本数据集，包含新闻、小说、论坛等多种类型的文本数据...',
    author: { id: 4, name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六' },
    date: '2023-08-10',
    fields: ['nlp'],
    tags: ['自然语言处理', '中文', '语料库', '数据集'],
    views: 3245,
    likes: 187,
    comments: 56,
    stars: 456,
    citations: 0
  },
  {
    id: 5,
    type: 'paper',
    title: '量子计算在优化问题中的应用探索',
    excerpt: '本文研究了量子计算在解决复杂优化问题中的潜力，提出了基于量子退火的优化算法...',
    author: { id: 5, name: '孙七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=孙七' },
    date: '2023-07-15',
    journal: '科学通报',
    fields: ['cs'],
    tags: ['量子计算', '优化算法', '量子退火'],
    views: 1567,
    likes: 89,
    comments: 23,
    stars: 45,
    citations: 67
  }
]);

// 计算属性
const filteredAuthors = computed(() => {
  if (!authorSearch.value.toString().trim()) return allAuthors.value;

  const searchTerm = authorSearch.value.toString().toLowerCase().trim();
  return allAuthors.value.filter(author =>
      author.name.toLowerCase().includes(searchTerm)
  );
});

const hasActiveFilters = computed(() => {
  return (
      selectedTypes.value.length < contentTypes.value.length ||
      publishPeriod.value !== 'all' ||
      selectedFields.value.length > 0 ||
      selectedAuthors.value.length > 0
  );
});

const filteredResults = computed(() => {
  let results = [...allResults.value];

  // 按类型筛选
  if (selectedTypes.value.length > 0) {
    results = results.filter(result => selectedTypes.value.includes(result.type));
  }

  // 按领域筛选
  if (selectedFields.value.length > 0) {
    results = results.filter(result =>
        result.fields.some(field => selectedFields.value.includes(field))
    );
  }

  // 按作者筛选
  if (selectedAuthors.value.length > 0) {
    results = results.filter(result =>
        selectedAuthors.value.includes(result.author.id)
    );
  }

  // 按时间筛选（模拟）
  if (publishPeriod.value !== 'all') {
    const now = new Date();
    let cutoffDate = new Date();

    switch (publishPeriod.value) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'three_years':
        cutoffDate.setFullYear(now.getFullYear() - 3);
        break;
    }

    results = results.filter(result => {
      const resultDate = new Date(result.date);
      return resultDate >= cutoffDate;
    });
  }

  // 排序
  results.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'citations':
        return b.citations - a.citations;
      case 'relevance':
      default:
        return 0; // 模拟相关度排序
    }
  });

  return results;
});

const totalResults = computed(() => filteredResults.value.length);
const showingResultsCount = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = Math.min(start + pageSize, totalResults.value);
  return `${start + 1}-${end}`;
});

const totalPages = computed(() => Math.ceil(totalResults.value / pageSize));

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredResults.value.slice(start, start + pageSize);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const showEllipsis = computed(() => totalPages.value > visiblePages.value.length);

// 搜索时间
const searchTime = ref('0.25');

// 方法
const performSearch = async () => {
  if (!searchQuery.value.toString().trim()) return;

  loading.value = true;
  currentPage.value = 1;
  currentKeyword.value = searchQuery.value;

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 在实际应用中，这里会调用后端搜索API
    // const response = await searchAPI({
    //   q: searchQuery.value,
    //   types: selectedTypes.value,
    //   fields: selectedFields.value,
    //   sortBy: sortBy.value,
    //   page: currentPage.value,
    //   pageSize: pageSize
    // });

    console.log('搜索执行:', searchQuery.value);

    // 模拟随机搜索时间
    searchTime.value = (Math.random() * 0.5 + 0.1).toFixed(2);

  } catch (error) {
    console.error('搜索失败:', error);
  } finally {
    loading.value = false;
  }
};

const updateFilters = () => {
  currentPage.value = 1; // 重置到第一页
  performSearch();
};

const clearAllFilters = () => {
  selectedTypes.value = ['paper', 'project'];
  publishPeriod.value = 'all';
  selectedFields.value = [];
  selectedAuthors.value = [];
  authorSearch.value = '';
  updateFilters();
};

const removeTypeFilter = (type) => {
  selectedTypes.value = selectedTypes.value.filter(t => t !== type);
  updateFilters();
};

const removeFieldFilter = (field) => {
  selectedFields.value = selectedFields.value.filter(f => f !== field);
  updateFilters();
};

const removeAuthorFilter = (authorId) => {
  selectedAuthors.value = selectedAuthors.value.filter(id => id !== authorId);
  updateFilters();
};

const addTagFilter = (tag) => {
  // 可以扩展为根据标签搜索
  searchQuery.value = tag;
  performSearch();
};

const getTypeLabel = (type) => {
  const found = contentTypes.value.find(t => t.value === type);
  return found ? found.label : type;
};

const getPeriodLabel = (period) => {
  const found = publishPeriods.value.find(p => p.value === period);
  return found ? found.label : period;
};

const getFieldLabel = (field) => {
  const found = subjectFields.value.find(f => f.value === field);
  return found ? found.label : field;
};

const getAuthorName = (authorId) => {
  const found = allAuthors.value.find(a => a.id === authorId);
  return found ? found.name : `作者${authorId}`;
};

const searchAuthors = () => {
  // 在实际应用中，这里可以调用作者搜索API
  console.log('搜索作者:', authorSearch.value);
};

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  // 在实际应用中，这里可以调用API获取指定页的数据
};

const saveResult = (resultId) => {
  console.log('收藏结果:', resultId);
  // 在实际应用中，这里会调用收藏API
};

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.q) {
    searchQuery.value = newQuery.q;
    performSearch();
  }
});

// 初始化
onMounted(() => {
  // 从路由参数获取搜索词
  if (route.query.q) {
    searchQuery.value = route.query.q;
    performSearch();
  }

  // 监听滚动，更新筛选栏位置（如果需要）
  nextTick(() => {
    window.addEventListener('scroll', handleScroll);
  });
});

const handleScroll = () => {
  // 可以在这里添加滚动时更新筛选栏的逻辑
  // 例如：当筛选栏滚动到顶部时固定等
};

// 清理
import { onUnmounted } from 'vue';
import Navigation from "@/views/components/Navigation.vue";
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 搜索条样式 */
.search-bar-section {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-bar-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-input-group {
  display: flex;
  max-width: 800px;
  margin: 0 auto 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  font-size: 16px;
  border: none;
  outline: none;
  background: white;
}

.search-btn {
  padding: 0 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.search-btn:hover {
  opacity: 0.9;
}

.search-icon {
  font-size: 18px;
}

.search-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 14px;
  color: #666;
}

.stat-item strong {
  color: #1890ff;
  font-weight: 600;
}

/* 主要内容区域 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 30px;
  min-height: calc(100vh - 200px);
}

/* 左侧筛选栏 */
.sidebar-filter {
  flex: 0 0 280px;
}

.filter-sticky-wrapper {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 10px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8e8e8;
}

.filter-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-filters-btn:hover:not(:disabled) {
  background: #fff2f0;
}

.clear-filters-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.filter-section {
  margin-bottom: 25px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.filter-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section-title::before {
  content: '▸';
  color: #1890ff;
  font-size: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.filter-option:hover {
  background: #f5f5f5;
}

.filter-option.active {
  background: #e6f7ff;
  color: #1890ff;
}

.filter-option input[type="checkbox"],
.filter-option input[type="radio"] {
  cursor: pointer;
}

.option-label {
  flex: 1;
  font-size: 14px;
}

.option-count {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.filter-option.active .option-count {
  background: #1890ff;
  color: white;
}

/* 作者搜索 */
.filter-author-search {
  margin-bottom: 10px;
}

.author-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.author-search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.author-list {
  max-height: 200px;
  overflow-y: auto;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 13px;
}

/* 活跃筛选器 */
.active-filters {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.active-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #91d5ff;
}

.active-tag:hover {
  background: #bae7ff;
}

.active-tag::after {
  content: '×';
  font-size: 14px;
  margin-left: 2px;
}

/* 右侧结果区域 */
.search-results {
  flex: 1;
  min-width: 0; /* 防止flex item溢出 */
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8e8e8;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.results-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.results-title h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.results-count {
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 20px;
}

.results-sort {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-label {
  font-size: 14px;
  color: #666;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  outline: none;
}

.sort-select:focus {
  border-color: #1890ff;
}

.view-toggle {
  display: flex;
  gap: 5px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 6px;
}

.view-btn {
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #e8e8e8;
}

.view-btn.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 无结果状态 */
.no-results {
  background: white;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
}

.clear-filters-btn-large {
  padding: 12px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.clear-filters-btn-large:hover {
  background: #40a9ff;
}

/* 结果列表样式 */
.results-container {
  background: transparent;
}

.results-list, .results-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.result-item {
  background: white;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 列表视图 */
.list-item {
  display: flex;
  padding: 20px;
}

.result-type-badge {
  flex: 0 0 auto;
  margin-right: 20px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  align-self: flex-start;
}

.result-type-badge.paper {
  background: #e6f7ff;
  color: #1890ff;
}

.result-type-badge.project {
  background: #f6ffed;
  color: #52c41a;
}

.result-type-badge.dataset {
  background: #fff7e6;
  color: #fa8c16;
}

.result-type-badge.patent {
  background: #f9f0ff;
  color: #722ed1;
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.result-title a {
  color: inherit;
  text-decoration: none;
}

.result-title a:hover {
  color: #1890ff;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.result-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background: #e8e8e8;
}

.result-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.stat-icon {
  font-size: 14px;
}

/* 网格视图 */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.grid-item .result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.grid-item .result-date {
  font-size: 12px;
  color: #999;
}

.grid-item .result-title {
  font-size: 16px;
  margin-bottom: 10px;
  flex: 1;
}

.grid-item .result-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.grid-item .result-excerpt {
  font-size: 13px;
  margin-bottom: 15px;
  -webkit-line-clamp: 3;
}

.grid-item .result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.save-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #d9d9d9;
  transition: all 0.2s;
  padding: 4px;
}

.save-btn:hover {
  color: #faad14;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.page-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #e8e8e8;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-number:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.page-number.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-ellipsis {
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar-filter {
    flex: none;
    width: 100%;
  }

  .filter-sticky-wrapper {
    position: static;
    max-height: none;
  }

  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .search-bar-wrapper {
    padding: 0 15px;
  }

  .main-content {
    padding: 15px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .results-sort {
    width: 100%;
    justify-content: space-between;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .list-item {
    flex-direction: column;
  }

  .result-type-badge {
    align-self: flex-start;
    margin-bottom: 15px;
  }
}
</style>