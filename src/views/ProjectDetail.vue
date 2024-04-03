<template>
  <q-page>
    <div class="wrapper" v-if="project">
      <div class="banner">
        <img src="https://gstatic.com/classroom/themes/img_learnlanguage.jpg" />
        <p class="project_name">{{ project.project_name }}
          <br>
        <p class="status_text">Trạng thái: {{ project.project_status }}</p>
        <p class="status_text">Ngày khởi tạo dự án: {{ formatDateTime(project.project_created_at) }}</p>
        </p>
        <div class="setting-icon" v-if="isOwner">
          <q-icon name="settings" @click="handleOpenUpdate"></q-icon>
        </div>
        <div class="setting-icon groups">
          <q-icon @click="goToMember" name="group"></q-icon>
        </div>
      </div>
      <div class="input-search">
        <q-input :class="`search-name`" outlined v-model="collectionName" label="Tìm theo tên đợt thu thập"
          v-if="isOwner">
        </q-input>
        <q-input :class="`search-name-member`" outlined v-model="collectionName" label="Tìm theo tên đợt thu thập"
          v-else>
        </q-input>
        <q-btn v-if="isOwner" color="primary" class="btn-add" @click="openAdd = true">Thêm đợt thu thập</q-btn>
      </div>


      <div>
        <div v-for="collection in filteredCollection" :key="collection.collection_id" class="collection"
          @click="handleGoToCollectionDetail(collection.collection_id)">
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

      <q-dialog v-model="openUpdate">
        <q-card class="card-update">
          <h3>Cập nhật thông tin dự án</h3>
          <q-card-section>
            <q-input outlined label="Tên dự án" class="input" v-model="projectUpdate.project_name"></q-input>
            <q-select outlined label="Trạng thái của dự án" class="input" v-model="projectUpdate.project_status"
              :options="projectStatusOptions"></q-select>

            <q-btn color="primary" class="submit-update" @click="handleUpdateProject">Cập nhật</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openAdd">
        <q-card class="card-update">
          <h3>Thêm đợt thu thập mới</h3>
          <q-card-section>
            <q-input outlined label="Tên đợt thu thập" class="input" v-model="collectionAdd.collection_name"></q-input>
            <q-input outlined type="text-area" label="Thông tin mô tả cho đợt thu thập" class="input"
              v-model="collectionAdd.collection_description"></q-input>
            <div class="date-add">
              <q-input outlined label="Ngày bắt đầu đợt thu thập" class="input date"
                v-model="collectionAdd.collection_start" type="date"></q-input>
              <q-input outlined label="Ngày kết thúc đợt thu thập" class="input date"
                v-model="collectionAdd.collection_end" type="date"></q-input>
            </div>

            <q-file label="Hình ảnh cho đợt thu thập" outlined v-model="collectionAdd.file">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>

            <q-btn color="primary" class="submit-update" @click="handleAddCollection">Thêm đợt thu thập</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { computed, onBeforeMount, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import projectService from "../services/project.service";
import collectionService from "../services/collection.service";
import formatDate from "../util/formatDate";
import { useQuasar } from 'quasar'
export default {
  setup() {
    const $q = useQuasar()
    const route = useRoute();
    const collectionName = ref();
    const project = ref();
    const collections = ref();
    const { user_id } = JSON.parse(localStorage.getItem("user"));
    const router = useRouter();
    const toast = useToast();
    const openUpdate = ref();
    const isOwner = ref();
    const openAdd = ref();
    const projectId = ref(route.params.id);

    const projectUpdate = reactive({
      project_name: "",
      project_status: "",
    });

    const collectionAdd = reactive({
      collection_name: "",
      collection_start: "",
      collection_end: "",
      collection_description: "",
      collection_created_at: "",
      file: null,
      project_id: projectId.value,
      user_id: user_id,
    })


    const projectStatusOptions = ref(["Đang hoạt động", "Dừng hoạt động"]);

    watch(
      [() => collectionAdd.collection_start, () => collectionAdd.collection_end],
      ([newStart, newEnd], [oldStart, oldEnd]) => {
        if (newEnd && newStart && newEnd < newStart) {
          collectionAdd.collection_end = collectionAdd.collection_start;
        }
      }
    );

    watch(projectId, async (old, newValue) => {
  project.value = await projectService.getProjectById(newValue);
  collections.value = await collectionService.getCollectionByProjectId(
    newValue
  );
  isOwner.value = await projectService.checkIsOwnerProject(user_id, newValue);
})

   
    const handleAddCollection = async () => {
      $q.loading.show();
      try {
        collectionAdd.collection_created_at = new Date();
        const newCollection = await collectionService.createCollection(collectionAdd);
        collections.value.push(newCollection);
        console.log(collections.value);
        toast.success("Đã thêm đợt thu thập thành công");
      } catch (error) {
        console.log(error)
      } finally {
        $q.loading.hide();
      }

    }

    onBeforeMount(async () => {
      project.value = await projectService.getProjectById(projectId.value);
      collections.value = await collectionService.getCollectionByProjectId(
        projectId.value
      );
      isOwner.value = await projectService.checkIsOwnerProject(user_id, projectId.value);
    });

    const goToMember = () => {
      router.push({ path: `/projects/${projectId.value}/members` });
    }

    const filteredCollection = computed(() => {
      if (!collectionName.value) {
        return collections.value;
      }

      return collections.value.filter((collection) =>
        collection.collection_name
          .toLowerCase()
          .includes(collectionName.value.toLowerCase())
      );
    });

    // const handleGoToCollectionDetail = (collectionId) => {
    //   router.push({
    //     path: `/projects/${projectId}/collections/${collectionId}`,
    //   });
    // };
// NEW ----------
    const handleGoToCollectionDetail = (collectionId) => {
      router.push({
        path: `/collections/${collectionId}`,
      });
    };
// NEW ----------
    const handleOpenUpdate = () => {
      projectUpdate.project_name = project.value.project_name;
      projectUpdate.project_status = project.value.project_status;
      openUpdate.value = true;
    };

    const handleUpdateProject = async () => {
      try {
        await projectService.updateProjectById(projectId.value, projectUpdate);
        toast.success("Dự án đã cập nhật thông tin thành công");
      } catch (error) {
        console.error(error);
        toast.error("Xảy ra lỗi trong quá trình cập nhật");
      }
    }

    const formatDateTime = (Date) => {
      return formatDate(Date);
    };

    return {
      collections,
      project,
      projectId,
      collectionName,
      formatDateTime,
      filteredCollection,
      handleGoToCollectionDetail,
      projectUpdate,
      openUpdate,
      handleOpenUpdate,
      projectStatusOptions,
      handleUpdateProject,
      isOwner,
      goToMember,
      openAdd,
      collectionAdd,
      handleAddCollection
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

.setting-icon {
  position: absolute;
  right: 40px;
  top: 10px;
  font-size: 40px;
  color: white;
  cursor: pointer;
}

.setting-icon:hover {
  color: rgb(10, 10, 137);
}

.card-update {
  max-width: 1000px;
  width: 800px;
}

.input {
  font-size: 20px;
  margin: 10px 0;
}

h3 {
  font-size: 32px;
  text-align: center;
}

.submit-update {
  display: flex;
  margin: 0 auto;
  font-size: 20px;
  padding: 0 50px;
  margin-top: 20px;
}

.status_text {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 20px;
}

.groups {
  right: 100px;
}

.input-search {
  display: flex;
  justify-content: space-between;
}

.search-name {
  width: 75%;
  max-width: 100%;
}

.search-name-member {
  width: 100% !important;
}

.btn-add {
  width: 20%;
}

.date-add {
  display: flex;
  justify-content: space-between;
}

.date {
  width: 45%;
}
</style>
