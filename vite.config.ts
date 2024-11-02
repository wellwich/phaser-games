import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'force-full-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.js') || file.endsWith('.vue') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
          server.ws.send({
            type: 'full-reload', // フルリロードをトリガー
            path: '*',
          })
        }
      },
    },
  ],
  server: {
    watch: {
      usePolling: true, // 保存時にファイルの変更をポーリングで確認する
    },
    hmr: {
      overlay: false, // エラー時にオーバーレイを表示しない
      protocol: 'ws', // WebSocketで通信する
    },
  },
})
