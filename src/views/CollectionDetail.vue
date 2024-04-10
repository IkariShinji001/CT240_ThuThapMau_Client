<template>
  <q-page>
    <div @click="goBackProject" class="go-back" v-if="collection && project">
      <p class="project-name"><q-icon name="arrow_back_ios" class="go-back-icon"></q-icon>{{ project.project_name }}</p>
    </div>
    <div class="container" v-if="collection && project">
      <div class="header" :style="`background-image: url(${collection.collection_image_url});`">
        <p class="collection_name">{{ collection.collection_name }}</p>
        <div class="header-info">
          <div class="owner">
            <p class="user_name">{{ project.user.user_full_name }}</p>
            <div class="icon-separator">
              •
            </div>
            <p class="created_at">{{ formatDateTime(collection.collection_created_at) }} </p>
          </div>

          <div>
            <p class="date">Ngày bắt đầu: {{ formatDateTime(collection.collection_start) }}</p>
          </div>

          <div>
            <p class="date">Ngày kết thúc: {{ formatDateTime(collection.collection_end) }}</p>
          </div>
          <div>
            <q-icon class="icon-update" v-if="isOwner" name="settings" @click="openUpdateCollection"></q-icon>
          </div>
          <div class="btn-add-form">
            <q-btn class="btn-open-add" v-if="isOwner" @click="openCreateForm = true">Tạo Form cho đợt
              thu thập</q-btn>
          </div>
        </div>

      </div>
      <q-separator size="5px" />
      <div class="collection-container">
        <q-input v-model="searchName" outlined label="Tìm theo tên của form" class="input"></q-input>
        <div v-for="collectionForm in filterCollection" class="collectionForm"
          @click="gotoDetail(collectionForm.collection_form_id)">
          <div class="form_name">{{ collectionForm.collection_form_name }}</div>
        </div>
      </div>

      <q-dialog v-model="openCreateForm">
        <q-card class="card">
          <CreateForm :user_id="user_id" :collection_id="collection_id" @updatedCollection="getNewCollection">
          </CreateForm>
        </q-card>
      </q-dialog>

      <q-dialog v-model="openUpdate">
        <q-card class="card-update">
          <h3>Cập nhật đợt thu thập</h3>
          <q-card-section>
            <q-input outlined label="Tên đợt thu thập" class="input"
              v-model="collectionUpdate.collection_name"></q-input>
            <q-input outlined type="text-area" label="Thông tin mô tả cho đợt thu thập" class="input"
              v-model="collectionUpdate.collection_description"></q-input>
            <div class="date-add">
              <q-input outlined label="Ngày bắt đầu đợt thu thập" class="input date"
                v-model="collectionUpdate.collection_start" type="date"></q-input>
              <q-input outlined label="Ngày kết thúc đợt thu thập" class="input date"
                v-model="collectionUpdate.collection_end" type="date"></q-input>
            </div>
            <q-btn color="primary" class="submit-update" @click="handleUpdateCollection">Cập nhật</q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>


<script scoped>
  import formatDate from '../util/formatDate';
  import { computed, onBeforeMount, ref, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import collectionService from '../services/collection.service';
  import projectService from '../services/project.service';
  import collectionFormService from '../services/collectionForm.service'
  import CreateForm from './CreateForm.vue';
  import router from '../router';
  import { useQuasar } from 'quasar';
  import { useToast } from "vue-toastification"

  export default {
    components: {
      "CreateForm": CreateForm
    },
    setup() {
      const toast = useToast();
      const $q = useQuasar();
      const route = useRoute();
      const project_id = route.params.project_id;
      const collection_id = route.params.collection_id;
      const { user_id } = JSON.parse(localStorage.getItem('user'));
      const collection = ref();
      const project = ref();
      const collectionForms = ref();
      const isOwner = ref();
      const searchName = ref();
      const openCreateForm = ref();
      const openUpdate = ref();

      const collectionUpdate = reactive({
        collection_name: "",
        collection_start: "",
        collection_end: "",
        collection_description: "",
        collection_created_at: "",
        file: null,
        project_id: project_id,
        user_id: user_id,
      })

      onBeforeMount(async () => {
        project.value = await projectService.getProjectById(project_id);
        collection.value = await collectionService.getCollectionById(collection_id);
        collectionForms.value = await collectionFormService.getCollectionFormByCollectionId(collection_id);
        isOwner.value = project.value.user.user_id === user_id
      })

      const filterCollection = computed(() => {
        if (!searchName.value) {
          return collectionForms.value;
        }
        const name = searchName.value.toLowerCase().trim();

        return collectionForms.value.filter((form) => form.collection_form_name.toLowerCase().trim().includes(name));

      })

      const formatDateTime = (date) => {
        return formatDate(date);
      }

      function formatDateTimeToInput(dateStr) {
        const date = new Date(dateStr);
        const dd = date.getDate().toString().padStart(2, "0");
        const mm = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
        const yyyy = date.getFullYear();

        return `${yyyy}-${mm}-${dd}`;
      }

      const gotoDetail = (id) => {
        router.push({ path: `/projects/${project_id}/collections/${collection_id}/collection-forms/${id}` })
      }

      const getNewCollection = (collection) => {
        collectionForms.value.push(collection);
      }


      const openUpdateCollection = () => {
        collectionUpdate.collection_name = collection.value.collection_name;
        collectionUpdate.collection_start = formatDateTimeToInput(collection.value.collection_start);
        collectionUpdate.collection_end = formatDateTimeToInput(collection.value.collection_end);
        collectionUpdate.collection_description = collection.value.collection_description;
        openUpdate.value = true;
      }

      const goBackProject = () => {
        router.push({
          path: `/projects/${project_id}`
        })
      }

      const handleUpdateCollection = async () => {
        $q.loading.show();
        try {
          const updatedCollection = await collectionService.updateCollection(collection_id, collectionUpdate);
          collection.value.collection_name = updatedCollection.collection_name;
          collection.value.collection_start = updatedCollection.collection_start;
          collection.value.collection_end = updatedCollection.collection_end;
          collection.value.collection_description = updatedCollection.collection_description;
          openUpdate.value = false;
          toast.success("Cập nhật thông tin thành công");
        } catch (error) {
          toast.success("Xảy ra lỗi rồi");
          console.log(error);
        } finally {
          $q.loading.hide();
        }
      }
      return {
        collection,
        project,
        formatDateTime,
        openCreateForm,
        collection_id,
        user_id,
        collectionForms,
        filterCollection,
        searchName,
        isOwner,
        getNewCollection,
        gotoDetail,
        openUpdate,
        collectionUpdate,
        openUpdateCollection,
        handleUpdateCollection,
        goBackProject
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 90%;
    margin: 0 auto;
    min-height: 100vh;
    margin-top: 20px;
  }

  p {
    margin: 0;
  }

  .collection_name {
    color: white;
    font-size: 49px;

  }

  .owner {
    width: 200px;
    justify-content: space-between;
    display: flex;
    justify-items: center;
  }

  .user_name {
    font-size: 20px;
    color: white;
    font-weight: bold;
  }

  .created_at {
    color: white;
    font-size: 20px;
  }

  .icon-separator {
    display: flex;
    align-items: center;
    color: #5d5b5b;
  }

  .btn-add-form {
    position: absolute;
    right: 5%;
    top: 95px;
    background-color: white;
  }

  .btn-open-add {
    padding: 10px;
  }

  .card {
    width: 1000px;
    max-width: 1000px;
    padding: 50px;
  }

  .collectionForm {
    width: 100%;
    border: 1px solid #cccccc;
    padding: 20px;
    margin: 10px 0;
    border-radius: 10px;
    font-size: 20px;
  }


  .collectionForm:hover {
    cursor: pointer;
    background-color: #1976D2;
  }

  .collectionForm:hover {
    cursor: pointer;
    color: white;
  }

  .collection-container {
    margin-top: 20px;
  }

  .date {
    font-size: 20px;
    color: white;
  }

  .form_name {
    font-weight: bold;
  }

  .input {
    font-size: 18px;
    margin: 10px 0;
  }

  .icon-update {
    font-size: 35px;
    cursor: pointer;
    position: absolute;
    right: 5%;
    top: 200px;
    color: white;
  }

  .icon-update:hover {
    color: #1976D2;
  }

  .card-update {
    max-width: 1000px;
    width: 800px;
  }

  .submit-update {
    display: flex;
    margin: 0 auto;
    font-size: 20px;
    padding: 0 50px;
    margin-top: 20px;
  }

  h3 {
    font-size: 32px;
    text-align: center;
  }

  .date-add {
    display: flex;
    justify-content: space-between;
  }

  .date {
    width: 45%;
  }

  .date-collection {
    font-weight: bold;
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
    font-size: 18px;
  }

  .header {
    padding: 20px;
    border-radius: 10px;
  }

</style>