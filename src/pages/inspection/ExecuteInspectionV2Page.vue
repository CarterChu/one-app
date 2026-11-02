<template>
  <div class="v2" :class="{ 'v2--wizard': stage === 'wizard' }">
    <!-- ========== 基本信息(落地页) ========== -->
    <template v-if="stage === 'basic' || stage === 'info'">
      <div class="v2__header">
        <AppNavBar
          :title="stage === 'info' ? '基本信息' : '执行飞检'"
          :right="stage === 'basic' ? '转办' : undefined"
          @back="onBasicBack"
          @right-click="showTransfer = true"
        />
      </div>
      <BasicInfoTab :info="basicInfo" time-label="飞检截止时间" />
      <div v-if="stage === 'basic'" class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="primary" size="large" @click="startCheck">开始检查</a-button>
        </a-button-group>
      </div>
    </template>

    <!-- ========== 向导逐项 ========== -->
    <template v-else-if="stage === 'wizard'">
      <div class="v2__header">
        <AppNavBar title="执行飞检" right="预览" @back="onBack" @right-click="goPreview" />
      </div>
      <div class="v2__body">
        <StationCard :info="basicInfo" @open="openInfo" />
        <div class="progress">
          <div class="progress__num"><b>{{ currentIndex + 1 }}</b><span>/{{ total }}</span></div>
          <div class="progress__bar"><div class="progress__fill" :style="{ width: progressPct }" /></div>
        </div>
        <div class="sec-chip">{{ locate.section.title }}</div>
        <WizardItem :item="currentItem" :index="locate.localIndex + 1" @pass="next" />
      </div>
      <div class="v2-footer">
        <a-button-group type="white-bg">
          <a-button variant="secondary" size="large" @click="prev">返回</a-button>
          <a-button variant="primary" size="large" @click="next">下一项</a-button>
        </a-button-group>
      </div>
    </template>

    <!-- ========== 预览全部检查项(result 时也保持此页为背景) ========== -->
    <template v-else-if="stage === 'preview' || stage === 'result'">
      <div class="v2__header">
        <AppNavBar title="预览全部检查项" @back="stage = 'wizard'" />
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
              <van-icon class="prev-row__arrow" name="arrow" color="#a7a5b0" />
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

    <!-- 转办(共享) -->
    <TransferSheet v-model:show="showTransfer" @confirm="onTransferConfirm" />

    <!-- ========== 飞检结果弹窗 ========== -->
    <van-popup
      v-model:show="resultVisible"
      position="bottom"
      round
      :close-on-click-overlay="false"
      teleport="body"
      :z-index="2000"
    >
      <div class="rs">
        <div class="rs__head">
          <span class="rs__title">飞检结果</span>
          <button class="rs__close" @click="stage = 'preview'">
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="#767282" stroke-width="1.8" stroke-linecap="round" /></svg>
          </button>
        </div>

        <div class="rs__card">
          <div class="rs__card-label">本单检查结果</div>
          <div class="rs__card-value" :class="stats.result === '通过' ? 'rs__card-value--pass' : 'rs__card-value--fail'">
            {{ stats.result }}
          </div>
          <div class="rs__divider" />
          <div class="rs__stats">
            <div class="rs__stat">
              <span class="rs__stat-k">CR(严重)</span>
              <span class="rs__stat-v">{{ stats.cr }}<em>个</em></span>
            </div>
            <div class="rs__stat">
              <span class="rs__stat-k">MA(主要)</span>
              <span class="rs__stat-v">{{ stats.ma }}<em>个</em></span>
            </div>
            <div class="rs__stat">
              <span class="rs__stat-k">MI(轻微)</span>
              <span class="rs__stat-v">{{ stats.mi }}<em>个</em></span>
            </div>
          </div>
          <div class="rs__formula">{{ formula }}</div>
        </div>

        <div class="rs__reviewer" @click="showReviewer = true">
          <span class="rs__reviewer-label"><span class="req">*</span>整改复验人</span>
          <div class="rs__reviewer-right">
            <span :class="reviewer ? 'rs__reviewer-val' : 'rs__reviewer-ph'">{{ reviewer || "请选择后续复验人" }}</span>
            <van-icon name="arrow" color="#a7a5b0" />
          </div>
        </div>

        <div class="rs__foot">
          <a-button-group type="white-bg">
            <a-button variant="secondary" size="large" @click="stage = 'wizard'">返回修改</a-button>
            <a-button variant="primary" size="large" @click="onSubmit">确认提交</a-button>
          </a-button-group>
        </div>
      </div>
    </van-popup>

    <PersonPickerSheet
      v-model:show="showReviewer"
      :selected="reviewer"
      title="选择复验人"
      @select="reviewer = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistItem from "./execute/ChecklistItem.vue";
import AppNavBar from "./components/AppNavBar.vue";
import StationCard from "./execute2/StationCard.vue";
import WizardItem from "./execute2/WizardItem.vue";
import TransferSheet from "./components/TransferSheet.vue";
import PersonPickerSheet from "./components/PersonPickerSheet.vue";
import { createExecuteBasicInfo, createSections, BASIC_INFO } from "@/mock/executeInspection";
import { startTrack, bump, finishTrack } from "@/stores/tracker";
import { EXPECTED } from "@/mock/scenario";
import { flow, commitInspect } from "@/stores/flow";
import type { ChecklistSection } from "@/types/execute";

type Stage = "basic" | "info" | "wizard" | "preview" | "result";

const route = useRoute();
const router = useRouter();
const isFlow = route.query.flow === "1";

const stage = ref<Stage>("basic");
const infoReturn = ref<Stage>("wizard");
const sections: ChecklistSection[] = isFlow ? flow.inspectSections : reactive(createSections());
const currentIndex = ref(0);

const showTransfer = ref(false);
const showReviewer = ref(false);
const reviewer = ref("");

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
  const cr = fails.filter((it) => it.severity === "CR").length;
  const ma = fails.filter((it) => it.severity === "MA").length;
  const mi = fails.filter((it) => it.severity === "MI").length;
  const score = cr * 1 + ma * 0.5 + mi * 0.33;
  return {
    result: (score >= 1 ? "不通过" : "通过") as "通过" | "不通过",
    total: total.value,
    pass: allItems.value.filter((it) => it.result === "pass").length,
    fail: fails.length,
    cr,
    ma,
    mi,
  };
});

const resultVisible = computed({
  get: () => stage.value === "result",
  set: (v: boolean) => { if (!v) stage.value = "preview"; },
});

const formula = computed(() => {
  const { cr, ma, mi } = stats.value;
  const raw = cr * 1 + ma * 0.5 + mi * 0.33;
  const score = parseFloat(raw.toFixed(2));
  const isPassing = stats.value.result === "通过";
  return `${cr}(CR)×1 + ${ma}(MA)×0.5 + ${mi}(MI)×0.33=${score}，得分${isPassing ? "＜" : "≥"}1 ，飞检状态为【${stats.value.result}】。`;
});

function answered(sec: ChecklistSection) {
  return sec.items.filter((it) => it.result !== null).length;
}

// —— A/B 埋点 ——
const basicInfo = isFlow ? BASIC_INFO : createExecuteBasicInfo(String(route.params.id ?? ""));
onMounted(() => {
  if (!isFlow) startTrack("2", "execute", String(route.params.id ?? ""), total.value);
});
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
    stage.value = "preview";
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

function onSubmit() {
  if (!reviewer.value) {
    showToast("请选择整改复验人");
    return;
  }
  if (isFlow) {
    commitInspect();
    if (flow.rectifySections.length === 0) {
      // 全部合格,无需整改
      router.push({ name: "flow-done" });
    } else {
      router.push({ name: "rectify-execute", params: { id: "flow" } });
    }
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
  color: #767282;

  b {
    font-size: 18px;
    color: #2f2d33;
  }
}

.progress__bar {
  margin-top: 8px;
  height: 4px;
  border-radius: 2px;
  background: #cccbd1;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  border-radius: 2px;
  background: #007bfe;
  transition: width 0.25s;
}

.sec-chip {
  display: inline-block;
  margin: 18px 0 14px;
  padding: 3px 10px;
  font-size: 13px;
  color: #767282;
  background: #f3f3f5;
  border-radius: 6px;
}

.prev-sec {
  margin-top: 20px;
}

.prev-sec__title {
  font-size: 17px;
  font-weight: 600;
  color: #2f2d33;
  margin-bottom: 10px;
}

.prev-sec__card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}

.prev-row {
  position: relative;
  padding-right: 20px;

  & + & {
    border-top: 1px solid #f3f3f5;
  }
}

.prev-row__arrow {
  position: absolute;
  top: 20px;
  right: 0;
  z-index: 1;
}

// ===== 飞检结果弹窗 =====
.rs {
  padding-bottom: env(safe-area-inset-bottom);
}

.rs__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid #f3f3f5;
}

.rs__title {
  font-size: 18px;
  font-weight: 600;
  color: #2f2d33;
}

.rs__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f3f5;
  border-radius: 50%;
  border: none;
  padding: 0;
}

.rs__card {
  margin: 12px 16px 0;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.rs__card-label {
  font-size: 12px;
  color: #767282;
  margin-bottom: 6px;
}

.rs__card-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;

  &--pass { color: #28ba4f; }
  &--fail { color: #eb372a; }
}

.rs__divider {
  height: 1px;
  background: #f0f0f2;
  margin-bottom: 16px;
}

.rs__stats {
  display: flex;
  margin-bottom: 16px;
}

.rs__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:not(:last-child) {
    border-right: 1px solid #f0f0f2;
    margin-right: 16px;
    padding-right: 16px;
  }
}

.rs__stat-k {
  font-size: 12px;
  color: #767282;
}

.rs__stat-v {
  font-size: 20px;
  font-weight: 700;
  color: #2f2d33;

  em {
    font-size: 12px;
    font-weight: 400;
    color: #767282;
    font-style: normal;
    margin-left: 2px;
  }
}

.rs__formula {
  font-size: 12px;
  color: #767282;
  line-height: 1.6;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 8px 10px;
}

.rs__reviewer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 16px 0;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
}

.rs__reviewer-label {
  font-size: 15px;
  font-weight: 500;
  color: #2f2d33;
}

.rs__reviewer-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rs__reviewer-ph {
  font-size: 14px;
  color: #a7a5b0;
}

.rs__reviewer-val {
  font-size: 14px;
  color: #2f2d33;
}

.rs__foot {
  padding: 8px 16px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f2;
}

.req {
  color: #eb372a;
  margin-right: 2px;
}
</style>
