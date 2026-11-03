<template>
  <div class="wi">
    <div class="wi__head">
      <span class="wi__name">{{ item.name }}</span>
      <span class="sev" :class="`sev--${item.severity}`">{{ item.severity }}</span>
    </div>

    <!-- 合格 / 不合格 -->
    <button type="button" class="opt opt--pass" :class="{ 'opt--on': item.result === 'pass' }" @click="setResult('pass')">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      合格
    </button>
    <button type="button" class="opt opt--fail" :class="{ 'opt--on': item.result === 'fail' }" @click="setResult('fail')">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      不合格
    </button>

    <!-- 已填写摘要 -->
    <div v-if="item.result === 'fail' && item.abnormalType" class="fail-summary" @click="showDefectSheet = true">
      <span class="fail-summary__tag">{{ item.abnormalType }}</span>
      <van-icon name="edit" color="#007bfe" size="14" />
    </div>

    <!-- 不合格原因弹层 -->
    <van-popup v-model:show="showDefectSheet" round position="bottom" teleport="body" :z-index="2000">
      <div class="ds">
        <div class="ds__head">
          <span class="ds__title">不合格原因</span>
          <button class="ds__close" @click="showDefectSheet = false">
            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 6l12 12M18 6l-12 12" fill="none" stroke="#2f2d33" stroke-width="1.6" stroke-linecap="round" /></svg>
          </button>
        </div>

        <div class="ds__body">
          <!-- 异常分类 -->
          <div class="ds__field">
            <div class="ds__label"><span class="req">*</span>异常分类</div>
            <div class="ds__picker-row" @click="showPicker = true">
              <span :class="item.abnormalType ? 'ds__val' : 'ds__ph'">{{ item.abnormalType || "请选择" }}</span>
              <van-icon name="arrow" color="#a7a5b0" />
            </div>
            <div class="ds__divider" />
          </div>

          <!-- 缺陷描述 -->
          <div class="ds__field">
            <div class="ds__label">缺陷描述</div>
            <div class="ds__textarea-box">
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
          </div>

          <!-- 缺陷图片 -->
          <div class="ds__field">
            <div class="ds__label">缺陷图片</div>
            <PhotoUpload v-model="item.defectImages" />
          </div>
        </div>

        <div class="ds__footer">
          <button class="ds__btn ds__btn--cancel" @click="onCancel">取消</button>
          <button class="ds__btn ds__btn--confirm" @click="onConfirm">确定</button>
        </div>
        <div class="ds__home" />
      </div>
    </van-popup>

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
import { ABNORMAL_TYPES } from "@/mock/review";
import type { ChecklistItemData, ItemResult } from "@/types/execute";

const props = defineProps<{ item: ChecklistItemData; index: number }>();
const emit = defineEmits<{ (e: "pass"): void; (e: "fail"): void }>();

const showPicker = ref(false);
const showDefectSheet = ref(false);

function setResult(r: Exclude<ItemResult, null>) {
  props.item.result = r;
  if (r === "pass") {
    props.item.abnormalType = "";
    props.item.defectDesc = "";
    props.item.defectImages = [];
    setTimeout(() => emit("pass"), 400);
  } else {
    showDefectSheet.value = true;
  }
}

function onCancel() {
  props.item.result = null;
  props.item.abnormalType = "";
  props.item.defectDesc = "";
  props.item.defectImages = [];
  showDefectSheet.value = false;
}

function onConfirm() {
  if (!props.item.abnormalType) return;
  showDefectSheet.value = false;
  emit("fail");
}

function pick(opt: string) {
  props.item.abnormalType = opt;
  showPicker.value = false;
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

  &--CR { color: #eb372a; background: #ffece8; }
  &--MA { color: #fa9607; background: #fff7e0; }
  &--MI { color: #767282; background: #f3f3f5; }
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

  svg { width: 20px; height: 20px; }

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

.fail-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 0 4px;
  cursor: pointer;

  &__tag {
    font-size: 13px;
    color: #767282;
  }
}

.req {
  color: #eb372a;
  margin-right: 2px;
}

/* 不合格原因弹层 */
.ds {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.ds__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 16px 16px;
  flex-shrink: 0;
}

.ds__title {
  font-size: 24px;
  font-weight: 600;
  color: #2f2d33;
  line-height: 32px;
}

.ds__close {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ds__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.ds__field {
  padding: 16px 0;
  border-bottom: 1px solid #f3f3f5;

  &:last-child {
    border-bottom: none;
  }
}

.ds__label {
  font-size: 16px;
  color: #2f2d33;
  margin-bottom: 8px;
}

.ds__picker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  cursor: pointer;
}

.ds__val {
  font-size: 16px;
  color: #2f2d33;
}

.ds__ph {
  font-size: 16px;
  color: #a7a5b0;
}

.ds__divider {
  height: 1px;
  background: #e6e6eb;
  margin-top: 8px;
}

.ds__textarea-box {
  border: 1px solid #e6e6eb;
  border-radius: 12px;
  overflow: hidden;

  :deep(.van-cell) { background: transparent; }
  :deep(.van-cell::after) { display: none; }
}

.ds__footer {
  display: flex;
  gap: 12px;
  padding: 20px 16px 0;
  flex-shrink: 0;
}

.ds__btn {
  flex: 1;
  height: 54px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &--cancel {
    background: #f3f3f5;
    color: #2f2d33;
  }
  &--confirm {
    background: #007bfe;
    color: #fff;
  }
}

.ds__home {
  height: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;

  &::after {
    content: "";
    display: block;
    width: 130px;
    height: 5px;
    background: #000;
    border-radius: 100px;
  }
}

/* 异常分类选择弹层 */
.sheet {
  padding-bottom: env(safe-area-inset-bottom);
}

.sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f3f3f5;
}

.sheet__cancel {
  font-size: 16px;
  color: #767282;
}

.sheet__title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.sheet__placeholder {
  width: 32px;
}

.sheet__list {
  padding: 8px 0 16px;
}

.sheet__opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 16px;
  color: #2f2d33;

  &--on {
    color: #007bfe;
    font-weight: 500;
  }
}
</style>
