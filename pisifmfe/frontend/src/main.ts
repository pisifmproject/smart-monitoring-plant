import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Global styles
import "./assets/tailwind.css";
import "./style.css"; // kalau memang ada

const app = createApp(App);
app.use(router);
app.mount("#app");
