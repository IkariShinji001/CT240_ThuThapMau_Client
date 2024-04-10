<template>
  <q-page>
    <div class="container" v-if="project">
      <div @click="goBackProject" class="go-back">
        <p class="project-name"><q-icon name="arrow_back_ios" class="go-back-icon"></q-icon>{{ project.project_name }}
        </p>
      </div>
      <div>
        <div class="inviteCode"><b>Mã tham gia vào dự án: </b>{{ project.inviteCode }}</div>

        <h3>Trưởng dự án</h3>
        <q-separator size="5px" />
        <div v-if="projectOwner" class="owner">
          <img class="img-owner" :src="projectOwner.user_image_url" />
          <div class="owner-name">
            <div class="name">{{ projectOwner.user_full_name }}</div>
          </div>
        </div>
        <div class="member-title" v-if="projectOwner">
          <h3>Thành viên</h3>
          <q-icon v-if="projectOwner.user_id === userId" name="group_add" class="add-icon"
            @click="openAdd = true"></q-icon>
        </div>

        <q-separator size="5px" />
        <div v-if="projectMemer" class="members">
          <div v-for="member in projectMemer">
            <div class="member">
              <div class="member-container">
                <img class="img-owner" :src="member.user_image_url" />
                <div class="owner-name">
                  <div class="name">{{ member.user_full_name }}</div>
                </div>
              </div>
              <div class="function">
                <q-icon v-if="projectOwner.user_id === userId" name="cancel"
                  @click="removeMemberFromProject(member.user_id)"></q-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-dialog v-model="openAdd">
        <q-card class="add-card">
          <q-card-section>
            <h3>Thêm thành viên vào dự án</h3>
          </q-card-section>
          <q-card-section>
            <div class="input-add-container">
              <q-input class="user-email-add" outlined v-model="userEmailAdd" label="Nhập email của người bạn mời">
              </q-input>
              <q-btn color="primary" class="btn-add" @click="handleAddUserToListWait">Thêm</q-btn>
            </div>
            <div v-if="memberWaitToAdd.length > 0">
              <h3>Danh sách thành viên đang chọn</h3>
              <div v-for="(userMail, i) in memberWaitToAdd" class="member-add" :key="userMail.user_email">
                <h3 class="user_mail">
                  {{ i + 1 + ". " + userMail.user_email }}
                </h3>
                <q-icon class="icon-cancel" name="cancel"
                  @click="handleRemoveUserFromListWait(userMail.user_email)"></q-icon>
              </div>
            </div>
            <q-btn class="btn-submit" color="primary" @click="handleSubmit">Mời</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
  import { onBeforeMount, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import projectMemberService from "../services/projectMember.service";
  import { useToast } from "vue-toastification";
  import userService from "../services/user.service";
  import projectService from "../services/project.service";

  export default {
    setup() {
      const toast = useToast();
      const route = useRoute();
      const router = useRouter();
      const projectId = route.params.id;
      const projectMemer = ref();
      const userId = JSON.parse(localStorage.getItem("user")).user_id;
      const projectOwner = ref();
      const openAdd = ref();
      const userEmailAdd = ref();
      const memberWaitToAdd = ref([]);
      const project = ref();

      onBeforeMount(async () => {
        project.value = await projectService.getProjectById(projectId);
        const data = await projectMemberService.getProjectMember(projectId, 2);
        console.log(data);
        projectMemer.value = data.map((value) => {
          return value.id.user;
        });
        projectOwner.value = data.find((element) => {
          return element.id.project.user.user_id === element.id.user.user_id;
        });
        projectOwner.value = projectOwner.value.id.user;
        projectMemer.value = projectMemer.value.filter((value) => {
          return value.user_id !== projectOwner.value.user_id;
        });
      });

      const removeMemberFromProject = async (memberId) => {
        const user = projectMemer.value.find((userMember) => {
          return userMember.user_id === memberId;
        });
        const confirm = window.confirm(
          "Bạn muốn xóa " + user.user_full_name + " ra khỏi dự án!"
        );
        if (!confirm) {
          return;
        }
        try {
          await projectMemberService.removeProjectMember(memberId, projectId);
          projectMemer.value.splice(
            projectMemer.value.findIndex((user) => user.user_id === memberId),
            1
          );
          toast.success(
            "Xóa " + user.user_full_name + " ra khỏi dự án thành công"
          );
        } catch (error) {
          console.log(error);
        }
      };

      const handleSubmit = async () => {
        const listUserIdAdd = memberWaitToAdd.value.map((user) => user.user_id);
        try {
          await projectMemberService.addMembersToProject(
            listUserIdAdd,
            projectId
          );

          memberWaitToAdd.value = [];
          toast.success("Thêm thành công");
        } catch (error) {
          console.log(error);
        }
      };

      const handleAddUserToListWait = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = userEmailAdd.value.trim();

        if (!emailPattern.test(email)) {
          toast.error("Không đúng định dạng email");
        }

        for (const member of projectMemer.value) {
          if (member.user_email === email) {
            toast.error("Thành viên này đã có trong dự án");
            return;
          }
        }

        if (email === projectOwner.value.user_email) {
          toast.error("Thành viên này đã có trong dự án");
          return;
        }

        for (const member of memberWaitToAdd.value) {
          if (member.user_email === email) {
            toast.error("Thành viên này đã có trong dự án");
            return;
          }
        }

        try {
          const user = await userService.getUserByEmail(email);
          if (user) {
            memberWaitToAdd.value.push(user);
            userEmailAdd.value = "";
            return;
          }
          toast.error("Không tồn tại email này");
          return;
        } catch (error) {
          console.log(error);
          toast.error("Không tồn tại email này");
        }
      };


      const goBackProject = () => {
        router.push({ path: `/projects/${projectId}` })
      }

      const handleRemoveUserFromListWait = (userMail) => {
        const index = memberWaitToAdd.value.findIndex((user) => user.user_email === userMail);
        memberWaitToAdd.value.splice(
          index,
          1
        );
      };

      return {
        projectOwner,
        projectMemer,
        removeMemberFromProject,
        openAdd,
        memberWaitToAdd,
        userEmailAdd,
        handleAddUserToListWait,
        handleRemoveUserFromListWait,
        handleSubmit,
        userId,
        project,
        goBackProject
      };
    },
  };
</script>

<style scoped>
  .container {
    width: 95%;
    margin: 0 auto;
  }

  .owner {
    display: flex;
  }

  .img-owner {
    width: 60px;
    border-radius: 100px;
  }

  .owner-name {
    height: inherit;
    display: flex;
    justify-items: center;
  }

  .owner,
  .members {
    margin: 20px 0 !important;
  }

  h3 {
    font-size: 25px;
    font-weight: bold;
  }

  .member {
    display: flex;
    margin: 10px 0;
    width: 100%;
    justify-content: space-between;
  }

  .member-container {
    display: flex;
    margin: 10px 0;
  }

  .name {
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-left: 20px;
  }

  .function {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 50px;
    font-size: 25px;
    color: rgb(18, 18, 132);
  }

  .function:hover {
    color: brown;
    cursor: pointer;
  }

  .member-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-icon {
    font-size: 30px;
    margin-right: 50px;
    color: rgb(71, 71, 237);
    cursor: pointer;
  }

  .add-icon:hover {
    color: black;
  }

  .add-card {
    max-width: 1000px;
    width: 1000px;
    text-align: center;
  }

  .btn-submit {
    margin-top: 20px;
    padding: 5px 80px;
    font-size: 18px;
  }

  .user-email-add {
    font-size: 18px;
    width: 70%;
    margin: 0 auto;
  }

  .input-add-container {
    display: flex;
  }

  .btn-add {
    width: 20%;
  }

  .user_mail {
    text-align: left;
    margin: 0;
    margin-left: 20px;
    font-size: 20px;
    font-weight: normal;
  }

  .member-add {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icon-cancel {
    margin-right: 100px;
    font-size: 30px;
    cursor: pointer;
  }

  .inviteCode {
    text-align: right;
    font-size: 20px;
  }

  .project_name {
    font-size: 20px;
  }


  .go-back-icon {
    font-size: 30px;
    font-weight: bold;
  }

  .go-back {
    width: fit-content;
    cursor: pointer;
  }

  .go-back:hover {
    color: #1976D2;
  }

  .project-name {
    font-size: 20px;
  }


</style>
