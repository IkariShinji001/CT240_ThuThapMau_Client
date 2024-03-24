<template>
  <div class="container">
    <q-card-section class="header">
      <q-item-section>
        <q-item-label class="text-h6">Thông tin người dùng</q-item-label>
      </q-item-section>
    </q-card-section>

    <q-card-section class="content">
      <div class="info">
        <q-item class="name-item">
          <q-item-label>Name:</q-item-label>
          <input type="text" class="info-input" v-model="userName" />
        </q-item>
        <q-item class="name-item">
          <q-item-label>Email:</q-item-label>
          <input type="email" class="info-input" v-model="userEmail" disabled />
        </q-item>
        <q-item class="name-item">
          <q-item-label>Phone Number:</q-item-label>
          <input type="tel" class="info-input" v-model="userPhoneNumber" />
        </q-item>
        <q-item-section class="btn-update">
          <q-btn @click="editUser"> Cập nhật thông tin</q-btn>
        </q-item-section>
      </div>
      <div class="avatar">
        <img
          src="https://cdn.sforum.vn/sforum/wp-content/uploads/2023/11/avatar-dep-92.jpg"
        />
        <q-btn icon="edit" class="btn-edit-img" @click="editImg"></q-btn>
      </div>
    </q-card-section>
  </div>
</template>
  
<script>
import { ref } from "vue";
import userService from "../services/user.service";

export default {
  setup() {
    const userName = ref();
    const userEmail = ref();
    const userPhoneNumber = ref();

    const editUser = async () => {
      try {
        const res = await userService.update({
          user_full_name: userName.value,
          user_email: userEmail.value,
          user_phone_number: userPhoneNumber.value,
        });
      } catch (e) {}
    };

    return {
      userName,
      userEmail,
      userPhoneNumber,
      editUser,
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
  border-bottom: 3px solid;
}

.name-item {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: flex-start; /* Align items to the left */
}

.info-input {
  width: 80%; /* Maintain full width */
  margin-top: 5px; /* Add some margin for spacing */
  height: 60px;
  border-radius: 10px;
}

.content {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  height: 100vh;
}

.btn-update {
  margin-left: 16px;
  width: 30%;
  border-radius: 20px;
  margin: 10px 150px;
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
  border-radius: 50%;
}

.btn-edit-img {
  width: 30px;
  background: #f0e9e9;
  font-size: 8px;
}
</style>