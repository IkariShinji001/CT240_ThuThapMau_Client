<template>
  <q-page>
    <div class="wrapper">
      <div class="container">
        <h1 style="color: white;">Quên mật khẩu</h1>
        
        <section class="forgot-container">
          <div class="form-box">
            <h2>Quên mật khẩu</h2>
            <p>
              Vui lòng nhập email đã được cấp tài khoản vào để được đặt lại mật khẩu
            </p>

            <div class="btn-container">
              <q-input class="input" v-model="user.user_email" outlined label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <q-btn class="btn-submit" color="primary" @click="handleForgetPassword(user.user_email)"
              >Xác nhận</q-btn>
          </div>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import userService from "../services/user.service";

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();

    const user = reactive({
      user_email: '',
    });

    const handleForgetPassword = async (user_email) => {
      try {
        await userService.sendmail(user_email);
        toast.success("Vui lòng kiểm tra email " + user_email);
      } catch (error) {
        console.log(error);
      }
    };

    return {
      user,
      handleForgetPassword,
    };
  },
};
</script>

<style scoped>
.wrapper {
  background-image: url('../assets/img0.jpg') !important;
  min-height: 100vh;
}
.container {
  width: 90%;
  margin: 0 auto;
}

.forgot-container {
  background-color: white !important;
  margin: 0 auto;
  width: 90%;
  grid-area: forgot;
  position: relative;
  width: 500px;
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
  width: 90%;
}
.btn-container{
  display: flex;
  justify-content: center;
}
.btn-submit {
  padding: 10px 70px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

</style>
