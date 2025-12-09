<template>
  <div class="home">
    <AppHeader title="Hi, Welcome Back" />
    
    <BalanceCard 
      :balance="formattedBalance" 
      :income="formattedIncome" 
      :expense="formattedExpense"
    />

    <div class="list-container">
      <div class="list-head">
        <h3>{{ displayMonthName }}</h3>
        
        <div class="calendar-wrapper">
          <svg 
            data-slot="icon" 
            fill="none" 
            stroke-width="1.5" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-hidden="true"
            class="calendar-svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"></path>
          </svg>
          
          <input type="month" v-model="currentMonth" class="month-input">
        </div>
      </div>
      
      <div class="scroll-area">
        <TransactionItem 
          v-for="(item, index) in filteredTransactions" 
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

        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <p>No transactions found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';
import BalanceCard from '@/components/BalanceCard.vue';
import TransactionItem from '@/components/TransactionItem.vue';

// 🔥 ไอคอน Money ที่ใช้ทั้งแอป
const defaultIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`;

@Options({ components: { AppHeader, BalanceCard, TransactionItem } })
export default class HomeView extends Vue {
  currentMonth: string = new Date().toISOString().slice(0, 7);
  allTransactions: any[] = [];

  mounted() {
    this.loadData();
  }

  loadData() {
    const savedData = localStorage.getItem('myTransactions');
    if (savedData) {
      this.allTransactions = JSON.parse(savedData);
    } else {
      // ข้อมูล Mock Data ตั้งต้น
      this.allTransactions = [
        { title: 'Dinner', date: '2024-04-30', timeStr: '18:27 - April 30', amount: '$26.00', type: 'expense', svg: defaultIcon },
        { title: 'Salary', date: '2024-04-01', timeStr: '09:00 - April 01', amount: '$4,000.00', type: 'income', svg: defaultIcon },
        { title: 'Bonus', date: '2024-04-15', timeStr: '10:00 - April 15', amount: '$500.00', type: 'income', svg: defaultIcon },
      ];
      localStorage.setItem('myTransactions', JSON.stringify(this.allTransactions));
    }
  }

  get filteredTransactions() {
    return this.allTransactions
      .filter((t: any) => t.date.startsWith(this.currentMonth))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get displayMonthName() {
    if (!this.currentMonth) return 'All Transactions';
    const date = new Date(this.currentMonth + '-01');
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  // --- คำนวณยอดเงิน ---
  parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/[$,]/g, ''));
  }

  get totalIncome() {
    return this.filteredTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + this.parseAmount(t.amount), 0);
  }

  get totalExpense() {
    return this.filteredTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + this.parseAmount(t.amount), 0);
  }

  get totalBalance() {
    return this.totalIncome - this.totalExpense;
  }

  formatMoney(num: number) {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get formattedIncome() { return this.formatMoney(this.totalIncome); }
  get formattedExpense() { return this.formatMoney(this.totalExpense); }
  get formattedBalance() { return this.formatMoney(this.totalBalance); }
}
</script>

<style scoped>
.home { width: 100%; max-width: 414px; margin: 0 auto; box-sizing: border-box; }
.list-container { background: var(--bg-secondary); border-radius: 30px 30px 0 0; padding-top: 20px; min-height: 500px; padding-bottom: 100px; }
.list-head { display: flex; justify-content: space-between; align-items: center; padding: 0 20px 10px 20px; }
h3 { margin: 0; color: var(--text-main); font-size: 18px; }

.calendar-wrapper {
  position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer;
}
.calendar-svg { width: 20px; height: 20px; color: var(--text-main); pointer-events: none; }
.month-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
</style>