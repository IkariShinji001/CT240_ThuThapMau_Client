<template>
  <q-page>
    <div class="container">
      <div>
        <h3>Trưởng dự án</h3>
        <q-separator />
      </div>
    </div>
  </q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import projectMemberService from '../services/projectMember.service';

export default {
  setup() {
    const route = useRoute();
    const projectId = route.params.id;
    const projectMemer = ref();
    onBeforeMount( async() => {
      projectMemer.value = await projectMemberService.getProjectMember(projectId, 2);
      console.log(projectMemer.value);
    })
  },
};
</script>

<style scoped>
.container {
  width: 95%;
  margin: 0 auto;
}
</style>
