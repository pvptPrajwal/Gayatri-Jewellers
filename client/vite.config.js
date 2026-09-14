import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Listen on all network interfaces (0.0.0.0), not just localhost, so
    // other devices on the same WiFi (e.g. your phone) can reach this dev
    // server at http://<your-computer's-LAN-IP>:5173
    host: true,
  },
});
