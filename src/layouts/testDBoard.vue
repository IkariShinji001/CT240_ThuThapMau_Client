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
        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
          <q-toolbar-title shrink class="text-weight-bold">
            ROOOMM
          </q-toolbar-title>
        </q-btn>
        <q-space />

        <div class="YL__toolbar-input-container row no-wrap">
          <q-input
            dense
            outlined
            square
            v-model="search"
            placeholder="Search"
            class="bg-white col"
          />
          <q-btn
            class="YL__toolbar-input-btn"
            color="grey-3"
            text-color="grey-8"
            icon="search"
            unelevated
          />
        </div>

        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
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
    >
      <q-scroll-area class="fit side-bar-container">
        <q-item-label header class="text-uppercase side-bar-text">
          Your Projects
          <q-separator />
        </q-item-label>
        <q-list padding>
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
                </span></q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <div class="wrapper">
        {{ project }}
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
    const route = useRoute();
    const projectName = ref();
    const project = ref();

    const leftDrawerOpen = ref(false);
    const search = ref("");

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    const userId = route.params.id;

    onBeforeMount(async () => {
      project.value = await projectService.getAllProject();
    });

    return {
      leftDrawerOpen,
      search,
      toggleLeftDrawer,

      project,
      projectName,
    };
  },
};
</script>

<style scoped>
.side-bar-container {
  background-color: var(--secondary-color);
}
.side-bar-text {
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
.item-side-bar:hover {
  background: #103049;
}
</style>
