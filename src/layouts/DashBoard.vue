<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" class="">
      <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
        <q-toolbar>
          <q-btn flat dense round @click="drawer = !drawer" aria-label="Menu" icon="menu" />

            <q-toolbar-title shrink class="text-weight-bold">
              ROOOMM
            </q-toolbar-title>
          <q-space />
          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn round dense flat color="grey-8" icon="notifications">
              <q-badge color="red" text-color="white" floating> 2 </q-badge>
              <q-tooltip>Notifications</q-tooltip>
            </q-btn>
            <q-btn round flat @click="openAvatar" class="avatar-btn">
              <q-avatar size="40px">
                <img :src="userImg" />
              </q-avatar>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-dialog v-model="isAvatarOpened" position="right">
        <q-card>
          <q-toolbar class="avatar-dialog">
            <q-toolbar-title class="avatar-dialog-title">
              <q-avatar size="50px">
                <img :src="userImg" />
              </q-avatar>
              <span>{{ user.user_full_name }}</span>
            </q-toolbar-title>
          </q-toolbar>

          <q-list bordered>
            <q-item clickable v-ripple v-for="opt in avatarOptions">
              <router-link :to="`${opt.path}` + `${user.user_id}`" class="avatar-link">
                <q-item-section class="avatar-link-section1" :value="opt">
                  <q-icon size="30px" :name="`${opt.icon}`" class="avatar-link-icon" />
                </q-item-section>
                <q-item-section class="avatar-link-section2">
                  <span class="div2">{{ opt.text }}</span>
                </q-item-section>
              </router-link>
            </q-item>
          </q-list>
        </q-card>
      </q-dialog>

      <q-drawer v-model="drawer" show-if-above :width="240" :breakpoint="500" bordered
        style="background-color: var(--secondary-color)" class="q-drawer-container">
        <q-item-label header class="text-uppercase side-bar-title">
          Đã tham gia
        </q-item-label>
        <q-scroll-area class="fit side-bar-container" style="height: 80% !important">
          <q-list class="side-bar-list-container">
            <div v-for="pro in project" :key="pro.project_id">
              <!-- <router-link :to="'/projects/' + pro.project_id"> -->
              <div @click="goToProject(pro.project_id)">

                <div class="side-bar-item">
                  <div class="project-item">
                    <q-icon name="task" size="34px" color="yellow">
                      <q-tooltip max-width="200px" style="
                            background-color: gray;
                            color: white;
                            font-size: 13px;
                          ">
                        {{ pro.project_name }}
                      </q-tooltip>
                    </q-icon>
                    <span class="project-item-name">
                      {{ pro.project_name }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- </router-link> -->
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
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const drawer = ref(false);
    const project = ref();
    const leftDrawerOpen = ref(false);
    let userImg = ref("");
    let user = ref({
      user_id: "",
      user_full_name: "",
      user_image_url: "",
    });
    const isAvatarOpened = ref(false);

    const avatarOptions = ref([
      { text: "Thông tin tài khoản", path: `/user/${user.value.user_id}`, icon: "account_circle" },
      { text: "Cài đặt", path: "#", icon: "settings" },
      { text: "Ngôn ngữ", path: "#", icon: "language" },
      { text: "Giao diện", path: "#", icon: "toggle_on" },
      { text: "Trợ giúp", path: "#", icon: "help" },
      { text: "Đăng xuất", path: "/login", icon: "logout" },
    ]);

    function openAvatar() {
      isAvatarOpened.value = !isAvatarOpened.value;
    }

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    const goToProject = (project_id) => {
      router.push({ path: `/projects/${project_id}` });
    }

    function getUserFromLocalStorage() {
      const userData = localStorage.getItem("user");
      if (userData) {
        user.value = JSON.parse(userData);
        userImg.value = user.value.user_image_url;
      }
    }

    onBeforeMount(async () => {
      getUserFromLocalStorage();
      project.value = await projectService.getAllProject(user.value.user_id, 2);
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      project,
      user,
      userImg,
      drawer,
      isAvatarOpened,
      openAvatar,
      avatarOptions,
      goToProject
    };
  },
};
</script>

<style scoped>
/*----------AVATAR-DIALOG --------*/
.avatar-dialog {
  height: 70px;
  font-size: 20px;
  background: var(--secondary-color);
  color: white;
}

.q-dialog__inner.flex>.q-card {
  width: 250px;
  margin-bottom: 205px;
}

.avatar-dialog-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  background: var(--secondary-color);
  color: white;
}

.avatar-dialog-title>span {
  margin-left: 10px;
}

/*----------AVATAR-LINK --------*/
.avatar-link {
  width: 200px;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-link-section1 {
  max-width: fit-content;
}

.avatar-link-icon {
  color: var(--secondary-color);
}

/*----------AVATAR-LINK --------*/

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

.project-item-name {
  margin-left: 10px;
  margin-bottom: 0;
}
</style>
