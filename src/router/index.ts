import { createRouter, createWebHistory } from "vue-router";
import layout from "@/layouts/index.vue";
import login from "@/pages/login/index.vue";
import home from "@/pages/home/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: layout,
      children: [
        {
          path: "/",
          name: "home",
          component: home,
        },
        {
          path: "post/:postId",
          name: "post",
          component: () => import("@/pages/post/index.vue"),
        },
        {
          path: "/user/:id",
          name: "user",
          meta: {
            background: "#FAFAFA",
          },
          component: () => import("@/pages/user/self/index.vue"),
        },
      ],
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/register/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login/index.vue"),
    },
  ],
});

export default router;
