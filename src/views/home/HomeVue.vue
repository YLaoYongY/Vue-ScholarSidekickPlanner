<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import TaskCompletion from './components/MainContent/TaskCompletion.vue'
  import MainVue from './components/MainContent/MainVue.vue'
  import RightSlide from './components/RightSilde/RightSlide.vue'
  import draggable from 'vuedraggable'
  import { Rank, Plus } from '@element-plus/icons-vue'

  // 任务主体
</script>
<template>
  <div class="home">
    <div class="left-content">
      <main-vue></main-vue>
    </div>
    <right-slide></right-slide>
  </div>
</template>

<style scoped>
  * {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .home {
    display: flex;
    height: 100vh; /* 确保容器高度 */
    gap: 20px; /* 添加间距 */
    background: #f6f6f9;
    width: 100%;
    overflow: hidden;
  }

  .left-content {
    flex: 1 1 60%;
    /* 移除固定min-width */
    min-width: auto;
    /* 添加最小宽度约束 */
    min-width: 400px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    /* 使用相对单位 */
    max-width: 75%;
  }

  .flip-content {
  }
  .left-flip,
  .right-flip {
    display: flex;
    flex: 1 1 40%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
  }
  .left-flip {
  }

  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
</style>
