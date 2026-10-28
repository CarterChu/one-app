<template>
  <router-view />
  <SchemeSwitcher />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import SchemeSwitcher from "./components/SchemeSwitcher.vue";
import { setDevFromQuery } from "@/stores/scheme";

const route = useRoute();
// ?dev=1 打开悬浮方案开关(?dev=0 关闭),状态存 localStorage
setDevFromQuery(route.query.dev);
watch(
  () => route.query.dev,
  (v) => setDevFromQuery(v),
);
</script>
