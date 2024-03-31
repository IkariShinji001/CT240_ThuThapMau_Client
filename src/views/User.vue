<template>
    <div class="container">
        <div>  
            <h1>Tài khoản</h1>
        </div>
        <div>
            <section class="form">
        <div class="form-box">
          <h2>Đăng nhập</h2>


            <q-input
              class="input"
              v-model="user.user_name"
              type="text"
              outlined
              label="Tên người dùng:"
            >
            <template v-slot:prepend>
                <q-icon name="name" />
              </template>
            </q-input>

            
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


            <q-btn class="btn" @click="handleLogin">Đăng nhập</q-btn>
            <section class="func-box">
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                  <label class="form-check-label" for="form2Example31"> Remember me </label>
              </div>
              <router-link class="forget-pw" to="/forget-password"
                >Quên mật khẩu</router-link>
            </section>
            
              
            
        </div>
      </section>
        </div>

    </div>


</template>

<script>
export default {

}
</script>

<style>

</style>