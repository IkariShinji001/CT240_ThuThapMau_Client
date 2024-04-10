<template>
  <q-page class="page">
    <div class="header">
      <div>
        <q-btn class="btn-invite" @click="changeTab('invite')"
          >Người khách mời mình vào dự án</q-btn
        >
        <q-btn class="btn-request" @click="changeTab('request')"
          >Người ta xin vào dự án của mình</q-btn
        >
      </div>

      <div v-if="currentTab === 'invite'">
        <h3>Lời mời vào dự án ({{ data.length }})</h3>
        <div>
          <h3 v-if="data.length > 0"></h3>
          <div class="img-container" v-else>
            <img
              class="notification-img"
              src="https://static.vecteezy.com/system/resources/previews/004/968/451/non_2x/turn-off-no-message-notification-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg"
              alt="Éo có"
            />
          </div>
        </div>
        <div class="invite">
          <div v-if="data" class="body">
            <div v-for="notification in data" :key="notification.project_id">
              <div class="notification-info" v-if="notification.user">
                <div class="infor">
                  <div class="mail">
                    <q-icon name="mail" class="mail-icon"></q-icon>
                  </div>
                  <div class="noti-main">
                    <p class="invite">
                      {{ notification?.user?.user_full_name }} /{{
                        notification?.project_name
                      }}
                    </p>
                    <p class="invite">
                      Lời mời bạn tham gia dự án
                      {{ notification?.project_name }} từ{{
                        notification?.user?.user_full_name
                      }}
                    </p>
                  </div>
                </div>
                <div class="img">
                  <img
                    :src="notification?.user?.user_image_url"
                    class="img-projectOwner"
                  />
                </div>
                <div class="accept-status">
                  <q-icon
                    name="check"
                    class="accept-status-qicon"
                    @click="acceptMemberStatus(notification.project_id, 2)"
                  ></q-icon>
                  <q-icon
                    name="close"
                    class="accept-status-qicon"
                    @click="
                      deleteMemberFromProjectMember(notification.project_id)
                    "
                  ></q-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'request'">
      <h4>Yêu cầu tham gia vào dự án của bạn ({{ dataReq.length }})</h4>
      <div class="header">
        <h4 v-if="dataReq.length > 0">
          
        </h4>
        <div class="img-container" v-else>
            <img
              class="notification-img"
              src="https://static.vecteezy.com/system/resources/previews/004/968/451/non_2x/turn-off-no-message-notification-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg"
              alt=""
            />
          </div>
      </div>

      <div class="invite">
        <div v-if="dataReq.length > 0" class="body">
          <div v-for="notification in dataReq" :key="notification.id.project.project_id">
            
            <div class="notification-info" > <!-- v-if="notification.user" -->
              <div class="infor">
                <div class="mail">
                  <q-icon name="mail" class="mail-icon"></q-icon>
                </div>
                <div class="noti-main">
                  <p class="invite">
                    {{ notification?.id?.user?.user_full_name }} 
                  </p>
                  <p class="invite">
                    Yêu cầu tham gia dự án
                    {{ notification?.id?.project?.project_name }} của bạn
                  </p>
                </div>
              </div>
              <div class="img">
                <img
                  :src="notification?.id?.user?.user_image_url" 
                  class="img-projectOwner"
                />
              </div>
              <div class="accept-status">
                <q-icon
                    name="check"
                    class="accept-status-qicon"
                    @click="acceptMemberStatusRequest(notification.id.user.user_id,notification.id.project.project_id, 2)"
                  ></q-icon>
                  <q-icon
                    name="close"
                    class="accept-status-qicon"
                    @click="deleteMemberFromProjectMemberRequest(notification.id.project.project_id, notification.id.user.user_id)" 
                  ></q-icon>
              </div>
            </div>
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
import { useToast } from "vue-toastification";

export default {
  setup() {
    const tabs = ["invite", "request"];
    const currentTab = ref("invite");
    const toast = useToast();
    const user_id = JSON.parse(localStorage.getItem("user")).user_id;
    const data = ref([]);
    const dataReq = ref([]);
    const users = ref();


    onBeforeMount(async () => {
      data.value = await projectService.getAllNotificationsByUserId(user_id, 0);
      dataReq.value = await projectMemberService.getNotificationRequest(user_id);
    });

    // Truyen xuong ma ko nhan z

    const acceptMemberStatus = async (project_id, accept_status) => {
      const index = data.value.findIndex(
        (project) => project.project_id === project_id
      );
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
    

    const deleteMemberFromProjectMember = async (project_id) => {
      const index = data.value.findIndex(
        (project) => project.project_id === project_id
      );
      try {
        await projectMemberService.removeProjectMember(user_id, project_id);
        toast.success("Xoá thành công");
        data.value.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    };

    const acceptMemberStatusRequest = async (user_id,project_id, accept_status) => {
      const index = dataReq.value.findIndex(
        (project) => project.project_id === project_id
      );
      try {
        await projectMemberService.updateMemberStatus({
          user_id,
          project_id,
          accept_status,
        });
        dataReq.value.splice(index, 1);

        toast.success("Cập nhật thông tin thành công");
      } catch (error) {
        console.error(error);
        console.log("Xảy ra lỗi trong quá trình cập nhật");
      }
    };
    const deleteMemberFromProjectMemberRequest = async (project_id, user_id) => {
      const index = dataReq.value.findIndex(
        (project) => project.id.project.project_id === project_id
      );
      try {
        await projectMemberService.removeProjectMember(user_id, project_id);
        toast.success("Xoá thành công");
        dataReq.value.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
    };

    const changeTab = (tab) => {
      currentTab.value = tab;
    };
    return {
      users,
      data,
      dataReq,
      acceptMemberStatus,
      deleteMemberFromProjectMember,
      acceptMemberStatusRequest,
      changeTab,
      currentTab,
      deleteMemberFromProjectMemberRequest
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
  margin-bottom: 8px;
}
.btn-invite, .btn-request{
  background-color: #f5f5f5;
  color: #000;
  border: 1px solid #cccc;
  border-radius: 10px;
  margin-right: 8px;

} 
.btn-invite:hover, .btn-request:hover{
  background-color: #f5f5f5;
  color: #000;
  border: 1px solid #cccc;
  border-radius: 10px;
  margin-right: 8px;
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

.noti-main {
  width: 100%;
}

.img {
  width: 20%;
}

.img-container {
  width: 100%;
  text-align: center;
}

.notification-img {
  width: 40%;
  height: auto;
  margin: 0 auto;
}

/* set cung cho info de khong bi choi suc */
.infor {
  width: 60%;
}

.request-show,
.yours-show,
.invite-show {
  display: block;
}

.request-hide,
.yours-hide,
.invite-hide {
  display: none;
}
</style>
