<template>
  <div>
    <AppHeader title="Add Transaction" />
    <div class="form-container">
      
      <div class="inp-group">
        <label>Type</label>
        <div class="type-toggle">
          <button class="toggle-btn" :class="{ 'active-expense': type === 'expense' }" @click="type = 'expense'">Expense</button>
          <button class="toggle-btn" :class="{ 'active-income': type === 'income' }" @click="type = 'income'">Income</button>
        </div>
      </div>

      <div class="inp-group"><label>Date</label><input type="date" v-model="date" class="dark-inp"></div>
      <div class="inp-group"><label>Amount</label><input type="number" v-model="amount" class="dark-inp" placeholder="0.00"></div>
      <div class="inp-group"><label>Title</label><input type="text" v-model="title" class="dark-inp" placeholder="e.g. Dinner"></div>
      
      <div class="btns">
        <button class="save-btn" @click="saveExpense">Save</button>
        
        <div class="scan-btn" @click="goToScan">
          <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="scan-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';

@Options({ components: { AppHeader } })
export default class AddExpenseView extends Vue {
  // ✅ แก้เป็น (ลบ : string ออก):
type = 'expense';
// date ยังคงไว้ได้ หรือจะลบก็ได้ แต่ตัวอื่น TypeScript มันรู้เองแล้ว
date = new Date().toISOString().substr(0, 10); 
amount = '';
title = '';

  // 🔥 ฟังก์ชันนี้ทำงานตอนเปิดหน้าเว็บ: เช็คว่ามีค่าจากการสแกนส่งมาไหม
  mounted() {
    const scannedAmount = localStorage.getItem('scannedAmount');
    const scannedTitle = localStorage.getItem('scannedTitle');

    if (scannedAmount) {
      this.amount = scannedAmount;
      this.title = scannedTitle || 'Scanned Bill';
      
      // ล้างค่าทิ้งเพื่อไม่ให้จำซ้ำ
      localStorage.removeItem('scannedAmount');
      localStorage.removeItem('scannedTitle');
    }
  }

  saveExpense() {
    if (!this.amount || !this.title) {
      alert('Please fill in all fields');
      return;
    }

    const newTransaction = {
      title: this.title,
      date: this.date,
      timeStr: this.formatDate(this.date),
      amount: '$' + parseFloat(this.amount).toFixed(2),
      type: this.type,
      svg: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`
    };

    const existingData = localStorage.getItem('myTransactions');
    let transactions = existingData ? JSON.parse(existingData) : [];
    
    transactions.unshift(newTransaction);
    localStorage.setItem('myTransactions', JSON.stringify(transactions));

    (this as any).$router.push('/');
  }

  goToScan() { (this as any).$router.push('/scan'); }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = d.getDate();
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${time} - ${month} ${day}`;
  }
}
</script>

<style scoped>
.form-container { padding: 20px; text-align: left; }
.inp-group { margin-bottom: 20px; }
label { display: block; color: var(--text-muted); margin-bottom: 5px; font-size: 14px; }
.dark-inp { width: 100%; background: var(--bg-input); border: 1px solid #444; padding: 15px; border-radius: 12px; color: white; box-sizing: border-box; font-size: 16px;}

.type-toggle { display: flex; background: var(--bg-input); padding: 4px; border-radius: 12px; border: 1px solid #444; }
.toggle-btn { flex: 1; padding: 12px; background: transparent; border: none; color: var(--text-muted); font-size: 16px; cursor: pointer; border-radius: 10px; transition: all 0.3s ease; }
.active-expense { background-color: var(--color-danger); color: white; font-weight: bold; }
.active-income { background-color: var(--color-success); color: white; font-weight: bold; }

.btns { display: flex; gap: 15px; margin-top: 30px; }
.save-btn { flex: 1; background: var(--color-success); border: none; border-radius: 15px; color: white; font-weight: bold; font-size: 16px; padding: 15px; cursor: pointer; }
.scan-btn { width: 50px; background: var(--bg-card); border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px dashed #666; color: var(--text-muted); }
.scan-icon { width: 24px; height: 24px; }
</style>