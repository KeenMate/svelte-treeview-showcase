import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors for favicon and other missing resources
				if (path.includes('favicon') || path === '/api' || path === '/examples' || path === '/playground') {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;