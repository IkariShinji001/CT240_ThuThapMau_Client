<template>
  <q-page>
    <div class="container">
      <div class="header">
        <div class="search-filter-class">
          <q-input outlined label="Tim theo ten" v-model="searchName" class="search-class">
          </q-input>
          <div class="filter-class">FILTER</div>
        </div>

        <div class="create-project-class">
          <q-btn flat round class="q-btn-class" style="bottom: 2px; right: 5px" @click="createProject">
            <q-icon name="add" class="plus-icon"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              create project
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-dialog v-model="isModalVisible">
        <q-card>
          <CreateProjectModal v-if="isModalVisible" @close="closeModal"></CreateProjectModal>
        </q-card>
        
      </q-dialog>
      <projectBox :searchName="searchName" :project="project"></projectBox>
    </div>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import ProjectBox from "../components/ProjectBox.vue";
import projectService from "../services/project.service";
import CreateProjectModal from "../components/CreateProjectModal.vue"
import { is } from "quasar";

export default {
  components: {
    projectBox: ProjectBox,
    CreateProjectModal  
  },
  setup() {
    const searchName = ref();
    const project = ref([]);
    let user = ref();
    let isModalVisible = ref(false)

    async function getUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        user = JSON.parse(userData);
      }
    }

    function createProject(){
      isModalVisible.value = !isModalVisible.value
    }
    function closeModal(){
      isModalVisible.value = !isModalVisible.value  
    }

    onBeforeMount(async () => {
      await getUserFromLocalStorage();
      project.value = await projectService.getAllProject(user.user_id, 2);
      project.value.forEach((item, index) => {

        //a/sdfasdfas
        // console.log(`Project[${index}]:`, item);
      });
    });

    return {
      searchName,
      project,
      isModalVisible,
      createProject,
      closeModal
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
  width: 90%;
  display: flex;
}

.header {
  display: flex;
  justify-content: space-between;
}

.search-filter-class {
  display: flex;
}

.search-class {
  width: 300px;
  margin-right: 20px;
}

.filter-class {
  width: 100px;
  border: 2px solid rgb(173, 102, 21);
  display: flex;
  justify-content: center;
  align-items: center;
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
