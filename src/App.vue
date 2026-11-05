<template>
  <router-view />
  <!-- 主持人悬浮按钮：固定在视口右下角，PC 下落在手机框外侧 -->
  <button v-if="!isHostPage" class="host-fab" @click="router.push({ name: 'host' })" title="主持人模式">
    <svg viewBox="0 0 20 20" width="22" height="22" fill="none">
      <circle cx="10" cy="7" r="3.2" stroke="currentColor" stroke-width="1.6"/>
      <path d="M3.5 17c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
    <span>主持</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isHostPage = computed(() => route.name !== "home");
</script>

<style>
.host-fab {
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #2f2d33;
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-family: "PingFang SC", sans-serif;
  justify-content: center;
  opacity: 0.85;
  transition: opacity 0.15s;
}
.host-fab:hover { opacity: 1; }
</style>
