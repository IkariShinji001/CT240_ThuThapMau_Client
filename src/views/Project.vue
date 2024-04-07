<template>
  <q-page>
    <div class="container">
      <div class="header">
        <div class="search-filter-class">
          <q-input outlined v-model="searchProjectName" placeholder="Tìm theo tên" class="bg-white input-box" />

          <div class="q-gutter-y-md column filter" style="max-width: 300px">
            <q-select color="teal" filled v-model="filterInput" :options="options" label="Bộ lọc">
              <template v-slot:append>
                <q-icon name="cancel" @click.stop.prevent="cancelHandler" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="create-project-class">
          <q-btn flat round class="q-btn-class" style="bottom: 2px; right: 5px"
            @click="openRequestToJoinProject = true">
            <q-icon name="integration_instructions" class="invite-icon"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              Tham gia dự án
            </q-tooltip>
          </q-btn>
        </div>


        <div class="create-project-class">
          <q-btn flat round class="q-btn-class" style="bottom: 2px; right: 5px" @click="createProject">
            <q-icon name="add" class="plus-icon"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              Tạo dự án mới
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-dialog v-model="isModalVisible">
        <q-card>
          <CreateProjectModal v-if="isModalVisible" @close="closeModal" @getNewProject="getNewProject">
          </CreateProjectModal>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openRequestToJoinProject">
        <q-card style="max-width: 1000px; width: 900px;">
          <h3 style="text-align: center;">Tham gia dự án bằng mã mời</h3>
          <q-card-section>
            <q-input style="font-size: 18px;" outlined label="Nhập mã mời của dự án" v-model="inviteCode"></q-input>
            <q-btn color="primary" class="btn-submit-join" @click="handleJoinToProject">THAM GIA</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
      <projectBox :project="filteredProjectByOption" :user="user"></projectBox>
    </div>
  </q-page>
</template>

<script>
  import { ref, onBeforeMount, computed } from "vue";
  import ProjectBox from "../components/ProjectBox.vue";
  import projectService from "../services/project.service";
  import CreateProjectModal from "../components/CreateProjectModal.vue";
  import projectMemberService from "../services/projectMember.service";
  import { useToast } from "vue-toastification";
  export default {
    components: {
      projectBox: ProjectBox,
      CreateProjectModal,
    },
    setup() {
      const toast = useToast();
      const searchProjectName = ref();
      const projects = ref([]);
      let user = ref();
      let isModalVisible = ref(false);
      const filterInput = ref("Tất cả");
      const options = ref(["Tất cả", "Cá nhân", "Thành viên"]);
      const openRequestToJoinProject = ref();
      const inviteCode = ref();

      onBeforeMount(async () => {
        try {
          getUserFromLocalStorage();
          projects.value = await projectService.getAllProject(
            user.value.user_id,
            2
          );
        } catch (e) {
          console.log(e);
        }
      });

      function getNewProject(pro) {
        projects.value.push(pro);
      }

      function getUserFromLocalStorage() {
        const userData = localStorage.getItem("user");
        if (userData) {
          user.value = JSON.parse(userData);
        }
      }

      function createProject() {
        isModalVisible.value = !isModalVisible.value;
      }
      function closeModal() {
        isModalVisible.value = !isModalVisible.value;
      }

      const filteredProjectByOption = computed(() => {
        let tempProjects;
        if (filterInput.value == "Tất cả") {
          tempProjects = projects.value;
        } else if (filterInput.value == "Cá nhân") {
          tempProjects = projects.value.filter(
            (pro) => pro.user.user_id === user.value.user_id
          );
        } else
          tempProjects = projects.value.filter(
            (pro) => pro.user.user_id !== user.value.user_id
          );

        if (!searchProjectName.value) {
          return tempProjects;
        }

        return tempProjects.filter((pro) =>
          pro.project_name
            .toLowerCase()
            .includes(searchProjectName.value.toLowerCase())
        );
      });

      const handleJoinToProject = async () => {
        const user_id = user.value.user_id;
        if (!inviteCode.value) {
          toast.error("Không được để trống trường mã mời");
          return;
        }

        try {
          await projectMemberService.requestToJoinProject(user_id, inviteCode.value);
          toast.success("Đã gửi yêu cầu tham gia dự án");
        } catch (error) {
          toast.error("Mã mời không tồn tại");
          console.log(error)
        }
      }

      function cancelHandler() {
        filterInput.value = "Tất cả";
        searchProjectName.value = "";
      }

      return {
        searchProjectName,
        projects,
        user,
        isModalVisible,
        createProject,
        closeModal,
        filteredProjectByOption,
        openRequestToJoinProject,
        inviteCode,
        filterInput,
        options,
        cancelHandler,
        getNewProject,
        handleJoinToProject
      };
    },
  };
</script>
<style scoped>
  .container {
    width: 95%;
    margin: auto;
  }

  .header {
    margin: auto;
    margin-top: 15px;
    margin-bottom: 30px;
    width: 90%;
    display: flex;
    justify-content: space-between;
  }

  .search-filter-class {
    display: flex;
    align-items: center;
  }

  .input-box {
    width: 400px;
    margin-right: 10px;
  }

  .create-project-class {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .plus-icon {
    font-weight: bold;
    font-size: 40px;
    color: var(--secondary-color);
  }

  .invite-icon {
    font-size: 40px;
    color: var(--secondary-color);
    cursor: pointer;
  }

  .btn-submit-join {
    display: flex;
    margin: 0 auto;
    padding: 5px 80px;
    margin-top: 20px;
  }



</style>
