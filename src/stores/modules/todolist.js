// src/store/taskStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  // 从本地存储初始化任务
  const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || [])

  // 持久化保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  // 添加任务
  const addTask = (task) => {
    tasks.value.push({
      ...task,
      id: Date.now()
    })
    saveToLocalStorage()
  }

  // 更新任务顺序（用于拖拽排序）
  const updateTaskOrder = (newTasks) => {
    tasks.value = newTasks
    saveToLocalStorage()
  }

  // 按优先级过滤任务
  const tasksByPriority = computed(() => (priority) => {
    return tasks.value.filter(t => t.priority === priority)
  })

  return {
    tasks,
    addTask,
    updateTaskOrder,
    tasksByPriority
  }
})
