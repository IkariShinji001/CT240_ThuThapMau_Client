<template>
  <q-page>
    <div class="container" v-if="collection && project">
      <div class="header">
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
          <div class="btn-add-form">
            <q-btn color="primary" class="btn-open-add" v-if="isOwner" @click="openCreateForm = true">Tạo Form cho đợt
              thu thập</q-btn>
          </div>
        </div>

        <q-separator size="5px" />

        <div class="collection-container">
          <q-input v-model="searchName" outlined label="Tìm theo tên của form" class="input"></q-input>
          <div v-for="collectionForm in filterCollection" class="collectionForm">
            <div class="form_name">{{ collectionForm.collection_form_name }}</div>
          </div>
        </div>
      </div>

      <q-dialog v-model="openCreateForm">
        <q-card class="card">
          <CreateForm :user_id="user_id" :collection_id="collection_id" @updatedCollection="getNewCollection">
          </CreateForm>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>


<script scoped>
  import formatDate from '../util/formatDate';
  import { computed, onBeforeMount, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import collectionService from '../services/collection.service';
  import projectService from '../services/project.service';
  import collectionFormService from '../services/collectionForm.service'
  import CreateForm from './CreateForm.vue';
  export default {
    components: {
      "CreateForm": CreateForm
    },
    setup() {
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

      const getNewCollection = (collection) => {
        collectionForms.value.push(collection);
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
        getNewCollection
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
    color: #6f6f6fcc;
    font-weight: bold;
  }

  .created_at {
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
    top: 20px;
  }

  .btn-open-add {
    padding: 20px;
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
  }

  .form_name {
    font-weight: bold;
  }

  .input {
    font-size: 18px;
  }
</style>