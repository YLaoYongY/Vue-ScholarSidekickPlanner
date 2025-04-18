<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

  import RightSlide from './components/RightSilde/RightSlide.vue'
  import draggable from 'vuedraggable'
  import { Rank, Plus } from '@element-plus/icons-vue'

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
