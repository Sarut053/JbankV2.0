<template>
  <div class="app-header">
    <div class="left-slot">
      <button v-if="showBack" @click="$router.back()" class="btn-icon">←</button>
      <h2 v-else>{{ title }}</h2>
    </div>
    
    <div class="center-slot" v-if="showBack">
      <h2>{{ title }}</h2>
    </div>

    <div class="right-slot">
      <slot name="action">
         <div class="bell" @click="$router.push('/notification')">
            <svg 
              data-slot="icon" 
              fill="none" 
              stroke-width="1.5" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true"
              class="bell-icon" 
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"></path>
            </svg>
         </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
  props: {
    title: String,
    showBack: { type: Boolean, default: false }
  }
})
export default class AppHeader extends Vue {}
</script>

<style scoped>
.app-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
h2 { margin: 0; font-size: 20px; }
.btn-icon { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }

/* ปรับแต่งปุ่มกระดิ่ง */
.bell { 
  background: var(--bg-card); 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  color: var(--text-main); /* กำหนดสีเส้น SVG ตามสีตัวอักษร */
}

/* 🔥 เพิ่มคลาสนี้เพื่อกำหนดขนาด SVG */
.bell-icon {
  width: 24px;
  height: 24px;
}
</style>