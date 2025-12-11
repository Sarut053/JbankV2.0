<template>
  <div class="page-wrapper">
    <AppHeader title="Notifications" :showBack="true">
      <template #action><span></span></template>
    </AppHeader>

    <div class="list-wrapper">
      <TransactionItem
        v-for="(item, index) in notifications"
        :key="index"
        :title="getNotifyTitle(item)"
        :time="item.timeStr"
        :amount="item.amount"
        :type="item.type"
      >
        <template #icon>
          <div v-html="item.svg"></div>
        </template>
      </TransactionItem>

      <div v-if="notifications.length === 0" class="empty-state">
        <p>No notifications yet.</p>
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
const { transactions, recentTransactions } = ExpenseTrackerService;

const defaultIcon = `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`;

@Options({ components: { AppHeader, TransactionItem } })
export default class NotificationView extends Vue {

  // ✅ ใช้ transactions จาก ExpenseTrackerService
  get notifications() {
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
    }).reverse(); // เรียงจากใหม่ไปเก่า
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

  // ฟังก์ชันสร้างข้อความแจ้งเตือนตามประเภท
  getNotifyTitle(item: any) {
    if (item.type === 'expense') {
      return `Paid for ${item.title}`; // ถ้าเป็นรายจ่าย: "จ่ายค่า..."
    } else {
      return `Received ${item.title}`; // ถ้าเป็นรายรับ: "ได้รับ..."
    }
  }
}
</script>

<style scoped>
/* Styles ส่วนใหญ่ใช้จาก shared-styles.css แล้ว */
.list-wrapper {
  background-color: var(--bg-primary);
  border-radius: 0;
  padding-top: 10px;
}
</style>