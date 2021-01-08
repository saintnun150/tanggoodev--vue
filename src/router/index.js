import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "@/views/Home";
// import BoardHome from "@/views/board/BoardHome";
import BoardWrite from "@/views/board/BoardWrite";
import BoardView from "@/views/board/BoardView";

const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Home
    }
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: "/board",
    name: "BoardHome",
    component: () => import("../views/board/BoardHome.vue")
    // components: {
    //   default: BoardHome
    // }
  },
  {
    path: "/board/write",
    name: "BoardWrite",
    components: {
      default: BoardWrite
    }
  },
  {
    path: "/board/read",
    name: "BoardView",
    components: {
      default: BoardView
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
