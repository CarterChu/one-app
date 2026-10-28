<template>
  <a-popup :show="show" round position="bottom" teleport="body" @update:show="$emit('update:show', $event)">
    <div class="groups">
      <div class="groups__head">
        <span class="groups__title">全部分组</span>
        <span class="groups__close" @click="$emit('update:show', false)">
          <svg viewBox="0 0 16 16" width="18" height="18">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#86909c" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </div>
      <div class="groups__list">
        <div
          v-for="sec in sections"
          :key="sec.key"
          class="grow"
          @click="onSelect(sec.key)"
        >
          <span class="grow__name">{{ sec.title }}</span>
          <span class="grow__count">{{ answered(sec) }}/{{ sec.items.length }}</span>
          <svg v-if="sec.key === activeKey" class="grow__check" viewBox="0 0 16 16" width="16" height="16">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#3060FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </a-popup>
</template>

<script setup lang="ts">
import type { ChecklistSection } from "@/types/execute";

defineProps<{ show: boolean; sections: ChecklistSection[]; activeKey: string }>();
const emit = defineEmits<{
  (e: "update:show", v: boolean): void;
  (e: "select", key: string): void;
}>();

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}
function onSelect(key: string) {
  emit("select", key);
  emit("update:show", false);
}
</script>

<style lang="scss" scoped>
.groups {
  padding: 0 16px calc(8px + env(safe-area-inset-bottom));
  max-height: 70vh;
  overflow-y: auto;
}

.groups__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 8px;
  position: sticky;
  top: 0;
  background: #fff;
}

.groups__title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.groups__close {
  display: inline-flex;
}

.grow {
  display: flex;
  align-items: center;
  height: 54px;
  border-bottom: 1px solid #f2f3f5;
}

.grow__name {
  font-size: 15px;
  color: #1d2129;
}

.grow__count {
  margin-left: auto;
  font-size: 15px;
  color: #c9cdd4;
}

.grow__check {
  margin-left: 10px;
}
</style>
