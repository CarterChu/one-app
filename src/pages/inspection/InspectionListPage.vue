<template>
  <div class="page">
    <!-- 吸顶头部 -->
    <div class="page__header">
      <a-nav-bar title="飞检管理" left-arrow @click-left="onBack" />

      <a-search
        v-model="keyword"
        placeholder="搜索电站编号/业主姓名"
        shape="round"
        @search="onSearch"
        @update:model-value="onSearch"
      />

      <div class="tabs">
        <div
          v-for="t in TAB_ITEMS"
          :key="t.key"
          class="tab"
          :class="{ 'tab--on': activeTab === t.key }"
          @click="activeTab = t.key"
        >
          <span class="tab__label">{{ t.label }}</span><span class="tab__count">{{ t.count }}</span>
        </div>
      </div>

      <FilterBar
        ref="filterBarRef"
        :region="filter.region"
        :period="filter.period"
        :date-range="filter.dateRange"
        @apply="onApplyFilter"
      />
    </div>

    <!-- 列表内容 -->
    <div class="page__content">
      <a-empty v-if="!loading && visibleList.length === 0" description="暂无飞检记录" />

      <a-list
        v-else
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <InspectionCard
          v-for="item in visibleList"
          :key="item.id"
          :item="item"
          class="card-gap"
          @detail="onDetail"
          @execute="onExecute"
        />
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { dev, setSchemeFromQuery, executeRoute, detailRoute } from "@/stores/scheme";
import FilterBar from "./components/FilterBar.vue";
import InspectionCard from "./components/InspectionCard.vue";
import { ALL_INSPECTIONS, TAB_ITEMS } from "@/mock/inspections";
import type { Inspection, TabKey } from "@/types/inspection";

const router = useRouter();
const route = useRoute();
onMounted(() => setSchemeFromQuery(route.query.scheme));
const TODAY = new Date(2026, 9, 28); // 原型基准"今天"

const keyword = ref("");
const activeTab = ref<TabKey>("all");

const filter = reactive<{
  region: string[];
  period: 7 | 15 | 30 | null;
  dateRange: [string, string] | null;
}>({
  region: [],
  period: null,
  dateRange: null,
});

const filterBarRef = ref<InstanceType<typeof FilterBar> | null>(null);

// —— 按条件过滤出结果集 ——
const filteredList = computed<Inspection[]>(() => {
  return ALL_INSPECTIONS.filter((it) => {
    // 状态 tab
    if (activeTab.value === "pending" && it.status !== "待检查") return false;
    if (activeTab.value === "pass" && it.status !== "通过") return false;
    if (activeTab.value === "fail" && it.status !== "不通过") return false;

    // 关键词(电站编号 / 业主姓名)
    if (keyword.value.trim()) {
      const kw = keyword.value.trim();
      if (!it.stationNo.includes(kw) && !it.ownerName.includes(kw)) return false;
    }

    // 地区
    if (filter.region.length) {
      const [prov, city] = filter.region;
      if (prov && it.region[0] !== prov) return false;
      if (city && it.region[1] !== city) return false;
    }

    // 日期:周期 或 自定义范围
    if (filter.period) {
      const min = new Date(TODAY);
      min.setDate(min.getDate() - filter.period);
      if (new Date(it.inspectDate) < min) return false;
    } else if (filter.dateRange) {
      const [s, e] = filter.dateRange;
      if (it.inspectDate < s || it.inspectDate > e) return false;
    }

    return true;
  });
});

// —— 分页(模拟下拉加载) ——
const PAGE_SIZE = 8;
const page = ref(1);
const loading = ref(false);
const finished = ref(false);

const visibleList = computed(() => filteredList.value.slice(0, page.value * PAGE_SIZE));

function onLoad() {
  // 模拟异步加载下一页
  setTimeout(() => {
    page.value += 1;
    loading.value = false;
    if (visibleList.value.length >= filteredList.value.length) {
      finished.value = true;
    }
  }, 400);
}

// 任一筛选条件变化 → 重置分页
function resetPaging() {
  page.value = 1;
  finished.value = false;
  loading.value = false;
}

watch([activeTab, keyword, () => filter.region, () => filter.period, () => filter.dateRange], resetPaging, {
  deep: true,
});

function onTabChange() {
  resetPaging();
}
function onSearch() {
  resetPaging();
}
function onApplyFilter(
  payload: Partial<{ region: string[]; period: 7 | 15 | 30 | null; dateRange: [string, string] | null }>,
) {
  if ("region" in payload && payload.region) filter.region = payload.region;
  if ("period" in payload) filter.period = payload.period ?? null;
  if ("dateRange" in payload) filter.dateRange = payload.dateRange ?? null;
}

function onBack() {
  router.push({ name: "home" });
}
function onDetail(item: Inspection) {
  router.push({ name: detailRoute(), params: { id: item.id }, query: devQuery() });
}
function onExecute(item: Inspection) {
  router.push({ name: executeRoute(), params: { id: item.id }, query: devQuery() });
}
function devQuery() {
  return dev.value ? { dev: "1" } : undefined;
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.page__header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;

  :deep(.van-search) {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

.tabs {
  display: flex;
  gap: 20px;
  padding: 0 16px;
  height: 44px;
  align-items: center;
  background: #fff;
}

.tab {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
}

.tab__label {
  position: relative;
  font-size: 16px;
  color: #767282;
}

.tab__count {
  font-size: 13px;
  color: #a7a5b0;
  margin-left: 3px;
}

.tab--on .tab__label {
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

.page__content {
  flex: 1;
  padding: 12px 16px 40px;
}

.card-gap {
  margin-bottom: 12px;
}
</style>
