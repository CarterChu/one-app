<template>
  <a-popup :show="show" round position="bottom" teleport="body" @update:show="$emit('update:show', $event)">
    <div class="pp">
      <div class="pp__head">
        <span class="pp__title">选择新负责人</span>
        <span class="pp__close" @click="$emit('update:show', false)">
          <svg viewBox="0 0 16 16" width="18" height="18">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="#86909c" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </div>

      <a-search v-model="keyword" placeholder="搜索名称" shape="round" />

      <div class="pp__list">
        <a-empty v-if="filtered.length === 0" description="暂无数据" />
        <div
          v-for="name in filtered"
          :key="name"
          class="pp-item"
          :class="{ 'pp-item--on': name === selected }"
          @click="onSelect(name)"
        >
          <span>{{ name }}</span>
          <svg v-if="name === selected" class="pp-item__check" viewBox="0 0 16 16" width="16" height="16">
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#3060FF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </a-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { PEOPLE } from "@/mock/people";

const props = defineProps<{ show: boolean; selected: string }>();
const emit = defineEmits<{
  (e: "update:show", v: boolean): void;
  (e: "select", name: string): void;
}>();

const keyword = ref("");
const filtered = computed(() => {
  const kw = keyword.value.trim();
  return kw ? PEOPLE.filter((n) => n.includes(kw)) : PEOPLE;
});

// 每次打开重置搜索
watch(
  () => props.show,
  (v) => {
    if (v) keyword.value = "";
  },
);

function onSelect(name: string) {
  emit("select", name);
  emit("update:show", false);
}
</script>

<style lang="scss" scoped>
.pp {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.pp__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 10px;
}

.pp__title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
}

.pp__close {
  display: inline-flex;
}

.pp__list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 16px calc(8px + env(safe-area-inset-bottom));
}

.pp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  font-size: 15px;
  color: #1d2129;
  border-bottom: 1px solid #f2f3f5;

  &--on {
    color: #3060ff;
  }
}
</style>
