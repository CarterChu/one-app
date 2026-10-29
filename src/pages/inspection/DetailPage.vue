<template>
  <div class="detail">
    <!-- 吸顶头部 -->
    <div class="detail__header">
      <a-nav-bar title="详情" left-arrow @click-left="onBack" />
      <PageTabs
        v-model="activeTab"
        :tabs="[
          { key: 'basic', label: '基本信息' },
          { key: 'checklist', label: '检查项目' },
        ]"
      />
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
      <div class="anchors-pill">
        <div class="anchors__scroll">
          <div
            v-for="sec in data.sections"
            :key="sec.key"
            class="anchor"
            :class="{ 'anchor--on': sec.key === activeSectionKey }"
            :ref="(el) => setAnchorRef(sec.key, el)"
            @click="goSection(sec.key)"
          >
            <span class="anchor__label">{{ sec.title }}</span><span class="anchor__count">{{ answered(sec) }}/{{ sec.items.length }}</span>
          </div>
        </div>
        <div class="anchors__menu" @click="showGroups = true">
          <svg viewBox="0 0 20 20" width="20" height="20">
            <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="#767282" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </div>
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistTab from "./execute/ChecklistTab.vue";
import GroupsPopup from "./execute/GroupsPopup.vue";
import PageTabs from "./components/PageTabs.vue";
import { createDetailData } from "@/mock/detailInspection";
import type { ChecklistSection } from "@/types/execute";

const STICKY_TOP = 90;

const route = useRoute();
const router = useRouter();
const data = createDetailData(String(route.params.id ?? ""));

const activeTab = ref<"basic" | "checklist">("basic");
const activeSectionKey = ref(data.sections[0]?.key ?? "");
const checklistRef = ref<InstanceType<typeof ChecklistTab> | null>(null);

const anchorEls = new Map<string, HTMLElement>();
function setAnchorRef(key: string, el: unknown) {
  if (el) anchorEls.set(key, el as HTMLElement);
  else anchorEls.delete(key);
}
watch(activeSectionKey, (k) => {
  anchorEls.get(k)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
});
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
  padding: 8px 16px calc(10px + env(safe-area-inset-bottom));
  background: linear-gradient(to bottom, rgba(243, 243, 245, 0), #f3f3f5 55%);
}

.anchors-pill {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(4px);
  border-radius: 100px;
  box-shadow: 0 3px 20px rgba(10, 10, 10, 0.06);
  overflow: hidden;
}

.anchors__scroll {
  flex: 1;
  display: flex;
  overflow-x: auto;
  padding: 0 4px;
  scrollbar-width: none;
}

.anchor {
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 2px;
  padding: 11px 8px;
  white-space: nowrap;
}

.anchor__label {
  position: relative;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: #767282;
}

.anchor__count {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: #bab9c4;
}

.anchor--on .anchor__label {
  color: #2f2d33;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    height: 4px;
    border-radius: 20px;
    background: #007bfe;
  }
}

.anchors__menu {
  flex-shrink: 0;
  width: 42px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff 45%);
}
</style>
