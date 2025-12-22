<script lang="ts">
	import { onMount } from 'svelte';
	import { ConfigProvider } from '@keenmate/svelte-docs';
	import type { DocsConfig } from '@keenmate/svelte-docs';
	import '../app.scss';

	// Compile-time constant from vite.config.ts
	declare const __TREEVIEW_VERSION__: string;

	interface Props {
		children: import('svelte').Snippet;
		data: {
			config: DocsConfig;
			ssrStyles: string;
		};
	}

	let { children, data }: Props = $props();

	let versionBadge: HTMLDivElement;

	onMount(() => {
		// Find the navbar actions container and inject version badge
		const navbarNav = document.querySelector('.navbar .navbar-nav.ms-auto');
		if (navbarNav && versionBadge) {
			// Insert badge before the navbar-nav (to the left of GitHub link)
			navbarNav.parentElement?.insertBefore(versionBadge, navbarNav);
			versionBadge.style.display = 'inline-flex';
		}
	});
</script>

<svelte:head>
	<!-- SSR Theme Styles to prevent FOUC -->
	<style>{@html data.ssrStyles}</style>
	<!-- Set theme data attribute immediately -->
	<script>
		document.documentElement.setAttribute('data-theme', 'docs');
	</script>
</svelte:head>

<!-- Version Badge (will be moved to navbar by JS) -->
<div bind:this={versionBadge} class="version-badge" style="display: none;">
	v{__TREEVIEW_VERSION__}
</div>

<ConfigProvider ssrConfig={data.config}>
	{@render children?.()}
</ConfigProvider>

<style>
	.version-badge {
		display: none;
		align-items: center;
		margin-right: 1rem;
		background-color: var(--docs-accent-color, #3b82f6);
		color: white;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		white-space: nowrap;
		user-select: none;
	}

	@media (max-width: 768px) {
		.version-badge {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
			margin-right: 0.5rem;
		}
	}
</style>