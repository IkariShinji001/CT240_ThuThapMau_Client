<template></template>

<script>
import testValue from "../services/testCreateForm.service";
export default {
  setup() {
    const userId = ref(20);
    const formId = ref(1);
    const values = ref([{ hoten: "hukhan" }, { age: 18 }, { thuthap: "asfa" }]);
    const files = []
    async function createProject(e) {
      e.preventDefault();
      try {
        const fd = new FormData();
        fd.append("collection_form_id", formId);
        fd.append("file", fileUploaded.value);
        fd.append("user_id", userId);
        fd.append("values", values);
        fd.append("files", files)
        const createdProject = await projectService.createProject(fd);

       
        emit("getNewProject", createdProject);
      } catch (e) {
        console.log(e);
      }
    }
  },
};
</script>
