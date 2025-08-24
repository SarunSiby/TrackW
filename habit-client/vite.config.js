import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // ✅ Allow Netlify preview & production hosts
        allowedHosts: [
            'trackw.netlify.app',                // main Netlify site
            'devserver-main--trackw.netlify.app' // Netlify preview server
        ]
    },
    build: {
        outDir: 'dist' // ensures build output goes to "dist" (Netlify default)
    },
    base: '/', // important for Netlify to resolve assets correctly
})
