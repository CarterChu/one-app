<template>
  <div class="appnav-wrap">
    <StatusBar />
    <div class="appnav">
    <div class="appnav__back" @click="$emit('back')">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" fill="none" stroke="#1a1a1a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="appnav__title">{{ title }}</span>
    </div>
    <div v-if="right || $slots.right" class="appnav__right" @click="$emit('rightClick')">
      <slot name="right">{{ right }}</slot>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBar from "./StatusBar.vue";
defineProps<{ title: string; right?: string }>();
defineEmits<{ (e: "back"): void; (e: "rightClick"): void }>();
</script>

<style lang="scss" scoped>
.appnav-wrap { background: #fff; }
.appnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 14px 0 8px;
  background: #fff;
}
.appnav__back {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  cursor: pointer;
}
.appnav__title {
  font-size: 17px;
  line-height: 24px;
  font-weight: 600;
  color: #2f2d33;
  white-space: nowrap;
}
.appnav__right {
  flex-shrink: 0;
  padding-left: 12px;
  color: #007bfe;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
</style>
