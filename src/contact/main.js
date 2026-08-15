import { createApp } from "vue";
import ContactApp from "./ContactApp.vue";
import { initTheme } from "@/composables/useTheme";
import "@fontsource-variable/inter/index.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/components.css";

initTheme();
createApp(ContactApp).mount("#app");
