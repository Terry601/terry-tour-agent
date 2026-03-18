import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoveAppChatView from '../views/LoveAppChatView.vue'
import ManusChatView from '../views/ManusChatView.vue'

export const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'AI Chat - 应用入口' } },
  {
    path: '/love',
    name: 'love',
    component: LoveAppChatView,
    meta: { title: 'AI Chat - 旅游规划大师' },
  },
  {
    path: '/manus',
    name: 'manus',
    component: ManusChatView,
    meta: { title: 'AI Chat - 超级智能体' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  const base = 'AI Chat'
  const title = to?.meta?.title ? String(to.meta.title) : base
  document.title = title
})

export default router

