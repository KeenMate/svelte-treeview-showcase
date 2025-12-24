<script lang="ts">
	import { DocLayout, ShowcaseSection } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';
	import type { LTreeNode } from '@keenmate/svelte-treeview';

	type DemoNode = {
		id: number;
		path: string;
		name: string;
		icon: string;
		status?: string;
	};

	// Sample data
	function createInitialData(): DemoNode[] {
		return [
			{ id: 1, path: '1', name: 'Documents', icon: '📁' },
			{ id: 2, path: '1.1', name: 'Report.pdf', icon: '📄', status: 'final' },
			{ id: 3, path: '1.2', name: 'Notes.txt', icon: '📝', status: 'draft' },
			{ id: 4, path: '2', name: 'Images', icon: '📁' },
			{ id: 5, path: '2.1', name: 'Photo.jpg', icon: '🖼️' },
			{ id: 6, path: '2.2', name: 'Logo.png', icon: '🖼️' },
			{ id: 7, path: '3', name: 'Archive', icon: '📁' }
		];
	}

	let treeData = $state<DemoNode[]>(createInitialData());
	let selectedNodes = $state<Set<string>>(new Set());
	let activityLog = $state<string[]>([]);
	let lastChanges = $state<string>('');
	let nextId = $state(100);

	let treeRef: Tree<DemoNode>;

	function addLog(message: string) {
		activityLog = [...activityLog.slice(-14), `${new Date().toLocaleTimeString()} - ${message}`];
	}

	function onNodeClicked(node: LTreeNode<DemoNode>) {
		const path = node.path;
		if (selectedNodes.has(path)) {
			selectedNodes.delete(path);
		} else {
			selectedNodes.add(path);
		}
		selectedNodes = new Set(selectedNodes);
	}

	// Demo 1: Batch Create
	function batchCreate() {
		const changes = [
			{ operation: 'create' as const, parentPath: '3', data: { id: nextId++, path: '', name: `File ${nextId}`, icon: '📄' } },
			{ operation: 'create' as const, parentPath: '3', data: { id: nextId++, path: '', name: `File ${nextId}`, icon: '📄' } },
			{ operation: 'create' as const, parentPath: '3', data: { id: nextId++, path: '', name: `File ${nextId}`, icon: '📄' } }
		];

		lastChanges = JSON.stringify(changes, null, 2);
		const result = treeRef.applyChanges(changes);
		addLog(`Batch CREATE: ${result.successful} added, ${result.failed.length} failed`);
		treeRef.expandAll('3');
	}

	// Demo 2: Batch Update
	function batchUpdate() {
		const allData = treeRef.getAllData();
		const changes = allData
			.filter(n => n.icon === '📄' || n.icon === '📝')
			.map(n => ({
				operation: 'update' as const,
				path: n.path,
				data: { name: n.name + ' (updated)', status: 'modified' }
			}));

		if (changes.length === 0) {
			addLog('No files to update');
			return;
		}

		lastChanges = JSON.stringify(changes, null, 2);
		const result = treeRef.applyChanges(changes);
		addLog(`Batch UPDATE: ${result.successful} updated, ${result.failed.length} failed`);
	}

	// Demo 3: Batch Delete
	function batchDelete() {
		if (selectedNodes.size === 0) {
			addLog('Select nodes first (click to toggle selection)');
			return;
		}

		const changes = Array.from(selectedNodes).map(path => ({
			operation: 'delete' as const,
			path
		}));

		lastChanges = JSON.stringify(changes, null, 2);
		const result = treeRef.applyChanges(changes);
		addLog(`Batch DELETE: ${result.successful} removed, ${result.failed.length} failed`);
		selectedNodes = new Set();
	}

	// Demo 4: Mixed Operations
	function mixedOperations() {
		const changes = [
			{ operation: 'create' as const, parentPath: '', data: { id: nextId++, path: '', name: 'New Folder', icon: '📁' } },
			{ operation: 'update' as const, path: '1', data: { name: 'My Documents' } },
			{ operation: 'update' as const, path: '2', data: { name: 'My Images' } }
		];

		lastChanges = JSON.stringify(changes, null, 2);
		const result = treeRef.applyChanges(changes);
		addLog(`Mixed operations: ${result.successful} successful, ${result.failed.length} failed`);
	}

	function reset() {
		treeData = createInitialData();
		selectedNodes = new Set();
		activityLog = [];
		lastChanges = '';
		nextId = 100;
		addLog('Reset to initial state');
	}

	function sortCallback(items: LTreeNode<DemoNode>[]) {
		return [...items].sort((a, b) => (a.data?.name || '').localeCompare(b.data?.name || ''));
	}
</script>

<DocLayout
	titleText="Batch Operations"
	descriptionText="Use applyChanges() to perform multiple tree mutations with a single re-render">

	<div class="py-1">
		<!-- BO01: Batch Operations Demo -->
		<ShowcaseSection
			titleText="BO01 Batch Operations with applyChanges"
			subtitleText="Perform multiple create, update, and delete operations in a single call"
			col1Title="Live Demo"
			col2Title="Operations"
			col3Title="Description">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						bind:this={treeRef}
						data={treeData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						sortCallback={sortCallback}
						expandLevel={3}
						onNodeClicked={onNodeClicked}
					>
						{#snippet nodeTemplate(node)}
							<span class:selected={selectedNodes.has(node.path)}>
								{node.data?.icon} {node.data?.name}
								{#if node.data?.status}
									<small class="status">({node.data.status})</small>
								{/if}
							</span>
						{/snippet}
					</Tree>
				</div>

				<!-- Activity Log -->
				<div class="log-section">
					<h5>Activity Log</h5>
					<div class="output">
						{#if activityLog.length > 0}
							<pre>{activityLog.join('\n')}</pre>
						{:else}
							<p class="empty-log">Try the operations on the right.</p>
						{/if}
					</div>
				</div>

				<!-- Last Changes -->
				{#if lastChanges}
					<div class="log-section">
						<h5>Last Changes Array</h5>
						<div class="output">
							<pre>{lastChanges}</pre>
						</div>
					</div>
				{/if}
			{/snippet}

			{#snippet controlsContent()}
				<div class="controls-stack">
					<p class="hint">Click nodes to select for deletion</p>

					<button class="btn btn-primary w-100" onclick={batchCreate}>
						Create 3 Files in Archive
					</button>

					<button class="btn btn-outline-primary w-100" onclick={batchUpdate}>
						Update All File Names
					</button>

					<button class="btn btn-outline-danger w-100" onclick={batchDelete} disabled={selectedNodes.size === 0}>
						Delete Selected ({selectedNodes.size})
					</button>

					<button class="btn btn-secondary w-100" onclick={mixedOperations}>
						Mixed: Create + Update
					</button>

					<hr />

					<button class="btn btn-outline-secondary w-100" onclick={reset}>
						Reset Tree
					</button>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<p>
					The <code>applyChanges()</code> method allows you to perform multiple tree operations
					in a single call with a single re-render.
				</p>

				<h5>Benefits</h5>
				<ul>
					<li><strong>Performance</strong> - Single re-render for all changes</li>
					<li><strong>Atomicity</strong> - All operations processed together</li>
					<li><strong>Error tracking</strong> - Detailed failure info</li>
				</ul>

				<h5>API</h5>
				<pre class="code-block">{`type TreeChange<T> =
  | { operation: 'create'; parentPath: string; data: T }
  | { operation: 'update'; path: string; data: Partial<T> }
  | { operation: 'delete'; path: string };

interface ApplyChangesResult {
  successful: number;
  failed: Array<{
    index: number;
    operation: string;
    path: string;
    error: string;
  }>;
}`}</pre>
			{/snippet}
		</ShowcaseSection>

		<!-- BO02: Code Examples -->
		<ShowcaseSection
			titleText="BO02 Code Examples"
			subtitleText="Common patterns for using applyChanges"
			col1Title="Code"
			col2Title="Use Case"
			col3Title="When to Use">

			{#snippet demoContent()}
				<h5>Batch Create</h5>
				<pre class="code-block">{`const changes = [
  { operation: 'create', parentPath: 'folder1', data: { id: 1, name: 'File A' } },
  { operation: 'create', parentPath: 'folder1', data: { id: 2, name: 'File B' } },
  { operation: 'create', parentPath: 'folder2', data: { id: 3, name: 'File C' } }
];
const result = treeRef.applyChanges(changes);
console.log(\`Created \${result.successful} nodes\`);`}</pre>

				<h5>Batch Update</h5>
				<pre class="code-block">{`const changes = [
  { operation: 'update', path: '1.1', data: { name: 'New Name', status: 'active' } },
  { operation: 'update', path: '1.2', data: { name: 'Another Name' } },
  { operation: 'update', path: '2.1', data: { icon: '📋' } }
];
treeRef.applyChanges(changes);`}</pre>

				<h5>Batch Delete</h5>
				<pre class="code-block">{`const changes = [
  { operation: 'delete', path: '1.1' },
  { operation: 'delete', path: '1.2' },
  { operation: 'delete', path: '2.1' }
];
const result = treeRef.applyChanges(changes);
if (result.failed.length > 0) {
  console.error('Some deletions failed:', result.failed);
}`}</pre>

				<h5>Replace Branch</h5>
				<pre class="code-block">{`const oldChildren = treeRef.getChildren(folderPath);
const newChildren = await fetchFromServer(folderPath);

const changes = [
  ...oldChildren.map(c => ({ operation: 'delete', path: c.path })),
  ...newChildren.map(c => ({ operation: 'create', parentPath: folderPath, data: c }))
];

treeRef.applyChanges(changes);`}</pre>
			{/snippet}

			{#snippet controlsContent()}
				<h5>Batch Create</h5>
				<p>Add multiple nodes at once after importing data, loading from API, or bulk user action.</p>

				<h5>Batch Update</h5>
				<p>Update properties across multiple nodes - rename, change status, toggle flags, etc.</p>

				<h5>Batch Delete</h5>
				<p>Remove multiple selected nodes. Check <code>result.failed</code> for any nodes that couldn't be deleted.</p>

				<h5>Replace Branch</h5>
				<p>Refresh a folder's contents from server - delete old children and add new ones in one operation.</p>
			{/snippet}

			{#snippet descriptionContent()}
				<h5>When to use applyChanges</h5>
				<ul>
					<li><strong>Multiple operations</strong> - When you have 2+ changes to make</li>
					<li><strong>Performance critical</strong> - Large trees where re-renders are costly</li>
					<li><strong>Atomic updates</strong> - When changes are logically related</li>
					<li><strong>Server sync</strong> - Applying a batch of changes from an API response</li>
				</ul>

				<h5>When to use individual methods</h5>
				<ul>
					<li><strong>Single change</strong> - Just use <code>addNode()</code>, <code>updateNode()</code>, or <code>removeNode()</code> directly</li>
					<li><strong>Immediate feedback</strong> - When each change needs individual error handling</li>
				</ul>

				<h5>Error Handling</h5>
				<p>Always check <code>result.failed</code> array for operations that didn't succeed. Each failure includes the index, operation type, path, and error message.</p>
			{/snippet}
		</ShowcaseSection>
	</div>
</DocLayout>

<style>
	.tree-demo {
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		padding: 0.5rem;
		min-height: 200px;
		max-height: 300px;
		overflow: auto;
		background: #fafafa;
	}

	.controls-stack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.hint {
		font-size: 0.875rem;
		color: #64748b;
		font-style: italic;
		margin: 0 0 0.5rem 0;
	}

	.log-section {
		margin-top: 1rem;
	}

	.log-section h5 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
	}

	.output {
		background: #1e293b;
		color: #e2e8f0;
		border-radius: 4px;
		padding: 0.5rem;
		font-family: monospace;
		font-size: 0.75rem;
		max-height: 120px;
		overflow: auto;
	}

	.output pre {
		margin: 0;
		white-space: pre-wrap;
	}

	.empty-log {
		color: #64748b;
		font-style: italic;
		margin: 0;
	}

	.selected {
		background: #dbeafe;
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
	}

	.status {
		color: #64748b;
		font-size: 0.75rem;
	}

	.code-block {
		background: #1e293b;
		color: #e2e8f0;
		border-radius: 4px;
		padding: 0.75rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.75rem;
		line-height: 1.4;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	h5 {
		margin: 1rem 0 0.5rem 0;
		font-size: 0.9rem;
		color: #374151;
	}

	h5:first-child {
		margin-top: 0;
	}

	code {
		background: #e0e7ff;
		color: #4338ca;
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
		font-size: 0.85rem;
	}
</style>
