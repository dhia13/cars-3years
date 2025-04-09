import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': {
        target: mode === 'development' 
          ? 'http://localhost:5001'
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


