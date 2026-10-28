import { ref } from "vue";

// 两套方案的全局标识。用于 A/B 用户测试:
// - 方案一(默认): #/inspection
// - 方案二:         #/inspection?scheme=2
// 列表页进入执行/详情时,按当前 scheme 跳到对应页面。
// 无可见切换开关,避免污染用户测试。

export type Scheme = "1" | "2";

const STORAGE_KEY = "one-app-scheme";

function initial(): Scheme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "2" ? "2" : "1";
}

export const scheme = ref<Scheme>(initial());

// —— 开发自查用的悬浮开关(仅 ?dev=1 时出现,不影响正式测试链接) ——
const DEV_KEY = "one-app-dev";
export const dev = ref<boolean>(localStorage.getItem(DEV_KEY) === "1");

export function setDevFromQuery(q: unknown) {
  const v = Array.isArray(q) ? q[0] : q;
  if (v === "1") {
    dev.value = true;
    localStorage.setItem(DEV_KEY, "1");
  } else if (v === "0") {
    dev.value = false;
    localStorage.removeItem(DEV_KEY);
  }
}

export function setScheme(s: Scheme) {
  scheme.value = s;
  localStorage.setItem(STORAGE_KEY, s);
}

/** 列表页按 URL query 设置方案(?scheme=2) */
export function setSchemeFromQuery(q: unknown) {
  const v = Array.isArray(q) ? q[0] : q;
  const next: Scheme = v === "2" ? "2" : "1";
  scheme.value = next;
  localStorage.setItem(STORAGE_KEY, next);
}

/** 按方案返回执行飞检 / 详情的路由名 */
export function executeRoute(): string {
  return scheme.value === "2" ? "inspection-execute-v2" : "inspection-execute";
}
export function detailRoute(): string {
  return scheme.value === "2" ? "inspection-detail-v2" : "inspection-detail";
}
