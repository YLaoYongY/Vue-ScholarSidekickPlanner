import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutVue.vue'),
      redirect: '/home',
      children: [
        { path: '/home', component: () => import('@/views/home/HomeVue.vue') },
        { path: '/pomodoro-techniqu', component: () => import('@/views/pomodoro_techniqu/PomodoroTechniqu.vue') },
        { path: '/study-room', component: () => import('@/views/study_room/StudyRoom.vue') },
        { path: '/statistical-data', component: () => import('@/views/statistical_data/StatisticalData.vue') },
      ],
    },
    { path: '/:catchAll(.*)', component: () => import('@/views/notfound/NotFound.vue') },
  ],
})

export default router
