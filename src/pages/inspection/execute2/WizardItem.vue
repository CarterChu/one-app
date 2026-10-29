<template>
  <div class="wi">
    <div class="wi__head">
      <span class="wi__name">{{ item.name }}</span>
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }}</span>
    </div>

    <!-- 合格 / 不合格:上下全宽选项(自绘) -->
    <button type="button" class="opt opt--pass" :class="{ 'opt--on': item.result === 'pass' }" @click="setResult('pass')">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      合格
    </button>
    <button type="button" class="opt opt--fail" :class="{ 'opt--on': item.result === 'fail' }" @click="setResult('fail')">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      不合格
    </button>

    <!-- 不合格展开 -->
    <div v-if="item.result === 'fail'" class="defect">
      <div class="defect__label"><span class="req">*</span>缺陷描述</div>
      <div class="defect-field">
        <a-field
          v-model="item.defectDesc"
          type="textarea"
          input-align="left"
          :autosize="{ minHeight: 72 }"
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
import PhotoUpload from "../execute/PhotoUpload.vue";
import type { ChecklistItemData, ItemResult } from "@/types/execute";

const props = defineProps<{ item: ChecklistItemData; index: number }>();

function setResult(r: Exclude<ItemResult, null>) {
  props.item.result = r;
  if (r === "pass") {
    props.item.defectDesc = "";
    props.item.defectImages = [];
  }
}
</script>

<style lang="scss" scoped>
.wi__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

.sev {
  flex-shrink: 0;
  font-size: 11px;
  line-height: 16px;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 600;

  &--CR {
    color: #eb372a;
    background: #ffece8;
  }
  &--MA {
    color: #fa9607;
    background: #fff7e0;
  }
  &--MI {
    color: #767282;
    background: #f3f3f5;
  }
}

.wi__name {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.opt {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  margin-bottom: 12px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #e6e6eb;
  background: #fff;
  color: #767282;

  svg {
    width: 20px;
    height: 20px;
  }

  &--pass.opt--on {
    color: #1fa948;
    border-color: #9beba8;
    background: #f0fff0;
    font-weight: 500;
  }
  &--fail.opt--on {
    color: #eb372a;
    border-color: #fcac9c;
    background: #fff5f2;
    font-weight: 500;
  }
}

.defect {
  margin-top: 8px;
}

.defect__label {
  font-size: 14px;
  color: #767282;
  margin: 14px 0 8px;
}

.req {
  color: #eb372a;
  margin-right: 2px;
}

.defect-field {
  border: 1px solid #cccbd1;
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
