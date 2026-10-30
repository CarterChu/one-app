<template>
  <div class="page">
    <van-nav-bar :title="stage === 'info' ? '基本信息' : '详情'" left-arrow @click-left="onBack" />

    <div v-if="stage === 'info'" class="scroll">
      <RectifyBasicTab :info="basic" />
    </div>

    <div v-else class="scroll scroll--pad">
      <div class="card-wrap"><StationCard :info="basic" @open="stage = 'info'" /></div>

      <div v-for="sec in sections" :key="sec.key" class="section">
        <div class="section__title">{{ sec.title }}</div>
        <div class="section__body">
          <RectifyItem v-for="(it, i) in sec.items" :key="it.id" :item="it" :index="i + 1" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import StationCard from "./execute2/StationCard.vue";
import RectifyItem from "./rectify/RectifyItem.vue";
import RectifyBasicTab from "./rectify/RectifyBasicTab.vue";
import { createRectifyBasic, createRectifyDetail } from "@/mock/rectify";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id ?? "1");

const basic = createRectifyBasic(id);
const sections = createRectifyDetail(id);
const stage = ref<"list" | "info">("list");

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
</script>

<style lang="scss" scoped>
.page { display: flex; flex-direction: column; height: 100%; background: #f3f3f5; }
.scroll { flex: 1; overflow-y: auto; }
.scroll--pad { padding-bottom: 24px; }
.card-wrap { padding: 12px 16px 4px; }
.section__title {
  font-size: 18px; line-height: 26px; font-weight: 600; color: #2f2d33;
  padding: 12px 16px 10px;
}
.section__body { padding: 0 16px; }
</style>
