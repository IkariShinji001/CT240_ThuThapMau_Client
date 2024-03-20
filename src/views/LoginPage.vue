<template>
  <q-page>
    <div class="container">
      <div class="image-container">
        <img src="../assets/THANH DUY BUFFET.png" />
      </div>

      <h1>Đăng nhập</h1>
      <section class="form-login">
        <q-input
          class="input"
          v-model="user.email"
          type="text"
          outlined
          label="Email"
        >
        </q-input>
        <q-input
          class="input"
          v-model="user.password"
          type="text"
          outlined
          label="Password"
        ></q-input>
        <q-btn class="btn" @click="handleLogin">Đăng nhập</q-btn>
        <router-link class="forget-pw" to="/forget-password"
          >Quên mật khẩu</router-link
        >
      </section>
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import userService from "../services/user.service"
import { useToast } from "vue-toastification";
import {useRouter} from "vue-router";

export default {
  setup() {
    const toast = useToast();
    const router = useRouter()
    const user = reactive({
      email: '',
      password: '',
    });

    const handleLogin = async () =>{
      try {
        const userData = await userService.login(user);
        if(userData.role === 'chef'){
          router.push({path: '/kitchen'});
          toast.success("Đăng nhập thành công");
          return;
        }
        router.push({path: '/'})
        toast.success("Đăng nhập thành công");
      } catch (error) {
        toast.error("Sai tên đăng nhập hoặc mật khẩu");
        console.error(error);
      }
    }

    return {
      user,
      handleLogin
    };
  },
};
</script>

<style scoped>
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

img {
  margin-top: 30px;
  width: 30%;
}

h1 {
  font-size: 3rem;
  text-align: center;
  font-weight: bolder;
  margin: 10px 0 !important;
}

.input {
  background-color: white;
  margin-top: 15px;
  font-size: 17px;
}

.container {
  background-color: rgba(240, 248, 255, 0.737) !important;
  min-height: 100vh;
}

.form-login {
  margin: 0 auto;
  width: 90%;
}

.forget-pw {
  font-size: 16px;
  color: rgb(46, 46, 175);
  display: block;
  text-align: right;
  margin: 10px 0;
}

.btn {
  width: 100%;
  margin: 30px 0;
  background-color: #1976d2;
  font-size: 18px;
  color: white;
  font-weight: bolder;
}
</style>
