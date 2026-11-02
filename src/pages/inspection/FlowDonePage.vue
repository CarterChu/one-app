<template>
  <div class="done-page">
    <StatusBar />
    <div class="done-hero">
      <svg viewBox="0 0 64 64" width="64" height="64" class="done-icon">
        <circle cx="32" cy="32" r="32" fill="#28ba4f" />
        <path d="M18 33 L27 42 L46 22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="done-title">整体流程已完成</div>
      <div class="done-sub">飞检 → 整改 → 复验 · 三阶段数据贯通</div>
    </div>

    <div class="stage-list">
      <!-- 飞检 -->
      <div class="stage-card">
        <div class="stage-card__head">
          <div class="stage-badge stage-badge--inspect">飞检</div>
          <div class="stage-card__title">飞检完成</div>
        </div>
        <div class="stage-card__body">
          <div class="stat-row">
            <span class="stat-row__k">检查项总数</span>
            <span class="stat-row__v">{{ summary.inspectTotal }} 项</span>
          </div>
          <div class="stat-row">
            <span class="stat-row__k">发现缺陷</span>
            <span class="stat-row__v stat-row__v--warn">{{ summary.defectCount }} 项不合格</span>
          </div>
        </div>
      </div>

      <div class="flow-arrow">↓</div>

      <!-- 整改 -->
      <div class="stage-card">
        <div class="stage-card__head">
          <div class="stage-badge stage-badge--rectify">整改</div>
          <div class="stage-card__title">整改完成</div>
        </div>
        <div class="stage-card__body">
          <div class="stat-row">
            <span class="stat-row__k">整改缺陷项</span>
            <span class="stat-row__v">{{ summary.rectifyCount }} 项</span>
          </div>
          <div class="stat-row">
            <span class="stat-row__k">整改状态</span>
            <span class="stat-row__v stat-row__v--ok">整改说明已提交</span>
          </div>
        </div>
      </div>

      <div class="flow-arrow">↓</div>

      <!-- 复验 -->
      <div class="stage-card">
        <div class="stage-card__head">
          <div class="stage-badge stage-badge--review">复验</div>
          <div class="stage-card__title">复验完成</div>
        </div>
        <div class="stage-card__body">
          <div class="stat-row">
            <span class="stat-row__k">复验通过</span>
            <span class="stat-row__v stat-row__v--ok">{{ summary.reviewPass }} 项</span>
          </div>
          <div class="stat-row" v-if="summary.reviewFail > 0">
            <span class="stat-row__k">仍不合格</span>
            <span class="stat-row__v stat-row__v--warn">{{ summary.reviewFail }} 项(需再整改)</span>
          </div>
          <div class="stat-row" v-else>
            <span class="stat-row__k">整改结果</span>
            <span class="stat-row__v stat-row__v--ok">全部通过</span>
          </div>
        </div>
      </div>
    </div>

    <div class="done-footer">
      <a-button variant="primary" size="large" class="done-btn" @click="goHome">返回首页</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import StatusBar from "./components/StatusBar.vue";
import { getFlowSummary } from "@/stores/flow";

const router = useRouter();
const summary = computed(() => getFlowSummary());

function goHome() {
  router.push({ name: "home" });
}
</script>

<style lang="scss" scoped>
.done-page {
  min-height: 100dvh;
  background: #f3f3f5;
  display: flex;
  flex-direction: column;
}

.done-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 32px;
  background: #fff;
}

.done-icon { margin-bottom: 16px; }

.done-title {
  font-size: 22px;
  font-weight: 700;
  color: #2f2d33;
  margin-bottom: 8px;
}

.done-sub {
  font-size: 13px;
  color: #767282;
}

.stage-list {
  flex: 1;
  padding: 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.flow-arrow {
  text-align: center;
  font-size: 20px;
  color: #a7a5b0;
  line-height: 36px;
}

.stage-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.stage-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.stage-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  flex-shrink: 0;

  &--inspect { color: #007bfe; background: #e8f2ff; }
  &--rectify { color: #fa9607; background: #fff7e0; }
  &--review { color: #28ba4f; background: #edfff3; }
}

.stage-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.stage-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-row__k {
  font-size: 14px;
  color: #767282;
}

.stat-row__v {
  font-size: 14px;
  font-weight: 500;
  color: #2f2d33;

  &--ok { color: #28ba4f; }
  &--warn { color: #fa9607; }
}

.done-footer {
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
}

.done-btn {
  width: 100%;
  --van-button-large-height: 50px;
  --van-button-border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
}
</style>
