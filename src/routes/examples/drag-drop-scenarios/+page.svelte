<script lang="ts">
	import { tick } from 'svelte';
	import { DocLayout } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';
	import type { LTreeNode, DropPosition, DropOperation } from '@keenmate/svelte-treeview';

	type ScenarioNode = {
		id: number;
		path: string;
		name: string;
		icon: string;
		sortOrder: number;
	};

	type Scenario = 'A' | 'B' | 'C' | 'D' | 'E';

	// Active scenario tab
	let activeTab = $state<Scenario>('A');

	// Scenario descriptions with technical details
	const scenarioDescriptions: Record<Scenario, { title: string; description: string; keyFeature: string; useCase: string; events: string; yourCode: string }> = {
		A: {
			title: 'Full Redraw + State Preservation',
			description: 'After drag-drop, save to database and reload the entire tree. Expanded folders are preserved automatically.',
			keyFeature: 'getExpandedPaths() / setExpandedPaths()',
			useCase: 'When your backend owns the data and you need a full refresh after changes (e.g., server-side sorting, computed paths).',
			events: 'onNodeDrop(dropNode, draggedNode, position, event, operation)',
			yourCode: '1. Call getExpandedPaths() before changes\n2. Save to DB\n3. Reload data array\n4. await tick(), then setExpandedPaths()'
		},
		B: {
			title: 'Same-Tree Reorganization (Recommended)',
			description: 'Drag nodes within a single tree to reorganize. The library auto-handles moves - just save to DB for persistence.',
			keyFeature: 'Auto-handled moveNode()',
			useCase: 'File managers, folder structures, category trees, playlist reordering - any single-tree reorganization.',
			events: 'onNodeDrop(dropNode, draggedNode, position, event, operation)',
			yourCode: 'Tree is already updated when event fires!\n1. Use draggedNode.data to get moved node\n2. Use dropNode.path + position for new location\n3. Save to DB (or call getAllData() for full tree)'
		},
		C: {
			title: 'Single-Tree CRUD Operations',
			description: 'Add, edit, and delete nodes in a single tree. Each operation is immediately saved to the database.',
			keyFeature: 'addNode() / updateNode() / removeNode()',
			useCase: 'CMS systems, settings panels, organization charts - any tree where you add/edit/delete items.',
			events: 'onNodeDrop + onNodeClicked (for selection)',
			yourCode: 'Add: addNode(parentPath, data) → save\nUpdate: updateNode(path, changes) → save\nDelete: removeNode(path) → save'
		},
		D: {
			title: 'Empty Tree + Build One by One',
			description: 'Start with an empty tree and build it by dragging items from a source or adding manually. Each node is saved as created.',
			keyFeature: 'dropPlaceholder + addNode()',
			useCase: 'New project setup, building playlists, creating new folder structures from scratch.',
			events: 'onNodeDrop (fires even on empty tree with dropPlaceholder)',
			yourCode: 'Call addNode(parentPath, newData)\nSave to DB immediately\nUse dropPlaceholder snippet for empty state UI'
		},
		E: {
			title: 'Batch Create Then Save',
			description: 'Build the entire tree structure in memory without saving. When ready, click "Save All" to persist everything at once.',
			keyFeature: 'getAllData()',
			useCase: 'Wizard flows, draft mode, offline-first apps, or when you want users to finalize before committing.',
			events: 'onNodeDrop (handle but do NOT save)',
			yourCode: 'Build tree with copyNodeWithDescendants()/addNode()\nTrack unsaved count\nOn save: getAllData() → batch save to DB'
		}
	};

	// Source tree data (shared across all scenarios)
	const sourceData: ScenarioNode[] = [
		{ id: 1, path: '1', name: 'Documents', icon: '📁', sortOrder: 10 },
		{ id: 2, path: '1.1', name: 'Report.pdf', icon: '📄', sortOrder: 10 },
		{ id: 3, path: '1.2', name: 'Presentation.pptx', icon: '📊', sortOrder: 20 },
		{ id: 4, path: '1.3', name: 'Notes', icon: '📁', sortOrder: 30 },
		{ id: 5, path: '1.3.1', name: 'Meeting Notes.txt', icon: '📝', sortOrder: 10 },
		{ id: 6, path: '1.3.2', name: 'Ideas.txt', icon: '📝', sortOrder: 20 },
		{ id: 7, path: '2', name: 'Images', icon: '📁', sortOrder: 20 },
		{ id: 8, path: '2.1', name: 'Photo.jpg', icon: '🖼️', sortOrder: 10 },
		{ id: 9, path: '2.2', name: 'Screenshot.png', icon: '🖼️', sortOrder: 20 },
		{ id: 10, path: '3', name: 'Music', icon: '📁', sortOrder: 30 },
		{ id: 11, path: '3.1', name: 'Song.mp3', icon: '🎵', sortOrder: 10 }
	];

	// Initial target data for scenarios A, B, C (pre-populated)
	function createInitialTargetData(): ScenarioNode[] {
		return [
			{ id: 100, path: '1', name: 'Projects', icon: '📁', sortOrder: 10 },
			{ id: 101, path: '1.1', name: 'Project Alpha', icon: '📁', sortOrder: 10 },
			{ id: 102, path: '1.1.1', name: 'Specs.doc', icon: '📄', sortOrder: 10 },
			{ id: 103, path: '1.1.2', name: 'Design.fig', icon: '🎨', sortOrder: 20 },
			{ id: 104, path: '1.2', name: 'Project Beta', icon: '📁', sortOrder: 20 },
			{ id: 105, path: '1.2.1', name: 'README.md', icon: '📄', sortOrder: 10 },
			{ id: 106, path: '2', name: 'Archive', icon: '📁', sortOrder: 20 },
			{ id: 107, path: '2.1', name: 'Old Files', icon: '📁', sortOrder: 10 },
			{ id: 108, path: '2.1.1', name: 'Legacy.zip', icon: '📦', sortOrder: 10 }
		];
	}

	// Per-scenario state
	let nextIdA = $state(1000);
	let nextIdB = $state(2000);
	let nextIdC = $state(3000);
	let nextIdD = $state(4000);
	let nextIdE = $state(5000);

	let targetDataA = $state<ScenarioNode[]>(createInitialTargetData());
	let targetDataB = $state<ScenarioNode[]>(createInitialTargetData());
	let targetDataC = $state<ScenarioNode[]>(createInitialTargetData());
	let targetDataD = $state<ScenarioNode[]>([]); // Empty for scenario D
	let targetDataE = $state<ScenarioNode[]>([]); // Empty for scenario E

	let mockDatabaseA = $state<ScenarioNode[]>([...createInitialTargetData()]);
	let mockDatabaseB = $state<ScenarioNode[]>([...createInitialTargetData()]);
	let mockDatabaseC = $state<ScenarioNode[]>([...createInitialTargetData()]);
	let mockDatabaseD = $state<ScenarioNode[]>([]);
	let mockDatabaseE = $state<ScenarioNode[]>([]);

	let activityLogA = $state<string[]>([]);
	let activityLogB = $state<string[]>([]);
	let activityLogC = $state<string[]>([]);
	let activityLogD = $state<string[]>([]);
	let activityLogE = $state<string[]>([]);

	let selectedNodeC = $state<LTreeNode<ScenarioNode> | null>(null);
	let editNameC = $state('');
	let unsavedCountE = $state(0);

	// Loading state per scenario
	let isLoadingA = $state(false);
	let isLoadingB = $state(false);
	let isLoadingC = $state(false);
	let isLoadingD = $state(false);
	let isLoadingE = $state(false);

	// Tree refs
	let treeRefA: Tree<ScenarioNode>;
	let treeRefB: Tree<ScenarioNode>;
	let treeRefC: Tree<ScenarioNode>;
	let treeRefD: Tree<ScenarioNode>;
	let treeRefE: Tree<ScenarioNode>;

	// Sort function
	function sortByOrder(items: LTreeNode<ScenarioNode>[]) {
		return [...items].sort((a, b) => {
			if (a.parentPath !== b.parentPath) {
				return (a.parentPath || '').localeCompare(b.parentPath || '');
			}
			return (a.data?.sortOrder ?? 0) - (b.data?.sortOrder ?? 0);
		});
	}

	// Logging helpers
	function addLogA(message: string) {
		activityLogA = [...activityLogA.slice(-19), `${new Date().toLocaleTimeString()} - ${message}`];
	}
	function addLogB(message: string) {
		activityLogB = [...activityLogB.slice(-19), `${new Date().toLocaleTimeString()} - ${message}`];
	}
	function addLogC(message: string) {
		activityLogC = [...activityLogC.slice(-19), `${new Date().toLocaleTimeString()} - ${message}`];
	}
	function addLogD(message: string) {
		activityLogD = [...activityLogD.slice(-19), `${new Date().toLocaleTimeString()} - ${message}`];
	}
	function addLogE(message: string) {
		activityLogE = [...activityLogE.slice(-19), `${new Date().toLocaleTimeString()} - ${message}`];
	}

	// Simulated DB operations with random latency (50-450ms)
	async function simulateLatency(): Promise<number> {
		const delay = Math.floor(Math.random() * 400) + 50; // 50-450ms
		await new Promise(r => setTimeout(r, delay));
		return delay;
	}

	// ==================== SCENARIO A: Full Redraw ====================
	function getNextPathSegmentA(parentPath: string): string {
		const children = mockDatabaseA.filter(n => {
			if (parentPath === '') {
				return !n.path.includes('.');
			}
			const prefix = parentPath + '.';
			return n.path.startsWith(prefix) && !n.path.slice(prefix.length).includes('.');
		});
		return String(children.length + 1);
	}

	async function handleDropA(dropNode: LTreeNode<ScenarioNode> | null, draggedNode: LTreeNode<ScenarioNode>, position: DropPosition, event: DragEvent | TouchEvent, operation: DropOperation) {
		const isSameTree = draggedNode.treeId === 'tree-a';

		const expandedPaths = treeRefA.getExpandedPaths();
		addLogA(`Saved ${expandedPaths.length} expanded paths`);

		isLoadingA = true;

		if (isSameTree && operation === 'move') {
			addLogA(`Moving "${draggedNode.data?.name}" ${position} "${dropNode?.data?.name || 'root'}"`);
			const delay = await simulateLatency();
			const nodeData = mockDatabaseA.find(n => n.id === draggedNode.data?.id);
			if (nodeData) {
				addLogA(`Saved move to DB (${delay}ms)`);
			}
		} else {
			const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));
			const pathSegment = getNextPathSegmentA(parentPath);
			const rootPath = parentPath ? `${parentPath}.${pathSegment}` : pathSegment;

			let rootSortOrder = 10;
			if (dropNode && position === 'above') {
				rootSortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
			} else if (dropNode && position === 'below') {
				rootSortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
			}

			const nodesToAdd: ScenarioNode[] = [];
			let isRoot = true;

			function collectNodes(node: LTreeNode<ScenarioNode>, newPath: string) {
				nodesToAdd.push({
					...node.data!,
					id: nextIdA++,
					path: newPath,
					sortOrder: isRoot ? rootSortOrder : (node.data?.sortOrder || 10)
				});
				isRoot = false;

				const children = Object.values(node.children || {});
				children.forEach((child, index) => {
					const childPath = `${newPath}.${index + 1}`;
					collectNodes(child, childPath);
				});
			}

			collectNodes(draggedNode, rootPath);

			const delay = await simulateLatency();
			mockDatabaseA = [...mockDatabaseA, ...nodesToAdd];
			addLogA(`Added ${nodesToAdd.length} node(s) at "${rootPath}" (${delay}ms)`);
		}

		addLogA(`Reloading tree from DB...`);
		const reloadDelay = await simulateLatency();
		targetDataA = [...mockDatabaseA];
		addLogA(`Loaded ${mockDatabaseA.length} records (${reloadDelay}ms)`);

		await tick();
		treeRefA.setExpandedPaths(expandedPaths);
		addLogA(`Restored ${expandedPaths.length} expanded paths`);

		isLoadingA = false;
	}

	async function reloadFromDbA() {
		const expandedPaths = treeRefA.getExpandedPaths();
		addLogA(`Reloading from DB (saving ${expandedPaths.length} expanded paths)...`);

		isLoadingA = true;
		const delay = await simulateLatency();
		targetDataA = [...mockDatabaseA];

		await tick();
		treeRefA.setExpandedPaths(expandedPaths);
		addLogA(`Reload complete (${delay}ms), restored expanded state`);
		isLoadingA = false;
	}

	function resetA() {
		mockDatabaseA = [...createInitialTargetData()];
		targetDataA = [...mockDatabaseA];
		activityLogA = [];
		nextIdA = 1000;
		addLogA('Reset to initial state');
	}

	// ==================== SCENARIO B: Partial Redraw ====================
	async function handleDropB(dropNode: LTreeNode<ScenarioNode> | null, draggedNode: LTreeNode<ScenarioNode>, position: DropPosition, event: DragEvent | TouchEvent, operation: DropOperation) {
		const isSameTree = draggedNode.treeId === 'tree-b';

		isLoadingB = true;

		if (isSameTree && operation === 'move') {
			addLogB(`[AUTO-HANDLED] Moved "${draggedNode.data?.name}" ${position} "${dropNode?.data?.name || 'root'}"`);
			const delay = await simulateLatency();
			addLogB(`Saved to DB (${delay}ms) - no tree rebuild needed!`);
		} else {
			const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));

			let rootSortOrder = 10;
			if (dropNode && position === 'above') {
				rootSortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
			} else if (dropNode && position === 'below') {
				rootSortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
			}

			let isFirst = true;
			const result = treeRefB.copyNodeWithDescendants(
				draggedNode,
				parentPath,
				(data) => {
					const order = isFirst ? rootSortOrder : (data.sortOrder || 10);
					isFirst = false;
					return { ...data, id: nextIdB++, path: '', sortOrder: order };
				}
			);

			if (result.success) {
				addLogB(`Copied ${result.count} node(s)`);
				const delay = await simulateLatency();
				addLogB(`Saved to DB (${delay}ms)`);
			}
		}

		isLoadingB = false;
	}

	function resetB() {
		targetDataB = [...createInitialTargetData()];
		mockDatabaseB = [...createInitialTargetData()];
		activityLogB = [];
		nextIdB = 2000;
		addLogB('Reset to initial state');
	}

	// ==================== SCENARIO C: Individual CRUD ====================
	async function handleDropC(dropNode: LTreeNode<ScenarioNode> | null, draggedNode: LTreeNode<ScenarioNode>, position: DropPosition, event: DragEvent | TouchEvent, operation: DropOperation) {
		const isSameTree = draggedNode.treeId === 'tree-c';

		isLoadingC = true;

		if (isSameTree && operation === 'move') {
			addLogC(`Moved "${draggedNode.data?.name}"`);
			const delay = await simulateLatency();
			addLogC(`Saved move to DB (${delay}ms)`);
		} else {
			const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));

			let sortOrder = 10;
			if (dropNode && position === 'above') {
				sortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
			} else if (dropNode && position === 'below') {
				sortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
			}

			const newNode: ScenarioNode = { ...draggedNode.data!, id: nextIdC++, path: '', sortOrder };

			const result = treeRefC.addNode(parentPath, newNode);
			if (result.success) {
				const delay = await simulateLatency();
				mockDatabaseC = [...mockDatabaseC, result.node!.data!];
				addLogC(`Added "${newNode.name}" (${delay}ms)`);
			}
		}

		isLoadingC = false;
	}

	async function handleAddC() {
		const parentPath = selectedNodeC?.path || '';
		const newNode: ScenarioNode = {
			id: nextIdC++,
			path: '',
			name: `New Item ${nextIdC}`,
			icon: '📄',
			sortOrder: 10
		};

		isLoadingC = true;
		const result = treeRefC.addNode(parentPath, newNode);
		if (result.success) {
			const delay = await simulateLatency();
			mockDatabaseC = [...mockDatabaseC, result.node!.data!];
			addLogC(`Added "${newNode.name}" - saved to DB (${delay}ms)`);
		}
		isLoadingC = false;
	}

	async function handleUpdateC() {
		if (!selectedNodeC || !editNameC.trim()) return;

		isLoadingC = true;
		const result = treeRefC.updateNode(selectedNodeC.path, { name: editNameC.trim() });
		if (result.success) {
			const delay = await simulateLatency();
			const dbNode = mockDatabaseC.find(n => n.id === selectedNodeC!.data?.id);
			if (dbNode) dbNode.name = editNameC.trim();
			addLogC(`Updated to "${editNameC}" - saved to DB (${delay}ms)`);
		}
		isLoadingC = false;
	}

	async function handleDeleteC() {
		if (!selectedNodeC) return;

		isLoadingC = true;
		const nodeName = selectedNodeC.data?.name;
		const result = treeRefC.removeNode(selectedNodeC.path);
		if (result.success) {
			const delay = await simulateLatency();
			mockDatabaseC = mockDatabaseC.filter(n => n.id !== selectedNodeC!.data?.id);
			addLogC(`Deleted "${nodeName}" - saved to DB (${delay}ms)`);
			selectedNodeC = null;
		}
		isLoadingC = false;
	}

	function onNodeClickC(node: LTreeNode<ScenarioNode>) {
		selectedNodeC = node;
		editNameC = node.data?.name || '';
	}

	function resetC() {
		targetDataC = [...createInitialTargetData()];
		mockDatabaseC = [...createInitialTargetData()];
		activityLogC = [];
		nextIdC = 3000;
		selectedNodeC = null;
		editNameC = '';
		addLogC('Reset to initial state');
	}

	// ==================== SCENARIO D: Empty + One by One ====================
	async function handleDropD(dropNode: LTreeNode<ScenarioNode> | null, draggedNode: LTreeNode<ScenarioNode>, position: DropPosition, event: DragEvent | TouchEvent, operation: DropOperation) {
		const isSameTree = draggedNode.treeId === 'tree-d';

		isLoadingD = true;

		if (isSameTree && operation === 'move') {
			addLogD(`Moved "${draggedNode.data?.name}"`);
			const delay = await simulateLatency();
			addLogD(`Saved to DB (${delay}ms)`);
			isLoadingD = false;
			return;
		}

		const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));

		let sortOrder = 10;
		if (dropNode && position === 'above') {
			sortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
		} else if (dropNode && position === 'below') {
			sortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
		}

		const newNode: ScenarioNode = {
			...draggedNode.data!,
			id: nextIdD++,
			path: '',
			sortOrder
		};

		const result = treeRefD.addNode(parentPath, newNode);
		if (result.success) {
			const delay = await simulateLatency();
			mockDatabaseD = [...mockDatabaseD, result.node!.data!];
			addLogD(`Added "${newNode.name}" (${delay}ms)`);
		}

		isLoadingD = false;
	}

	async function addRootNodeD() {
		const newNode: ScenarioNode = {
			id: nextIdD++,
			path: '',
			name: `Root ${nextIdD}`,
			icon: '📁',
			sortOrder: 10
		};

		isLoadingD = true;
		const result = treeRefD.addNode('', newNode);
		if (result.success) {
			const delay = await simulateLatency();
			mockDatabaseD = [...mockDatabaseD, result.node!.data!];
			addLogD(`Added root node "${newNode.name}" - saved to DB (${delay}ms)`);
		}
		isLoadingD = false;
	}

	function clearD() {
		targetDataD = [];
		mockDatabaseD = [];
		activityLogD = [];
		nextIdD = 4000;
		addLogD('Cleared tree and database');
	}

	// ==================== SCENARIO E: Batch Create Then Save ====================
	function handleDropE(dropNode: LTreeNode<ScenarioNode> | null, draggedNode: LTreeNode<ScenarioNode>, position: DropPosition, event: DragEvent | TouchEvent, operation: DropOperation) {
		const isSameTree = draggedNode.treeId === 'tree-e';

		if (isSameTree && operation === 'move') {
			addLogE(`Moved "${draggedNode.data?.name}" (not saved yet)`);
			unsavedCountE++;
			return;
		}

		const parentPath = dropNode === null ? '' : (position === 'child' ? dropNode.path : (dropNode.parentPath || ''));

		let rootSortOrder = 10;
		if (dropNode && position === 'above') {
			rootSortOrder = (dropNode.data?.sortOrder ?? 10) - 5;
		} else if (dropNode && position === 'below') {
			rootSortOrder = (dropNode.data?.sortOrder ?? 10) + 5;
		}

		let isFirst = true;
		const result = treeRefE.copyNodeWithDescendants(
			draggedNode,
			parentPath,
			(data) => {
				const order = isFirst ? rootSortOrder : (data.sortOrder || 10);
				isFirst = false;
				return { ...data, id: nextIdE++, path: '', sortOrder: order };
			}
		);

		if (result.success) {
			unsavedCountE += result.count;
			addLogE(`Added ${result.count} node(s) - NOT saved yet`);
		}
	}

	function addRootNodeE() {
		const newNode: ScenarioNode = {
			id: nextIdE++,
			path: '',
			name: `Item ${nextIdE}`,
			icon: '📄',
			sortOrder: 10
		};

		const result = treeRefE.addNode('', newNode);
		if (result.success) {
			unsavedCountE++;
			addLogE(`Added "${newNode.name}" (NOT saved - ${unsavedCountE} unsaved total)`);
		}
	}

	async function saveAllE() {
		isLoadingE = true;

		const allData = treeRefE.getAllData();
		addLogE(`Extracting ${allData.length} nodes with getAllData()...`);

		const delay1 = await simulateLatency();
		addLogE(`Preparing batch insert (${delay1}ms)...`);
		const delay2 = await simulateLatency();

		mockDatabaseE = [...allData];
		unsavedCountE = 0;
		addLogE(`Batch saved ${allData.length} nodes to DB! (total: ${delay1 + delay2}ms)`);

		isLoadingE = false;
	}

	function clearE() {
		targetDataE = [];
		mockDatabaseE = [];
		activityLogE = [];
		nextIdE = 5000;
		unsavedCountE = 0;
		addLogE('Cleared tree (database was already empty)');
	}

	// Get current scenario's activity log
	function getCurrentLog(): string[] {
		switch (activeTab) {
			case 'A': return activityLogA;
			case 'B': return activityLogB;
			case 'C': return activityLogC;
			case 'D': return activityLogD;
			case 'E': return activityLogE;
		}
	}

	// Get current scenario's mock database
	function getCurrentDb(): ScenarioNode[] {
		switch (activeTab) {
			case 'A': return mockDatabaseA;
			case 'B': return mockDatabaseB;
			case 'C': return mockDatabaseC;
			case 'D': return mockDatabaseD;
			case 'E': return mockDatabaseE;
		}
	}
</script>

<DocLayout
	titleText="D&D Scenarios"
	descriptionText="Real-world tree manipulation workflows with database integration patterns">

	<div class="py-1">
		<!-- Scenario Tabs -->
		<div class="card mb-3">
			<div class="tabs">
				{#each ['A', 'B', 'C', 'D', 'E'] as tab}
					<button
						class="tab"
						class:active={activeTab === tab}
						onclick={() => activeTab = tab as Scenario}
					>
						Scenario {tab}
					</button>
				{/each}
			</div>

			<!-- Scenario Description -->
			<div class="scenario-info">
				<h2>{scenarioDescriptions[activeTab].title}</h2>
				<p>{scenarioDescriptions[activeTab].description}</p>
				<p class="use-case"><strong>Use case:</strong> {scenarioDescriptions[activeTab].useCase}</p>
				<div class="technical-details">
					<div class="detail-row">
						<span class="detail-label">Events:</span>
						<code>{scenarioDescriptions[activeTab].events}</code>
					</div>
					<div class="detail-row">
						<span class="detail-label">Your code:</span>
						<pre class="code-steps">{scenarioDescriptions[activeTab].yourCode}</pre>
					</div>
					<div class="detail-row">
						<span class="detail-label">Key methods:</span>
						<code>{scenarioDescriptions[activeTab].keyFeature}</code>
					</div>
				</div>
			</div>
		</div>

		<!-- Trees -->
		<div class="card mb-3">
			<div class="trees-side-by-side" class:single-tree={activeTab === 'B' || activeTab === 'C'}>
				<!-- Source Tree (only for A, D, E) -->
				{#if activeTab !== 'B' && activeTab !== 'C'}
					<div>
						<h3>Source Tree (drag from here)</h3>
						<div class="tree-container">
							<Tree
								treeId="source-tree"
								data={sourceData}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								isSorted={true}
								expandLevel={3}
								dragDropMode="cross"
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
							</Tree>
						</div>
					</div>
				{/if}

				<!-- Target Tree (per scenario) -->
				<div>
					<h3>
						{#if activeTab === 'B' || activeTab === 'C'}
							Tree (drag to reorganize)
						{:else}
							Target Tree
						{/if}
						{#if activeTab === 'E' && unsavedCountE > 0}
							<span class="unsaved-badge">{unsavedCountE} unsaved</span>
						{/if}
					</h3>
					<div class="tree-container">
						{#if activeTab === 'A'}
							<Tree
								bind:this={treeRefA}
								treeId="tree-a"
								data={targetDataA}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								expandLevel={3}
								onNodeDrop={handleDropA}
								isLoading={isLoadingA}
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
							</Tree>
						{:else if activeTab === 'B'}
							<Tree
								bind:this={treeRefB}
								treeId="tree-b"
								data={targetDataB}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								expandLevel={3}
								onNodeDrop={handleDropB}
								isLoading={isLoadingB}
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
							</Tree>
						{:else if activeTab === 'C'}
							<Tree
								bind:this={treeRefC}
								treeId="tree-c"
								data={targetDataC}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								expandLevel={3}
								onNodeDrop={handleDropC}
								onNodeClicked={onNodeClickC}
								selectedNode={selectedNodeC}
								isLoading={isLoadingC}
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
							</Tree>
						{:else if activeTab === 'D'}
							<Tree
								bind:this={treeRefD}
								treeId="tree-d"
								data={targetDataD}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								expandLevel={3}
								onNodeDrop={handleDropD}
								isLoading={isLoadingD}
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
								{#snippet dropPlaceholder()}
									<div class="drop-placeholder-content">
										<p class="placeholder-icon">📥</p>
										<p>Drag items here or click "Add Root Node"</p>
									</div>
								{/snippet}
							</Tree>
						{:else if activeTab === 'E'}
							<Tree
								bind:this={treeRefE}
								treeId="tree-e"
								data={targetDataE}
								idMember="id"
								pathMember="path"
								orderMember="sortOrder"
								sortCallback={sortByOrder}
								expandLevel={3}
								onNodeDrop={handleDropE}
								isLoading={isLoadingE}
							>
								{#snippet nodeTemplate(node)}
									<span><small class="node-id">[{node.data?.id}]</small> {node.data?.icon} {node.data?.name}</span>
								{/snippet}
								{#snippet dropPlaceholder()}
									<div class="drop-placeholder-content">
										<p class="placeholder-icon">📥</p>
										<p>Build your tree structure, then "Save All"</p>
									</div>
								{/snippet}
							</Tree>
						{/if}
					</div>
				</div>
			</div>

			<!-- Scenario-specific Controls -->
			<div class="controls">
				{#if activeTab === 'A'}
					<button class="btn btn-primary" onclick={reloadFromDbA}>Reload from DB</button>
					<button class="btn btn-outline-secondary" onclick={resetA}>Reset</button>
				{:else if activeTab === 'B'}
					<button class="btn btn-outline-secondary" onclick={resetB}>Reset</button>
					<span class="hint">Same-tree moves are auto-handled by the library</span>
				{:else if activeTab === 'C'}
					<button class="btn btn-primary" onclick={handleAddC}>Add Child</button>
					<input type="text" class="form-control form-control-sm" style="width: 150px;" bind:value={editNameC} placeholder="New name..." />
					<button class="btn btn-outline-primary" onclick={handleUpdateC} disabled={!selectedNodeC}>Update</button>
					<button class="btn btn-outline-danger" onclick={handleDeleteC} disabled={!selectedNodeC}>Delete</button>
					<button class="btn btn-outline-secondary" onclick={resetC}>Reset</button>
				{:else if activeTab === 'D'}
					<button class="btn btn-primary" onclick={addRootNodeD}>Add Root Node</button>
					<button class="btn btn-outline-secondary" onclick={clearD}>Clear All</button>
				{:else if activeTab === 'E'}
					<button class="btn btn-outline-primary" onclick={addRootNodeE}>Add Node</button>
					<button class="btn btn-success" onclick={saveAllE} disabled={unsavedCountE === 0}>
						Save All ({unsavedCountE} unsaved)
					</button>
					<button class="btn btn-outline-secondary" onclick={clearE}>Clear All</button>
				{/if}
			</div>
		</div>

		<!-- Activity Log -->
		<div class="card mb-3">
			<h3>Activity Log</h3>
			<div class="output">
				{#if getCurrentLog().length > 0}
					<pre>{getCurrentLog().join('\n')}</pre>
				{:else}
					<p class="empty-log">No activity yet. Try dragging nodes or using the controls above.</p>
				{/if}
			</div>
		</div>

		<!-- Mock Database -->
		<div class="card mb-3">
			<details>
				<summary>Mock Database ({getCurrentDb().length} records)</summary>
				<div class="output">
					<pre>{JSON.stringify(getCurrentDb(), null, 2)}</pre>
				</div>
			</details>
		</div>

		<!-- Code Example -->
		<div class="card mb-3">
			<h3>Full Code Example - Scenario {activeTab}</h3>
			<div class="code-block">
				{#if activeTab === 'A'}
					<pre>{`<script>
  import { tick } from 'svelte';
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef;
  let treeData = $state([...initialData]);
  let isLoading = $state(false);

  async function handleDrop(dropNode, draggedNode, position, event, operation) {
    // 1. Save expanded state BEFORE any changes
    const expandedPaths = treeRef.getExpandedPaths();

    isLoading = true;

    // 2. Save to database
    await saveToDatabase({
      nodeId: draggedNode.data.id,
      newParentPath: dropNode?.path,
      position: position // 'above' | 'below' | 'child'
    });

    // 3. Reload FULL tree from database
    treeData = await fetchTreeFromDatabase();

    // 4. Restore expanded state after data updates
    await tick();
    treeRef.setExpandedPaths(expandedPaths);

    isLoading = false;
  }
</script>

<Tree
  bind:this={treeRef}
  data={treeData}
  idMember="id"
  pathMember="path"
  orderMember="sortOrder"
  onNodeDrop={handleDrop}
  {isLoading}
/>`}</pre>
				{:else if activeTab === 'B'}
					<pre>{`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef;
  let treeData = $state([...initialData]);
  let isLoading = $state(false);

  async function handleDrop(dropNode, draggedNode, position, event, operation) {
    // Tree is ALREADY updated by the library!
    // Just persist the change to your database.

    isLoading = true;

    // Option 1: Save just the moved node
    await saveNodeMove({
      nodeId: draggedNode.data.id,
      newParentPath: position === 'child' ? dropNode?.path : dropNode?.parentPath,
      position: position,
      sortOrder: draggedNode.data.sortOrder
    });

    // Option 2: Save entire tree structure
    // const allData = treeRef.getAllData();
    // await saveAllNodes(allData);

    isLoading = false;
  }
</script>

<Tree
  bind:this={treeRef}
  data={treeData}
  idMember="id"
  pathMember="path"
  orderMember="sortOrder"
  onNodeDrop={handleDrop}
  {isLoading}
/>`}</pre>
				{:else if activeTab === 'C'}
					<pre>{`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef;
  let treeData = $state([...initialData]);
  let selectedNode = $state(null);
  let isLoading = $state(false);

  function onNodeClicked(node) {
    selectedNode = node;
  }

  async function addNode() {
    const parentPath = selectedNode?.path || '';
    const newData = { id: Date.now(), name: 'New Item', icon: '📄' };

    isLoading = true;
    const result = treeRef.addNode(parentPath, newData);
    if (result.success) {
      await saveToDatabase(result.node.data);
    }
    isLoading = false;
  }

  async function updateNode(newName) {
    if (!selectedNode) return;

    isLoading = true;
    const result = treeRef.updateNode(selectedNode.path, { name: newName });
    if (result.success) {
      await saveToDatabase(result.node.data);
    }
    isLoading = false;
  }

  async function deleteNode() {
    if (!selectedNode) return;

    isLoading = true;
    const result = treeRef.removeNode(selectedNode.path);
    if (result.success) {
      await deleteFromDatabase(selectedNode.data.id);
      selectedNode = null;
    }
    isLoading = false;
  }
</script>

<Tree
  bind:this={treeRef}
  data={treeData}
  idMember="id"
  pathMember="path"
  onNodeClicked={onNodeClicked}
  {selectedNode}
  {isLoading}
/>`}</pre>
				{:else if activeTab === 'D'}
					<pre>{`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef;
  let treeData = $state([]); // Start empty!
  let isLoading = $state(false);

  async function handleDrop(dropNode, draggedNode, position, event, operation) {
    const parentPath = dropNode === null
      ? ''
      : (position === 'child' ? dropNode.path : dropNode.parentPath || '');

    const newNode = {
      ...draggedNode.data,
      id: Date.now(), // Generate new ID
      path: ''        // Library assigns path
    };

    isLoading = true;
    const result = treeRef.addNode(parentPath, newNode);
    if (result.success) {
      // Save immediately to database
      await saveToDatabase(result.node.data);
    }
    isLoading = false;
  }
</script>

<Tree
  bind:this={treeRef}
  data={treeData}
  idMember="id"
  pathMember="path"
  onNodeDrop={handleDrop}
  {isLoading}
>
  {#snippet dropPlaceholder()}
    <div class="empty-state">
      Drop items here to start building your tree
    </div>
  {/snippet}
</Tree>`}</pre>
				{:else if activeTab === 'E'}
					<pre>{`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  let treeRef;
  let treeData = $state([]); // Start empty
  let unsavedCount = $state(0);
  let isLoading = $state(false);

  function handleDrop(dropNode, draggedNode, position, event, operation) {
    const parentPath = dropNode === null
      ? ''
      : (position === 'child' ? dropNode.path : dropNode.parentPath || '');

    // Add to tree WITHOUT saving to database
    const result = treeRef.copyNodeWithDescendants(
      draggedNode,
      parentPath,
      (data) => ({ ...data, id: Date.now() + Math.random() })
    );

    if (result.success) {
      unsavedCount += result.count;
    }
  }

  async function saveAll() {
    isLoading = true;

    // Extract ALL data from tree
    const allData = treeRef.getAllData();

    // Batch save to database
    await batchSaveToDatabase(allData);

    unsavedCount = 0;
    isLoading = false;
  }
</script>

<button onclick={saveAll} disabled={unsavedCount === 0}>
  Save All ({unsavedCount} unsaved)
</button>

<Tree
  bind:this={treeRef}
  data={treeData}
  idMember="id"
  pathMember="path"
  onNodeDrop={handleDrop}
  {isLoading}
>
  {#snippet dropPlaceholder()}
    <div class="empty-state">
      Build your tree, then click "Save All"
    </div>
  {/snippet}
</Tree>`}</pre>
				{/if}
			</div>
		</div>
	</div>
</DocLayout>

<style>
	.card {
		background: white;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transform: none !important;
	}

	.card:hover {
		transform: none !important;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
		flex-wrap: wrap;
	}

	.tab {
		padding: 0.5rem 1rem;
		border: none;
		background: #f1f5f9;
		border-radius: 4px 4px 0 0;
		cursor: pointer;
		font-weight: 500;
		color: #64748b;
		transition: all 0.2s;
	}

	.tab:hover {
		background: #e2e8f0;
	}

	.tab.active {
		background: #667eea;
		color: white;
	}

	.scenario-info {
		padding: 1rem;
		background: #f8fafc;
		border-radius: 4px;
	}

	.scenario-info h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.scenario-info p {
		margin: 0.5rem 0;
		color: #475569;
	}

	.use-case {
		background: #e0f2fe;
		padding: 0.5rem;
		border-radius: 4px;
		border-left: 3px solid #0284c7;
	}

	.technical-details {
		margin-top: 1rem;
		background: #f1f5f9;
		border-radius: 4px;
		padding: 0.75rem;
	}

	.detail-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		align-items: flex-start;
	}

	.detail-row:last-child {
		margin-bottom: 0;
	}

	.detail-label {
		font-weight: 600;
		color: #374151;
		min-width: 90px;
		flex-shrink: 0;
	}

	.detail-row code {
		background: #e0e7ff;
		color: #4338ca;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.code-steps {
		background: #1e293b;
		color: #e2e8f0;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		margin: 0;
		white-space: pre-wrap;
		flex: 1;
	}

	.trees-side-by-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.trees-side-by-side.single-tree {
		grid-template-columns: 1fr;
	}

	.trees-side-by-side h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #374151;
	}

	.tree-container {
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		padding: 0.5rem;
		min-height: 280px;
		max-height: 350px;
		overflow: auto;
		background: #fafafa;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
	}

	.hint {
		color: #64748b;
		font-size: 0.875rem;
		font-style: italic;
	}

	.output {
		background: #1e293b;
		color: #e2e8f0;
		border-radius: 4px;
		padding: 1rem;
		font-family: monospace;
		font-size: 0.875rem;
		max-height: 200px;
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

	details {
		cursor: pointer;
	}

	details summary {
		font-weight: 500;
		padding: 0.5rem 0;
	}

	.unsaved-badge {
		background: #fbbf24;
		color: #78350f;
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		margin-left: 0.5rem;
	}

	.drop-placeholder-content {
		text-align: center;
		padding: 2rem;
		color: #667eea;
	}

	.placeholder-icon {
		font-size: 2rem;
		margin: 0;
	}

	.node-id {
		color: #94a3b8;
		font-family: monospace;
		font-size: 0.75rem;
		margin-right: 0.25rem;
	}

	.code-block {
		background: #1e293b;
		border-radius: 4px;
		overflow: auto;
		max-height: 500px;
	}

	.code-block pre {
		margin: 0;
		padding: 1rem;
		color: #e2e8f0;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.8rem;
		line-height: 1.5;
		white-space: pre;
		overflow-x: auto;
	}

	@media (max-width: 768px) {
		.trees-side-by-side {
			grid-template-columns: 1fr;
		}
	}
</style>
