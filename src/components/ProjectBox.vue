<template>
  <div class="q-pa-md img-container">
    <div v-for="pro in project" :key="pro.project_id" class="list-items">
      <q-card class="q-card-class " v-if="pro.project_status == 'Đang hoạt động' || (pro.project_status == 'Dừng hoạt động' && pro.user.user_id == user.user_id )">
        <!-- router -->
        <router-link :to="'/projects/' + pro.project_id">     
          <q-img :src="pro.project_image_url" class="q-img-class" />
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                {{ pro.project_name }}
              </div>
              <div v-if="pro.project_status == 'Đang hoạt động'">
                <q-icon
                  style="color: green"
                  size="20px"
                  name="check_circle"
                ></q-icon>
              </div>
              <div v-else>
                <q-icon name="cancel" size="20px" style="color: red"></q-icon>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">{{ pro.user.user_full_name }}</div>
          </q-card-section>
        </router-link>

        <q-separator />
        <q-card-actions class="q-card-action-class">
          ngày tạo: {{ formatDate(pro.project_created_at) }}
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect, onBeforeMount } from "vue";

export default {
  props: {
    project: Object,
    user: Object
  },

  setup(props) {
    const project = ref(props.project);
    const user = ref(props.user)

    watchEffect(() => {
      project.value = props.project;
      user.value = props.user;
    });

    function formatDate(dateString) {
      return dateString.slice(0, 10);
    }

    return {
      project,
      user,
      formatDate,
    };
  },
};
</script>

<style scoped>
.img-container {
  margin-top: 20px;
  padding: 0 0;
  display: flex;
  flex-wrap: wrap; 
  justify-content: start;
}

.q-card-class {
    width: 244px; 
    margin-right: 10px;
    margin-top: 15px;
}
.q-img-class {
  height: 100px;
  border-radius: 5px;
}

.q-card-action-class {
  height: 45px;
  font-weight: 500;
  color: var(--secondary-color);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
