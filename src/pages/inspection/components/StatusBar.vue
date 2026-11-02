<template>
  <div class="statusbar" :class="{ 'statusbar--light': light }">
    <span class="statusbar__time">9:41</span>
    <div class="statusbar__right">
      <!-- 信号 -->
      <svg viewBox="0 0 18 12" width="18" height="12" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
        <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
        <rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="currentColor" />
      </svg>
      <!-- 电量 -->
      <svg viewBox="0 0 25 12" width="25" height="12" aria-hidden="true" class="statusbar__battery-svg">
        <!-- body outline -->
        <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1" />
        <!-- fill ~80% -->
        <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
        <!-- nub -->
        <path d="M22.5 4.5 C23.6 4.5 24.5 5.1 24.5 6 L24.5 6 C24.5 6.9 23.6 7.5 22.5 7.5 Z" fill="currentColor" fill-opacity="0.4" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ light?: boolean }>();
</script>

<style lang="scss" scoped>
.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 20px 0 24px;
  background: inherit;
  color: #1a1a1a;
  user-select: none;
}
.statusbar__time {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: inherit;
}
.statusbar__right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.statusbar--light {
  color: #fff;
}
</style>
