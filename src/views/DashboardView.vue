<template>
  <div class="page-wrapper">
    <AppHeader title="Dashboard" />

    <div class="content-wrapper">
      <div class="main-card">
        <span class="label">Total Balance</span>
        <h1 class="balance-text">{{ formattedBalance }}</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card income">
          <div class="icon-wrapper">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Income</span>
            <h4 class="stat-value">{{ formattedIncome }}</h4>
          </div>
        </div>

        <div class="stat-card expense">
          <div class="icon-wrapper">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Expense</span>
            <h4 class="stat-value">{{ formattedExpense }}</h4>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h3>{{ chartTitle }}</h3>

          <div class="chart-actions">
            <div class="view-toggle">
              <button :class="{ active: viewMode === 'weekly' }" @click="viewMode = 'weekly'">W</button>
              <button :class="{ active: viewMode === 'monthly' }" @click="viewMode = 'monthly'">M</button>
            </div>
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

            <div class="bars-container" :class="'view-' + viewMode">
              <div class="bar-group" v-for="(item, index) in chartData" :key="index">
                <div class="bars-wrapper">
                  <div class="bar income-bar" :style="{ height: item.incomeHeight + '%' }"></div>
                  <div class="bar expense-bar" :style="{ height: item.expenseHeight + '%' }"></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="list-wrapper">
        <div class="section-header">
          <h3>Transactions</h3>
        </div>
        <div class="transactions-list">
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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';
import TransactionItem from '@/components/TransactionItem.vue';
// ✅ Import ExpenseTrackerService
import * as ExpenseTrackerService from '@/components/ExpenseTrackerService.vue';
const { transactions } = ExpenseTrackerService;

const defaultIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`;

@Options({ components: { AppHeader, TransactionItem } })
export default class DashboardView extends Vue {
  // ตั้งค่าเริ่มต้นเป็นเดือนปัจจุบัน
  currentMonth: string = new Date().toISOString().slice(0, 7);
  viewMode: 'daily' | 'weekly' | 'monthly' = 'weekly';

  // ✅ ใช้ transactions จาก ExpenseTrackerService
  get allTransactions() {
    return transactions.map((t: any) => {
      const isoDate = this.parseThaiDate(t.date);
      return {
        title: t.name,
        date: isoDate,
        timeStr: t.date,
        amount: `$${t.amount.toFixed(2)}`,
        type: t.type,
        svg: defaultIcon
      };
    });
  }

  parseThaiDate(thaiDateStr: string): string {
    try {
      const parts = thaiDateStr.split('/');
      if (parts.length !== 3) {
        return new Date().toISOString().slice(0, 10);
      }

      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      const gregorianYear = year > 2400 ? year - 543 : year;

      return `${gregorianYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error parsing date:', thaiDateStr, error);
      return new Date().toISOString().slice(0, 10);
    }
  }

  // กรองรายการตามเดือนที่เลือก
  get currentMonthTransactions() {
    return this.allTransactions
      .filter((t: any) => t.date.startsWith(this.currentMonth))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // คำนวณยอดเงินรวมต่างๆ
  get totalIncome() {
    return this.currentMonthTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
  }

  get totalExpense() {
    return this.currentMonthTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
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

  // ชื่อกราฟตามโหมด
  get chartTitle() {
    const monthName = this.currentMonthName;
    if (this.viewMode === 'weekly') return `${monthName} - Weekly`;
    return `${monthName} - Monthly`;
  }

  // ข้อมูลกราฟตามโหมดที่เลือก
  get chartData() {
    if (this.viewMode === 'weekly') return this.weeklyData;
    return this.monthlyData;
  }

  // คำนวณข้อมูลรายอาทิตย์ (แสดง 4 อาทิตย์)
  get weeklyData() {
    const weeks = [
      { start: 1, end: 7, label: 'W1', income: 0, expense: 0 },
      { start: 8, end: 14, label: 'W2', income: 0, expense: 0 },
      { start: 15, end: 21, label: 'W3', income: 0, expense: 0 },
      { start: 22, end: 31, label: 'W4', income: 0, expense: 0 }
    ];

    this.currentMonthTransactions.forEach((t: any) => {
      const day = parseInt(t.date.slice(8, 10));
      const amount = parseFloat(t.amount.replace(/[$,]/g, ''));

      weeks.forEach(week => {
        if (day >= week.start && day <= week.end) {
          if (t.type === 'income') week.income += amount;
          else week.expense += amount;
        }
      });
    });

    return this.calculateHeights(weeks);
  }

  // คำนวณข้อมูลรายเดือน (แสดง 6 เดือนย้อนหลัง)
  get monthlyData() {
    const months: any[] = [];
    const [year, month] = this.currentMonth.split('-').map(Number);

    for (let i = 5; i >= 0; i--) {
      let m = month - i;
      let y = year;

      if (m <= 0) {
        m += 12;
        y -= 1;
      }

      const monthKey = `${y}-${String(m).padStart(2, '0')}`;
      const monthLabel = new Date(y, m - 1).toLocaleString('en-US', { month: 'short' });

      const monthTransactions = this.allTransactions.filter((t: any) =>
        t.date.startsWith(monthKey)
      );

      const income = monthTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);

      const expense = monthTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);

      months.push({ label: monthLabel, income, expense });
    }

    return this.calculateHeights(months);
  }

  // คำนวณความสูงของแท่งกราฟ
  calculateHeights(data: any[]) {
    const maxAmount = Math.max(
      ...data.map(d => Math.max(d.income, d.expense)),
      1
    );

    return data.map(d => ({
      label: d.label,
      incomeHeight: (d.income / maxAmount) * 80,
      expenseHeight: (d.expense / maxAmount) * 80
    }));
  }
}
</script>

<style scoped>
/* Styles ส่วนใหญ่ใช้จาก shared-styles.css แล้ว */

/* Chart Section */
.chart-section {
  background: var(--bg-card);
  border-radius: 30px;
  padding: 20px;
  margin-bottom: 25px;
}
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.chart-header h3 { margin: 0; font-size: 16px; color: var(--text-main); }

/* Chart Actions */
.chart-actions { display: flex; gap: 10px; align-items: center; }

/* View Toggle */
.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.view-toggle button {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.view-toggle button.active {
  background: var(--color-primary);
  color: white;
}

/* Calendar Picker Styles */
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
  overflow-x: auto;
  padding: 0 5px;
}

/* Bar Group for Multiple Bars */
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 35px;
  height: 100%;
  position: relative;
}

.bars-wrapper {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}

.bar {
  width: 10px;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
  min-height: 4px;
}

.income-bar {
  background-color: var(--color-success);
  box-shadow: 0 0 8px rgba(0, 210, 91, 0.4);
}

.expense-bar {
  background-color: var(--color-danger);
  box-shadow: 0 0 8px rgba(255, 66, 103, 0.4);
}

.bar-label {
  margin-top: 8px;
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Different widths for different views */
.view-weekly .bar-group { min-width: 60px; }
.view-monthly .bar-group { min-width: 45px; }

.view-weekly .bar { width: 14px; }
.view-monthly .bar { width: 10px; }

/* List */
.list-section {
  margin-top: 25px;
}
</style>