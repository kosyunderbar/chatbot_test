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
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    {
      path: '/community/write',
      name: 'post-write',
      component: () => import('../views/PostWriteView.vue'),
    },
    {
      path: '/community/:id/edit',
      name: 'post-edit',
      component: () => import('../views/PostEditView.vue'),
    },
    {
      path: '/community/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: () => import('../views/ChatbotView.vue'),
    },
  ],
})

export default router
