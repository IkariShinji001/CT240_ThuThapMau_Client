<template>
  <div class="container">
    <q-card-section class="header">
      <q-item-section>
        <q-item-label class="text-h4">Thông tin cá nhân</q-item-label>
      </q-item-section>
    </q-card-section>

    <q-card-section class="content">
      <div class="info">
        <q-item class="name-item">
          <q-item-label>Tên:</q-item-label>
          <input type="text" class="info-input" v-model="user.user_name" />
          <!-- <p>Tên của bạn có thể xuất hiện trên ROOOMM nơi bạn đóng góp hoặc được nhắc đến. Bạn có thể loại bỏ nó bất cứ lúc nào.</p> -->
        </q-item>
        <q-item class="name-item">
          <q-item-label>Email:</q-item-label>
          <input type="email" class="info-input" v-model="user.user_email"/>
        </q-item>
        <q-item class="name-item">
          <q-item-label>Điện thoại:</q-item-label>
          <input type="tel" class="info-input" v-model="user.user_phone_number" />
        </q-item>
        <q-item-section class="btn-update">
          <q-btn @click="editUser" class="btn-update-label"> Cập nhật thông tin</q-btn>
        </q-item-section>
      </div>

      <div class="avatar">
        <h6>Ảnh đại diện: </h6>
        <img
          src="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-dep-92.jpg"
        />
        <q-btn icon="edit" class="btn-edit-img" @click="editImg"></q-btn>
      </div>
    </q-card-section>
  </div>
</template>
  
<script>
import { onBeforeMount, reactive } from "vue";
import userService from "../services/user.service";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const toast = useToast()
    const route = useRoute();
    const id = route.params.id;
    const user = reactive({ 
      user_name: "",
      user_email: "",
      user_phone_number: "",
    })

    onBeforeMount(async () => {
      try {
        const res = await userService.getUserId(id);
        console.log(res);
        user.user_name = res.user_full_name;
        user.user_email = res.user_email;
        user.user_phone_number = res.user_phone_number;
      } catch (e) {}
    });

    const editUser = async () => {
      try {
        if(!user.user_name){
          toast.error("Không được để trống tên")
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(user.user_email)){
          toast.error("Email không đúng định dạng")
          return;
        }
        const regex = /^0\d{9}$/;
        if(!regex.test(user.user_phone_number)){
          toast.error("Số điện thoại không đúng định dạng")
          return;
        } 
        await userService.update(id, {
          user_full_name: user.user_name,
          user_email: user.user_email,
          user_phone_number: user.user_phone_number,
        });
        toast.success("Cập nhật thành công")
      } catch (e) {}
    };

    return {
      editUser,
      user
    };
  },
};
</script>

<style scoped>
.container {
  margin: 0px 10%;
  height: 100vh;
}

.header {
  border-bottom: 0.2px solid;
}

.name-item {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: flex-start; /* Align items to the left */
}

.info-input {
  padding: 5px 12px;
  line-height: 20px;
  width: 100%; /* Maintain full width */
  margin-top: 5px; /* Add some margin for spacing */
  height: 60px;
  border-radius: 10px;
  background-color: #f0f4f9 ;
  border: 1px solid #d0d7de;
}

.content {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  height: 100vh;
}

.btn-update {
  margin-left: 16px;
  width: 30%;
  border-radius:10px;
  margin: 10px 150px;
  background-color: rgb(31, 136, 61) ;
}
.btn-update-label{
  color: white;
  border-radius: 10px;

}

.info {
  flex: 7; /* Chiếm 70% không gian */
  padding: 10px;
}

.avatar {
  flex: 3; /* Chiếm 30% không gian */
  padding: 10px;
}

img {
  height: 150px;
  width: 150px;
  border-radius: 50% ;
}

.btn-edit-img {
  width: 30px;
  background: #f0e9e9;
  font-size: 8px;
}
</style>