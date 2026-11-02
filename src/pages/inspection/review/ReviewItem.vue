<template>
  <div class="ri">
    <div class="ri__head">
      <span class="num">{{ index }}.</span>
      <span class="ri__name">{{ item.name }}</span>
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }} {{ SEVERITY_LABEL[item.severity] }}</span>
    </div>

    <!-- 原飞检缺陷(只读) -->
    <div class="blk__label">缺陷说明</div>
    <div class="blk__text">{{ item.defectDesc }}</div>
    <PhotoUpload v-if="item.defectImages.length" :model-value="item.defectImages" readonly class="blk__photos" />

    <div class="ri__divider"></div>

    <!-- 整改说明(只读) -->
    <div class="blk__label">整改说明</div>
    <div class="blk__text">{{ item.rectifyDesc }}</div>
    <PhotoUpload v-if="item.rectifyImages.length" :model-value="item.rectifyImages" readonly class="blk__photos" />

    <!-- 复验结果:编辑态=合格/不合格切换 -->
    <div v-if="!readonly" class="rt-row">
      <button type="button" class="rt rt--pass" :class="{ 'rt--on': item.result === 'pass' }" @click="setResult('pass')">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        合格
      </button>
      <button type="button" class="rt rt--fail" :class="{ 'rt--on': item.result === 'fail' }" @click="setResult('fail')">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        不合格
      </button>
    </div>
    <!-- 只读态:结果文字 -->
    <div v-else-if="item.result" class="result-text" :class="`result-text--${item.result}`">
      {{ item.result === "pass" ? "合格" : "不合格" }}
    </div>

    <!-- 不合格展开:异常分类 + 缺陷说明 + 缺陷图片 -->
    <div v-if="item.result === 'fail'" class="defect">
      <div class="blk__label"><span v-if="!readonly" class="req">*</span>异常分类</div>
      <div v-if="readonly" class="blk__text">{{ item.abnormalType || "–" }}</div>
      <div v-else class="picker-field" @click="showPicker = true">
        <span :class="item.abnormalType ? 'picker-field__val' : 'picker-field__ph'">{{ item.abnormalType || "请选择" }}</span>
        <van-icon name="arrow" color="#a7a5b0" />
      </div>

      <div class="blk__label"><span v-if="!readonly" class="req">*</span>缺陷说明</div>
      <div v-if="readonly" class="blk__text">{{ item.reviewDefectDesc || "无" }}</div>
      <div v-else class="field-box">
        <a-field
          v-model="item.reviewDefectDesc"
          type="textarea"
          input-align="left"
          :autosize="{ minHeight: 64 }"
          maxlength="100"
          show-word-limit
          placeholder="请输入"
        />
      </div>

      <template v-if="!readonly || item.reviewDefectImages.length">
        <div class="blk__label"><span v-if="!readonly" class="req">*</span>缺陷图片</div>
        <PhotoUpload v-model="item.reviewDefectImages" :readonly="readonly" class="blk__photos" />
      </template>
    </div>

    <!-- 异常分类选择弹层 -->
    <van-popup v-model:show="showPicker" round position="bottom" teleport="body" :z-index="3000">
      <div class="sheet">
        <div class="sheet__head">
          <span class="sheet__cancel" @click="showPicker = false">取消</span>
          <span class="sheet__title">异常分类</span>
          <span class="sheet__placeholder" />
        </div>
        <div class="sheet__list">
          <div
            v-for="opt in ABNORMAL_TYPES"
            :key="opt"
            class="sheet__opt"
            :class="{ 'sheet__opt--on': item.abnormalType === opt }"
            @click="pick(opt)"
          >
            {{ opt }}
            <van-icon v-if="item.abnormalType === opt" name="success" color="#007bfe" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PhotoUpload from "../execute/PhotoUpload.vue";
import { SEVERITY_LABEL } from "@/types/execute";
import { ABNORMAL_TYPES } from "@/mock/review";
import type { ReviewItemData } from "@/types/review";

const props = withDefaults(defineProps<{ item: ReviewItemData; index: number; readonly?: boolean }>(), {
  readonly: false,
});

const showPicker = ref(false);

function setResult(r: "pass" | "fail") {
  props.item.result = r;
  if (r === "pass") {
    props.item.abnormalType = "";
    props.item.reviewDefectDesc = "";
    props.item.reviewDefectImages = [];
  }
}
function pick(opt: string) {
  props.item.abnormalType = opt;
  showPicker.value = false;
}
</script>

<style lang="scss" scoped>
.ri { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
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

.rt-row { display: flex; gap: 8px; margin-top: 16px; }
.rt {
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  width: 104px; height: 40px; font-size: 16px; line-height: 20px; border-radius: 8px;
  border: 1px solid #e6e6eb; background: #fff; color: #767282;
  svg { width: 20px; height: 20px; }
  &--pass.rt--on { color: #1fa948; border-color: #9beba8; background: #f0fff0; font-weight: 500; }
  &--fail.rt--on { color: #eb372a; border-color: #fcac9c; background: #fff5f2; font-weight: 500; }
}
.result-text {
  margin-top: 16px; font-size: 15px; font-weight: 500;
  &--pass { color: #28ba4f; }
  &--fail { color: #eb372a; }
}

.defect { margin-top: 4px; }
.field-box {
  border: 1px solid #cccbd1; border-radius: 8px; overflow: hidden;
  :deep(.van-cell) { background: transparent; }
  :deep(.van-cell::after) { display: none; }
}
.picker-field {
  display: flex; align-items: center; justify-content: space-between;
  height: 48px; padding: 0 14px; background: #f3f3f5; border-radius: 8px;
  &__ph { color: #a7a5b0; font-size: 14px; }
  &__val { color: #2f2d33; font-size: 14px; }
}

.sheet { padding-bottom: env(safe-area-inset-bottom); }
.sheet__head {
  display: flex; align-items: center; justify-content: space-between;
  height: 52px; padding: 0 16px; border-bottom: 1px solid #f3f3f5;
}
.sheet__cancel { font-size: 15px; color: #767282; }
.sheet__title { font-size: 17px; font-weight: 600; color: #2f2d33; }
.sheet__placeholder { width: 30px; }
.sheet__list { padding: 8px 0; max-height: 50vh; overflow-y: auto; }
.sheet__opt {
  display: flex; align-items: center; justify-content: space-between;
  height: 52px; padding: 0 16px; font-size: 16px; color: #2f2d33;
  &--on { color: #007bfe; }
}
</style>
