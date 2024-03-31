<template>
  <q-page>
    <div class="container">
      <div class="header">
        <div class="search-filter-class">
          <q-input
            outlined
            v-model="searchProjectName"
            placeholder="Tìm theo tên"
            class="bg-white input-box"
          />

          <div class="q-gutter-y-md column filter" style="max-width: 300px">
            <q-select
              color="teal"
              filled
              v-model="filterInput"
              :options="options"
              label="Bộ lọc"
            >
              <template v-slot:append>
                <q-icon name="cancel" @click.stop.prevent="cancelHandler" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="create-project-class">
          <q-btn
            flat
            round
            class="q-btn-class"
            style="bottom: 2px; right: 5px"
            @click="createProject"
          >
            <q-icon name="add" class="plus-icon"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              create project
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-dialog v-model="isModalVisible">
        <q-card>
          <CreateProjectModal
            v-if="isModalVisible"
            @close="closeModal"
          ></CreateProjectModal>
        </q-card>
      </q-dialog>
      <projectBox
        searchProjectName="searchProjectName"
        :project="filteredProjectByOption"
      ></projectBox>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount, computed } from "vue";
import ProjectBox from "../components/ProjectBox.vue";
import projectService from "../services/project.service";
import CreateProjectModal from "../components/CreateProjectModal.vue";

export default {
  components: {
    projectBox: ProjectBox,
    CreateProjectModal,
  },
  setup() {
    const searchProjectName = ref();
    const projects = ref([]);
    let user = ref();
    let isModalVisible = ref(false);
    const filterInput = ref("Tất cả");
    const options = ref(["Tất cả", "Cá nhân", "Thành viên"]);

    async function getUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        user = JSON.parse(userData);
      }
    }

    function createProject() {
      isModalVisible.value = !isModalVisible.value;
    }
    function closeModal() {
      isModalVisible.value = !isModalVisible.value;
    }

    onBeforeMount(async () => {
      await getUserFromLocalStorage();
      projects.value = await projectService.getAllProject(user.user_id, 2);
    });

    const filteredProjectByOption = computed(() => {
      let tempProjects;
      if (filterInput.value == "Tất cả") {
        tempProjects = projects.value;
        console.log();
      } else if (filterInput.value == "Cá nhân") {
        tempProjects = projects.value.filter(
          (pro) => pro.user.user_id === user.user_id
        );
      } else
        tempProjects = projects.value.filter(
          (pro) => pro.user.user_id !== user.user_id
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

    function cancelHandler() {
      filterInput.value = "Tất cả";
      searchProjectName.value = ""
    }

    return {
      searchProjectName,
      projects,
      isModalVisible,
      createProject,
      closeModal,
      filteredProjectByOption,

      filterInput,
      options,
      cancelHandler,
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
</style>
