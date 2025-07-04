import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // host: '192.168.10.11',
    // host: '192.168.40.11',
    host: "0.0.0.0",
    port: 3001,
  },
});
