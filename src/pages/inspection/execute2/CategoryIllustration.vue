<template>
  <div class="illus">
    <div class="illus__canvas" v-html="svg" />
    <div class="illus__cap">{{ cap }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ category: string }>();

// 浅色系:柔和蓝灰线 + 极浅填充,作为弱装饰,不抢上方文字
const L = "#a9b8d6"; // 线
const F = "#eef2fb"; // 面
const C = "#dfe7f6"; // 单元格

// viewBox 240x170,内容内缩到 [30..210]x[28..142],不触边、不溢出
const SVGS: Record<string, string> = {
  bracket: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <line x1="40" y1="140" x2="200" y2="140"/>
    <line x1="52" y1="146" x2="60" y2="140"/><line x1="70" y1="146" x2="78" y2="140"/><line x1="176" y1="146" x2="184" y2="140"/>
    <line x1="92" y1="112" x2="92" y2="140"/>
    <line x1="170" y1="62" x2="170" y2="140"/>
    <line x1="92" y1="140" x2="170" y2="62"/>
    <g fill="${F}">
      <path d="M78 104 L168 52 L176 64 L86 116 Z"/>
    </g>
    <path d="M78 104 L168 52 L176 64 L86 116 Z"/>
    <g fill="${C}" stroke="none">
      <path d="M78 104 L100.5 91 L108.5 103 L86 116 Z"/>
      <path d="M123 77.5 L145.5 64.5 L153.5 76.5 L131 89.5 Z"/>
    </g>
    <line x1="100.5" y1="91" x2="108.5" y2="103"/>
    <line x1="123" y1="77.5" x2="131" y2="89.5"/>
    <line x1="145.5" y1="64.5" x2="153.5" y2="76.5"/>
  </svg>`,
  module: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <rect x="56" y="36" width="128" height="86" rx="5" fill="${F}"/>
    <rect x="64" y="44" width="112" height="70" rx="2" fill="${C}" stroke="none"/>
    <line x1="101.3" y1="44" x2="101.3" y2="114"/><line x1="138.6" y1="44" x2="138.6" y2="114"/>
    <line x1="64" y1="67.3" x2="176" y2="67.3"/><line x1="64" y1="90.6" x2="176" y2="90.6"/>
    <rect x="56" y="36" width="128" height="86" rx="5"/>
    <line x1="120" y1="122" x2="120" y2="138"/><line x1="96" y1="138" x2="144" y2="138"/>
  </svg>`,
  cable: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <rect x="90" y="46" width="60" height="80" rx="7" fill="${F}"/>
    <rect x="102" y="60" width="36" height="18" rx="2" fill="${C}" stroke="none"/>
    <line x1="102" y1="94" x2="138" y2="94"/><line x1="102" y1="106" x2="128" y2="106"/>
    <path d="M90 92 C58 92 58 58 40 58"/><path d="M150 92 C182 92 182 58 200 58"/>
    <circle cx="40" cy="58" r="5" fill="${F}"/><circle cx="200" cy="58" r="5" fill="${F}"/>
  </svg>`,
  inverter: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <rect x="80" y="34" width="80" height="96" rx="9" fill="${F}"/>
    <rect x="94" y="48" width="52" height="28" rx="3" fill="${C}" stroke="none"/>
    <path d="M100 62 L110 62 L114 54 L120 70 L124 62 L140 62"/>
    <line x1="96" y1="92" x2="144" y2="92"/><line x1="96" y1="102" x2="128" y2="102"/>
    <circle cx="100" cy="118" r="4"/><circle cx="120" cy="118" r="4"/><circle cx="140" cy="118" r="4"/>
  </svg>`,
  meterbox: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <rect x="76" y="32" width="88" height="100" rx="9" fill="${F}"/>
    <rect x="92" y="48" width="56" height="30" rx="3" fill="${C}" stroke="none"/>
    <text x="120" y="70" font-size="17" fill="${L}" stroke="none" text-anchor="middle" font-family="monospace">88.8</text>
    <rect x="92" y="92" width="56" height="26" rx="3"/>
    <line x1="106" y1="92" x2="106" y2="118"/><line x1="120" y1="92" x2="120" y2="118"/><line x1="134" y1="92" x2="134" y2="118"/>
  </svg>`,
  laying: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-linejoin="round" stroke-linecap="round">
    <path d="M40 116 C84 116 84 56 128 56 C172 56 172 116 208 116" stroke="${F}" stroke-width="12"/>
    <path d="M40 116 C84 116 84 56 128 56 C172 56 172 116 208 116" stroke="${L}" stroke-width="2"/>
    <g stroke="${L}" stroke-width="2"><line x1="70" y1="96" x2="80" y2="104"/><line x1="128" y1="56" x2="128" y2="68"/><line x1="176" y1="96" x2="186" y2="104"/></g>
  </svg>`,
  grounding: `<svg viewBox="0 0 240 170" fill="none" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <line x1="120" y1="38" x2="120" y2="92"/>
    <path d="M120 38 L106 52 M120 38 L134 52"/>
    <line x1="120" y1="56" x2="150" y2="56"/><circle cx="150" cy="56" r="4" fill="${F}"/>
    <line x1="88" y1="92" x2="152" y2="92"/>
    <line x1="97" y1="106" x2="143" y2="106"/>
    <line x1="106" y1="120" x2="134" y2="120"/>
    <line x1="114" y1="132" x2="126" y2="132"/>
  </svg>`,
};

const CAPS: Record<string, string> = {
  bracket: "支架系统示意",
  module: "组件安装示意",
  cable: "线缆与汇流示意",
  inverter: "逆变器安装示意",
  meterbox: "表箱安装示意",
  laying: "线缆敷设示意",
  grounding: "接地装置示意",
};

const svg = computed(() => SVGS[props.category] ?? SVGS.module);
const cap = computed(() => CAPS[props.category] ?? "检查示意");
</script>

<style lang="scss" scoped>
.illus {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.illus__canvas {
  width: 100%;
  max-width: 240px;

  :deep(svg) {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
}

.illus__cap {
  margin-top: 8px;
  font-size: 13px;
  color: #c2c0cc;
}
</style>
