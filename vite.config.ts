import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
		  '/notification_datas': {
			target: 'https://localhost:7233',
			changeOrigin: true,
			secure: false,
		  },
		  '/users': {
			target: 'https://localhost:7233',
			changeOrigin: true,
			secure: false,
		  },
		  '/notification_types': {
			target: 'https://localhost:7233',
			changeOrigin: true,
			secure: false,
		  },
		  '/patterns': {
			target: 'https://localhost:7233',
			changeOrigin: true,
			secure: false,
		  }
		}
	  }
});
