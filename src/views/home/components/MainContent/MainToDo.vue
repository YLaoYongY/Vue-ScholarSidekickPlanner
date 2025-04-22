<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

  import draggable from 'vuedraggable'

  import { useTaskStore } from '@/stores/modules/todolist'
  const taskStore = useTaskStore()
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
  const tasks = ref(taskStore.tasks || [])
  const taskModalVisible = ref(false)
  const currentQuadrant = ref('')
  const isCustomTask = ref(false)

  const newTask = ref({
    name: '',
    taskType: 'short', // 'short'或'long'
    startTime: '',
    endTime: '',
    duration: 0.5, // 默认半小时
    priority: '',
    dateRange: [],
  })
  // 添加任务类型选项
  const taskTypeOptions = ref([
    { label: '短时任务', value: 'short' },
    { label: '长期任务', value: 'long' },
  ])
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
      taskType: 'short', // 强制重置为短时任务
    }
  }
  // 添加日期范围变化处理
  const handleDateRangeChange = dates => {
    if (dates && dates.length === 2) {
      newTask.value.startTime = dates[0] + ' 00:00:00'
      newTask.value.endTime = dates[1] + ' 23:59:59'
    } else {
      newTask.value.startTime = ''
      newTask.value.endTime = ''
    }
  }
  // 修改addTask方法
  const addTask = () => {
    if (!newTask.value.name) {
      ElMessage.error('请输入任务名称')
      return
    }

    // 生成任务列表
    const generatedTasks = []

    if (newTask.value.taskType === 'short') {
      if (!newTask.value.startTime || !newTask.value.endTime) {
        ElMessage.error('请选择完整时间范围')
        return
      }

      if (newTask.value.endTime < newTask.value.startTime) {
        ElMessage.error('结束时间不能早于开始时间')
        return
      }

      const today = new Date().toISOString().split('T')[0]

      generatedTasks.push({
        id: Date.now(), // 使用统一时间戳
        name: newTask.value.name,
        startTime: new Date(`${today}T${newTask.value.startTime}:00`),
        endTime: new Date(`${today}T${newTask.value.endTime}:00`),
        priority: isCustomTask.value ? newTask.value.priority : currentQuadrant.value,
      })
    } else {
      // 长期任务处理
      if (!newTask.value.startTime || !newTask.value.endTime) {
        ElMessage.error('请选择完整日期范围')
        return
      }

      const startDate = new Date(newTask.value.startTime)
      const endDate = new Date(newTask.value.endTime)
      endDate.setHours(23, 59, 59) // 包含结束日期的全天

      // 生成每日任务
      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const taskDate = new Date(day)
        generatedTasks.push({
          name: newTask.value.name,
          startTime: new Date(taskDate.setHours(9, 0)), // 默认9点开始
          endTime: new Date(taskDate.setHours(9 + (newTask.value.duration * 60) / 60, 0)),
          priority: isCustomTask.value ? newTask.value.priority : currentQuadrant.value,
        })
      }

      const exists = tasks.value.some(t => t.name === newTask.value.name && t.startTime === generatedTasks[0].startTime)
      if (exists) {
        ElMessage.warning('相同任务已存在')
        return
      }
    }

    tasks.value = [...tasks.value, ...generatedTasks] // 单次批量添加
    generatedTasks.forEach(task => taskStore.addTask(task)) // 同步到store

    taskModalVisible.value = false
  }
  const onDragEnd = () => {
    // 可以在这里保存排序后的任务顺序
    // taskStore.updateTaskOrder(taskStore.tasks)
    console.log('任务顺序已更新', tasks.value)
  }

  const formatTime = time => {
    if (!time) return '未设置'

    // 处理纯时间字符串 (HH:mm)
    if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = time.split(':')
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>
<template>
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

    <el-dialog v-model="taskModalVisible" :title="`添加${currentQuadrantLabel}任务`">
      <el-form :model="newTask" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="newTask.name" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="任务类型">
          <el-radio-group v-model="newTask.taskType">
            <el-radio v-for="item in taskTypeOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="newTask.taskType === 'short'">
          <el-form-item label="开始时间">
            <el-time-picker
              v-model="newTask.startTime"
              placeholder="选择开始时间"
              format="HH:mm"
              value-format="HH:mm"
              @change="val => (newTask.startTime = val)"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-time-picker
              v-model="newTask.endTime"
              placeholder="选择结束时间"
              format="HH:mm"
              value-format="HH:mm"
              :disabled="!newTask.startTime"
              @change="val => (newTask.endTime = val)"
            />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="newTask.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleDateRangeChange"
            />
          </el-form-item>
          <el-form-item label="所需时间">
            <el-input-number v-model="newTask.duration" :min="0.5" :max="8" :step="0.5" label="小时" />
            <span class="ml-2">小时</span>
          </el-form-item>
        </template>

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
</template>

<style scoped>
  /* 模态框样式 */
  .el-date-editor.el-input {
    width: 100%;
  }

  .el-input-number {
    margin-right: 10px;
  }

  .ml-2 {
    margin-left: 8px;
  }
  /* 主页待办 */
  .main-todo {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 确保父容器占满视口 */
    margin-top: 10px;
    overflow: hidden; /* 防止整体页面滚动 */
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
    min-height: 0; /* 关键属性：允许flex容器收缩 */
    overflow-y: auto; /* 垂直滚动 */
    padding-right: 8px; /* 防止滚动条遮挡内容 */
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
    display: flex;
    flex-direction: row;
    text-indent: 2em;
    flex: 1;
  }

  .task-name {
    font-size: 2em;
    line-height: 2em;

    font-weight: bold;
  }

  .task-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: auto;
    font-size: 1.2em;
    color: #666;
  }

  .drag-handle {
    width: 50px;
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

  /* 脱拽样式 */
  draggable {
    min-height: min-content;
  }
</style>
