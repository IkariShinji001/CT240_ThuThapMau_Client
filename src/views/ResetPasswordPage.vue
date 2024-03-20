<template>
  <q-page>
    <div class="wrapper">
      <div class="container">
        <h1>Đặt lại mật khẩu</h1>

        <q-input
          type="password"
          class="input"
          v-model="password"
          outlined
          label="New password"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
        </q-input>

        <q-input
          type="password"
          class="input"
          v-model="confirmPassword"
          outlined
          label="Confirm password"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
        </q-input>

        <q-btn class="btn-submit" color="primary" @click="handleResetPassword"
          >Xác nhận</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import userService from "../services/user.service";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const password = ref();
    const confirmPassword = ref();

    const isMatchedPassword = (password, confirmPassword) => {
      return password === confirmPassword;
    };
    
    const handleResetPassword = async () => {
      if (!isMatchedPassword(password.value, confirmPassword.value)) {
        toast.warning("Mật khẩu không trùng khớp");
        return;
      }
      try {
        await userService.resetPassword(route.query.user_id, password.value);
        toast.success("Bạn đã đổi mật khẩu thành công");
        router.push({ path: "/login" });
      } catch (error) {
        console.log(error);
        toast.error("Xảy ra lỗi trong quá trình đổi mật khẩu");
      }
    };

    return {
      password,
      confirmPassword,
      handleResetPassword,
    };
  },
};
</script>

<style scoped>
.wrapper {
  background-color: aliceblue;
  min-height: 100vh;
}

.container {
  width: 90%;
  margin: 0 auto;
}

h1 {
  text-align: center;
  font-size: 3rem;
  padding: 50px 0 30px 0;
  margin: 0;
}

.input {
  margin: 20px 0;
  background-color: white;
  font-size: 18px;
}

.btn-submit {
  display: flex;
  margin: 0 auto;
  padding: 10px 70px;
  margin-top: 40px;
}
</style>
