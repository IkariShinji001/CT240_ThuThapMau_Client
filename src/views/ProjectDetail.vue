<template>
  <q-page>
    <div class="wrapper" v-if="project">
      <div class="banner">
        <img src="https://gstatic.com/classroom/themes/img_learnlanguage.jpg" />
        <p class="project_name">{{ project.project_name }}</p>
        <div v-if="project.project_status == 'Active'" class="project_status">
          <q-icon name="directions_run" class="active"></q-icon>
        </div>
        <div v-else class="project_status">
          <q-icon name="stop_circle" class="inactive"></q-icon>
        </div>
      </div>
      <q-input
        outlined
        v-model="collectionName"
        label="Tìm theo tên đợt thu thập"
      >
      </q-input>

      <div>
        <div
          v-for="collection in filteredCollection"
          :key="collection.collection_id"
          class="collection"
        >
          <div class="icon-wrapper">
            <div class="icon-container">
              <q-icon name="article" class="collection-icon"></q-icon>
            </div>
          </div>

          <div class="collection-info">
            <div>
              <h4>{{ collection.collection_name }}</h4>
              <p>
                Ngày tạo: {{ formatDateTime(collection.collection_created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <col
    </div>
  </q-page>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import projectService from "../services/project.service";
import collectionService from "../services/collection.service";
import formatDate from "../util/formatDate";
export default {
  setup() {
    const route = useRoute();
    const collectionName = ref();
    const project = ref();
    const collections = ref();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    const projectId = route.params.id;

    onBeforeMount(async () => {
      project.value = await projectService.getProjectById(projectId);
      collections.value = await collectionService.getCollectionByProjectId(
        projectId
      );
    });

    const filteredCollection = computed(() => {
      if (!collectionName.value) {
        return collections.value; // Return all collections if no filter is applied
      }

      return collections.value.filter((collection) =>
        collection.collection_name
          .toLowerCase()
          .includes(collectionName.value.toLowerCase())
      );
    });

    const formatDateTime = (Date) => {
      return formatDate(Date);
    };

    return {
      collections,
      project,
      projectId,
      collectionName,
      formatDateTime,
      filteredCollection
    };
  },
};
</script>

<style scoped>
.wrapper {
  width: 90%;
  margin: 0 auto;
}

.banner {
  width: 100%;
  position: relative;
}

img {
  width: 100%;
  height: 50%;
  border-radius: 10px;
}
.project_name {
  color: white;
  position: absolute;
  bottom: 10%;
  left: 30px;
  font-size: 40px;
  font-weight: bold;
}

.project_status {
  top: 10%;
  position: absolute;
  left: 30px;
}

.active {
  font-size: 100px;
  color: rgb(171, 237, 171);
}

.inactive {
  font-size: 100px;
  color: brown;
}

h4 {
  margin: 0;
  padding: 0;
}

.collection {
  display: flex;
  padding: 10px 30px;
  border: 1px solid #cccc;
  border-radius: 10px;
  margin: 10px 0;
  height: 90px;
  justify-items: center !important;
}

.collection:hover {
  background-color: rgb(3, 8, 148);
  cursor: pointer;
}

.collection-icon {
  font-size: 40px;
  color: white;
}

.collection:hover .collection-info {
  color: white;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background-color: rgb(3, 8, 148);
  border-radius: 100px;
  margin: 10px 10px 10px 0;
}

.collection-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper {
  height: 100%;
  display: flex;
  justify-items: center;
}
</style>
