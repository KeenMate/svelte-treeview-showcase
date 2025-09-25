<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';
	import type { ContextMenuItem } from '@keenmate/svelte-treeview';

	// Movie database for context menu demonstrations
	const movieData = [
		{ id: '1', path: '1', name: '🎦 Movies', type: 'root' },
		{ id: '1.1', path: '1.1', name: '🎭 Action', type: 'genre', isPremium: false },
		{ id: '1.1.1', path: '1.1.1', name: 'The Dark Knight (2008)', type: 'movie', rating: 9.0, isWatchlisted: true, canStream: true, isRented: false },
		{ id: '1.1.2', path: '1.1.2', name: 'Mad Max: Fury Road (2015)', type: 'movie', rating: 8.1, isWatchlisted: false, canStream: false, isRented: true },
		{ id: '1.1.3', path: '1.1.3', name: 'John Wick (2014)', type: 'movie', rating: 7.4, isWatchlisted: true, canStream: true, isRented: false },
		{ id: '1.2', path: '1.2', name: '🎭 Drama', type: 'genre', isPremium: true },
		{ id: '1.2.1', path: '1.2.1', name: 'The Shawshank Redemption (1994)', type: 'movie', rating: 9.3, isWatchlisted: false, canStream: true, isRented: false },
		{ id: '1.2.2', path: '1.2.2', name: 'Forrest Gump (1994)', type: 'movie', rating: 8.8, isWatchlisted: true, canStream: false, isRented: false },
		{ id: '1.3', path: '1.3', name: '😄 Comedy', type: 'genre', isPremium: false },
		{ id: '1.3.1', path: '1.3.1', name: 'The Grand Budapest Hotel (2014)', type: 'movie', rating: 8.1, isWatchlisted: false, canStream: true, isRented: false },
		{ id: '1.3.2', path: '1.3.2', name: 'Superbad (2007)', type: 'movie', rating: 7.6, isWatchlisted: true, canStream: false, isRented: true },
		{ id: '2', path: '2', name: '🎬 Directors', type: 'category' },
		{ id: '2.1', path: '2.1', name: '🎬 Christopher Nolan', type: 'director', isFollowing: true },
		{ id: '2.1.1', path: '2.1.1', name: 'Inception (2010)', type: 'movie', rating: 8.8, isWatchlisted: true, canStream: true, isRented: false },
		{ id: '2.1.2', path: '2.1.2', name: 'Interstellar (2014)', type: 'movie', rating: 8.6, isWatchlisted: false, canStream: false, isRented: false },
		{ id: '2.2', path: '2.2', name: '🎬 Steven Spielberg', type: 'director', isFollowing: false },
		{ id: '2.2.1', path: '2.2.1', name: 'Schindler\'s List (1993)', type: 'movie', rating: 8.9, isWatchlisted: false, canStream: true, isRented: false }
	];

	// Action history for demos
	let actionHistory = $state<any[]>([]);
	let selectedMenuItem = $state('');

	// Context menu callback for movies (with disabled items)
	const createMovieContextMenu = (node: any): ContextMenuItem[] => {
		const items: ContextMenuItem[] = [];

		switch (node.data.type) {
			case 'movie':
				// Always available actions
				items.push({
					icon: '▶️',
					title: node.data.canStream ? 'Watch Now' : 'Rent to Watch',
					callback: () => performAction('watch', node),
					isDisabled: !node.data.canStream && !node.data.isRented
				});

				// Watchlist toggle
				items.push({
					icon: node.data.isWatchlisted ? '❤️' : '🤍',
					title: node.data.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist',
					callback: () => performAction('toggleWatchlist', node)
				});

				items.push({ isDivider: true });

				// Rating-dependent actions
				items.push({
					icon: '🎆',
					title: 'Recommend to Friends',
					callback: () => performAction('recommend', node),
					isDisabled: node.data.rating < 7.0
				});

				items.push({
					icon: '📋',
					title: 'Copy Movie Link',
					callback: () => performAction('copyLink', node)
				});

				items.push({ isDivider: true });

				// Download option (disabled for rented movies)
				items.push({
					icon: '📱',
					title: 'Download for Offline',
					callback: () => performAction('download', node),
					isDisabled: node.data.isRented
				});
				break;

			case 'genre':
				items.push({
					icon: '📂',
					title: 'Browse Genre',
					callback: () => performAction('browse', node)
				});

				// Premium genre features
				if (node.data.isPremium) {
					items.push({
						icon: '🌟',
						title: 'Premium Collections',
						callback: () => performAction('premiumCollections', node)
					});
				}

				items.push({ isDivider: true });
				items.push({
					icon: '🔔',
					title: 'Set Genre Notifications',
					callback: () => performAction('notifications', node)
				});
				break;

			case 'director':
				items.push({
					icon: node.data.isFollowing ? '★' : '☆',
					title: node.data.isFollowing ? 'Unfollow Director' : 'Follow Director',
					callback: () => performAction('toggleFollow', node)
				});

				items.push({
					icon: '📄',
					title: 'View Biography',
					callback: () => performAction('biography', node)
				});

				items.push({ isDivider: true });
				items.push({
					icon: '🎥',
					title: 'View All Movies',
					callback: () => performAction('viewAllMovies', node)
				});
				break;

			default:
				items.push({
					icon: '🔧',
					title: 'Properties',
					callback: () => performAction('properties', node)
				});
		}

		return items;
	};

	// Context menu action handler for snippet-based
	const handleSnippetMenuAction = (action: string, node: any, closeMenu: () => void) => {
		performAction(action, node);
		selectedMenuItem = `${action} on ${node.data.name}`;
		closeMenu();
	};

	// Perform action helper
	function performAction(action: string, node: any) {
		const timestamp = new Date().toLocaleTimeString();
		const newAction = {
			id: Date.now(),
			action,
			item: node.data.name,
			timestamp,
			icon: getActionIcon(action)
		};

		actionHistory = [newAction, ...actionHistory.slice(0, 9)];
		console.log(`${action} performed on: ${node.data.name}`);
		selectedMenuItem = `${action} on ${node.data.name}`;
	}

	function getActionIcon(action: string): string {
		const icons = {
			watch: '▶️', toggleWatchlist: '❤️', recommend: '🎆', copyLink: '📋',
			download: '📱', browse: '📂', premiumCollections: '🌟', notifications: '🔔',
			toggleFollow: '★', biography: '📄', viewAllMovies: '🎥', properties: '🔧',
			play: '▶️', info: 'ℹ️', favorite: '❤️'
		};
		return icons[action] || '⚙️';
	}

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Sort callback
	const sortCallback = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree)
			const levelA = getLevel(a.path);
			const levelB = getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Debug options
	let contextMenuXOffset = $state(8);
	let contextMenuYOffset = $state(0);
	let debugContextMenu = $state(false);
</script>

<DocLayout
	titleText="Context Menu Examples"
	descriptionText="Right-click context menus with customizable actions and templates">

	<div class="py-1">
		<!-- Callback-Based Context Menu -->
		<ShowcaseSection
			titleText="🎞️ Callback-Based Context Menu (Recommended)"
			subtitleText="Dynamic menus with disabled states using contextMenuCallback"
			demoColumnTitle="Movie Streaming App"
			controlsColumnTitle="Callback Code"
			descriptionColumnTitle="Callback Features">

			{#snippet demoContent()}
				<div class="tree-demo-context-menu">
					<div class="alert alert-info mb-3">
						<strong>💡 Try this:</strong> Right-click movies, genres, and directors to see different menus with disabled items
					</div>
					<Tree
						treeId="context-menu-callback"
						data={movieData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						contextMenuCallback={createMovieContextMenu}
						contextMenuXOffset={10}
						contextMenuYOffset={-5}
					/>

					<div class="mt-3">
						<h6>Action History</h6>
						{#if selectedMenuItem}
							<div class="alert alert-success py-2 mb-3">
								Last: {selectedMenuItem}
							</div>
						{/if}

						<div class="action-history" style="max-height: 300px; overflow-y: auto;">
							{#if actionHistory.length > 0}
								{#each actionHistory as action}
									<div class="d-flex align-items-center gap-2 p-2 border-bottom">
										<span class="fs-5">{action.icon}</span>
										<div class="flex-grow-1">
											<div class="small fw-bold">{action.action}</div>
											<div class="small text-muted">{action.item}</div>
										</div>
										<small class="text-muted">{action.timestamp}</small>
									</div>
								{/each}
							{:else}
								<div class="text-muted">Right-click items to see actions here</div>
							{/if}
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<CodeBlock
						codeContent={`// Callback function returns ContextMenuItem[]
const createMovieContextMenu = (node): ContextMenuItem[] => {
  const items: ContextMenuItem[] = [];

  switch (node.data.type) {
    case 'movie':
      // Watch action - disabled if not available
      items.push({
        icon: '▶️',
        title: node.data.canStream ? 'Watch Now' : 'Rent to Watch',
        callback: () => performAction('watch', node),
        isDisabled: !node.data.canStream && !node.data.isRented
      });

      // Watchlist toggle
      items.push({
        icon: node.data.isWatchlisted ? '❤️' : '🤍',
        title: node.data.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist',
        callback: () => performAction('toggleWatchlist', node)
      });

      items.push({ isDivider: true });

      // Recommend - disabled for low ratings
      items.push({
        icon: '🎆',
        title: 'Recommend to Friends',
        callback: () => performAction('recommend', node),
        isDisabled: node.data.rating < 7.0
      });

      // Download - disabled for rented movies
      items.push({
        icon: '📱',
        title: 'Download for Offline',
        callback: () => performAction('download', node),
        isDisabled: node.data.isRented
      });
      break;

    case 'genre':
      items.push({
        icon: '📂',
        title: 'Browse Genre',
        callback: () => performAction('browse', node)
      });

      if (node.data.isPremium) {
        items.push({
          icon: '🌟',
          title: 'Premium Collections',
          callback: () => performAction('premiumCollections', node)
        });
      }
      break;
  }

  return items;
};`}
						languageType="javascript"
						titleText="Callback Implementation"
					/>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Callback-Based Approach</h4>
					<ul>
						<li><strong>Dynamic Generation:</strong> Menu items created programmatically</li>
						<li><strong>Type Safety:</strong> Full TypeScript support with ContextMenuItem</li>
						<li><strong>Disabled States:</strong> Items can be disabled based on conditions</li>
						<li><strong>Dividers:</strong> Visual organization with isDivider: true</li>
					</ul>

					<h4>Smart Disabling</h4>
					<ul>
						<li><strong>Movies:</strong> "Watch Now" disabled if not streamable/rented</li>
						<li><strong>Recommendations:</strong> Disabled for low-rated movies</li>
						<li><strong>Downloads:</strong> Disabled for rented content</li>
					</ul>

					<h4>Position Control</h4>
					<p>
						Use <code>contextMenuXOffset</code> and <code>contextMenuYOffset</code>
						for precise menu positioning relative to cursor.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Snippet-Based Context Menu -->
		<ShowcaseSection
			titleText="🎨 Snippet-Based Context Menu"
			subtitleText="Manual template with full control using {'#snippet contextMenu'}"
			demoColumnTitle="Custom Menu Design"
			controlsColumnTitle="Template Code"
			descriptionColumnTitle="Snippet Benefits">

			{#snippet demoContent()}
				<div class="tree-demo-context-menu">
					<div class="alert alert-info mb-3">
						<strong>💡 Try this:</strong> Right-click movies to see custom-styled menu with conditional items
					</div>
					<Tree
						treeId="context-menu-snippet"
						data={movieData.slice(0, 8)}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
					>
						{#snippet contextMenu(node, closeMenu)}
							<div class="ltree-context-menu">
								<button class="ltree-context-menu-item"
									    onclick={() => handleSnippetMenuAction('play', node, closeMenu)}>
									<span class="ltree-context-menu-icon">▶️</span>
									<span class="ltree-context-menu-label">Play Movie</span>
								</button>

								<button class="ltree-context-menu-item"
									    onclick={() => handleSnippetMenuAction('info', node, closeMenu)}>
									<span class="ltree-context-menu-icon">ℹ️</span>
									<span class="ltree-context-menu-label">Movie Info</span>
								</button>

								<div class="ltree-context-menu-separator"></div>

								{#if node.data.rating >= 8.0}
									<button class="ltree-context-menu-item"
										    onclick={() => handleSnippetMenuAction('favorite', node, closeMenu)}>
										<span class="ltree-context-menu-icon">❤️</span>
										<span class="ltree-context-menu-label">Add to Favorites</span>
									</button>
								{:else}
									<button class="ltree-context-menu-item" disabled>
										<span class="ltree-context-menu-icon">🚫</span>
										<span class="ltree-context-menu-label">Rating too low for favorites</span>
									</button>
								{/if}

								<div class="ltree-context-menu-separator"></div>

								<div class="px-3 py-2 small text-muted">
									<div>Rating: {node.data.rating}/10</div>
									<div>Status: {node.data.isWatchlisted ? 'In Watchlist' : 'Not in watchlist'}</div>
								</div>
							</div>
						{/snippet}
					</Tree>

					<div class="mt-3">
						<h6>Action History</h6>
						{#if selectedMenuItem}
							<div class="alert alert-success py-2 mb-3">
								Last: {selectedMenuItem}
							</div>
						{/if}

						<div class="action-history" style="max-height: 300px; overflow-y: auto;">
							{#if actionHistory.length > 0}
								{#each actionHistory as action}
									<div class="d-flex align-items-center gap-2 p-2 border-bottom">
										<span class="fs-5">{action.icon}</span>
										<div class="flex-grow-1">
											<div class="small fw-bold">{action.action}</div>
											<div class="small text-muted">{action.item}</div>
										</div>
										<small class="text-muted">{action.timestamp}</small>
									</div>
								{/each}
							{:else}
								<div class="text-muted">Right-click items to see actions here</div>
							{/if}
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<CodeBlock
					codeContent={`<Tree data={movieData}>
  {#snippet contextMenu(node, closeMenu)}
    <div class="ltree-context-menu">
      <button class="ltree-context-menu-item"
              onclick={() => action('play', node, closeMenu)}>
        <span class="ltree-context-menu-icon">▶️</span>
        <span class="ltree-context-menu-label">Play Movie</span>
      </button>

      <div class="ltree-context-menu-separator"></div>

      {#if node.data.rating >= 8.0}
        <button class="ltree-context-menu-item"
                onclick={() => action('favorite', node, closeMenu)}>
          <span class="ltree-context-menu-icon">❤️</span>
          <span class="ltree-context-menu-label">Add to Favorites</span>
        </button>
      {:else}
        <button class="ltree-context-menu-item" disabled>
          <span class="ltree-context-menu-icon">🚫</span>
          <span class="ltree-context-menu-label">Rating too low</span>
        </button>
      {/if}

      <!-- Custom info section -->
      <div class="px-3 py-2 small text-muted">
        <div>Rating: {node.data.rating}/10</div>
        <div>Status: {node.data.isWatchlisted ? 'In Watchlist' : 'Not listed'}</div>
      </div>
    </div>
  {/snippet}
</Tree>`}
					languageType="svelte"
					titleText="Snippet Template"
				/>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Snippet Advantages</h4>
					<ul>
						<li><strong>Full Control:</strong> Complete markup and styling control</li>
						<li><strong>Svelte Features:</strong> Use {'#if'}, {'#each'}, bindings, etc.</li>
						<li><strong>Custom Content:</strong> Add info sections, images, complex layouts</li>
						<li><strong>Reactive:</strong> Menu updates automatically with data changes</li>
					</ul>

					<h4>When to Use Snippets</h4>
					<ul>
						<li><strong>Complex layouts:</strong> Multi-column menus, rich content</li>
						<li><strong>Custom styling:</strong> Unique visual design requirements</li>
						<li><strong>Interactive elements:</strong> Sliders, checkboxes, form inputs</li>
						<li><strong>Information display:</strong> Status indicators, previews</li>
					</ul>

					<h4>Best Practices</h4>
					<ul>
						<li>Always call <code>closeMenu()</code> after actions</li>
						<li>Use semantic HTML for accessibility</li>
						<li>Apply consistent CSS classes</li>
						<li>Handle disabled states properly</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Debug Context Menu -->
		<ShowcaseSection
			titleText="🔍 Debug Context Menu Mode"
			subtitleText="Development tool for testing and styling context menus"
			demoColumnTitle="Debug Configuration"
			controlsColumnTitle="Position Controls"
			descriptionColumnTitle="Debug Benefits">

			{#snippet demoContent()}
				<div class="tree-demo-context-menu">
					<div class="alert alert-warning mb-3">
						<strong>🔧 Debug Mode:</strong> {#if debugContextMenu}Context menu should be visible for the SECOND node at position (200px, 100px) relative to tree{:else}Enable debug mode to see persistent context menu{/if}
					</div>
					{#if debugContextMenu}
						<div class="alert alert-info mb-3">
							<strong>Debug Status:</strong> Debug mode is <span class="text-success fw-bold">ENABLED</span>.
							Context menu for the SECOND node should be visible at fixed position. Check browser console for debug logs.
						</div>
					{:else}
						<div class="alert alert-secondary mb-3">
							<strong>Debug Status:</strong> Debug mode is <span class="text-muted fw-bold">DISABLED</span>.
							Check the checkbox to enable debug mode.
						</div>
					{/if}
					<Tree
						treeId="context-menu-debug"
						data={movieData.slice(0, 8)}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{sortCallback}
						expandLevel={2}
						shouldToggleOnNodeClick={true}
						contextMenuCallback={createMovieContextMenu}
						contextMenuXOffset={contextMenuXOffset}
						contextMenuYOffset={contextMenuYOffset}
						shouldDisplayContextMenuInDebugMode={debugContextMenu}
						shouldDisplayDebugInformation={debugContextMenu}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<div class="form-check">
							<input
								class="form-check-input"
								type="checkbox"
								bind:checked={debugContextMenu}
								id="debugMode"
							/>
							<label class="form-check-label" for="debugMode">
								🔍 Enable Debug Mode
							</label>
						</div>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">X Offset: {contextMenuXOffset}px</label>
						<input
							type="range"
							class="form-range"
							bind:value={contextMenuXOffset}
							min="-20"
							max="50"
						/>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Y Offset: {contextMenuYOffset}px</label>
						<input
							type="range"
							class="form-range"
							bind:value={contextMenuYOffset}
							min="-20"
							max="50"
						/>
					</div>

					<div class="alert alert-info">
						<h6>Current Settings:</h6>
						<ul class="mb-0">
							<li>X Offset: {contextMenuXOffset}px</li>
							<li>Y Offset: {contextMenuYOffset}px</li>
							<li>Debug: {debugContextMenu ? 'ON' : 'OFF'}</li>
						</ul>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Debug Mode Features</h4>
					<ul>
						<li><strong>Always Visible:</strong> Menu stays open at fixed position (200px, 100px)</li>
						<li><strong>No Right-Click:</strong> Menu appears automatically without interaction</li>
						<li><strong>Style Testing:</strong> Perfect for CSS development and positioning</li>
						<li><strong>Offset Adjustment:</strong> Real-time position testing</li>
					</ul>

					<h4>Development Workflow</h4>
					<ol>
						<li>Enable debug mode to see persistent menu</li>
						<li>Adjust X/Y offsets for optimal positioning</li>
						<li>Test different menu configurations</li>
						<li>Apply CSS changes in real-time</li>
						<li>Disable debug mode for normal operation</li>
					</ol>

					<h4>Offset Guidelines</h4>
					<ul>
						<li><strong>X Offset:</strong> Horizontal distance from cursor (default: 8px)</li>
						<li><strong>Y Offset:</strong> Vertical distance from cursor (default: 0px)</li>
						<li><strong>Positive values:</strong> Move menu right/down</li>
						<li><strong>Negative values:</strong> Move menu left/up</li>
					</ul>

					<h4>Use Cases</h4>
					<ul>
						<li>Testing menu item states</li>
						<li>Styling custom themes</li>
						<li>Position optimization</li>
						<li>Accessibility testing</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Next Steps -->
		<div class="mt-5">
			<h2 class="mb-4">Next Steps</h2>
			<div class="row g-4">
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🎨</div>
							<h5>Custom Styling</h5>
							<p>Customize appearance and themes</p>
							<a href="/examples/custom-styling" class="btn btn-primary">Styling Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">✨</div>
							<h5>Drag Highlight</h5>
							<p>Visual feedback during drag operations</p>
							<a href="/examples/drag-highlight" class="btn btn-outline-primary">View Highlights</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">⚡</div>
							<h5>Performance</h5>
							<p>Optimize for large datasets</p>
							<a href="/examples/performance" class="btn btn-outline-primary">Performance Tips</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</DocLayout>