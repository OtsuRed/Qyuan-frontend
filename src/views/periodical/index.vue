<script setup>

import Head from "@/views/components/Head.vue";
import periodical from "@/views/periodical/periodical.vue";


</script>

<template>
  <div>
    <Head/>
    <!--    <h1>这是一个期刊查看页面</h1>-->
    <!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <periodical></periodical>
  </div>
</template>

<style scoped>

</style>