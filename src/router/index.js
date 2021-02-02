import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '@/views/Home';

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home
    }
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/board',
    component: () => import('../views/board/Index')
  },
  {
    path: '/board/:info',
    component: () => import('../views/board/Info')
  },
  {
    path: '/board/:info/:article',
    component: () => import('../views/board/Article')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
