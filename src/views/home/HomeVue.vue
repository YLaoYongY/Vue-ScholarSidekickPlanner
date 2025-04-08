<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import * as echarts from 'echarts'
  import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
  import { HeatmapChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'

  import draggable from 'vuedraggable'
  import { Rank, Plus } from '@element-plus/icons-vue'

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

  // 任务主体

  // 四象限数据
  const quadrants = ref([
    { class: 'important-urgent', label: '重要且紧急', type: 'important-urgent' },
    { class: 'important-not-urgent', label: '重要不紧急', type: 'important-not-urgent' },
    { class: 'urgent-not-important', label: '紧急不重要', type: 'urgent-not-important' },
    { class: 'not-important-not-urgent', label: '不重要不紧急', type: 'not-important-not-urgent' },
  ])

  const quadrantButtons = ref([
    { label: '重要紧急', type: 'important-urgent', buttonType: 'danger' },
    { label: '重要不紧急', type: 'important-not-urgent', buttonType: 'warning' },
    { label: '紧急不重要', type: 'urgent-not-important', buttonType: 'success' },
    { label: '不重要不紧急', type: 'not-important-not-urgent', buttonType: 'info' },
  ])

  const priorityOptions = ref([
    { value: 'important-urgent', label: '重要且紧急' },
    { value: 'important-not-urgent', label: '重要不紧急' },
    { value: 'urgent-not-important', label: '紧急不重要' },
    { value: 'not-important-not-urgent', label: '不重要不紧急' },
  ])

  // 任务相关数据
  const tasks = ref([])
  const taskModalVisible = ref(false)
  const currentQuadrant = ref('')
  const isCustomTask = ref(false)

  const newTask = ref({
    name: '',
    startTime: '',
    endTime: '',
    priority: '',
  })

  // 计算属性
  const currentQuadrantLabel = computed(() => {
    const quadrant = quadrants.value.find(q => q.type === currentQuadrant.value)
    return quadrant ? quadrant.label : ''
  })

  // 方法
  const openTaskModal = type => {
    currentQuadrant.value = type
    isCustomTask.value = false
    resetNewTask()
    taskModalVisible.value = true
  }

  const openCustomTaskModal = () => {
    currentQuadrant.value = ''
    isCustomTask.value = true
    resetNewTask()
    taskModalVisible.value = true
  }

  const resetNewTask = () => {
    newTask.value = {
      name: '',
      startTime: '',
      endTime: '',
      priority: isCustomTask.value ? '' : currentQuadrant.value,
    }
  }

  const addTask = () => {
    if (!newTask.value.name) {
      return
    }

    const priority = isCustomTask.value ? newTask.value.priority : currentQuadrant.value

    tasks.value.push({
      id: Date.now(),
      name: newTask.value.name,
      startTime: newTask.value.startTime,
      endTime: newTask.value.endTime,
      priority: priority,
    })

    taskModalVisible.value = false
  }

  const onDragEnd = () => {
    // 可以在这里保存排序后的任务顺序
    console.log('任务顺序已更新', tasks.value)
  }

  const formatTime = time => {
    if (!time) return '未设置'
    return new Date(time).toLocaleString()
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
      <div class="main-todo">
        <!-- 四象限选择区域 -->
        <div class="quadrant-selector">
          <div class="quadrant-grid">
            <span class="axis-label x-axis-label">重要程度</span>
            <span class="axis-label y-axis-label">紧急程度</span>
            <div
              v-for="(quadrant, index) in quadrants"
              :key="index"
              class="quadrant"
              :class="quadrant.class"
              @click="openTaskModal(quadrant.type)"
            >
              <span>{{ quadrant.label }}</span>
            </div>
          </div>

          <!-- 添加按钮 -->
          <div class="add-buttons">
            <el-button
              v-for="(btn, idx) in quadrantButtons"
              :key="idx"
              @click="openTaskModal(btn.type)"
              :type="btn.buttonType"
            >
              {{ btn.label }}
            </el-button>
            <el-button type="primary" @click="openCustomTaskModal">
              <el-icon><Plus /></el-icon> 添加
            </el-button>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="task-list">
          <div v-if="tasks.length === 0" class="empty-tasks" @click="openTaskModal()">
            <el-icon><Plus /></el-icon>
            <span>添加任务</span>
          </div>

          <draggable v-model="tasks" item-key="id" @end="onDragEnd" handle=".drag-handle">
            <template #item="{ element }">
              <div class="task-item" :class="`priority-${element.priority}`">
                <div class="task-info">
                  <div class="task-name">{{ element.name }}</div>
                  <div class="task-time">
                    <div>开始: {{ formatTime(element.startTime) }}</div>
                    <div>结束: {{ formatTime(element.endTime) }}</div>
                  </div>
                </div>
                <div class="drag-handle">
                  <el-icon><Rank /></el-icon>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <!-- 任务模态框 -->
        <el-dialog v-model="taskModalVisible" :title="`添加${currentQuadrantLabel}任务`">
          <el-form :model="newTask" label-width="80px">
            <el-form-item label="任务名称">
              <el-input v-model="newTask.name" placeholder="请输入任务名称"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="newTask.startTime" type="datetime" placeholder="选择开始时间" />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="newTask.endTime" type="datetime" placeholder="选择结束时间" />
            </el-form-item>
            <el-form-item label="优先级" v-if="isCustomTask">
              <el-select v-model="newTask.priority" placeholder="请选择优先级">
                <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="taskModalVisible = false">取消</el-button>
            <el-button type="primary" @click="addTask">确定</el-button>
          </template>
        </el-dialog>
      </div>
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
  /* 主页待办 */
  .main-todo {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-top: 10px;
  }

  .quadrant-selector {
    display: flex;
    margin-bottom: 20px;
  }

  .quadrant-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
    width: 200px;
    height: 200px;
    margin-right: 20px;
  }
  .quadrant-grid {
    position: relative;
    width: 100%;
    height: 200px;
    border: 2px solid #666;
    background: linear-gradient(to right, transparent 49.5%, #666 49.5%, #666 50.5%, transparent 50.5%),
      linear-gradient(to bottom, transparent 49.5%, #666 49.5%, #666 50.5%, transparent 50.5%);
  }

  /* 坐标轴箭头 */
  .quadrant-grid::before,
  .quadrant-grid::after {
    content: '';
    position: absolute;
    border-style: solid;
  }

  /* X轴箭头 */
  .quadrant-grid::before {
    right: -10px;
    bottom: 50%;
    transform: translateY(50%);
    border-width: 5px 0 5px 10px;
    border-color: transparent transparent transparent #666;
  }

  /* Y轴箭头 */
  .quadrant-grid::after {
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 10px 5px;
    border-color: transparent transparent #666 transparent;
  }

  /* 坐标轴文字 */
  .quadrant-grid .axis-label {
    position: absolute;
    color: #666;
    font-size: 12px;
    background: white;
    padding: 2px 5px;
  }

  .quadrant-grid .x-axis-label {
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .quadrant-grid .y-axis-label {
    top: -25px;
    left: 50%;
    transform: translateX(-50%) rotate(-90deg);
    transform-origin: bottom center;
  }

  .quadrant {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .quadrant:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  /* 象限分割线 */
  .quadrant:not(:nth-child(3)):not(:nth-child(4)) {
    border-bottom: 1px solid #ddd;
  }

  .quadrant:not(:nth-child(2)):not(:nth-child(4)) {
    border-right: 1px solid #ddd;
  }
  .quadrant {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #ddd;
  }

  .quadrant:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .important-urgent {
    background-color: #ffebee;
    color: #f44336;
  }

  .important-not-urgent {
    background-color: #fff8e1;
    color: #ff9800;
  }

  .urgent-not-important {
    background-color: #e8f5e9;
    color: #4caf50;
  }

  .not-important-not-urgent {
    background-color: #e3f2fd;
    color: #2196f3;
  }

  .add-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-list {
    flex: 1;
    overflow-y: auto;
  }

  .empty-tasks {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #999;
  }

  .empty-tasks:hover {
    border-color: #409eff;
    color: #409eff;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 8px;
    border-radius: 4px;
    background-color: #f5f7fa;
    transition: all 0.3s;
  }

  .task-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .task-info {
    flex: 1;
  }

  .task-name {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .task-time {
    font-size: 12px;
    color: #666;
  }

  .drag-handle {
    cursor: move;
    color: #999;
    padding: 5px;
  }

  .drag-handle:hover {
    color: #409eff;
  }

  /* 不同优先级的任务样式 */
  .priority-important-urgent {
    border-left: 4px solid #f44336;
  }

  .priority-important-not-urgent {
    border-left: 4px solid #ff9800;
  }

  .priority-urgent-not-important {
    border-left: 4px solid #4caf50;
  }

  .priority-not-important-not-urgent {
    border-left: 4px solid #2196f3;
  }
</style>
