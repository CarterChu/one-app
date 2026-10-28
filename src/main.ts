import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vant 4(a-design-h5 底层依赖)
import Vant from "vant";
import "vant/lib/index.css";

// 安能 ADesign H5 组件库
import ADesignH5 from "a-design-h5";
import "a-design-h5/style.css";

import "./styles/global.scss";

const app = createApp(App);
app.use(router);
app.use(Vant);
app.use(ADesignH5);
app.mount("#app");
