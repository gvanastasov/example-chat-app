import { createRouter, createWebHistory } from 'vue-router';
import SChatroom from './components/SChatroom.vue';

const routes = [
    {
      path: '/chat/:id',
      name: 'Chatroom',
      component: SChatroom,
      props: true,
    },
  ];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});