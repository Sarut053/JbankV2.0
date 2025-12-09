<template>
  <div class="balance-wrapper">
    <div class="main-card">
      <p>Total Balance</p>
      <h1>{{ balance }}</h1>
    </div>

    <div class="stats-row">
      
      <div class="stat-box income">
        <div class="icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="action-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
        </div>
        <div>
          <p>Income</p>
          <h4>{{ income }}</h4>
        </div>
      </div>

      <div class="stat-box expense">
        <div class="icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="action-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"></path>
          </svg>
        </div>
        <div>
          <p>Expense</p>
          <h4>{{ expense }}</h4>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
  props: ['balance', 'income', 'expense']
})
export default class BalanceCard extends Vue {}
</script>

<style scoped>
.balance-wrapper { margin: 0 20px 20px 20px; }

.main-card { 
  background: var(--bg-card); 
  padding: 20px; 
  border-radius: 20px; 
  text-align: center; 
  margin-bottom: 15px; 
  /* เพิ่มเงาเล็กน้อย */
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.main-card h1 { margin: 10px 0 0 0; font-size: 32px; color: var(--text-main); } 
.main-card p { margin: 0; color: var(--text-muted); font-size: 14px; }

.stats-row { display: flex; gap: 15px; }

.stat-box { 
  flex: 1; 
  background: var(--bg-card); 
  padding: 15px; 
  border-radius: 20px; /* ปรับมุมให้โค้งเท่า main-card */
  display: flex; 
  align-items: center; 
  gap: 12px; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.stat-box p { margin: 0; font-size: 12px; color: var(--text-muted); margin-bottom: 4px; text-align: left; } 
.stat-box h4 { margin: 0; font-size: 16px; color: var(--text-main); text-align: left;}

/* สีของ Income */
.income h4 { color: var(--color-success); }
.income .icon-box { 
  color: var(--color-success); 
  background: rgba(0, 210, 91, 0.1); /* พื้นหลังสีเขียวจางๆ */
  border: 1px solid rgba(0, 210, 91, 0.2);
}

/* สีของ Expense */
.expense h4 { color: var(--color-danger); }
.expense .icon-box { 
  color: var(--color-danger); 
  background: rgba(255, 66, 103, 0.1); /* พื้นหลังสีแดงจางๆ */
  border: 1px solid rgba(255, 66, 103, 0.2);
}

.icon-box { 
  width: 40px; 
  height: 40px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 12px; 
}

/* กำหนดขนาด SVG */
.action-icon {
  width: 20px;
  height: 20px;
}
</style>