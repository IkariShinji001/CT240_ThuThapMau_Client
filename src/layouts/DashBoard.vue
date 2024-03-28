<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1 q-layout">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title shrink class="text-weight-bold">
          ROOOMM
        </q-toolbar-title>
        <q-space />
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="40px">
              <img :src="userImg" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
      :breakpoint="500"
    >
      <div class="side-bar-container">
        <q-item-label header class="text-uppercase side-bar-title">
          Đang tham gia
          <q-separator
            style="margin-bottom: 10px; background: rgb(224, 224, 204)"
          />
        </q-item-label>
        <div class="side-bar-list-container">
          <div v-for="pro in project" :key="pro.project_id" class="list-items">
            <div class="side-bar-item">
              <div class="project-item">
                <q-icon name="task" size="34px" color="yellow">
                  <q-tooltip
                    max-width="200px"
                    style="
                      background-color: gray;
                      color: white;
                      font-size: 13px;
                    "
                  >
                    {{ pro.project_name }}
                  </q-tooltip>
                </q-icon>
                <span class="project-item-name">
                  {{ pro.project_name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="wrapper"></div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import projectService from "../services/project.service";
import { onBeforeMount, ref } from "vue";

export default {
  setup() {
    const project = ref();
    const leftDrawerOpen = ref(false);
    let userImg = ref("");
    let user = ref({
      user_id: "",
      user_name: "",
      user_image_url: "",
    });

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    async function getUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        user = JSON.parse(userData);
        userImg.value = user.user_image_url;
      }
    }

    onBeforeMount(async () => {
      await getUserFromLocalStorage();
      project.value = await projectService.getAllProject(user.user_id, 2);
      project.value = await projectService.getAllProject(user.user_id, 2);
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      project,
      userImg,
    };
  },
};
</script>

<style scoped>
.side-bar-list-container {
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 2px solid rgba(224, 224, 224, 0.3);
}
.side-bar-container {
  background-color: var(--secondary-color);
  height: 100%;
}

.side-bar-title {
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.project-item-name {
  margin-left: 10px;
  margin-bottom: 0;
}

.side-bar-item {
  line-height: 45px;
  overflow: hidden;
  display: inline-flex;
  border-bottom: 1px solid rgba(224, 224, 224, 0.3);
  width: 100%;
}
.side-bar-item:hover {
  background: #206fac;
  border-bottom: 1px solid rgba(236, 236, 236, 0.5);
}

.project-item {
  color: white;
  font-weight: bold;
  font-size: 17px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
