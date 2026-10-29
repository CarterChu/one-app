<template>
  <div class="ins-card">
    <!-- 头部:业主姓名 + 状态标签 -->
    <div class="ins-card__head">
      <span class="ins-card__name">{{ item.ownerName }}</span>
      <span class="status-tag" :class="statusClass">{{ item.status }}</span>
    </div>

    <!-- 字段区 -->
    <div class="ins-card__fields">
      <div class="field">
        <span class="field__label">电站编号</span>
        <span class="field__link">{{ item.stationNo }}</span>
        <span class="field__icon" @click.stop="onCopy">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <rect x="5" y="5" width="8.5" height="9" rx="1.6" fill="none" stroke="#767282" stroke-width="1.2" />
            <path d="M10.5 5V3.6A1.6 1.6 0 0 0 8.9 2H3.6A1.6 1.6 0 0 0 2 3.6v6.3A1.6 1.6 0 0 0 3.6 11.5H5" fill="none" stroke="#767282" stroke-width="1.2" />
          </svg>
        </span>
      </div>

      <div class="field">
        <span class="field__label">电站地址</span>
        <span class="field__value field__value--addr">{{ item.address }}</span>
        <span class="field__icon field__icon--nav" @click.stop="onNavigate">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M13.7358 1.6374C13.4692 1.54833 13.224 1.61364 13.1123 1.64608C12.9891 1.68186 12.8437 1.73864 12.7037 1.79332L2.61931 5.7287C2.46268 5.78979 2.30522 5.8512 2.18253 5.91187C2.07878 5.96317 1.83365 6.08796 1.69579 6.35334C1.54653 6.64065 1.54673 6.9827 1.69633 7.26984C1.83451 7.53505 2.07978 7.65955 2.18359 7.71073C2.30635 7.77125 2.46387 7.83248 2.62057 7.89339L6.57077 9.42957L8.10697 13.3798C8.16787 13.5365 8.2291 13.694 8.28962 13.8168C8.3408 13.9206 8.4653 14.1658 8.73051 14.304C9.01765 14.4536 9.3597 14.4538 9.64701 14.3046C9.91238 14.1667 10.0372 13.9216 10.0885 13.8178C10.1491 13.6951 10.2106 13.5377 10.2716 13.3811L14.207 3.29664C14.2617 3.15661 14.3185 3.01121 14.3543 2.88802C14.3867 2.77634 14.452 2.53116 14.3629 2.26452C14.2641 1.96855 14.0318 1.73628 13.7358 1.6374Z" fill="#007bfe" />
          </svg>
        </span>
      </div>

      <div class="field">
        <span class="field__label">飞检日期</span>
        <span class="field__value">{{ item.inspectDate }}</span>
      </div>

      <div class="field" v-if="item.defects">
        <span class="field__label">缺陷统计</span>
        <span class="defects">
          <span class="defect-tag" :class="defectClass('cr', item.defects.cr)">CR {{ item.defects.cr }}</span>
          <span class="defect-tag" :class="defectClass('ma', item.defects.ma)">MA {{ item.defects.ma }}</span>
          <span class="defect-tag" :class="defectClass('mi', item.defects.mi)">MI {{ item.defects.mi }}</span>
        </span>
      </div>

      <div class="field" v-if="item.rectifyStatus">
        <span class="field__label">整改状态</span>
        <span class="field__value">
          {{ item.rectifyStatus }}
          <template v-if="item.rectifyStatus === '整改中' && item.rectifyProgress">
            {{ item.rectifyProgress }}
          </template>
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="ins-card__actions">
      <button type="button" class="act-btn act-btn--detail" @click="$emit('detail', item)">详情</button>
      <button
        v-if="item.status === '待检查'"
        type="button"
        class="act-btn act-btn--exec"
        @click="$emit('execute', item)"
      >
        执行飞检
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { showToast } from "a-design-h5";
import type { Inspection } from "@/types/inspection";

const props = defineProps<{ item: Inspection }>();
defineEmits<{
  (e: "detail", item: Inspection): void;
  (e: "execute", item: Inspection): void;
}>();

const statusClass = computed(() => {
  switch (props.item.status) {
    case "待检查":
      return "status-tag--pending";
    case "通过":
      return "status-tag--pass";
    case "不通过":
      return "status-tag--fail";
    default:
      return "";
  }
});

function defectClass(kind: "cr" | "ma" | "mi", count: number) {
  return count > 0 ? `defect-tag--${kind}` : "defect-tag--zero";
}

function onCopy() {
  const text = props.item.stationNo;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast("已复制"));
  } else {
    showToast("已复制");
  }
}

function onNavigate() {
  showToast("打开导航");
}
</script>

<style lang="scss" scoped>
.ins-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.ins-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ins-card__name {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #2f2d33;
}

/* 状态标签:浅色底 + 同色系文字 */
.status-tag {
  font-size: 13px;
  line-height: 20px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;

  &--pending {
    color: #fa9607;
    background: #fff7e0;
  }
  &--pass {
    color: #28ba4f;
    background: #e8ffea;
  }
  &--fail {
    color: #eb372a;
    background: #ffece8;
  }
}

.ins-card__fields {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
}

.field__label {
  color: #767282;
  margin-right: 8px;
  flex-shrink: 0;
}

.field__value {
  color: #2f2d33;
}

.field__link {
  color: #007bfe;
  text-decoration: underline;
}

.field__icon {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
}

.defects {
  display: inline-flex;
  gap: 6px;
}

.defect-tag {
  font-size: 12px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;

  &--cr {
    color: #cb2634;
    background: #fde4e4;
  }
  &--ma {
    color: #a86a16;
    background: #fbe9cf;
  }
  &--mi {
    color: #8a6d0b;
    background: #fbf3cf;
  }
  &--zero {
    color: #a7a5b0;
    background: #f3f3f5;
  }
}

.ins-card__actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.act-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 20px;
  border: 1px solid #cccbd1;
  border-radius: 100px;
  background: #fff;
  font-size: 16px;
  line-height: 24px;
  color: #2f2d33;
  white-space: nowrap;
  cursor: pointer;

  &--exec {
    border-color: #007bfe;
    color: #007bfe;
  }
}
</style>
