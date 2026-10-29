<template>
  <div class="dv2">
    <div class="dv2__header">
      <a-nav-bar :title="stage === 'info' ? '基本信息' : '详情'" left-arrow @click-left="onBack" />
    </div>

    <!-- 基本信息二级页 -->
    <BasicInfoTab v-if="stage === 'info'" :info="data.info" />

    <!-- 单页:电站卡 + 全部检查项(只读) -->
    <template v-else>
      <div class="dv2__body">
        <StationCard :info="data.info" @open="stage = 'info'" />
        <section v-for="sec in data.sections" :key="sec.key" class="sec">
          <div class="sec__title">{{ sec.title }}</div>
          <div class="sec__card">
            <ChecklistItem
              v-for="(it, i) in sec.items"
              :key="it.id"
              :item="it"
              :index="i + 1"
              readonly
            />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicInfoTab from "./execute/BasicInfoTab.vue";
import ChecklistItem from "./execute/ChecklistItem.vue";
import StationCard from "./execute2/StationCard.vue";
import { createDetailData } from "@/mock/detailInspection";

const route = useRoute();
const router = useRouter();
const data = createDetailData(String(route.params.id ?? ""));
const stage = ref<"list" | "info">("list");

function onBack() {
  if (stage.value === "info") stage.value = "list";
  else router.back();
}
</script>

<style lang="scss" scoped>
.dv2 {
  min-height: 100vh;
  background: #f7f8fa;
}

.dv2__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
}

.dv2__body {
  padding: 16px;
}

.sec {
  margin-top: 20px;
}

.sec__title {
  font-size: 17px;
  font-weight: 600;
  color: #2f2d33;
  margin-bottom: 10px;
}

.sec__card {
  background: #fff;
  border-radius: 12px;
  padding: 0 16px;
}
</style>
