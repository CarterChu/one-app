<template>
  <div class="checklist">
    <section
      v-for="sec in sections"
      :key="sec.key"
      :ref="(el) => setSectionRef(sec.key, el)"
      class="sec"
      :style="{ scrollMarginTop: stickyTop + 'px' }"
    >
      <div class="sec__header" :style="{ top: stickyTop + 'px' }">
        {{ sec.title }}（{{ answered(sec) }}/{{ sec.items.length }}）
      </div>
      <div class="sec__card">
        <ChecklistItem
          v-for="(it, i) in sec.items"
          :key="it.id"
          :item="it"
          :index="i + 1"
        />
      </div>
    </section>
    <div class="checklist__pad" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import ChecklistItem from "./ChecklistItem.vue";
import type { ChecklistSection } from "@/types/execute";

const props = defineProps<{ sections: ChecklistSection[]; stickyTop: number }>();
const emit = defineEmits<{ (e: "active-change", key: string): void }>();

const sectionEls = new Map<string, HTMLElement>();
function setSectionRef(key: string, el: unknown) {
  if (el) sectionEls.set(key, el as HTMLElement);
  else sectionEls.delete(key);
}

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}

// —— 滚动监听:判定当前吸顶分组 ——
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const line = props.stickyTop + 4;
    let current = props.sections[0]?.key;
    for (const sec of props.sections) {
      const el = sectionEls.get(sec.key);
      if (el && el.getBoundingClientRect().top <= line) current = sec.key;
    }
    if (current) emit("active-change", current);
  });
}

function scrollTo(key: string) {
  sectionEls.get(key)?.scrollIntoView({ behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

defineExpose({ scrollTo });
</script>

<style lang="scss" scoped>
.checklist {
  padding: 0 16px;
}

.sec {
  margin-top: 8px;
}

.sec__header {
  position: sticky;
  z-index: 5;
  background: #f7f8fa;
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  padding: 10px 0;
}

.sec__card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.checklist__pad {
  height: 24px;
}
</style>
