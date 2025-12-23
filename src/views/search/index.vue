<template>
  <Navigation></Navigation>
  <div class="search-container">
   <Search></Search>
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
const selectedTypes = ref('');
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
const allResults = ref([]);

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

const handleScroll = () => {
  // 可以在这里添加滚动时更新筛选栏的逻辑
  // 例如：当筛选栏滚动到顶部时固定等
};

// 清理
import { onUnmounted } from 'vue';
import {paperSearch} from "@/api/search.js";
import {formatDay, formatTime} from "../../utils/time.js";
import {formatDate} from "@vueuse/shared";
import {category} from "@/utils/storage.js";
import {usePaperStore} from "@/stores/paperStore.js";
import Navigation from "@/views/components/Navigation.vue";
import Search from "@/views/search/Search.vue";
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import './Search.styles.css';
</style>