<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as echarts from 'echarts'
  import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
  import { HeatmapChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'

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
    echarts.use([TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent, HeatmapChart, CanvasRenderer])

    var chartDom = document.getElementById('main')
    var myChart = echarts.init(chartDom)
    var option

    // 生成指定月份的数据（示例使用2023-10月）
    function getRealData() {
      const now = new Date() // 获取当前日期
      const year = now.getFullYear()
      const month = now.getMonth() // 注意月份是0-based

      // 计算当月第一天和最后一天
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0) // 下个月的第0天即本月最后一天

      const data = []
      const currentDay = new Date(firstDay) // 克隆日期对象避免污染

      while (currentDay <= lastDay) {
        // 格式化为YYYY-MM-DD
        const dayStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(
          currentDay.getDate()
        ).padStart(2, '0')}`

        // 这里保留随机数示例，实际可替换为真实数据
        data.push([dayStr, Math.floor(Math.random() * 1000)])

        // 增加一天
        currentDay.setDate(currentDay.getDate() + 1)
      }
      return data
    }

    var option = {
      tooltip: {
        position: 'top',
        formatter: function (p) {
          return p.data[0] + ': ' + p.data[1]
        },
      },
      // 右侧颜色条配置
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'vertical',
        right: '5%',
        top: '20%',
        // left: '80%', // 改为百分比定位
        // top: '10%', // 垂直居中
        itemWidth: 20, // 颜色条宽度
        itemHeight: 100, // 颜色条高度
        text: ['高', '低'], // 两端文字
        textStyle: {
          color: '#666',
        },
      },
      // 图表标题
      title: {
        show: true,
        text: '热力图', // 标题文本
        left: 'center',
        top: '10%',
        padding: [10, 0], // 上下边距
        textStyle: {
          color: '#333',
          fontSize: '1.5em',
        },
      },
      calendar: {
        top: '30%',
        left: '10%',
        right: '25%',
        // width: '300em',
        // height: '200em',
        orient: 'vertical',
        cellSize: [35, 35],
        range: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        dayLabel: {
          position: 'start',
          nameMap: ['一', '二', '三', '四', '五', '六', '日'],
          margin: 5,
          color: '#666',
        },
        monthLabel: {
          show: true,
          position: 'start',
          fontSize: 14,
          color: '#333',
        },
        yearLabel: { show: false },
        itemStyle: {
          borderColor: '#ddd',
          borderWidth: 1,
        },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getRealData(),
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff',
        },
      },
    }

    option && myChart.setOption(option)
  })

  onBeforeUnmount(() => {
    clearAllTimers()
  })

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
        <li class="status-card" style="height: 15rem" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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
          <div id="main" style="width: 100%; height: 100%"></div>
        </li>
        <li class="status-card">
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
    /* background: #e8e8e8; */
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
  /* 轮播图样式 */
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
