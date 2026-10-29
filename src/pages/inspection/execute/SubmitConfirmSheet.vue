<template>
  <a-popup :show="show" round position="bottom" teleport="body" @update:show="$emit('update:show', $event)">
    <div class="sc">
      <div class="sc__head">
        <span class="sc__title">确认提交飞检结果</span>
        <span class="sc__close" @click="$emit('update:show', false)">
          <svg viewBox="0 0 16 16" width="18" height="18">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#767282" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <div class="sc__body">
        <div class="sec-title">飞检结果</div>
        <div class="stat-card">
          <div class="stat-card__tip">本单检查结果</div>
          <div class="stat-card__result" :class="stats.result === '通过' ? 'is-pass' : 'is-fail'">
            {{ stats.result }}
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="stat__k">检查项</span><span class="stat__v">{{ stats.total }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">合格项</span><span class="stat__v">{{ stats.pass }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">不合格项</span><span class="stat__v">{{ stats.fail }}<em>项</em></span></div>
          </div>
        </div>

        <div class="sec-title">缺陷统计</div>
        <div class="stat-card">
          <div class="stat-grid">
            <div class="stat"><span class="stat__k">CR(严重)</span><span class="stat__v">{{ stats.cr }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">MA(主要)</span><span class="stat__v">{{ stats.ma }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">MI(轻微)</span><span class="stat__v">{{ stats.mi }}<em>项</em></span></div>
          </div>
        </div>

        <div class="sec-title sec-title--req"><span class="req">*</span>整改复验人</div>
        <div class="reviewer" @click="showPicker = true">
          <span :class="reviewer ? 'reviewer__val' : 'reviewer__ph'">
            {{ reviewer || "请选择后续复验人" }}
          </span>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
      </div>

      <div class="sc__footer">
        <a-button-group type="white-bg">
          <a-button variant="secondary" size="large" @click="$emit('back')">返回修改</a-button>
          <a-button variant="primary" size="large" @click="onConfirm">确认提交</a-button>
        </a-button-group>
      </div>
    </div>

    <PersonPickerSheet
      v-model:show="showPicker"
      :selected="reviewer"
      title="选择复验人"
      @select="reviewer = $event"
    />
  </a-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "a-design-h5";
import PersonPickerSheet from "../components/PersonPickerSheet.vue";

export interface SubmitStats {
  result: "通过" | "不通过";
  total: number;
  pass: number;
  fail: number;
  cr: number;
  ma: number;
  mi: number;
}

defineProps<{ show: boolean; stats: SubmitStats }>();
const emit = defineEmits<{
  (e: "update:show", v: boolean): void;
  (e: "back"): void;
  (e: "confirm", reviewer: string): void;
}>();

const reviewer = ref("");
const showPicker = ref(false);
function onConfirm() {
  if (!reviewer.value) {
    showToast("请选择整改复验人");
    return;
  }
  emit("confirm", reviewer.value);
}
</script>

<style lang="scss" scoped>
.sc {
  display: flex;
  flex-direction: column;
  max-height: 86vh;
}

.sc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 10px;
}

.sc__title {
  font-size: 18px;
  font-weight: 600;
  color: #2f2d33;
}

.sc__close {
  display: inline-flex;
}

.sc__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.sec-title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
  margin: 18px 0 10px;

  &--req {
    font-size: 14px;
    font-weight: 400;
    color: #767282;
  }
}

.req {
  color: #eb372a;
  margin-right: 2px;
}

.stat-card {
  background: #f7f8fa;
  border-radius: 10px;
  padding: 14px 16px;
}

.stat-card__tip {
  font-size: 12px;
  color: #767282;
}

.stat-card__result {
  font-size: 20px;
  font-weight: 700;
  margin: 2px 0 14px;

  &.is-fail {
    color: #2f2d33;
  }
  &.is-pass {
    color: #28ba4f;
  }
}

.stat-grid {
  display: flex;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat__k {
  font-size: 13px;
  color: #767282;
}

.stat__v {
  font-size: 20px;
  font-weight: 700;
  color: #2f2d33;

  em {
    font-size: 12px;
    font-weight: 400;
    color: #767282;
    font-style: normal;
    margin-left: 2px;
  }
}

.reviewer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  background: #f7f8fa;
  border-radius: 8px;

  &__ph {
    color: #a7a5b0;
    font-size: 14px;
  }
  &__val {
    color: #2f2d33;
    font-size: 14px;
  }
}

.sc__footer {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
