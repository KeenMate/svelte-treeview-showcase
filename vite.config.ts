import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import packageLock from './package-lock.json' with { type: 'json' };

// Get version from package-lock.json (for file: links, version is at the source path)
const treeviewPkg = packageLock.packages['node_modules/@keenmate/svelte-treeview'];
const treeviewVersion = treeviewPkg?.link
	? packageLock.packages[treeviewPkg.resolved]?.version
	: treeviewPkg?.version;

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__TREEVIEW_VERSION__: JSON.stringify(treeviewVersion ?? 'unknown')
	}
});