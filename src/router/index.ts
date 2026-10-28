import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// 新页面往这里加路由。飞检管理为当前已实现的首个页面。
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/inspection",
  },
  {
    path: "/inspection",
    name: "inspection-list",
    component: () => import("@/pages/inspection/InspectionListPage.vue"),
    meta: { title: "飞检管理" },
  },
];

const router = createRouter({
  // H5 预览用 hash 模式,免服务端配置
  history: createWebHashHistory(),
  routes,
});

export default router;
