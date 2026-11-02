<template>
  <div class="page">
    <van-nav-bar :title="stage === 'info' ? '基本信息' : '整改复验'" left-arrow @click-left="onBack">
      <template v-if="stage === 'list'" #right><span class="nav-right" @click="onTransfer">转办</span></template>
    </van-nav-bar>

    <div v-if="stage === 'info'" class="scroll">
      <ReviewBasicTab :info="basic" />
    </div>

    <template v-else>
      <div class="scroll scroll--pad">
        <div class="card-wrap"><StationCard :info="basic" @open="stage = 'info'" /></div>

        <div v-for="sec in sections" :key="sec.key" class="section">
          <div class="section__head">
            <span class="section__title">{{ sec.title }}</span>
            <span class="section__count">({{ reviewedOf(sec) }}/{{ sec.items.length }})</span>
          </div>
          <div class="section__body">
            <ReviewItem v-for="(it, i) in sec.items" :key="it.id" :item="it" :index="i + 1" />
          </div>
        </div>
      </div>

      <div class="bottom-bar">
        <div class="bottom-bar__left">检查项剩余 <b>{{ remaining }}</b></div>
        <a-button variant="primary" size="large" class="submit-btn" @click="onSubmit">提交</a-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import StationCard from "./execute2/StationCard.vue";
import ReviewItem from "./review/ReviewItem.vue";
import ReviewBasicTab from "./review/ReviewBasicTab.vue";
import { createReviewBasic, createReviewDetail } from "@/mock/review";
import type { ReviewSection, ReviewItemData } from "@/types/review";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id ?? "1");

const basic = createReviewBasic(id);
const sections = ref<ReviewSection[]>(createReviewDetail(id));
const stage = ref<"list" | "info">("list");

function reviewedOf(sec: ReviewSection) {
  return sec.items.filter((it: ReviewItemData) => it.result !== null).length;
}
const remaining = computed(() =>
  sections.value.reduce((n, s) => n + s.items.filter((it) => it.result === null).length, 0),
);

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
function onTransfer() { showToast("转办"); }
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
.page { display: flex; flex-direction: column; height: 100%; background: #f3f3f5; }
.nav-right { color: #007bfe; font-size: 15px; font-weight: 600; }
.scroll { flex: 1; overflow-y: auto; }
.scroll--pad { padding-bottom: 12px; }
.card-wrap { padding: 12px 16px 4px; }
.section { margin-top: 8px; }
.section__head { display: flex; align-items: baseline; gap: 4px; padding: 10px 16px 6px; }
.section__title { font-size: 18px; line-height: 26px; font-weight: 600; color: #2f2d33; }
.section__count { font-size: 14px; color: #a7a5b0; }
.section__body { padding: 0 16px; }
.bottom-bar {
  flex-shrink: 0; display: flex; align-items: center; gap: 12px;
  padding: 8px 16px calc(8px + env(safe-area-inset-bottom));
  background: #fff; border-top: 1px solid #f3f3f5;
}
.bottom-bar__left { flex-shrink: 0; font-size: 13px; color: #767282; b { color: #eb372a; font-weight: 600; } }
.submit-btn { flex: 1; --van-button-large-height: 50px; --van-button-border-radius: 14px; font-size: 17px; font-weight: 600; }
</style>
