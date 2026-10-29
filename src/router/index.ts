import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// 新页面往这里加路由。飞检管理为当前已实现的首个页面。
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/HomePortal.vue"),
    meta: { title: "原型入口" },
  },
  {
    path: "/inspection",
    name: "inspection-list",
    component: () => import("@/pages/inspection/InspectionListPage.vue"),
    meta: { title: "飞检管理" },
  },
  {
    path: "/inspection/execute/:id",
    name: "inspection-execute",
    component: () => import("@/pages/inspection/ExecuteInspectionPage.vue"),
    meta: { title: "执行飞检" },
  },
  {
    path: "/inspection/detail/:id",
    name: "inspection-detail",
    component: () => import("@/pages/inspection/DetailPage.vue"),
    meta: { title: "详情" },
  },
  {
    path: "/inspection/execute-v2/:id",
    name: "inspection-execute-v2",
    component: () => import("@/pages/inspection/ExecuteInspectionV2Page.vue"),
    meta: { title: "执行飞检" },
  },
  {
    path: "/inspection/detail-v2/:id",
    name: "inspection-detail-v2",
    component: () => import("@/pages/inspection/DetailV2Page.vue"),
    meta: { title: "详情" },
  },
  {
    path: "/rectify",
    name: "rectify-list",
    component: () => import("@/pages/inspection/RectifyListPage.vue"),
    meta: { title: "整改管理" },
  },
  {
    path: "/rectify/execute/:id",
    name: "rectify-execute",
    component: () => import("@/pages/inspection/RectifyExecutePage.vue"),
    meta: { title: "执行整改" },
  },
  {
    path: "/rectify/detail/:id",
    name: "rectify-detail",
    component: () => import("@/pages/inspection/RectifyDetailPage.vue"),
    meta: { title: "整改详情" },
  },
];

const router = createRouter({
  // H5 预览用 hash 模式,免服务端配置
  history: createWebHashHistory(),
  routes,
});

export default router;
