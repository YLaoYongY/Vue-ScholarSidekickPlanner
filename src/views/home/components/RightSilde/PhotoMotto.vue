<script setup>
  import { ref } from 'vue'

  // 轮播图数据
  const item = [
    '/src/assets/images/1.png',
    '/src/assets/images/2.png',
    '/src/assets/images/3.jpeg',
    '/src/assets/images/4.JPG',
  ]
  // 座右铭数据
  const maxims = ref([
    { text: '他日我若为青帝，报与桃李一处开。', author: '黄巢' },
    { text: '路漫漫其修远兮，吾将上下而求索。', author: '屈原' },
    { text: '天行健，君子以自强不息。', author: '《周易》' },
    { text: '博观而约取，厚积而薄发。', author: '苏轼' },
  ])
  const currentMaximIndex = ref(0)

  const nextMaxim = () => {
    currentMaximIndex.value = (currentMaximIndex.value + 1) % maxims.value.length
  }
</script>
<template>
  <li class="status-card" style="min-height: 300px">
    <div class="top-img">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in item" :key="item">
          <img :src="item" alt="" />
        </el-carousel-item>
      </el-carousel>
      <div class="maxim" @click="nextMaxim">
        <h2 class="maxim-text" style="font-weight: 200; margin: 10px 0">
          {{ maxims[currentMaximIndex].text }}
        </h2>
        <h3 class="author" style="font-weight: 200">——{{ maxims[currentMaximIndex].author }}</h3>
      </div>
    </div>
  </li>
</template>
<style scoped>
  .status-card {
    flex: 1 1 30%; /* 基础30%宽度 */
    min-width: 300px; /* 最小卡片宽度 */
    max-width: calc(88%); /* 最大不超过1/3 */
    box-sizing: border-box;
    border-radius: 30px;
    box-shadow: 0 2rem 3rem rgba(132, 139, 200, 0.18);
    /* padding: 15px; 减小内边距 */
    height: 30%; /* 适当降低高度 */
    transition: all 0.3s; /* 添加过渡效果 */
    margin: auto;
    margin-bottom: 1rem;
    position: relative;
    perspective: 1000px;
  }
  .status-card .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  } /* 轮播图样式 */
  .top-img {
    /* flex: 1, 1, 50%; */
    height: 60%;
  }
  .el-carousel {
    height: 100%;
  }
  .el-carousel__item {
    height: 100%;
  }
  .el-carousel__item img {
    width: 100%;
    height: 60%;
    border-radius: 30px 30px 0 0;
  }
  /* 座右铭样式 */
  .maxim {
    width: 100%;
    height: 60%;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    transition: transform 0.2s;
    user-select: none; /* 新增 */
    /* background-color: #2128f7; */
  }
  .maxim:active {
    transform: scale(0.98);
  }
  /* 名人名言 */
  .author {
    float: right;
  }
</style>
