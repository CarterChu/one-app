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
          <path d="M13.7358 1.6374C13.4692 1.54833 13.224 1.61364 13.1123 1.64608C12.9891 1.68186 12.8437 1.73864 12.7037 1.79332L2.61931 5.7287C2.46268 5.78979 2.30522 5.8512 2.18253 5.91187C2.07878 5.96317 1.83365 6.08796 1.69579 6.35334C1.54653 6.64065 1.54673 6.9827 1.69633 7.26984C1.83451 7.53505 2.07978 7.65955 2.18359 7.71073C2.30635 7.77125 2.46387 7.83248 2.62057 7.89339L6.57077 9.42957L8.10697 13.3798C8.16787 13.5365 8.2291 13.694 8.28962 13.8168C8.3408 13.9206 8.4653 14.1658 8.73051 14.304C9.01765 14.4536 9.3597 14.4538 9.64701 14.3046C9.91238 14.1667 10.0372 13.9216 10.0885 13.8178C10.1491 13.6951 10.2106 13.5377 10.2716 13.3811L14.207 3.29664C14.2617 3.15661 14.3185 3.01121 14.3543 2.88802C14.3867 2.77634 14.452 2.53116 14.3629 2.26452C14.2641 1.96855 14.0318 1.73628 13.7358 1.6374Z" fill="#007bfe" />
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


</style>
