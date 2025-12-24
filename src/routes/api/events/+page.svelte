<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

	// Sample data for event demonstration
	const eventData = [
		{ id: '1', path: '1', name: '📁 Interactive Demo', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: '1.1', path: '1.1', name: '📄 Document.pdf', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: '1.2', path: '1.2', name: '🖼️ Image.jpg', type: 'image', isDraggable: true, isDropAllowed: false },
		{ id: '1.3', path: '1.3', name: '📊 Spreadsheet.xlsx', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: '2', path: '2', name: '📂 Target Folder', type: 'folder', isDraggable: false, isDropAllowed: true },
		{ id: '2.1', path: '2.1', name: '📋 Empty Folder', type: 'folder', isDraggable: true, isDropAllowed: true }
	];

	// Callback log
	let callbackLog = $state<any[]>([]);
	let searchText = $state('');

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

			// Then folders first, then files
			if (a.data.type !== b.data.type) {
				return a.data.type === 'folder' ? -1 : 1;
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Drag validation
	const dragValidationCallback = (draggedNode: any, targetNode: any, position: string) => {
		return targetNode.data.isDropAllowed;
	};

	// Add callback to log
	function addCallbackToLog(callbackType: string, detail: any) {
		const timestamp = new Date().toLocaleTimeString();
		const newEntry = {
			id: Date.now(),
			type: callbackType,
			timestamp,
			detail,
			icon: getCallbackIcon(callbackType)
		};
		callbackLog = [newEntry, ...callbackLog.slice(0, 19)]; // Keep last 20 entries
	}

	function getCallbackIcon(callbackType: string): string {
		const icons: Record<string, string> = {
			onNodeClicked: '👆',
			onNodeDragStart: '🟡',
			onNodeDragOver: '🔵',
			onNodeDrop: '✅'
		};
		return icons[callbackType] || '⚙️';
	}

	function clearCallbackLog() {
		callbackLog = [];
	}

	// Svelte 5 callback props handlers
	const handleNodeClicked = (node: LTreeNode<any>) => {
		addCallbackToLog('onNodeClicked', {
			nodeName: node.data?.name,
			path: node.path
		});
	};

	const handleNodeDragStart = (node: LTreeNode<any>, event: DragEvent) => {
		addCallbackToLog('onNodeDragStart', {
			nodeName: node.data?.name,
			path: node.path
		});
	};

	const handleNodeDragOver = (node: LTreeNode<any>, event: DragEvent) => {
		addCallbackToLog('onNodeDragOver', {
			nodeName: node.data?.name,
			path: node.path
		});
	};

	const handleNodeDrop = (
		dropNode: LTreeNode<any> | null,
		draggedNode: LTreeNode<any>,
		position: 'above' | 'below' | 'child',
		event: DragEvent | TouchEvent,
		operation: 'move' | 'copy'
	) => {
		addCallbackToLog('onNodeDrop', {
			dropNode: dropNode?.path ?? 'root',
			draggedNode: draggedNode.path,
			position,
			operation
		});
	};
</script>

<DocLayout
	titleText="Callback Props Reference"
	descriptionText="Svelte 5 callback props documentation with live examples and interaction monitoring">

	<div class="py-1">

		<!-- 🎪 Callback Monitor Section -->
		<ShowcaseSection
			titleText="EV01 🎪 Live Callback Monitor"
			subtitleText="Interact with the tree to see callback invocations in real-time"
			col1Title="Interactive Tree"
			col2Title="Callback Log"
			col3Title="Callback Guide">

			{#snippet demoContent()}
				<div class="mb-3">
					<div class="input-group">
						<input
							type="text"
							class="form-control"
							placeholder="Search nodes..."
							bind:value={searchText}
						>
						<button class="btn btn-outline-secondary" onclick={clearCallbackLog}>
							Clear Log
						</button>
					</div>
				</div>
				<div class="tree-demo" style="min-height: 300px;">
					<Tree
						treeId="api-events-monitor"
						data={eventData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						expandLevel={2}
						shouldToggleOnNodeClick={true}
						isDragAndDropEnabled={true}
						{dragValidationCallback}
						{sortCallback}
						{searchText}
						onNodeClicked={handleNodeClicked}
						onNodeDragStart={handleNodeDragStart}
						onNodeDragOver={handleNodeDragOver}
						onNodeDrop={handleNodeDrop}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="callback-log">
					<div class="d-flex justify-content-between align-items-center mb-3">
						<h6 class="mb-0">Callback Log</h6>
						<span class="badge bg-primary">{callbackLog.length}</span>
					</div>
					<div class="log-container" style="max-height: 300px; overflow-y: auto;">
						{#if callbackLog.length === 0}
							<div class="text-muted text-center py-3">
								<small>No callbacks yet. Interact with the tree to see callbacks invoked here.</small>
							</div>
						{:else}
							{#each callbackLog as entry (entry.id)}
								<div class="callback-entry mb-2 p-2 border rounded">
									<div class="d-flex justify-content-between align-items-start">
										<div class="d-flex align-items-center">
											<span class="me-2">{entry.icon}</span>
											<strong><code>{entry.type}</code></strong>
										</div>
										<small class="text-muted">{entry.timestamp}</small>
									</div>
									<div class="mt-1">
										<small class="text-muted">
											{JSON.stringify(entry.detail, null, 0)}
										</small>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="callback-guide">
					<h6>🎯 How to Test Callbacks:</h6>
					<ul class="list-unstyled">
						<li>👆 <strong>Click</strong> nodes to trigger <code>onNodeClicked</code></li>
						<li>🟡 <strong>Start drag</strong> to trigger <code>onNodeDragStart</code></li>
						<li>🔵 <strong>Drag over</strong> nodes for <code>onNodeDragOver</code></li>
						<li>✅ <strong>Drop</strong> to trigger <code>onNodeDrop</code></li>
					</ul>

					<div class="mt-3">
						<h6>📊 Callback Statistics:</h6>
						<small class="text-muted">
							Total callbacks logged: <span class="fw-bold">{callbackLog.length}</span><br>
							Log displays last 20 invocations<br>
							Callbacks logged in real-time
						</small>
					</div>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔥 Callback Props Reference Section -->
		<ShowcaseSection
			titleText="EV02 🔥 Callback Props Reference"
			subtitleText="Svelte 5 callback props for handling user interactions"
			col1Title="Callback Reference"
			col2Title="Usage Examples"
			col3Title="Implementation Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Callback</th>
								<th style="width: 15%">Trigger</th>
								<th style="width: 30%">Signature</th>
								<th style="width: 30%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>onNodeClicked</code></td>
								<td>User click</td>
								<td><code>(node: LTreeNode&lt;T&gt;) =&gt; void</code></td>
								<td>Called when user clicks on any tree node</td>
							</tr>
							<tr>
								<td><code>onNodeDragStart</code></td>
								<td>Drag begins</td>
								<td><code>(node: LTreeNode&lt;T&gt;, event: DragEvent) =&gt; void</code></td>
								<td>Called when user starts dragging a node</td>
							</tr>
							<tr>
								<td><code>onNodeDragOver</code></td>
								<td>Drag over</td>
								<td><code>(node: LTreeNode&lt;T&gt;, event: DragEvent) =&gt; void</code></td>
								<td>Called when dragged node hovers over a target</td>
							</tr>
							<tr class="table-info">
								<td><code>onNodeDrop</code></td>
								<td>Drop</td>
								<td><code>(dropNode, draggedNode, position, event, operation) =&gt; void</code></td>
								<td><strong>v4.5.0+:</strong> Extended signature with position and operation</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="alert alert-info mt-3">
					<h6 class="alert-heading">Svelte 5 Callback Props</h6>
					<p class="mb-0">Unlike Svelte 4's <code>on:event</code> dispatcher syntax, Svelte 5 uses <strong>callback props</strong>. Pass functions directly as props: <code>onNodeClicked={'{'}handler{'}'}</code></p>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script lang="ts">
  import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

  // Handle node click
  function handleNodeClicked(node: LTreeNode<MyData>) {
    console.log(\`Clicked: \${node.data?.name}\`);
    console.log(\`Path: \${node.path}\`);

    // Custom logic based on node type
    if (node.data?.type === 'folder') {
      openFolder(node);
    } else {
      openFile(node);
    }
  }

  // Handle drag start
  function handleDragStart(node: LTreeNode<MyData>, event: DragEvent) {
    console.log(\`Started dragging: \${node.path}\`);
    // Add custom drag data if needed
    event.dataTransfer?.setData('text/plain', node.path);
  }

  // Handle drag over
  function handleDragOver(node: LTreeNode<MyData>, event: DragEvent) {
    console.log(\`Hovering over: \${node.path}\`);
  }
</script>

<Tree
  treeId="my-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}
  onNodeClicked={handleNodeClicked}
  onNodeDragStart={handleDragStart}
  onNodeDragOver={handleDragOver}
/>`}
					languageType="svelte"
					titleText="Callback Props Usage"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 LTreeNode Structure</h6>
					<p>All callbacks receive <code>LTreeNode&lt;T&gt;</code> objects with:</p>
					<ul>
						<li><code>path</code> - Node's hierarchical path</li>
						<li><code>data</code> - Your original data object</li>
						<li><code>children</code> - Child nodes map</li>
						<li><code>isExpanded</code> - Expansion state</li>
						<li><code>isSelected</code> - Selection state</li>
					</ul>

					<h6>🔄 Svelte 4 Migration</h6>
					<p>Replace <code>on:nodeClick</code> with <code>onNodeClicked</code>. The callback receives the node directly, not a CustomEvent.</p>

					<h6>⚡ Performance</h6>
					<ul>
						<li>Callbacks are invoked synchronously</li>
						<li>Keep handlers lightweight</li>
						<li>Debounce expensive operations</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🤏 onNodeDrop Deep Dive Section -->
		<ShowcaseSection
			titleText="EV03 🤏 onNodeDrop Deep Dive (v4.5.0+)"
			subtitleText="Extended drop callback with position and operation support"
			col1Title="Full Signature"
			col2Title="Implementation Examples"
			col3Title="Drop Handling Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Parameter</th>
								<th style="width: 35%">Type</th>
								<th style="width: 45%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>dropNode</code></td>
								<td><code>LTreeNode&lt;T&gt; | null</code></td>
								<td>Target node, or <code>null</code> for root/empty tree drops</td>
							</tr>
							<tr>
								<td><code>draggedNode</code></td>
								<td><code>LTreeNode&lt;T&gt;</code></td>
								<td>The node being dragged</td>
							</tr>
							<tr class="table-success">
								<td><code>position</code></td>
								<td><code>'above' | 'below' | 'child'</code></td>
								<td><strong>NEW:</strong> Where to place relative to target</td>
							</tr>
							<tr>
								<td><code>event</code></td>
								<td><code>DragEvent | TouchEvent</code></td>
								<td>Original browser event (supports touch)</td>
							</tr>
							<tr class="table-success">
								<td><code>operation</code></td>
								<td><code>'move' | 'copy'</code></td>
								<td><strong>NEW:</strong> Ctrl+drag = copy operation</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="alert alert-warning mt-3">
					<h6 class="alert-heading">Breaking Change in v4.5.0</h6>
					<p class="mb-0">The <code>onNodeDrop</code> signature changed from <code>(dropNode, draggedNode, event)</code> to include <code>position</code> and <code>operation</code> parameters.</p>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script lang="ts">
  import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

  type DropPosition = 'above' | 'below' | 'child';
  type DropOperation = 'move' | 'copy';

  // v4.5.0+ onNodeDrop signature
  function handleNodeDrop(
    dropNode: LTreeNode<MyData> | null,
    draggedNode: LTreeNode<MyData>,
    position: DropPosition,
    event: DragEvent | TouchEvent,
    operation: DropOperation
  ) {
    // Handle root-level drops (empty tree or root zone)
    if (!dropNode) {
      console.log('Dropped at root level');
      moveToRoot(draggedNode, operation);
      return;
    }

    // Calculate new path based on position
    let newParentPath: string;
    let sortOrder: number;

    switch (position) {
      case 'above':
        newParentPath = dropNode.parentPath ?? '';
        sortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
        break;
      case 'below':
        newParentPath = dropNode.parentPath ?? '';
        sortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
        break;
      case 'child':
        newParentPath = dropNode.path;
        sortOrder = 10; // First child
        break;
    }

    // Handle copy vs move
    if (operation === 'copy') {
      console.log(\`Copying \${draggedNode.path} to \${newParentPath}\`);
      copyNode(draggedNode, newParentPath, sortOrder);
    } else {
      console.log(\`Moving \${draggedNode.path} to \${newParentPath}\`);
      moveNode(draggedNode, newParentPath, sortOrder);
    }
  }
</script>

<Tree
  treeId="my-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  isDragAndDropEnabled={true}
  onNodeDrop={handleNodeDrop}
/>`}
					languageType="svelte"
					titleText="v4.5.0 onNodeDrop Implementation"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Position Values</h6>
					<ul>
						<li><code>'above'</code> - Insert as sibling before target</li>
						<li><code>'below'</code> - Insert as sibling after target</li>
						<li><code>'child'</code> - Insert as child of target</li>
					</ul>

					<h6>📋 Operation Types</h6>
					<ul>
						<li><code>'move'</code> - Default drag operation</li>
						<li><code>'copy'</code> - Ctrl+drag or copy drag</li>
					</ul>

					<h6>⚠️ Null dropNode</h6>
					<p><code>dropNode</code> is <code>null</code> when:</p>
					<ul>
						<li>Dropped on empty tree placeholder</li>
						<li>Dropped on root drop zone</li>
					</ul>

					<h6>📱 Touch Support</h6>
					<p>The <code>event</code> can be <code>TouchEvent</code> on mobile devices with long-press drag.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔍 Search API Section -->
		<ShowcaseSection
			titleText="EV04 🔍 Search API"
			subtitleText="Search is prop-based, not callback-based - use searchText prop and searchNodes method"
			col1Title="Search Props & Methods"
			col2Title="Search Implementation"
			col3Title="Search Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Prop / Method</th>
								<th style="width: 30%">Type</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>searchText</code></td>
								<td><code>string</code> (bindable)</td>
								<td>Two-way bound search query - filters tree automatically</td>
							</tr>
							<tr>
								<td><code>shouldUseInternalSearchIndex</code></td>
								<td><code>boolean</code></td>
								<td>Enable FlexSearch-based indexing for large trees</td>
							</tr>
							<tr>
								<td><code>searchValueMember</code></td>
								<td><code>string</code></td>
								<td>Property name to use for search text</td>
							</tr>
							<tr>
								<td><code>getSearchValueCallback</code></td>
								<td><code>(data: T) =&gt; string</code></td>
								<td>Custom function to extract searchable text</td>
							</tr>
							<tr class="table-info">
								<td><code>searchNodes()</code></td>
								<td><code>(text: string) =&gt; LTreeNode[]</code></td>
								<td><strong>Method:</strong> Query nodes programmatically</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="alert alert-info mt-3">
					<h6 class="alert-heading">Note: Prop-Based Search</h6>
					<p class="mb-0">Unlike drag/drop callbacks, search uses <strong>reactive props</strong>. Bind to <code>searchText</code> and the tree filters automatically. No search events are fired.</p>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script lang="ts">
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef: Tree<MyData>;
  let searchText = $state('');

  // Custom search value extractor
  function getSearchValue(data: MyData): string {
    // Include multiple fields in search
    return [
      data.name,
      data.type,
      data.tags?.join(' ') ?? ''
    ].join(' ').toLowerCase();
  }

  // Programmatic search using tree method
  function findNodes(query: string) {
    const results = treeRef.searchNodes(query);
    console.log(\`Found \${results.length} nodes\`);
    return results;
  }

  // Clear search
  function clearSearch() {
    searchText = '';
  }
</script>

<!-- Search input bound to searchText -->
<input
  type="text"
  bind:value={searchText}
  placeholder="Search tree..."
  class="form-control"
/>
<button onclick={clearSearch}>Clear</button>

<Tree
  bind:this={treeRef}
  treeId="my-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  bind:searchText
  shouldUseInternalSearchIndex={true}
  getSearchValueCallback={getSearchValue}
/>`}
					languageType="svelte"
					titleText="Search Implementation"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🔄 Reactive Filtering</h6>
					<p>When <code>searchText</code> changes, the tree automatically filters to show matching nodes and their ancestors.</p>

					<h6>🔍 searchNodes() Method</h6>
					<p>Use <code>treeRef.searchNodes(query)</code> to query nodes without changing the display filter.</p>

					<h6>⚡ FlexSearch Integration</h6>
					<p>Enable <code>shouldUseInternalSearchIndex</code> for optimized search on large trees using FlexSearch.</p>

					<h6>🎨 Custom Indexing</h6>
					<p>Use <code>getSearchValueCallback</code> to index multiple fields or apply custom text transformations.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- ⚡ Performance & Best Practices Section -->
		<ShowcaseSection
			titleText="EV05 ⚡ Performance & Best Practices"
			subtitleText="Optimize callback handling for large trees and complex applications"
			col1Title="Best Practices"
			col2Title="Svelte 5 Patterns"
			col3Title="Performance Guide">

			{#snippet demoContent()}
				<div class="best-practices">
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">✅ Do's</h6>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Debounce expensive operations in callbacks</li>
								<li>Keep callback handlers lightweight</li>
								<li>Use <code>$effect</code> for reactive side effects</li>
								<li>Batch state updates with <code>$state</code></li>
								<li>Use <code>untrack()</code> to avoid reactive loops</li>
							</ul>
						</div>
					</div>
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">❌ Don'ts</h6>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Don't perform heavy computations in callbacks</li>
								<li>Don't make synchronous API calls in handlers</li>
								<li>Don't manipulate DOM directly - use reactive state</li>
								<li>Don't create functions inside templates</li>
								<li>Don't forget null checks for dropNode</li>
							</ul>
						</div>
					</div>
					<div class="card">
						<div class="card-header">
							<h6 class="mb-0">🔧 Svelte 5 Cleanup</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">
								Svelte 5 automatically handles cleanup for <code>$effect</code> blocks.
								Use <code>onDestroy</code> only for non-reactive cleanup like timers.
							</small>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

  // Debounce helper
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): T {
    let timeout: ReturnType<typeof setTimeout>;
    return ((...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  // State using Svelte 5 runes
  let selectedPath = $state<string | null>(null);
  let operationLog = $state<string[]>([]);

  // Debounced API call
  const saveToServer = debounce(async (path: string) => {
    await fetch('/api/select', {
      method: 'POST',
      body: JSON.stringify({ path })
    });
  }, 500);

  // Lightweight click handler
  function handleNodeClicked(node: LTreeNode<MyData>) {
    // Immediate local state update
    selectedPath = node.path;

    // Debounced expensive operation
    saveToServer(node.path);
  }

  // Drop handler with async operation
  async function handleNodeDrop(
    dropNode: LTreeNode<MyData> | null,
    draggedNode: LTreeNode<MyData>,
    position: 'above' | 'below' | 'child',
    event: DragEvent | TouchEvent,
    operation: 'move' | 'copy'
  ) {
    // Log operation (using untrack to avoid reactivity)
    untrack(() => {
      operationLog = [
        ...operationLog.slice(-9),
        \`\${operation}: \${draggedNode.path} → \${dropNode?.path ?? 'root'}\`
      ];
    });

    // Async backend sync
    await fetch('/api/move', {
      method: 'POST',
      body: JSON.stringify({
        source: draggedNode.path,
        target: dropNode?.path,
        position,
        operation
      })
    });
  }

  // Effect for side effects on selection change
  $effect(() => {
    if (selectedPath) {
      console.log('Selection changed:', selectedPath);
    }
  });
</script>

<Tree
  treeId="optimized-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}
  onNodeClicked={handleNodeClicked}
  onNodeDrop={handleNodeDrop}
/>`}
					languageType="svelte"
					titleText="Svelte 5 Best Practices"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>⚡ Callback Performance</h6>
					<ul>
						<li>Callbacks run synchronously - keep them fast</li>
						<li>Debounce API calls and heavy operations</li>
						<li>Use <code>untrack()</code> for non-reactive updates</li>
					</ul>

					<h6>🔄 Svelte 5 Runes</h6>
					<ul>
						<li><code>$state</code> for reactive local state</li>
						<li><code>$effect</code> for side effects</li>
						<li><code>$derived</code> for computed values</li>
					</ul>

					<h6>📊 Large Trees</h6>
					<ul>
						<li>Enable <code>shouldUseInternalSearchIndex</code></li>
						<li>Use <code>expandLevel</code> to limit initial render</li>
						<li>Lazy load children on expand if needed</li>
					</ul>

					<h6>🧪 Testing</h6>
					<p>Test callbacks by calling them directly with mock <code>LTreeNode</code> objects.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>