<template>
  <div v-if="dev" class="sw">
    <div class="sw__row">
      <div class="sw__seg" :class="{ 'sw__seg--on': current === '1' }" @click="switchTo('1')">方案一</div>
      <div class="sw__seg" :class="{ 'sw__seg--on': current === '2' }" @click="switchTo('2')">方案二</div>
    </div>
    <div class="sw__tools">
      <span class="sw__tool" @click="onExport">导出CSV({{ count }})</span>
      <span class="sw__tool sw__tool--clr" @click="onClear">清空</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { dev, scheme, setScheme, type Scheme } from "@/stores/scheme";
import { exportCsv, sessionCount, clearSessions } from "@/stores/tracker";

const route = useRoute();
const router = useRouter();

const count = ref(sessionCount());
watch(
  () => route.fullPath,
  () => (count.value = sessionCount()),
);

const current = computed<Scheme>(() => {
  const name = String(route.name ?? "");
  if (name.includes("-v2")) return "2";
  if (name.includes("execute") || name.includes("detail")) return "1";
  return scheme.value;
});

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
    router.replace({ name: "inspection-list", query: { scheme: s, dev: "1" } });
  }
}

function onExport() {
  if (sessionCount() === 0) return;
  exportCsv();
}
function onClear() {
  clearSessions();
  count.value = 0;
}
</script>

<style lang="scss" scoped>
.sw {
  position: fixed;
  right: 12px;
  bottom: 120px;
  z-index: 1500;
  padding: 6px;
  border-radius: 10px;
  background: rgba(29, 33, 41, 0.82);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.sw__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sw__seg {
  padding: 6px 10px;
  font-size: 12px;
  color: #a7a5b0;
  text-align: center;
  border-radius: 8px;
  white-space: nowrap;

  &--on {
    color: #fff;
    background: #007bfe;
    font-weight: 500;
  }
}

.sw__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.sw__tool {
  font-size: 11px;
  color: #9fc0ff;
  white-space: nowrap;

  &--clr {
    color: #ff9a9a;
  }
}
</style>
