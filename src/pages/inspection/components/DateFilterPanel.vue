<template>
  <div class="date-panel">
    <div class="date-body">
      <!-- 周期选择(自绘分段,不用 a-radio-group) -->
      <div class="section-title">周期选择</div>
      <div class="seg-row">
        <div
          v-for="opt in PERIODS"
          :key="opt.value"
          class="seg"
          :class="{ 'seg--active': tempPeriod === opt.value }"
          @click="onPickPeriod(opt.value)"
        >
          {{ opt.label }}
        </div>
      </div>

      <!-- 自定义起止时间 -->
      <div class="section-title">自定义起止时间</div>
      <div class="date-field" @click="openPicker('start')">
        <span :class="tempStart ? 'date-field__val' : 'date-field__ph'">
          {{ tempStart || "开始时间" }}
        </span>
        <van-icon name="arrow" color="#a7a5b0" />
      </div>
      <div class="date-field" @click="openPicker('end')">
        <span :class="tempEnd ? 'date-field__val' : 'date-field__ph'">
          {{ tempEnd || "结束时间" }}
        </span>
        <van-icon name="arrow" color="#a7a5b0" />
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="panel-footer">
      <a-button-group type="white-bg">
        <a-button variant="secondary" size="large" @click="onReset">重置</a-button>
        <a-button variant="primary" size="large" @click="onConfirm">确定</a-button>
      </a-button-group>
    </div>

    <!-- 日期选择器:从底部弹出(Vant 原生 popup) -->
    <van-popup v-model:show="showPicker" round position="bottom" teleport="body" :z-index="3000">
      <van-date-picker
        v-model="pickerValue"
        :columns-type="['year', 'month', 'day']"
        :title="pickingField === 'start' ? '选择开始时间' : '选择结束时间'"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

type Period = 7 | 15 | 30 | null;

const PERIODS: { label: string; value: 7 | 15 | 30 }[] = [
  { label: "近7天", value: 7 },
  { label: "近15天", value: 15 },
  { label: "近30天", value: 30 },
];

const props = defineProps<{
  period: Period;
  dateRange: [string, string] | null;
}>();

const emit = defineEmits<{
  (e: "confirm", payload: { period: Period; dateRange: [string, string] | null }): void;
  (e: "reset"): void;
}>();

const tempPeriod = ref<Period>(props.period);
const tempStart = ref(props.dateRange?.[0] ?? "");
const tempEnd = ref(props.dateRange?.[1] ?? "");

watch(
  () => [props.period, props.dateRange] as const,
  ([p, r]) => {
    tempPeriod.value = p;
    tempStart.value = r?.[0] ?? "";
    tempEnd.value = r?.[1] ?? "";
  },
);

// —— 日期选择器 ——
const showPicker = ref(false);
const pickingField = ref<"start" | "end">("start");
const minDate = new Date(2020, 0, 1);
const maxDate = new Date(2030, 11, 31);
const pickerValue = ref<string[]>(formatToColumns(new Date()));

function formatToColumns(d: Date): string[] {
  return [
    String(d.getFullYear()),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ];
}

function onPickPeriod(value: 7 | 15 | 30) {
  // 选周期与自定义时间互斥
  tempPeriod.value = tempPeriod.value === value ? null : value;
  if (tempPeriod.value) {
    tempStart.value = "";
    tempEnd.value = "";
  }
}

function openPicker(field: "start" | "end") {
  pickingField.value = field;
  const current = field === "start" ? tempStart.value : tempEnd.value;
  pickerValue.value = current ? current.split("-") : formatToColumns(new Date());
  showPicker.value = true;
}

function onDateConfirm(payload: { selectedValues: string[] }) {
  const val = payload.selectedValues.join("-");
  if (pickingField.value === "start") tempStart.value = val;
  else tempEnd.value = val;
  // 选自定义时间后清掉周期
  tempPeriod.value = null;
  showPicker.value = false;
}

function onReset() {
  tempPeriod.value = null;
  tempStart.value = "";
  tempEnd.value = "";
  emit("reset");
}

function onConfirm() {
  const dateRange: [string, string] | null =
    tempStart.value && tempEnd.value ? [tempStart.value, tempEnd.value] : null;
  emit("confirm", { period: tempPeriod.value, dateRange });
}
</script>

<style lang="scss" scoped>
.date-panel {
  display: flex;
  flex-direction: column;
}

.date-body {
  padding: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #2f2d33;
  margin-bottom: 12px;

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.seg-row {
  display: flex;
  gap: 12px;
}

.seg {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #767282;
  background: #fff;
  border: 1px solid #cccbd1;
  border-radius: 8px;

  &--active {
    color: #007bfe;
    border-color: #007bfe;
    background: #ecf2ff;
    font-weight: 500;
  }
}

.date-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  background: #f3f3f5;
  border-radius: 8px;

  & + & {
    margin-top: 12px;
  }

  &__ph {
    color: #a7a5b0;
    font-size: 14px;
  }
  &__val {
    color: #2f2d33;
    font-size: 14px;
  }
}

.panel-footer {
  border-top: 1px solid #f3f3f5;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
