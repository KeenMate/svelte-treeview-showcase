<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for event demonstration
	const eventData = [
		{ id: '1', path: '1', name: '📁 Interactive Demo', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: '1.1', path: '1.1', name: '📄 Document.pdf', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: '1.2', path: '1.2', name: '🖼️ Image.jpg', type: 'image', isDraggable: true, isDropAllowed: false },
		{ id: '1.3', path: '1.3', name: '📊 Spreadsheet.xlsx', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: '2', path: '2', name: '📂 Target Folder', type: 'folder', isDraggable: false, isDropAllowed: true },
		{ id: '2.1', path: '2.1', name: '📋 Empty Folder', type: 'folder', isDraggable: true, isDropAllowed: true }
	];

	// Event log
	let eventLog = $state<any[]>([]);
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

	// Add event to log
	function addEventToLog(eventType: string, eventDetail: any) {
		const timestamp = new Date().toLocaleTimeString();
		const newEvent = {
			id: Date.now(),
			type: eventType,
			timestamp,
			detail: eventDetail,
			icon: getEventIcon(eventType)
		};
		eventLog = [newEvent, ...eventLog.slice(0, 19)]; // Keep last 20 events
	}

	function getEventIcon(eventType: string): string {
		const icons = {
			nodeClick: '👆',
			nodeExpand: '📂',
			nodeSelect: '✅',
			dragStart: '🟡',
			dragOver: '🔵',
			drop: '✅',
			dragEnd: '🔴',
			searchResult: '🔍'
		};
		return icons[eventType] || '⚙️';
	}

	function clearEventLog() {
		eventLog = [];
	}

	// Event handlers
	const handleNodeClick = (event: CustomEvent) => {
		addEventToLog('nodeClick', {
			nodeName: event.detail.data.name,
			nodeId: event.detail.id
		});
	};

	const handleNodeExpand = (event: CustomEvent) => {
		addEventToLog('nodeExpand', {
			nodeId: event.detail.id,
			expanded: event.detail.expanded
		});
	};

	const handleNodeSelect = (event: CustomEvent) => {
		addEventToLog('nodeSelect', {
			nodeId: event.detail.id,
			selected: event.detail.selected
		});
	};

	const handleDragStart = (event: CustomEvent) => {
		addEventToLog('dragStart', {
			nodeId: event.detail.draggedNode?.id,
			nodeName: event.detail.draggedNode?.data?.name
		});
	};

	const handleDragEnd = (event: CustomEvent) => {
		addEventToLog('dragEnd', {
			draggedNodeId: event.detail.draggedNode?.id,
			targetNodeId: event.detail.targetNode?.id,
			success: event.detail.success
		});
	};

	const handleSearchResult = (event: CustomEvent) => {
		addEventToLog('searchResult', {
			query: event.detail.query,
			resultCount: event.detail.results?.length || 0
		});
	};
</script>

<DocLayout
	titleText="Events Reference"
	descriptionText="Complete event system documentation with live examples and event monitoring">

	<div class="py-1">

		<!-- 🎪 Event Monitor Section -->
		<ShowcaseSection
			titleText="🎪 Live Event Monitor"
			subtitleText="Interact with the tree to see events in real-time"
			demoColumnTitle="Interactive Tree"
			controlsColumnTitle="Live Event Log"
			descriptionColumnTitle="Event Monitor Guide">

			{#snippet demoContent()}
				<div class="mb-3">
					<div class="input-group">
						<input
							type="text"
							class="form-control"
							placeholder="Search nodes..."
							bind:value={searchText}
						>
						<button class="btn btn-outline-secondary" onclick={clearEventLog}>
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
						on:nodeClick={handleNodeClick}
						on:nodeExpand={handleNodeExpand}
						on:nodeSelect={handleNodeSelect}
						on:dragStart={handleDragStart}
						on:dragEnd={handleDragEnd}
						on:searchResult={handleSearchResult}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="event-log">
					<div class="d-flex justify-content-between align-items-center mb-3">
						<h6 class="mb-0">Event Log</h6>
						<span class="badge bg-primary">{eventLog.length}</span>
					</div>
					<div class="log-container" style="max-height: 300px; overflow-y: auto;">
						{#if eventLog.length === 0}
							<div class="text-muted text-center py-3">
								<small>No events yet. Interact with the tree to see events appear here.</small>
							</div>
						{:else}
							{#each eventLog as event (event.id)}
								<div class="event-entry mb-2 p-2 border rounded">
									<div class="d-flex justify-content-between align-items-start">
										<div class="d-flex align-items-center">
											<span class="me-2">{event.icon}</span>
											<strong class="text-capitalize">{event.type}</strong>
										</div>
										<small class="text-muted">{event.timestamp}</small>
									</div>
									<div class="mt-1">
										<small class="text-muted">
											{JSON.stringify(event.detail, null, 0)}
										</small>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="event-guide">
					<h6>🎯 How to Test Events:</h6>
					<ul class="list-unstyled">
						<li>👆 <strong>Click</strong> nodes to trigger click events</li>
						<li>📂 <strong>Expand/collapse</strong> folders to see expand events</li>
						<li>🔍 <strong>Search</strong> to trigger search result events</li>
						<li>🤏 <strong>Drag & drop</strong> items to see drag events</li>
						<li>✅ <strong>Select</strong> nodes to see selection events</li>
					</ul>

					<div class="mt-3">
						<h6>📊 Event Statistics:</h6>
						<small class="text-muted">
							Total events captured: <span class="fw-bold">{eventLog.length}</span><br>
							Log displays last 20 events<br>
							Events are captured in real-time
						</small>
					</div>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔥 Core Events Section -->
		<ShowcaseSection
			titleText="🔥 Core Events"
			subtitleText="Essential events fired by user interactions"
			demoColumnTitle="Event Reference"
			controlsColumnTitle="Event Handling Examples"
			descriptionColumnTitle="Implementation Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Event</th>
								<th style="width: 15%">Trigger</th>
								<th style="width: 25%">Event Detail</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>nodeClick</code></td>
								<td>User click</td>
								<td><code>{'{'} id, data, path, level {'}'}</code></td>
								<td>Fired when user clicks on any part of a tree node</td>
							</tr>
							<tr>
								<td><code>nodeExpand</code></td>
								<td>Expand/collapse</td>
								<td><code>{'{'} id, expanded, children, level {'}'}</code></td>
								<td>Fired when a node's expanded state changes</td>
							</tr>
							<tr>
								<td><code>nodeSelect</code></td>
								<td>Selection change</td>
								<td><code>{'{'} id, selected, data, path {'}'}</code></td>
								<td>Fired when a node's selection state changes</td>
							</tr>
							<tr>
								<td><code>nodeFocus</code></td>
								<td>Keyboard focus</td>
								<td><code>{'{'} id, data, previousFocus {'}'}</code></td>
								<td>Fired when focus moves to a different node</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  // Handle basic node interactions
  function handleNodeClick(event) {
    const { id, data, path, level } = event.detail;
    console.log(\`Node clicked: \${data.name}\`);

    // Custom logic based on node type
    if (data.type === 'folder') {
      // Handle folder click
      openFolder(id);
    } else if (data.type === 'file') {
      // Handle file click
      openFile(id);
    }
  }

  function handleNodeExpand(event) {
    const { id, expanded, children } = event.detail;

    if (expanded) {
      console.log(\`Expanded node \${id} with \${children.length} children\`);
      // Optionally load dynamic children
      if (children.length === 0) {
        loadDynamicChildren(id);
      }
    } else {
      console.log(\`Collapsed node \${id}\`);
    }
  }

  function handleNodeSelect(event) {
    const { id, selected, data } = event.detail;

    // Update selection state in your app
    if (selected) {
      selectedItems.add(id);
      updateSelectionUI();
    } else {
      selectedItems.delete(id);
      updateSelectionUI();
    }
  }
</script>

<Tree
  treeId="api-events-core"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  on:nodeClick={handleNodeClick}
  on:nodeExpand={handleNodeExpand}
  on:nodeSelect={handleNodeSelect}
  on:nodeFocus={handleNodeFocus}
/>`}
					languageType="svelte"
					titleText="Core Event Handling"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Event Timing</h6>
					<p>Core events fire immediately when user interactions occur, allowing for real-time response.</p>

					<h6>📊 Event Detail Structure</h6>
					<p>All events include consistent data structure with node information, state changes, and context.</p>

					<h6>🔄 State Management</h6>
					<p>Use events to sync tree state with your application state management system (Redux, Zustand, etc.).</p>

					<h6>⚡ Performance Notes</h6>
					<ul>
						<li>Events are throttled for high-frequency actions</li>
						<li>Event handlers should be lightweight</li>
						<li>Use event delegation patterns for large trees</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🤏 Drag & Drop Events Section -->
		<ShowcaseSection
			titleText="🤏 Drag & Drop Events"
			subtitleText="Events for drag and drop operations with detailed feedback"
			demoColumnTitle="Drag Event Reference"
			controlsColumnTitle="Drag Event Implementation"
			descriptionColumnTitle="Drag & Drop Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Event</th>
								<th style="width: 20%">Phase</th>
								<th style="width: 30%">Event Detail</th>
								<th style="width: 30%">Use Case</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>dragStart</code></td>
								<td>Start</td>
								<td><code>{'{'} draggedNode, originalIndex {'}'}</code></td>
								<td>Initialize drag operation, show UI feedback</td>
							</tr>
							<tr>
								<td><code>dragOver</code></td>
								<td>During</td>
								<td><code>{'{'} draggedNode, targetNode, position {'}'}</code></td>
								<td>Validate drop target, show drop zones</td>
							</tr>
							<tr>
								<td><code>dragEnter</code></td>
								<td>During</td>
								<td><code>{'{'} draggedNode, targetNode {'}'}</code></td>
								<td>Highlight valid drop targets</td>
							</tr>
							<tr>
								<td><code>dragLeave</code></td>
								<td>During</td>
								<td><code>{'{'} draggedNode, targetNode {'}'}</code></td>
								<td>Remove drop target highlights</td>
							</tr>
							<tr>
								<td><code>drop</code></td>
								<td>End</td>
								<td><code>{'{'} draggedNode, targetNode, newIndex, position {'}'}</code></td>
								<td>Execute the actual move operation</td>
							</tr>
							<tr>
								<td><code>dragEnd</code></td>
								<td>End</td>
								<td><code>{'{'} draggedNode, success, canceled {'}'}</code></td>
								<td>Clean up drag UI, update state</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  let draggedItem = null;
  let dragIndicator = '';

  function handleDragStart(event) {
    const { draggedNode } = event.detail;
    draggedItem = draggedNode;
    dragIndicator = \`Dragging: \${draggedNode.data.name}\`;

    // Add visual feedback
    document.body.style.cursor = 'grabbing';
  }

  function handleDragOver(event) {
    const { draggedNode, targetNode, position } = event.detail;

    // Custom validation logic
    if (targetNode.data.type === 'file' && position === 'inside') {
      event.preventDefault(); // Prevent drop
      return false;
    }

    // Show drop indicator
    updateDropIndicator(targetNode, position);
  }

  function handleDrop(event) {
    const { draggedNode, targetNode, newIndex, position } = event.detail;

    // Update your data structure
    updateTreeData(draggedNode, targetNode, position);

    // Sync with backend
    saveMoveOperation({
      itemId: draggedNode.id,
      newParentId: targetNode.id,
      newIndex: newIndex,
      operation: position
    });
  }

  function handleDragEnd(event) {
    const { success, canceled } = event.detail;

    // Clean up UI
    document.body.style.cursor = '';
    dragIndicator = '';
    clearDropIndicators();

    if (success) {
      showSuccessMessage('Item moved successfully');
    } else if (canceled) {
      showInfoMessage('Move operation canceled');
    }
  }

  // Drag validation callback
  function validateDrag(draggedNode, targetNode, position) {
    // Prevent dropping files into files
    if (targetNode.data.type === 'file' && position === 'inside') {
      return false;
    }

    // Check permissions
    return draggedNode.data.canMove && targetNode.data.canAcceptDrops;
  }
</script>

<Tree
  treeId="api-events-drag"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}
  dragValidationCallback={validateDrag}
  on:dragStart={handleDragStart}
  on:dragOver={handleDragOver}
  on:drop={handleDrop}
  on:dragEnd={handleDragEnd}
/>`}
					languageType="svelte"
					titleText="Drag & Drop Events"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Drag Operation Flow</h6>
					<ol>
						<li><strong>dragStart:</strong> User begins dragging</li>
						<li><strong>dragOver/dragEnter:</strong> Hovering over targets</li>
						<li><strong>drop:</strong> User releases on valid target</li>
						<li><strong>dragEnd:</strong> Operation completes</li>
					</ol>

					<h6>✅ Validation System</h6>
					<p>Use <code>dragValidationCallback</code> to implement business rules and prevent invalid drops.</p>

					<h6>🎨 Visual Feedback</h6>
					<p>Events provide hooks for custom drag indicators, drop zones, and animation feedback.</p>

					<h6>💾 Data Persistence</h6>
					<p>The <code>drop</code> event is the ideal place to update your data and sync with backends.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔍 Search Events Section -->
		<ShowcaseSection
			titleText="🔍 Search Events"
			subtitleText="Events fired during search operations with result details"
			demoColumnTitle="Search Event Reference"
			controlsColumnTitle="Search Implementation"
			descriptionColumnTitle="Search Integration">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Event</th>
								<th style="width: 20%">Timing</th>
								<th style="width: 35%">Event Detail</th>
								<th style="width: 20%">Purpose</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>searchStart</code></td>
								<td>Before search</td>
								<td><code>{'{'} query, timestamp {'}'}</code></td>
								<td>Show loading state</td>
							</tr>
							<tr>
								<td><code>searchResult</code></td>
								<td>After search</td>
								<td><code>{'{'} query, results, total, duration {'}'}</code></td>
								<td>Process search results</td>
							</tr>
							<tr>
								<td><code>searchClear</code></td>
								<td>On clear</td>
								<td><code>{'{'} previousQuery, clearedResults {'}'}</code></td>
								<td>Reset search state</td>
							</tr>
							<tr>
								<td><code>searchError</code></td>
								<td>On error</td>
								<td><code>{'{'} query, error, timestamp {'}'}</code></td>
								<td>Handle search errors</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  let searchQuery = '';
  let searchResults = [];
  let isSearching = false;
  let searchStats = { total: 0, duration: 0 };

  function handleSearchStart(event) {
    const { query } = event.detail;
    isSearching = true;
    searchResults = [];

    // Show loading indicator
    showSearchLoader(true);

    // Track search analytics
    trackSearchEvent('search_start', { query });
  }

  function handleSearchResult(event) {
    const { query, results, total, duration } = event.detail;

    isSearching = false;
    searchResults = results;
    searchStats = { total, duration };

    // Hide loading indicator
    showSearchLoader(false);

    // Update search result UI
    updateSearchResultsDisplay(results);

    // Track search completion
    trackSearchEvent('search_complete', {
      query,
      resultCount: total,
      duration
    });

    // Auto-expand parents of found items
    if (results.length > 0) {
      expandParentsOfResults(results);
    }
  }

  function handleSearchClear(event) {
    const { previousQuery, clearedResults } = event.detail;

    searchResults = [];
    searchStats = { total: 0, duration: 0 };
    isSearching = false;

    // Reset tree expansion state
    resetTreeExpansion();

    // Clear search highlights
    clearSearchHighlights();
  }

  function handleSearchError(event) {
    const { query, error } = event.detail;

    isSearching = false;

    // Show error message to user
    showErrorMessage(\`Search failed: \${error.message}\`);

    // Log error for debugging
    console.error('Search error:', error);

    // Track search errors
    trackSearchEvent('search_error', { query, error: error.message });
  }

  // Custom search value extractor
  function getSearchValue(node) {
    // Include name, type, and custom properties in search
    return \`\${node.data.name} \${node.data.type} \${node.data.tags?.join(' ') || ''}\`.toLowerCase();
  }
</script>

<Tree
  treeId="api-events-search"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  searchText={searchQuery}
  getSearchValueCallback={getSearchValue}
  on:searchStart={handleSearchStart}
  on:searchResult={handleSearchResult}
  on:searchClear={handleSearchClear}
  on:searchError={handleSearchError}
/>

<!-- Search UI -->
<div class="search-container">
  <input
    type="text"
    bind:value={searchQuery}
    placeholder="Search tree..."
    class="form-control"
  />

  {#if isSearching}
    <div class="search-loading">Searching...</div>
  {:else if searchResults.length > 0}
    <div class="search-stats">
      Found {searchStats.total} results in {searchStats.duration}ms
    </div>
  {/if}
</div>`}
					languageType="svelte"
					titleText="Search Event Handling"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🚀 Async Search</h6>
					<p>Search operations are asynchronous and use FlexSearch for performance. Events provide hooks for loading states.</p>

					<h6>📊 Search Analytics</h6>
					<p>Events include timing and result metrics perfect for analytics and performance monitoring.</p>

					<h6>🎨 Result Highlighting</h6>
					<p>Use search events to implement custom highlighting and result navigation.</p>

					<h6>🔧 Custom Search Logic</h6>
					<p>Implement <code>getSearchValueCallback</code> to customize what data is searchable for each node.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- ⚡ Performance & Best Practices Section -->
		<ShowcaseSection
			titleText="⚡ Performance & Best Practices"
			subtitleText="Optimize event handling for large trees and complex applications"
			demoColumnTitle="Best Practices"
			controlsColumnTitle="Optimization Examples"
			descriptionColumnTitle="Performance Guide">

			{#snippet demoContent()}
				<div class="best-practices">
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">✅ Do's</h6>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Use event delegation for multiple trees</li>
								<li>Debounce expensive operations in handlers</li>
								<li>Keep event handlers lightweight</li>
								<li>Use proper cleanup in component unmount</li>
								<li>Batch DOM updates after multiple events</li>
							</ul>
						</div>
					</div>
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">❌ Don'ts</h6>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Don't perform heavy computations in handlers</li>
								<li>Don't make synchronous API calls</li>
								<li>Don't manipulate DOM directly</li>
								<li>Don't ignore event timing and order</li>
								<li>Don't forget to handle edge cases</li>
							</ul>
						</div>
					</div>
					<div class="card">
						<div class="card-header">
							<h6 class="mb-0">🔧 Memory Management</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">
								Always remove event listeners when components unmount to prevent memory leaks.
								Use weak references for node caching.
							</small>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  import { onDestroy } from 'svelte';

  // Debounce helper for expensive operations
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Batch updates to avoid excessive re-renders
  let pendingUpdates = [];
  let updateTimeout;

  function batchUpdate(updateFn) {
    pendingUpdates.push(updateFn);

    if (updateTimeout) return;

    updateTimeout = setTimeout(() => {
      const updates = [...pendingUpdates];
      pendingUpdates = [];
      updateTimeout = null;

      // Apply all updates at once
      updates.forEach(update => update());
    }, 16); // Next animation frame
  }

  // Optimized event handlers
  const handleNodeClick = debounce((event) => {
    // Expensive operation (API call, complex state update)
    batchUpdate(() => updateNodeState(event.detail));
  }, 300);

  const handleNodeExpand = (event) => {
    // Light operation - can run immediately
    updateLocalState(event.detail);
  };

  const handleBulkSelection = (event) => {
    // For multiple selections, batch the updates
    batchUpdate(() => {
      event.detail.nodes.forEach(node => {
        updateSelectionState(node);
      });
    });
  };

  // Cleanup on component destroy
  onDestroy(() => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // Clear any pending operations
    pendingUpdates = [];

    // Remove any global listeners
    removeGlobalEventListeners();
  });

  // Event delegation pattern for multiple trees
  function setupEventDelegation() {
    const container = document.getElementById('tree-container');

    container.addEventListener('tree-event', (event) => {
      const treeId = event.target.dataset.treeId;
      const handler = eventHandlers[treeId];

      if (handler) {
        handler(event);
      }
    });
  }

  // Efficient state management
  const treeState = new Map();

  function updateTreeState(nodeId, changes) {
    const current = treeState.get(nodeId) || {};
    treeState.set(nodeId, { ...current, ...changes });

    // Notify subscribers efficiently
    notifyStateChange(nodeId, changes);
  }
</script>

<!-- Optimized Tree Configuration -->
<Tree
  treeId="api-events-optimized"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"

  <!-- Use debounced handlers for expensive operations -->
  on:nodeClick={handleNodeClick}

  <!-- Immediate handlers for light operations -->
  on:nodeExpand={handleNodeExpand}

  <!-- Custom handlers for bulk operations -->
  on:bulkSelect={handleBulkSelection}
/>`}
					languageType="svelte"
					titleText="Performance Optimization"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>⚡ Event Performance</h6>
					<ul>
						<li>Events are optimized internally with throttling</li>
						<li>Use debouncing for expensive handler operations</li>
						<li>Batch DOM updates to avoid layout thrashing</li>
					</ul>

					<h6>🧠 Memory Management</h6>
					<ul>
						<li>Remove event listeners on component cleanup</li>
						<li>Use weak references for caching</li>
						<li>Clear timeouts and intervals</li>
					</ul>

					<h6>📊 Large Trees</h6>
					<ul>
						<li>Event delegation patterns for multiple trees</li>
						<li>Lazy loading based on expand events</li>
						<li>Virtual scrolling for huge datasets</li>
					</ul>

					<h6>🔧 Testing Events</h6>
					<p>Use synthetic events for testing event handlers without user interaction.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>