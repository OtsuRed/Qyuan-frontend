<template>
  <div class="pdf-container">
    <!-- 顶部控制栏 -->
    <div class="pdf-controls">
      <input type="file" accept="application/pdf" @change="onFileChange" />
      <button @click="clearHighlights" class="clear-highlight-btn" v-if="highlights.length > 0">
        清除所有高亮
      </button>
    </div>

    <!-- 主体：PDF + 评论栏 -->
    <div class="pdf-main">
      <!-- 左侧 PDF 区域 -->
      <div class="pdf-wrapper" ref="scrollContainer">
        <div
            v-for="(pageCanvas, index) in pageCanvases"
            :key="index"
            class="page-container"
        >
          <canvas ref="canvasRefs"></canvas>
          <div
              ref="textLayerRefs"
              class="textLayer"
              :class="{ 'textLayer-hidden': !showTextLayer }"
          ></div>
          <div
              :ref="el => { if (el) highlightLayers[index] = el }"
              class="highlightLayer"
          ></div>
        </div>
      </div>

      <!-- 右侧选项卡面板 -->
      <div class="tab-panel">
        <!-- 选项卡头部 -->
        <div class="tab-header">
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'notes' }"
            @click="activeTab = 'notes'"
          >
            笔记列表
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeTab === 'ai' }"
            @click="activeTab = 'ai'"
          >
            AI问答
          </div>
        </div>

        <!-- 选项卡内容区 -->
        <div class="tab-content">
          <!-- 笔记列表 -->
          <div v-show="activeTab === 'notes'" class="tab-pane">
            <div class="note-header">
              <h2>📒 笔记</h2>
              <button class="add-note-btn" @click="addNote">＋ 添加笔记</button>
            </div>

            <div class="note-list">
              <div v-for="note in notes" :key="note.id" class="note-item">
                <!-- 标题编辑 -->
                <div v-if="note.editingTitle" class="note-title-editing">
                  <input
                      v-model="note.tempTitle"
                      @keyup.enter="saveNoteTitle(note)"
                      @blur="saveNoteTitle(note)"
                      @keyup.esc="cancelEditTitle(note)"
                      class="title-input"
                      ref="titleInputs"
                      autofocus
                  />
                </div>
                <div v-else class="note-title" @dblclick="startEditTitle(note)">
                  {{ note.noteTitle || '无标题' }}
                </div>

                <!-- 内容编辑 -->
                <div v-if="note.editingContent" class="note-content-editing">
            <textarea
                v-model="note.tempContent"
                @keyup.ctrl.enter="saveNoteContent(note)"
                @blur="saveNoteContent(note)"
                @keyup.esc="cancelEditContent(note)"
                class="content-textarea"
                ref="contentInputs"
                autofocus
                rows="3"
            ></textarea>
                </div>
                <div v-else class="note-content" @dblclick="startEditContent(note)">
                  {{ note.noteContent || '无内容' }}
                </div>

                <div class="note-footer">
                  <span class="note-date">{{ formatTime(note.createAt) }}</span>
                  <button class="note-delete" @click="deleteNote(note)">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- AI问答列表 -->
          <AIpaper v-if="activeTab === 'ai'" class="tab-pane">
          </AIpaper>
        </div>
      </div>
    </div>

    <!-- 浮动按钮 / 调色盘 -->
    <div v-show="showFloatButton"
         class="floating-color-palette"
         :style="{ top: floatingBtnPos.y + 'px', left: floatingBtnPos.x + 'px' }">
      <div @click="selectHighLight()">选择高亮</div>
    </div>

    <div v-show="showColor"
         class="floating-color-palette"
         :style="{ top: floatingBtnPos.y + 'px', left: floatingBtnPos.x + 'px' }">
      <div
          v-for="(color, idx) in highlightColors"
          :key="idx"
          class="color-option"
          :style="{ backgroundColor: color }"
          @click.stop="handleColorSelect(color)"
      ></div>
    </div>
  </div>
</template>


<script setup>
import {ref, reactive, onMounted, nextTick, onBeforeUnmount, defineProps, onUnmounted} from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { 
  createHighlight, 
  getPaperHighlights, 
  deleteHighlight,
  clearPaperHighlights,
} from '@/api/highlight.js'
import { addNotes, getNotes, updateNotes, deleteNotes } from '@/api/note.js'
import { getUser } from '@/utils/storage.js'
import {createReadRecord, getReadRecord, updateReadRecord} from "@/api/paper_read.js";
import AIpaper from "@/views/pdf/AIpaper.vue";
import {usePaperStore} from "@/stores/paperStore.js";
import {useRoute, useRouter} from "vue-router";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
// 简单定义方式

const props = defineProps(['paper'])
const scrollContainer = ref(null)
const canvasRefs = ref([])
const textLayerRefs = ref([])
const highlightLayers = ref([]) // 高亮层引用
const pageCanvases = reactive([]) // 存放canvas占位
const showTextLayer = ref(true) // 控制文字层显示
const textLayers = ref([]) // 保存文字层实例，用于清理
const highlights = ref([]) // 存储所有高亮数据
const hasSelection = ref(false) // 是否有选中的文字
const currentSelection = ref(null) // 当前选中的文字信息
const currentPDFFile = ref(null) // 当前PDF文件信息
const currentPaperId = ref(1) // 当前论文ID（关联paper表）
const currentPaperTitle = ref('test title') // 当前论文标题
const currentPaperAuthor = ref('test auther')
const currentPaperAbstract = ref('test abstract')
const currentPaperPageCount = ref(1)
const currentPDFUrl = ref('') // 当前PDF文件URL（用于查找paper_id）
const viewportInfo = ref(null) // 当前viewport信息，用于保存高亮位置
const showFloatButton=ref(false)
// 新增：浮动按钮显示状态和位置
const showColor = ref(false)
const floatingBtnPos = reactive({ x: 0, y: 0 })
const scrollPercentage = ref(0);
const readRecord = ref(null)
const activeTab = ref('notes')
const router = useRouter()
const route = useRoute()
const highlightColors = [
  '#b0d9fe', // 原 #92cbfe → 30%淡化，更明显的蓝色
  '#f7deaf', // 原 #f4cf88 → 30%淡化，更明显的橙色
  '#c4baf8', // 原 #ab9cf5 → 30%淡化，更明显的紫色
  '#f4c0da', // 原 #f19fc4 → 30%淡化，更明显的粉色
  '#71d0b2'  // 原 #31BC8F → 30%淡化，更明显的绿色
]
const notes = ref([])
const titleInputs = ref([])
const contentInputs = ref([])
const init = ()=>{
  currentPaperId.value = route.query.paper_id
  getNotes(currentPaperId.value).then(res=>{
    res.data.forEach(note=>{
      notes.value.push(note)
    })
  })
  getPaperHighlights(currentPaperId.value).then(res=>{
    res.data.forEach(highlight=>{
      highlights.value.push(highlight)
    })
  })
  getReadRecord(currentPaperId.value).then(
      res=>{
        if(res.data){
          readRecord.value = res.data
        }else{
          const record={
            paperId: currentPaperId.value,
            paperTitle: currentPaperTitle.value,
            firstAuthor: currentPaperAuthor.value,
            abstract: currentPaperAbstract.value,
          }
          createReadRecord(record).then(res=>{
            readRecord.value = res.data
          })

        }
      }
  )
}
init()
let debounceTimer = null;
const DEBOUNCE_DELAY = 1000; // 滚动停止1秒后保存

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', debouncedCalculateAndSave);
  }
  // 监听文字选择事件
  document.addEventListener('selectionchange', handleSelection);
// 使用代理路径
  const proxyPath = '/obs-proxy/0704/0704.0010.pdf';

  // 获取预签名URL的参数
  const presignedUrl = 'https://bucket-pdf-74a6.obs.cn-north-4.myhuaweicloud.com/0704/0704.0010.pdf?AccessKeyId=HPUAE1MAHBIWWPY6YXFT&Expires=1766491576&Signature=BcBcpG7kM%2FrqI6n3vclFhSmt5DE%3D';
  const urlObj = new URL(presignedUrl);
  const searchParams = urlObj.search;

  // 构建代理URL（包含查询参数）
  const proxyUrl = `${proxyPath}${searchParams}`;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fileBlob = await response.blob();
    currentPDFFile.value = fileBlob;
    const arrayBuffer = await fileBlob.arrayBuffer();
    pageCanvases.length = 0;

    await renderPDF(arrayBuffer).then(() => {
      loadPaperHighlights();
    })
  props.paper=usePaperStore().getPaper()
});


onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', debouncedCalculateAndSave);
  }
  document.removeEventListener('selectionchange', handleSelection);

  // 清理防抖定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// 防抖函数
const debouncedCalculateAndSave = () => {
  // 先立即计算百分比（用于UI显示）
  calculateScrollPercentage();

  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 设置新的定时器
  debounceTimer = setTimeout(() => {
    saveReadRecord();
  }, DEBOUNCE_DELAY);
};

// 保存阅读记录
const saveReadRecord = () => {
  if (!readRecord.value?.recordId) return;

  const data = {
    scrollPosition: scrollPercentage.value,
    pageNumber: Math.round(currentPaperPageCount.value * scrollPercentage.value),
  };

  updateReadRecord(data, readRecord.value.recordId)
      .then(() => {
        console.log('阅读记录已保存');
      })
      .catch(error => {
        console.error('保存失败:', error);
      });
};

const calculateScrollPercentage = () => {
  const container = scrollContainer.value;
  if (!container) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  // 计算滚动百分比
  const percentage = (scrollTop / (scrollHeight - clientHeight));
  scrollPercentage.value = isNaN(percentage) ? 0 : percentage;
};

const scrollToPercentage = (percentage) => {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollHeight = container.scrollHeight - container.clientHeight;
  const scrollTop = scrollHeight * percentage;

  container.scrollTop = scrollTop;
};
// 开始编辑标题
const startEditTitle = (note) => {
  note.editingTitle = true
  note.tempTitle = note.noteTitle || ''

  // 等待DOM更新后聚焦
  nextTick(() => {
    const index = notes.value.findIndex(n => n.id === note.id)
    if (titleInputs.value[index]) {
      titleInputs.value[index].focus()
      // 选中所有文本
      titleInputs.value[index].select()
    }
  })
}

// 保存标题
const saveNoteTitle = async (note) => {
  if (note.tempTitle.trim() === '') {
    note.tempTitle = '无标题'
  }

  note.noteTitle = note.tempTitle.trim()
  note.editingTitle = false

  // 这里可以调用API保存到后端
  try {
    await saveNoteToBackend(note)
  } catch (error) {
    console.error('保存失败:', error)
    // 可以添加错误提示
  }
}

// 取消编辑标题
const cancelEditTitle = (note) => {
  note.editingTitle = false
  note.tempTitle = ''
}

// 开始编辑内容
const startEditContent = (note) => {
  note.editingContent = true
  note.tempContent = note.noteContent || ''

  nextTick(() => {
    const index = notes.value.findIndex(n => n.id === note.id)
    if (contentInputs.value[index]) {
      contentInputs.value[index].focus()
      // 将光标移动到末尾
      contentInputs.value[index].setSelectionRange(
          note.tempContent.length,
          note.tempContent.length
      )
    }
  })
}

// 保存内容
const saveNoteContent = async (note) => {
  note.noteContent = note.tempContent.trim()
  note.editingContent = false

  // 调用API保存
  try {
    await saveNoteToBackend(note)
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 取消编辑内容
const cancelEditContent = (note) => {
  note.editingContent = false
  note.tempContent = ''
}

// 保存到后端的函数
const saveNoteToBackend = async (note) => {
  // 这里调用你的API
  const response = await updateNotes(
      {
        id: note.id,
        noteTitle: note.noteTitle,
        noteContent: note.noteContent
      }
  )

  if (!response.ok) {
    throw new Error('保存失败')
  }

  return await response.json()
}

// 添加新笔记

// 删除笔记
const deleteNote = async (note) => {

  try {
      await deleteNotes({id: note.id})
      notes.value = notes.value.filter(n => n.id !== note.id)
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请重试')
  }
}
const addNote = async () => {

    await addNotes({paperId: currentPaperId.value}).then(response=>{
      notes.value.push(response.data)
      // 新建后自动聚焦到标题输入框
      nextTick(() => {
        if (titleInputs.value[0]) {
          titleInputs.value[0].focus()
          titleInputs.value[0].select()
        }
      })
    })
};
const editNoteTitle = async (note) => {

};
const formatTime = (time) => {
  if (!time) return ''

  const date = new Date(time)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const selectHighLight=()=>{
  showColor.value = true
  showFloatButton.value = false
}


// 监听鼠标抬起事件，显示浮动按钮
document.addEventListener('mouseup', (e) => {
  // 检查是否点击的是调色板相关元素
  const target = e.target
  const isInPalette = target.closest('.floating-color-palette')
  const isColorOption = target.closest('.color-option')
  
  // 只有当点击的不是调色盘时才处理选择
  if (!isInPalette && !isColorOption) {
    handleSelection()
  }
  

  if (hasSelection.value && currentSelection.value ) {
    // 设置浮动按钮位置（在鼠标右下方一点）
    if(!showFloatButton.value) {
      floatingBtnPos.x = e.clientX + 10
      floatingBtnPos.y = e.clientY + 10
    }
    showFloatButton.value = true
  } else if (!isInPalette && !isColorOption) {
    // 只有当点击的不是调色盘时才隐藏按钮
    showFloatButton.value = false
  }
})

// 点击空白处时隐藏按钮
document.addEventListener('mousedown', (e) => {

  const palette = e.target.closest('.floating-color-palette')
  const options = e.target.closest('.color-option')
  // 只有当点击的不是调色盘时才隐藏
  if (!palette&&!options) {
    showFloatButton.value = false
  }
  // 如果是调色盘，不隐藏，等待 click 事件处理颜色选择
})
// 渲染 PDF
const renderPDF = async (arrayBuffer) => {
  // 清理之前的文字层
  textLayers.value.forEach(layer => {
    if (layer && typeof layer.destroy === 'function') {
      layer.destroy()
    }
  })
  textLayers.value = []
  
  const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise
  const numPages = pdf.numPages
  currentPaperPageCount.value = numPages
  // 先创建占位
  for (let i = 0; i < numPages; i++) {
    pageCanvases.push(null)
  }
  
  // 初始化高亮层数组
  highlightLayers.value = new Array(numPages).fill(null)

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const scale = 1.5
    const viewport = page.getViewport({scale})
    
    // 保存viewport信息（用于高亮位置计算）
    if (i === 1) {
      viewportInfo.value = {
        scale: viewport.scale,
        width: viewport.width,
        height: viewport.height
      }
    }

    await nextTick() // 确保 DOM 已渲染

    const canvas = canvasRefs.value[i - 1]
    const context = canvas.getContext('2d')
    const container = textLayerRefs.value[i - 1]

    // 清理容器内容
    container.innerHTML = ''

    // 高清渲染 Canvas
    const outputScale = 2
    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`
    context.setTransform(outputScale, 0, 0, outputScale, 0, 0)

    // 渲染 Canvas 页面
    await page.render({canvasContext: context, viewport}).promise

    // 设置文字层容器的尺寸，必须在渲染文字层之前设置
    // 使用单独的样式设置，避免覆盖 PDF.js 内部样式
    container.style.position = 'absolute'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = `${viewport.width}px`
    container.style.height = `${viewport.height}px`
    container.style.overflow = 'hidden'
    container.style.transform = 'scale(1)'
    container.style.transformOrigin = '0 0'

    // 渲染文字层 - 使用改进的 TextLayer 实现
    const textContent = await page.getTextContent()
    
    // 确保使用与 canvas 完全相同的 viewport
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      container: container,
      viewport: viewport, // 使用相同的 viewport，确保文字层和 canvas 对齐
      enhanceTextSelection: true,
    })
    
    await textLayer.render()
    textLayers.value.push(textLayer)
    
    // 渲染后确保容器尺寸正确，并从 textContent 中提取字体大小应用到每个 span
    await nextTick()
    container.style.width = `${viewport.width}px`
    container.style.height = `${viewport.height}px`
    
    // 设置高亮层尺寸
    const highlightLayer = highlightLayers.value[i - 1]
    if (highlightLayer) {
      highlightLayer.style.position = 'absolute'
      highlightLayer.style.top = '0'
      highlightLayer.style.left = '0'
      highlightLayer.style.width = `${viewport.width}px`
      highlightLayer.style.height = `${viewport.height}px`
      highlightLayer.style.zIndex = '1'
    }
    
    // 从 textContent 中提取字体大小信息并应用到每个 span 元素
    const spans = container.querySelectorAll('span')
    const textItems = textContent.items || []
    
    // 为每个 textItem 计算字体大小
    const fontSizeMap = new Map()
    textItems.forEach((item) => {
      if (!item || !item.str) return
      
      let fontSize = null
      
      // 方法1: 从 transform 矩阵提取（最准确）
      if (item.transform && Array.isArray(item.transform) && item.transform.length >= 4) {
        // transform[3] 是垂直缩放因子，通常代表字体大小
        const scaleY = Math.abs(item.transform[3])
        fontSize = scaleY * viewport.scale
      }
      if (fontSize && fontSize > 0) {
        // 使用文本内容作为 key（去除空白字符以便匹配）
        const key = item.str.trim()
        if (key) {
          fontSizeMap.set(key, fontSize)
        }
      }
    })
    
    // 将字体大小应用到每个 span
    spans.forEach((span) => {
      const spanText = (span.textContent || span.innerText || '').trim()
      // 尝试从 fontSizeMap 中找到匹配的字体大小
      let matchedFontSize = null
      // 精确匹配
      if (fontSizeMap.has(spanText)) {
        matchedFontSize = fontSizeMap.get(spanText)
      } else {
        // 部分匹配：查找包含 spanText 的 key，或 spanText 包含的 key
        for (const [key, size] of fontSizeMap.entries()) {
          if (spanText.includes(key) || key.includes(spanText)) {
            matchedFontSize = size
            break
          }
        }
      }
      // 应用字体大小
      if (matchedFontSize && matchedFontSize > 0) {
        span.style.setProperty('font-size', `${matchedFontSize}px`, 'important')
      }
    })
  }
  
  // 重新渲染所有高亮
  await nextTick()

  scrollToPercentage(readRecord.value.scrollPosition)

  // renderAllHighlights()
}

// 文件选择
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  currentPDFFile.value = file
  
  const arrayBuffer = await file.arrayBuffer()
  

  
  pageCanvases.length = 0
  highlights.value = [] // 清除高亮
  
  await renderPDF(arrayBuffer).then(
      () => {
        // 获取论文高亮
        loadPaperHighlights()
      }
  )
  

}

// 设置当前论文信息（从外部调用，比如从论文列表页面打开PDF时）
const setPaperInfo = (paperId, paperTitle = '', pdfUrl = '') => {
  currentPaperId.value = paperId
  currentPaperTitle.value = paperTitle
  currentPDFUrl.value = pdfUrl
  // 如果PDF已加载，重新加载高亮

}

// 从后端加载论文的高亮
const loadPaperHighlights = async () => {

  try {
    const response = await getPaperHighlights(currentPaperId.value)
    console.log('已获取论文高亮:', response)
    const serverHighlights = response.data

    // 转换后端数据格式为前端格式
    highlights.value = serverHighlights.map(h => ({
      id: h.id,
      pageIndex: h.pageIndex,
      text: h.highlightedText,
      rects: JSON.parse(h.positionData).rects,
      color: h.color || '#fdd581',
      opacity: h.opacity || 1,
      createdAt: h.created_at,
      ...h
    }))

    // 渲染所有高亮
    renderAllHighlights()
    
    console.log('已加载高亮:', highlights.value.length, '个')
  } catch (error) {
    console.error('加载高亮失败:', error)
  }
}

// 监听文字选择事件
const handleSelection = (e) => {
  
  const selection = window.getSelection()
  let isInPalette = false;
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // 获取实际的 DOM 元素（处理文本节点情况）
    const actualElement = commonAncestor.nodeType === Node.TEXT_NODE
        ? commonAncestor.parentElement
        : commonAncestor;

    // 检查是否在调色板内或颜色选项内
    isInPalette = actualElement.closest('.floating-color-palette') ||
        actualElement.closest('.color-option');
  }

// 如果在调色板内操作，保持当前选择状态不重置
  if (isInPalette) {
    console.log('在调色板内操作，保持选择状态');
    return; // 不重置 currentSelection，保持选择状态
  }
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const selectedText = selection.toString().trim()
    
    if (selectedText.length > 0) {
      hasSelection.value = true
      // 获取选中文字的位置信息
      const rects = range.getClientRects()
      if (rects.length > 0) {
        // 找到对应的页面容器
        let pageIndex = -1
        let pageContainer = null
        
        for (let i = 0; i < pageCanvases.length; i++) {
          const container = textLayerRefs.value[i]
          if (container && container.contains(range.commonAncestorContainer)) {
            pageIndex = i
            pageContainer = container.closest('.page-container')
            break
          }
        }
        
        if (pageIndex >= 0 && pageContainer) {
          const pageRect = pageContainer.getBoundingClientRect()
          const highlightRects = []
          
          // 收集所有选中区域的矩形
          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i]
            highlightRects.push({
              left: rect.left - pageRect.left,
              top: rect.top - pageRect.top,
              width: rect.width,
              height: rect.height
            })
          }
          
          currentSelection.value = {
            pageIndex,
            text: selectedText,
            rects: highlightRects
          }
        }
      }
    } else {
      hasSelection.value = false
      currentSelection.value = null
    }
  } else {
    hasSelection.value = false
    currentSelection.value = null
  }
}

const handleColorSelect = (color) => {
  console.log('选择颜色:', color)
  addHighlight(color)
  showColor.value = false
  showFloatButton.value=false
}
// 添加高亮
const addHighlight = async (color = '#fdd581') => {
  console.log(currentSelection.value)
  if (!currentSelection.value) return
  console.log("!current")
  const user = getUser()
  // if (!user || !user.id) {
  //   alert('请先登录')
  //   return
  // }
  
  // if (!currentPaperId.value) {
  //   alert('论文ID缺失，无法保存高亮。请先选择或创建论文。')
  //   return
  // }
  
  try {
    // 构建位置数据
    const positionData = {
      rects: currentSelection.value.rects,
      viewport: viewportInfo.value
    }
    
    // 准备保存到后端的数据
    const highlightData = {
      userId: user?.id || 1,
      paperId: currentPaperId.value || 1,
      paperTitle: currentPaperTitle.value || null,
      pageIndex: currentSelection.value.pageIndex,
      highlightedText: currentSelection.value.text,
      positionData: positionData,
      color: color, // 黄色高亮
      opacity: 1
    }
    console.log(highlightData.color)
    
    // 调用API保存到后端
    const response = await createHighlight(highlightData)
    console.log('已保存高亮:', response)
    // 创建本地高亮对象（包含后端返回的ID）
    const highlight = {
      id: response.data?.id || Date.now() + Math.random(),
      pageIndex: currentSelection.value.pageIndex,
      text: currentSelection.value.text,
      rects: [...currentSelection.value.rects],
      color: highlightData.color,
      opacity: highlightData.opacity,
      createdAt: new Date().toISOString(),
      // 保存后端返回的完整数据
      ...response.data
    }
    
    highlights.value.push(highlight)
    renderHighlight(highlight)
    
    // 清除当前选择
    window.getSelection().removeAllRanges()
    hasSelection.value = false
    currentSelection.value = null
    
    console.log('高亮已保存到后端', highlight)
  } catch (error) {
    console.error('保存高亮失败:', error)
    alert('保存高亮失败，请重试')
  }
}

// 渲染单个高亮
const renderHighlight = (highlight) => {
  console.log('渲染高亮:', highlight)
  const highlightLayer = highlightLayers.value[highlight.pageIndex]
  if (!highlightLayer) return
  
  highlight.rects.forEach(rect => {
    const highlightEl = document.createElement('div')
    highlightEl.style.position = 'absolute'
    highlightEl.style.left = `${rect.left}px`
    highlightEl.style.top = `${rect.top+3}px`
    highlightEl.style.width = `${rect.width}px`
    highlightEl.style.height = `${rect.height-5}px`
    highlightEl.style.backgroundColor = highlight.color
    highlightEl.style.opacity = '1'
    highlightEl.style.pointerEvents = 'auto'
    highlightEl.style.zIndex = '1500'
    highlightEl.style.cursor = 'pointer'
    highlightEl.dataset.highlightId = highlight.id

    highlightEl.addEventListener('dblclick',(e) => {
      handleHighlightDoubleClick(highlight)
    })
    highlightLayer.appendChild(highlightEl)
  })

}
const handleHighlightDoubleClick = (highlight) => {
  console.log('处理高亮双击:', highlight.id)
  // 例如：显示编辑菜单或删除确认
    deleteHighlightById(highlight.id)

}
const deleteHighlightById = async (highlightId) => {
  try {
    // 从后端删除
    await deleteHighlight(highlightId)
    console.log("后端删除")
    // 从本地数据中移除
    const index = highlights.value.findIndex(h => h.id === highlightId)
    if (index !== -1) {
      highlights.value.splice(index, 1)
    }

    // 从DOM中移除
    document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(el => {
      el.remove()
    })

    console.log('高亮已删除:', highlightId)
  } catch (error) {
    console.error('删除高亮失败:', error)
    alert('删除高亮失败')
  }
}
// 清除所有高亮
const clearHighlights = async () => {
  if (!confirm('确定要清除所有高亮吗？')) {
    return
  }
  
  const user = getUser()
  // if (!user || !user.id) {
  //   alert('请先登录')
  //   return
  // }
  
  if (!currentPaperId.value) {
    // 如果没有论文ID，只清除本地高亮
    highlights.value = []
    highlightLayers.value.forEach(layer => {
      if (layer) {
        layer.innerHTML = ''
      }
    })
    return
  }
  
  try {
    // 调用API清除后端高亮
    await clearPaperHighlights(currentPaperId.value, user.id)
    
    // 清除本地高亮
    highlights.value = []
    highlightLayers.value.forEach(layer => {
      if (layer) {
        layer.innerHTML = ''
      }
    })
    
    console.log('所有高亮已清除')
  } catch (error) {
    console.error('清除高亮失败:', error)
    alert('清除高亮失败，请重试')
  }
}

// 重新渲染所有高亮（在 PDF 重新加载后）
const renderAllHighlights = () => {
  highlightLayers.value.forEach(layer => {
    if (layer) {
      layer.innerHTML = ''
    }
  })
  
  highlights.value.forEach(highlight => {
    renderHighlight(highlight)
  })
}

// 添加笔记


// 导出函数供外部调用
defineExpose({
  setPaperInfo,
  loadPaperHighlights,
  currentPaperId,
  currentPaperTitle
})
</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90vh;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
}

.pdf-wrapper {
  flex: 1;
  overflow-y: scroll;
  padding-right: 8px; /* 给滚动条留出空间 */
  width: 60%;
}

.page-container {
  position: relative;
  margin-bottom: 16px;

}

canvas {
  display: block;
  border: 1px solid #eee;
}

.pdf-controls {
  padding: 10px;
  background-color: #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  gap: 20px;
  align-items: center;
}

.text-layer-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: #000; /* 深色背景下的文字颜色 */
}

.text-layer-toggle input[type="checkbox"] {
  cursor: pointer;
}

.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  /* 移除 width 和 height，由 JavaScript 动态设置固定像素值 */
  overflow: hidden;
  opacity: 1;
  line-height: 1;
  text-size-adjust: none;
  forced-color-adjust: none;
  transform-origin: 0% 0%;
  /* 确保文字层可以响应鼠标事件 */
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  /* PDF.js 文字层必需的样式 - font-size: 0 让子元素完全使用内联样式 */
  font-size: 0;
  /* 优化文字选择体验 */
  z-index: 0;
}

.textLayer-hidden {
  //pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

/* 文字层内部样式优化 - PDF.js 官方推荐样式 */
/* 注意：不要设置 left、top 和 font-size，让 PDF.js 的内联样式完全控制 */
.textLayer :deep(span) {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
  /* 不设置 left、top 和 font-size，让 PDF.js 的内联样式完全生效 */
  /* font-size 由 PDF.js 通过内联样式设置，不要在这里设置 */
  font-family: sans-serif;
  writing-mode: horizontal-tb;
  /* 确保可以选中 */
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
  /* 优化鼠标悬停体验 */
  transition: background-color 0.1s ease;
  /* 精确匹配文字高度 - 移除额外的垂直空间 */
  line-height: 1;
  margin: 0;
  padding: 0;
  /* 确保选中区域精确匹配 */
  display: inline-block;
  vertical-align: baseline;
  z-index: 0;
}

/* 鼠标悬停在文字上时的视觉反馈 */
.textLayer :deep(span:hover) {
  background-color: rgba(0, 0, 255, 0.1);
}

/* PDF.js 文字层内部 div 样式 */
.textLayer :deep(div) {
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
  pointer-events: auto;
  user-select: text;
  -webkit-user-select: text;
}

/* 选中文字时的样式 - 更明显的选中效果 */
.textLayer :deep(::selection) {
  background: rgba(0, 123, 255, 0.4);
  color: transparent;
}

.textLayer :deep(::-moz-selection) {
  background: rgba(0, 123, 255, 0.4);
  color: transparent;
}

/* 确保 canvas 不会阻挡文字层的鼠标事件 */
canvas {
  display: block;
  border: 1px solid #eee;
  pointer-events: none; /* canvas 不响应鼠标，让文字层处理 */
}

/* 高亮层样式 */
.highlightLayer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.highlight-mark {
  position: absolute;
  pointer-events: auto; /* ✅ 允许点击 */
  border-radius: 2px;
  z-index: 300;
  mix-blend-mode: multiply;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}

.highlight-mark.selected {
  outline: 2px solid #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  opacity: 0.9; /* 选中时更深一点 */
}

.clear-highlight-btn:hover {
  background-color: #ffebee;
}
.floating-highlight-btn {
  position: fixed;
  z-index: 9999;
  background-color: #fdd581;
  border: 1px solid #d4b14a;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}

.floating-highlight-btn:hover {
  background-color: #ffe9a3;
}
.floating-color-palette {
  position: fixed;
  z-index: 9999;
  display: flex;
  gap: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  pointer-events: auto; /* ✅ 允许点击 */
}

.color-option {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s, border 0.2s;
  pointer-events: auto; /* ✅ 确保子元素也能响应点击 */
}

.color-option:hover {
  transform: scale(1.2);
  border: 2px solid #555;
}
.pdf-main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 左侧 PDF 区域 */
.pdf-wrapper {
  flex: 3;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 右侧选项卡面板 */
.tab-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-left: 1px solid #ddd;
  overflow: hidden;
}

/* 选项卡头部 */
.tab-header {
  display: flex;
  border-bottom: 1px solid #ddd;
  background-color: #f5f5f5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
  color: #666;
}

.tab-item:hover {
  background-color: #e0e0e0;
}

.tab-item.active {
  background-color: #fff;
  color: #333;
  border-bottom: 3px solid #2196F3;
}

/* 选项卡内容区 */
.tab-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 笔记样式 */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.note-header h2 {
  font-size: 18px;
  margin: 0;
}

.add-note-btn, .add-ai-btn {
  background-color: #2196F3;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
}

.add-note-btn:hover, .add-ai-btn:hover {
  background-color: #2196F3;
}

.note-list {
  display: grid;
  gap: 16px;
  padding: 0 16px 16px;
  overflow-y: auto;
}

.note-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.note-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.note-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  cursor: text;
  min-height: 28px;
  padding: 4px;
  border-radius: 4px;
}

.note-title:hover {
  background-color: #f5f5f5;
}

.note-title-editing {
  margin-bottom: 8px;
}

.title-input {
  width: 100%;
  padding: 8px;
  font-size: 18px;
  font-weight: bold;
  border: 2px solid #2196F3;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
}

.title-input:focus {
  border-color: #2196F3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.note-content {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  cursor: text;
  min-height: 60px;
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.note-content:hover {
  background-color: #f5f5f5;
}

.note-content-editing {
  margin-bottom: 12px;
}

.content-textarea {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #4CAF50;
  border-radius: 4px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;
}

.content-textarea:focus {
  border-color: #2196F3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.note-delete {
  padding: 4px 12px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.note-delete:hover {
  background-color: #cc0000;
}


</style>