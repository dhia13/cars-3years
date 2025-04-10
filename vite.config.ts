import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: mode === 'development'
          ? 'https://immersivedigitaldevelopment.fr'
          : 'https://immersivedigitaldevelopment.fr',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: true,
    port: 8080,
    allowedHosts: [
      'immersivedigitaldevelopment.com',
      'immersivedigitaldevelopment.fr',
      'localhost',
    ],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
