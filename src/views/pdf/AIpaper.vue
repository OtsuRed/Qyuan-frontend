<template>
  <div class="compact-ai">
    <!-- 紧凑头部 -->
    <div class="ai-header">
      <h3 class="header-title">AI论文助手</h3>
    </div>

    <!-- 消息区域 -->
    <div class="ai-messages">
      <div class="welcome-msg" v-if="!conversations.length">
        <p>有什么可以帮您？</p>
      </div>

      <!-- 对话历史 -->
      <div class="message-list">
        <div
            v-for="(msg, index) in conversations"
            :key="index"
            :class="['message-item', msg.type]"
        >
          <div class="message-avatar">
            {{ msg.type === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="message-content">
            {{ msg.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="ai-input">
      <div class="input-box">
        <textarea
            v-model="aiQuestion"
            placeholder="输入您的问题..."
            @keydown.enter.exact.prevent="sendAIQuestion"
            rows="2"
            ref="textAreaRef"
        ></textarea>
        <button
            class="send-btn"
            @click="sendAIQuestion"
            :disabled="!aiQuestion.trim()"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, nextTick, watch} from 'vue'

const aiQuestion = ref('')
const conversations = ref([])
const textAreaRef = ref(null)

const sendAIQuestion = async () => {
  const question = aiQuestion.value.trim()
  if (!question) return

  // 添加用户消息
  conversations.value.push({
    type: 'user',
    content: question,
    time: new Date()
  })

  // 清空输入框
  aiQuestion.value = ''

  // 这里添加调用AI API的逻辑
  // 模拟AI回复
  setTimeout(() => {
    conversations.value.push({
      type: 'ai',
      content: `这是对"${question}"的模拟回答。`,
      time: new Date()
    })
    scrollToBottom()
  }, 500)

  // 等待DOM更新后滚动到底部
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  const container = document.querySelector('.ai-messages')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 自适应文本区域高度
const adjustTextAreaHeight = () => {
  if (textAreaRef.value) {
    textAreaRef.value.style.height = 'auto'
    textAreaRef.value.style.height = Math.min(textAreaRef.value.scrollHeight, 100) + 'px'
  }
}

watch(aiQuestion, adjustTextAreaHeight)
</script>

<style scoped>
.compact-ai {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 头部样式 */
.ai-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-icon {
  font-size: 20px;
  margin-right: 10px;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* 消息区域 */
.ai-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
  height: 100%;
}
.ai-input {
  padding-left: 16px;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
  height: 100px;
}

.welcome-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0;
  color: #666;
}

.welcome-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.welcome-msg p {
  margin: 0;
  font-size: 14px;
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  gap: 10px;
  animation: fadeIn 0.3s ease;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-item.ai .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-item.user .message-avatar {
  background: #e8f0fe;
  color: #667eea;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-item.ai .message-content {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.message-item.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 输入区域 */


.input-box {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
}

.input-box textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.3s;
  font-family: inherit;
}

.input-box textarea:focus {
  border-color: #667eea;
}

.send-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-tip {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

/* 滚动条样式 */
.ai-messages::-webkit-scrollbar {
  width: 4px;
}

.ai-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.ai-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.ai-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {


  .ai-header,
  .ai-input {
    padding: 10px 12px;
  }

  .ai-messages {
    padding: 12px;
    max-height: 250px;
  }

  .message-content {
    max-width: 80%;
  }
}
</style>