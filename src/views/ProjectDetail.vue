<template>
  <q-page>
    <div class="wrapper">
      {{ project }}
      {{ collections }}
      <q-input outlined v-model="CollectionName" label="Tìm theo tên đợt thu thập">

      </q-input>
    </div>
  </q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import projectService from "../services/project.service"
import collectionService from "../services/collection.service"


export default {
  setup(){
    const route = useRoute();
    const CollectionName = ref();
    const project = ref();
    const collections = ref();

    const projectId = route.params.id;

    onBeforeMount(async () => {
      project.value = await projectService.getProjectById(projectId);
      collections.value = await collectionService.getCollectionByProjectId(projectId);
    })  

    return{
      collections,
      project,
      projectId,
      CollectionName
    }
  }
}
</script>


<style>
.wrapper{
  width: 90%;
  margin: 0 auto;
}

</style>