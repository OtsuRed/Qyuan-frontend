<template>
  <!-- 认领弹窗遮罩层 -->
  <div v-if="visible" class="claim-modal-overlay" @click.self="handleClose">
    <div class="claim-modal" :class="{ 'modal-large': isLarge }">
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <!-- 弹窗主体 -->
      <div class="modal-body">
        <form class="claim-form">
          <!-- 认领说明 -->
          <div class="form-group">
            <label class="form-label">
              认领说明 
              <span class="required" v-if="requireDescription">*</span>
            </label>
            <textarea 
              v-model="formData.description" 
              class="form-control" 
              :placeholder="descriptionPlaceholder"
              rows="5"
              :required="requireDescription"
            ></textarea>
          </div>
          
          <!-- 证明材料上传 -->
          <div class="form-group">
            <label class="form-label">
              上传认领证明材料 
              <span class="required" v-if="requireFile">*</span>
            </label>
            <div class="upload-area">
              <input 
                type="file" 
                ref="fileInput"
                class="file-input" 
                multiple
                :accept="acceptFileTypes"
                @change="handleFileUpload"
              />
              <div class="upload-hint">
                <p>{{ fileHintText }}</p>
                <p>最多可上传{{ maxFileCount }}个文件，单个文件不超过{{ maxFileSize }}MB</p>
              </div>
              
              <!-- 已上传文件列表 -->
              <div v-if="uploadedFiles.length > 0" class="file-list">
                <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                  <span class="file-name">{{ file.name }}</span>
                  <button type="button" class="remove-file" @click="removeFile(index)">×</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 联系人姓名 -->
          <div class="form-group">
            <label class="form-label">联系人姓名</label>
            <input 
              type="text" 
              v-model="formData.contactName" 
              class="form-control" 
              placeholder="请输入您的姓名"
            />
          </div>
          
          <!-- 联系电话 -->
          <div class="form-group">
            <label class="form-label">
              联系电话 
              <span class="required" v-if="requirePhone">*</span>
            </label>
            <input 
              type="tel" 
              v-model="formData.contactPhone" 
              class="form-control" 
              placeholder="请输入您的联系电话"
              :required="requirePhone"
            />
          </div>
          
          <!-- 电子邮箱 -->
          <div class="form-group">
            <label class="form-label">电子邮箱</label>
            <input 
              type="email" 
              v-model="formData.contactEmail" 
              class="form-control" 
              placeholder="请输入您的电子邮箱"
            />
          </div>
        </form>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="modal-footer">
        <button class="btn cancel-btn" @click="handleClose" :disabled="isSubmitting">取消</button>
        <button class="btn submit-btn" @click="handleSubmit" :disabled="isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>提交认领申请</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

// 1. 定义组件属性（支持自定义配置）
const props = defineProps({
  // 弹窗是否显示
  visible: {
    type: Boolean,
    default: false
  },
  // 弹窗标题（适配论文/专利等不同场景）
  title: {
    type: String,
    default: '认领申请'
  },
  // 是否大尺寸弹窗
  isLarge: {
    type: Boolean,
    default: false
  },
  // 认领说明占位符
  descriptionPlaceholder: {
    type: String,
    default: '请输入认领的原因、相关证明说明等内容...'
  },
  // 是否必填认领说明
  requireDescription: {
    type: Boolean,
    default: true
  },
  // 是否必填联系电话
  requirePhone: {
    type: Boolean,
    default: true
  },
  // 是否必填文件
  requireFile: {
    type: Boolean,
    default: true
  },
  // 支持的文件类型
  acceptFileTypes: {
    type: String,
    default: '.jpg,.png,.pdf,.docx,.doc'
  },
  // 文件上传提示文本
  fileHintText: {
    type: String,
    default: '支持上传图片、PDF、Word等格式文件'
  },
  // 最大文件数量
  maxFileCount: {
    type: Number,
    default: 5
  },
  // 单个文件最大尺寸（MB）
  maxFileSize: {
    type: Number,
    default: 10
  },
  // 初始表单数据（可选）
  initialFormData: {
    type: Object,
    default: () => ({
      description: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    })
  }
});

// 2. 定义组件事件
const emit = defineEmits([
  'close',        // 弹窗关闭事件
  'submit',       // 提交事件（返回表单数据和文件）
  'fileUpload',   // 文件上传事件
  'fileRemove'    // 文件移除事件
]);

// 3. 响应式数据
const formData = ref({ ...props.initialFormData }); // 表单数据
const uploadedFiles = ref([]); // 已上传文件列表
const fileInput = ref(null);   // 文件输入框引用
const isSubmitting = ref(false); // 提交加载状态

// 4. 先定义resetForm函数（修复核心：先定义后使用）
const resetForm = () => {
  formData.value = { ...props.initialFormData };
  uploadedFiles.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  isSubmitting.value = false; // 重置加载状态
};

// 5. 后定义watch监听（避免resetForm未初始化调用）
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
}, { immediate: true });

// 6. 方法定义
// 处理文件上传
const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  
  // 校验文件数量
  if (uploadedFiles.value.length + files.length > props.maxFileCount) {
    alert(`最多只能上传${props.maxFileCount}个文件！`);
    return;
  }
  
  // 校验文件大小并添加文件
  files.forEach(file => {
    if (file.size / 1024 / 1024 > props.maxFileSize) {
      alert(`${file.name} 超过${props.maxFileSize}MB，无法上传！`);
      return;
    }
    uploadedFiles.value.push(file);
  });
  
  // 清空输入框（允许重复选择同一文件）
  fileInput.value.value = '';
  
  // 触发文件上传事件
  emit('fileUpload', uploadedFiles.value);
};

// 移除文件
const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
  emit('fileRemove', uploadedFiles.value);
};

// 关闭弹窗
const handleClose = () => {
  emit('close');
};

// 提交认领申请
const handleSubmit = () => {
  // 基础校验
  if (props.requireDescription && !formData.value.description.trim()) {
    alert('请填写认领说明！');
    return;
  }
  if (props.requirePhone && !formData.value.contactPhone.trim()) {
    alert('请填写联系电话！');
    return;
  }
  if (props.requireFile && uploadedFiles.value.length === 0) {
    alert('请上传认领证明材料！');
    return;
  }
  
  // 标记提交中
  isSubmitting.value = true;
  
  // 触发提交事件，返回表单数据和文件
  emit('submit', {
    formData: { ...formData.value },
    files: [...uploadedFiles.value]
  });
  
  // 提交后重置状态（通过watch监听visible关闭触发resetForm）
};
</script>

<style scoped>
/* 弹窗遮罩层 */
.claim-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 弹窗容器 */
.claim-modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 大尺寸弹窗 */
.modal-large {
  max-width: 800px;
}

/* 弹窗头部 */
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

/* 弹窗主体 */
.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.required {
  color: #ff4d4f;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

/* 文件上传区域 */
.upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 15px;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #4096ff;
  background: #f8f9ff;
}

.file-input {
  display: none;
}

/* 自定义上传按钮样式（隐藏默认input，用label触发） */
.upload-area::before {
  content: "点击上传文件";
  display: inline-block;
  padding: 6px 16px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

/* 文件列表 */
.file-list {
  margin-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #fafafa;
  border-radius: 4px;
  margin-bottom: 6px;
}

.file-name {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.remove-file {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.remove-file:hover {
  background: #ff4d4f;
  color: white;
}

/* 弹窗底部 */
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #333;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.submit-btn {
  background: #4096ff;
  color: white;
}

.submit-btn:hover {
  background: #1890ff;
}

.submit-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
</style>