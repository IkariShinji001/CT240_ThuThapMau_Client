<template>
  <q-file v-model="file" multiple />
  <button @click="createProject">CLICK</button>
</template>

<script>
import testValue from "../services/testCreateForm.service";
import { ref } from "vue";

export default {
  setup() {
    const file = ref();
    const valueDtos = ref([
      {
        collection_attribute_id: 1,
        collection_value: "hukhan",
      },
      {
        collection_attribute_id: 2,
        collection_value: "Bac Lieu",
      },
      {
        collection_attribute_id: 3,
        collection_value: "Hmm",
      },
    ]);

    async function createProject(e) {
      e.preventDefault();
      try {
        const fd = new FormData();

        fd.append("valueDtos", JSON.stringify(valueDtos.value));

        for (let i = 0; i < file.value.length; i++) {
          fd.append("files", file.value[i]);
        }

        const createdProject = await testValue.createValue(fd);
      } catch (e) {
        console.log(e);
      }
    }

    return {
      createProject,
      file,
    };
  },
};
</script>
