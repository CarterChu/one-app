<template>
  <div class="basic">
    <!-- 飞检信息 -->
    <div class="block-title">飞检信息</div>
    <div class="info-card">
      <div class="info-row">
        <span class="info-row__label">飞检状态</span>
        <span class="status-tag" :class="statusClass">{{ info.status }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">飞检单号</span>
        <span class="info-row__value">{{ info.flightNo }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">飞检批次单号</span>
        <span class="info-row__value">{{ info.batchNo }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">飞检工程师</span>
        <span class="info-row__value">{{ info.engineer }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">整改复验人</span>
        <span class="info-row__value">{{ info.reviewer }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">{{ timeLabel }}</span>
        <span class="info-row__value">{{ info.inspectTime }}</span>
      </div>
    </div>

    <!-- 电站信息 -->
    <div class="block-title">电站信息</div>
    <div class="info-card">
      <div class="info-row">
        <span class="info-row__label">电站编号</span>
        <span class="info-row__link">{{ info.stationNo }}</span>
        <span class="info-row__icon" @click="onCopy">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <rect x="5" y="5" width="8.5" height="9" rx="1.6" fill="none" stroke="#86909C" stroke-width="1.2" />
            <path d="M10.5 5V3.6A1.6 1.6 0 0 0 8.9 2H3.6A1.6 1.6 0 0 0 2 3.6v6.3A1.6 1.6 0 0 0 3.6 11.5H5" fill="none" stroke="#86909C" stroke-width="1.2" />
          </svg>
        </span>
      </div>
      <div class="info-row">
        <span class="info-row__label">业主姓名</span>
        <span class="info-row__value">{{ info.ownerName }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">地址</span>
        <span class="info-row__value info-row__value--addr">{{ info.address }}</span>
        <span class="info-row__icon" @click="onNavigate">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M14 2 2 7.2l5 1.8 1.8 5L14 2Z" fill="none" stroke="#3060FF" stroke-width="1.3" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
      <div class="info-row">
        <span class="info-row__label">电站类型</span>
        <span class="info-row__value">{{ info.stationType }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">装机容量</span>
        <span class="info-row__value">{{ info.capacity }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">代理商</span>
        <span class="info-row__value">{{ info.agent }}</span>
      </div>
      <div class="info-row">
        <span class="info-row__label">一级代理商</span>
        <span class="info-row__value">{{ info.topAgent }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { showToast } from "a-design-h5";
import type { ExecuteBasicInfo } from "@/types/execute";

const props = withDefaults(defineProps<{ info: ExecuteBasicInfo; timeLabel?: string }>(), {
  timeLabel: "飞检时间",
});

const statusClass = computed(() => {
  switch (props.info.status) {
    case "通过":
      return "status-tag--pass";
    case "不通过":
      return "status-tag--fail";
    default:
      return "status-tag--pending";
  }
});

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
.basic {
  padding: 16px;
}

.block-title {
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  margin: 8px 0 12px;

  &:not(:first-child) {
    margin-top: 24px;
  }
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 4px 16px;
}

.info-row {
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 10px 0;
  font-size: 15px;

  & + & {
    border-top: 1px solid #f2f3f5;
  }
}

.info-row__label {
  color: #86909c;
  flex-shrink: 0;
  margin-right: 16px;
}

.info-row__value {
  margin-left: auto;
  color: #1d2129;
  font-weight: 500;
  text-align: right;

  &--addr {
    font-weight: 400;
  }
}

.info-row__link {
  margin-left: auto;
  color: #3060ff;
  font-weight: 500;
  text-decoration: underline;
}

.info-row__icon {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  flex-shrink: 0;
}

.status-tag {
  margin-left: auto;
  font-size: 13px;
  line-height: 20px;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;

  &--pending {
    color: #ff9a2e;
    background: #fff5e8;
  }
  &--pass {
    color: #00b42a;
    background: #e8ffea;
  }
  &--fail {
    color: #f53f3f;
    background: #ffece8;
  }
}
</style>
