<template>
  <div class="v2">
    <!-- ========== 基本信息(落地页) ========== -->
    <template v-if="stage === 'basic' || stage === 'info'">
      <div class="v2__header">
        <a-nav-bar
          :title="stage === 'info' ? '基本信息' : '执行飞检'"
          left-arrow
          :right-text="stage === 'basic' ? '转办' : ''"
          @click-left="onBasicBack"
          @click-right="showTransfer = true"
        />
      </div>
      <BasicInfoTab :info="BASIC_INFO" time-label="飞检截止时间" />
      <div v-if="stage === 'basic'" class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="primary" size="large" @click="startCheck">开始检查</a-button>
        </a-button-group>
      </div>
    </template>

    <!-- ========== 向导逐项 ========== -->
    <template v-else-if="stage === 'wizard'">
      <div class="v2__header">
        <a-nav-bar title="执行飞检" left-arrow right-text="预览" @click-left="onBack" @click-right="goPreview" />
      </div>
      <div class="v2__body">
        <StationCard :info="BASIC_INFO" @open="openInfo" />
        <div class="progress">
          <div class="progress__num"><b>{{ currentIndex + 1 }}</b><span>/{{ total }}</span></div>
          <div class="progress__bar"><div class="progress__fill" :style="{ width: progressPct }" /></div>
        </div>
        <div class="sec-chip">{{ locate.section.title }} {{ answered(locate.section) }}/{{ locate.section.items.length }}</div>
        <WizardItem :item="currentItem" :index="locate.localIndex + 1" />
      </div>
      <div class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="secondary" size="large" @click="prev">返回</a-button>
          <a-button variant="primary" size="large" @click="next">下一项</a-button>
        </a-button-group>
      </div>
    </template>

    <!-- ========== 预览全部检查项 ========== -->
    <template v-else-if="stage === 'preview'">
      <div class="v2__header">
        <a-nav-bar title="预览全部检查项" left-arrow @click-left="stage = 'wizard'" />
        <div class="progress progress--inline">
          <div class="progress__num"><b>{{ answeredCount }}</b><span>/{{ total }}</span></div>
          <div class="progress__bar"><div class="progress__fill" :style="{ width: answeredPct }" /></div>
        </div>
      </div>
      <div class="v2__body v2__body--preview">
        <section v-for="sec in sections" :key="sec.key" class="prev-sec">
          <div class="prev-sec__title">{{ sec.title }}（{{ answered(sec) }}/{{ sec.items.length }}）</div>
          <div class="prev-sec__card">
            <div
              v-for="(it, i) in sec.items"
              :key="it.id"
              class="prev-row"
              @click="jumpTo(it.id)"
            >
              <van-icon class="prev-row__arrow" name="arrow" color="#c9cdd4" />
              <ChecklistItem :item="it" :index="i + 1" readonly />
            </div>
          </div>
        </section>
      </div>
      <div class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="primary" size="large" @click="onPreviewAction">
            {{ remaining > 0 ? `继续检查（剩余${remaining}项）` : "提交飞检" }}
          </a-button>
        </a-button-group>
      </div>
    </template>

    <!-- ========== 飞检结果(提交确认整页) ========== -->
    <template v-else>
      <div class="v2__header">
        <a-nav-bar title="执行飞检" left-arrow right-text="预览" @click-left="stage = 'wizard'" @click-right="goPreview" />
      </div>
      <div class="v2__body">
        <StationCard :info="BASIC_INFO" @open="openInfo" />

        <div class="sec-title">飞检结果</div>
        <div class="result-card">
          <div class="result-card__tip">本单检查结果</div>
          <div class="result-card__value" :class="stats.result === '通过' ? 'is-pass' : 'is-fail'">
            <svg v-if="stats.result === '通过'" viewBox="0 0 16 16" width="18" height="18"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <svg v-else viewBox="0 0 16 16" width="18" height="18"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
            {{ stats.result }}
          </div>
          <div class="stat-grid">
            <div class="stat"><span class="stat__k">检查项</span><span class="stat__v">{{ stats.total }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">合格项</span><span class="stat__v">{{ stats.pass }}<em>项</em></span></div>
            <div class="stat"><span class="stat__k">不合格项</span><span class="stat__v">{{ stats.fail }}<em>项</em></span></div>
          </div>
        </div>

        <div class="sec-title">缺陷统计</div>
        <div class="defect-cards">
          <div class="dcard"><span class="dcard__k">CR(严重)</span><span class="dcard__v">{{ stats.cr }}<em>项</em></span></div>
          <div class="dcard"><span class="dcard__k">MA(主要)</span><span class="dcard__v">{{ stats.ma }}<em>项</em></span></div>
          <div class="dcard"><span class="dcard__k">MI(轻微)</span><span class="dcard__v">{{ stats.mi }}<em>项</em></span></div>
        </div>

        <div class="reviewer-label"><span class="req">*</span>整改复验人</div>
        <div class="reviewer" @click="showReviewer = true">
          <span :class="reviewer ? 'reviewer__val' : 'reviewer__ph'">{{ reviewer || "请选择后续复验人" }}</span>
          <van-icon name="arrow" color="#c9cdd4" />
        </div>
      </div>
      <div class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="secondary" size="large" @click="stage = 'wizard'">返回</a-button>
          <a-button variant="primary" size="large" @click="onSubmit">确认提交</a-button>
        </a-button-group>
      </div>

      <a-popup v-model:show="showReviewer" round position="bottom" teleport="body">
        <a-picker :columns="reviewerColumns" title="选择复验人" @confirm="onReviewerConfirm" @cancel="showReviewer = false" />
      </a-popup>
    </template>

    <!-- 转办(共享) -->
    <TransferSheet v-model:show="showTransfer" @confirm="onTransferConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistItem from "./execute/ChecklistItem.vue";
import StationCard from "./execute2/StationCard.vue";
import WizardItem from "./execute2/WizardItem.vue";
import TransferSheet from "./components/TransferSheet.vue";
import { BASIC_INFO, createSections } from "@/mock/executeInspection";
import { startTrack, bump, finishTrack } from "@/stores/tracker";
import { EXPECTED } from "@/mock/scenario";
import type { ChecklistSection } from "@/types/execute";

type Stage = "basic" | "info" | "wizard" | "preview" | "result";

const router = useRouter();
const stage = ref<Stage>("basic");
const infoReturn = ref<Stage>("wizard");
const sections = reactive<ChecklistSection[]>(createSections());
const currentIndex = ref(0);

const showTransfer = ref(false);
const showReviewer = ref(false);
const reviewer = ref("");
const reviewerColumns = [
  { text: "张伟", value: "张伟" },
  { text: "刘洋", value: "刘洋" },
  { text: "陈晓", value: "陈晓" },
  { text: "赵强", value: "赵强" },
];

const allItems = computed(() => sections.flatMap((s) => s.items));
const total = computed(() => allItems.value.length);
const currentItem = computed(() => allItems.value[currentIndex.value]);
const answeredCount = computed(() => allItems.value.filter((it) => it.result !== null).length);
const remaining = computed(() => total.value - answeredCount.value);
const progressPct = computed(() => `${((currentIndex.value + 1) / total.value) * 100}%`);
const answeredPct = computed(() => `${(answeredCount.value / total.value) * 100}%`);

const locate = computed(() => {
  let n = 0;
  for (const section of sections) {
    if (currentIndex.value < n + section.items.length) {
      return { section, localIndex: currentIndex.value - n };
    }
    n += section.items.length;
  }
  return { section: sections[0], localIndex: 0 };
});

const stats = computed(() => {
  const fails = allItems.value.filter((it) => it.result === "fail");
  return {
    result: (fails.length > 0 ? "不通过" : "通过") as "通过" | "不通过",
    total: total.value,
    pass: allItems.value.filter((it) => it.result === "pass").length,
    fail: fails.length,
    cr: fails.filter((it) => it.severity === "CR").length,
    ma: fails.filter((it) => it.severity === "MA").length,
    mi: fails.filter((it) => it.severity === "MI").length,
  };
});

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}

// —— A/B 埋点 ——
const route = useRoute();
onMounted(() => startTrack("2", "execute", String(route.params.id ?? ""), total.value));
watch(
  () => allItems.value.map((it) => it.result),
  (nw, od) => {
    for (let i = 0; i < nw.length; i++) {
      if (od[i] != null && nw[i] != null && od[i] !== nw[i]) bump("reedits");
    }
  },
);

function startCheck() {
  currentIndex.value = 0;
  stage.value = "wizard";
}
function next() {
  if (currentIndex.value < total.value - 1) {
    currentIndex.value += 1;
  } else {
    stage.value = remaining.value === 0 ? "result" : "preview";
  }
}
function prev() {
  bump("backClicks");
  if (currentIndex.value > 0) currentIndex.value -= 1;
  else stage.value = "basic";
}
function goPreview() {
  bump("previewOpens");
  stage.value = "preview";
}
function jumpTo(id: string) {
  bump("jumps");
  const idx = allItems.value.findIndex((it) => it.id === id);
  if (idx >= 0) currentIndex.value = idx;
  stage.value = "wizard";
}
function onPreviewAction() {
  if (remaining.value > 0) {
    bump("jumps");
    const idx = allItems.value.findIndex((it) => it.result === null);
    if (idx >= 0) currentIndex.value = idx;
    stage.value = "wizard";
  } else {
    stage.value = "result";
  }
}
function openInfo() {
  infoReturn.value = stage.value;
  stage.value = "info";
}
function onBasicBack() {
  if (stage.value === "info") stage.value = infoReturn.value;
  else router.back();
}
function onBack() {
  router.back();
}

function onReviewerConfirm(payload: { selectedOptions: { text: string }[] }) {
  reviewer.value = payload.selectedOptions[0]?.text ?? "";
  showReviewer.value = false;
}
function onSubmit() {
  if (!reviewer.value) {
    showToast("请选择整改复验人");
    return;
  }
  finishTrack({
    answers: allItems.value.map((it) => ({ id: it.id, result: it.result })),
    expected: EXPECTED,
    result: stats.value.result,
    submitted: true,
  });
  showToast(`已提交,复验人:${reviewer.value}`);
  setTimeout(() => router.back(), 800);
}
function onTransferConfirm(person: string) {
  showTransfer.value = false;
  showToast(`转办成功,新负责人:${person}`);
}
</script>

<style lang="scss" scoped>
.v2 {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 96px;
}

.v2__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}

.v2__body {
  padding: 16px;
}

.v2__body--preview {
  padding: 0 16px 16px;
}

.v2-footer {
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

.progress {
  margin: 16px 2px 0;

  &--inline {
    margin: 0;
    padding: 10px 16px 12px;
    background: #fff;
  }
}

.progress__num {
  font-size: 13px;
  color: #86909c;

  b {
    font-size: 18px;
    color: #1d2129;
  }
}

.progress__bar {
  margin-top: 8px;
  height: 4px;
  border-radius: 2px;
  background: #e5e6eb;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  border-radius: 2px;
  background: #3060ff;
  transition: width 0.25s;
}

.sec-chip {
  display: inline-block;
  margin: 18px 0 14px;
  padding: 3px 10px;
  font-size: 13px;
  color: #4e5969;
  background: #f2f3f5;
  border-radius: 6px;
}

.prev-sec {
  margin-top: 20px;
}

.prev-sec__title {
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 10px;
}

.prev-sec__card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.prev-row {
  position: relative;
}

.prev-row__arrow {
  position: absolute;
  top: 20px;
  right: 0;
  z-index: 1;
}

.sec-title {
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  margin: 24px 0 12px;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.result-card__tip {
  font-size: 12px;
  color: #86909c;
}

.result-card__value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 700;
  margin: 4px 0 16px;

  &.is-pass {
    color: #00b42a;
  }
  &.is-fail {
    color: #f53f3f;
  }
}

.stat-grid {
  display: flex;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat__k {
  font-size: 13px;
  color: #86909c;
}

.stat__v {
  font-size: 20px;
  font-weight: 700;
  color: #1d2129;

  em {
    font-size: 12px;
    font-weight: 400;
    color: #86909c;
    font-style: normal;
    margin-left: 2px;
  }
}

.defect-cards {
  display: flex;
  gap: 12px;
}

.dcard {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border-radius: 10px;
  padding: 14px 12px;
}

.dcard__k {
  font-size: 12px;
  color: #86909c;
}

.dcard__v {
  font-size: 20px;
  font-weight: 700;
  color: #1d2129;

  em {
    font-size: 12px;
    font-weight: 400;
    color: #86909c;
    font-style: normal;
    margin-left: 2px;
  }
}

.reviewer-label {
  font-size: 14px;
  color: #4e5969;
  margin: 24px 0 10px;
}

.req {
  color: #f53f3f;
  margin-right: 2px;
}

.reviewer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 14px;
  background: #fff;
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
</style>
