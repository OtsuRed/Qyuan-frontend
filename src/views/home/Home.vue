<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <Navigation />

    <!-- 主页内容 -->
    <main class="home-container">
      <!-- 搜索与标题 -->
      <section class="search-section">
        <div class="search-wrapper">
          <!-- 标题Logo -->
          <div class="logo-section">
            <h1 class="main-logo">
              <!-- 这里可以用图片替换 -->
              <span class="logo-text">千源万码</span>
              <span class="logo-subtitle">学术成果分享平台</span>
            </h1>
            <p class="logo-desc">发现、分享、交流学术成果</p>
          </div>

          <!-- 搜索框 -->
          <div class="search-box-container">
            <div class="search-box">
              <div class="search-input-wrapper">
                <input
                    v-model="searchQuery"
                    type="text"
                    class="search-input"
                    placeholder="搜索论文、项目、作者..."
                    @keyup.enter="handleSearch"
                />
                <div class="search-icon" @click="handleSearch">
                  🔍
                </div>
              </div>
              <div class="search-options">
                <div class="search-filters">
                  <div class="filter-tabs">
                    <button
                        v-for="filter in searchFilters"
                        :key="filter.value"
                        class="filter-tab"
                        :class="{ active: activeFilter === filter.value }"
                        @click="setActiveFilter(filter.value)"
                    >
                      {{ filter.label }}
                    </button>
                  </div>
                  <div class="advanced-search">
                    <button class="advanced-btn" @click="showAdvancedSearch">
                      高级搜索
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 热门搜索词 -->
            <div class="hot-search">
              <span class="hot-label">热门搜索：</span>
              <div class="hot-tags">
                <span
                    v-for="tag in hotSearchTags"
                    :key="tag"
                    class="hot-tag"
                    @click="searchByTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 推荐内容 -->
      <section class="recommendations-section">
        <!-- 分类筛选 -->
        <div class="category-tabs">
          <div class="tabs-container">
            <button
                v-for="category in categories"
                :key="category.id"
                class="category-tab"
                :class="{ active: activeCategory === category.id }"
                @click="changeCategory(category.id)"
            >
              {{ category.name }}
              <span class="category-count">{{ category.count }}</span>
            </button>
          </div>
        </div>

        <!-- 推荐内容网格 -->
        <div class="recommendations-grid">
          <!-- 论文推荐 -->
          <div class="recommendation-column">
            <div class="section-header">
              <h3 class="section-title">
                <span class="title-icon">📄</span>
                热门论文
              </h3>
              <router-link to="/papers" class="view-all">
                查看全部
              </router-link>
            </div>
            <div class="content-list">
              <div
                  v-for="paper in recommendedPapers"
                  :key="paper.id"
                  class="content-card paper-card"
              >
                <div class="content-header">
                  <span class="content-type">论文</span>
                  <span class="content-source">{{ paper.journal }}</span>
                </div>
                <h4 class="content-title">{{ paper.title }}</h4>
                <p class="content-abstract">
                  {{ paper.abstract }}
                </p>
                <div class="content-meta">
                  <div class="meta-left">
                    <span class="author">
                      <img :src="paper.authorAvatar" class="author-avatar"  alt="作者头像"/>
                      {{ paper.author }}
                    </span>
                    <span class="date">{{ paper.date }}</span>
                  </div>
                  <div class="meta-right">
                    <span class="stat">
                      <i class="stat-icon">👁️</i> {{ paper.views }}
                    </span>
                    <span class="stat">
                      <i class="stat-icon">👍</i> {{ paper.likes }}
                    </span>
                  </div>
                </div>
                <div class="content-tags">
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
          </div>

          <!-- 项目推荐 -->
          <div class="recommendation-column">
            <div class="section-header">
              <h3 class="section-title">
                <span class="title-icon">💻</span>
                热门项目
              </h3>
              <router-link to="/projects" class="view-all">
                查看全部
              </router-link>
            </div>
            <div class="content-list">
              <div
                  v-for="project in recommendedProjects"
                  :key="project.id"
                  class="content-card project-card"
              >
                <div class="content-header">
                  <span class="content-type">项目</span>
                  <span class="content-language">{{ project.language }}</span>
                </div>
                <h4 class="content-title">{{ project.name }}</h4>
                <p class="content-description">
                  {{ project.description }}
                </p>
                <div class="content-meta">
                  <div class="meta-left">
                    <span class="author">
                      <img :src="project.authorAvatar" class="author-avatar"  alt="作者头像"/>
                      {{ project.author }}
                    </span>
                    <span class="stars">
                      <i class="star-icon">⭐</i> {{ project.stars }}
                    </span>
                  </div>
                  <div class="meta-right">
                    <span class="stat">
                      <i class="stat-icon">📊</i> {{ project.forks }}
                    </span>
                  </div>
                </div>
                <div class="content-tags">
                  <span
                      v-for="tag in project.tags"
                      :key="tag"
                      class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 作者推荐 -->
          <div class="recommendation-column">
            <div class="section-header">
              <h3 class="section-title">
                <span class="title-icon">👨‍🔬</span>
                热门作者
              </h3>
              <router-link to="/authors" class="view-all">
                查看全部
              </router-link>
            </div>
            <div class="content-list">
              <div
                  v-for="author in recommendedAuthors"
                  :key="author.id"
                  class="content-card author-card"
              >
                <div class="author-info">
                  <img :src="author.avatar" class="author-avatar-large"  alt="作者头像"/>
                  <div class="author-details">
                    <h4 class="author-name">{{ author.name }}</h4>
                    <p class="author-title">{{ author.title }}</p>
                    <p class="author-institution">{{ author.institution }}</p>
                  </div>
                </div>
                <div class="author-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ author.papers }}</span>
                    <span class="stat-label">论文</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ author.followers }}</span>
                    <span class="stat-label">关注者</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ author.citations }}</span>
                    <span class="stat-label">引用</span>
                  </div>
                </div>
                <div class="author-expertise">
                  <span class="expertise-label">研究领域：</span>
                  <div class="expertise-tags">
                    <span
                        v-for="field in author.fields"
                        :key="field"
                        class="expertise-tag"
                    >
                      {{ field }}
                    </span>
                  </div>
                </div>
                <button class="follow-btn">
                  {{ author.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more-section">
          <button
              class="load-more-btn"
              @click="loadMore"
              :disabled="isLoading"
          >
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </section>

      <!-- 高级搜索模态框 -->
      <!-- 见 temp -->
    </main>

    <!-- 底部信息 -->
    <Foot />
  </div>
</template>

<script setup>
// 导入样式表
import '@/views/home/Home.styles.css';
// 导入模拟数据
import {
  categories,
  searchFilters,
  hotSearchTags,
  recommendedProjects,
  recommendedAuthors,
  recommendedPapers
} from "@/views/home/mockData.js";
// 导入其他模块
import {ref, onMounted, watch, computed} from 'vue';
import { useRouter } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";
import Foot from "@/views/components/Foot.vue";

const router = useRouter();

// 搜索相关数据
const searchQuery = ref('');
const activeFilter = ref('all');
const showAdvancedSearchModal = ref(false);
const isLoading = ref(false);

// 高级搜索表单数据
const advancedSearch = ref({
  title: '',
  author: '',
  keywords: '',
  startDate: '',
  endDate: '',
  types: ['paper', 'project']
});

// 分类相关
const activeCategory = ref('all');

const isSearchQueryEmpty = computed(() => {
  return !searchQuery.value.toString().trim();
})

// 搜索框搜索
const handleSearch = async () => {
  if (isSearchQueryEmpty.value) {
    alert('请输入搜索关键词！');
    return;
  }

  isLoading.value = true;

  try {
    // 构建搜索参数
    const searchParams = {
      q: searchQuery.value.toString().trim(),
      filter: activeFilter.value,
      page: 1,
      pageSize: 20
    };
    // 跳转到搜索页面
    router.push({
      path: '/search',
      query: searchParams
    });
  } catch (error) {
    console.error('搜索失败:', error);
    alert('搜索失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 标签搜索
const searchByTag = (tag) => {
  searchQuery.value = tag;
  activeFilter.value = 'all';
  router.push({
    path: '/search',
    query: {
      q: tag,
      filter: 'all',
      page: 1,
      pageSize: 20
    }
  });
};

// 设置筛选器
const setActiveFilter = (filter) => {
  activeFilter.value = filter;
  if (searchQuery.value.toString().trim()) {
    router.push({
      path: '/search',
      query: {
        q: searchQuery.value,
        filter: filter,
        page: 1
      }
    });
  }
};

// 高级搜索
const showAdvancedSearch = () => {
  showAdvancedSearchModal.value = true;
};

const closeAdvancedSearch = () => {
  showAdvancedSearchModal.value = false;
};

const performAdvancedSearch = () => {
  console.log('高级搜索参数:', advancedSearch.value);
  closeAdvancedSearch();

  // 执行高级搜索
  router.push({
    path: '/search',
    query: {
      ...advancedSearch.value,
      advanced: true
    }
  });
};

const changeCategory = (categoryId) => {
  activeCategory.value = categoryId;
  console.log('切换分类:', categoryId);

  // 模拟加载分类内容
  // loadCategoryContent(categoryId);
};

const loadMore = async () => {
  isLoading.value = true;
  console.log('加载更多内容...');

  try {
    // 模拟加载更多数据
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 实际应调用API加载更多数据
    // const moreData = await fetchMoreData();
    // recommendedPapers.value.push(...moreData.papers);
    // recommendedProjects.value.push(...moreData.projects);
    // recommendedAuthors.value.push(...moreData.authors);

    console.log('加载完成');
  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 监听分类变化
watch(activeCategory, (newCategory) => {
  console.log('分类变化，重新加载数据:', newCategory);
  // 这里可以调用API重新加载对应分类的数据
});

// 初始化加载推荐数据
onMounted(async () => {
  console.log('主页加载，获取推荐数据');

  // 模拟API调用获取推荐数据
  // try {
  //   const recommendations = await fetchRecommendations();
  //   // 更新数据
  // } catch (error) {
  //   console.error('获取推荐数据失败:', error);
  // }
});

</script>
