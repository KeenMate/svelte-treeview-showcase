<script lang="ts">
	import { onMount } from 'svelte';
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree, type DropPosition, type LTreeNode } from '@keenmate/svelte-treeview';

	// === Demo Data Types ===
	type DemoItem = {
		id: string;
		path: string;
		name: string;
		type: string;
		isDraggable: boolean;
		isDropAllowed: boolean;
		sortOrder: number;
		allowedDropPositions?: DropPosition[];
	};

	// === Main Demo: Two trees side by side ===
	let sourceData = $state<DemoItem[]>([
		{ id: 's1', path: '1', name: '📋 Tasks', type: 'folder', isDraggable: false, isDropAllowed: false, sortOrder: 10 },
		{ id: 's2', path: '1.1', name: '📝 Design mockups', type: 'task', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 's3', path: '1.2', name: '💻 Frontend dev', type: 'task', isDraggable: true, isDropAllowed: false, sortOrder: 20 },
		{ id: 's4', path: '1.3', name: '🔧 Backend API', type: 'task', isDraggable: true, isDropAllowed: false, sortOrder: 30 },
		{ id: 's5', path: '2', name: '📁 Resources', type: 'folder', isDraggable: false, isDropAllowed: false, sortOrder: 20 },
		{ id: 's6', path: '2.1', name: '📖 Docs', type: 'resource', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 's7', path: '2.2', name: '🖼️ Assets', type: 'resource', isDraggable: true, isDropAllowed: false, sortOrder: 20 },
	]);

	let targetData = $state<DemoItem[]>([
		{ id: 't1', path: '1', name: '🔄 In Progress', type: 'status', isDraggable: false, isDropAllowed: true, sortOrder: 10 },
		{ id: 't2', path: '2', name: '✅ Completed', type: 'status', isDraggable: false, isDropAllowed: true, sortOrder: 20 },
		{ id: 't3', path: '3', name: '🗑️ Trash', type: 'trash', isDraggable: false, isDropAllowed: true, sortOrder: 30, allowedDropPositions: ['child'] },
	]);

	let targetTreeRef: Tree<DemoItem>;
	let nextId = $state(100);
	let dropLog = $state<string[]>([]);

	// === Drop Zone Configuration ===
	let dropZoneMode = $state<'floating' | 'glow'>('glow');
	let dropZoneLayout = $state<'around' | 'above' | 'below' | 'wave' | 'wave2'>('around');
	let allowCopy = $state(false);

	// Load/save settings
	onMount(() => {
		const saved = sessionStorage.getItem('dropZoneConfig');
		if (saved) {
			try {
				const c = JSON.parse(saved);
				if (c.mode) dropZoneMode = c.mode;
				if (c.layout) dropZoneLayout = c.layout;
				if (c.allowCopy !== undefined) allowCopy = c.allowCopy;
			} catch {}
		}
	});

	$effect(() => {
		sessionStorage.setItem('dropZoneConfig', JSON.stringify({ mode: dropZoneMode, layout: dropZoneLayout, allowCopy }));
	});

	// === Advanced Features Demo ===
	let advancedData = $state<DemoItem[]>([
		{ id: 'a1', path: '1', name: '🗑️ Trash (child only)', type: 'trash', isDraggable: false, isDropAllowed: true, sortOrder: 10, allowedDropPositions: ['child'] },
		{ id: 'a2', path: '1.1', name: 'Deleted file', type: 'file', isDraggable: true, isDropAllowed: false, sortOrder: 10 },
		{ id: 'a3', path: '2', name: '📁 Folder (all positions)', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 20 },
		{ id: 'a4', path: '2.1', name: 'Subfolder', type: 'folder', isDraggable: true, isDropAllowed: true, sortOrder: 10 },
		{ id: 'a5', path: '3', name: '📄 File (above/below only)', type: 'file', isDraggable: true, isDropAllowed: true, sortOrder: 30, allowedDropPositions: ['above', 'below'] },
		{ id: 'a6', path: '4', name: '📄 Another file', type: 'file', isDraggable: true, isDropAllowed: true, sortOrder: 40, allowedDropPositions: ['above', 'below'] },
		{ id: 'a7', path: '5', name: '🔵 Drag me', type: 'item', isDraggable: true, isDropAllowed: false, sortOrder: 50 },
	]);

	let advancedLog = $state<string[]>([]);
	let asyncPending = $state(false);

	// Callback-based allowed positions (alternative to member)
	function getAllowedDropPositionsCallback(node: LTreeNode<DemoItem>): DropPosition[] | null | undefined {
		// Dynamic logic: files can only be reordered, trash only accepts children
		if (node.data?.type === 'file') return ['above', 'below'];
		if (node.data?.type === 'trash') return ['child'];
		return undefined; // All positions allowed
	}

	// Async beforeDropCallback demo
	async function beforeDropCallback(
		dropNode: LTreeNode<DemoItem> | null,
		draggedNode: LTreeNode<DemoItem>,
		position: DropPosition,
		event: DragEvent | TouchEvent,
		operation: string
	): Promise<boolean> {
		// Simulate async confirmation for trash
		if (dropNode?.data?.type === 'trash') {
			asyncPending = true;
			await new Promise(r => setTimeout(r, 800));
			asyncPending = false;
			advancedLog = [`⏳ Confirmed move to Trash`, ...advancedLog.slice(0, 4)];
		}
		return true;
	}

	// === Handlers ===
	function sortCallback(items: LTreeNode<DemoItem>[]) {
		return items.sort((a, b) => {
			const levelA = a.path.split('.').length;
			const levelB = b.path.split('.').length;
			if (levelA !== levelB) return levelA - levelB;
			return (a.data?.sortOrder ?? 0) - (b.data?.sortOrder ?? 0);
		});
	}

	function handleMainDrop(dropNode: LTreeNode<DemoItem> | null, draggedNode: LTreeNode<DemoItem>, position: DropPosition, event: DragEvent | TouchEvent, operation: string) {
		const msg = `${operation === 'copy' ? '📋' : '➡️'} ${draggedNode.data?.name} → ${dropNode?.data?.name || 'root'} (${position})`;
		dropLog = [msg, ...dropLog.slice(0, 4)];

		// Cross-tree: add to target
		if (draggedNode.data?.id?.startsWith('s')) {
			const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));
			const sortOrder = dropNode?.data?.sortOrder ?? 10;
			targetTreeRef.addNode(parentPath, {
				...draggedNode.data,
				id: `t${nextId++}`,
				path: '',
				sortOrder: position === 'above' ? sortOrder - 5 : sortOrder + 5
			});
		}
	}

	function handleAdvancedDrop(dropNode: LTreeNode<DemoItem> | null, draggedNode: LTreeNode<DemoItem>, position: DropPosition) {
		const restriction = dropNode?.data?.allowedDropPositions?.join('/') || 'all';
		advancedLog = [`✅ ${draggedNode.data?.name} → ${dropNode?.data?.name} (${position}) [${restriction}]`, ...advancedLog.slice(0, 4)];
	}
</script>

<DocLayout
	titleText="Drag & Drop"
	descriptionText="Interactive drag and drop with visual feedback, validation, and position control">

	<div class="py-1">
		<!-- Main Interactive Demo -->
		<ShowcaseSection
			titleText="Interactive Demo"
			subtitleText="Drag between trees with configurable drop zones"
			col1Title="Demo"
			col2Title="Controls"
			col3Title="Features">

			{#snippet demoContent()}
				<div class="row g-2">
					<div class="col-6">
						<div class="small text-muted mb-1">Source (drag from here)</div>
						<div class="tree-demo" style="min-height: 200px;">
							<Tree
								treeId="source"
								data={sourceData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								orderMember="sortOrder"
								{sortCallback}
								expandLevel={3}
								{dropZoneMode}
								{dropZoneLayout}
								{allowCopy}
							/>
						</div>
					</div>
					<div class="col-6">
						<div class="small text-muted mb-1">Target (drop here) - Trash only accepts 'child'</div>
						<div class="tree-demo" style="min-height: 200px;">
							<Tree
								bind:this={targetTreeRef}
								treeId="target"
								data={targetData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								orderMember="sortOrder"
								allowedDropPositionsMember="allowedDropPositions"
								{sortCallback}
								expandLevel={3}
								{dropZoneMode}
								{dropZoneLayout}
								{allowCopy}
								onNodeDrop={handleMainDrop}
							/>
						</div>
					</div>
				</div>
				{#if dropLog.length > 0}
					<div class="mt-2 small font-monospace bg-light p-2 rounded">
						{#each dropLog as log}<div>{log}</div>{/each}
					</div>
				{/if}
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="mb-2">
						<label class="form-label small mb-1">Drop Zone Mode</label>
						<select class="form-select form-select-sm" bind:value={dropZoneMode}>
							<option value="glow">Glow (border indicators)</option>
							<option value="floating">Floating (popup buttons)</option>
						</select>
					</div>
					{#if dropZoneMode === 'floating'}
						<div class="mb-2">
							<label class="form-label small mb-1">Layout</label>
							<select class="form-select form-select-sm" bind:value={dropZoneLayout}>
								<option value="around">Around</option>
								<option value="above">Above</option>
								<option value="below">Below</option>
								<option value="wave">Wave</option>
								<option value="wave2">Wave2</option>
							</select>
						</div>
					{/if}
					<div class="form-check">
						<input type="checkbox" class="form-check-input" id="allowCopy" bind:checked={allowCopy} />
						<label class="form-check-label small" for="allowCopy">Ctrl+drag to copy</label>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose small">
					<h6>Drop Positions</h6>
					<ul class="mb-2">
						<li><code>above</code> - Insert as sibling before</li>
						<li><code>below</code> - Insert as sibling after</li>
						<li><code>child</code> - Insert as child</li>
					</ul>
					<h6>Key Props</h6>
					<ul class="mb-2">
						<li><code>dropZoneMode</code> - 'glow' | 'floating'</li>
						<li><code>allowCopy</code> - Enable Ctrl+drag</li>
						<li><code>orderMember</code> - Sibling sort order</li>
					</ul>
					<h6>Touch Support</h6>
					<p class="mb-0">Long-press (300ms) to drag on mobile.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Advanced Features -->
		<ShowcaseSection
			titleText="Advanced Features"
			subtitleText="Restricted positions, async callbacks, and dynamic rules"
			col1Title="Demo"
			col2Title="Code"
			col3Title="Details">

			{#snippet demoContent()}
				<div class="tree-demo position-relative">
					{#if asyncPending}
						<div class="position-absolute top-0 start-0 end-0 bottom-0 bg-white bg-opacity-75 d-flex align-items-center justify-content-center" style="z-index: 10;">
							<div class="spinner-border spinner-border-sm me-2"></div> Confirming...
						</div>
					{/if}
					<div class="alert alert-info small py-1 px-2 mb-2">
						<strong>Try:</strong> 🗑️ Trash = child only | 📁 Folder = all | 📄 File = above/below only
					</div>
					<Tree
						treeId="advanced"
						data={advancedData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						orderMember="sortOrder"
						getAllowedDropPositionsCallback={getAllowedDropPositionsCallback}
						{beforeDropCallback}
						{sortCallback}
						expandLevel={3}
						{dropZoneMode}
						onNodeDrop={handleAdvancedDrop}
					>
						{#snippet nodeTemplate(node)}
							<span>{node.data?.name}</span>
							{#if node.data?.allowedDropPositions}
								<small class="text-muted ms-1" style="font-size: 0.65em;">
									({node.data.allowedDropPositions.join('/')})
								</small>
							{/if}
						{/snippet}
					</Tree>
					{#if advancedLog.length > 0}
						<div class="mt-2 small font-monospace">
							{#each advancedLog as log}<div class="text-success">{log}</div>{/each}
						</div>
					{/if}
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Option 1: Member property (from server data)
const data = [
  { name: 'Trash', allowedDropPositions: ['child'] },
  { name: 'File', allowedDropPositions: ['above', 'below'] },
  { name: 'Folder' }, // undefined = all allowed
];
<Tree allowedDropPositionsMember="allowedDropPositions" />

// Option 2: Callback (dynamic logic)
function getAllowedDropPositionsCallback(node) {
  if (node.data?.type === 'file') return ['above', 'below'];
  if (node.data?.type === 'trash') return ['child'];
  return undefined; // All positions
}
<Tree getAllowedDropPositionsCallback={callback} />

// Async beforeDropCallback (v4.6.0)
async function beforeDropCallback(dropNode, draggedNode, position, event, operation) {
  if (dropNode?.data?.isTrash) {
    const confirmed = await showConfirmDialog('Move to trash?');
    return confirmed; // false cancels drop
  }
  return true;
}`}
					languageType="typescript"
					titleText="Restricted Positions & Async"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose small">
					<h6>allowedDropPositions</h6>
					<p>Restrict which positions are valid per node:</p>
					<ul class="mb-2">
						<li><code>['child']</code> - Trash folders</li>
						<li><code>['above', 'below']</code> - Files (no nesting)</li>
						<li><code>undefined</code> - All allowed (default)</li>
					</ul>

					<h6>Two Ways to Set</h6>
					<ul class="mb-2">
						<li><code>allowedDropPositionsMember</code> - Static from data</li>
						<li><code>getAllowedDropPositionsCallback</code> - Dynamic logic</li>
					</ul>

					<h6>beforeDropCallback</h6>
					<p class="mb-0">Async validation before drop. Return <code>false</code> to cancel, or modify position/operation.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- API Reference -->
		<ShowcaseSection
			titleText="API Reference"
			subtitleText="All drag & drop related properties"
			col1Title="Properties"
			col2Title="Events"
			col3Title="Data Properties">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-sm small">
						<thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
						<tbody>
							<tr><td><code>dropZoneMode</code></td><td>'glow' | 'floating'</td><td>Visual style for drop indicators</td></tr>
							<tr><td><code>dropZoneLayout</code></td><td>string</td><td>Floating layout: around, above, below, wave, wave2</td></tr>
							<tr><td><code>allowCopy</code></td><td>boolean</td><td>Enable Ctrl+drag to copy</td></tr>
							<tr><td><code>autoHandleCopy</code></td><td>boolean</td><td>Auto-handle same-tree copy (default: true)</td></tr>
							<tr><td><code>dragDropMode</code></td><td>string</td><td>none | self | cross | both</td></tr>
							<tr><td><code>orderMember</code></td><td>string</td><td>Data property for sibling sort order</td></tr>
							<tr><td><code>allowedDropPositionsMember</code></td><td>string</td><td>Data property for allowed positions array</td></tr>
							<tr><td><code>getAllowedDropPositionsCallback</code></td><td>function</td><td>Dynamic allowed positions per node</td></tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="table-responsive">
					<table class="table table-sm small">
						<thead><tr><th>Event</th><th>Parameters</th></tr></thead>
						<tbody>
							<tr><td><code>onNodeDragStart</code></td><td>(node, event)</td></tr>
							<tr><td><code>onNodeDragOver</code></td><td>(node, event)</td></tr>
							<tr><td><code>beforeDropCallback</code></td><td>(dropNode, draggedNode, position, event, operation) → bool | Promise</td></tr>
							<tr><td><code>onNodeDrop</code></td><td>(dropNode, draggedNode, position, event, operation)</td></tr>
						</tbody>
					</table>
					<div class="alert alert-info small py-1 px-2 mt-2">
						<strong>Position:</strong> 'above' | 'below' | 'child'<br/>
						<strong>Operation:</strong> 'move' | 'copy'
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="table-responsive">
					<table class="table table-sm small">
						<thead><tr><th>Data Property</th><th>Type</th><th>Description</th></tr></thead>
						<tbody>
							<tr><td><code>isDraggable</code></td><td>boolean</td><td>Can this node be dragged?</td></tr>
							<tr><td><code>isDropAllowed</code></td><td>boolean</td><td>Can drop on this node?</td></tr>
							<tr><td><code>allowedDropPositions</code></td><td>DropPosition[]</td><td>['above', 'below', 'child']</td></tr>
						</tbody>
					</table>
					<div class="alert alert-warning small py-1 px-2 mt-2">
						<strong>Tip:</strong> Use <code>isDraggableMember</code> and <code>isDropAllowedMember</code> props to map custom property names.
					</div>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Related Links -->
		<div class="mt-3">
			<div class="row g-2">
				<div class="col-md-4">
					<a href="/examples/drag-drop-scenarios" class="card text-decoration-none h-100">
						<div class="card-body text-center py-2">
							<div class="h5 mb-1">💼</div>
							<div class="small">D&D Scenarios</div>
						</div>
					</a>
				</div>
				<div class="col-md-4">
					<a href="/examples/drag-highlight" class="card text-decoration-none h-100">
						<div class="card-body text-center py-2">
							<div class="h5 mb-1">✨</div>
							<div class="small">Drag Highlight</div>
						</div>
					</a>
				</div>
				<div class="col-md-4">
					<a href="/examples/tree-editor" class="card text-decoration-none h-100">
						<div class="card-body text-center py-2">
							<div class="h5 mb-1">📝</div>
							<div class="small">Tree Editor</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</DocLayout>
