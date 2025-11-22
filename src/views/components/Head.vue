
<template>
  <div class="root-head">
    <div class="left">
      <el-image :src="logoSrc" alt="logo" class="logo"/>
    </div>
    <div class="right">
        <div class="user">
          <el-image :src="userSrc" alt="user" class="user_icon"/>
          <el-text class="username">littttlered</el-text>
        </div>
      <div class="head_text">
        <div>订阅服务</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import logoSrc from '@/asserts/head/logo.png'
import userSrc from '@/asserts/head/user_icon.png'
import router from "@/routes/index.js";
</script>
<style scoped>
.root-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 35%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user {
  border: 1px solid blue;
  width: 180px;
  height: 50px;
  display: flex;              /* 使用flex布局 */
  align-items: center;        /* 垂直居中 */
  padding: 0 10px;            /* 添加内边距 */
  box-sizing: border-box;     /* 包含边框和内边距 */
  border-image: linear-gradient(45deg, #535bf2, #00ccff) 1;
}
.username {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(45deg, #535bf2, #00ccff); /* 添加渐变背景 */
  -webkit-background-clip: text;                        /* 裁剪背景到文字 */
  background-clip: text;                                /* 标准语法 */
  -webkit-text-fill-color: transparent;                 /* 文字填充透明 */
  color: transparent;                                   /* 兼容性设置 */
}

.user_icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;         /* 改为右边距，与用户名分隔 */
}
.left {
  margin-left: 3%;
  display: flex;
  flex-direction: row;
}
.logo{
  width: 200px;
  object-fit: cover;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.right {
  display: flex;
  margin-right: 10%;
  flex-direction: row-reverse;
}

.head_text {
  margin: auto 30px;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.head_text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #535bf2, #00ccff);
  transition: width 0.3s ease;
}

.head_text:hover::after {
  width: 100%;
}

.title{
  font-size: 3vh;
  cursor: pointer;
  margin-right: 50px;
  width: 150px;
  color: white;
}
</style>