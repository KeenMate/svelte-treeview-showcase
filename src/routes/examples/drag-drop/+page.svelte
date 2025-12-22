<script lang="ts">
	import { onMount } from 'svelte';
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Source data - draggable items
	const sourceData = [
		{ id: 's1', path: '1', name: '📋 Task Board', type: 'container', isDraggable: true, isDropAllowed: false },
		{ id: 's2', path: '1.1', name: '📝 Create User Stories', type: 'task', isDraggable: true, isDropAllowed: false, status: 'todo' },
		{ id: 's3', path: '1.2', name: '🎨 Design Mockups', type: 'task', isDraggable: true, isDropAllowed: false, status: 'todo' },
		{ id: 's4', path: '1.3', name: '💻 Frontend Development', type: 'task', isDraggable: true, isDropAllowed: false, status: 'todo' },
		{ id: 's5', path: '1.4', name: '🔧 Backend API', type: 'task', isDraggable: true, isDropAllowed: false, status: 'todo' },
		{ id: 's6', path: '1.5', name: '🧪 Testing & QA', type: 'task', isDraggable: true, isDropAllowed: false, status: 'todo' },
		{ id: 's7', path: '2', name: '📁 Resources', type: 'container', isDraggable: false, isDropAllowed: false },
		{ id: 's8', path: '2.1', name: '📖 Documentation', type: 'resource', isDraggable: true, isDropAllowed: false },
		{ id: 's9', path: '2.2', name: '🖼️ Image Assets', type: 'resource', isDraggable: true, isDropAllowed: false },
		{ id: 's10', path: '2.3', name: '🎯 Brand Guidelines', type: 'resource', isDraggable: true, isDropAllowed: false }
	];

	// Target data - drop zones (sortOrder gives space between items for positioning)
	let targetData = $state([
		{ id: 't1', path: '1', name: '📋 Project Status', type: 'container', isDraggable: false, isDropAllowed: true, sortOrder: 10 },
		{ id: 't2', path: '1.1', name: '🔄 In Progress', type: 'status', isDraggable: false, isDropAllowed: true, sortOrder: 10 },
		{ id: 't3', path: '1.2', name: '✅ Completed', type: 'status', isDraggable: false, isDropAllowed: true, sortOrder: 20 },
		{ id: 't4', path: '1.3', name: '🚫 Blocked', type: 'status', isDraggable: false, isDropAllowed: true, sortOrder: 30 },
		{ id: 't5', path: '2', name: '📁 Team Assignments', type: 'container', isDraggable: false, isDropAllowed: true, sortOrder: 20 },
		{ id: 't6', path: '2.1', name: '👨‍💻 Frontend Team', type: 'team', isDraggable: false, isDropAllowed: true, sortOrder: 10 },
		{ id: 't7', path: '2.2', name: '🔧 Backend Team', type: 'team', isDraggable: false, isDropAllowed: true, sortOrder: 20 },
		{ id: 't8', path: '2.3', name: '🎨 Design Team', type: 'team', isDraggable: false, isDropAllowed: true, sortOrder: 30 }
	]);

	// Simple reorganizable tree data
	let reorderData = $state([
		{ id: 'r1', path: '1', name: '📂 Frontend', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'r2', path: '1.1', name: 'components', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'r3', path: '1.1.1', name: 'Button.svelte', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 'r4', path: '1.1.2', name: 'Tree.svelte', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 20 },
		{ id: 'r5', path: '1.2', name: 'utils', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 20 },
		{ id: 'r6', path: '1.2.1', name: 'helpers.js', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 'r7', path: '2', name: '📂 Backend', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 20 },
		{ id: 'r8', path: '2.1', name: 'api', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'r9', path: '2.1.1', name: 'users.js', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 }
	]);

	// Tree reference for target tree
	let targetTreeRef: Tree<typeof targetData[0]>;
	let nextTargetId = $state(100);

	// Event tracking
	let dragEventLog = $state<string[]>([]);
	let dropHistory = $state<string[]>([]);

	// Drop zone configuration (DD05)
	let dropZoneMode = $state<'floating' | 'glow'>('glow');
	let dropZoneLayout = $state<'around' | 'above' | 'below' | 'wave' | 'wave2'>('around');
	let dropZoneStart = $state<number | string>('33%');
	let dropZoneMaxWidth = $state(120);
	let allowCopy = $state(false);

	// Drop zone demo data
	const dropZoneDemoData = [
		{ id: 'dz1', path: '1', name: '📁 Documents', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'dz2', path: '1.1', name: '📝 Report.docx', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 'dz3', path: '1.2', name: '📊 Data.xlsx', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 20 },
		{ id: 'dz4', path: '2', name: '📁 Images', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 20 },
		{ id: 'dz5', path: '2.1', name: '🖼️ Logo.png', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 'dz6', path: '2.2', name: '🖼️ Banner.jpg', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 20 },
		{ id: 'dz7', path: '3', name: '📁 Projects', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 30 },
		{ id: 'dz8', path: '3.1', name: '📂 Website', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'dz9', path: '3.2', name: '📂 Mobile App', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 20 }
	];

	// Load settings from sessionStorage on mount
	onMount(() => {
		const saved = sessionStorage.getItem('dropZoneConfig');
		if (saved) {
			try {
				const config = JSON.parse(saved);
				if (config.mode) dropZoneMode = config.mode;
				if (config.layout) dropZoneLayout = config.layout;
				if (config.start !== undefined) dropZoneStart = config.start;
				if (config.maxWidth !== undefined) dropZoneMaxWidth = config.maxWidth;
				if (config.allowCopy !== undefined) allowCopy = config.allowCopy;
			} catch (e) {
				// Ignore invalid JSON
			}
		}
	});

	// Save settings to sessionStorage when they change
	$effect(() => {
		const config = {
			mode: dropZoneMode,
			layout: dropZoneLayout,
			start: dropZoneStart,
			maxWidth: dropZoneMaxWidth,
			allowCopy
		};
		sessionStorage.setItem('dropZoneConfig', JSON.stringify(config));
	});

	// Drag validation callback
	const dragValidationCallback = (draggedNode: any, targetNode: any, position: string) => {
		// Don't allow dropping files INTO files (as children)
		if (draggedNode.data.type === 'file' && targetNode.data.type === 'file' && position === 'child') {
			return false;
		}

		// Don't allow dropping containers into their own children
		if (targetNode.path.startsWith(draggedNode.path + '.')) {
			return false;
		}

		// Allow dropping tasks into status containers (as children)
		if (draggedNode.data.type === 'task' && targetNode.data.type === 'status') {
			return true;
		}

		// Allow dropping resources into team containers (as children)
		if (draggedNode.data.type === 'resource' && targetNode.data.type === 'team') {
			return true;
		}

		// Allow positioning items relative to siblings (above/below for reordering)
		if (position === 'above' || position === 'below') {
			// Allow reordering among siblings in status containers
			if (targetNode.data.type === 'status' || targetNode.data.type === 'task' || targetNode.data.type === 'resource') {
				return true;
			}
			// Allow reordering among siblings in team containers
			if (targetNode.data.type === 'team') {
				return true;
			}
			// Allow reordering files and folders
			if (targetNode.data.type === 'file' || targetNode.data.type === 'folder') {
				return true;
			}
		}

		// Allow dropping into containers (as children)
		if (targetNode.data.type === 'container' && position === 'child') {
			return true;
		}

		// Allow folder reorganization
		if (draggedNode.data.type === 'folder' && targetNode.data.type === 'folder') {
			return true;
		}

		// Allow file moves into folders
		if (draggedNode.data.type === 'file' && targetNode.data.type === 'folder') {
			return true;
		}

		return false;
	};

	// Event handlers
	const handleDragStart = (node: any, event: DragEvent) => {
		const message = `🟡 Drag started: ${node.data.name}`;
		dragEventLog = [message, ...dragEventLog.slice(0, 9)];
	};

	const handleDragOver = (node: any, event: DragEvent) => {
		const message = `🔵 Drag over: ${node.data.name}`;
		dragEventLog = [message, ...dragEventLog.slice(0, 9)];
	};

	const handleDrop = (dropNode: any, draggedNode: any, position: string, event: DragEvent | TouchEvent, operation: string) => {
		const targetName = dropNode?.data?.name || 'root';
		const message = `✅ Dropped: ${draggedNode.data.name} → ${targetName} (${position}, ${operation})`;
		dragEventLog = [message, ...dragEventLog.slice(0, 9)];
		dropHistory = [message, ...dropHistory.slice(0, 4)];

		// Determine if this is a cross-tree operation (source → target) or same-tree
		const isSourceItem = draggedNode.data?.id?.startsWith?.('s');
		const isTargetItem = draggedNode.data?.id?.startsWith?.('t');

		// Same-tree moves are AUTO-HANDLED by the library when orderMember is set
		if (isTargetItem) {
			console.log('=== SAME-TREE MOVE (auto-handled) ===');
			console.log('Position:', position);
			console.log('Drop target:', dropNode?.data?.name || 'root');
			console.log('Library handles sortOrder update automatically via orderMember prop');
			console.log('=====================================');
		}

		// Handle cross-tree operation (source → target)
		if (isSourceItem) {
			// Cross-tree: Copy from source to target
			const parentPath = dropNode === null ? '' :
				(position === 'child' ? dropNode.path : (dropNode.parentPath || ''));

			// Calculate sort order based on position
			let sortOrder = 10;
			if (dropNode && position === 'above') {
				sortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
			} else if (dropNode && position === 'below') {
				sortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
			}

			// Generate new ID for the copied node
			const newId = `t${nextTargetId++}`;

			const newNodeData = {
				...draggedNode.data,
				id: newId,
				path: '', // Let library calculate
				sortOrder
			};

			console.log('=== DROP OPERATION ===');
			console.log('Position:', position);
			console.log('Parent path:', parentPath);
			console.log('Drop target sortOrder:', dropNode?.data?.sortOrder);
			console.log('Calculated sortOrder:', sortOrder);
			console.log('Data to add:', newNodeData);

			// Add node to target tree
			const result = targetTreeRef.addNode(parentPath, newNodeData);

			console.log('Add result:', result);
			console.log('Result node data:', result.node?.data);
			console.log('======================')

			if (result.success) {
				// Update local state to keep in sync
				targetData = [...targetData, result.node.data];
			}
		}

		// Update the tree data for reorder demo
		if (draggedNode.data?.id?.startsWith?.('r')) {
			// Same-tree moves are auto-handled by the library
			console.log('Reorder operation (auto-handled):', { dropNode, draggedNode, position, operation });
		}
	};

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Sort callbacks
	const sortCallback = (items: any[]) => {
		console.log('=== SORT ===', items.map(i => `${i.data.name}(so:${i.data.sortOrder ?? 'none'})`).join(', '));
		return items.sort((a, b) => {
			// First by level (depth in tree)
			const levelA = getLevel(a.path);
			const levelB = getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by sortOrder (for drag-drop positioning) - this takes priority!
			const sortOrderA = a.data.sortOrder;
			const sortOrderB = b.data.sortOrder;
			// If either has explicit sortOrder, use it for sorting
			if (sortOrderA !== undefined || sortOrderB !== undefined) {
				return (sortOrderA ?? 10) - (sortOrderB ?? 10);
			}

			// Then by type priority (only for items without explicit sortOrder)
			if (a.data.type !== b.data.type) {
				const typeOrder = { container: 0, folder: 1, status: 2, team: 3, task: 4, resource: 5, file: 6 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name as fallback
			return a.data.name.localeCompare(b.data.name);
		});
	};
</script>

<DocLayout
	titleText="Drag & Drop Examples"
	descriptionText="Interactive drag and drop functionality with validation and visual feedback">

	<div class="py-1">
		<!-- Basic Drag & Drop -->
		<ShowcaseSection
			titleText="DD01 Basic Drag & Drop"
			subtitleText="Simple drag and drop between two trees"
			demoColumnTitle="Interactive Demo"
			controlsColumnTitle="Event Log"
			descriptionColumnTitle="Features">

			{#snippet demoContent()}
				<div class="row">
					<div class="col-md-6">
						<h6 class="text-primary mb-3">📝 Available Tasks & Resources</h6>
						<div class="tree-demo" style="min-height: 300px;">
							<Tree
								treeId="drag-drop-source-tasks"
								data={sourceData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								isDragAndDropEnabled={true}
								{dragValidationCallback}
								{sortCallback}
								expandLevel={3}
								shouldToggleOnNodeClick={true}
								onNodeDragStart={handleDragStart}
								onNodeDragOver={handleDragOver}
								onNodeDrop={handleDrop}
							/>
						</div>
					</div>
					<div class="col-md-6">
						<h6 class="text-success mb-3">🎯 Project Organization</h6>
						<div class="tree-demo" style="min-height: 300px;">
							<Tree
								bind:this={targetTreeRef}
								treeId="drag-drop-target-organization"
								data={targetData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								orderMember="sortOrder"
								isDragAndDropEnabled={true}
								{dragValidationCallback}
								{sortCallback}
								expandLevel={3}
								shouldToggleOnNodeClick={true}
								onNodeDragStart={handleDragStart}
								onNodeDragOver={handleDragOver}
								onNodeDrop={handleDrop}
							/>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<h6>Real-time Events</h6>
					<div class="event-log" style="max-height: 200px; overflow-y: auto;">
						{#if dragEventLog.length > 0}
							{#each dragEventLog as event}
								<div class="small font-monospace mb-1 p-2 bg-light rounded">{event}</div>
							{/each}
						{:else}
							<div class="text-muted">Start dragging to see events</div>
						{/if}
					</div>

					<h6 class="mt-3">Drop History</h6>
					<div class="drop-history">
						{#if dropHistory.length > 0}
							{#each dropHistory as drop}
								<div class="small text-success mb-1">{drop}</div>
							{/each}
						{:else}
							<div class="text-muted">No drops yet</div>
						{/if}
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Drag & Drop Features</h4>
					<ul>
						<li><strong>Visual feedback</strong> during drag operations</li>
						<li><strong>Drop validation</strong> with custom rules</li>
						<li><strong>Real-time events</strong> for state management</li>
						<li><strong>Cross-tree</strong> drag and drop support</li>
					</ul>

					<h4>Try This</h4>
					<ul>
						<li>Drag tasks from left tree to status containers on right</li>
						<li>Drag resources to team assignments</li>
						<li>Notice validation prevents invalid drops</li>
					</ul>

					<h4>Validation Rules</h4>
					<ul>
						<li>Tasks → Status containers ✅</li>
						<li>Resources → Team containers ✅</li>
						<li>Files → Files ❌</li>
						<li>Parent → Child ❌</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Tree Reorganization -->
		<ShowcaseSection
			titleText="DD02 Tree Reorganization"
			subtitleText="Reorder and reorganize tree structure"
			demoColumnTitle="File System Tree"
			controlsColumnTitle="Implementation"
			descriptionColumnTitle="Reorganization">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="drag-drop-reorganization"
						data={reorderData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						orderMember="sortOrder"
						isDragAndDropEnabled={true}
						{dragValidationCallback}
						{sortCallback}
						expandLevel={4}
						shouldToggleOnNodeClick={true}
						onNodeDragStart={handleDragStart}
						onNodeDrop={handleDrop}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Drag validation callback
const dragValidationCallback = (draggedNode, targetNode, position) => {
  // Don't allow dropping files into files
  if (draggedNode.data.type === 'file' && targetNode.data.type === 'file') {
    return false;
  }

  // Don't allow dropping containers into their own children
  if (targetNode.path.startsWith(draggedNode.path + '.')) {
    return false;
  }

  // Allow folder reorganization
  if (draggedNode.data.type === 'folder' && targetNode.data.type === 'folder') {
    return true;
  }

  // Allow file moves into folders
  if (draggedNode.data.type === 'file' && targetNode.data.type === 'folder') {
    return true;
  }

  return false;
};`}
					languageType="javascript"
					titleText="Validation Logic"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Reorganization Features</h4>
					<ul>
						<li><strong>Folder reordering</strong> - Move folders around</li>
						<li><strong>File organization</strong> - Move files between folders</li>
						<li><strong>Hierarchy validation</strong> - Prevent circular dependencies</li>
						<li><strong>Type-based rules</strong> - Files can't contain other items</li>
					</ul>

					<h4>Try This</h4>
					<ul>
						<li>Move files between folders</li>
						<li>Reorder folders within the same level</li>
						<li>Try invalid moves to see validation</li>
					</ul>

					<h4>Use Cases</h4>
					<ul>
						<li>File managers</li>
						<li>Project organizers</li>
						<li>Menu builders</li>
						<li>Category managers</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Configuration Options -->
		<ShowcaseSection
			titleText="DD03 Configuration Options"
			subtitleText="Customize drag & drop behavior"
			demoColumnTitle="Configuration Properties"
			controlsColumnTitle="Event Handling"
			descriptionColumnTitle="Customization">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Property</th>
								<th>Type</th>
								<th>Default</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>isDragAndDropEnabled</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>Enable drag & drop functionality</td>
							</tr>
							<tr>
								<td><code>dragValidationCallback</code></td>
								<td><code>Function</code></td>
								<td><code>undefined</code></td>
								<td>Validate drop operations</td>
							</tr>
							<tr>
								<td><code>dragHighlightClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class for drag highlights</td>
							</tr>
							<tr>
								<td><code>isDraggableMember</code></td>
								<td><code>string</code></td>
								<td><code>"isDraggable"</code></td>
								<td>Property name for draggable flag</td>
							</tr>
							<tr>
								<td><code>isDropAllowedMember</code></td>
								<td><code>string</code></td>
								<td><code>"isDropAllowed"</code></td>
								<td>Property name for drop allowed flag</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"

  // Drag & Drop Configuration
  isDragAndDropEnabled={true}
  dragValidationCallback={validateDrop}
  dragHighlightClass="custom-highlight"
  isDraggableMember="canDrag"
  isDropAllowedMember="canDrop"

  // Event Handlers
  onNodeDragStart={handleDragStart}
  onNodeDragOver={handleDragOver}
  onNodeDrop={handleDrop}
/>`}
					languageType="svelte"
					titleText="Complete Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Validation Callback</h4>
					<p>
						The validation function receives <code>draggedNode</code>, <code>targetNode</code>,
						and <code>position</code> parameters. Return <code>true</code> to allow the drop.
					</p>

					<h4>Event Sequence</h4>
					<ol>
						<li><code>onNodeDragStart</code> - User starts dragging</li>
						<li><code>onNodeDragOver</code> - Dragging over potential targets</li>
						<li><code>onNodeDrop</code> - Item dropped (if validation passes)</li>
					</ol>

					<h4>Data Properties</h4>
					<p>
						Use <code>isDraggable</code> and <code>isDropAllowed</code> properties
						in your data to control which nodes can be dragged or accept drops.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- v4.5.0 Features Section -->
		<ShowcaseSection
			titleText="DD04 🆕 v4.5.0 Features"
			subtitleText="New drag-drop capabilities: touch support, drop positions, glow mode, and more"
			demoColumnTitle="New Properties"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Feature Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Property</th>
								<th style="width: 20%">Type</th>
								<th style="width: 50%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-info">
								<td><code>dragDropMode</code></td>
								<td><code>string</code></td>
								<td>'none' | 'self' | 'cross' | 'both' - Control where drops are allowed</td>
							</tr>
							<tr class="table-info">
								<td><code>dragOverNodeClass</code></td>
								<td><code>string</code></td>
								<td>CSS class for drag-over feedback. Use 'ltree-dragover-glow' for position arrows</td>
							</tr>
							<tr class="table-info">
								<td><code>orderMember</code></td>
								<td><code>string</code></td>
								<td>Property name for sibling sort order (e.g., "sortOrder")</td>
							</tr>
							<tr class="table-success">
								<td><code>dropZoneLayout</code></td>
								<td><code>string</code></td>
								<td>'around' | 'above' | 'below' | 'wave' | 'wave2' - Drop zone arrangement</td>
							</tr>
							<tr class="table-success">
								<td><code>dropZoneStart</code></td>
								<td><code>number</code></td>
								<td>Horizontal start position for drop zones (default: 33%)</td>
							</tr>
							<tr class="table-warning">
								<td><code>isLoading</code></td>
								<td><code>boolean</code></td>
								<td>Show loading overlay during async operations</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="alert alert-success mt-3 small">
					<strong>📱 Touch Support:</strong> Touch drag-drop is enabled by default with 300ms long-press activation.
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<!-- v4.5.0 Enhanced Drag & Drop -->
<Tree
  bind:this={treeRef}
  treeId="enhanced-drag"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}

  <!-- NEW: Control cross-tree behavior -->
  dragDropMode="both"

  <!-- NEW: Glow mode with position arrows -->
  dragOverNodeClass="ltree-dragover-glow"

  <!-- NEW: Sibling ordering -->
  orderMember="sortOrder"

  <!-- NEW: Loading state -->
  isLoading={isSaving}

  <!-- UPDATED: onNodeDrop now includes position -->
  onNodeDrop={handleDrop}
>
  <!-- NEW: Empty tree drop zone -->
  {#snippet dropPlaceholder()}
    <div class="drop-placeholder">
      <p>📥 Drag items here</p>
    </div>
  {/snippet}
</Tree>

<script>
  let isSaving = $state(false);

  // UPDATED: Drop handler now receives position and operation
  async function handleDrop(dropNode, draggedNode, position, event, operation) {
    // position: 'above' | 'below' | 'child'
    // operation: 'move' | 'copy'
    // dropNode: null when dropping to empty tree

    console.log(\`\${operation}: \${draggedNode.data.name} \${position} \${dropNode?.data?.name || 'root'}\`);

    isSaving = true;
    try {
      await saveToDatabase(draggedNode, dropNode, position, operation);
    } finally {
      isSaving = false;
    }
  }
</script>`}
					languageType="svelte"
					titleText="v4.5.0 Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Drop Positions</h6>
					<p>The <code>position</code> parameter tells you where to insert:</p>
					<ul class="small">
						<li><code>'above'</code> - As sibling before target</li>
						<li><code>'below'</code> - As sibling after target</li>
						<li><code>'child'</code> - As child of target</li>
					</ul>

					<h6>🌟 Glow Mode</h6>
					<p>Use <code>dragOverNodeClass="ltree-dragover-glow"</code> for visual position indicators with directional arrows.</p>

					<h6>📱 Touch Drag</h6>
					<ul class="small">
						<li>Long-press (300ms) starts drag</li>
						<li>Ghost element follows finger</li>
						<li>Haptic feedback on start</li>
					</ul>

					<h6>🔄 dragDropMode</h6>
					<ul class="small">
						<li><code>'self'</code> - Same tree only</li>
						<li><code>'cross'</code> - Between trees only</li>
						<li><code>'both'</code> - All operations (default)</li>
						<li><code>'none'</code> - Disable drag-drop</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Drop Zone Styles -->
		<ShowcaseSection
			titleText="DD05 Drop Zone Styles"
			subtitleText="Configure visual drop zone appearance with session storage persistence"
			demoColumnTitle="Interactive Demo"
			controlsColumnTitle="Configuration"
			descriptionColumnTitle="Style Options">

			{#snippet demoContent()}
				<div class="tree-demo">
					<div class="alert alert-info mb-3">
						<strong>💡 Try this:</strong> Drag items around and see different drop zone styles. Settings persist in session storage!
					</div>
					<Tree
						treeId="drop-zone-demo"
						data={dropZoneDemoData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						orderMember="sortOrder"
						isDragAndDropEnabled={true}
						{dragValidationCallback}
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						{dropZoneMode}
						{dropZoneLayout}
						{dropZoneStart}
						{dropZoneMaxWidth}
						{allowCopy}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label" for="dropZoneModeSelect">Drop Zone Mode</label>
						<select id="dropZoneModeSelect" class="form-select" bind:value={dropZoneMode}>
							<option value="glow">Glow (border indicators)</option>
							<option value="floating">Floating (popup zones)</option>
						</select>
						<small class="text-muted">
							{dropZoneMode === 'glow' ? 'Shows glowing borders on hover' : 'Shows floating drop target buttons'}
						</small>
					</div>

					{#if dropZoneMode === 'floating'}
						<div class="form-group mb-3">
							<label class="form-label" for="dropZoneLayoutSelect">Layout</label>
							<select id="dropZoneLayoutSelect" class="form-select" bind:value={dropZoneLayout}>
								<option value="around">Around (above + below/child)</option>
								<option value="above">Above (all 3 in row above)</option>
								<option value="below">Below (all 3 in row below)</option>
								<option value="wave">Wave (stacked vertically)</option>
								<option value="wave2">Wave2 (diagonal pattern)</option>
							</select>
						</div>

						<div class="form-group mb-3">
							<label class="form-label" for="dropZoneStartInput">Zone Start</label>
							<input
								id="dropZoneStartInput"
								type="text"
								class="form-control form-control-sm"
								bind:value={dropZoneStart}
								placeholder="33% or 50px"
							/>
							<small class="text-muted">Horizontal start position (e.g., "33%" or "50px")</small>
						</div>

						<div class="form-group mb-3">
							<label class="form-label" for="dropZoneMaxWidthInput">Max Width (px)</label>
							<input
								id="dropZoneMaxWidthInput"
								type="number"
								class="form-control form-control-sm"
								bind:value={dropZoneMaxWidth}
								min="50"
								max="300"
							/>
						</div>
					{/if}

					<div class="form-check mb-3">
						<input
							id="allowCopyCheck"
							type="checkbox"
							class="form-check-input"
							bind:checked={allowCopy}
						/>
						<label class="form-check-label" for="allowCopyCheck">
							Allow Ctrl+drag to copy
						</label>
					</div>

					<div class="alert alert-success small">
						<strong>💾 Session Storage:</strong> Settings are automatically saved and restored when you revisit this page.
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Drop Zone Modes</h4>
					<ul>
						<li><strong>Glow:</strong> Shows glowing border indicators (above/below/child arrows)</li>
						<li><strong>Floating:</strong> Shows popup buttons for drop positions</li>
					</ul>

					<h4>Floating Layouts</h4>
					<ul>
						<li><strong>Around:</strong> Above indicator on top, below/child on bottom</li>
						<li><strong>Above:</strong> All three indicators in a row above the node</li>
						<li><strong>Below:</strong> All three indicators in a row below the node</li>
						<li><strong>Wave:</strong> Stacked vertically on the right</li>
						<li><strong>Wave2:</strong> Diagonal pattern arrangement</li>
					</ul>

					<h4>Persistence</h4>
					<p>
						Settings are saved to <code>sessionStorage</code> automatically.
						Refresh the page to verify persistence!
					</p>
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
							<div class="display-6 mb-3">✨</div>
							<h5>Drag Highlight</h5>
							<p>Visual feedback during drag operations</p>
							<a href="/examples/drag-highlight" class="btn btn-primary">View Highlights</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">📝</div>
							<h5>Context Menus</h5>
							<p>Right-click actions and custom templates</p>
							<a href="/examples/context-menu" class="btn btn-outline-primary">Context Menus</a>
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