<template>
  <div class="my-profile">
    <!-- 个人信息 -->
    <div v-if="activeTab === 'profile'" class="tab-content">
      <div class="info-panel">
        <div class="panel-header">
          <h3>个人信息</h3>
          <button @click="editMode = true" class="edit-btn">
            <i>✏️</i> 编辑
          </button>
        </div>

        <div v-if="!editMode" class="info-display">
          <div class="info-row">
            <span class="label">用户名</span>
            <span class="value">{{ userInfo.username }}</span>
          </div>
          <div class="info-row">
            <span class="label">邮箱</span>
            <span class="value">{{ userInfo.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">手机号</span>
            <span class="value">{{ userInfo.phone }}</span>
          </div>
          <div class="info-row">
            <span class="label">性别</span>
            <span class="value">{{ userInfo.gender }}</span>
          </div>
          <div class="info-row">
            <span class="label">机构</span>
            <span class="value">{{ userInfo.institution }}</span>
          </div>
          <div class="info-row">
            <span class="label">职称</span>
            <span class="value">{{ userInfo.title }}</span>
          </div>
          <div class="info-row full-width">
            <span class="label">个人简介</span>
            <span class="value">{{ userInfo.bio }}</span>
          </div>
          <div class="info-row full-width">
            <span class="label">研究领域</span>
            <div class="tags">
              <span
                  v-for="field in userInfo.researchFields"
                  :key="field"
                  class="tag"
              >
                {{ field }}
              </span>
            </div>
          </div>
        </div>

        <form v-else class="edit-form" @submit.prevent="saveProfile">
          <div class="form-row">
            <div class="form-group">
              <label>用户名</label>
              <input v-model="editInfo.username" type="text">
            </div>
            <div class="form-group">
              <label>性别</label>
              <select v-model="editInfo.gender">
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>机构</label>
            <input v-model="editInfo.institution" type="text">
          </div>

          <div class="form-group">
            <label>职称</label>
            <input v-model="editInfo.title" type="text">
          </div>

          <div class="form-group">
            <label>个人简介</label>
            <textarea v-model="editInfo.bio" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>研究领域</label>
            <div class="tags-editor">
              <div class="current-tags">
                <span
                    v-for="(field, index) in editInfo.researchFields"
                    :key="field"
                    class="tag editable"
                    @click="removeField(index)"
                >
                  {{ field }} ×
                </span>
              </div>
              <div class="add-tag">
                <input
                    v-model="newField"
                    type="text"
                    placeholder="输入研究领域，回车添加"
                    @keyup.enter="addField"
                >
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelEdit" class="cancel-btn">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
    <!-- 账号设置 -->
    <div v-if="activeTab === 'account'" class="tab-content">
      <div class="info-panel">
        <h3>账号设置</h3>
        <div class="setting-item">
          <div class="setting-info">
            <h4>绑定邮箱</h4>
            <p>当前邮箱：{{ userInfo.email }}</p>
            <p class="hint">用于接收重要通知和验证</p>
          </div>
          <button @click="showEmailModalFunc" class="update-btn">更新邮箱</button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>手机绑定</h4>
            <p>当前手机：{{ userInfo.phone || '未绑定' }}</p>
            <p class="hint">用于账号保护和验证码登录</p>
          </div>
          <button @click="showPhoneModal" class="update-btn">
            {{ userInfo.phone ? '更换手机' : '绑定手机' }}
          </button>
        </div>
      </div>
    </div>
    <!-- 安全中心 -->
    <div v-if="activeTab === 'security'" class="tab-content">
      <div class="info-panel">
        <h3>安全中心</h3>
        <div class="setting-item">
          <div class="setting-info">
            <h4>修改密码</h4>
            <p>定期修改密码可以提高账号安全性</p>
          </div>
          <button @click="showPasswordModalFunc" class="update-btn">修改密码</button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>登录设备管理</h4>
            <p>查看和管理已登录的设备</p>
          </div>
          <button @click="showDevices" class="view-btn">查看</button>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <h4>账号安全等级</h4>
            <div class="security-level">
              <div class="level-bar">
                <div class="level-fill" :style="{ width: '80%' }"></div>
              </div>
              <span class="level-text">高</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 偏好设置 -->
    <div v-if="activeTab === 'preferences'" class="tab-content">
      <div class="info-panel">
        <h3>偏好设置</h3>
        <!-- 主题设置 -->
        <div class="setting-item">
          <div class="setting-info">
            <h4>主题设置</h4>
            <p>选择你喜欢的界面主题</p>
          </div>
          <ThemeSwitch />
        </div>
      </div>
    </div>
    <!-- 模态框 -->
    <UpdateEmailModal
        v-if="showEmailModal"
        @close="showEmailModalFunc = false"
        @update="updateEmail"
    />
    <UpdatePasswordModal
        v-if="showPasswordModal"
        @close="showPasswordModalFunc = false"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import UpdateEmailModal from './components/UpdateEmailModal.vue';
import UpdatePasswordModal from './components/UpdatePasswordModal.vue';
import ThemeSwitch from '@/views/components/ThemeSwitch.vue'

const props = defineProps({
  userInfo: Object,
  activeTab: String
});

// 偏好设置数据
const language = ref('zh-CN')
const emailNotifications = ref(true)
const researchRecommendations = ref(true)


const emit = defineEmits(['update-info']);

const editMode = ref(false);
const editInfo = ref({});
const newField = ref('');
const showEmailModal = ref(false);
const showPasswordModal = ref(false);

// 初始化编辑信息
const initEditInfo = () => {
  editInfo.value = {
    username: props.userInfo.username,
    gender: props.userInfo.gender,
    institution: props.userInfo.institution,
    title: props.userInfo.title,
    bio: props.userInfo.bio,
    researchFields: [...props.userInfo.researchFields]
  };
};

// 监听tab变化，退出编辑模式
watch(() => props.activeTab, () => {
  editMode.value = false;
});

// 保存个人信息
const saveProfile = () => {
  emit('update-info', editInfo.value);
  editMode.value = false;
};

// 取消编辑
const cancelEdit = () => {
  editMode.value = false;
};

// 添加研究领域
const addField = () => {
  if (newField.value.trim() && !editInfo.value.researchFields.includes(newField.value.trim())) {
    editInfo.value.researchFields.push(newField.value.trim());
    newField.value = '';
  }
};

// 移除研究领域
const removeField = (index) => {
  editInfo.value.researchFields.splice(index, 1);
};

// 显示邮箱修改模态框
const showEmailModalFunc = () => {
  showEmailModal.value = true;
};

// 显示密码修改模态框
const showPasswordModalFunc = () => {
  showPasswordModal.value = true;
};

// 显示手机修改
const showPhoneModal = () => {
  console.log('显示手机修改');
};

// 显示设备管理
const showDevices = () => {
  console.log('显示设备管理');
};

// 更新邮箱
const updateEmail = (newEmail) => {
  emit('update-info', { email: newEmail });
};
</script>

<style scoped src="./MyProfile.styles.css"></style>