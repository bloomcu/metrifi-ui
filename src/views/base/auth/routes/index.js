import Login from '@/views/base/auth/Login.vue';
import Logout from '@/views/base/auth/Logout.vue';
import PasswordForgot from '@/views/base/auth/PasswordForgot.vue';
import PasswordReset from '@/views/base/auth/PasswordReset.vue';
import Register from '@/views/base/auth/Register.vue';

export default [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/forgot-password",
    name: "forgotPassword",
    component: PasswordForgot,
  },
  {
    path: "/reset-password",
    name: "resetPassword",
    component: PasswordReset,
  },
]
