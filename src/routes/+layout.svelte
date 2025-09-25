<script lang="ts">
	import { ConfigProvider } from '@keenmate/svelte-docs';
	import type { DocsConfig } from '@keenmate/svelte-docs';
	import '../app.scss';

	interface Props {
		children: import('svelte').Snippet;
		data: {
			config: DocsConfig;
			ssrStyles: string;
		};
	}

	let { children, data }: Props = $props();
</script>

<svelte:head>
	<!-- SSR Theme Styles to prevent FOUC -->
	<style>{@html data.ssrStyles}</style>
	<!-- Set theme data attribute immediately -->
	<script>
		document.documentElement.setAttribute('data-theme', 'docs');
	</script>
</svelte:head>

<ConfigProvider ssrConfig={data.config}>
	{@render children?.()}
</ConfigProvider>