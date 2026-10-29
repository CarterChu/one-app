<template>
  <div class="detail">
    <!-- 吸顶头部 -->
    <div class="detail__header">
      <a-nav-bar title="详情" left-arrow @click-left="onBack" />
      <a-tabs v-model:active="activeTab" line-width="20px">
        <a-tab name="basic" title="基本信息" />
        <a-tab name="checklist" title="检查项目" />
      </a-tabs>
    </div>

    <BasicInfoTab v-show="activeTab === 'basic'" :info="data.info" />
    <ChecklistTab
      v-show="activeTab === 'checklist'"
      ref="checklistRef"
      :sections="data.sections"
      :sticky-top="STICKY_TOP"
      readonly
      @active-change="activeSectionKey = $event"
    />

    <!-- 检查项目 tab 底部:仅分组锚点(只读,无保存/提交) -->
    <div v-if="activeTab === 'checklist'" class="detail-footer">
      <div class="anchors__scroll">
        <div
          v-for="sec in data.sections"
          :key="sec.key"
          class="anchor"
          :class="{ 'anchor--on': sec.key === activeSectionKey }"
          @click="goSection(sec.key)"
        >
          {{ sec.title }}<span class="anchor__count">{{ answered(sec) }}/{{ sec.items.length }}</span>
        </div>
      </div>
      <div class="anchors__menu" @click="showGroups = true">
        <svg viewBox="0 0 20 20" width="20" height="20">
          <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="#767282" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <GroupsPopup
      v-model:show="showGroups"
      :sections="data.sections"
      :active-key="activeSectionKey"
      @select="goSection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistTab from "./execute/ChecklistTab.vue";
import GroupsPopup from "./execute/GroupsPopup.vue";
import { createDetailData } from "@/mock/detailInspection";
import type { ChecklistSection } from "@/types/execute";

const STICKY_TOP = 90;

const route = useRoute();
const router = useRouter();
const data = createDetailData(String(route.params.id ?? ""));

const activeTab = ref<"basic" | "checklist">("basic");
const activeSectionKey = ref(data.sections[0]?.key ?? "");
const checklistRef = ref<InstanceType<typeof ChecklistTab> | null>(null);
const showGroups = ref(false);

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}
function goSection(key: string) {
  activeSectionKey.value = key;
  checklistRef.value?.scrollTo(key);
}
function onBack() {
  router.back();
}
</script>

<style lang="scss" scoped>
.detail {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 68px;
}

.detail__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.anchors__scroll {
  flex: 1;
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 12px;
  scrollbar-width: none;
}

.anchor {
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #767282;
  padding-bottom: 4px;
  white-space: nowrap;

  &__count {
    color: #a7a5b0;
    margin-left: 3px;
  }

  &--on {
    color: #007bfe;
    font-weight: 500;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 24px;
      height: 2px;
      border-radius: 2px;
      background: #007bfe;
    }
  }
}

.anchors__menu {
  flex-shrink: 0;
  width: 44px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #f3f3f5;
}
</style>
