<template>
  <div class="page-layout">
    <AppHeader :title="title" :showBack="showBack">
      <template #action v-if="$slots.headerAction">
        <slot name="headerAction"></slot>
      </template>
    </AppHeader>

    <div class="page-content" :class="contentClass">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';

@Options({
  components: { AppHeader },
  props: {
    title: {
      type: String,
      required: true
    },
    showBack: {
      type: Boolean,
      default: false
    },
    contentClass: {
      type: String,
      default: ''
    }
  }
})
export default class PageLayout extends Vue {}
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding-bottom: 100px; /* Space for bottom navigation */
}
</style>
