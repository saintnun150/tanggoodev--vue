import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "@/views/Home";

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
    path: "/editor",
    name: "editor",
    component: () => import("../views/Editor")
  },
  {
    path: "/storage",
    name: "storage",
    component: () => import("../views/Storage.vue")
  },
  {
    path: "/:collection/:document",
    name: "collection-document",
    component: () => import("../views/Renderer")
  },
  {
    path: "/:collection/:document/:action",
    name: "collection-document-action",
    component: () => import("../views/Renderer")
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
