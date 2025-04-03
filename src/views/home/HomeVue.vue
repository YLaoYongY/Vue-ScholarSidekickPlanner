<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  const currentTime = ref('')
  const currentDate = ref('')
  const flipInterval = ref(null)
  const restoreTimer = ref(null)
  const isHovered = ref(false)

  const isFlipped = ref(false)

  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString()
    currentDate.value = now.toLocaleDateString()
  }

  const flipCard = () => {
    isFlipped.value = !isFlipped.value
  }

  // 清除所有定时器
  const clearAllTimers = () => {
    if (flipInterval.value) clearTimeout(flipInterval.value)
    if (restoreTimer.value) clearTimeout(restoreTimer.value)
    flipInterval.value = null
    restoreTimer.value = null
  }
  let timer
  const startInterval = () => {
    const flipWithRestore = () => {
      if (!isHovered.value) {
        flipCard()
        timer = setTimeout(() => {
          if (!isHovered.value) flipCard()
          timer = setTimeout(flipWithRestore, 5000)
        }, 9999999000)
      }
    }

    // 初始化执行
    if (!isHovered.value) flipWithRestore()

    return () => {
      clearTimeout(timer)
    }
  }

  // 鼠标事件处理
  const handleMouseEnter = () => {
    isHovered.value = true
    clearTimeout(timer)
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    startInterval()
  }
  onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
    startInterval()
  })

  onBeforeUnmount(() => {
    clearAllTimers()
  })
</script>
<template>
  <div class="home">
    <div class="left-content">
      <h2 class="header">任务完成情况</h2>
      <ul class="chart-container">
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>昨日任务进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1">
              <el-progress type="dashboard" :percentage="75">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">今日任务进度</span>
                </template>
              </el-progress>
            </div>
          </div>
        </li>
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>今日任务进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1">
              <el-progress type="dashboard" :percentage="75">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">今日任务进度</span>
                </template>
              </el-progress>
            </div>
          </div>
        </li>
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>总目标进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1">
              <el-progress type="dashboard" :percentage="75">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">今日任务进度</span>
                </template>
              </el-progress>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-content">
      <h2 class="header" style="border: 1px solid black">右侧顶部栏</h2>
      <ul class="status-bar">
        <li class="status-card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <div class="card-content" :style="{ transform: isFlipped ? 'rotateY(180deg)' : '' }">
            <div class="time-section">
              <div class="time">{{ currentTime }}</div>
              <div class="date">{{ currentDate }}</div>
            </div>
            <div class="flip-content">
              <div class="left-flip">
                <span>距离</span>
                <h2>春节</h2>
                <div class="holiday-time">322天</div>
                <div class="date">{{ currentDate }}</div>
              </div>
              <div class="right-border"></div>
              <div class="right-flip">
                <ul class="time-progress-bar">
                  <li>
                    今日
                    <el-progress
                      style="width: 150px; margin-left: 5px"
                      :percentage="90"
                      :stroke-width="20"
                      :text-inside="true"
                      striped
                      striped-flow
                    />
                  </li>
                  <li>
                    本周
                    <el-progress
                      style="width: 150px; margin-left: 5px"
                      :percentage="90"
                      :stroke-width="20"
                      :text-inside="true"
                      striped
                      striped-flow
                    />
                  </li>
                  <li>
                    本月
                    <el-progress
                      style="width: 150px; margin-left: 5px"
                      :percentage="90"
                      :stroke-width="20"
                      :text-inside="true"
                      striped
                      striped-flow
                    />
                  </li>
                  <li>
                    本年
                    <el-progress
                      style="width: 150px; margin-left: 5px"
                      :percentage="90"
                      :stroke-width="20"
                      :text-inside="true"
                      striped
                      striped-flow
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
        <li class="status-card">
          <div class="card-content"></div>
        </li>
        <li class="status-card">
          <div class="card-content"></div>
        </li>
      </ul>
    </div>
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

  .right-content {
    flex: 1 1 40%;
    /* 改为相对单位 */
    min-width: 250px;
    max-width: 25%;
    background: #e8e8e8;
    height: 100%;
  }
  /* 右侧卡片的样式 */
  .status-bar {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
  }
  .status-card {
    flex: 1 1 30%; /* 基础30%宽度 */
    min-width: 300px; /* 最小卡片宽度 */
    max-width: calc(88%); /* 最大不超过1/3 */
    box-sizing: border-box;
    border-radius: 30px;
    box-shadow: 0 2rem 3rem rgba(132, 139, 200, 0.18);
    padding: 15px; /* 减小内边距 */
    height: 30%; /* 适当降低高度 */
    transition: all 0.3s; /* 添加过渡效果 */
    margin: auto;
    position: relative;
    perspective: 1000px;
    /* background: #409eff; */
    color: white;
  }
  .status-card .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  /* .status-card:hover .card-content {
    transform: rotateY(180deg);
  } */
  .time-section,
  .flip-content {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 20px;
  }
  .time-section {
    flex-direction: column;
    background: #409eff;
    color: white;
  }

  .flip-content {
    background: #ff7d00;
    color: white;
    transform: rotateY(180deg);
    /* width: 100%; */
  }
  .flip-title {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .flip-value {
    font-size: 28px;
    font-weight: bold;
  }

  .time {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .date {
    font-size: 16px;
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
  .holiday-time {
    font: bold 3rem Arial, sans-serif;
    color: #409eff;
  }
  h2 {
    margin: 0;
  }
  .right-flip {
    flex: 1 1 60%;
    position: relative;
  }
  .right-border {
    width: 2px; /* 边框宽度 */
    height: 150px; /* 边框长度，根据需要调整 */
    background-color: #e3e8f7; /* 边框颜色 */
  }
  .time-progress-bar li {
    display: flex;
    width: 190px;
    float: right;
    margin-bottom: 1em;
    /* white-space: nowrap; */
  }
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .header {
    margin: 0;
    margin-top: 30px;
  }

  /* 图表数据 */
  .chart-container {
    display: flex;
    width: 100%;
    gap: 20px;
    /* background-color: white; */
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .chart-card {
    flex: 1 1 30%; /* 基础30%宽度 */
    min-width: 280px; /* 最小卡片宽度 */
    max-width: calc(33.33% - 13px); /* 最大不超过1/3 */
    box-sizing: border-box;
    border-radius: 30px;
    box-shadow: 0 2rem 3rem rgba(132, 139, 200, 0.18);
    padding: 15px; /* 减小内边距 */
    height: 160px; /* 适当降低高度 */
    transition: all 0.3s; /* 添加过渡效果 */
  }

  .card-content {
    display: flex;
    height: 100%;
    text-align: center;
  }

  .data-section {
    flex: 1;
    padding-right: 15px;
    border-right: 1px solid #eee;
  }

  .chart-section {
    flex: 1;
    height: 100%;
    margin-left: 15px;
  }

  .percentage {
    font-size: 2em;
    color: #409eff;
    margin: 10px 0;
  }
  @media (max-width: 1200px) {
    .left-content {
      max-width: 65%;
    }
    .right-content {
      max-width: 35%;
    }
    .chart-card {
      min-width: 240px;
    }
  }

  @media (max-width: 992px) {
    .home {
      flex-direction: column;
    }
    .left-content,
    .right-content {
      max-width: 100%;
      min-width: 100%;
    }
    .chart-card {
      flex: 1 1 48%;
      max-width: calc(50% - 10px);
    }
  }
  /* 圆形进度条样式 */
  .percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
  }
  .percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
  }
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .demo-progress .el-progress--circle {
    margin-right: 15px;
  }
</style>
