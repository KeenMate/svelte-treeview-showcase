<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data with deep structure (8 levels)
	const sampleData = [
		// Company structure with deep hierarchy
		{ id: '1', path: '1', name: 'ACME Corporation', type: 'folder', size: null },
		{ id: '1.1', path: '1.1', name: 'Engineering', type: 'folder', size: null },
		{ id: '1.1.1', path: '1.1.1', name: 'Frontend Team', type: 'folder', size: null },
		{ id: '1.1.1.1', path: '1.1.1.1', name: 'Projects', type: 'folder', size: null },
		{ id: '1.1.1.1.1', path: '1.1.1.1.1', name: 'Dashboard App', type: 'folder', size: null },
		{ id: '1.1.1.1.1.1', path: '1.1.1.1.1.1', name: 'Components', type: 'folder', size: null },
		{ id: '1.1.1.1.1.1.1', path: '1.1.1.1.1.1.1', name: 'UI Elements', type: 'folder', size: null },
		{ id: '1.1.1.1.1.1.1.1', path: '1.1.1.1.1.1.1.1', name: 'Button.svelte', type: 'file', size: '12 KB' },
		{ id: '1.1.1.1.1.1.1.2', path: '1.1.1.1.1.1.1.2', name: 'Modal.svelte', type: 'file', size: '8 KB' },
		{ id: '1.1.1.1.1.1.2', path: '1.1.1.1.1.1.2', name: 'TreeView', type: 'folder', size: null },
		{ id: '1.1.1.1.1.1.2.1', path: '1.1.1.1.1.1.2.1', name: 'TreeView.svelte', type: 'file', size: '25 KB' },
		{ id: '1.1.1.1.1.1.2.2', path: '1.1.1.1.1.1.2.2', name: 'TreeNode.svelte', type: 'file', size: '18 KB' },
		{ id: '1.1.1.1.1.2', path: '1.1.1.1.1.2', name: 'Services', type: 'folder', size: null },
		{ id: '1.1.1.1.1.2.1', path: '1.1.1.1.1.2.1', name: 'API', type: 'folder', size: null },
		{ id: '1.1.1.1.1.2.1.1', path: '1.1.1.1.1.2.1.1', name: 'client.js', type: 'file', size: '15 KB' },
		{ id: '1.1.1.1.2', path: '1.1.1.1.2', name: 'Mobile App', type: 'folder', size: null },
		{ id: '1.1.1.1.2.1', path: '1.1.1.1.2.1', name: 'iOS', type: 'folder', size: null },
		{ id: '1.1.1.1.2.1.1', path: '1.1.1.1.2.1.1', name: 'Views', type: 'folder', size: null },
		{ id: '1.1.1.1.2.1.1.1', path: '1.1.1.1.2.1.1.1', name: 'Controllers', type: 'folder', size: null },
		{ id: '1.1.1.1.2.1.1.1.1', path: '1.1.1.1.2.1.1.1.1', name: 'MainViewController.swift', type: 'file', size: '32 KB' },
		{ id: '1.1.2', path: '1.1.2', name: 'Backend Team', type: 'folder', size: null },
		{ id: '1.1.2.1', path: '1.1.2.1', name: 'Microservices', type: 'folder', size: null },
		{ id: '1.1.2.1.1', path: '1.1.2.1.1', name: 'User Service', type: 'folder', size: null },
		{ id: '1.1.2.1.1.1', path: '1.1.2.1.1.1', name: 'Controllers', type: 'folder', size: null },
		{ id: '1.1.2.1.1.1.1', path: '1.1.2.1.1.1.1', name: 'REST', type: 'folder', size: null },
		{ id: '1.1.2.1.1.1.1.1', path: '1.1.2.1.1.1.1.1', name: 'v1', type: 'folder', size: null },
		{ id: '1.1.2.1.1.1.1.1.1', path: '1.1.2.1.1.1.1.1.1', name: 'UserController.cs', type: 'file', size: '45 KB' },
		{ id: '1.2', path: '1.2', name: 'Marketing', type: 'folder', size: null },
		{ id: '1.2.1', path: '1.2.1', name: 'Campaigns', type: 'folder', size: null },
		{ id: '1.2.1.1', path: '1.2.1.1', name: '2024', type: 'folder', size: null },
		{ id: '1.2.1.1.1', path: '1.2.1.1.1', name: 'Q4', type: 'folder', size: null },
		{ id: '1.2.1.1.1.1', path: '1.2.1.1.1.1', name: 'Product Launch', type: 'folder', size: null },
		{ id: '1.2.1.1.1.1.1', path: '1.2.1.1.1.1.1', name: 'Assets', type: 'folder', size: null },
		{ id: '1.2.1.1.1.1.1.1', path: '1.2.1.1.1.1.1.1', name: 'Images', type: 'folder', size: null },
		{ id: '1.2.1.1.1.1.1.1.1', path: '1.2.1.1.1.1.1.1.1', name: 'hero-banner.jpg', type: 'file', size: '2.8 MB' },
		{ id: '2', path: '2', name: 'Clients', type: 'folder', size: null },
		{ id: '2.1', path: '2.1', name: 'Enterprise', type: 'folder', size: null },
		{ id: '2.1.1', path: '2.1.1', name: 'Fortune 500', type: 'folder', size: null },
		{ id: '2.1.1.1', path: '2.1.1.1', name: 'Technology Sector', type: 'folder', size: null },
		{ id: '2.1.1.1.1', path: '2.1.1.1.1', name: 'Software Companies', type: 'folder', size: null },
		{ id: '2.1.1.1.1.1', path: '2.1.1.1.1.1', name: 'Active Contracts', type: 'folder', size: null },
		{ id: '2.1.1.1.1.1.1', path: '2.1.1.1.1.1.1', name: '2024', type: 'folder', size: null },
		{ id: '2.1.1.1.1.1.1.1', path: '2.1.1.1.1.1.1.1', name: 'TechCorp Agreement', type: 'folder', size: null },
		{ id: '2.1.1.1.1.1.1.1.1', path: '2.1.1.1.1.1.1.1.1', name: 'contract.pdf', type: 'file', size: '1.2 MB' },
		{ id: '3', path: '3', name: 'Resources', type: 'folder', size: null }
	];

	// Basic tree configuration
	let data = $state(sampleData);
	let idMember = $state('id');
	let pathMember = $state('path');
	let displayValueMember = $state('name');
	let expandLevel = $state(5);
	let shouldToggleOnNodeClick = $state(true);

	// Tree visibility for refresh
	let showTree = $state(true);

	// Refresh tree by hiding and showing it
	async function refreshTree() {
		showTree = false;
		await new Promise(resolve => setTimeout(resolve, 0)); // Wait a tick
		showTree = true;
	}

	// Watch for expand level changes that need tree refresh
	let previousExpandLevel = expandLevel;
	$effect(() => {
		if (expandLevel !== previousExpandLevel) {
			previousExpandLevel = expandLevel;
			refreshTree();
		}
	});

	// Expand level options
	const expandLevelOptions = [
		{ value: 0, label: 'None (0)' },
		{ value: 1, label: 'Root only (1)' },
		{ value: 2, label: 'Two levels (2)' },
		{ value: 3, label: 'Three levels (3)' },
		{ value: 4, label: 'Four levels (4)' },
		{ value: 5, label: 'Five levels (5)' },
		{ value: 6, label: 'Six levels (6)' },
		{ value: 7, label: 'Seven levels (7)' },
		{ value: 8, label: 'All levels (8)' }
	];

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Custom sort callback
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

	// Alternative data structures for examples
	const minimalData = [
		{ id: '1', path: '1', name: 'Root' },
		{ id: '1.1', path: '1.1', name: 'Child 1' },
		{ id: '1.2', path: '1.2', name: 'Child 2' }
	];

	const deepData = [
		{ id: '1', path: '1', name: 'Level 1' },
		{ id: '1.1', path: '1.1', name: 'Level 2' },
		{ id: '1.1.1', path: '1.1.1', name: 'Level 3' },
		{ id: '1.1.1.1', path: '1.1.1.1', name: 'Level 4' },
		{ id: '1.1.1.1.1', path: '1.1.1.1.1', name: 'Level 5' },
		{ id: '1.1.1.1.1.1', path: '1.1.1.1.1.1', name: 'Level 6' }
	];
</script>

<DocLayout
	titleText="Basic Tree Examples"
	descriptionText="Learn the fundamental properties and behavior of the Svelte Treeview component">

	<div class="py-1">
		<!-- Essential Properties -->
		<ShowcaseSection
			titleText="BU01 Essential Properties"
			subtitleText="The minimum required configuration to display a tree"
			demoColumnTitle="Live Demo"
			controlsColumnTitle="Configuration"
			descriptionColumnTitle="Property Reference">

			{#snippet demoContent()}
				<div class="tree-demo">
					{#if showTree}
						<Tree
							treeId="basic-essential-properties"
							{data}
							{idMember}
							{pathMember}
							{displayValueMember}
							{expandLevel}
							{shouldToggleOnNodeClick}
						/>
					{/if}
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">ID Member</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={idMember}
							placeholder="Property name for unique IDs"
						/>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Path Member</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={pathMember}
							placeholder="Property name for hierarchical paths"
						/>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Display Value Member</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={displayValueMember}
							placeholder="Property to display as node text"
						/>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Expand Level</label>
						<select class="form-select form-select-sm" bind:value={expandLevel}>
							{#each expandLevelOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							bind:checked={shouldToggleOnNodeClick}
							id="toggleCheck"
						/>
						<label class="form-check-label" for="toggleCheck">
							Toggle on Node Click
						</label>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Required Properties</h4>
					<p><code>data</code> - Array of objects with hierarchical structure</p>
					<p><code>idMember</code> - Property name for unique node identification</p>
					<p><code>pathMember</code> - Property defining hierarchical paths (e.g., "1", "1.1", "1.2.3")</p>
					<p><code>displayValueMember</code> - Which property to show as node text</p>

					<h4>Optional Properties</h4>
					<p><code>expandLevel</code> - Auto-expand nodes up to this depth (default: 2)</p>
					<p><code>shouldToggleOnNodeClick</code> - Click node to expand/collapse (default: false)</p>
					<p><code>sortCallback</code> - Custom function to sort tree nodes (uses internal sorting if not provided)</p>

					<h4>Path Structure</h4>
					<p>Paths use dot notation: root nodes ("1", "2"), children ("1.1", "1.2"), grandchildren ("1.1.1"), etc.</p>
				</div>
			{/snippet}
		</ShowcaseSection>


		<!-- Expand Level Demonstration -->
		<ShowcaseSection
			titleText="BU02 Expand Level Control"
			subtitleText="Control which levels are expanded by default"
			demoColumnTitle="Deep Tree"
			controlsColumnTitle="Expand Levels"
			descriptionColumnTitle="Level Behavior">

			{#snippet demoContent()}
				<div class="tree-demo">
					{#if showTree}
						<Tree
							treeId="basic-expand-levels"
							data={deepData}
							idMember="id"
							pathMember="path"
							displayValueMember="name"
							{expandLevel}
							shouldToggleOnNodeClick={true}
						/>
					{/if}
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">Expand Level: {expandLevel}</label>
						<input
							type="range"
							class="form-range"
							bind:value={expandLevel}
							min="0"
							max="8"
						/>
					</div>
					<div class="tree-state">
						Current setting: {expandLevelOptions.find(opt => opt.value === expandLevel)?.label || 'Custom'}
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Level 0</h4>
					<p>All nodes collapsed. Users must manually expand.</p>

					<h4>Level 1</h4>
					<p>Only root level nodes visible.</p>

					<h4>Level 2+ (Default)</h4>
					<p>Shows root and first level of children.</p>

					<h4>Performance Note</h4>
					<p>Higher levels may impact initial render time with large datasets.</p>

					<h4>Use Cases</h4>
					<ul>
						<li>File browsers: Level 2-3</li>
						<li>Navigation menus: Level 1-2</li>
						<li>Organization charts: Level 3-4</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Minimal Example -->
		<ShowcaseSection
			titleText="BU03 Minimal Configuration"
			subtitleText="The absolute minimum required to display a tree"
			demoColumnTitle="Simple Tree"
			controlsColumnTitle="Minimal Code"
			descriptionColumnTitle="Quick Start">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="basic-minimal-setup"
						data={minimalData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  const data = [
    { id: '1', path: '1', name: 'Root' },
    { id: '1.1', path: '1.1', name: 'Child 1' },
    { id: '1.2', path: '1.2', name: 'Child 2' }
  ];
</script>

<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
/>`}
					languageType="svelte"
					titleText="Minimal Setup"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Default Behavior</h4>
					<p>When you don't specify optional properties:</p>
					<ul>
						<li><code>expandLevel: 2</code> - Shows 2 levels</li>
						<li><code>shouldToggleOnNodeClick: false</code> - Click disabled</li>
						<li><code>sortCallback: undefined</code> - Data order preserved</li>
					</ul>

					<h4>Perfect For</h4>
					<ul>
						<li>Quick prototyping</li>
						<li>Simple display-only trees</li>
						<li>Static hierarchical content</li>
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
							<div class="display-6 mb-3">🔍</div>
							<h5>Search & Filter</h5>
							<p>Add search functionality to your trees</p>
							<a href="/examples/search" class="btn btn-primary">Learn Search</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔄</div>
							<h5>Drag & Drop</h5>
							<p>Interactive tree manipulation</p>
							<a href="/examples/drag-drop" class="btn btn-outline-primary">Try Drag & Drop</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🎨</div>
							<h5>Custom Styling</h5>
							<p>Customize appearance and themes</p>
							<a href="/examples/custom-styling" class="btn btn-outline-primary">Styling Guide</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</DocLayout>