<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

	// Sample data for tree editing demo
	let treeData = $state([
		{ id: '1', path: '1', name: 'Root Folder', sortOrder: 10 },
		{ id: '1.1', path: '1.1', name: 'Documents', sortOrder: 10 },
		{ id: '1.1.1', path: '1.1.1', name: 'Report.pdf', sortOrder: 10 },
		{ id: '1.1.2', path: '1.1.2', name: 'Notes.txt', sortOrder: 20 },
		{ id: '1.2', path: '1.2', name: 'Images', sortOrder: 20 },
		{ id: '1.2.1', path: '1.2.1', name: 'Photo.jpg', sortOrder: 10 },
		{ id: '2', path: '2', name: 'Archive', sortOrder: 20 }
	]);

	// Tree reference
	let treeRef: Tree<typeof treeData[0]>;
	let selectedNode = $state<LTreeNode<typeof treeData[0]> | null>(null);

	// Operation log
	let operationLog = $state<string[]>([]);

	// ID counter for new nodes
	let nextId = $state(100);

	// Add to log
	function log(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		operationLog = [`[${timestamp}] ${message}`, ...operationLog.slice(0, 9)];
	}

	// Sort callback by sortOrder
	const sortCallback = (items: any[]) => {
		return items.sort((a, b) => {
			const orderA = a.data?.sortOrder ?? 10;
			const orderB = b.data?.sortOrder ?? 10;
			return orderA - orderB;
		});
	};

	// Node clicked handler
	function handleNodeClicked(node: LTreeNode<typeof treeData[0]>) {
		selectedNode = node;
		log(`Selected: ${node.data?.name} (${node.path})`);
	}

	// Add a new child node to selected node
	function addChildNode() {
		if (!selectedNode) {
			log('Please select a parent node first');
			return;
		}

		const newId = `${nextId++}`;
		const newNode = {
			id: newId,
			path: '', // Will be assigned by addNode
			name: `New Item ${newId}`,
			sortOrder: 10
		};

		const result = treeRef.addNode(selectedNode.path, newNode);
		if (result.success) {
			log(`Added child to ${selectedNode.data?.name}: ${newNode.name}`);
			// Update data to trigger reactivity
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to add: ${result.error}`);
		}
	}

	// Add a sibling node after selected node
	function addSiblingNode() {
		if (!selectedNode || !selectedNode.parentPath) {
			log('Please select a non-root node');
			return;
		}

		const newId = `${nextId++}`;
		const newNode = {
			id: newId,
			path: '',
			name: `Sibling ${newId}`,
			sortOrder: (selectedNode.data?.sortOrder ?? 10) + 5
		};

		const result = treeRef.addNode(selectedNode.parentPath, newNode);
		if (result.success) {
			log(`Added sibling: ${newNode.name}`);
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to add: ${result.error}`);
		}
	}

	// Remove selected node
	function removeSelectedNode() {
		if (!selectedNode) {
			log('Please select a node to remove');
			return;
		}

		const nodeName = selectedNode.data?.name;
		const result = treeRef.removeNode(selectedNode.path, true);
		if (result.success) {
			log(`Removed: ${nodeName} (${result.removedCount} nodes)`);
			selectedNode = null;
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to remove: ${result.error}`);
		}
	}

	// Move selected node up (decrease sortOrder)
	function moveNodeUp() {
		if (!selectedNode) {
			log('Please select a node to move');
			return;
		}

		const siblings = treeRef.getSiblings(selectedNode.path);
		const currentIndex = siblings.findIndex(s => s.path === selectedNode?.path);

		if (currentIndex <= 0) {
			log('Node is already at the top');
			return;
		}

		const targetNode = siblings[currentIndex - 1];
		const result = treeRef.moveNode(selectedNode.path, targetNode.path, 'above');
		if (result.success) {
			log(`Moved ${selectedNode.data?.name} up`);
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to move: ${result.error}`);
		}
	}

	// Move selected node down (increase sortOrder)
	function moveNodeDown() {
		if (!selectedNode) {
			log('Please select a node to move');
			return;
		}

		const siblings = treeRef.getSiblings(selectedNode.path);
		const currentIndex = siblings.findIndex(s => s.path === selectedNode?.path);

		if (currentIndex >= siblings.length - 1) {
			log('Node is already at the bottom');
			return;
		}

		const targetNode = siblings[currentIndex + 1];
		const result = treeRef.moveNode(selectedNode.path, targetNode.path, 'below');
		if (result.success) {
			log(`Moved ${selectedNode.data?.name} down`);
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to move: ${result.error}`);
		}
	}

	// Update selected node name
	let newNodeName = $state('');
	function updateNodeName() {
		if (!selectedNode || !newNodeName.trim()) {
			log('Please select a node and enter a new name');
			return;
		}

		const result = treeRef.updateNode(selectedNode.path, { name: newNodeName.trim() });
		if (result.success) {
			log(`Renamed to: ${newNodeName.trim()}`);
			newNodeName = '';
			treeData = treeRef.getAllData();
		} else {
			log(`Failed to rename: ${result.error}`);
		}
	}

	// Reset tree data
	function resetTree() {
		treeData = [
			{ id: '1', path: '1', name: 'Root Folder', sortOrder: 10 },
			{ id: '1.1', path: '1.1', name: 'Documents', sortOrder: 10 },
			{ id: '1.1.1', path: '1.1.1', name: 'Report.pdf', sortOrder: 10 },
			{ id: '1.1.2', path: '1.1.2', name: 'Notes.txt', sortOrder: 20 },
			{ id: '1.2', path: '1.2', name: 'Images', sortOrder: 20 },
			{ id: '1.2.1', path: '1.2.1', name: 'Photo.jpg', sortOrder: 10 },
			{ id: '2', path: '2', name: 'Archive', sortOrder: 20 }
		];
		selectedNode = null;
		operationLog = [];
		nextId = 100;
		log('Tree reset to initial state');
	}
</script>

<DocLayout
	titleText="Tree Editor Example"
	descriptionText="Demonstrates tree manipulation methods: addNode, removeNode, moveNode, updateNode">

	<div class="py-1">

		<!-- Interactive Editor Section -->
		<ShowcaseSection
			titleText="Interactive Tree Editor"
			subtitleText="Click nodes to select, then use buttons to add, remove, or move nodes"
			col1Title="Tree"
			col2Title="Editor Controls"
			col3Title="Operation Log">

			{#snippet demoContent()}
				<div class="tree-demo" style="min-height: 350px; border: 1px solid #dee2e6; border-radius: 4px; padding: 8px;">
					<Tree
						bind:this={treeRef}
						treeId="tree-editor-demo"
						data={treeData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						expandLevel={5}
						orderMember="sortOrder"
						shouldToggleOnNodeClick={true}
						onNodeClicked={handleNodeClicked}
						{sortCallback}
					/>
				</div>
				{#if selectedNode}
					<div class="mt-2 p-2 bg-light border rounded">
						<small>
							<strong>Selected:</strong> {selectedNode.data?.name}<br>
							<strong>Path:</strong> {selectedNode.path}
						</small>
					</div>
				{:else}
					<div class="mt-2 p-2 bg-light border rounded text-muted">
						<small>Click a node to select it</small>
					</div>
				{/if}
			{/snippet}

			{#snippet controlsContent()}
				<div class="editor-controls">
					<div class="mb-3">
						<h6>Add Nodes</h6>
						<div class="d-flex gap-2 mb-2">
							<button class="btn btn-success btn-sm" onclick={addChildNode} disabled={!selectedNode}>
								+ Add Child
							</button>
							<button class="btn btn-outline-success btn-sm" onclick={addSiblingNode} disabled={!selectedNode || !selectedNode.parentPath}>
								+ Add Sibling
							</button>
						</div>
					</div>

					<div class="mb-3">
						<h6>Move Node</h6>
						<div class="d-flex gap-2 mb-2">
							<button class="btn btn-primary btn-sm" onclick={moveNodeUp} disabled={!selectedNode}>
								Move Up
							</button>
							<button class="btn btn-primary btn-sm" onclick={moveNodeDown} disabled={!selectedNode}>
								Move Down
							</button>
						</div>
					</div>

					<div class="mb-3">
						<h6>Rename Node</h6>
						<div class="input-group input-group-sm mb-2">
							<input
								type="text"
								class="form-control"
								placeholder="New name..."
								bind:value={newNodeName}
								disabled={!selectedNode}
							>
							<button class="btn btn-warning" onclick={updateNodeName} disabled={!selectedNode || !newNodeName.trim()}>
								Rename
							</button>
						</div>
					</div>

					<div class="mb-3">
						<h6>Remove Node</h6>
						<button class="btn btn-danger btn-sm" onclick={removeSelectedNode} disabled={!selectedNode}>
							Remove Selected
						</button>
					</div>

					<hr>
					<button class="btn btn-secondary btn-sm" onclick={resetTree}>
						Reset Tree
					</button>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="operation-log">
					<h6>Operation Log</h6>
					<div class="log-container" style="max-height: 300px; overflow-y: auto;">
						{#if operationLog.length === 0}
							<div class="text-muted">
								<small>Operations will be logged here...</small>
							</div>
						{:else}
							{#each operationLog as entry}
								<div class="mb-1">
									<small><code>{entry}</code></small>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Methods Reference Section -->
		<ShowcaseSection
			titleText="Tree Editor Methods (v4.5.0+)"
			subtitleText="Public methods for programmatic tree manipulation"
			col1Title="Method Reference"
			col2Title="Usage Examples"
			col3Title="Return Types">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover table-sm">
						<thead class="table-dark">
							<tr>
								<th>Method</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>addNode(parentPath, data)</code></td>
								<td>Add a new node as child of parent</td>
							</tr>
							<tr>
								<td><code>removeNode(path, includeDescendants?)</code></td>
								<td>Remove node (and optionally children)</td>
							</tr>
							<tr>
								<td><code>moveNode(source, target, position)</code></td>
								<td>Move node to new position</td>
							</tr>
							<tr>
								<td><code>updateNode(path, changes)</code></td>
								<td>Update node data properties</td>
							</tr>
							<tr>
								<td><code>getSiblings(path)</code></td>
								<td>Get sibling nodes at same level</td>
							</tr>
							<tr>
								<td><code>getChildren(path)</code></td>
								<td>Get direct children of a node</td>
							</tr>
							<tr>
								<td><code>getAllData()</code></td>
								<td>Get all data as flat array</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script lang="ts">
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef: Tree<MyData>;
  let data = $state([...]);

  // Add a child node
  function addChild(parentPath: string) {
    const result = treeRef.addNode(parentPath, {
      id: crypto.randomUUID(),
      name: 'New Item',
      sortOrder: 10
    });
    if (result.success) {
      data = treeRef.getAllData();
    }
  }

  // Move node above another
  function moveAbove(sourcePath: string, targetPath: string) {
    const result = treeRef.moveNode(sourcePath, targetPath, 'above');
    if (result.success) {
      data = treeRef.getAllData();
    }
  }

  // Remove node with descendants
  function removeWithChildren(path: string) {
    const result = treeRef.removeNode(path, true);
    console.log(\`Removed \${result.removedCount} nodes\`);
    data = treeRef.getAllData();
  }
</script>

<Tree
  bind:this={treeRef}
  data={data}
  idMember="id"
  pathMember="path"
  orderMember="sortOrder"
/>`}
					languageType="svelte"
					titleText="Basic Usage"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>AddNodeResult</h6>
					<pre class="bg-light p-2 rounded"><code>{`{
  success: boolean;
  node?: LTreeNode<T>;
  path?: string;
  error?: string;
}`}</code></pre>

					<h6>RemoveNodeResult</h6>
					<pre class="bg-light p-2 rounded"><code>{`{
  success: boolean;
  removedCount: number;
  error?: string;
}`}</code></pre>

					<h6>MoveNodeResult</h6>
					<pre class="bg-light p-2 rounded"><code>{`{
  success: boolean;
  oldPath: string;
  newPath: string;
  error?: string;
}`}</code></pre>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>
