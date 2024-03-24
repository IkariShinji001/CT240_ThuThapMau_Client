<template>
  <q-page>
    <div class="wrapper">
      <div class="container">
        <h1>Đặt lại mật khẩu</h1>
        <section class="form-reset">
          <div class="form-box">
            <h2>Đặt lại mật khẩu</h2>
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
                >Xác nhận</q-btn>
          </div>
        </section>
        <div class="image-container">
        <img src="../assets/THANH DUY BUFFET.png" />
      </div>
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

    const user = reactive({
      user_password: '',
      repasswd: '',
    });

    const isMatchedPassword = (user_password, repasswd) => {
      return user.user_password === user.repasswd;
    };
    
    const handleResetPassword = async () => {
      if (!isMatchedPassword(user.user_password.value, user.repasswd.value)) {
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
      user_password,
      repasswd,
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

.image-container {
  width: 100%;

  display: flex;
  justify-content: center;
  grid-area: img;
}

img {
  margin-top: 10px;
  width: 70%;
  height: 70%;
}

.form-reset {
  margin: 0 auto;
  width: 90%;
  grid-area: reset;
  position: relative;
  width: 400px;
  height: 440px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(100px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background-color: rgba(240, 248, 255, 0.737) !important;
  min-height: 100vh;
  display: grid;
  grid-template-areas: "title title"
                      "img reset";
}

form-box,h2{
  font-size: 2em;
  color: #162938;
  text-align: center;
}

h1 {
  font-size: 3rem;
  text-align: center;
  font-weight: bolder;
  margin: 10px 0 !important;
  grid-area: title;
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
