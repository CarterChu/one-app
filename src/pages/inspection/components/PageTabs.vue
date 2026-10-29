<template>
  <div class="ptabs">
    <div
      v-for="t in tabs"
      :key="t.key"
      class="ptab"
      :class="{ 'ptab--on': modelValue === t.key }"
      @click="$emit('update:modelValue', t.key)"
    >
      <span class="ptab__label">{{ t.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tabs: { key: string; label: string }[]; modelValue: string }>();
defineEmits<{ (e: "update:modelValue", v: string): void }>();
</script>

<style lang="scss" scoped>
.ptabs {
  display: flex;
  gap: 20px;
  padding: 0 16px;
  height: 44px;
  align-items: center;
  background: #fff;
}

.ptab {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #767282;
}

.ptab--on {
  color: #2f2d33;
}

.ptab--on::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 28.5px;
  transform: translateX(-50%);
  width: 37.33px;
  height: 7px;
  background: url("@/assets/icons/tab-underline.svg") no-repeat center / contain;
}
</style>
