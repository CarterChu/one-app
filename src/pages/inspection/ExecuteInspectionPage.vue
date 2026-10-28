<template>
  <div class="exec">
    <!-- 吸顶头部:导航 + tabs -->
    <div class="exec__header">
      <a-nav-bar title="执行飞检" left-arrow right-text="转办" @click-left="onBack" @click-right="onTransfer" />
      <a-tabs v-model:active="activeTab" line-width="20px">
        <a-tab name="basic" title="基本信息" />
        <a-tab name="checklist" title="检查项目" />
      </a-tabs>
    </div>

    <!-- 内容 -->
    <BasicInfoTab v-show="activeTab === 'basic'" :info="BASIC_INFO" />
    <ChecklistTab
      v-show="activeTab === 'checklist'"
      ref="checklistRef"
      :sections="sections"
      :sticky-top="STICKY_TOP"
      @active-change="activeSectionKey = $event"
    />

    <!-- 检查项目 tab 的底部操作栏 -->
    <div v-if="activeTab === 'checklist'" class="exec-footer">
      <div class="anchors">
        <div class="anchors__scroll">
          <div
            v-for="sec in sections"
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
            <path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="#4e5969" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <div class="foot-actions">
        <div class="foot-ind">
          <template v-if="allDone">
            <span class="foot-ind__done">
              <svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="8" fill="#00b42a" /><path d="M4.5 8.2 7 10.5l4-4.8" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              全部完成
            </span>
          </template>
          <template v-else>
            <span class="foot-ind__remain">检查项剩余 {{ remaining }}</span>
            <span class="foot-ind__locate" @click="locateUnanswered">点击定位</span>
          </template>
        </div>
        <a-button variant="secondary" size="large" class="foot-btn" @click="onSave">保存</a-button>
        <a-button variant="primary" size="large" class="foot-btn" :disabled="!allDone" @click="onSubmit">提交</a-button>
      </div>
    </div>

    <!-- 全部分组 -->
    <GroupsPopup
      v-model:show="showGroups"
      :sections="sections"
      :active-key="activeSectionKey"
      @select="goSection"
    />

    <!-- 确认提交 -->
    <SubmitConfirmSheet
      v-model:show="showSubmit"
      :stats="submitStats"
      @back="showSubmit = false"
      @confirm="onConfirmSubmit"
    />

    <!-- 转办 -->
    <TransferSheet v-model:show="showTransfer" @confirm="onTransferConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistTab from "./execute/ChecklistTab.vue";
import GroupsPopup from "./execute/GroupsPopup.vue";
import SubmitConfirmSheet, { type SubmitStats } from "./execute/SubmitConfirmSheet.vue";
import TransferSheet from "./components/TransferSheet.vue";
import { BASIC_INFO, createSections } from "@/mock/executeInspection";
import type { ChecklistSection } from "@/types/execute";
import { startTrack, bump, finishTrack } from "@/stores/tracker";

const STICKY_TOP = 90; // nav(46) + tabs(44)

const router = useRouter();
const activeTab = ref<"basic" | "checklist">("checklist");
const sections = reactive<ChecklistSection[]>(createSections());
const activeSectionKey = ref(sections[0]?.key ?? "");

const checklistRef = ref<InstanceType<typeof ChecklistTab> | null>(null);
const showGroups = ref(false);
const showSubmit = ref(false);
const showTransfer = ref(false);

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}

const allItems = computed(() => sections.flatMap((s) => s.items));

// —— A/B 埋点 ——
const route = useRoute();
onMounted(() => startTrack("1", "execute", String(route.params.id ?? ""), allItems.value.length));
watch(
  () => allItems.value.map((it) => it.result),
  (nw, od) => {
    for (let i = 0; i < nw.length; i++) {
      if (od[i] != null && nw[i] != null && od[i] !== nw[i]) bump("reedits");
    }
  },
);
watch(showGroups, (v) => {
  if (v) bump("previewOpens");
});
const totalCount = computed(() => allItems.value.length);
const answeredCount = computed(() => allItems.value.filter((it) => it.result !== null).length);
const remaining = computed(() => totalCount.value - answeredCount.value);
const allDone = computed(() => remaining.value === 0);

const submitStats = computed<SubmitStats>(() => {
  const fails = allItems.value.filter((it) => it.result === "fail");
  const pass = allItems.value.filter((it) => it.result === "pass").length;
  return {
    result: fails.length > 0 ? "不通过" : "通过",
    total: totalCount.value,
    pass,
    fail: fails.length,
    cr: fails.filter((it) => it.severity === "CR").length,
    ma: fails.filter((it) => it.severity === "MA").length,
    mi: fails.filter((it) => it.severity === "MI").length,
  };
});

function goSection(key: string) {
  bump("jumps");
  activeSectionKey.value = key;
  checklistRef.value?.scrollTo(key);
}

function locateUnanswered() {
  const sec = sections.find((s) => s.items.some((it) => it.result === null));
  if (sec) goSection(sec.key);
}

function onBack() {
  router.back();
}
function onTransfer() {
  showTransfer.value = true;
}
function onTransferConfirm(person: string) {
  showTransfer.value = false;
  showToast(`转办成功,新负责人:${person}`);
}
function onSave() {
  showToast("已保存");
}
function onSubmit() {
  if (!allDone.value) {
    showToast(`还有 ${remaining.value} 项未检查`);
    return;
  }
  showSubmit.value = true;
}
function onConfirmSubmit(reviewer: string) {
  finishTrack({
    answers: allItems.value.map((it) => ({ id: it.id, result: it.result })),
    result: submitStats.value.result,
    submitted: true,
  });
  showSubmit.value = false;
  showToast(`已提交,复验人:${reviewer}`);
  setTimeout(() => router.back(), 800);
}
</script>

<style lang="scss" scoped>
.exec {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 124px;
}

.exec__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}

/* 底部操作栏 */
.exec-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.anchors {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f2f3f5;
}

.anchors__scroll {
  flex: 1;
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 10px 12px;
  scrollbar-width: none;
}

.anchor {
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #4e5969;
  padding-bottom: 4px;
  white-space: nowrap;

  &__count {
    color: #c9cdd4;
    margin-left: 3px;
  }

  &--on {
    color: #3060ff;
    font-weight: 500;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 24px;
      height: 2px;
      border-radius: 2px;
      background: #3060ff;
    }
  }
}

.anchors__menu {
  flex-shrink: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #f2f3f5;
  align-self: stretch;
}

.foot-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
}

.foot-ind {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 16px;
  min-width: 64px;
}

.foot-ind__remain {
  color: #86909c;
}
.foot-ind__locate {
  color: #3060ff;
}
.foot-ind__done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #00b42a;
  font-size: 13px;
}

.foot-btn {
  flex: 1;
}
</style>
