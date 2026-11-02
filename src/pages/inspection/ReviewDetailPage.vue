<template>
  <div class="page">
    <AppNavBar :title="stage === 'info' ? '基本信息' : '整改复验'" @back="onBack" />

    <div v-if="stage === 'info'" class="scroll">
      <ReviewBasicTab :info="basic" />
    </div>

    <div v-else class="scroll scroll--pad">
      <div class="card-wrap"><StationCard :info="basic" @open="stage = 'info'" /></div>

      <div v-for="sec in sections" :key="sec.key" class="section">
        <div class="section__title">{{ sec.title }}</div>
        <div class="section__body">
          <ReviewItem v-for="(it, i) in sec.items" :key="it.id" :item="it" :index="i + 1" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppNavBar from "./components/AppNavBar.vue";
import StationCard from "./execute2/StationCard.vue";
import ReviewItem from "./review/ReviewItem.vue";
import ReviewBasicTab from "./review/ReviewBasicTab.vue";
import { createReviewBasic, createReviewDetail } from "@/mock/review";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id ?? "1");

const basic = createReviewBasic(id);
const sections = createReviewDetail(id);
const stage = ref<"list" | "info">("list");

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
</script>

<style lang="scss" scoped>
.page { display: flex; flex-direction: column; height: 100dvh; background: #f3f3f5; }
.scroll { flex: 1; overflow-y: auto; }
.scroll--pad { padding-bottom: 24px; }
.card-wrap { padding: 12px 16px 4px; }
.section__title { font-size: 18px; line-height: 26px; font-weight: 600; color: #2f2d33; padding: 12px 16px 10px; }
.section__body { padding: 0 16px; }
</style>
