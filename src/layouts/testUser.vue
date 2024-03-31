<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" class="">
      <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            @click="drawer = !drawer"
            aria-label="Menu"
            icon="menu"
          />

          <q-toolbar-title shrink class="text-weight-bold">
            ROOOMM Tesst
          </q-toolbar-title>
          <q-space />
          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn round dense flat color="grey-8" icon="notifications">
              <q-badge color="red" text-color="white" floating> 2 </q-badge>
              <q-tooltip>Notifications</q-tooltip>
            </q-btn>
            <router-link :to="'/users'">
              <q-btn round flat>
                <button @click="toggleSidebar">
                  <q-avatar size="40px">
                    <img :src="userImg" style="width: 40px" />
                  </q-avatar>
                </button>
                <q-tooltip>Account</q-tooltip>
              </q-btn>
            </router-link>
          </div>
        </q-toolbar>
      </q-header>

      <!-- -- AVATAR-sidebar  ---->
      <div style="margin-top: 60px">
        <div :class="{ 'fixed-right': isSidebarFixed }" class="side-bar">
          Sidebar Content
        </div>
      </div>

      <!-- -- AVATAR-sidebar  ---->

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="240"
        :breakpoint="500"
        bordered
        style="background-color: var(--secondary-color)"
        class="q-drawer-container"
      >
        <q-item-label header class="text-uppercase side-bar-title">
          Đã tham gia
        </q-item-label>
        <q-scroll-area
          class="fit side-bar-container"
          style="height: 80% !important"
        >
          <q-list class="side-bar-list-container">
            <div v-for="pro in project" :key="pro.project_id">
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
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
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

    const isSidebarFixed = ref(false);
    function toggleSidebar() {
      isSidebarFixed.value = !isSidebarFixed.value;
    }

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
      drawer: ref(false),
      isSidebarFixed,
      toggleSidebar,
    };
  },
};
</script>

<style scoped>
.side-bar {
  z-index: 1000;
  position: fixed ;
  top: 50px;
  right: -100%;
  height: 100%;
  width: 250px;
  background: teal;

  height: 400px;
  border-radius: 10px;
  transition: right 1s;
}
.fixed-right {
  position: fixed;
  top: 50px;
  right: 0;
  transition: right 1s;
}

/* ----- AVATAR-SIDE-BAR */

.header-text {
  margin-top: 50px;
  color: white;
}

.side-bar-title {
  margin-top: 10px;
  margin-right: 15px;
}

.side-bar-container {
  background-color: var(--secondary-color);
  height: 100%;
}

.side-bar-list-container {
  margin-top: 10px;
  height: 450px;
  overflow-y: auto;
  border-bottom: 1px solid rgba(224, 224, 224, 0.3);
  border-top: 1px solid rgba(224, 224, 224, 0.3);
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
  border-bottom: 1px solid rgba(224, 224, 224, 0.1);
  width: 100%;
}

.side-bar-item:hover {
  background: #206fac;
  border-bottom: 1px solid rgba(236, 236, 236, 0.5);
}

.project-item {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 220px;
  color: white;
  font-weight: 600;
  font-size: 17px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
