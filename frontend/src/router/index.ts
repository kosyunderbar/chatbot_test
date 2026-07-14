import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/tour',
      name: 'tour',
      component: () => import('../views/TourView.vue'),
    },
  ],
})

export default router
