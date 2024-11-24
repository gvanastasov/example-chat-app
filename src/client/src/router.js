import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from './stores/user';

import PLogin from './components/pages/PLogin.vue';
import PHome from './components/pages/PHome.vue';
import SChatroom from './components/SChatroom.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: PLogin,
    },
    {
      path: '/',
      name: 'Home',
      component: PHome,
      children: [
        {
            path: 'chat/:id',
            name: 'Chatroom',
            component: SChatroom,
            props: true,
        }
      ]
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();
    // todo: add support for return url
    if (to.name !== 'Login' && !userStore.user) {
      next({ name: 'Login' });
    } else {
      next();
    }
});

export { router };