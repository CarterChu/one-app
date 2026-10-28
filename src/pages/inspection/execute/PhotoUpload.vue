<template>
  <div class="uploader">
    <div v-for="(url, i) in modelValue" :key="i" class="uploader__thumb">
      <img :src="url" alt="缺陷图片" />
      <span class="uploader__remove" @click="remove(i)">
        <svg viewBox="0 0 12 12" width="12" height="12">
          <path d="M3 3l6 6M9 3l-6 6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </span>
    </div>

    <label class="uploader__add">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 5v14M5 12h14" fill="none" stroke="#c9cdd4" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input type="file" accept="image/*" multiple hidden @change="onPick" />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits<{ (e: "update:modelValue", v: string[]): void }>();

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;
  const urls = files.map((f) => URL.createObjectURL(f));
  emit("update:modelValue", [...props.modelValue, ...urls]);
  input.value = ""; // 允许重复选择同一文件
}

function remove(i: number) {
  const next = props.modelValue.slice();
  next.splice(i, 1);
  emit("update:modelValue", next);
}
</script>

<style lang="scss" scoped>
.uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.uploader__thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.uploader__remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 8px;
}

.uploader__add {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f3f5;
  border-radius: 8px;
  cursor: pointer;
}
</style>
