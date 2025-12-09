<template>
  <div class="dashboard-page">
    <AppHeader title="Dashboard" />
    
    <div class="content-area">
      <div class="main-card">
        <span class="label">Total Balance</span>
        <h1 class="balance-text">{{ formattedBalance }}</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-wrapper income-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
          </div>
          <span class="stat-label">Income</span>
          <h4 class="stat-value income-text">{{ formattedIncome }}</h4>
        </div>

        <div class="stat-card">
          <div class="icon-wrapper expense-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"></path></svg>
          </div>
          <span class="stat-label">Expense</span>
          <h4 class="stat-value expense-text">{{ formattedExpense }}</h4>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h3>{{ currentMonthName }} Overview</h3>
          
          <div class="chart-actions">
            <div class="calendar-wrapper">
              <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="action-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"></path>
              </svg>
              <input type="month" v-model="currentMonth" class="month-input">
            </div>
          </div>
        </div>

        <div class="chart-body">
          <div class="y-axis">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
          </div>

          <div class="bars-area">
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>

            <div class="bars-container">
              <div class="bar-wrapper">
                <div class="bar income-bar" :style="{ height: incomeHeight + '%' }"></div>
                <span class="bar-label">In</span>
              </div>
              
              <div class="bar-wrapper">
                <div class="bar expense-bar" :style="{ height: expenseHeight + '%' }"></div>
                <span class="bar-label">Ex</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="list-section">
        <h3>Transactions</h3>
        <TransactionItem 
          v-for="(item, index) in currentMonthTransactions" 
          :key="index"
          :title="item.title" 
          :time="item.timeStr" 
          :amount="item.amount" 
          :type="item.type"
        >
          <template #icon>
            <div v-html="item.svg"></div>
          </template>
        </TransactionItem>

        <div v-if="currentMonthTransactions.length === 0" class="empty-state">
          <p>No transactions in this month.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';
import TransactionItem from '@/components/TransactionItem.vue';

@Options({ components: { AppHeader, TransactionItem } })
export default class DashboardView extends Vue {
  transactions: any[] = [];
  // ตั้งค่าเริ่มต้นเป็นเดือนปัจจุบัน
  currentMonth: string = new Date().toISOString().slice(0, 7); 

  mounted() {
    const savedData = localStorage.getItem('myTransactions');
    if (savedData) {
      this.transactions = JSON.parse(savedData);
    }
  }

  // กรองรายการตามเดือนที่เลือก
  get currentMonthTransactions() {
    return this.transactions
      .filter((t: any) => t.date.startsWith(this.currentMonth))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // คำนวณยอดเงินรวมต่างๆ
  get totalIncome() {
    return this.currentMonthTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
  }

  get totalExpense() {
    return this.currentMonthTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
  }

  // คำนวณความสูงกราฟ (เทียบสัดส่วน 100% จากยอดที่มากที่สุด)
  get chartMax() {
    const max = Math.max(this.totalIncome, this.totalExpense);
    return max > 0 ? max : 1; // กันหารด้วย 0
  }

  get incomeHeight() {
    return (this.totalIncome / this.chartMax) * 80; // สูงสุด 80% ของพื้นที่กราฟ
  }

  get expenseHeight() {
    return (this.totalExpense / this.chartMax) * 80;
  }

  // ชื่อเดือนแบบเต็ม
  get currentMonthName() {
    if (!this.currentMonth) return '';
    const date = new Date(this.currentMonth + '-01');
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  formatMoney(num: number) {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get formattedBalance() { return this.formatMoney(this.totalIncome - this.totalExpense); }
  get formattedIncome() { return this.formatMoney(this.totalIncome); }
  get formattedExpense() { return this.formatMoney(this.totalExpense); }
}
</script>

<style scoped>
.dashboard-page { padding-bottom: 100px; }
.content-area { padding: 0 20px; }

/* Main Card */
.main-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.label { color: var(--text-muted); font-size: 14px; }
.balance-text { font-size: 32px; color: var(--text-main); margin: 5px 0 0 0; }

/* Stats Grid */
.stats-grid { display: flex; gap: 15px; margin-bottom: 25px; }
.stat-card {
  flex: 1;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.icon-wrapper { width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.icon-wrapper svg { width: 18px; height: 18px; }
.income-icon { border: 1px solid var(--color-success); color: var(--color-success); }
.expense-icon { border: 1px solid var(--color-danger); color: var(--color-danger); }
.stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.stat-value { font-size: 16px; margin: 0; }
.income-text { color: var(--color-success); }
.expense-text { color: var(--color-danger); }

/* Chart Section */
.chart-section {
  background: var(--bg-card);
  border-radius: 30px;
  padding: 20px;
  margin-bottom: 25px;
}
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.chart-header h3 { margin: 0; font-size: 16px; color: var(--text-main); }

/* 🔥 Calendar Picker Styles */
.calendar-wrapper {
  position: relative;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
}
.action-icon { width: 20px; height: 20px; color: var(--text-main); pointer-events: none; }
.month-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

/* Chart Body */
.chart-body { display: flex; height: 180px; }
.y-axis { 
  display: flex; flex-direction: column; justify-content: space-between; 
  color: var(--text-muted); font-size: 10px; margin-right: 15px; padding-bottom: 20px;
}
.bars-area { flex: 1; position: relative; display: flex; align-items: flex-end; }

.grid-line {
  position: absolute; width: 100%; height: 1px; background: rgba(255,255,255,0.05); border-top: 1px dashed rgba(255,255,255,0.1);
}
.grid-line:nth-child(1) { top: 0%; }
.grid-line:nth-child(2) { top: 33%; }
.grid-line:nth-child(3) { top: 66%; }
.grid-line:nth-child(4) { top: 100%; }

.bars-container {
  display: flex; justify-content: space-around; width: 100%; height: 100%; align-items: flex-end; z-index: 1;
}
.bar-wrapper { width: 40px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.bar { width: 16px; border-radius: 6px 6px 0 0; transition: height 0.5s ease; min-height: 4px; }
.income-bar { background-color: var(--color-success); box-shadow: 0 0 10px rgba(0, 210, 91, 0.4); }
.expense-bar { background-color: var(--color-danger); box-shadow: 0 0 10px rgba(255, 66, 103, 0.4); }
.bar-label { margin-top: 8px; font-size: 12px; color: var(--text-muted); }

/* List */
.list-section h3 { margin: 0 0 15px 0; color: var(--text-main); font-size: 18px; }
.empty-state { text-align: center; padding: 20px; color: var(--text-muted); font-size: 14px; }
</style>