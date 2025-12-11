<template>
  <div class="balance-wrapper">
    <div class="main-card">
      <p>Total Balance</p>
      <h1>{{ balance }}</h1>
    </div>

    <div class="stats-row">
      
      <div class="stat-box income">
        <div class="icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="action-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
          </svg>
        </div>
        <div>
          <p>Income</p>
          <h4>{{ income }}</h4>
        </div>
      </div>

      <div class="stat-box expense">
        <div class="icon-box">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="action-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"></path>
          </svg>
        </div>
        <div>
          <p>Expense</p>
          <h4>{{ expense }}</h4>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
  props: ['balance', 'income', 'expense']
})
export default class BalanceCard extends Vue {}
</script>

<style scoped>
/* Styles ส่วนใหญ่ใช้จาก shared-styles.css แล้ว */
.balance-wrapper {
  margin: 0 20px 20px 20px;
}
</style>