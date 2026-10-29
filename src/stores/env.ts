import { ref } from "vue";

// 原型环境:开发(不记录数据,自由探索)/ 测试(记录 CSV,给受访者用)
export type Env = "dev" | "test";

const KEY = "one-app-env";

export const env = ref<Env>(localStorage.getItem(KEY) === "test" ? "test" : "dev");

export function setEnv(e: Env) {
  env.value = e;
  localStorage.setItem(KEY, e);
}

/** 是否测试环境(埋点只在测试环境记录) */
export function isTest() {
  return env.value === "test";
}
