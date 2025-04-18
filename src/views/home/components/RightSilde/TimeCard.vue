<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { ElProgress } from 'element-plus'

  const isHovered = ref(false)
  const currentTime = ref('')
  const currentDate = ref('')
  const isFlipped = ref(false)
  const daysUntilNewYear = ref(0)
  const percentageMidnight = ref(0)
  const percentageWeek = ref(0)
  const percentageMonth = ref(0)
  const percentageYear = ref(0)

  let timer

  // 鼠标事件处理
  const handleMouseEnter = () => {
    isHovered.value = true
    clearTimeout(timer)
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    startInterval()
  }

  // 时间更新
  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString()
    currentDate.value = now.toLocaleDateString()

    // 计算距离春节的剩余天数
    let newYearDate = new Date(now.getFullYear(), 0, 1) // 1月1日
    const timeDiff = newYearDate - now
    let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    if (daysDiff < 0) {
      newYearDate = new Date(now.getFullYear() + 1, 0, 1) // 下一年1月1日
      daysDiff = Math.ceil((newYearDate - now) / (1000 * 60 * 60 * 24))
    }
    daysUntilNewYear.value = daysDiff

    // 计算剩余时间百分比
    calculatePercentages(now)
  }

  // 计算过去时间百分比
  const calculatePercentages = now => {
    // 当天零点剩余时间
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(startOfDay.getDate() + 1)

    const timeUntilMidnight = (now - startOfDay) / (endOfDay - startOfDay)
    percentageMidnight.value = Math.ceil(timeUntilMidnight * 100)

    // 本周剩余时间
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const timeUntilEndOfWeek = (now - startOfWeek) / (endOfWeek - startOfWeek)
    percentageWeek.value = Math.ceil(timeUntilEndOfWeek * 100)

    // 本月剩余时间
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const endOfMonth = new Date(startOfMonth)
    endOfMonth.setMonth(startOfMonth.getMonth() + 1)
    endOfMonth.setDate(endOfMonth.getDate() - 1)
    endOfMonth.setHours(23, 59, 59, 999)

    const timeUntilEndOfMonth = (now - startOfMonth) / (endOfMonth - startOfMonth)
    percentageMonth.value = Math.ceil(timeUntilEndOfMonth * 100)

    // 本年剩余时间
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1)
    endOfYear.setHours(23, 59, 59, 999)

    const timeUntilEndOfYear = (now - startOfYear) / (endOfYear - startOfYear)
    percentageYear.value = Math.ceil(timeUntilEndOfYear * 100)
  }

  // 定时翻转卡片
  const startInterval = () => {
    const flipWithRestore = () => {
      if (!isHovered.value) {
        flipCard()
        timer = setTimeout(() => {
          if (!isHovered.value) flipCard()
          timer = setTimeout(flipWithRestore, 5000)
        }, 5000)
      }
    }

    // 初始化执行
    if (!isHovered.value) flipWithRestore()

    return () => {
      clearTimeout(timer)
    }
  }

  // 清除所有定时器
  const clearAllTimers = () => {
    if (timer) clearTimeout(timer)
  }

  onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
    startInterval()
  })

  onUnmounted(() => {
    clearAllTimers()
  })

  const flipCard = () => {
    isFlipped.value = !isFlipped.value
  }
</script>

<template>
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
          <div class="holiday-time">{{ daysUntilNewYear }}天</div>
          <div class="date">{{ currentDate }}</div>
        </div>
        <div class="right-border"></div>
        <div class="right-flip">
          <ul class="time-progress-bar">
            <li>
              今日
              <el-progress
                style="width: 150px; margin-left: 5px"
                :percentage="percentageMidnight"
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
                :percentage="percentageWeek"
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
                :percentage="percentageMonth"
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
                :percentage="percentageYear"
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
    max-height: 230px;
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
  }
  .card-content {
    display: flex;
    height: 100%;
    text-align: center;
  }
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
    width: 100%;
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
  .time-progress-bar {
    display: flex; /* 使用flex布局 */
    flex-direction: column;
    justify-content: center; /* 水平居中 */
    padding: 0; /* 移除任何上内边距 */
    margin: 0; /* 移除外边距 */
  }
  .time-progress-bar li {
    display: flex;
    width: 190px;
    float: right;
    margin: auto;
    margin-bottom: 1em;
    /* white-space: nowrap; */
  }
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .demo-progress .el-progress--circle {
    margin-right: 15px;
  }
  .percentage {
    font-size: 2em;
    color: #409eff;
    margin: 10px 0;
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
  @media (max-width: 1200px) {
    .right-content {
      max-width: 35%;
    }
  }
  @media (max-width: 992px) {
    .left-content,
    .right-content {
      max-width: 100%;
      min-width: 100%;
    }
  }
</style>
