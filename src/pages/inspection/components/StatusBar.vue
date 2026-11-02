<template>
  <div class="statusbar" :class="{ 'statusbar--light': light }">
    <span class="statusbar__time">9:41</span>
    <div class="statusbar__right">
      <!-- 信号 -->
      <svg viewBox="0 0 18 12" width="18" height="12" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="1" fill="#1a1a1a" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#1a1a1a" />
        <rect x="10" y="3" width="3" height="9" rx="1" fill="#1a1a1a" />
        <rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="#1a1a1a" />
      </svg>
      <!-- 电量 -->
      <div class="statusbar__battery">
        <div class="statusbar__battery-body"><div class="statusbar__battery-fill" /></div>
        <div class="statusbar__battery-cap" />
      </div>
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
  user-select: none;
}
.statusbar__time {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1a1a1a;
}
.statusbar__right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.statusbar__battery {
  display: flex;
  align-items: center;
  gap: 1px;
}
.statusbar__battery-body {
  width: 22px;
  height: 11px;
  border: 1px solid rgba(26, 26, 26, 0.4);
  border-radius: 3px;
  padding: 1px;
}
.statusbar__battery-fill {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  border-radius: 1px;
}
.statusbar__battery-cap {
  width: 1.5px;
  height: 4px;
  margin-left: 1px;
  background: rgba(26, 26, 26, 0.4);
  border-radius: 0 1px 1px 0;
}

.statusbar--light {
  .statusbar__time { color: #fff; }
  svg rect, svg path, svg circle { fill: #fff; stroke: #fff; }
  svg path[fill="none"] { fill: none; }
  .statusbar__battery-body { border-color: rgba(255,255,255,0.5); }
  .statusbar__battery-fill { background: #fff; }
  .statusbar__battery-cap { background: rgba(255,255,255,0.5); }
}
</style>
