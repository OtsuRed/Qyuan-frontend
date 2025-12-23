<template>
  <!-- 收藏操作按钮（可放在论文卡片或详情页） -->
  <button
      v-if="!isInCollection"
      class="collect-btn"
      @click="showCollectionPanel = true"
  >
    收藏
  </button>
  <button
      v-else
      class="collected-btn"
      @click="showCollectionPanel = true"
  >
    已收藏
  </button>

  <!-- 收藏面板弹窗 -->
  <div v-if="showCollectionPanel" class="collection-panel-overlay" @click.self="closePanel">
    <div class="collection-panel">
      <!-- 弹窗头部 -->
      <div class="panel-header">
        <h3>收藏到收藏夹</h3>
        <button class="close-btn" @click="closePanel">×</button>
      </div>

      <!-- 当前收藏项信息 -->
      <div class="current-item">
        <h4>{{ paper.title }}</h4>
        <p v-if="paper.authors" class="authors">{{ paper.authors.join(', ') }}</p>
        <p v-if="paper.journal" class="journal">{{ paper.journal }} · {{ paper.year }}</p>
      </div>

      <!-- 收藏夹列表 -->
      <div class="folders-section">
        <div class="section-header">
          <h4>选择收藏夹</h4>
          <button
              class="create-folder-btn"
              @click="showCreateFolder = true"
          >
            + 新建
          </button>
        </div>

        <!-- 收藏夹列表 -->
        <div class="folder-list">
          <div
              v-for="folder in folders"
              :key="folder.id"
              class="folder-item"
              :class="{
              active: selectedFolderId === folder.id,
              'has-item': isPaperInFolder(folder.id)
            }"
              @click="toggleFolderSelection(folder.id)"
          >
            <div class="folder-info">
              <span class="folder-name">{{ folder.name }}</span>
              <span class="item-count">{{ folder.paperCount }} 篇</span>
            </div>
            <div class="folder-status">
              <span v-if="isPaperInFolder(folder.id)" class="already-added">已收藏</span>
              <input
                  type="radio"
                  :checked="selectedFolderId === folder.id"
                  @click.stop="toggleFolderSelection(folder.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="panel-actions">
        <button class="btn-secondary" @click="closePanel">取消</button>
        <button
            class="btn-primary"
            @click="handleCollect"
            :disabled="!selectedFolderId"
        >
          {{ getActionButtonText() }}
        </button>
      </div>
    </div>
  </div>

  <!-- 创建收藏夹弹窗 -->
  <div v-if="showCreateFolder" class="modal-overlay">
    <div class="create-folder-modal">
      <div class="modal-header">
        <h3>创建收藏夹</h3>
        <button class="close-btn" @click="closeCreateFolder">×</button>
      </div>
      <div class="modal-body">
        <input
            v-model="newFolderName"
            type="text"
            placeholder="输入收藏夹名称"
            class="folder-input"
            @keyup.enter="createNewFolder"
            ref="folderInputRef"
        />
        <p class="input-hint">建议使用具体的主题命名，便于管理</p>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" @click="closeCreateFolder">取消</button>
        <button
            class="btn-primary"
            @click="createNewFolder"
            :disabled="!newFolderName.trim()"
        >
          创建
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// 接收论文数据
const props = defineProps({
  paper: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      title: '',
      authors: [],
      journal: '',
      year: '',
      doi: '',
      url: ''
    })
  }
})

// 响应事件
const emit = defineEmits(['collected', 'uncollected'])

// 状态管理
const showCollectionPanel = ref(false)
const showCreateFolder = ref(false)
const newFolderName = ref('')
const selectedFolderId = ref(null)
const folderInputRef = ref(null)

// 收藏夹数据（示例，实际应从后端获取）
const folders = ref([
  { id: '1', name: '机器学习', paperCount: 12 },
  { id: '2', name: '自然语言处理', paperCount: 8 },
  { id: '3', name: '计算机视觉', paperCount: 15 },
  { id: '4', name: '深度学习', paperCount: 20 }
])

// 用户收藏记录（示例，实际应从后端获取）
const userCollections = ref([
  { folderId: '1', paperId: 'paper-001' },
  { folderId: '2', paperId: 'paper-002' }
])

// 计算属性：当前论文是否已收藏
const isInCollection = computed(() => {
  return userCollections.value.some(
      collection => collection.paperId === props.paper.id
  )
})

// 检查论文是否在指定收藏夹中
const isPaperInFolder = (folderId) => {
  return userCollections.value.some(
      collection =>
          collection.paperId === props.paper.id &&
          collection.folderId === folderId
  )
}

// 获取收藏夹中当前论文的收藏记录
const getCollectionInFolder = (folderId) => {
  return userCollections.value.find(
      collection =>
          collection.paperId === props.paper.id &&
          collection.folderId === folderId
  )
}

// 获取操作按钮文本
const getActionButtonText = () => {
  if (!selectedFolderId.value) return '选择收藏夹'

  const folder = folders.value.find(f => f.id === selectedFolderId.value)
  if (!folder) return '收藏'

  if (isPaperInFolder(folder.id)) {
    return '已收藏，点击取消'
  }
  return `收藏到 ${folder.name}`
}

// 切换收藏夹选择
const toggleFolderSelection = (folderId) => {
  selectedFolderId.value = folderId
}

// 处理收藏操作
const handleCollect = async () => {
  if (!selectedFolderId.value) return

  const folder = folders.value.find(f => f.id === selectedFolderId.value)
  if (!folder) return

  if (isPaperInFolder(folder.id)) {
    // 取消收藏
    await removeFromCollection(folder.id)
    emit('uncollected', { folder, paper: props.paper })
  } else {
    // 添加收藏
    await addToCollection(folder.id)
    emit('collected', { folder, paper: props.paper })
  }

  // 更新收藏夹论文数量
  updateFolderPaperCount(folder.id)

  // 关闭面板
  setTimeout(() => {
    showCollectionPanel.value = false
  }, 500)
}

// 添加收藏
const addToCollection = async (folderId) => {
  // 模拟API调用
  console.log('添加收藏:', props.paper.id, '到收藏夹:', folderId)

  userCollections.value.push({
    folderId,
    paperId: props.paper.id,
    collectedAt: new Date().toISOString()
  })

  // 在实际应用中，这里应该调用API
  // await api.addToCollection({
  //   folderId,
  //   paperId: props.paper.id
  // })
}

// 移除收藏
const removeFromCollection = async (folderId) => {
  // 模拟API调用
  console.log('移除收藏:', props.paper.id, '从收藏夹:', folderId)

  const index = userCollections.value.findIndex(
      collection =>
          collection.paperId === props.paper.id &&
          collection.folderId === folderId
  )

  if (index > -1) {
    userCollections.value.splice(index, 1)
  }

  // 在实际应用中，这里应该调用API
  // await api.removeFromCollection({
  //   folderId,
  //   paperId: props.paper.id
  // })
}

// 更新收藏夹论文数量
const updateFolderPaperCount = (folderId) => {
  const folder = folders.value.find(f => f.id === folderId)
  if (folder) {
    const count = userCollections.value.filter(
        collection => collection.folderId === folderId
    ).length
    folder.paperCount = count
  }
}

// 创建新收藏夹
const createNewFolder = async () => {
  if (!newFolderName.value.trim()) return

  const newFolder = {
    id: `folder-${Date.now()}`,
    name: newFolderName.value.trim(),
    paperCount: 0
  }

  // 模拟API调用
  console.log('创建收藏夹:', newFolder)

  folders.value.push(newFolder)
  newFolderName.value = ''
  showCreateFolder.value = false

  // 自动选中新创建的收藏夹
  selectedFolderId.value = newFolder.id

  // 在实际应用中，这里应该调用API
  // const result = await api.createFolder({ name: newFolder.name })
  // newFolder.id = result.id
}

// 关闭创建收藏夹弹窗
const closeCreateFolder = () => {
  showCreateFolder.value = false
  newFolderName.value = ''
}

// 关闭收藏面板
const closePanel = () => {
  showCollectionPanel.value = false
  selectedFolderId.value = null
}

// 初始化：检查论文是否已收藏
onMounted(() => {
  // 如果有默认收藏夹，预选中
  if (folders.value.length > 0) {
    selectedFolderId.value = folders.value[0].id
  }

  // 如果论文已收藏，找到对应的收藏夹
  if (isInCollection.value) {
    const collection = userCollections.value.find(
        c => c.paperId === props.paper.id
    )
    if (collection) {
      selectedFolderId.value = collection.folderId
    }
  }
})
</script>

<style scoped>
.collect-btn, .collected-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.collect-btn {
  background-color: #e3f2fd;
  color: #1976d2;
}

.collect-btn:hover {
  background-color: #bbdefb;
}

.collected-btn {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.collected-btn:hover {
  background-color: #c8e6c9;
}

/* 收藏面板样式 */
.collection-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.collection-panel {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

/* 当前论文信息 */
.current-item {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.current-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
}

.authors {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.journal {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #888;
}

/* 收藏夹部分 */
.folders-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.create-folder-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #1976d2;
  color: #1976d2;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.create-folder-btn:hover {
  background-color: #e3f2fd;
}

/* 收藏夹列表 */
.folder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.folder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.folder-item:hover {
  border-color: #bbdefb;
  background-color: #f5faff;
}

.folder-item.active {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.folder-item.has-item {
  border-color: #c8e6c9;
  background-color: #f1f8e9;
}

.folder-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.folder-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-count {
  font-size: 12px;
  color: #666;
}

.folder-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.already-added {
  font-size: 12px;
  color: #2e7d32;
  font-weight: 500;
}

/* 操作按钮 */
.panel-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}

.btn-secondary, .btn-primary {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-primary:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

/* 创建收藏夹弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.create-folder-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-body {
  padding: 24px;
}

.folder-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.folder-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.input-hint {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #888;
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}
</style>