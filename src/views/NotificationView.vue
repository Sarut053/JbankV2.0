<template>
  <div>
    <AppHeader title="Notifications" :showBack="true">
      <template #action><span></span></template>
    </AppHeader>

    <div class="list">
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

@Options({ components: { AppHeader, TransactionItem } })
export default class NotificationView extends Vue {
  notifications: any[] = [];

  mounted() {
    this.loadData();
  }

  loadData() {
    const savedData = localStorage.getItem('myTransactions');
    if (savedData) {
      // ดึงข้อมูลมาทั้งหมด (หรือจะ slice(0, 10) เอาแค่ 10 อันล่าสุดก็ได้)
      this.notifications = JSON.parse(savedData);
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
.list {
  padding-top: 10px;
  background-color: var(--bg-primary);
  min-height: 100vh;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}
</style>