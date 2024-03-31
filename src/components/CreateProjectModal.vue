<template>
  <div class="q-pa-md form-container">
    <q-btn flat round class="cancel-btn" @click="closeModal">
      <q-icon
        name="cancel"
        class="cancel-icon"
        size="35px"
        color="red"
      ></q-icon>
    </q-btn>

    <q-form class="q-gutter-md form-create">
      <q-input
        required
        filled
        v-model="project_name"
        label="Tên dự án"
        hint="Name and surname"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Vui lòng điền tên dự án']"
      />
      <q-file
        required
        filled
        bottom-slots
        v-model="fileUploaded"
        label="Hình ảnh"
        accept="image/*"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>

      <div class="btn">
        <q-btn
          label="Tạo dự án"
          type="submit"
          color="primary"
          @click="createProject"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import projectService from "../services/project.service";

export default {
  setup(props, { emit }) {
    const project_name = ref("");
    const fileUploaded = ref(null);
    let user = ref();

    function closeModal() {
      emit("close");
    }

    async function getUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        user.value = JSON.parse(userData);
      }
    }
    onBeforeMount(async () => {
      await getUserFromLocalStorage();
    });
    async function createProject(e) {
      e.preventDefault();
      try {
        const date = new Date();
        const formattedDate = date.toISOString().split("T")[0];
        const status = "Active";
        const fd = new FormData();
        fd.append("project_name", project_name.value);
        fd.append("project_status", status);
        fd.append("project_created_at", formattedDate);
        fd.append("file", fileUploaded.value);
        fd.append("user_id", user.value.user_id)
        await projectService.createProject(fd);
      } catch (e) {
        console.log(e);
      }
    }

    return {
      closeModal,
      createProject,
      project_name,
      fileUploaded,
    };
  },
};
</script>

<style scoped>
.cancel-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
}

.cancel-icon:hover {
  color: rgb(206, 32, 32) !important;
}

.form-create {
  width: 450px;
  height: 250px;
  margin-top: 40px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin: 40px;
}
</style>
