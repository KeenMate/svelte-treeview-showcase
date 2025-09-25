<script lang="ts">
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

	// Target data - drop zones
	let targetData = $state([
		{ id: 't1', path: '1', name: '📋 Project Status', type: 'container', isDraggable: false, isDropAllowed: true },
		{ id: 't2', path: '1.1', name: '🔄 In Progress', type: 'status', isDraggable: false, isDropAllowed: true, items: [] },
		{ id: 't3', path: '1.2', name: '✅ Completed', type: 'status', isDraggable: false, isDropAllowed: true, items: [] },
		{ id: 't4', path: '1.3', name: '🚫 Blocked', type: 'status', isDraggable: false, isDropAllowed: true, items: [] },
		{ id: 't5', path: '2', name: '📁 Team Assignments', type: 'container', isDraggable: false, isDropAllowed: true },
		{ id: 't6', path: '2.1', name: '👨‍💻 Frontend Team', type: 'team', isDraggable: false, isDropAllowed: true, items: [] },
		{ id: 't7', path: '2.2', name: '🔧 Backend Team', type: 'team', isDraggable: false, isDropAllowed: true, items: [] },
		{ id: 't8', path: '2.3', name: '🎨 Design Team', type: 'team', isDraggable: false, isDropAllowed: true, items: [] }
	]);

	// Simple reorganizable tree data
	let reorderData = $state([
		{ id: 'r1', path: '1', name: '📂 Frontend', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: 'r2', path: '1.1', name: 'components', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: 'r3', path: '1.1.1', name: 'Button.svelte', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: 'r4', path: '1.1.2', name: 'Tree.svelte', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: 'r5', path: '1.2', name: 'utils', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: 'r6', path: '1.2.1', name: 'helpers.js', type: 'file', isDraggable: true, isDropAllowed: false },
		{ id: 'r7', path: '2', name: '📂 Backend', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: 'r8', path: '2.1', name: 'api', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: 'r9', path: '2.1.1', name: 'users.js', type: 'file', isDraggable: true, isDropAllowed: false }
	]);

	// Event tracking
	let dragEventLog = $state<string[]>([]);
	let dropHistory = $state<string[]>([]);

	// Drag validation callback
	const dragValidationCallback = (draggedNode: any, targetNode: any, position: string) => {
		// Don't allow dropping files into files
		if (draggedNode.data.type === 'file' && targetNode.data.type === 'file') {
			return false;
		}

		// Don't allow dropping containers into their own children
		if (targetNode.path.startsWith(draggedNode.path + '.')) {
			return false;
		}

		// Allow dropping tasks into status containers
		if (draggedNode.data.type === 'task' && targetNode.data.type === 'status') {
			return true;
		}

		// Allow dropping resources into team containers
		if (draggedNode.data.type === 'resource' && targetNode.data.type === 'team') {
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

	const handleDrop = (dropNode: any, draggedNode: any, event: DragEvent) => {
		const message = `✅ Dropped: ${draggedNode.data.name} → ${dropNode.data.name}`;
		dragEventLog = [message, ...dragEventLog.slice(0, 9)];
		dropHistory = [message, ...dropHistory.slice(0, 4)];

		// Update the tree data for reorder demo
		if (draggedNode.id.startsWith('r')) {
			// Simple reorder logic for demo
			console.log('Reorder operation:', { dropNode, draggedNode });
		}
	};

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Sort callbacks
	const sortCallback = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree)
			const levelA = getLevel(a.path);
			const levelB = getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by type priority
			if (a.data.type !== b.data.type) {
				const typeOrder = { container: 0, folder: 1, status: 2, team: 3, task: 4, resource: 5, file: 6 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name
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
			titleText="Basic Drag & Drop"
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
								treeId="drag-drop-target-organization"
								data={targetData}
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
			titleText="Tree Reorganization"
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
			titleText="Configuration Options"
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