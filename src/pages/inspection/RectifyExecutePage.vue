<template>
  <div class="page">
    <van-nav-bar :title="stage === 'info' ? '基本信息' : '执行整改'" left-arrow @click-left="onBack">
      <template v-if="stage === 'list'" #right><span class="nav-right" @click="onTransfer">转办</span></template>
    </van-nav-bar>

    <!-- 基本信息子页 -->
    <div v-if="stage === 'info'" class="scroll">
      <RectifyBasicTab :info="basic" />
    </div>

    <!-- 执行整改主页 -->
    <template v-else>
      <div class="scroll scroll--pad">
        <div class="card-wrap"><StationCard :info="basic" @open="stage = 'info'" /></div>

        <div v-for="sec in sections" :key="sec.key" class="section">
          <div class="section__head">
            <span class="section__title">{{ sec.title }}</span>
            <span class="section__count">({{ doneOf(sec) }}/{{ sec.items.length }})</span>
          </div>
          <div class="section__body">
            <RectifyItem v-for="(it, i) in sec.items" :key="it.id" :item="it" :index="i + 1" />
          </div>
        </div>
      </div>

      <div class="bottom-bar">
        <a-button variant="primary" size="large" class="submit-btn" @click="onSubmit">提交</a-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import StationCard from "./execute2/StationCard.vue";
import RectifyItem from "./rectify/RectifyItem.vue";
import RectifyBasicTab from "./rectify/RectifyBasicTab.vue";
import { createRectifyBasic, createRectifyDetail } from "@/mock/rectify";
import type { RectifySection, RectifyItemData } from "@/types/rectify";

const route = useRoute();
const router = useRouter();
const id = String(route.params.id ?? "1");

const basic = createRectifyBasic(id);
const sections = ref<RectifySection[]>(createRectifyDetail(id));
const stage = ref<"list" | "info">("list");

function doneOf(sec: RectifySection) {
  return sec.items.filter((it: RectifyItemData) => it.rectifyDesc.trim() && it.rectifyImages.length).length;
}

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
function onTransfer() {
  showToast("转办");
}
function onSubmit() {
  const total = sections.value.reduce((n, s) => n + s.items.length, 0);
  const done = sections.value.reduce((n, s) => n + doneOf(s), 0);
  if (done < total) {
    showToast(`还有 ${total - done} 项未填写整改说明/图片`);
    return;
  }
  showToast("提交成功");
  setTimeout(() => router.push({ name: "rectify-list" }), 600);
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
.section__body { background: #fff; padding: 0 16px; }
.bottom-bar {
  flex-shrink: 0; padding: 8px 16px calc(8px + env(safe-area-inset-bottom));
  background: #fff; border-top: 1px solid #f3f3f5;
}
.submit-btn { width: 100%; --van-button-large-height: 50px; --van-button-border-radius: 14px; font-size: 17px; font-weight: 600; }
</style>
