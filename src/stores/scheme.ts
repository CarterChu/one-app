import { ref } from "vue";

// 两套方案标识。通过入口页进入时按 ?scheme 决定进 v1/v2。
export type Scheme = "1" | "2";

const STORAGE_KEY = "one-app-scheme";

function initial(): Scheme {
  return localStorage.getItem(STORAGE_KEY) === "2" ? "2" : "1";
}

export const scheme = ref<Scheme>(initial());

/** 列表页按 URL query 设置方案(?scheme=2) */
export function setSchemeFromQuery(q: unknown) {
  const v = Array.isArray(q) ? q[0] : q;
  const next: Scheme = v === "2" ? "2" : "1";
  scheme.value = next;
  localStorage.setItem(STORAGE_KEY, next);
}

export function executeRoute(): string {
  return scheme.value === "2" ? "inspection-execute-v2" : "inspection-execute";
}
export function detailRoute(): string {
  return scheme.value === "2" ? "inspection-detail-v2" : "inspection-detail";
}
