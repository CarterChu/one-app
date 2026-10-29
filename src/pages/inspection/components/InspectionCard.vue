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
            <path d="M14 2 2 7.2l5 1.8 1.8 5L14 2Z" fill="none" stroke="#007bfe" stroke-width="1.3" stroke-linejoin="round" />
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
      <a-button variant="tertiary" size="small" class="act-btn" @click="$emit('detail', item)">详情</a-button>
      <a-button
        v-if="item.status === '待检查'"
        variant="primary"
        size="small"
        class="act-btn"
        @click="$emit('execute', item)"
        >执行飞检</a-button
      >
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
  font-size: 18px;
  font-weight: 600;
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
  gap: 8px;
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

  &--addr {
    flex: 1;
    min-width: 0;
  }
}

.field__link {
  color: #007bfe;
  text-decoration: underline;
}

.field__icon {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  cursor: pointer;

  &--nav {
    margin-left: auto;
  }
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
  gap: 12px;
}

.act-btn {
  flex: 0 0 auto;
  min-width: 72px;
}
</style>
