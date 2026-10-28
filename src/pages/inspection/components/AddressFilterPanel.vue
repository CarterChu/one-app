<template>
  <div class="addr-panel">
    <!-- 级联 tab:省 / 市 -->
    <div class="addr-tabs">
      <div
        class="addr-tab"
        :class="{ 'addr-tab--active': activeLevel === 0 }"
        @click="activeLevel = 0"
      >
        {{ tempProvince || "请选择" }}
      </div>
      <div
        class="addr-tab"
        :class="{ 'addr-tab--active': activeLevel === 1, 'addr-tab--disabled': !tempProvince }"
        @click="tempProvince && (activeLevel = 1)"
      >
        {{ tempCity || "请选择" }}
      </div>
    </div>

    <!-- 选项列表(自绘选中态,不用 a-radio-group) -->
    <div class="addr-list">
      <template v-if="activeLevel === 0">
        <div
          v-for="opt in provinces"
          :key="opt.label"
          class="addr-item"
          :class="{ 'addr-item--selected': opt.label === tempProvince }"
          @click="onPickProvince(opt.label)"
        >
          <span>{{ opt.label }}</span>
          <svg v-if="opt.label === tempProvince" class="check" viewBox="0 0 16 16" width="16" height="16">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#3060FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </template>

      <template v-else>
        <div
          v-for="city in cities"
          :key="city"
          class="addr-item"
          :class="{ 'addr-item--selected': city === tempCity }"
          @click="onPickCity(city)"
        >
          <span>{{ city }}</span>
          <svg v-if="city === tempCity" class="check" viewBox="0 0 16 16" width="16" height="16">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#3060FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </template>
    </div>

    <!-- 底部操作 -->
    <div class="panel-footer">
      <a-button-group type="white-bg">
        <a-button variant="secondary" size="large" @click="onReset">重置</a-button>
        <a-button variant="primary" size="large" @click="onConfirm">确定</a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { REGION_OPTIONS } from "@/mock/inspections";

const props = defineProps<{ region: string[] }>();
const emit = defineEmits<{
  (e: "confirm", region: string[]): void;
  (e: "reset"): void;
}>();

const provinces = REGION_OPTIONS;
const activeLevel = ref(0);
const tempProvince = ref(props.region[0] ?? "");
const tempCity = ref(props.region[1] ?? "");

// 每次外部 region 变化(重新打开面板)时同步临时选择
watch(
  () => props.region,
  (val) => {
    tempProvince.value = val[0] ?? "";
    tempCity.value = val[1] ?? "";
    activeLevel.value = val[1] ? 1 : 0;
  },
);

const cities = computed(
  () => provinces.find((p) => p.label === tempProvince.value)?.children ?? [],
);

function onPickProvince(label: string) {
  if (label !== tempProvince.value) {
    tempProvince.value = label;
    tempCity.value = "";
  }
  activeLevel.value = 1; // 选完省自动进入市级
}

function onPickCity(city: string) {
  tempCity.value = city;
}

function onReset() {
  tempProvince.value = "";
  tempCity.value = "";
  activeLevel.value = 0;
  emit("reset");
}

function onConfirm() {
  const region = [tempProvince.value, tempCity.value].filter(Boolean);
  emit("confirm", region);
}
</script>

<style lang="scss" scoped>
.addr-panel {
  display: flex;
  flex-direction: column;
  max-height: 60vh;
}

.addr-tabs {
  display: flex;
  gap: 32px;
  padding: 14px 16px 10px;
}

.addr-tab {
  position: relative;
  font-size: 15px;
  color: #1d2129;
  padding-bottom: 6px;

  &--active {
    color: #3060ff;
    font-weight: 500;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      border-radius: 2px;
      background: #3060ff;
    }
  }

  &--disabled {
    color: #c9cdd4;
  }
}

.addr-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.addr-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  font-size: 15px;
  color: #1d2129;
  border-bottom: 1px solid #f2f3f5;

  &--selected {
    color: #3060ff;
  }
}

.panel-footer {
  border-top: 1px solid #f2f3f5;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
