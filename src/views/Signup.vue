<template>
  <q-page>
    <div class="container">
      <h1>Đăng Ký</h1>
      <section class="form-signup">
        <div class="form-box">
          <h3>Đăng Ký</h3>
          <div class="form2col">

            <q-input class="input item1" v-model="user.user_full_name" type="text" outlined label="Username">
              <template v-slot:prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <q-input class="input item1" v-model="user.user_phone_number" type="text" outlined label="phone number">
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <q-input class="input item2" v-model="user.user_email" type="text" outlined label="Email">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>


            <q-input class="input item2" v-model="user.user_password" type="password" outlined label="Password">
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>
            <q-input class="input item2" v-model="user.repasswd" type="password" outlined label="rePassword">
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>
          </div>
          <div class="button">
            <q-btn class="btn" @click="handleSignup">Đăng Ký</q-btn>
          </div>
          <section class="func-box">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
              <label class="form-check-label" for="form2Example31"> Remember me </label>
            </div>
            <router-link class="login-pw" to="/login">Đã có tài khoản</router-link>
          </section>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script>
  import { reactive } from "vue";
  import userService from "../services/user.service"
  import { useToast } from "vue-toastification";
  import { useRouter } from "vue-router";

  export default {
    setup() {
      const toast = useToast();
      const router = useRouter()
      const user = reactive({
        user_full_name: '',
        user_phone_number: '',
        user_email: '',
        user_password: '',
        repasswd: '',
      });

      const handleSignup = async () => {
        try {
          if (user.user_full_name == '') {
            toast.error("Không được để trống username")
            return;
          }
          else if (user.user_phone_number == '') {
            toast.error("Không được để trống số điện thoại");
            return;
          }
          else if (user.user_email == '') {
            toast.error("Không được để trống email");
            return;
          }
          else if (user.user_password !== user.repasswd) {
            toast.error("Mật khẩu nhập lại không đúng");
            return;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(user.user_email)) {
            toast.error("Email không đúng định dạng")
            return;
          }

          await userService.signup(user); // login => signup
          router.push({ path: '/login' })
          toast.success("Đăng ký thành công");
        } catch (error) {
          toast.error("Sai thông tin hoặc mật khẩu");
          console.error(error);
        }
      }

      return {
        user,
        handleSignup
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

  .form2col {
    display: flex;
    flex-wrap: wrap;

  }

  .item1 {
    width: 50%;
    flex: 0 0 calc(50%);
    padding: 0 15px;
  }

  .item2 {
    width: 100%;
    padding: 0 30px;
  }

  form-box,
  h3 {
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

  .button {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .input {
    /* background-color: white; */
    /* margin-top: px; */
    font-size: 17px;

    position: relative;
    width: 100%;
    height: 40px;
    /* border-bottom: 2px solid #162938; */
    margin: 20px 0;

  }


  .container {
    /* background-color: rgba(148, 196, 158, 0.675); */
    background-image: url('../assets/img0.jpg') !important;
    min-height: 100vh;
    display: grid;
    grid-template-areas: "title title"
      "img signup";
  }

  .form-signup {
    background-color: white !important;
    margin: 0 auto;
    width: 90%;
    grid-area: signup;
    position: relative;
    width: 600px;
    height: 550px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    backdrop-filter: blur(100px);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-pw {
    font-size: 16px;
    color: rgb(46, 46, 175);
    display: block;
    text-align: right;
    margin: 10px 0;
  }

  .login-pw:hover {
    color: gray;
  }

  .btn {
    width: 50%;
    display: flex;
    margin: 20px 0;
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