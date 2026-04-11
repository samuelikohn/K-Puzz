import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
	return {
		plugins: [react()],
		build: {
			rollupOptions: {
				output: {
					entryFileNames: `main.js`,
					assetFileNames: `styles.[ext]`
				}
			}
		}
	}
})