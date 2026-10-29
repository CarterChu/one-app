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
            <rect x="5" y="5" width="8.5" height="9" rx="1.6" fill="none" stroke="#767282" stroke-width="1.2" />
            <path d="M10.5 5V3.6A1.6 1.6 0 0 0 8.9 2H3.6A1.6 1.6 0 0 0 2 3.6v6.3A1.6 1.6 0 0 0 3.6 11.5H5" fill="none" stroke="#767282" stroke-width="1.2" />
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
            <path d="M13.7358 1.6374C13.4692 1.54833 13.224 1.61364 13.1123 1.64608C12.9891 1.68186 12.8437 1.73864 12.7037 1.79332L2.61931 5.7287C2.46268 5.78979 2.30522 5.8512 2.18253 5.91187C2.07878 5.96317 1.83365 6.08796 1.69579 6.35334C1.54653 6.64065 1.54673 6.9827 1.69633 7.26984C1.83451 7.53505 2.07978 7.65955 2.18359 7.71073C2.30635 7.77125 2.46387 7.83248 2.62057 7.89339L6.57077 9.42957L8.10697 13.3798C8.16787 13.5365 8.2291 13.694 8.28962 13.8168C8.3408 13.9206 8.4653 14.1658 8.73051 14.304C9.01765 14.4536 9.3597 14.4538 9.64701 14.3046C9.91238 14.1667 10.0372 13.9216 10.0885 13.8178C10.1491 13.6951 10.2106 13.5377 10.2716 13.3811L14.207 3.29664C14.2617 3.15661 14.3185 3.01121 14.3543 2.88802C14.3867 2.77634 14.452 2.53116 14.3629 2.26452C14.2641 1.96855 14.0318 1.73628 13.7358 1.6374Z" fill="#007bfe" />
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
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  color: #2f2d33;
  margin: 4px 0 8px;

  &:not(:first-child) {
    margin-top: 24px;
  }
}

.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.info-row {
  display: flex;
  align-items: center;
  min-height: 52px;
  font-size: 16px;
  line-height: 24px;

  & + & {
    border-top: 1px solid #f3f3f5;
  }
}

.info-row__label {
  color: #767282;
  flex-shrink: 0;
  margin-right: 16px;
}

.info-row__value {
  margin-left: auto;
  color: #2f2d33;
  font-weight: 500;
  text-align: right;

  &--addr {
    font-weight: 400;
  }
}

.info-row__link {
  margin-left: auto;
  color: #007bfe;
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
    color: #fa9607;
    background: #fff7e0;
  }
  &--pass {
    color: #28ba4f;
    background: #e8ffea;
  }
  &--fail {
    color: #eb372a;
    background: #ffece8;
  }
}
</style>
