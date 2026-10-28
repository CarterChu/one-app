<template>
  <div v-if="dev" class="sw">
    <div class="sw__seg" :class="{ 'sw__seg--on': current === '1' }" @click="switchTo('1')">方案一</div>
    <div class="sw__seg" :class="{ 'sw__seg--on': current === '2' }" @click="switchTo('2')">方案二</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { dev, scheme, setScheme, type Scheme } from "@/stores/scheme";

const route = useRoute();
const router = useRouter();

// 当前页属于哪套方案
const current = computed<Scheme>(() => {
  const name = String(route.name ?? "");
  if (name.includes("-v2")) return "2";
  if (name.includes("execute") || name.includes("detail")) return "1";
  return scheme.value;
});

// 方案名 → [v1 路由, v2 路由]
const PAIRS: Record<string, [string, string]> = {
  "inspection-execute": ["inspection-execute", "inspection-execute-v2"],
  "inspection-execute-v2": ["inspection-execute", "inspection-execute-v2"],
  "inspection-detail": ["inspection-detail", "inspection-detail-v2"],
  "inspection-detail-v2": ["inspection-detail", "inspection-detail-v2"],
};

function switchTo(s: Scheme) {
  if (s === current.value) return;
  setScheme(s);
  const name = String(route.name ?? "");
  const pair = PAIRS[name];
  if (pair) {
    const target = s === "2" ? pair[1] : pair[0];
    router.replace({ name: target, params: { id: route.params.id }, query: { dev: "1" } });
  } else {
    // 列表页等:跳到对应方案的列表
    router.replace({ name: "inspection-list", query: { scheme: s, dev: "1" } });
  }
}
</script>

<style lang="scss" scoped>
.sw {
  position: fixed;
  right: 12px;
  bottom: 120px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: rgba(29, 33, 41, 0.82);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.sw__seg {
  padding: 6px 10px;
  font-size: 12px;
  color: #c9cdd4;
  text-align: center;
  border-radius: 8px;
  white-space: nowrap;

  &--on {
    color: #fff;
    background: #3060ff;
    font-weight: 500;
  }
}
</style>
