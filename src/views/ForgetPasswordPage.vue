<template>
  <q-page>
    <div class="wrapper">
      <div class="container">
        <h1>Quên mật khẩu</h1>

        <p>
          Vui lòng nhập email đã được cấp tài khoản vào để được đặt lại mật khẩu
        </p>

        <q-input class="input" v-model="email" outlined label="Email">
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-btn class="btn-submit" color="primary" @click="handleForgetPassword"
          >Xác nhận</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import userService from "../services/user.service";

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();

    const email = ref();

    const handleForgetPassword = async () => {
      try {
        await userService.forgetPassword(email.value);
        toast.success("Vui lòng kiểm tra email " + email.value);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      email,
      handleForgetPassword,
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
  padding: 30px 0;
  padding-top: 60px;
  font-size: 3rem;
  text-align: center;
  margin: 0;
  font-weight: bolder;
}

p {
  font-size: 16px;
}

.input {
  background-color: white;
  margin: 30px 0;
  font-size: 18px;
}

.btn-submit {
  padding: 10px 70px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
</style>
