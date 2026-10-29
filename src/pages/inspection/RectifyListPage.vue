<template>
  <div class="page">
    <div class="page__header">
      <a-nav-bar title="整改管理" left-arrow @click-left="onBack" />
      <a-search v-model="keyword" placeholder="搜索电站编号/业主姓名" shape="round" @update:model-value="resetPaging" />
      <div class="tabs">
        <div
          v-for="t in RECTIFY_TABS"
          :key="t.key"
          class="tab"
          :class="{ 'tab--on': activeTab === t.key }"
          @click="activeTab = t.key"
        >
          <span class="tab__label">{{ t.label }}</span><span class="tab__count">{{ t.count }}</span>
        </div>
      </div>
    </div>

    <div class="page__content">
      <a-empty v-if="!loading && visibleList.length === 0" description="暂无整改记录" />
      <a-list v-else v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <RectifyCard
          v-for="rec in visibleList"
          :key="rec.id"
          :item="rec"
          class="card-gap"
          @detail="onDetail"
          @execute="onExecute"
        />
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import RectifyCard from "./rectify/RectifyCard.vue";
import { ALL_RECTIFY, RECTIFY_TABS } from "@/mock/rectify";
import type { RectifyRecord, RectifyTabKey } from "@/types/rectify";

const router = useRouter();
const keyword = ref("");
const activeTab = ref<RectifyTabKey>("all");

const filtered = computed<RectifyRecord[]>(() =>
  ALL_RECTIFY.filter((it) => {
    if (activeTab.value === "pending" && it.status !== "待整改") return false;
    if (activeTab.value === "review" && it.status !== "待复验") return false;
    if (activeTab.value === "passed" && it.status !== "整改通过") return false;
    if (keyword.value.trim()) {
      const kw = keyword.value.trim();
      if (!it.stationNo.includes(kw) && !it.ownerName.includes(kw)) return false;
    }
    return true;
  }),
);

const PAGE_SIZE = 8;
const page = ref(1);
const loading = ref(false);
const finished = ref(false);
const visibleList = computed(() => filtered.value.slice(0, page.value * PAGE_SIZE));

function onLoad() {
  setTimeout(() => {
    page.value += 1;
    loading.value = false;
    if (visibleList.value.length >= filtered.value.length) finished.value = true;
  }, 400);
}
function resetPaging() {
  page.value = 1;
  finished.value = false;
  loading.value = false;
}
watch([activeTab, keyword], resetPaging);

onMounted(resetPaging);

function onBack() {
  router.push({ name: "home" });
}
function onDetail(rec: RectifyRecord) {
  router.push({ name: "rectify-detail", params: { id: rec.id } });
}
function onExecute(rec: RectifyRecord) {
  router.push({ name: "rectify-execute", params: { id: rec.id } });
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f7f8fa; display: flex; flex-direction: column; }
.page__header {
  position: sticky; top: 0; z-index: 10; background: #fff;
  :deep(.van-search) { padding-top: 8px; padding-bottom: 8px; }
}
.tabs { display: flex; gap: 20px; padding: 0 16px; height: 44px; align-items: center; background: #fff; }
.tab {
  position: relative; height: 44px; display: flex; align-items: center; gap: 2px;
  font-size: 16px; line-height: 24px; font-weight: 600; color: #767282;
}
.tab--on { color: #2f2d33; }
.tab--on::after {
  content: ""; position: absolute; left: 50%; top: 28.5px; transform: translateX(-50%);
  width: 37.33px; height: 7px;
  background: url("@/assets/icons/tab-underline.svg") no-repeat center / contain;
}
.tab__count { font-size: 14px; color: #a7a5b0; margin-left: 1px; }
.page__content { flex: 1; padding: 12px 16px 40px; }
.card-gap { margin-bottom: 12px; }
</style>
