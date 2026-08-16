import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = env.VITE_API_PROXY || "http://localhost:4000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: apiProxy,
          changeOrigin: true,
        },
        "/uploads": {
          target: apiProxy,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      allowedHosts: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'tiptap';
            }
            if (id.includes('gsap') || id.includes('@gsap') || id.includes('lenis')) {
              return 'motion';
            }
            if (
              /[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
                id,
              )
            ) {
              return 'react';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux';
            }
          },
        },
      },
    },
  };
});
