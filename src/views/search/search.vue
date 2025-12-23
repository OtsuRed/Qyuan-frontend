<template>
  <div class="search-page">
    <!-- 顶部导航栏 -->
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
            <div v-if="hasActiveFilters" class="active-filters">
              <h4 class="filter-section-title">活跃筛选</h4>
              <div class="active-tags">
                <span
                    v-if="selectedTypes"
                    class="active-tag"
                    @click="removeTypeFilter(selectedTypes)"
                >
                  {{ getTypeLabel(selectedTypes) }}
                </span>
                <span
                    v-if="startYear !== 2000 || endYear !== 2026"
                    class="active-tag"
                    @click="startYear = 2000; endYear = 2026; updateFilters()"
                >
                  {{ startYear }}-{{ endYear }}
                </span>
                <span
                    v-for="field in selectedFields"
                    :key="`field-${field}`"
                    class="active-tag"
                    @click="removeFieldFilter(field)"
                >
                  {{ getFieldLabel(field) }}
                </span>
                <span
                    v-if="highViewsOnly"
                    class="active-tag"
                    @click="highViewsOnly = false; updateFilters()"
                >
                  高观看
                </span>
                <span
                    v-if="highFavoritesOnly"
                    class="active-tag"
                    @click="highFavoritesOnly = false; updateFilters()"
                >
                  高收藏
                </span>
              </div>
            </div>
            <!-- 内容类型筛选 -->
            <div class="filter-section">

              <h4 class="filter-section-title">内容类型</h4>
              <div class="filter-options">
                <label
                    v-for="type in contentTypes"
                    :key="type.value"
                    class="filter-option"
                    :class="{ active: selectedTypes===type.value }"
                >
                  <input
                      type="radio"
                      :value="type.value"
                      v-model="selectedTypes"
                      @change="updateFilters"
                      name="contentTypes"
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
                <div class="date-range-selector">
                  <div class="date-select-wrapper">
                    <label class="date-label">从</label>
                    <select v-model="startYear" @change="updateFilters" class="date-select">
                      <option v-for="year in availableYears" :key="'start-'+year" :value="year">
                        {{ year }}
                      </option>
                    </select>
                  </div>
                  <div class="date-separator">-</div>
                  <div class="date-select-wrapper">
                    <label class="date-label">到</label>
                    <select v-model="endYear" @change="updateFilters" class="date-select">
                      <option v-for="year in availableYears" :key="'end-'+year" :value="year">
                        {{ year }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学科领域筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">学科领域</h4>
              <div class="filter-options">
                <label
                    v-for="field in subjectFields"
                    :key="field.id"
                    class="filter-option"
                    :class="{ active: selectedFields.includes(field.id) }"
                >
                  <input
                      type="checkbox"
                      :value="field.id"
                      v-model="selectedFields"
                      @change="updateFilters"
                  />
                  <span class="option-label">{{ field.name }}</span>
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

            <!-- 高观看筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">观看次数</h4>
              <div class="filter-options">
                <label class="filter-option" :class="{ active: highViewsOnly }">
                  <input
                      type="checkbox"
                      v-model="highViewsOnly"
                      @change="updateFilters"
                  />
                  <span class="option-label">只展示高观看</span>
                </label>
              </div>
            </div>

            <!-- 高收藏筛选 -->
            <div class="filter-section">
              <h4 class="filter-section-title">收藏数量</h4>
              <div class="filter-options">
                <label class="filter-option" :class="{ active: highFavoritesOnly }">
                  <input
                      type="checkbox"
                      v-model="highFavoritesOnly"
                      @change="updateFilters"
                  />
                  <span class="option-label">只展示高收藏</span>
                </label>
              </div>
            </div>

            <!-- 活跃筛选器 -->

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

            <div v-else-if="allResults.length === 0" class="no-results">
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
                    v-for="result in allResults"
                    :key="result.paper_id"
                    class="result-item list-item"
                >
                  <div class="result-type-badge" :class="selectedTypes">
                    {{ selectedTypes }}
                  </div>

                  <div class="result-content">
                    <h3 class="result-title">
                      <router-link
                          :to="`/readpaper/${selectedTypes}?paper_id=${result.paper_id}`"
                      >
                        {{ result.title }}
                      </router-link>
                    </h3>

                    <div class="result-meta">
                      <span class="meta-item">
                        📅 {{ formatDay(result.updated) }}
                      </span>
                      <span v-if="result.journal_source!=='N/A'" class="meta-item">
                        📚 {{ result.journal_source }}
                      </span>
                    </div>

                    <p class="result-excerpt">
                      {{ result.abstract }}
                    </p>
                    <div class="result-excerpt">
                       {{result.submitter}} 等
                        <div v-if="result.doi!=='N/A'" class="result-doi">
                          doi:  {{result.doi}}
                        </div>
                    </div>

                    <div class="result-footer">
                      <div class="result-stats">

                        <span class="stat">
                          <i class="stat-icon">👁️</i> {{ result.read_count }}
                        </span>
                        <span class="stat">
                          <i class="stat-icon">⭐</i> {{ result.favoriate_count }}
                        </span>
                        <span class="tag">
                              {{ subjectFields[result.category_id].name}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 网格视图 -->
              <div v-else class="results-grid">
                <div
                    v-for="result in allResults"
                    :key="result.id"
                    class="result-item grid-item"
                >
                  <div class="result-header">
                    <span class="result-type-badge" :class="selectedTypes">
                         {{ selectedTypes }}
                    </span>
                    <span class="result-date">{{ result.date }}</span>
                  </div>

                  <h3 class="result-title">
                    <router-link :to="`/${result.type}/${result.id}`">
                      {{ result.title }}
                    </router-link>
                  </h3>


                  <p class="result-excerpt">
                    {{ result.abstract }}
                  </p>
                  <div class="result-meta">
                      <span class="meta-item">
                        📅 {{ formatDay(result.updated) }}
                      </span>
                  </div>
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
                        <i class="stat-icon">👁️</i> {{ result.read_count }}
                      </span>
                      <span class="stat">
                        <i class="stat-icon">⭐</i> {{ result.favoriate_count }}
                      </span>
                    </div>
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
import '@/views/search/Search.styles.css';
const route = useRoute();
const router = useRouter();

// 搜索查询
const searchQuery = ref('');
const currentKeyword = ref('');

// 筛选条件
const selectedTypes = ref('');
selectedTypes.value = 'paper';
const startYear = ref(2000);
const endYear = ref(2026);
const selectedFields = ref([]);
const sortBy = ref('');
const selectedAuthors = ref([]);
const authorSearch = ref('');
const highViewsOnly = ref(false);
const highFavoritesOnly = ref(false);

// 视图设置
const viewMode = ref('list');
const loading = ref(false);
const currentPage = ref(1);
const pageSize = 10;

// 模拟数据
const contentTypes = ref([
  { label: '论文', value: 'paper', count: 0 },
  { label: '专利', value: 'patent', count: 0 },
  { label: '期刊', value: 'journal', count: 0 },
]);

const subjectFields = ref(category);

const sortOptions = ref([
  { label: '最新发表', value: '' },
  { label: '最多浏览', value: 'read_count' },
  { label: '最多收藏', value: 'favoriate_count' }
]);


// 模拟搜索结果数据
const allResults = ref([
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
      selectedTypes.value !== '' ||
      startYear.value !== 2000 ||
      endYear.value !== 2026 ||
      selectedFields.value.length > 0 ||
      selectedAuthors.value.length > 0 ||
      highViewsOnly.value ||
      highFavoritesOnly.value
  );
});

const filteredResults = computed(() => {
  let results = [...allResults.value];

  // 按类型筛选
  if (selectedTypes.value) {
    results = results.filter(result => result.type === selectedTypes.value);
  }

  // 按领域筛选
  if (selectedFields.value.length > 0) {
    results = results.filter(result =>
        result.fields.some(field => selectedFields.value.includes(field))
    );
  }

  // 按时间范围筛选
  results = results.filter(result => {
    const resultYear = new Date(result.date).getFullYear();
    return resultYear >= startYear.value && resultYear <= endYear.value;
  });

  // 高观看筛选
  if (highViewsOnly.value) {
    const viewThreshold = 1000; // 设定高观看的阈值
    results = results.filter(result => result.views >= viewThreshold);
  }

  // 高收藏筛选
  if (highFavoritesOnly.value) {
    const favoriteThreshold = 100; // 设定高收藏的阈值
    results = results.filter(result => result.stars >= favoriteThreshold);
  }

  // 排序

  return results;
});

const totalResults = ref(0);
const showingResultsCount = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = Math.min(start + pageSize, totalResults.value);
  return `${start + 1}-${end}`;
});

const totalPages = computed(() => Math.ceil(totalResults.value / pageSize));

const availableYears = computed(() => {
  const years = [];
  for (let year = 2026; year >= 2000; year--) {
    years.push(year);
  }
  return years;
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
  currentKeyword.value = searchQuery.value;


  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('category'+selectedFields.value)
    console.log('类型'+selectedTypes.value)

    let params={
      page: currentPage.value,
      size: pageSize,
      keyword: searchQuery.value,
      // startYear: startYear.value,
      // endYear: endYear.value,
    }

    if(highViewsOnly.value){
      params.minReadCount=10
    }
    if(highFavoritesOnly.value){
      params.minFavoriteCount=10
    }
    if(sortBy.value!==''){
      params.sortField=sortBy.value
    }

    await paperSearch(params,selectedFields.value).then(response => {
      console.log('搜索结果:', response)
       totalResults.value =response.data.total
       allResults.value =[]
       response.data.papers.forEach(paper => {
        allResults.value.push(paper)
      })
      contentTypes.value = [
        { label: '论文', value: 'paper', count: response.data.total },
        { label: '专利', value: 'patent', count: 0 },
        { label: '期刊', value: 'journal', count: 0 },
      ]
    })

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
  selectedTypes.value = 'paper';
  startYear.value = 2000;
  endYear.value = 2026;
  selectedFields.value = [];
  selectedAuthors.value = [];
  authorSearch.value = '';
  highViewsOnly.value = false;
  highFavoritesOnly.value = false;
  updateFilters();
};

const removeTypeFilter = (type) => {
  selectedTypes.value = '';
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
  const found = subjectFields.value.find(f => f.id == field);
  return found ? found.name : field;
};

const getAuthorName = (authorId) => {
  const found = allAuthors.value.find(a => a.id === authorId);
  return found ? found.name : `作者${authorId}`;
};

const searchAuthors = () => {
  // 在实际应用中，这里可以调用作者搜索API
  console.log('搜索作者:', authorSearch.value);
};

const goToPage = async (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  // 调用搜索函数获取指定页的数据
  await performSearch();
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
    selectedTypes.value = 'paper';
    performSearch();
  }

  // 监听滚动，更新筛选栏位置（如果需要）
  nextTick(() => {
    window.addEventListener('scroll', handleScroll);
  });

});
console.log('初始化:')
const handleScroll = () => {
  // 可以在这里添加滚动时更新筛选栏的逻辑
  // 例如：当筛选栏滚动到顶部时固定等
};

// 清理
import { onUnmounted } from 'vue';
import Navigation from "@/views/components/Navigation.vue";
import {paperSearch} from "@/api/search.js";
import {formatDay, formatTime} from "../../utils/time.js";
import {formatDate} from "@vueuse/shared";
import {category} from "@/utils/storage.js";
import {usePaperStore} from "@/stores/paperStore.js";
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
<style>
.date-range-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.date-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-label {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
  font-weight: 500;
}

.date-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 14px;
  min-width: 100px;
  cursor: pointer;
}

.date-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.date-separator {
  font-size: 16px;
  color: var(--text-secondary);
  align-self: center;
  margin: 0 4px;
}

</style>