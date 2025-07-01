import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import "./assets/tailwind.css";

createApp(App).use(createPinia()).use(router).use(PrimeVue).mount("#app");
