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
import {ref, onMounted, watch, computed} from 'vue';
import { useRouter } from 'vue-router';
import Navigation from "@/views/components/Navigation.vue";

const router = useRouter();

// 搜索相关数据
const searchQuery = ref('');
const activeFilter = ref('all');
const showAdvancedSearchModal = ref(false);
const isLoading = ref(false);

// 搜索筛选器
const searchFilters = ref([
  { label: '全部', value: 'all' },
  { label: '论文', value: 'paper' },
  { label: '项目', value: 'project' },
  { label: '作者', value: 'author' },
  { label: '机构', value: 'institution' }
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

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-container {
  flex: 1;
}

/* 搜索区域样式 */
.search-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px 40px;
  color: white;
}

.search-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-logo {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-text {
  font-size: 64px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-subtitle {
  font-size: 20px;
  font-weight: normal;
  opacity: 0.9;
}

.logo-desc {
  font-size: 16px;
  opacity: 0.8;
  margin-top: 10px;
}

.search-box-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.search-box {
  margin-bottom: 20px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  font-size: 16px;
  border: none;
  outline: none;
}

.search-icon {
  padding: 0 20px;
  cursor: pointer;
  font-size: 20px;
  background: #f5f5f5;
  height: 100%;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

.search-icon:hover {
  background: #e8e8e8;
}

.search-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 10px;
}

.filter-tab {
  padding: 8px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.filter-tab.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.advanced-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.advanced-btn:hover {
  background: #e8e8e8;
}

.hot-search {
  display: flex;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.hot-label {
  color: #666;
  font-size: 14px;
  margin-right: 10px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-tag:hover {
  background: #1890ff;
  color: white;
}

/* 推荐区域样式 */
.recommendations-section {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.category-tabs {
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
}

.category-tab {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.category-tab:hover {
  color: #1890ff;
}

.category-tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  font-weight: bold;
}

.category-count {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

@media (max-width: 1024px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}

.recommendation-column {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f5f5f5;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 20px;
}

.view-all {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.view-all:hover {
  color: #40a9ff;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-card {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.content-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.content-type {
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.content-source, .content-language {
  font-size: 12px;
  color: #666;
}

.content-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.content-abstract, .content-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.date, .stars {
  font-size: 13px;
  color: #666;
}

.meta-right {
  display: flex;
  gap: 15px;
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

.content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

/* 作者卡片特定样式 */
.author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.author-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #f0f0f0;
}

.author-details {
  width: 100%;
}

.author-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.author-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.author-institution {
  font-size: 13px;
  color: #999;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.author-expertise {
  width: 100%;
  margin-bottom: 20px;
}

.expertise-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.expertise-tag {
  background: #e6f7ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
}

.follow-btn {
  width: 100%;
  padding: 10px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.follow-btn:hover {
  background: #40a9ff;
}

/* 加载更多按钮 */
.load-more-section {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 12px 40px;
  background: white;
  border: 2px solid #1890ff;
  color: #1890ff;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover:not(:disabled) {
  background: #1890ff;
  color: white;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 高级搜索模态框 */
.advanced-search-modal {
  width: 600px;
  max-width: 90vw;
}

.advanced-search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn, .search-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: #f5f5f5;
  color: #333;
}

.search-btn {
  background: #1890ff;
  color: white;
}

/* 底部样式 */
.home-footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-section h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #34495e;
  color: #bdc3c7;
  font-size: 14px;
}
</style>