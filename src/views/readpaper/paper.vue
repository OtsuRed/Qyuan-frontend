<template>
  <div class="paper-detail-page">
    <div class="paper-title">
      <h1>论文标题：{{paperDetail.data?.title}}</h1>
      <p class="doi">{{ paperDetail.data?.doi }}</p>
      <p class="paper-link">论文链接: <a :href='paperDetail.data?.url' target="_blank" rel="noopener noreferrer">{{ paperDetail.data?.url}}</a></p>
    </div>

    <div class="info-block author-info">
      <div class="info-content">
        <p><span class="info-label">作者:&nbsp&nbsp</span>
          <span v-for="author in paperDetail.data?.authors[1].slice(0,5)" :key="author.id">{{ author.fullName }}&nbsp&nbsp&nbsp  </span><span v-if="paperDetail.data?.authors[1].length > 5">等{{ paperDetail.data?.authors[1].length}}人</span>
        </p>
        <p><span class="info-label">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp提交者:</span>&nbsp&nbsp{{ paperDetail.data?.submitter}}</p>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn online-reading" @click="savePaperData">在线阅读</button>
      <button class="btn download">下载</button>
      <button class="btn favorite" @click="collectPaper">收藏</button>
      <button class="btn share">分享</button>
      <button class="btn claim" @click="showClaimModal = true">认领</button>
    </div>

    <div class="main-content">
      <div class="left-column">
        <div class="info-block integrated-block">
          <div class="section abstract-section">
            <h3 class="section-title">摘要</h3>
            <div class="section-content">
              <div class="section-content">
                <math-jax :key="mathKey">
                  <div class="abstract-text" :class="{'abstract-clamped': !showFullAbstract}">
                    {{ paperDetail.data?.abstractText }}
                  </div>
                </math-jax>
                <button class="toggle-btn" @click="toggleAbstract">
                  {{ showFullAbstract ? '收起' : '展开' }}
                </button>
              </div>
            </div>
          </div>

<!--          <div class="section keywords-section">-->
<!--            <h3 class="section-title">关键词</h3>-->
<!--            <div class="section-content">-->
<!--              <div class="keyword-tags">-->
<!--                <span class="tag">关键词1</span>-->
<!--                <span class="tag">关键词2</span>-->
<!--                <span class="tag">关键词3</span>-->
<!--                <span class="tag">关键词4</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <div class="section journal-section">
            <h3 class="section-title">期刊来源</h3>
            <div class="section-content">
              <p><span class="info-label">期刊名称:</span> {{ paperDetail.data?.journalSource}}</p><span v-if="paperDetail.data?.journalSource===null">暂无</span>
            </div>
          </div>

          <div class="section publication-section">
            <h3 class="section-title">发表信息</h3>
            <div class="section-content">
              <p><span class="info-label">论文发表日期:</span>{{ paperDetail.data?.updated}}</p>
              <p><span class="info-label">在线出版日期:</span> 2025-06-20 (平台首次上网日期,不代表论文的发表时间)</p>
              <p><span class="info-label">页数:</span> 25 (10-35)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="info-block references-block">
          <div class="block-header">
            参考文献(15)
            <div class="reference-controls">
              <label class="checkbox-label">
                <input type="checkbox" v-model="onlyFullText"> 仅看全文
              </label>
              <select v-model="sortType" class="sort-select">
                <option value="date">按发表时间排序</option>
                <option value="citation">按被引量排序</option>
              </select>
              <button class="network-btn">查看引文网络</button>
            </div>
          </div>
          <div class="block-content">
            <ul class="reference-list">
              <li v-for="ref in paperRefs " :key="ref.citationId" class="reference-item">
                <a :href="ref.url" class="paper-link">{{ref.citedPaperTitle}}</a>
                <p class="citation-count">引用次数:{{ref.beRefedCount}}
                  <span>发表时间:{{formatDay(ref.createdAt)}}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div class="info-block related-topics-block">
          <div class="block-header">论文类别</div>
          <div class="block-content">
            <div class="topics-container">
              <a href="#" class="topic-tag">{{tag}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="page-footer">
      <p>© 2025 千源学术 版权所有</p>
      <p>万方数据知识服务平台提供技术支持</p>
    </footer>

<!--    <CollectionModal-->
<!--      :visible="showCollectionModal"-->
<!--      @close="showCollectionModal = false"-->
<!--     :paper="currentCollectItem"/>-->

    <ClaimModal
      :visible="showClaimModal"
      title="论文认领申请"
      descriptionPlaceholder="请输入认领该论文的原因、相关证明说明等内容..."
      @close="showClaimModal = false"
      @submit="handlePaperClaimSubmit"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import CollectionModal from '@/views/components/CollectionModal/index.vue';
import ClaimModal from '@/views/components/ClaimModal/index.vue';
import {getPaperDetail, getPaperRef} from "@/api/paper.js";
import {useRoute, useRouter} from "vue-router";
import {usePaperStore} from "@/stores/paperStore.js";
import router from "@/routes/index.js";
import MathJax from "@/views/components/mathLex.vue";
import {category} from "@/utils/storage.js";
import {formatDay} from "@/utils/time.js";

const showFullAbstract = ref(false);
const showEnglishInfo = ref(false);
const onlyFullText = ref(false);
const sortType = ref('date');

const showCollectionModal = ref(false);
const currentCollectItem = ref(null);
const showClaimModal = ref(false);
const paperDetail = ref({});
const paperRefs = ref([]);
const paperCategory = ref(category);
const tag=ref( '')

const route = useRoute();
const authors = ref([])
onMounted( ()=>{
  //获取params
  getPaperDetail(route.query.paper_id).then(
      data => {
        paperDetail.value = data;
        console.log(data);
        authors.value = data.data.authors;
        console.log(authors.value);
       category.forEach(item=>{
         if(item.id===data.data.categoryId){
           tag.value=item.name
         }
       })
      }
  )
  getPaperRef(route.query.paper_id).then(
      data => {
        paperRefs.value = data.data[1];
        console.log(data.data[1]);
      }
  )
})
const collectPaper = () => {
  currentCollectItem.value = {
    id: 1,
    title: '这是一篇学术论文的示例标题',
    authors: ['作者1', '作者2', '作者3'],
    journal: '计算机工程与应用',
    year: '2025',
    doi: '10.xxxx/j.cnki.xxxx.xxxx.xxxx',
    url: 'https://example.com/paper'
  };
  showCollectionModal.value = true;
  console.log('✅ 收藏弹窗状态已设置为：', showCollectionModal.value);
  console.log('✅ 要收藏的论文信息：', currentCollectItem.value);
};

const handlePaperClaimSubmit = (submitData) => {
  console.log('📄 论文认领提交数据：', submitData);
  alert('论文认领申请已提交，我们将在1-3个工作日内审核并回复您！');
  showClaimModal.value = false;
};
const savePaperData=()=>{
  router.push(`/pdf?paper_id=${paperDetail.value.data.paperId}`)
}
const mathKey = computed(() => {
  return `${paperDetail.value.data?.abstractText}_${showFullAbstract.value}`;
});

const toggleAbstract = () => {
  showFullAbstract.value = !showFullAbstract.value;
  // 等待 DOM 更新后重新渲染 MathJax
  setTimeout(() => {
    // 触发 MathJax 重新渲染
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, 100);
};

</script>

<style scoped>
.paper-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

.paper-title {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.paper-title h1 {
  font-size: 22px;
  color: var(--primary-color);
  margin-bottom: 10px;
  line-height: 1.4;
}

.doi {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 5px;
}

.paper-link {
  color: var(--primary-color);
  font-size: 14px;
  text-decoration: none;
}

.paper-link a {
  color: var(--primary-color);
  text-decoration: none;
  margin-left: 5px;
}

.paper-link a:hover {
  text-decoration: underline;
}

.info-block {
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.author-info .info-content {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
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

.online-reading {
  background-color: var(--primary-color);
  color: white;
}

.download {
  background-color: #10b981;
  color: white;
}

.favorite, .share {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.claim {
  background-color: #fb923c;
  color: white;
}

.claim:hover {
  background-color: #f97316;
}

.action-buttons .favorite {
  position: relative;
  z-index: 999 !important;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

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

.integrated-block {
  padding: 20px;
}

.section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.section-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: var(--primary-color);
  margin-right: 8px;
  border-radius: 2px;
}

.section-content {
  color: var(--text-secondary);
  font-size: 14px;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--primary-color);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.toggle-english {
  color: var(--primary-color);
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
  border-top: 1px dashed var(--border-color);
}

.block-header {
  background: var(--bg-tertiary);
  padding: 12px 15px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.block-content {
  padding: 15px;
  color: var(--text-secondary);
}

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
  color: var(--text-secondary);
}

.sort-select {
  padding: 3px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background-color: var(--input-bg);
  color: var(--text-primary);
}

.network-btn {
  color: var(--primary-color);
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px 5px;
  font-size: 13px;
  font-weight: 500;
}

.reference-item {
  padding: 10px 0;
  border-bottom: 1px dashed var(--border-color);
  font-size: 14px;
  color: var(--text-secondary);
}

.topics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  background: var(--bg-tertiary);
  color: var(--primary-color);
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.topic-tag:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.page-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  font-size: 14px;
  color: var(--text-tertiary);
}

.info-label {
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 5px;
}

.toggle-btn {
  color: var(--primary-color);
  background: none;
  border: none;
  padding: 0 5px;
  cursor: pointer;
  font-size: 14px;
}

:deep(.collection-modal-overlay) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.7) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
}

:deep(.collection-modal) {
  background: var(--bg-card) !important;
  padding: 20px !important;
  border-radius: 8px !important;
  min-width: 500px !important;
  z-index: 10000 !important;
  color: var(--text-primary) !important;
}
.abstract-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.collection-modal-overlay) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.7) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
}
</style>