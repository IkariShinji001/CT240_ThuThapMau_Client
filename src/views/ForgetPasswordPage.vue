<template>
  <q-page>
    <div class="wrapper">
      <div class="container">
        <h1>Quên mật khẩu</h1>
        <div class="image-container">
          <img src="../assets/THANH DUY BUFFET.png" />
        </div>
        <section class="forgot-container">
          <div class="form-box">
            <h2>Quên mật khẩu</h2>
            <p>
              Vui lòng nhập email đã được cấp tài khoản vào để được đặt lại mật khẩu
            </p>

            <q-input class="input" v-model="email" outlined label="Email">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-btn class="btn-submit" color="primary" @click="handleForgetPassword"
              >Xác nhận</q-btn>
          </div>
        </section>
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

.forgot-container {
  margin: 0 auto;
  width: 90%;
  grid-area: forgot;
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

form-box,h2{
  font-size: 2em;
  color: #162938;
  text-align: center;
}

.container {
  background-color: rgba(240, 248, 255, 0.737) !important;
  min-height: 100vh;
  display: grid;
  grid-template-areas: "title title"
                      "img forgot";
}

h1 {
  padding: 15px 0;
  padding-top: 40px;
  font-size: 3rem;
  text-align: center;
  margin: 10px;
  font-weight: bolder;
  grid-area: title;
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
  height: 60%;
}

p {
  font-size: 16px;
  margin: 10px;
  color: red;;
}

.input {
  background-color: white;
  margin: 30px 20px;
  font-size: 18px;
  border: 10px;
}

.btn-submit {
  padding: 10px 70px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

</style>
