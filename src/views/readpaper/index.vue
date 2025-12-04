<script setup>

import Head from "@/views/components/Head.vue";

import paper from "@/views/readpaper/paper.vue";

</script>

<template>
  <div>
    <Head/>
    <!--    <h1>这是一个论文查看页面</h1>-->
    <!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <paper></paper>
  </div>
</template>

<style scoped>

</style>