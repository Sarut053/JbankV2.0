<template>
  <div class="page-wrapper">
    <AppHeader title="Hi, Welcome Back" />

    <BalanceCard
      :balance="formattedBalance"
      :income="formattedIncome"
      :expense="formattedExpense"
    />

    <div class="list-wrapper">
      <div class="section-header">
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
        <div
          v-for="(item, index) in filteredTransactions"
          :key="index"
          class="transaction-wrapper"
          :class="{ 'selected': selectedIndex === index }"
          @click="toggleSelection(index)"
        >
          <TransactionItem
            :title="item.title"
            :time="item.timeStr"
            :amount="item.amount"
            :type="item.type"
            :showDelete="selectedIndex === index"
          >
            <template #icon>
              <div v-html="item.svg"></div>
            </template>
          </TransactionItem>

          <button
            v-if="selectedIndex === index"
            class="delete-btn"
            @click.stop="deleteTransaction(index)"
          >
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

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
// ✅ Import ExpenseTrackerService
import * as ExpenseTrackerService from '@/components/ExpenseTrackerService.vue';
const { transactions, deleteTransaction: deleteTransactionService } = ExpenseTrackerService;

// 🔥 ไอคอน Money ที่ใช้ทั้งแอป
const defaultIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`;

@Options({ components: { AppHeader, BalanceCard, TransactionItem } })
export default class HomeView extends Vue {
  currentMonth: string = new Date().toISOString().slice(0, 7);
  selectedIndex: number | null = null;

  // ✅ ใช้ transactions จาก ExpenseTrackerService แทน
  get allTransactions() {
    // แปลงข้อมูลจาก ExpenseTrackerService ให้เข้ากับรูปแบบเดิม
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

  // แปลงวันที่ไทย (เช่น "11/12/2568") เป็น ISO (2024-12-11)
  parseThaiDate(thaiDateStr: string): string {
    try {
      // แยกส่วนของวันที่
      const parts = thaiDateStr.split('/');
      if (parts.length !== 3) {
        // ถ้าไม่ใช่รูปแบบวันที่ไทย ให้ return วันที่ปัจจุบัน
        return new Date().toISOString().slice(0, 10);
      }

      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const year = parseInt(parts[2]);

      // แปลงปีไทยเป็นปีคริสต์
      const gregorianYear = year > 2400 ? year - 543 : year;

      return `${gregorianYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error parsing date:', thaiDateStr, error);
      return new Date().toISOString().slice(0, 10);
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

  // --- คำนวณยอดเงินจาก filteredTransactions ---
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

  // Toggle selection
  toggleSelection(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }

  // Delete transaction
  deleteTransaction(filteredIndex: number) {
    // หา index จริงใน transactions array
    const transactionToDelete = this.filteredTransactions[filteredIndex];
    const realIndex = this.allTransactions.findIndex(
      (t: any) => t.title === transactionToDelete.title &&
                  t.date === transactionToDelete.date &&
                  t.amount === transactionToDelete.amount
    );

    if (realIndex !== -1) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        deleteTransactionService(realIndex);
        this.selectedIndex = null;
      }
    }
  }
}
</script>

<style scoped>
/* Styles ส่วนใหญ่ใช้จาก shared-styles.css แล้ว */
</style>