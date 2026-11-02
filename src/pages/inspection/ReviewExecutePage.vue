<template>
  <div class="page">
    <AppNavBar
      :title="stage === 'info' ? '基本信息' : '整改复验'"
      :right="stage === 'list' ? '转办' : undefined"
      @back="onBack"
      @right-click="showTransfer = true"
    />

    <div v-if="stage === 'info'" class="scroll">
      <ReviewBasicTab :info="basic" />
    </div>

    <template v-else>
      <div ref="scrollRef" class="scroll scroll--pad">
        <div class="card-wrap"><StationCard :info="basic" @open="stage = 'info'" /></div>

        <div v-for="sec in sections" :key="sec.key" class="section" :ref="(el) => setSecRef(sec.key, el)">
          <div class="section__head">
            <span class="section__title">{{ sec.title }}</span>
            <span class="section__count">({{ reviewedOf(sec) }}/{{ sec.items.length }})</span>
          </div>
          <div class="section__body">
            <ReviewItem v-for="(it, i) in sec.items" :key="it.id" :item="it" :index="i + 1" />
          </div>
        </div>
      </div>

      <div class="foot-bar">
        <div class="foot-ind">
          <template v-if="remaining === 0">
            <span class="foot-ind__done">
              <svg viewBox="0 0 16 16" width="15" height="15"><circle cx="8" cy="8" r="8" fill="#28ba4f" /><path d="M4.5 8.2 7 10.5l4-4.8" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              全部完成
            </span>
          </template>
          <template v-else>
            <span class="foot-ind__remain">检查项剩余 <em>{{ remaining }}</em></span>
            <span class="foot-ind__locate" @click="locate">点击定位</span>
          </template>
        </div>
        <a-button variant="primary" size="large" class="submit-btn" @click="onSubmit">提交</a-button>
      </div>
    </template>

    <!-- 转办 -->
    <TransferSheet v-model:show="showTransfer" @confirm="onTransferConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import AppNavBar from "./components/AppNavBar.vue";
import StationCard from "./execute2/StationCard.vue";
import ReviewItem from "./review/ReviewItem.vue";
import ReviewBasicTab from "./review/ReviewBasicTab.vue";
import TransferSheet from "./components/TransferSheet.vue";
import { createReviewBasic, createReviewDetail } from "@/mock/review";
import type { ReviewSection, ReviewItemData } from "@/types/review";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id ?? "1");

const basic = createReviewBasic(id);
const sections = ref<ReviewSection[]>(createReviewDetail(id));
const stage = ref<"list" | "info">("list");
const showTransfer = ref(false);

const scrollRef = ref<HTMLElement | null>(null);
const secEls = new Map<string, HTMLElement>();
function setSecRef(key: string, el: unknown) {
  if (el) secEls.set(key, el as HTMLElement);
  else secEls.delete(key);
}

function reviewedOf(sec: ReviewSection) {
  return sec.items.filter((it: ReviewItemData) => it.result !== null).length;
}
const remaining = computed(() =>
  sections.value.reduce((n, s) => n + s.items.filter((it) => it.result === null).length, 0),
);

function locate() {
  const sec = sections.value.find((s) => s.items.some((it) => it.result === null));
  if (sec) secEls.get(sec.key)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
function onTransferConfirm(person: string) {
  showTransfer.value = false;
  showToast(`转办成功,新负责人:${person}`);
}
function onSubmit() {
  if (remaining.value > 0) {
    showToast(`还有 ${remaining.value} 项未复验`);
    return;
  }
  const badFail = sections.value.some((s) =>
    s.items.some((it) => it.result === "fail" && (!it.abnormalType || !it.reviewDefectDesc.trim())),
  );
  if (badFail) {
    showToast("不合格项请填写异常分类和缺陷说明");
    return;
  }
  showToast("提交成功");
  setTimeout(() => router.push({ name: "review-list" }), 600);
}
</script>

<style lang="scss" scoped>
.page { display: flex; flex-direction: column; height: 100dvh; background: #f3f3f5; }
.scroll { flex: 1; overflow-y: auto; }
.scroll--pad { padding-bottom: 12px; }
.card-wrap { padding: 12px 16px 4px; }
.section { margin-top: 8px; }
.section__head { display: flex; align-items: baseline; gap: 4px; padding: 10px 16px 6px; }
.section__title { font-size: 18px; line-height: 26px; font-weight: 600; color: #2f2d33; }
.section__count { font-size: 14px; color: #a7a5b0; }
.section__body { padding: 0 16px; }

.foot-bar {
  flex-shrink: 0; display: flex; align-items: center; gap: 12px;
  padding: 8px 16px calc(8px + env(safe-area-inset-bottom));
  background: #f3f3f5; border-top: 1px solid #ebedf0;
}
.foot-ind {
  flex-shrink: 0; width: 85px; display: flex; flex-direction: column; gap: 4px;
  font-size: 12px; line-height: 16px;
}
.foot-ind__remain { color: #2f2d33; em { color: #eb372a; font-style: normal; } }
.foot-ind__locate { color: #007bfe; font-weight: 600; text-decoration: underline; }
.foot-ind__done { display: inline-flex; align-items: center; gap: 4px; color: #28ba4f; font-size: 13px; }
.submit-btn { flex: 1; --van-button-large-height: 50px; --van-button-border-radius: 14px; font-size: 17px; font-weight: 600; }
</style>
