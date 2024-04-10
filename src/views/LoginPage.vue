<template>
  <q-page>
    <div class="container">
      <h1>Đăng nhập</h1>
      <section class="form-login">
        <div class="form-box">
          <h2>Đăng nhập</h2>
          <q-input class="input" v-model="user.user_email" type="text" outlined label="Email">
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input class="input" v-model="user.user_password" type="password" outlined label="Password" @keyup.enter="handleLogin">
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
          </q-input>
          <section class="func-box">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
              <label class="form-check-label" for="form2Example31"> Remember me </label>
            </div>
            <router-link class="forget-pw" to="/forget-password">Quên mật khẩu</router-link>
          </section>
          <div class="btn-container">
              <q-btn class="btn" @click="handleLogin">Đăng nhập</q-btn>
          </div>
          <div class="signup-pw" >
            <span>Bạn chưa có tài khoản.</span>
              <router-link to="/signup">Đăng ký</router-link>
            </div>
        </div>
      </section>
      <div class="image-container">
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import userService from "../services/user.service";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export default {
  setup() {
    const toast = useToast();
    const router = useRouter();
    const user = reactive({
      user_email: "",
      user_password: "",
    });

    const handleLogin = async () => {
      try {
        const userLogin = await userService.login(user);
        localStorage.setItem("user", JSON.stringify(userLogin));
        router.push({ path: '/' })
        toast.success("Đăng nhập thành công");
      } catch (error) {
        toast.error("Sai tên đăng nhập hoặc mật khẩu");
        console.error(error);
      }
    };

    return {
      user,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  grid-area: img;
}

.func-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2px;
}

img {
  margin-top: 10px;
  width: 60%;
  height: 50%;
}

form-box,
h2 {
  font-size: 2em;
  color: black;
  text-align: center;
  width: 450px;
  font-weight: bold;
}

h1 {
  font-size: 3rem;
  text-align: center;
  font-weight: bolder;
  margin: 10px 0 !important;
  grid-area: title;
  color: white;
}

.input {
  background-color: white;
  margin-top: 15px;
  font-size: 17px;

  position: relative;
  width: 90%;
  height: 50px;
  margin: 30px 20px;

}

.container {
  /* background-color: rgba(148, 196, 158, 0.675) !important; */
  background-image: url('../assets/img0.jpg') !important;
  min-height: 100vh;
  display: grid;
  grid-template-areas: "title title"
    "img login";
}

.form-login {
  background-color: white !important;
  margin: 0 auto;
  width: 90%;
  grid-area: login;
  position: relative;
  width: 500px;
  height: 440px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  backdrop-filter: blur(100px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
}

.forget-pw {
  font-size: 16px;
  color: rgb(46, 46, 175);
  display: block;
  text-align: right;
  margin: 10px 0;
}

.forget-pw:hover .signup-pw:hover{
  color: gray;
}
.signup-pw{
  display: flex;
  justify-content: center;
}

.btn-container {
  display: flex;
  justify-content: center;
  text-align: center;
}

.btn {
  width: 60%;
  margin: 30px 0;
  background-color: #1976d2;
  font-size: 18px;
  color: white;
  font-weight: bolder;
}

.btn:active {
  color: red;
  background-color: white;
}
</style>