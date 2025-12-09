const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 🔥 บรรทัดนี้สำคัญ: อนุญาตให้เข้าผ่าน Tunnel ได้
    allowedHosts: 'all',
    client: {
      overlay: false,
    }
  }
})