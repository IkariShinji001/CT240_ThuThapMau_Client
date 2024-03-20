import { createRouter, createWebHistory } from "vue-router";
import UserService from "../services/user.service";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/socket",
      component: () => import("../views/TestSocket.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "Đăng nhập",
      },
      component: () => import("../views/LoginPage.vue"),
    },
    {
      path: "/forget-password",
      name: "home",
      meta: {
        title: "Lấy lại mật khẩu",
      },
      component: () => import("../views/ForgetPasswordPage.vue"),
    },
    {
      path: "/reset-password",
      meta: {
        title: "Đặt lại mật khẩu",
      },
      component: () => import("../views/ResetPasswordPage.vue"),
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'notFound',
    //   meta: {
    //     title: 'Không tồn tại trang web'
    //   },
    //   component: () => import('../views/NotFoundView.vue')
    // }
  ],
});

router.beforeEach(async (to, from, next) => {
  const isLoginState = await UserService.verifyUser();
  if (to.meta.requiresAuth && !isLoginState) {
    next("/login");
  } else if (to.path === "/login" && isLoginState) {
    next("/");
  } else {
    document.title = to.meta.title;
    next();
  }
});

export default router;