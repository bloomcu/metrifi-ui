import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    port: 3000,
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },

  resolve: {
      alias: {
          '@': `${path.resolve(__dirname, 'src')}`,
      }
  },

  plugins: [
    vue(), 
    sentryVitePlugin({
      org: "metrifi",
      project: "metrifi-ui"
    }),
  ],

  // Compile time flags - https://vuejs.org/api/compile-time-flags
  define: {
    // Enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    
    // Enable / disable Options API support. Disabling this will result in smaller bundles, 
    // but may affect compatibility with 3rd party libraries if they rely on Options API.
    __VUE_OPTIONS_API__: 'true',
  },

  build: {
    sourcemap: true
  }
})