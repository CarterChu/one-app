<template>
  <div class="portal">
    <div class="hero">
      <div class="hero__title">飞检管理 · 原型入口</div>
      <div class="hero__sub">ONE App 代理商端 · 两套方案 A/B 测试</div>
    </div>

    <!-- 测试入口 -->
    <section class="grp">
      <div class="grp__head">
        <span class="grp__title">测试入口</span>
        <span class="grp__tag grp__tag--clean">给受访者 · 无切换开关</span>
      </div>
      <div class="cards">
        <div class="ecard" @click="go({})">
          <div class="ecard__main">
            <span class="ecard__k">方案一</span>
            <span class="ecard__d">总览 / 列表式</span>
          </div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
        <div class="ecard" @click="go({ scheme: '2' })">
          <div class="ecard__main">
            <span class="ecard__k">方案二</span>
            <span class="ecard__d">引导 / 向导式</span>
          </div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
      </div>
    </section>

    <!-- 开发入口 -->
    <section class="grp">
      <div class="grp__head">
        <span class="grp__title">开发入口</span>
        <span class="grp__tag grp__tag--dev">带悬浮方案开关 · 随时切换</span>
      </div>
      <div class="cards">
        <div class="ecard ecard--dev" @click="go({ dev: '1' })">
          <div class="ecard__main">
            <span class="ecard__k">方案一</span>
            <span class="ecard__d">总览 / 列表式</span>
          </div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
        <div class="ecard ecard--dev" @click="go({ scheme: '2', dev: '1' })">
          <div class="ecard__main">
            <span class="ecard__k">方案二</span>
            <span class="ecard__d">引导 / 向导式</span>
          </div>
          <van-icon name="arrow" color="#a7a5b0" />
        </div>
      </div>
    </section>

    <!-- 测试数据 -->
    <section class="grp">
      <div class="grp__head">
        <span class="grp__title">测试数据</span>
        <span class="grp__tag">已记录 {{ count }} 条</span>
      </div>
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
import { exportCsv, sessionCount, clearSessions } from "@/stores/tracker";

const router = useRouter();
const count = ref(sessionCount());

function go(query: Record<string, string>) {
  router.push({ name: "inspection-list", query });
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
  padding: calc(24px + env(safe-area-inset-top)) 20px 28px;
  background: linear-gradient(135deg, #007bfe, #37a0ff);
  color: #fff;
}

.hero__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hero__sub {
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.9;
}

.grp {
  margin: 20px 16px 0;
}

.grp__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.grp__title {
  font-size: 16px;
  font-weight: 600;
  color: #2f2d33;
}

.grp__tag {
  font-size: 12px;
  color: #767282;

  &--clean {
    color: #28ba4f;
  }
  &--dev {
    color: #007bfe;
  }
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
  border: 1px solid transparent;

  &--dev {
    border-color: #cfe3ff;
    background: #f5f9ff;
  }
}

.ecard__main {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.data {
  background: #fff;
  border-radius: 12px;
  padding: 4px 0;
}
</style>
