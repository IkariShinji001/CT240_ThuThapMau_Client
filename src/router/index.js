import { createRouter, createWebHistory } from "vue-router";
import UserService from "../services/user.service";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      meta: {
        title: "Dashboard",
        requiresAuth: true,
      },
      children: [
        // {
        //   path: "/",
        //   name: "Main",
        //   meta: {
        //     title: "Trang chủ",
        //     requiresAuth: true,
        //   },
        //   component: () => import("../views/ProjectDetail.vue"),
        // },
        {
          path: "projects/:id",
          name: "ProjectDetail",
          meta: {
            title: "Dự án",
          },
          component: () => import("../views/ProjectDetail.vue")
        },
        {
          path: '/projects/:id/members',
          name: 'sd',
          meta:{
            title: 'Dự án'
          },
          component: () => import("../views/ProjectMember.vue")
        },
        {
          path: '/notifications',
          name: 'Thông báo',
          meta:{
            title: 'Dự án'
          },
          component: () => import("../views/Notifications.vue")
        }
      ],
      component: () => import("../layouts/DashBoard.vue"),
    },
    // {
    //   path: "/socket",
    //   component: () => import("../views/TestSocket.vue"),
    // },
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
    {
      path: "/signup",
      meta: {
        title: "Đăng ký tài khoản",
      },
      component: () => import("../views/Signup.vue"),
    },
    {
      path: "/user/:id",
      meta: {
        title: "Thông tin người dùng",
      },
      component: () => import("../views/User.vue"),
    },
    {
      path: "/collection/:collection_id/user/:user_id",
      name: "Tạo from",
      meta: {
        title: "Tạo form",
      },
      component: () => import("../views/CreateForm.vue"),
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

// router.beforeEach(async (to, from, next) => {
//   const isLoginState = await UserService.verifyUser();
//   if (to.meta.requiresAuth && !isLoginState) {
//     next("/login");
//   } else if (to.path === "/login" && isLoginState) {
//     next("/");
//   } else {
//     document.title = to.meta.title;
//     next();
//   }
// });

export default router;
