<template>
  <!-- 收藏夹弹窗遮罩层 -->
  <div v-if="visible" class="collection-modal-overlay" @click.self="handleClose">
    <!-- 弹窗主体 -->
    <div class="collection-modal">
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h2 class="modal-title">我的收藏夹</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 分类标签栏 -->
      <div class="collection-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.name }} ({{ getCollectionCount(tab.key) }})
        </button>
      </div>

      <!-- 收藏内容列表 -->
      <div class="collection-content">
        <!-- 空状态 -->
        <div v-if="getCollectionList.length === 0" class="empty-collection">
          <p class="empty-text">暂无{{ tabs.find(t => t.key === activeTab).name }}收藏</p>
          <button class="back-btn" @click="handleClose">返回继续浏览</button>
        </div>

        <!-- 收藏列表 -->
        <ul v-else class="collection-list">
          <li 
            v-for="(item, index) in getCollectionList" 
            :key="index"
            class="collection-item"
          >
            <!-- 内容标题 -->
            <a :href="item.url" target="_blank" class="item-title">{{ item.title }}</a>
            
            <!-- 元信息 -->
            <div class="item-meta">
              <span v-if="item.type === 'paper'" class="meta-item">DOI: {{ item.doi || '无' }}</span>
              <span v-if="item.type === 'journal'" class="meta-item">ISSN: {{ item.issn || '无' }}</span>
              <span v-if="item.type === 'patent'" class="meta-item">专利号: {{ item.patentNo || '无' }}</span>
              <span class="meta-item">收藏时间: {{ item.collectTime }}</span>
            </div>

            <!-- 操作按钮 -->
            <div class="item-actions">
              <button class="action-btn view-btn" @click="viewItem(item)">查看</button>
              <button class="action-btn delete-btn" @click="removeCollection(item)">取消收藏</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- 弹窗底部 -->
      <div class="modal-footer">
        <button class="footer-btn cancel-btn" @click="handleClose">关闭</button>
        <button class="footer-btn clear-btn" @click="clearCollection(activeTab)" :disabled="getCollectionList.length === 0">
          清空{{ tabs.find(t => t.key === activeTab).name }}收藏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

// 1. 接收父组件传递的参数
const props = defineProps({
  // 弹窗显示/隐藏状态
  visible: {
    type: Boolean,
    default: false
  },
  // 要收藏的初始内容（论文/期刊/专利）
  initItem: {
    type: Object,
    default: null
  }
});

// 2. 定义发送给父组件的事件
const emit = defineEmits(['close']);

// 3. 分类标签配置
const tabs = ref([
  { key: 'paper', name: '论文' },
  { key: 'journal', name: '期刊' },
  { key: 'patent', name: '专利' }
]);

// 4. 当前激活的标签
const activeTab = ref('paper');

// 5. 修复：初始化收藏数据（确保每个分类都是数组，避免undefined）
const collectionData = ref({
  paper: [],
  journal: [],
  patent: []
});

// 6. 修复：正确定义计算属性（返回当前分类的收藏列表）
const getCollectionList = computed(() => {
  // 兜底：如果分类不存在，返回空数组
  return collectionData.value[activeTab.value] || [];
});

// 7. 获取指定分类的收藏数量
const getCollectionCount = (type) => {
  // 兜底：如果分类不存在，返回0
  return (collectionData.value[type] || []).length;
};

// 8. 关闭弹窗（通知父组件）
const handleClose = () => {
  emit('close');
};

// 9. 修复：添加收藏项（增加分类存在性判断，避免undefined）
const addCollection = (item) => {
  // 校验：收藏项不能为空，且必须有type
  if (!item || !item.type) {
    console.log('❌ 收藏项为空或类型错误');
    return;
  }

  // 兜底：如果分类不存在，初始化该分类为数组
  if (!collectionData.value[item.type]) {
    collectionData.value[item.type] = [];
  }

  // 避免重复收藏（根据标题+类型判断）
  const isExist = collectionData.value[item.type].some(
    i => i.title === item.title && i.type === item.type
  );

  if (isExist) {
    alert(`「${item.title}」已在收藏夹中`);
    return;
  }

  // 添加到对应分类的收藏列表
  collectionData.value[item.type].unshift(item);
  console.log('✅ 收藏成功：', item);
  alert(`已成功收藏：「${item.title}」`);
  
  // 自动切换到对应分类
  activeTab.value = item.type;
};

// 10. 修复：移除单个收藏项（增加分类存在性判断）
const removeCollection = (item) => {
  // 校验：收藏项不能为空，且分类必须存在
  if (!item || !item.type || !collectionData.value[item.type]) return;

  // 过滤掉要删除的项
  collectionData.value[item.type] = collectionData.value[item.type].filter(i => {
    return !(i.title === item.title && i.type === item.type);
  });

  alert(`已取消收藏：「${item.title}」`);
};

// 11. 修复：清空当前分类的收藏（增加分类存在性判断）
const clearCollection = (type) => {
  // 校验：分类不存在或无收藏项，直接返回
  if (!collectionData.value[type] || collectionData.value[type].length === 0) return;

  // 二次确认，防止误操作
  if (confirm(`确定要清空「${tabs.value.find(t => t.key === type).name}」收藏吗？此操作不可恢复！`)) {
    collectionData.value[type] = [];
    alert(`已清空「${tabs.value.find(t => t.key === type).name}」收藏`);
  }
};

// 12. 查看收藏项（跳转链接）
const viewItem = (item) => {
  if (item && item.url) {
    window.open(item.url, '_blank');
  } else {
    alert('暂无访问链接');
  }
};

// 13. 监听弹窗显示状态，自动添加收藏项
watch(
  () => props.visible,
  (newVal) => {
    console.log('🔔 弹窗visible状态变化：', newVal);
    // 弹窗打开且有初始收藏项时，自动添加
    if (newVal && props.initItem) {
      console.log('🔔 开始添加收藏项：', props.initItem);
      addCollection(props.initItem);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* 弹窗遮罩层 */
.collection-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 弹窗主体 */
.collection-modal {
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 10000;
}

/* 弹窗头部 */
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* 分类标签栏 */
.collection-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  flex: 1;
  text-align: center;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #1a56db;
  font-weight: 600;
  border-bottom: 2px solid #1a56db;
  background-color: #fff;
}

.tab-btn:hover:not(.active) {
  color: #1a56db;
  background-color: #f0f7ff;
}

/* 收藏内容区域 */
.collection-content {
  flex: 1;
  padding: 20px;
}

/* 空状态 */
.empty-collection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.back-btn {
  padding: 8px 16px;
  border: 1px solid #1a56db;
  border-radius: 4px;
  background-color: #fff;
  color: #1a56db;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #f0f7ff;
}

/* 收藏列表 */
.collection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.collection-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.collection-item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 16px;
  color: #1a56db;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.item-title:hover {
  text-decoration: underline;
  color: #0d47a1;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
}

/* 操作按钮 */
.item-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.view-btn {
  background-color: #f0f7ff;
  color: #1a56db;
}

.view-btn:hover {
  background-color: #e1f5fe;
}

.delete-btn {
  background-color: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background-color: #ffebee;
}

/* 弹窗底部 */
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.clear-btn {
  background-color: #dc2626;
  color: white;
}

.clear-btn:hover {
  background-color: #b91c1c;
}

.clear-btn:disabled {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .collection-modal {
    max-width: 100%;
    min-width: unset;
  }

  .tab-btn {
    padding: 10px;
    font-size: 13px;
  }

  .item-actions {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>