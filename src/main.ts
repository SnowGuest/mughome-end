import "./assets/main.css";
import "@unocss/reset/normalize.css";
import "virtual:uno.css";
import "vfonts/Lato.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import dayjs from "dayjs";
import router from "./router";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);

app.mount("#app");
