/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// a-design-h5 自带 .d.ts,此处仅兜底,防止类型解析失败时报错
declare module "a-design-h5";
