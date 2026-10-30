<template>
  <div class="ri">
    <div class="ri__head">
      <span class="num">{{ index }}.</span>
      <span class="ri__name">{{ item.name }}</span>
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }} {{ SEVERITY_LABEL[item.severity] }}</span>
    </div>

    <!-- 原缺陷(只读) -->
    <div class="blk__label">缺陷说明</div>
    <div class="blk__text">{{ item.defectDesc }}</div>
    <PhotoUpload v-if="item.defectImages.length" :model-value="item.defectImages" readonly class="blk__photos" />

    <div class="ri__divider"></div>

    <!-- 整改说明 -->
    <div class="blk__label"><span v-if="!readonly" class="req">*</span>整改说明</div>
    <div v-if="readonly" class="blk__text">{{ item.rectifyDesc || "–" }}</div>
    <div v-else class="field-box">
      <a-field
        v-model="item.rectifyDesc"
        type="textarea"
        input-align="left"
        :autosize="{ minHeight: 64 }"
        maxlength="100"
        show-word-limit
        placeholder="请输入"
      />
    </div>

    <!-- 整改后图片 -->
    <template v-if="!readonly || item.rectifyImages.length">
      <div class="blk__label"><span v-if="!readonly" class="req">*</span>整改后图片</div>
      <PhotoUpload v-model="item.rectifyImages" :readonly="readonly" class="blk__photos" />
    </template>

    <!-- 复验结果 -->
    <div v-if="item.reviewResult" class="review" :class="`review--${item.reviewResult}`">
      <svg v-if="item.reviewResult === 'pass'" viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <svg v-else viewBox="0 0 16 16" width="14" height="14"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      {{ item.reviewResult === "pass" ? "合格" : "不合格" }}
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoUpload from "../execute/PhotoUpload.vue";
import { SEVERITY_LABEL } from "@/types/execute";
import type { RectifyItemData } from "@/types/rectify";

withDefaults(defineProps<{ item: RectifyItemData; index: number; readonly?: boolean }>(), {
  readonly: false,
});
</script>

<style lang="scss" scoped>
.ri {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.ri__head { display: flex; align-items: center; gap: 6px; }
.num { font-size: 16px; font-weight: 600; color: #2f2d33; }
.ri__name { font-size: 16px; line-height: 24px; font-weight: 600; color: #2f2d33; flex: 1; min-width: 0; }
.sev {
  flex-shrink: 0; font-size: 12px; line-height: 16px; padding: 2px 6px; border-radius: 4px; font-weight: 600;
  &--CR { color: #eb372a; background: #ffece8; }
  &--MA { color: #fa9607; background: #fff7e0; }
  &--MI { color: #767282; background: #f3f3f5; }
}
.blk__label { font-size: 14px; color: #767282; margin: 16px 0 8px; }
.blk__text { font-size: 14px; color: #2f2d33; line-height: 22px; }
.blk__photos { margin-top: 12px; }
.req { color: #eb372a; margin-right: 2px; }
.ri__divider { height: 1px; background: #f0f0f2; margin: 16px 0 0; }
.field-box {
  border: 1px solid #cccbd1; border-radius: 8px; overflow: hidden;
  :deep(.van-cell) { background: transparent; }
  :deep(.van-cell::after) { display: none; }
}
.review {
  display: inline-flex; align-items: center; gap: 4px; margin-top: 14px;
  font-size: 15px; font-weight: 500;
  &--pass { color: #1fa948; }
  &--fail { color: #eb372a; }
}
</style>
