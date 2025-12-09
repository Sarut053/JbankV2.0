<template>
  <div class="scan-page">
    <AppHeader title="Scan Bill" :showBack="true" />
    <div class="camera-area">
      <img v-if="previewImage" :src="previewImage" class="preview-img" />
      <div v-else class="placeholder">
        <p>Tap the camera button below<br>to take a photo or upload</p>
      </div>
      <div class="frame" v-if="isScanning">
        <div class="scan-line"></div>
      </div>
      <input 
        type="file" 
        ref="fileInput" 
        accept="image/*" 
        capture="environment"
        style="display: none" 
        @change="onFileSelected"
      />
      <div v-if="isScanning" class="loading-overlay">
        <p>Scanning... {{ progress }}%</p>
      </div>
    </div>
    <div class="shutter-area">
      <button class="shutter" @click="triggerUpload" :disabled="isScanning">
        <span v-if="!isScanning">
          <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </span>
      </button>
      <p class="hint-text">Tap to scan</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import Tesseract from 'tesseract.js';

export default defineComponent({
  name: 'ScanBillView',
  components: { AppHeader },
  setup() {
    const isScanning = ref(false);
    const progress = ref(0);
    const previewImage = ref<string | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    function triggerUpload() {
      fileInput.value?.click();
    }

    function onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        isScanning.value = true;
        progress.value = 0;

        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.value = e.target?.result as string;
          processImage(previewImage.value);
        };
        reader.readAsDataURL(file);
      }
    }

    async function processImage(image: string) {
      try {
        const result = await Tesseract.recognize(
          image,
          'eng',
          {
            logger: (m: { status: string; progress: number }) => {
              if (m.status === 'recognizing text') {
                progress.value = Math.floor(m.progress * 100);
              }
            }
          }
        );

        const text = result.data.text;
        console.log('OCR:', text);
        const matches = text.match(/[\d,]+\.\d{2}/g);
        let foundAmount = '';
        if (matches && matches.length > 0) {
          const values = matches.map((v: string) => parseFloat(v.replace(/,/g, '')));
          const maxVal = Math.max(...values);
          foundAmount = maxVal.toString();
        }
        if (foundAmount) {
          localStorage.setItem('scannedAmount', foundAmount);
          localStorage.setItem('scannedTitle', 'Scanned Bill');
          setTimeout(() => {
            alert(`Found Amount: ${foundAmount}`);
            window.location.href = '#/add';
          }, 500);
        } else {
          alert('Could not find amount. Please try again.');
          isScanning.value = false;
        }
      } catch (error) {
        let message = 'Unknown error occurred.';
        if (error && typeof error === 'object' && 'message' in error) {
          message = String((error as { message?: string }).message);
        }
        alert('Error: ' + message);
        isScanning.value = false;
      }
    }

    return {
      isScanning,
      progress,
      previewImage,
      triggerUpload,
      onFileSelected,
      fileInput
    };
  }
});
</script>