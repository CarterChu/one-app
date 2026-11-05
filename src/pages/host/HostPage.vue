<template>
  <div class="host">
    <div class="host__header">
      <AppNavBar title="主持人模式" @back="router.back()" />
      <div class="tabs">
        <div v-for="t in TABS" :key="t.key" class="tab" :class="{ 'tab--on': activeTab === t.key }" @click="activeTab = t.key">
          {{ t.label }}
        </div>
      </div>
    </div>

    <div class="host__body">

      <!-- ========== Tab 1: 任务剧本 ========== -->
      <div v-if="activeTab === 'script'" class="tab-content">
        <div class="card">
          <div class="card__title">情境话术（照读）</div>
          <div class="script-box">
            "这座电站已经有人初步排查，发现 4 个问题：<b>支架腐蚀、汇流箱内部接线、断路器选型、接地电阻</b>这四项存在缺陷。请你用这个工具完成飞检记录——把这四项标记为不合格并填写原因，其余项标记合格，最后提交。"
          </div>
          <div class="hint">测的是工具能否帮你高效完成记录，不是考专业知识。</div>
        </div>

        <div class="card">
          <div class="card__title">不合格项照填内容</div>
          <table class="stbl">
            <thead><tr><th>检查项</th><th>异常分类</th><th>缺陷描述</th></tr></thead>
            <tr><td class="k">支架腐蚀情况</td><td>材料类</td><td>支架表面出现大面积锈蚀，防腐层脱落</td></tr>
            <tr><td class="k">汇流箱内部接线规范</td><td>施工类</td><td>接线端子压接不规范，存在松动风险</td></tr>
            <tr><td class="k">断路器选型与接线</td><td>施工类</td><td>断路器额定电流与设计不符，接线错误</td></tr>
            <tr><td class="k">接地电阻测试</td><td>验收类</td><td>实测接地电阻超标，不满足规范要求</td></tr>
          </table>
        </div>

        <div class="card">
          <div class="card__title">分组顺序</div>
          <table class="stbl">
            <thead><tr><th>受访者</th><th>第一轮</th><th>第二轮</th></tr></thead>
            <tr><td class="k">1、3 号</td><td>方案一（列表式）</td><td>方案二（向导式）</td></tr>
            <tr><td class="k">2、4 号</td><td>方案二（向导式）</td><td>方案一（列表式）</td></tr>
          </table>
        </div>
      </div>

      <!-- ========== Tab 2: 观察记录 ========== -->
      <div v-else-if="activeTab === 'observe'" class="tab-content">
        <!-- 受访者选择 -->
        <div class="pno-row">
          <span class="pno-label">受访者</span>
          <div class="pno-chips">
            <div
              v-for="n in PARTICIPANTS"
              :key="n"
              class="pno-chip"
              :class="{ 'pno-chip--on': participantNo === n }"
              @click="selectParticipant(n)"
            >{{ n }}号</div>
          </div>
        </div>

        <!-- 方案切换 -->
        <div class="scheme-seg">
          <div class="seg-btn" :class="{ 'seg-btn--on': obsScheme === '1' }" @click="obsScheme = '1'">方案一（列表式）</div>
          <div class="seg-btn" :class="{ 'seg-btn--on': obsScheme === '2' }" @click="obsScheme = '2'">方案二（向导式）</div>
        </div>

        <!-- 观察项 -->
        <div class="card obs-card" v-for="(item, i) in currentObs" :key="item.key">
          <div class="obs-label">{{ item.label }}</div>
          <div class="obs-opts">
            <div class="obs-opt obs-opt--ok" :class="{ on: item.status === 'ok' }" @click="setStatus(i, 'ok')">顺畅</div>
            <div class="obs-opt obs-opt--issue" :class="{ on: item.status === 'issue' }" @click="setStatus(i, 'issue')">异常</div>
            <div class="obs-opt obs-opt--na" :class="{ on: item.status === 'na' }" @click="setStatus(i, 'na')">未观察到</div>
          </div>
          <textarea
            class="obs-note"
            v-model="item.note"
            placeholder="记录观察…"
            rows="2"
            @input="save"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import AppNavBar from "@/pages/inspection/components/AppNavBar.vue";
import { getOrCreate, updateRecord } from "@/stores/hostTracker";
import type { HostRecord, ObsStatus } from "@/stores/hostTracker";

const router = useRouter();

const TABS = [
  { key: "script", label: "任务剧本" },
  { key: "observe", label: "观察记录" },
] as const;
type TabKey = typeof TABS[number]["key"];

const PARTICIPANTS = ["1", "2", "3", "4", "5", "6"];

const activeTab = ref<TabKey>("script");
const participantNo = ref("1");
const obsScheme = ref<"1" | "2">("1");
const currentRecord = ref<HostRecord>(getOrCreate("1"));

function selectParticipant(n: string) {
  participantNo.value = n;
  currentRecord.value = getOrCreate(n);
}

const currentObs = computed(() =>
  obsScheme.value === "1" ? currentRecord.value.scheme1Obs : currentRecord.value.scheme2Obs,
);

function setStatus(i: number, val: Exclude<ObsStatus, null>) {
  const obs = currentObs.value[i];
  obs.status = obs.status === val ? null : val;
  save();
}

function save() {
  updateRecord(currentRecord.value);
}

watch(participantNo, () => {
  currentRecord.value = getOrCreate(participantNo.value);
});
</script>

<style lang="scss" scoped>
.host {
  min-height: 100vh;
  background: #f3f3f5;
  display: flex;
  flex-direction: column;
}

.host__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}

.host__body {
  flex: 1;
  padding: 16px;
}

.tabs {
  display: flex;
  padding: 0 16px;
  height: 44px;
  align-items: center;
  gap: 24px;
}

.tab {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #767282;
  white-space: nowrap;

  &--on {
    color: #2f2d33;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 100%;
      height: 3px;
      background: #007bfe;
      border-radius: 2px;
    }
  }
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.card__title {
  font-size: 14px;
  font-weight: 700;
  color: #2f2d33;
  margin-bottom: 12px;
}

.script-box {
  background: #f3f3f5;
  border-radius: 8px;
  padding: 14px;
  font-size: 14px;
  line-height: 1.7;
  color: #2f2d33;
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: #a7a5b0;
}

/* table */
.stbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th {
    text-align: left;
    padding: 6px 8px;
    background: #f7f8fa;
    color: #767282;
    font-weight: 600;
    border-bottom: 1px solid #e6e6eb;
  }

  td {
    padding: 8px;
    color: #767282;
    border-bottom: 1px solid #f3f3f5;
    vertical-align: top;
    line-height: 1.5;

    &.k { font-weight: 600; color: #2f2d33; white-space: nowrap; }
  }

  tr:last-child td { border-bottom: none; }
}

/* participant selector */
.pno-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
}

.pno-label {
  font-size: 14px;
  font-weight: 600;
  color: #2f2d33;
  white-space: nowrap;
}

.pno-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pno-chip {
  width: 44px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: #f3f3f5;
  color: #767282;

  &--on {
    background: #eef2ff;
    color: #007bfe;
  }
}

/* scheme toggle */
.scheme-seg {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  gap: 0;
}

.seg-btn {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  color: #767282;

  &--on {
    background: #007bfe;
    color: #fff;
  }
}

/* observation items */
.obs-card {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.obs-label {
  font-size: 13px;
  color: #2f2d33;
  line-height: 1.6;
}

.obs-opts {
  display: flex;
  gap: 8px;
}

.obs-opt {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1.5px solid #e6e6eb;
  color: #767282;
  background: #f7f8fa;

  &--ok.on  { background: #e6f7f0; border-color: #00b87a; color: #00875a; }
  &--issue.on { background: #fff1f0; border-color: #ff4d4f; color: #cf1322; }
  &--na.on  { background: #f3f3f5; border-color: #a7a5b0; color: #767282; }
}

.obs-note {
  width: 100%;
  border: 1px solid #e6e6eb;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: #2f2d33;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  background: #f7f8fa;

  &::placeholder { color: #a7a5b0; }
  &:focus { outline: none; border-color: #007bfe; background: #fff; }
}

/* survey */
.q-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #2f2d33;
  line-height: 1.6;
  margin-bottom: 10px;
}

.q-no {
  flex-shrink: 0;
  background: #007bfe;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 5px;
  margin-top: 1px;
}

.q-input {
  width: 100%;
  border: 1px solid #e6e6eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #2f2d33;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  background: #f7f8fa;

  &::placeholder { color: #a7a5b0; }
  &:focus { outline: none; border-color: #007bfe; background: #fff; }
}

.export-row {
  padding: 4px 0 20px;
  :deep(.a-button) { width: 100%; }
}
</style>
