<template>
  <div class="logo">
    <button class="menu-icon" @click="openSideBar">avatar</button>
  </div>
  <div class="sidebar" :class="{ open: isOpened }">
    <div class="sidebar-content">
      <ul class="lists">
        <li class="list">
          <a href="#" class="nav-link">
            <span class="link"> HOME</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <section :class="{overlay : isOpened}" @click="openSideBar"></section>
</template>

<script>
import { is } from "quasar";
import { ref } from "vue";
export default {
  setup() {
    const isOpened = ref(false);

    function openSideBar() {
      isOpened.value = !isOpened.value;
    }
    return {
      isOpened,
      openSideBar,
    };
  },
};
</script>

<style>
body{
  background: gray;
}
.menu-icon {
  cursor: pointer;
}

.sidebar .sidebar-content {
  padding: 30px;
  list-style: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.1);
}
.sidebar {
  position: fixed;
  top: 50;
  left: -100%;
  height: 500px;
  width: 250px;
  background: orange;
  padding: 30px;
  z-index: 100;
  transition: all 0.5s ease;
}
.open {
  left: 0;
} 
</style>
