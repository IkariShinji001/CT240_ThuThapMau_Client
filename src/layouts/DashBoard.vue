<template>
  <q-layout view="lhh Lpr lFf">
    <q-header hidden class="xs">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Menu</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      class="drawer"
      v-model="drawer"
      show-if-above
      bordered
    >
      <q-list padding>
        <router-link to="/">
          <q-item class="logo-container">
            <img src="../assets/THANH DUY BUFFET.png" />
          </q-item>
        </router-link>

        <div v-for="block in sidebarOptions">
          <q-separator spaced />
          <q-item-label header class="option-header">{{
            block.header_name
          }}</q-item-label>
          <router-link
            :to="`${option.path}`"
            v-for="(option, index) in block.content"
            :key="index"
          >
            <q-item clickable v-ripple class="option">
              <q-item-section avatar>
                <q-icon :name="option.iconName" :class="option.class" />
              </q-item-section>
              <q-item-section class="option-text">
                {{ option.text }}
              </q-item-section>
            </q-item>
          </router-link>
        </div>
      </q-list>
      <q-item>
        <q-item-section>
          <q-btn @click="handleSignOut" class="btn-sign_out">Đăng xuất</q-btn>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import userService from "../services/user.service";
export default {
  name: "DashBoard",
  setup() {
    const router = useRouter();
    const toast = useToast();
    const miniState = ref(true);
    const drawer = ref(false);

    const sidebarOptions = [
      {
        header_name: "Quản lý vé buffet",
        content: [
          {
            iconName: "inbox",
            class: "icon",
            text: "Vé buffet",
            path: "/buffet-tickets",
          },
        ],
      },
      {
        header_name: "Quản lý món ăn và sốt",
        content: [
          {
            iconName: "inbox",
            class: "icon",
            text: "Món ăn",
            path: "/dishes",
          },
          {
            iconName: "inbox",
            class: "icon",
            text: "Sốt",
            path: "/sauces",
          },
        ],
      },
      {
        header_name: "Quản lý khu vực và bàn",
        content: [
        {
            iconName: "inbox",
            class: "icon",
            text: "Khu vực và bàn",
            path: "/areas",
          },
        ],
      },
      {
        header_name: "Quản lý nhân sự",
        content: [
        {
            iconName: "inbox",
            class: "icon",
            text: "Nhân sự",
            path: "/employees",
          },
        ],
      },
      {
        header_name: "Thống kê",
        content: [
        {
            iconName: "inbox",
            class: "icon",
            text: "Thống kê doanh thu",
            path: "/statistic/revenue",
          },
          {
            iconName: "inbox",
            class: "icon",
            text: "Thống kê món ăn",
            path: "/statistic/food",
          },
        ],
      },
    ];

    const handleSignOut = async () => {
      try {
        await userService.logout();
        router.push("/login");
        toast.success("Đăng xuất thành công");
      } catch (error) {
        toast.error("Bị lỗi");
      }
    };

    return {
      miniState,
      drawer,
      handleSignOut,
      sidebarOptions,
    };
  },
};
</script>

<style>
.drawer {
  background-color: #1976d2;
}

.icon {
  color: white;
}

img {
  width: 50%;
}

.logo-container {
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none !important;
}
.icon {
  font-size: 25px;
}

.option-text {
  font-size: 17px;
  color: white;
}
.option:hover {
  background-color: #1606cccc;
}
.option-header {
  font-size: 20px;
  color: white;
}

.btn-sign_out {
  background-color: #819ab3;
  color: white;
}
</style>
