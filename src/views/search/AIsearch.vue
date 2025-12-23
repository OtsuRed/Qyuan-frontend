<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import {aiReceiveSearch, aiSendSearch} from "@/api/ai.js";

const taskId = ref('')
const aiQuestion = ref('')
const isStreaming = ref(false) // 添加流式响应状态
const currentStreamingMessage = ref(null) // 当前正在流式响应的消息

const conversations = ref([
  {
    id: 1,
    type: 'ai',
    content: '您好！我是您的AI助手，很高兴为您服务。我可以帮您解答问题、分析内容、提供建议等。有什么我可以帮助您的吗？',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isStreaming: false
  }
])

const messagesContainer = ref(null)

// 新增：流式响应处理函数
// 修改后的流式响应处理函数
const handleStreamResponse = async () => {
  if (!taskId.value) return

  isStreaming.value = true

  // 创建占位消息
  const streamingMessage = {
    id: conversations.value.length + 1,
    type: 'ai',
    content: '', // 开始时为空
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isStreaming: true
  }

  conversations.value.push(streamingMessage)
  currentStreamingMessage.value = streamingMessage

  // 立即显示一个加载指示器
  conversations.value = [...conversations.value]

  try {
    let back_data = {
      top_k: 5,
      task_id: taskId.value,
    }

    console.log('发送请求，task_id:', taskId.value)

    // 调用API获取流式响应
    const response = await aiReceiveSearch(back_data)

    if (!response.body) {
      throw new Error('响应不包含可读流')
    }

    // 开始读取流
    await readStreamResponse(response.body, streamingMessage)

  } catch (error) {
    console.error('流式响应错误:', error)

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      streamingMessage.content += '\n\n(响应超时，显示部分结果)'
    } else if (error.message.includes('HTTP error')) {
      streamingMessage.content = `服务器错误: ${error.message}`
    } else {
      streamingMessage.content = `请求失败: ${error.message}`
    }

    streamingMessage.isStreaming = false
    streamingMessage.timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  } finally {
    currentStreamingMessage.value = null
    isStreaming.value = false
    conversations.value = [...conversations.value]
  }
}
// 读取流式响应的核心函数
const readStreamResponse = async (stream, streamingMessage) => {
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')
  let accumulatedContent = ''

  try {
    streamingMessage.content = ''
    conversations.value = [...conversations.value]
    await nextTick()

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      console.log('收到数据块:', chunk)

      // 处理SSE格式数据
      const lines = chunk.split('\n')
      for (let line of lines) {
        line = line.trim()
        if (!line || line.startsWith(':')) continue

        if (line.startsWith('data: ')) {
          const dataStr = line.substring(6).trim()

          if (dataStr === '[DONE]') {
            streamingMessage.isStreaming = false
            streamingMessage.timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            conversations.value = [...conversations.value]
            return
          }

          try {
            const data = JSON.parse(dataStr)
            // 提取内容
            let content = ''
            if (data.summary_chunk) content = data.summary_chunk
            else if (data.content) content = data.content
            else if (data.message) content = data.message
            else if (data.data) content = data.data

            if (content) {
              accumulatedContent += content
              streamingMessage.content = accumulatedContent

              // 关键：使用异步更新，允许UI渲染
              await nextTick()
              conversations.value = [...conversations.value]

              // 滚动到底部
              scrollToBottom()

              // 微小的延迟，确保UI有更新机会
              await new Promise(resolve => setTimeout(resolve, 10))
            }
          } catch (e) {
            console.warn('解析JSON失败:', e)
          }
        }
      }
    }

  } finally {
    reader.releaseLock()
    streamingMessage.isStreaming = false
    streamingMessage.timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    conversations.value = [...conversations.value]
  }
}// 提取内容数据的辅助函数
const processSSEChunk = (chunk, currentContent) => {
  let newContent = currentContent
  let isDone = false

  // 按行分割处理
  const lines = chunk.split('\n')

  for (let line of lines) {
    line = line.trim()

    if (!line) continue // 跳过空行

    // 处理SSE格式：data: {json}
    if (line.startsWith('data: ')) {
      const dataStr = line.substring(6).trim()

      // 检查是否结束
      if (dataStr === '[DONE]') {
        isDone = true
        continue
      }

      // 解析JSON数据
      try {
        const data = JSON.parse(dataStr)
        console.log('解析到的JSON数据:', data)

        // 根据实际数据结构提取内容
        if (data.summary_chunk) {
          newContent += data.summary_chunk
        } else if (data.content) {
          newContent += data.content
        } else if (data.message) {
          newContent += data.message
        } else if (data.data) {
          newContent += data.data
        } else if (typeof data === 'string') {
          newContent += data
        }

      } catch (e) {
        console.warn('解析JSON失败:', e, '原始数据:', dataStr)
        // 如果不是JSON，直接当作文本添加
      }
    } else if (!line.startsWith(':')) {
      // 如果不是SSE格式的注释，直接添加（可能是纯文本流）
      // newContent += line
    }
  }

  return {
    content: newContent,
    done: isDone
  }
}

// 修改sendAIQuestion函数
const sendAIQuestion = async () => {
  if (!aiQuestion.value.trim() || isStreaming.value) return

  // 生成任务ID
  taskId.value = crypto.randomUUID()

  // 添加用户消息
  const userMessage = {
    id: conversations.value.length + 1,
    type: 'user',
    content: aiQuestion.value.trim(),
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isStreaming: false
  }

  conversations.value.push(userMessage)
  console.log('用户问题:', aiQuestion.value, 'task_id:', taskId.value)

  // 发送搜索请求
  try {
    let data = {
      "natural_language": aiQuestion.value,
      "project_id": crypto.randomUUID(),
      "task_id": taskId.value,
      "search_num": 5
    }

    await aiSendSearch(data)

    // 清除输入框
    aiQuestion.value = ''

    // 等待消息渲染完成
    await nextTick()
    scrollToBottom()
    //延迟5s
    await new Promise(resolve => setTimeout(resolve, 5000))
    // 开始流式响应
    setTimeout(() => {
      handleStreamResponse()
    }, 100) // 稍微延迟，确保后端已准备好

  } catch (error) {
    console.error('发送请求失败:', error)
    // 添加错误消息
    conversations.value.push({
      id: conversations.value.length + 1,
      type: 'ai',
      content: '抱歉，请求发送失败，请稍后重试。',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false
    })
  }
}

// 新增：停止流式响应
const stopStreaming = () => {
  if (currentStreamingMessage.value) {
    currentStreamingMessage.value.isStreaming = false
    currentStreamingMessage.value.timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    currentStreamingMessage.value = null
    isStreaming.value = false
  }
}

const addAIConversation = () => {
  conversations.value = []
  stopStreaming()
  console.log('开始新对话')
}

const clearInput = () => {
  aiQuestion.value = ''
}

// 修改滚动到底部函数
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听对话变化，滚动到底部
watch(conversations, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// 模拟初始加载
onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
const formatMessageContent=(content)=>{
  // 简单的格式处理，可以扩展为Markdown解析
  let formatted = content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return formatted
}
let copyToClipboard=async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // 可以添加复制成功的提示
    console.log('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<script>
// 添加辅助函数
export default {
  methods: {

  }
}
</script>

<template>
  <div class="ai-container">
    <div class="ai-content">
      <!-- 消息区域 -->
      <div class="ai-messages-wrapper">
        <div class="ai-messages" ref="messagesContainer">
          <!-- 对话历史区域 -->
          <div class="conversation-list">
            <!-- 消息项 -->
            <div
                v-for="message in conversations"
                :key="message.id"
                :class="['message-item', message.type, { streaming: message.isStreaming }]"
            >
              <!-- 消息头部 -->
              <div class="message-header">
                <div class="message-avatar" :class="message.type">
                  <span v-if="message.type === 'ai'">AI</span>
                  <span v-else>您</span>
                </div>
                <div class="message-info">
                  <span class="message-sender">{{ message.type === 'ai' ? 'AI搜索助手' : '您' }}</span>
                  <span class="message-time">{{ message.timestamp }}</span>
                </div>

                <!-- 流式响应时的状态指示器 -->
                <div v-if="message.isStreaming" class="streaming-indicator">
                  <div class="streaming-dot"></div>
                  <div class="streaming-dot"></div>
                  <div class="streaming-dot"></div>
                  <span class="streaming-text">正在思考...</span>
                  <button class="stop-streaming-btn" @click="stopStreaming" title="停止生成">
                    停止
                  </button>
                </div>
              </div>

              <!-- 消息内容 -->
              <div class="message-bubble">
                <div class="bubble-content" v-html="formatMessageContent(message.content)"></div>

                <!-- 流式响应光标 -->
                <div v-if="message.isStreaming && message.content" class="streaming-cursor">▋</div>

                <!-- 消息装饰元素 -->
                <div class="bubble-decoration"></div>
              </div>

              <!-- 消息操作按钮 -->
              <div class="message-actions" v-if="!message.isStreaming">
                <button class="action-btn" title="复制" @click="copyToClipboard(message.content)">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                  </svg>
                </button>
                <button class="action-btn" title="重新生成" v-if="message.type === 'ai'">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="ai-input-container">
        <div class="input-wrapper">
          <div class="textarea-container" :class="{ 'streaming-disabled': isStreaming }">
            <textarea
                v-model="aiQuestion"
                placeholder="在这里输入您的问题..."
                class="ai-textarea"
                @keydown.enter.exact.prevent="sendAIQuestion"
                @keydown.shift.enter="(e) => { e.preventDefault(); const cursorPos = e.target.selectionStart; aiQuestion = aiQuestion.slice(0, cursorPos) + '\n' + aiQuestion.slice(cursorPos); }"
                rows="3"
                maxlength="1000"
                :disabled="isStreaming"
            ></textarea>

            <div class="textarea-footer">
              <div class="char-count">
                {{ aiQuestion.length }}/1000
              </div>
              <div class="textarea-actions">
                <button class="action-btn" title="清除" @click="clearInput" :disabled="isStreaming">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
                <button
                    class="ai-send-btn"
                    @click="sendAIQuestion"
                    :disabled="!aiQuestion.trim() || isStreaming"
                >
                  <span class="send-text">{{ isStreaming ? '生成中...' : '发送' }}</span>
                  <svg class="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="!isStreaming">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                  </svg>
                  <div v-else class="loading-spinner"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 头部样式 */
.ai-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 8px;
}

.header-text h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
}

.add-ai-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.add-ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-ai-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 内容区域 - 使用弹性布局 */
.ai-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 重要：防止内容溢出 */
  background: rgba(249, 249, 252, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  margin: 16px;
  overflow: hidden;
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

/* 消息包装器 - 固定高度区域 */
.ai-messages-wrapper {
  flex: 1;
  min-height: 75%; /* 最小高度 */
  max-height: calc(100vh - 300px); /* 最大高度 */
  position: relative;
  overflow: hidden;
}

.ai-messages {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  background:
      linear-gradient(180deg, rgba(249, 249, 252, 0.8) 0%, transparent 100%),
      radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
}

/* 滚动到底部提示 */
.scroll-indicator {
  position: sticky;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  z-index: 10;
  margin-top: 20px;
}

.scroll-indicator:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.scroll-arrow {
  width: 16px;
  height: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

/* 欢迎卡片 */
.welcome-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 248, 255, 0.95) 100%);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
      0 20px 40px rgba(102, 126, 234, 0.15),
      0 0 0 1px rgba(102, 126, 234, 0.05) inset;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.welcome-text h3 {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text p {
  margin: 8px 0;
  color: #666;
  line-height: 1.5;
}

/* 消息列表 */
.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100px; /* 最小高度保证内容显示 */
}

/* 消息项 */
.message-item {
  animation: fadeIn 0.4s ease-out;
}

.message-item.ai {
  margin-right: auto;
  max-width: 85%;
}

.message-item.user {
  margin-left: auto;
  max-width: 85%;
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-avatar.ai {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-avatar.user {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
}

.message-info {
  display: flex;
  flex-direction: column;
}

.message-sender {
  font-weight: 600;
  font-size: 18px;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

/* 消息气泡 */
.message-bubble {
  position: relative;
  padding: 20px;
  border-radius: 18px;
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.5) inset;
  transition: all 0.3s ease;
}

.message-item.ai .message-bubble {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 255, 0.98) 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-left: 48px;
  border-left: 4px solid #667eea;
}

.message-item.user .message-bubble {
  background: linear-gradient(135deg, rgba(236, 252, 240, 0.98) 0%, rgba(232, 248, 238, 0.98) 100%);
  border: 1px solid rgba(76, 175, 80, 0.1);
  margin-right: 48px;
  border-right: 4px solid #4CAF50;
}

.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.12),
      0 1px 0 rgba(255, 255, 255, 0.5) inset;
}

.bubble-content {
  position: relative;
  z-index: 2;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* 气泡装饰元素 */
.bubble-decoration {
  position: absolute;
  z-index: 1;
  opacity: 0.1;
  pointer-events: none;
}

.message-item.ai .bubble-decoration {
  right: 10px;
  bottom: 10px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #667eea 0%, transparent 70%);
  border-radius: 50%;
}

.message-item.user .bubble-decoration {
  left: 10px;
  top: 10px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #4CAF50 0%, transparent 70%);
  border-radius: 50%;
}

/* 消息操作按钮 */
.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;
}

.message-item:hover .message-actions {
  opacity: 1;
  transform: translateY(0);
}

.message-item.ai .message-actions {
  margin-left: 48px;
}

.message-item.user .message-actions {
  justify-content: flex-end;
  margin-right: 48px;
}

/* 输入容器 */
.ai-input-container {
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 24px;
  min-height: 30%;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  max-width: 800px;
  min-height: 50%;
  margin: 0 auto;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
}

.input-tips {
  display: flex;
  gap: 12px;
}

.tip {
  font-size: 12px;
  color: #888;
  padding: 2px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
}

/* 文本域容器 */
.textarea-container {
  border: 2px solid rgba(102, 126, 234, 0.15);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 249, 252, 0.95) 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
}

.textarea-container:focus-within {
  border-color: #667eea;
  box-shadow:
      0 8px 25px rgba(102, 126, 234, 0.2),
      0 0 0 3px rgba(102, 126, 234, 0.1);
}

.ai-textarea {
  width: 100%;
  padding: 18px;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  outline: none;
  color: #333;
  min-height: 80px;
  max-height: 200px;
}

.ai-textarea::placeholder {
  color: #aaa;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(249, 249, 252, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.char-count {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.textarea-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.action-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.2);
}

.ai-send-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.ai-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 16px;
  height: 16px;
}

/* 滚动条美化 */
.ai-messages::-webkit-scrollbar {
  width: 8px;
}

.ai-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.ai-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.ai-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4a9c 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-header {
    padding: 12px 16px;
  }

  .ai-content {
    margin: 0 8px 8px;
    border-radius: 16px 16px 0 0;
  }

  .ai-messages-wrapper {
    min-height: 200px;
    max-height: calc(100vh - 250px);
  }

  .welcome-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .message-item.ai,
  .message-item.user {
    max-width: 95%;
  }

  .message-item.ai .message-bubble {
    margin-left: 32px;
  }

  .message-item.user .message-bubble {
    margin-right: 32px;
  }

  .message-item.ai .message-actions {
    margin-left: 32px;
  }

  .message-item.user .message-actions {
    margin-right: 32px;
  }

  .input-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .input-tips {
    flex-wrap: wrap;
  }

  .ai-send-btn {
    padding: 8px 16px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card {
  animation: fadeIn 0.6s ease-out;
}

/* 悬浮效果增强 */
.message-bubble::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 18px;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0) 0%,
  rgba(255, 255, 255, 0.3) 50%,
  rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.message-bubble:hover::after {
  opacity: 1;
}
/* 流式响应状态样式 */
.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  font-size: 12px;
}

.streaming-dot {
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
  animation: streamingPulse 1.4s infinite ease-in-out;
}

.streaming-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.streaming-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes streamingPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.streaming-text {
  color: #667eea;
  font-weight: 500;
}

.stop-streaming-btn {
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stop-streaming-btn:hover {
  background: rgba(255, 59, 48, 0.2);
}

/* 流式响应光标 */
.streaming-cursor {
  display: inline-block;
  animation: cursorBlink 1s infinite;
  margin-left: 2px;
  color: #667eea;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 流式响应中的消息样式 */
.message-item.streaming .message-bubble {
  position: relative;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.98) 0%,
  rgba(245, 247, 255, 0.98) 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow:
      0 10px 30px rgba(102, 126, 234, 0.15),
      0 0 0 1px rgba(102, 126, 234, 0.05) inset;
}

.message-item.streaming .message-bubble::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg,
  rgba(102, 126, 234, 0.1) 0%,
  rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  z-index: -1;
  animation: streamingGlow 2s infinite ease-in-out;
}

@keyframes streamingGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 流式响应时禁用样式 */
.streaming-disabled {
  opacity: 0.7;
  pointer-events: none;
}

.streaming-disabled .ai-textarea {
  background: rgba(249, 249, 252, 0.5);
}

/* 确保消息内容格式正确 */
.bubble-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble-content code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9em;
}

.bubble-content pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .streaming-indicator {
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-top: 4px;
  }

  .stop-streaming-btn {
    margin-left: 4px;
  }
}
</style>