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
}

.ptab__label {
  position: relative;
  font-size: 16px;
  color: #767282;
}

.ptab--on .ptab__label {
  color: #2f2d33;
  font-weight: 600;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -9px;
    transform: translateX(-50%);
    width: 16px;
    height: 3px;
    border-radius: 2px;
    background: #007bfe;
  }
}
</style>
