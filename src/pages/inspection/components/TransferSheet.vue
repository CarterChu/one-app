<template>
  <a-popup :show="show" round position="bottom" teleport="body" @update:show="$emit('update:show', $event)">
    <div class="tf">
      <div class="tf__head">
        <span class="tf__title">转办</span>
        <span class="tf__close" @click="close">
          <svg viewBox="0 0 16 16" width="18" height="18">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#86909c" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <div class="tf__body">
        <div class="tf__label"><span class="req">*</span>选择新负责人</div>
        <div class="tf-field" @click="showPicker = true">
          <span :class="person ? 'tf-field__val' : 'tf-field__ph'">
            {{ person || "请选择" }}
          </span>
          <van-icon name="arrow" color="#c9cdd4" />
        </div>
      </div>

      <div class="tf__footer">
        <a-button variant="primary" size="large" radius="8" class="tf__btn" @click="onConfirm">确认更换</a-button>
      </div>
    </div>

    <PersonPickerSheet v-model:show="showPicker" :selected="person" @select="person = $event" />
  </a-popup>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { showToast } from "a-design-h5";
import PersonPickerSheet from "./PersonPickerSheet.vue";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{
  (e: "update:show", v: boolean): void;
  (e: "confirm", person: string): void;
}>();

const person = ref("");
const showPicker = ref(false);

watch(
  () => props.show,
  (v) => {
    if (v) person.value = "";
  },
);

function close() {
  emit("update:show", false);
}

function onConfirm() {
  if (!person.value) {
    showToast("请选择新负责人");
    return;
  }
  emit("confirm", person.value);
}
</script>

<style lang="scss" scoped>
.tf {
  display: flex;
  flex-direction: column;
}

.tf__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 10px;
}

.tf__title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.tf__close {
  display: inline-flex;
}

.tf__body {
  padding: 8px 16px 24px;
  min-height: 140px;
}

.tf__label {
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 10px;
}

.req {
  color: #f53f3f;
  margin-right: 2px;
}

.tf-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  background: #f7f8fa;
  border-radius: 8px;

  &__ph {
    color: #c9cdd4;
    font-size: 14px;
  }
  &__val {
    color: #1d2129;
    font-size: 14px;
  }
}

.tf__footer {
  padding: 8px 16px calc(12px + env(safe-area-inset-bottom));
}

.tf__btn {
  width: 100%;
}
</style>
