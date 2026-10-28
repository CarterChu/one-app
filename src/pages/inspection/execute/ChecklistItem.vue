<template>
  <div class="ci">
    <div class="ci__head">
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }}</span>
      <span class="ci__name">{{ index }}. {{ item.name }}</span>
    </div>

    <!-- 合格 / 不合格(自绘切换,不用 a-radio-group) -->
    <div class="rt-row">
      <button type="button" class="rt rt--pass" :class="{ 'rt--on': item.result === 'pass' }" @click="setResult('pass')">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        合格
      </button>
      <button type="button" class="rt rt--fail" :class="{ 'rt--on': item.result === 'fail' }" @click="setResult('fail')">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        不合格
      </button>
    </div>

    <!-- 不合格时展开:缺陷描述 + 缺陷图片 -->
    <div v-if="item.result === 'fail'" class="defect">
      <div class="defect__label"><span class="req">*</span>缺陷描述</div>
      <div class="defect-field">
        <a-field
          v-model="item.defectDesc"
          type="textarea"
          input-align="left"
          :autosize="{ minHeight: 64 }"
          maxlength="100"
          show-word-limit
          placeholder="请输入"
        />
      </div>

      <div class="defect__label"><span class="req">*</span>缺陷图片</div>
      <PhotoUpload v-model="item.defectImages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoUpload from "./PhotoUpload.vue";
import type { ChecklistItemData, ItemResult } from "@/types/execute";

const props = defineProps<{ item: ChecklistItemData; index: number }>();

function setResult(r: Exclude<ItemResult, null>) {
  // 再次点击同一项不取消(与设计一致:必须二选一)
  props.item.result = r;
  if (r === "pass") {
    props.item.defectDesc = "";
    props.item.defectImages = [];
  }
}
</script>

<style lang="scss" scoped>
.ci {
  padding: 16px 0;

  & + & {
    border-top: 1px solid #f2f3f5;
  }
}

.ci__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sev {
  flex-shrink: 0;
  font-size: 11px;
  line-height: 16px;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 600;

  &--CR {
    color: #f53f3f;
    background: #ffece8;
  }
  &--MA {
    color: #ff9a2e;
    background: #fff5e8;
  }
  &--MI {
    color: #86909c;
    background: #f2f3f5;
  }
}

.ci__name {
  font-size: 15px;
  color: #1d2129;
  font-weight: 500;
}

.rt-row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.rt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  padding: 0 18px;
  min-width: 92px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  background: #fff;
  color: #c9cdd4;

  &--pass.rt--on {
    color: #00b42a;
    border-color: #b7f0c2;
    background: #e8ffea;
  }
  &--fail.rt--on {
    color: #f53f3f;
    border-color: #fbc4bc;
    background: #ffece8;
  }
}

.defect {
  margin-top: 16px;
}

.defect__label {
  font-size: 14px;
  color: #4e5969;
  margin: 14px 0 8px;
}

.req {
  color: #f53f3f;
  margin-right: 2px;
}

.defect-field {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  overflow: hidden;

  :deep(.van-cell) {
    background: transparent;
  }
  :deep(.van-cell::after) {
    display: none;
  }
}
</style>
