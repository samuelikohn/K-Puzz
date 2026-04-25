import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
	return {
		plugins: [react()],
		base: '',
		build: {
			rollupOptions: {
				output: {
					entryFileNames: `main-[hash].js`,
					assetFileNames: `styles-[hash].[ext]`
				}
			}
		}
	}
})