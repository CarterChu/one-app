<template>
  <div class="survey">
    <div class="survey__header">
      <AppNavBar title="测后问卷" @back="router.back()" />
    </div>

    <div class="survey__body">
      <div class="pno-row">
        <span class="pno-label">你是第几位受访者？</span>
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

      <div class="tip">请根据你的真实体验作答，没有对错之分。</div>

      <div class="card" v-for="(q, i) in QUESTIONS" :key="i">
        <div class="q-label"><span class="q-no">Q{{ i + 1 }}</span>{{ q }}</div>
        <textarea
          class="q-input"
          v-model="currentRecord[`q${i + 1}` as QKey]"
          placeholder="请输入你的感受…"
          rows="3"
          @input="save"
        />
      </div>

      <div class="submit-row">
        <a-button variant="primary" size="large" @click="onSubmit">提交问卷</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import AppNavBar from "@/pages/inspection/components/AppNavBar.vue";
import { getOrCreate, updateRecord } from "@/stores/hostTracker";
import type { HostRecord } from "@/stores/hostTracker";

const router = useRouter();
const PARTICIPANTS = ["1", "2", "3", "4", "5", "6"];
const QUESTIONS = [
  "两个方案哪个更容易上手，为什么？",
  "哪个方案让你更有信心不会漏检？",
  '方案二的「不合格原因」弹层操作顺不顺？',
  "有没有哪一步让你不知道该怎么操作？",
];
type QKey = "q1" | "q2" | "q3" | "q4";

const participantNo = ref("1");
const currentRecord = ref<HostRecord>(getOrCreate("1"));

function selectParticipant(n: string) {
  participantNo.value = n;
  currentRecord.value = getOrCreate(n);
}
function save() {
  updateRecord(currentRecord.value);
}
function onSubmit() {
  const r = currentRecord.value;
  if (!r.q1 && !r.q2 && !r.q3 && !r.q4) {
    showToast("请至少填写一道题");
    return;
  }
  updateRecord(r);
  showToast("已提交，谢谢！");
  setTimeout(() => router.back(), 800);
}

watch(participantNo, () => {
  currentRecord.value = getOrCreate(participantNo.value);
});
</script>

<style lang="scss" scoped>
.survey {
  min-height: 100vh;
  background: #f3f3f5;
  display: flex;
  flex-direction: column;
}
.survey__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}
.survey__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pno-row {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.pno-label {
  font-size: 14px;
  font-weight: 600;
  color: #2f2d33;
  white-space: nowrap;
}
.pno-chips { display: flex; gap: 8px; flex-wrap: wrap; }
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
  &--on { background: #eef2ff; color: #007bfe; }
}
.tip {
  font-size: 12px;
  color: #a7a5b0;
  padding: 0 4px;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
.q-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
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
  margin-top: 2px;
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
.submit-row {
  padding: 4px 0 24px;
  :deep(.a-button) { width: 100%; }
}
</style>
