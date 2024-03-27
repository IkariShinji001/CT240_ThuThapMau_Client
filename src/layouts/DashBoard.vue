<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
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
              <img :src="userImg">
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
      <q-scroll-area class="fit side-bar-container" >
        <q-item-label header class="text-uppercase side-bar-title">
          Your Projects
          <q-separator
            style="margin-bottom: 10px; background: rgb(224, 224, 204)"
          />
        </q-item-label>
        <q-list padding class="q-list-container">
          <q-item
            v-for="pro in project"
            :key="pro.project_id"
            v-ripple
            clickable
            class="list-side-bar"
          >
            <q-item-section class="item-side-bar">
              <q-item-label class="list-your-project">
                <q-icon name="task" size="36px"></q-icon>
                <span class="your-project-name">
                  {{ pro.project_name }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="wrapper">
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import projectService from "../services/project.service";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const project = ref();
    const leftDrawerOpen = ref(false);
    let userImg = ref("")
    let user = ref({
      user_id: "",
      user_name: "",
      user_image_url: ""
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
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      project,
      userImg
    };
  },
};
</script>

<style scoped>
.q-list-container {
  max-height: 350px;
  overflow-y: auto;
}

.side-bar-container {
  background-color: var(--secondary-color);
}

.side-bar-title {
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}
.list-your-project {
  color: white;
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
}
.your-project-name {
  margin-left: 10px;
}
.list-side-bar {
  padding: 0 0;
}

.item-side-bar {
  border-bottom: 1px solid;
  border-color: rgba(224, 224, 224, 0.3);
}
.item-side-bar:hover {
  background: #103049;
}
</style>
