<template>
  <div style="display: none;">
    <!-- Component นี้ไม่มี UI แค่ให้บริการ ExpenseTracker -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

/* ---------------- TYPES ---------------- */
export interface Transaction {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface TransactionForm {
  name: string;
  amount: number;
  type: 'income' | 'expense';
}

/* ---------------- STORAGE HELPERS ---------------- */
const STORAGE_KEY = 'transactions';

const getDefaultData = (): Transaction[] => {
  // เริ่มต้นด้วยข้อมูลว่าง
  return [];
};

const loadData = (): Transaction[] => {
  try {
    // ลบข้อมูลเก่าที่ใช้ key เก่า (myTransactions)
    const oldData = localStorage.getItem('myTransactions');
    if (oldData) {
      console.log('Found old data with key "myTransactions", removing...');
      localStorage.removeItem('myTransactions');
    }

    // โหลดข้อมูลจาก key ใหม่
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    } else {
      // ถ้ายังไม่มีข้อมูล ให้เริ่มด้วยข้อมูลเปล่า
      return [];
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

const saveData = (data: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

/* ---------------- GLOBAL STATE ---------------- */
export const transactions = reactive<Transaction[]>(loadData());

export const form = reactive<TransactionForm>({
  name: '',
  amount: 0,
  type: 'expense',
});

/* ---------------- COMPUTED PROPERTIES ---------------- */
export const totalBalance = computed(() =>
  transactions.reduce(
    (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
    0
  )
);

export const totalIncome = computed(() =>
  transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
);

export const totalExpense = computed(() =>
  transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
);

export const recentTransactions = computed(() =>
  [...transactions].reverse().slice(0, 10)
);

/* ---------------- ACTIONS ---------------- */
export const addTransaction = (data?: Partial<TransactionForm>): boolean => {
  const transactionData = data || form;

  if (!transactionData.name || !transactionData.amount) {
    return false;
  }

  const newTransaction: Transaction = {
    name: transactionData.name,
    amount: Number(transactionData.amount),
    type: transactionData.type || 'expense',
    date: new Date().toLocaleDateString('th-TH'),
  };

  transactions.push(newTransaction);
  saveData(transactions);

  // Reset form if no data provided (using global form)
  if (!data) {
    form.name = '';
    form.amount = 0;
    form.type = 'expense';
  }

  return true;
};

export const deleteTransaction = (index: number): void => {
  if (index >= 0 && index < transactions.length) {
    transactions.splice(index, 1);
    saveData(transactions);
  }
};

export const clearTransactions = (): void => {
  transactions.length = 0;
  saveData([]);
};

export const updateForm = (field: keyof TransactionForm, value: any): void => {
  (form as any)[field] = value;
};

export default defineComponent({
  name: 'ExpenseTrackerService',
});
</script>

<style scoped>
/* ไม่มี style เพราะไม่มี UI */
</style>
