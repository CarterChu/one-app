<template>
  <div class="station" @click="$emit('open')">
    <div class="station__head">
      <span class="station__name">{{ info.ownerName }}</span>
      <van-icon name="arrow" color="#767282" />
    </div>
    <div class="station__row">
      <span class="station__label">电站编号</span>
      <span class="station__link">{{ info.stationNo }}</span>
      <span class="station__icon" @click.stop="onCopy">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <rect x="5" y="5" width="8.5" height="9" rx="1.6" fill="none" stroke="#767282" stroke-width="1.2" />
          <path d="M10.5 5V3.6A1.6 1.6 0 0 0 8.9 2H3.6A1.6 1.6 0 0 0 2 3.6v6.3A1.6 1.6 0 0 0 3.6 11.5H5" fill="none" stroke="#767282" stroke-width="1.2" />
        </svg>
      </span>
    </div>
    <div class="station__row">
      <span class="station__label">项目地址</span>
      <span class="station__addr">{{ info.address }}</span>
      <span class="station__icon" @click.stop="onNavigate">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M14 2 2 7.2l5 1.8 1.8 5L14 2Z" fill="none" stroke="#007bfe" stroke-width="1.3" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from "a-design-h5";
import type { ExecuteBasicInfo } from "@/types/execute";

const props = defineProps<{ info: ExecuteBasicInfo }>();
defineEmits<{ (e: "open"): void }>();

function onCopy() {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(props.info.stationNo).then(() => showToast("已复制"));
  } else {
    showToast("已复制");
  }
}
function onNavigate() {
  showToast("打开导航");
}
</script>

<style lang="scss" scoped>
.station {
  background: #eaf1ff;
  border-radius: 12px;
  padding: 14px 16px;
}

.station__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.station__name {
  font-size: 17px;
  font-weight: 600;
  color: #2f2d33;
}

.station__row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
}

.station__label {
  color: #767282;
  margin-right: 12px;
  flex-shrink: 0;
}

.station__link {
  color: #007bfe;
  text-decoration: underline;
}

.station__addr {
  color: #2f2d33;
  flex: 1;
  min-width: 0;
}

.station__icon {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  flex-shrink: 0;

  &:first-of-type {
    margin-left: 6px;
  }
}

.station__row .station__link + .station__icon {
  margin-left: 6px;
}

.station__addr + .station__icon {
  margin-left: auto;
}
</style>
