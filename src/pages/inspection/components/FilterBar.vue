<template>
  <div ref="barRef" class="filter-bar">
    <div
      class="filter-trigger"
      :class="{ 'filter-trigger--active': openKey === 'address' || hasRegion }"
      @click="toggle('address')"
    >
      <span>{{ regionLabel }}</span>
      <svg class="chev" :class="{ 'chev--up': openKey === 'address' }" viewBox="0 0 14 14" width="14" height="14">
        <path d="M3.5 5 7 8.5 10.5 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <div
      class="filter-trigger"
      :class="{ 'filter-trigger--active': openKey === 'date' || hasDate }"
      @click="toggle('date')"
    >
      <span>{{ dateLabel }}</span>
      <svg class="chev" :class="{ 'chev--up': openKey === 'date' }" viewBox="0 0 14 14" width="14" height="14">
        <path d="M3.5 5 7 8.5 10.5 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- 下拉浮层:面板从筛选行下方展开,其余区域变暗 -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="openKey" class="filter-overlay" :style="{ top: panelTop + 'px' }">
          <div class="filter-panel">
            <AddressFilterPanel
              v-if="openKey === 'address'"
              :region="region"
              @confirm="onAddressConfirm"
              @reset="onAddressReset"
            />
            <DateFilterPanel
              v-else-if="openKey === 'date'"
              :period="period"
              :date-range="dateRange"
              @confirm="onDateConfirm"
              @reset="onDateReset"
            />
          </div>
          <div class="filter-mask" @click="close" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import AddressFilterPanel from "./AddressFilterPanel.vue";
import DateFilterPanel from "./DateFilterPanel.vue";

type Period = 7 | 15 | 30 | null;

const props = defineProps<{
  region: string[];
  period: Period;
  dateRange: [string, string] | null;
}>();

const emit = defineEmits<{
  (e: "apply", payload: Partial<{ region: string[]; period: Period; dateRange: [string, string] | null }>): void;
}>();

const barRef = ref<HTMLElement | null>(null);
const openKey = ref<"address" | "date" | null>(null);
const panelTop = ref(0);

const hasRegion = computed(() => props.region.length > 0);
const hasDate = computed(() => props.period !== null || props.dateRange !== null);

const regionLabel = computed(() => {
  if (!props.region.length) return "电站地址";
  return props.region[props.region.length - 1];
});

const dateLabel = computed(() => {
  if (props.period) return `近${props.period}天`;
  if (props.dateRange) return `${props.dateRange[0]} ~ ${props.dateRange[1]}`;
  return "飞检日期";
});

async function toggle(key: "address" | "date") {
  if (openKey.value === key) {
    close();
    return;
  }
  openKey.value = key;
  await nextTick();
  // 浮层紧贴筛选行底部展开,下方区域变暗
  const rect = barRef.value?.getBoundingClientRect();
  panelTop.value = rect ? rect.bottom : 140;
}

function close() {
  openKey.value = null;
}

function onAddressConfirm(region: string[]) {
  emit("apply", { region });
  close();
}
function onAddressReset() {
  emit("apply", { region: [] });
}

function onDateConfirm(payload: { period: Period; dateRange: [string, string] | null }) {
  emit("apply", payload);
  close();
}
function onDateReset() {
  emit("apply", { period: null, dateRange: null });
}

defineExpose({ close });
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 10px 16px;
  background: #fff;
}

.filter-trigger {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: #767282;

  &--active {
    color: #007bfe;
  }
}

.chev {
  transition: transform 0.2s;

  &--up {
    transform: rotate(180deg);
  }
}

/* 下拉浮层 */
.filter-overlay {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
}

.filter-panel {
  background: #fff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
}

.filter-mask {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
