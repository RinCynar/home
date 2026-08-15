import { createApp } from "vue";
import App from "./App.vue";
import { initTheme } from "./composables/useTheme";
import "@fontsource-variable/inter/index.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";

initTheme();
createApp(App).mount("#app");
