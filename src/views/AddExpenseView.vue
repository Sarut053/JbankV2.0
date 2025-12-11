<template>
  <div class="page-wrapper">
    <AppHeader title="Add Transaction" />
    <div class="content-wrapper form-container">
      
      <div class="inp-group">
        <label>Type</label>
        <div class="type-toggle">
          <button class="toggle-btn" :class="{ 'active-expense': type === 'expense' }" @click="type = 'expense'">Expense</button>
          <button class="toggle-btn" :class="{ 'active-income': type === 'income' }" @click="type = 'income'">Income</button>
        </div>
      </div>

      <div class="inp-group"><label>Date</label><input type="date" v-model="date" class="dark-inp"></div>
      <div class="inp-group">
        <label>Amount</label>
        <input type="text" v-model="formattedAmount" @input="handleAmountInput" class="dark-inp" placeholder="0.00">
      </div>
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
// ✅ Import ExpenseTrackerService - ดึง form และ addTransaction
import * as ExpenseTrackerService from '@/components/ExpenseTrackerService.vue';
const { form, addTransaction } = ExpenseTrackerService;

@Options({ components: { AppHeader } })
export default class AddExpenseView extends Vue {
  date = new Date().toISOString().slice(0, 10);
  formattedAmount = '';

  // สำหรับ v-model binding
  get type() { return form.type; }
  set type(value: 'income' | 'expense') { form.type = value; }

  get title() { return form.name; }
  set title(value: string) { form.name = value; }

  // จัดการ input amount
  handleAmountInput(event: any) {
    const input = event.target.value;
    // ลบทุกอย่างที่ไม่ใช่ตัวเลขและจุดทศนิยม
    const numbers = input.replace(/[^\d.]/g, '');

    // แยกส่วนจุดทศนิยม
    const parts = numbers.split('.');
    let integerPart = parts[0] || '';
    const decimalPart = parts[1];

    // แปลงเป็นตัวเลข
    const numericValue = parseFloat(numbers) || 0;
    form.amount = numericValue;

    // จัดรูปแบบด้วย comma
    if (integerPart) {
      integerPart = parseInt(integerPart).toLocaleString('en-US');
    }

    // สร้างค่าที่จัดรูปแบบแล้ว
    if (decimalPart !== undefined) {
      this.formattedAmount = `${integerPart}.${decimalPart.slice(0, 2)}`;
    } else if (numbers.endsWith('.')) {
      this.formattedAmount = `${integerPart}.`;
    } else {
      this.formattedAmount = integerPart;
    }
  }

  // 🔥 ฟังก์ชันนี้ทำงานตอนเปิดหน้าเว็บ: เช็คว่ามีค่าจากการสแกนส่งมาไหม
  mounted() {
    const scannedAmount = localStorage.getItem('scannedAmount');
    const scannedTitle = localStorage.getItem('scannedTitle');

    if (scannedAmount) {
      const amount = parseFloat(scannedAmount);
      form.amount = amount;
      form.name = scannedTitle || 'Scanned Bill';

      // แสดงค่าที่จัดรูปแบบแล้ว
      this.formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // ล้างค่าทิ้งเพื่อไม่ให้จำซ้ำ
      localStorage.removeItem('scannedAmount');
      localStorage.removeItem('scannedTitle');
    }
  }

  saveExpense() {
    if (!form.name || !form.amount) {
      alert('Please fill in all fields');
      return;
    }

    // ✅ ใช้ addTransaction จาก ExpenseTrackerService (จะใช้ form ที่มีอยู่แล้ว)
    const success = addTransaction();

    if (success) {
      (this as any).$router.push('/');
    } else {
      alert('Failed to add transaction');
    }
  }

  goToScan() { (this as any).$router.push('/scan'); }
}
</script>

<style scoped>
/* Styles ส่วนใหญ่ใช้จาก shared-styles.css แล้ว */
.form-container {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: left;
}

.type-toggle {
  display: flex;
  background: var(--bg-input);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #444;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.active-expense {
  background-color: var(--color-danger);
  color: white;
  font-weight: bold;
}

.active-income {
  background-color: var(--color-success);
  color: white;
  font-weight: bold;
}

.btns {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.save-btn {
  flex: 1;
}

.scan-btn {
  width: 50px;
  background: var(--bg-card);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed #666;
  color: var(--text-muted);
}

.scan-icon {
  width: 24px;
  height: 24px;
}
</style>