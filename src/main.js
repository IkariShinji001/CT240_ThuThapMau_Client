  import { createApp } from "vue";
  import { Quasar, Loading, Notify } from "quasar";
  import router from "./router";
  import Toast from "vue-toastification";
  import "vue-toastification/dist/index.css";
  // Import icon libraries
  import "@quasar/extras/material-icons/material-icons.css";

  // Import Quasar css
  import "quasar/src/css/index.sass";

  // Assumes your root component is App.vue
  // and placed in same folder as main.js
  import App from "./App.vue";

  const myApp = createApp(App);

  const toastOptions = {
    position: "top-right",
    timeout: 3000,
  };

  myApp.use(Quasar, {
    plugins: {
      Loading,
      Notify,
    },
    config: {
      notify: {}
    },
  });

  myApp.use(router).use(Toast, toastOptions).mount("#app");
