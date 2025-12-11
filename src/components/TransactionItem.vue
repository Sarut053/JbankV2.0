<template>
  <div class="t-item" :class="{ 'has-delete': showDelete }">
    <div class="t-icon" :class="type">
      <slot name="icon">
        {{ icon }}
      </slot>
    </div>

    <div class="t-info">
      <h4>{{ title }}</h4>
      <p>{{ time }}</p>
    </div>

    <div class="t-amount" :class="type">
      {{ type === 'expense' ? '-' : '+' }}{{ amount }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
  props: {
    title: String,
    time: String,
    amount: String,
    type: String,
    icon: { type: String, default: '💰' },
    showDelete: { type: Boolean, default: false }
  }
})
export default class TransactionItem extends Vue {}
</script>

<style scoped>
.t-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.t-item.has-delete {
  padding-right: 65px;
}

.t-icon {
  width: 45px; height: 45px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-right: 15px;
  font-size: 20px; /* สำหรับ Emoji */
}

/* 🔥 เพิ่ม CSS นี้เพื่อให้ SVG มีขนาดพอดี */
.t-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

/* สีพื้นหลังและไอคอนตามประเภท */
.t-icon.income { color: var(--color-success); background: rgba(0,210,91,0.1); }
.t-icon.expense { color: var(--color-danger); background: rgba(255,66,103,0.1); }

.t-info { flex: 1; text-align: left; }
.t-info h4 { margin: 0; color: var(--text-main); }
.t-info p { margin: 5px 0 0 0; font-size: 12px; color: var(--text-muted); }

.t-amount {
  font-weight: bold;
  transition: all 0.3s ease;
}
.t-amount.income { color: var(--color-success); }
.t-amount.expense { color: var(--color-danger); }
</style>