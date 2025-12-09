<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item">
      <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="nav-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
      </svg>
    </router-link>

    <router-link to="/dashboard" class="nav-item">
      <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="nav-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"></path>
      </svg>
    </router-link>

    <router-link to="/add" class="nav-item add-btn">
      <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="nav-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
      </svg>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class BottomNavigation extends Vue {}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  
  /* 🔥 ปรับให้ชิดล่างสุด */
  bottom: 0; 
  
  width: 100%;
  max-width: 430px; 
  height: 75px;
  background: var(--bg-secondary);
  display: flex; justify-content: space-around; align-items: center;
  
  /* 🔥 โค้งเฉพาะมุมบนซ้าย-ขวา ให้เข้ากับดีไซน์ชิดล่าง */
  border-radius: 20px 20px 0 0; 
  
  z-index: 100;
  left: 50%; transform: translateX(-50%);
  
  /* เงาด้านบนนิดหน่อยให้ดูมีมิติ */
  box-shadow: 0 -5px 20px rgba(0,0,0,0.3);
}

.nav-item {
  text-decoration: none; opacity: 0.5; cursor: pointer; color: #666;
  display: flex; align-items: center; justify-content: center;
}
.nav-item.router-link-active { opacity: 1; color: var(--text-main); }

.nav-icon {
  width: 28px;
  height: 28px;
}

.add-btn {
  background: transparent;
  box-shadow: none;
  margin-bottom: 0; 
  color: #666; 
  opacity: 0.5;
}

.add-btn.router-link-active {
  color: var(--text-main);
  opacity: 1 !important;
}
</style>