import type { PartialDocsConfig } from '@keenmate/svelte-docs';
import { mergeConfig, defaultConfig, generateSSRStyles } from '@keenmate/svelte-docs';

// Enable prerendering for all routes
export const prerender = true;
export const ssr = true;

const config: PartialDocsConfig = {
	site: {
		title: 'Svelte Treeview Showcase',
		description: 'Complete showcase and documentation for @keenmate/svelte-treeview component library',
		keywords: ['svelte', 'sveltekit', 'treeview', 'tree', 'hierarchical', 'components', 'showcase', 'keenmate'],
		author: 'KeenMate',
		url: 'https://svelte-treeview.keenmate.com',
		language: 'en'
	},
	company: {
		name: 'KeenMate',
		website: 'https://keenmate.com?utm_source=svelte-treeview-showcase',
		social: {
			github: 'https://github.com/keenmate/svelte-treeview'
		}
	},
	navigation: {
		main: [
			{ label: 'Home', href: '/', icon: '🏠' },
			{ label: 'Getting Started', href: '/getting-started', icon: '🚀' },
			{
				label: 'Examples',
				href: '/examples/basic',
				icon: '🌳',
				children: [
					{ label: 'Basic Usage', href: '/examples/basic' },
					{ label: 'Data Structure', href: '/examples/data-structure' },
					{ label: 'Search & Filter', href: '/examples/search' },
					{ label: 'Drag & Drop', href: '/examples/drag-drop' },
					{ label: 'D&D Scenarios', href: '/examples/drag-drop-scenarios' },
					{ label: 'Batch Operations', href: '/examples/batch-operations' },
					{ label: 'Context Menus', href: '/examples/context-menu' },
					{ label: 'Custom Styling', href: '/examples/custom-styling' },
					{ label: 'Drag Highlight', href: '/examples/drag-highlight' },
					{ label: 'Performance', href: '/examples/performance' }
				]
			},
			{
				label: 'API Reference',
				href: '/api/tree',
				icon: '📚',
				children: [
					{ label: 'Tree Component', href: '/api/tree' },
					{ label: 'Properties', href: '/api/properties' },
					{ label: 'Events', href: '/api/events' },
					{ label: 'Styling', href: '/api/styling' }
				]
			}
		]
	},
	features: {
		search: true,
		breadcrumbs: true,
		tableOfContents: true
	}
};

export async function load() {
	const mergedConfig = mergeConfig(defaultConfig, config);
	const ssrStyles = generateSSRStyles(mergedConfig);

	return {
		config: mergedConfig,
		ssrStyles
	};
}