<template>
    <q-page>
      <div class="container">
        <h1>Đăng Ký</h1>
        <section class="form-signup">
          <div class="form-box">
            <h2>Đăng Ký</h2>
  
              <q-input
                class="input"
                v-model="user.user_email"
                type="text"
                outlined
                label="Email"
              >
              <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              
  
            <q-input
                class="input"
                v-model="user.user_password"
                type="text"
                outlined
                label="Password"
              >
              <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
            </q-input>
                <q-input
                class="input"
                v-model="user.repassword"
                type="text"
                outlined
                label="rePassword"
              >
              <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
              </q-input>
              <q-btn class="btn" @click="handleSignup">Đăng Ký</q-btn>
              <section class="func-box">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                    <label class="form-check-label" for="form2Example31"> Remember me </label>
                </div>
                <router-link class="login-pw" to="/login"
                  >Đã có tài khoản</router-link>
              </section>
              
              
          </div>
        </section>
        <div class="image-container">
          <img src="../assets/THANH DUY BUFFET.png" />
        </div>
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
      user_email: '',
      user_password: '',
      repasswd: '',
    });

    const handleSignup = async () =>{
      try {
        if (user.user_password !== user.repasswd) {
          toast.error("Mật khẩu nhập lại không đúng");
        }
        await userService.login(user); // login => signup
        router.push({path: '/'})
        toast.success("Đăng ký thành công");
      } catch (error) {
        toast.error("Sai email hoặc mật khẩu");
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
  
  .func-box{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2px;
  }
  
  img {
    margin-top: 10px;
    width: 60%;
    height: 50%;
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
    background-color: white;
    margin-top: 15px;
    font-size: 17px;
  
    position: relative;
    width: 100%;
    height: 50px;
    border-bottom: 2px solid #162938;
    margin: 30px 0;
    
  }
  
  
  .container {
    background-color: rgba(148, 196, 158, 0.675) !important;
    min-height: 100vh;
    display: grid;
    grid-template-areas: "title title"
                        "img signup";
  }
  
  .form-signup {
  background-color: azure !important;
    margin: 0 auto;
    width: 90%;
    grid-area: signup;
    position: relative;
    width: 400px;
    height: 480px;
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
  
  .login-pw:hover{
    color: gray;
  }
  
  .btn {
    width: 100%;
    margin: 30px 0;
    background-color: #1976d2;
    font-size: 18px;
    color: white;
    font-weight: bolder;
  }
  
  .btn:active{
    color:red;
    background-color: white;
  }
  
  
  </style>
  