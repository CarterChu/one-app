<template>
  <div class="portal">
    <div class="hero">
      <div class="hero__title">飞检管理 · 原型入口</div>
      <div class="hero__sub">ONE App 代理商端 · 飞检 / 整改 / 复验</div>
      <!-- 环境切换 -->
      <div class="env">
        <div class="env__seg" :class="{ 'env__seg--on': env === 'dev' }" @click="setEnv('dev')">开发环境</div>
        <div class="env__seg" :class="{ 'env__seg--on': env === 'test' }" @click="setEnv('test')">测试环境</div>
      </div>
      <div class="env__hint">
        {{ env === "test" ? "测试环境 · 记录数据(CSV)" : "开发环境 · 不记录数据,自由探索" }}
      </div>
    </div>

    <!-- 角色一:飞检 -->
    <section class="grp">
      <div class="grp__head"><span class="grp__role">角色一</span><span class="grp__title">飞检</span></div>
      <div class="cards">
        <div class="ecard" @click="go({})">
          <div class="ecard__main"><span class="ecard__k">方案一</span><span class="ecard__d">总览 / 列表式</span></div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
        <div class="ecard" @click="go({ scheme: '2' })">
          <div class="ecard__main"><span class="ecard__k">方案二</span><span class="ecard__d">引导 / 向导式</span></div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
      </div>
    </section>

    <!-- 角色二:整改 -->
    <section class="grp">
      <div class="grp__head"><span class="grp__role">角色二</span><span class="grp__title">整改</span></div>
      <div class="ecard" @click="goRectify">
        <div class="ecard__main"><span class="ecard__k">进入整改</span><span class="ecard__d">单一方案</span></div>
        <van-icon name="arrow" color="#a7a5b0" />
      </div>
    </section>

    <!-- 角色三:复验 -->
    <section class="grp">
      <div class="grp__head"><span class="grp__role">角色三</span><span class="grp__title">复验</span></div>
      <div class="ecard ecard--soon" @click="soon">
        <div class="ecard__main"><span class="ecard__k">进入复验</span><span class="ecard__d">单一方案</span></div>
        <span class="soon-badge">开发中</span>
      </div>
    </section>

    <!-- 整体流程体验 -->
    <section class="grp">
      <div class="grp__head"><span class="grp__title">整体流程体验</span></div>
      <div class="ecard ecard--soon ecard--flow" @click="soon">
        <div class="ecard__main">
          <span class="ecard__k">飞检(方案二) → 整改 → 复验</span>
          <span class="ecard__d">一个用户串起三个角色的完整流程</span>
        </div>
        <span class="soon-badge">开发中</span>
      </div>
    </section>

    <!-- 测试数据(仅测试环境显示) -->
    <section v-if="env === 'test'" class="grp">
      <div class="grp__head"><span class="grp__title">测试数据</span><span class="grp__tag">已记录 {{ count }} 条</span></div>
      <div class="data">
        <a-button-group type="white-bg">
          <a-button variant="secondary" size="large" :disabled="count === 0" @click="onClear">清空</a-button>
          <a-button variant="primary" size="large" :disabled="count === 0" @click="onExport">导出 CSV</a-button>
        </a-button-group>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "a-design-h5";
import { env, setEnv } from "@/stores/env";
import { exportCsv, sessionCount, clearSessions } from "@/stores/tracker";

const router = useRouter();
const count = ref(sessionCount());

function go(query: Record<string, string>) {
  router.push({ name: "inspection-list", query });
}
function goRectify() {
  router.push({ name: "rectify-list" });
}
function soon() {
  showToast("开发中,敬请期待");
}
function onExport() {
  if (sessionCount() === 0) return;
  exportCsv();
}
function onClear() {
  clearSessions();
  count.value = 0;
  showToast("已清空");
}
</script>

<style lang="scss" scoped>
.portal {
  min-height: 100vh;
  background: #f3f3f5;
  padding: 0 0 40px;
}

.hero {
  padding: calc(22px + env(safe-area-inset-top)) 20px 20px;
  background: linear-gradient(135deg, #007bfe, #37a0ff);
  color: #fff;
}

.hero__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hero__sub {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.9;
}

.env {
  display: flex;
  margin-top: 16px;
  padding: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.env__seg {
  flex: 1;
  text-align: center;
  padding: 7px 0;
  font-size: 13px;
  border-radius: 8px;
  color: #fff;

  &--on {
    background: #fff;
    color: #007bfe;
    font-weight: 600;
  }
}

.env__hint {
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.9;
}

.grp {
  margin: 18px 16px 0;
}

.grp__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.grp__role {
  font-size: 12px;
  color: #fff;
  background: #007bfe;
  padding: 1px 7px;
  border-radius: 6px;
}

.grp__title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.grp__tag {
  font-size: 12px;
  color: #767282;
}

.cards {
  display: flex;
  gap: 12px;
}

.ecard {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-radius: 12px;

  &--soon {
    opacity: 0.85;
  }

  &--flow .ecard__k {
    font-size: 15px;
  }
}

.ecard__main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ecard__k {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.ecard__d {
  font-size: 12px;
  color: #767282;
}

.soon-badge {
  flex-shrink: 0;
  font-size: 12px;
  color: #fa9607;
  background: #fff7e0;
  padding: 2px 8px;
  border-radius: 6px;
}

.data {
  background: #fff;
  border-radius: 12px;
  padding: 4px 0;
  overflow: hidden;
}
</style>
