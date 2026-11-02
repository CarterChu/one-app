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

    <!-- 不合格展开:异常分类 + 缺陷描述 + 缺陷图片 -->
    <div v-if="item.result === 'fail'" class="defect">
      <div class="defect__label"><span v-if="!readonly" class="req">*</span>异常分类</div>
      <div v-if="readonly" class="defect__text">{{ item.abnormalType || "–" }}</div>
      <div v-else class="picker-field" @click="showPicker = true">
        <span :class="item.abnormalType ? 'picker-field__val' : 'picker-field__ph'">{{ item.abnormalType || "请选择" }}</span>
        <van-icon name="arrow" color="#a7a5b0" />
      </div>

      <div class="defect__label">缺陷说明</div>
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
        <div class="defect__label">缺陷图片</div>
        <PhotoUpload v-model="item.defectImages" :readonly="readonly" />
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
import PhotoUpload from "./PhotoUpload.vue";
import { ABNORMAL_TYPES } from "@/mock/review";
import type { ChecklistItemData, ItemResult } from "@/types/execute";

const props = withDefaults(defineProps<{ item: ChecklistItemData; index: number; readonly?: boolean }>(), {
  readonly: false,
});

const showPicker = ref(false);

function setResult(r: Exclude<ItemResult, null>) {
  props.item.result = r;
  if (r === "pass") {
    props.item.abnormalType = "";
    props.item.defectDesc = "";
    props.item.defectImages = [];
  }
}
function pick(opt: string) {
  props.item.abnormalType = opt;
  showPicker.value = false;
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
  border: 1px solid #e6e6eb;
  border-radius: 8px;
  overflow: hidden;

  :deep(.van-cell) {
    background: transparent;
  }
  :deep(.van-cell::after) {
    display: none;
  }
}

.picker-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 0;
  border-bottom: 1px solid #cccbd1;
  background: transparent;
  cursor: pointer;

  &__val {
    font-size: 14px;
    color: #2f2d33;
  }
  &__ph {
    font-size: 14px;
    color: #bab9c4;
  }
}

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
