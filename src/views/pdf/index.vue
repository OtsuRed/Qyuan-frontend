
<template>
  <div>
    <Navigation/>
<!--    <h1>这是一个订单页面</h1>-->
<!--    <router-view></router-view>-->
    <!-- 使用正确的静态资源路径 -->
    <PdfUploaderReader></PdfUploaderReader>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Head from '@/views/components/Head.vue'
import PdfUploaderReader  from "./pdf.vue";
import Navigation from "@/views/components/Navigation.vue";
</script>

<style scoped>

</style>