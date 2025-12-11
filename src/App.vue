<template>
  <div id="app-wrapper">
    <!-- ExpenseTrackerService - ไม่มี UI แค่ให้บริการข้อมูล -->
    <ExpenseTrackerService />
    <router-view/>
    <BottomNavigation v-if="!['scan'].includes($route.name)" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BottomNavigation from './components/BottomNavigation.vue';
import ExpenseTrackerService from './components/ExpenseTrackerService.vue';

@Options({
  components: {
    BottomNavigation,
    ExpenseTrackerService
  }
})
export default class App extends Vue {}
</script>

<style>
@import './assets/shared-styles.css';

/* ... (Global Variables สีเดิม คงไว้เหมือนเดิม) ... */
:root {
  --bg-primary: #1E293B;
  --bg-card: #334155;
  --bg-secondary: #1F2030;
  --bg-input: #252636;
  --text-main: #F1F5F9;
  --text-muted: #94A3B8;
  --color-success: #00d25b;
  --color-danger: #ff4267;
  --color-warning: #FFC107;
  --color-primary: #3B82F6;
}

body {
  margin: 0;
  padding: 0;
  background-color: #0f1016; /* สีพื้นหลังรอบนอก */
  display: flex;
  justify-content: center; /* จัดกึ่งกลางแนวนอน */
  align-items: center;     /* 🔥 จัดกึ่งกลางแนวตั้ง */
  min-height: 100vh;
  overflow: hidden;        /* ซ่อน Scrollbar ของ Browser หลัก */
}

#app {
  font-family: 'Segoe UI', sans-serif;
  color: var(--text-main);
  text-align: center;
}

#app-wrapper {
  background-color: var(--bg-primary);
  
  /* 🔥 ฟิกขนาดตายตัว (iPhone 14/15 Pro Max size) */
  width: 430px; 
  height: 932px;
  
  margin: 0 auto;
  position: relative;
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
  
  /* 🔥 เพิ่มความสวยงามให้เหมือนโทรศัพท์ */
  border-radius: 40px; 
  overflow-y: auto; /* ให้ Scroll ได้เฉพาะในกรอบโทรศัพท์ */
  overflow-x: hidden;
  
  /* ซ่อน Scrollbar แต่อยังเลื่อนได้ */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* ซ่อน Scrollbar สำหรับ Chrome, Safari, Opera */
#app-wrapper::-webkit-scrollbar {
  display: none;
}
</style>