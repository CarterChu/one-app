<template>
  <div class="ci">
    <div class="ci__head">
      <span class="ci__name">{{ index }}. {{ item.name }}</span>
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }}</span>
    </div>

    <!-- 编辑态:合格 / 不合格(自绘切换,不用 a-radio-group) -->
    <div v-if="!readonly" class="rt-row">
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

    <!-- 只读态:结果文字 -->
    <div v-else class="result-text" :class="`result-text--${item.result ?? 'none'}`">
      <template v-if="item.result === 'pass'">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        合格
      </template>
      <template v-else-if="item.result === 'fail'">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        不合格
      </template>
      <template v-else>–</template>
    </div>

    <!-- 不合格展开:缺陷描述 + 缺陷图片 -->
    <div v-if="item.result === 'fail'" class="defect">
      <div class="defect__label"><span v-if="!readonly" class="req">*</span>缺陷说明</div>
      <div v-if="readonly" class="defect__text">{{ item.defectDesc || "无" }}</div>
      <div v-else class="defect-field">
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

      <template v-if="readonly ? item.defectImages.length : true">
        <div class="defect__label"><span v-if="!readonly" class="req">*</span>缺陷图片</div>
        <PhotoUpload v-model="item.defectImages" :readonly="readonly" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoUpload from "./PhotoUpload.vue";
import type { ChecklistItemData, ItemResult } from "@/types/execute";

const props = withDefaults(defineProps<{ item: ChecklistItemData; index: number; readonly?: boolean }>(), {
  readonly: false,
});

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
}

.ci__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ci__name {
  flex: 1;
  min-width: 0;
}

.sev {
  flex-shrink: 0;
  font-size: 12px;
  line-height: 16px;
  padding: 2px 6px;
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

.ci__name {
  font-size: 16px;
  line-height: 24px;
  color: #2f2d33;
  font-weight: 500;
}

.rt-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.rt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 104px;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 8px;
  border: 1px solid #e6e6eb;
  background: #fff;
  color: #767282;

  svg {
    width: 20px;
    height: 20px;
  }

  &--pass.rt--on {
    color: #1fa948;
    border-color: #9beba8;
    background: #f0fff0;
    font-weight: 500;
  }
  &--fail.rt--on {
    color: #eb372a;
    border-color: #fcac9c;
    background: #fff5f2;
    font-weight: 500;
  }
}

.result-text {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 500;

  &--pass {
    color: #28ba4f;
  }
  &--fail {
    color: #eb372a;
  }
  &--none {
    color: #a7a5b0;
  }
}

.defect {
  margin-top: 20px;
}

.defect__label {
  font-size: 14px;
  color: #767282;
  margin: 14px 0 8px;
}

.defect__text {
  font-size: 14px;
  color: #2f2d33;
  line-height: 22px;
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
