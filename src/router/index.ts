import { createRouter, createWebHistory } from "vue-router";
import layout from "@/layouts/index.vue";
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
          path: "/post/:postId",
          name: "post",
          component: () => import("@/pages/post/index.vue"),
        },
           {
          path: "/categorie/:id",
          name: "categorie",
          component: () => import("@/pages/categorie/index.vue"),
        },
        {
          path: "/created",
          name: "created",
          component: () => import("@/pages/created/index.vue"),
        },
        {
          path: "/search",
          name: "search",
          component: () => import("@/pages/search/index.vue"),
        },
        {
          path: "/user/:id",
          name: "user",
          meta: {
            background: "#FAFAFA",
          },
          component: () => import("@/pages/user/guide.vue"),
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
    {
      path: "/forget-password",
      name: "forget-password",
      component: () => import("@/pages/forget-password/index.vue"),
    },
  ],
});

export default router;
