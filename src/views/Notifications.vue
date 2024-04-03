<template>
  <q-page class="page">
    <div class="header">
      <h3>Thông báo ({{ data.length }})</h3>
    </div>

    <div v-if="data" class="body">
      <div v-for="notification in data" :key="notification.project_id">
        <div class="notification-info" v-if="notification.user">
          <div class="infor">
            <div class="mail">
              <q-icon name="mail" class="mail-icon"></q-icon>
            </div>
            <div class="noti-main">
              <p class="invite">{{ notification?.user?.user_full_name }} /{{ notification?.project_name }}</p>
              <p class="invite">Lời mời bạn tham gia dự án {{ notification?.project_name }} từ{{ notification?.user?.user_full_name }}</p>
            </div>
          </div>
          <div class="img">
            <img :src="notification.user.user_image_url" class="img-projectOwner"/>
          </div>
          <div class="accept-status">
            <q-icon
              name="check"
              class="accept-status-qicon"
              @click="updateMemberStatus(notification.project_id, 2)"
            ></q-icon>
            <q-icon
              name="close"
              class="accept-status-qicon"
              @click="updateMemberStatus( notification.project_id, 0)"
            ></q-icon>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import projectService from "../services/project.service";
import userService from "../services/user.service";
import projectMemberService from "../services/projectMember.service";
import {useToast} from "vue-toastification"

export default {
  setup() {
    const toast = useToast();
    const route = useRoute();
    const user_id = JSON.parse(localStorage.getItem("user")).user_id;
    const data = ref([]);
    const users = ref();
    const projectMemberUpdate = reactive({
      user_id: "",
      project_id: "",
      accept_status: "",
    });

    onBeforeMount(async () => {
      data.value = await projectService.getAllNotificationsByUserId(user_id, 1);
      console.log(data.value);
    });

    // Truyen xuong ma ko nhan z

    const updateMemberStatus = async ( project_id, accept_status) => {
      const index = data.value.findIndex((project) => project.project_id === project_id);
      try {
        await projectMemberService.updateMemberStatus({
          user_id,
          project_id,
          accept_status,
        });
        data.value.splice(index, 1);
       
        toast.success("Cập nhật thông tin thành công");
      } catch (error) {
        console.error(error);
        console.log("Xảy ra lỗi trong quá trình cập nhật");
      }
    };
    return {
      users,
      data,
      updateMemberStatus,
    };
  },
};
</script>

<style scoped>
.notification-info {
  display: flex;
  /* flex-direction: row; */
  justify-content: space-between;
  border: 1px solid #cccc;
  border-radius: 10px;
  align-items: center;
}
.notification-info:hover {
  background-color: #ddf4ff;
}

.infor {
  display: flex;
  padding: 8px;
}
.mail {
  padding: 0 8px 8px 8px;
}
.mail-icon {
  size: 25px;
}
.invite {
  margin: 0;
}

.img-projectOwner {
  width: 100%;
  box-shadow: 0 0 0 1px var(#ffffff1a, var(--color-avatar-border));
  width: 30px;
  height: 30px;
  border-radius: 50% !important;
  border-top-left-radius: 50% !important;
  border-top-right-radius: 50% !important;
  border-bottom-right-radius: 50% !important;
  border-bottom-left-radius: 50% !important;
  
}
.accept-status {
  right: 7px;
  top: 7px;
  font-size: 20px;
  /* cursor: pointer; */
  margin-right: 16px;
}

.accept-status-qicon {
  border-radius: 5px;
  padding-right: 16px;
}
.accept-status-qicon:hover {
  background: #d0d7de;
  color: #24292f;
}

.noti-main{
  width: 100%;
}

.img{
  width: 20%;
}
/* set cung cho info de khong bi choi suc */
.infor{
  width: 60%;
}
</style>
