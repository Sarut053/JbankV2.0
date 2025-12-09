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
        <svg data-slot="icon" fill="none" 
        stroke-width="1.5" stroke="currentColor" 
        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"></path>
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"></path>
</svg></span>
      </button>
      <p class="hint-text">Tap to scan</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AppHeader from '@/components/AppHeader.vue';
import Tesseract from 'tesseract.js';

@Options({ components: { AppHeader } })
export default class ScanBillView extends Vue {
  isScanning = false;
  progress = 0;
  previewImage: string | null = null;

  // สั่งคลิก Input ที่ซ่อนอยู่
  triggerUpload() {
    (this.$refs.fileInput as HTMLInputElement).click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.isScanning = true;
      this.progress = 0;

      // แสดงรูปตัวอย่าง
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string;
        this.processImage(this.previewImage);
      };
      reader.readAsDataURL(file);
    }
  }

  async processImage(image: string) {
    try {
      const result = await Tesseract.recognize(
        image,
        'eng', // อ่านอังกฤษ+ตัวเลข
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              this.progress = Math.floor(m.progress * 100);
            }
          }
        }
      );

      const text = result.data.text;
      console.log("OCR:", text);

      // 🔥 ปรับ Logic หาเงินให้เก่งขึ้น (รองรับคอมม่า เช่น 1,000.00)
      // หาตัวเลขที่มีทศนิยม และอาจมีลูกน้ำคั่น
      const matches = text.match(/[\d,]+\.\d{2}/g);
      let foundAmount = '';
      
      if (matches && matches.length > 0) {
        // แปลง '1,000.00' -> 1000.00 แล้วหาค่ามากสุด
        const values = matches.map(v => parseFloat(v.replace(/,/g, '')));
        const maxVal = Math.max(...values);
        foundAmount = maxVal.toString();
      }

      if (foundAmount) {
        localStorage.setItem('scannedAmount', foundAmount);
        localStorage.setItem('scannedTitle', 'Scanned Bill');
        
        setTimeout(() => {
          alert(`Found Amount: ${foundAmount}`);
          (this as any).$router.push('/add');
        }, 500);
      } else {
        alert("Could not find amount. Please try again.");
        this.isScanning = false;
      }

    } catch (error: any) {
      alert("Error: " + error.message);
      this.isScanning = false;
    }
  }
}
</script>

<style scoped>
.scan-page { height: 100vh; display: flex; flex-direction: column; background: #000; }
.camera-area { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #111; }

.preview-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.placeholder { color: #888; text-align: center; font-size: 16px; }

.frame { 
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 250px; height: 350px; 
  border: 2px solid var(--color-success); border-radius: 20px; 
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5); /* ฉากมืด */
  overflow: hidden; pointer-events: none;
}
.scan-line {
  width: 100%; height: 2px; background: var(--color-success);
  position: absolute; top: 0; animation: scanMove 2s infinite linear;
  box-shadow: 0 0 10px var(--color-success);
}
@keyframes scanMove { 0% { top: 0; opacity: 0; } 100% { top: 100%; opacity: 0; } }

.loading-overlay {
  position: absolute; bottom: 20px;
  background: rgba(0,0,0,0.8); padding: 8px 16px;
  border-radius: 20px; color: white; font-size: 14px;
}

.shutter-area { 
  padding: 30px; background: #000; 
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.shutter { 
  width: 70px; height: 70px; border-radius: 50%; 
  border: 4px solid white; background: rgba(255,255,255,0.1); 
  color: white; font-size: 24px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.hint-text { color: #666; font-size: 12px; margin: 0; }
</style>