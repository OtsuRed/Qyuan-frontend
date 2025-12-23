<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <Navigation />

    <!-- 主页内容 -->
    <main class="home-container">
      <!-- 搜索区域 -->
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
                    placeholder="搜索论文、专利、期刊..."
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
                </div>
                <div>
                  <button class="ai-filter-tab" @click="showAdvancedSearch">
                    AI增强搜索
                  </button>
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

      <!-- 推荐区域 -->
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
      <div v-if="showAdvancedSearchModal" class="modal-overlay" @click="closeAdvancedSearch">
        <div class="modal-content advanced-search-modal" @click.stop>
          <div class="modal-header">
            <h3>高级搜索</h3>
            <button @click="closeAdvancedSearch" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="advanced-search-form">
              <div class="form-group">
                <label for="title">标题包含</label>
                <input
                    id="title"
                    v-model="advancedSearch.title"
                    type="text"
                    placeholder="论文或项目标题"
                />
              </div>
              <div class="form-group">
                <label for="author">作者</label>
                <input
                    id="author"
                    v-model="advancedSearch.author"
                    type="text"
                    placeholder="作者姓名"
                />
              </div>
              <div class="form-group">
                <label for="keywords">关键词</label>
                <input
                    id="keywords"
                    v-model="advancedSearch.keywords"
                    type="text"
                    placeholder="多个关键词用逗号分隔"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="startDate">开始日期</label>
                  <input
                      id="startDate"
                      v-model="advancedSearch.startDate"
                      type="date"
                  />
                </div>
                <div class="form-group">
                  <label for="endDate">结束日期</label>
                  <input
                      id="endDate"
                      v-model="advancedSearch.endDate"
                      type="date"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>文献类型</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input v-model="advancedSearch.types" type="checkbox" value="paper" />
                    论文
                  </label>
                  <label class="checkbox-label">
                    <input v-model="advancedSearch.types" type="checkbox" value="project" />
                    项目
                  </label>
                  <label class="checkbox-label">
                    <input v-model="advancedSearch.types" type="checkbox" value="patent" />
                    专利
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" @click="closeAdvancedSearch">取消</button>
            <button class="search-btn" @click="performAdvancedSearch">搜索</button>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>千源万码</h4>
          <p>学术成果分享平台</p>
          <p>让知识流动起来</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <a href="/about">关于我们</a>
          <a href="/help">帮助中心</a>
          <a href="/contact">联系我们</a>
        </div>
        <div class="footer-section">
          <h4>合作伙伴</h4>
          <a href="/partners">高校合作</a>
          <a href="/partners">企业合作</a>
          <a href="/partners">机构合作</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2023 千源万码学术平台. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import '@/views/home/Home.styles.css';
import {ref, onMounted, watch, computed} from 'vue';
import { useRouter } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";

const router = useRouter();

// 搜索相关数据
const searchQuery = ref('');
const activeFilter = ref('paper');
const showAdvancedSearchModal = ref(false);
const isLoading = ref(false);

// 搜索筛选器
const searchFilters = ref([
  { label: '论文', value: 'paper' },
  { label: '专利', value: 'patent' },
  { label: '期刊', value: 'journal' },
]);

// 热门搜索标签
const hotSearchTags = ref([
  '机器学习',
  '深度学习',
  '人工智能',
  '计算机视觉',
  '自然语言处理',
  '区块链',
  '物联网',
  '大数据'
]);

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
const categories = ref([
  { id: 'all', name: '全部', count: 256 },
  { id: 'ai', name: '人工智能', count: 78 },
  { id: 'cs', name: '计算机科学', count: 64 },
  { id: 'math', name: '数学', count: 42 },
  { id: 'physics', name: '物理学', count: 36 },
  { id: 'biology', name: '生物学', count: 28 },
  { id: 'engineering', name: '工程学', count: 45 }
]);

// 模拟数据 - 推荐论文
const recommendedPapers = ref([
  {
    id: 1,
    title: '基于Transformer的视觉语言预训练模型研究',
    abstract: '本文提出了一种新的视觉语言预训练模型，通过跨模态注意力机制实现图像和文本的深度融合...',
    author: '张三',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
    journal: '人工智能学报',
    date: '2023-11-20',
    views: 3245,
    likes: 156,
    tags: ['Transformer', '视觉语言', '预训练模型', '多模态'],
    type: 'paper'
  },
  {
    id: 2,
    title: '联邦学习中的隐私保护机制研究',
    abstract: '本文针对联邦学习中的数据隐私问题，提出了一种基于差分隐私的梯度保护机制...',
    author: '李四',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
    journal: '计算机研究与发展',
    date: '2023-10-15',
    views: 2876,
    likes: 142,
    tags: ['联邦学习', '隐私保护', '差分隐私', '机器学习'],
    type: 'paper'
  },
  {
    id: 3,
    title: '量子计算在优化问题中的应用探索',
    abstract: '本文研究了量子计算在解决复杂优化问题中的潜力，提出了基于量子退火的优化算法...',
    author: '王五',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五',
    journal: '科学通报',
    date: '2023-09-28',
    views: 2156,
    likes: 98,
    tags: ['量子计算', '优化算法', '量子退火', '计算复杂性'],
    type: 'paper'
  }
]);

// 模拟数据 - 推荐项目
const recommendedProjects = ref([
  {
    id: 1,
    name: 'DeepLearning-For-All',
    description: '一个面向初学者的深度学习教程项目，包含从基础到实践的完整代码示例...',
    author: 'AI实验室',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI实验室',
    language: 'Python',
    stars: 2456,
    forks: 589,
    tags: ['深度学习', '教程', 'Python', 'PyTorch'],
    type: 'project'
  },
  {
    id: 2,
    name: 'Blockchain-Security-Framework',
    description: '区块链安全框架，提供智能合约安全审计、漏洞检测等功能...',
    author: '安全研究组',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=安全研究组',
    language: 'Solidity',
    stars: 1876,
    forks: 324,
    tags: ['区块链', '安全', '智能合约', 'Solidity'],
    type: 'project'
  },
  {
    id: 3,
    name: 'Medical-Image-Analysis',
    description: '医学影像分析工具包，支持多种影像格式的处理和分析...',
    author: '医疗AI团队',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=医疗AI团队',
    language: 'Python',
    stars: 1567,
    forks: 287,
    tags: ['医学影像', 'AI诊断', '图像处理', '医疗'],
    type: 'project'
  }
]);

// 模拟数据 - 推荐作者
const recommendedAuthors = ref([
  {
    id: 1,
    name: '张教授',
    title: '教授',
    institution: '清华大学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张教授',
    papers: 45,
    followers: 2345,
    citations: 5678,
    fields: ['人工智能', '机器学习', '计算机视觉'],
    isFollowing: false
  },
  {
    id: 2,
    name: '李研究员',
    title: '高级研究员',
    institution: '中国科学院',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李研究员',
    papers: 32,
    followers: 1876,
    citations: 3456,
    fields: ['数据科学', '大数据', '统计分析'],
    isFollowing: true
  },
  {
    id: 3,
    name: '王博士',
    title: '副教授',
    institution: '北京大学',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王博士',
    papers: 28,
    followers: 1567,
    citations: 2890,
    fields: ['自然语言处理', '知识图谱', '信息检索'],
    isFollowing: false
  }
]);

const isSearchQueryEmpty = computed(() => {
  return !searchQuery.value.toString().trim();
})

// 方法定义
const handleSearch = async () => {
  if (isSearchQueryEmpty.value) {
    console.log('搜索内容不能为空');
    return;
  }

  isLoading.value = true;
  console.log('搜索:', searchQuery.value, '筛选:', activeFilter.value);

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));

    // 实际应调用后端API
    // const response = await searchAPI({
    //   query: searchQuery.value,
    //   filter: activeFilter.value,
    //   page: 1,
    //   pageSize: 20
    // });
    const mockResponse = {
      data: [
        { id: 1, title: `搜索结果: ${searchQuery.value}` },
        { id: 2, title: `相关: ${searchQuery.value}` }
      ],
      total: 100
    };

    console.log('模拟API响应:', mockResponse);

    // 跳转到搜索结果页
    router.push({
      path: '/search',
      query: {
        q: searchQuery.value,
        filter: activeFilter.value
      }
    });
  } catch (error) {
    console.error('搜索失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const setActiveFilter = (filter) => {
  activeFilter.value = filter;
};

const searchByTag = (tag) => {
  searchQuery.value = tag;
  handleSearch();
};

const showAdvancedSearch = () => {

  router.push('/aisearch')
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


