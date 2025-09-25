<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for demonstrating properties
	const sampleData = [
		{ id: '1', path: '1', name: 'Documents', type: 'folder', size: null, canEdit: true },
		{ id: '1.1', path: '1.1', name: 'Projects', type: 'folder', size: null, canEdit: true },
		{ id: '1.1.1', path: '1.1.1', name: 'Project A', type: 'folder', size: null, canEdit: true },
		{ id: '1.1.2', path: '1.1.2', name: 'report.pdf', type: 'file', size: '2.3 MB', canEdit: true },
		{ id: '1.2', path: '1.2', name: 'Templates', type: 'folder', size: null, canEdit: false },
		{ id: '1.2.1', path: '1.2.1', name: 'template.docx', type: 'file', size: '45 KB', canEdit: false },
		{ id: '2', path: '2', name: 'Images', type: 'folder', size: null, canEdit: true },
		{ id: '2.1', path: '2.1', name: 'photo.jpg', type: 'file', size: '1.8 MB', canEdit: true }
	];

	// Interactive property controls
	let expandLevel = $state(2);
	let shouldToggleOnNodeClick = $state(false);
	let shouldUseBootstrapIconClasses = $state(true);
	let isDragAndDropEnabled = $state(false);

	// Property presets
	const propertyPresets = {
		basic: {
			name: 'Basic Tree',
			expandLevel: 2,
			shouldToggleOnNodeClick: false,
			shouldUseBootstrapIconClasses: true,
			isDragAndDropEnabled: false
		},
		interactive: {
			name: 'Interactive Tree',
			expandLevel: 3,
			shouldToggleOnNodeClick: true,
			shouldUseBootstrapIconClasses: true,
			isDragAndDropEnabled: true
		},
		minimal: {
			name: 'Minimal Tree',
			expandLevel: 1,
			shouldToggleOnNodeClick: false,
			shouldUseBootstrapIconClasses: false,
			isDragAndDropEnabled: false
		}
	};

	let selectedPreset = $state('basic');

	// Apply preset
	function applyPreset(presetKey: string) {
		const preset = propertyPresets[presetKey];
		expandLevel = preset.expandLevel;
		shouldToggleOnNodeClick = preset.shouldToggleOnNodeClick;
		shouldUseBootstrapIconClasses = preset.shouldUseBootstrapIconClasses;
		isDragAndDropEnabled = preset.isDragAndDropEnabled;
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

			// Then folders first, then files
			if (a.data.type !== b.data.type) {
				return a.data.type === 'folder' ? -1 : 1;
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Drag validation callback
	const dragValidationCallback = (draggedNode: any, targetNode: any, position: string) => {
		return draggedNode.data.canEdit && targetNode.data.canEdit;
	};

	// Search callback
	const getSearchValueCallback = (node: any) => {
		return `${node.data.name} ${node.data.type}`.toLowerCase();
	};
</script>

<DocLayout
	titleText="Properties Reference"
	descriptionText="Complete reference for all Tree component properties with interactive examples">

	<div class="py-1">

		<!-- 🎛️ Interactive Demo Section -->
		<ShowcaseSection
			titleText="🎛️ Interactive Property Explorer"
			subtitleText="Experiment with different property combinations to see their effects"
			demoColumnTitle="Live Tree Preview"
			controlsColumnTitle="Property Controls"
			descriptionColumnTitle="Property Presets">

			{#snippet demoContent()}
				<div class="tree-demo" style="min-height: 350px;">
					<Tree
						treeId="api-props-interactive"
						data={sampleData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{expandLevel}
						{shouldToggleOnNodeClick}
						{shouldUseBootstrapIconClasses}
						{isDragAndDropEnabled}
						{sortCallback}
						dragValidationCallback={isDragAndDropEnabled ? dragValidationCallback : undefined}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="property-controls">
					<div class="mb-3">
						<label class="form-label">Expand Level: {expandLevel}</label>
						<input
							type="range"
							class="form-range"
							bind:value={expandLevel}
							min="0"
							max="5"
						/>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							id="toggleOnClick"
							bind:checked={shouldToggleOnNodeClick}
						/>
						<label class="form-check-label" for="toggleOnClick">
							Toggle on Node Click
						</label>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							id="bootstrapIcons"
							bind:checked={shouldUseBootstrapIconClasses}
						/>
						<label class="form-check-label" for="bootstrapIcons">
							Bootstrap Icon Classes
						</label>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							id="dragDrop"
							bind:checked={isDragAndDropEnabled}
						/>
						<label class="form-check-label" for="dragDrop">
							Drag & Drop Enabled
						</label>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="preset-controls">
					<h6 class="mb-3">Quick Presets:</h6>
					<div class="d-grid gap-2">
						{#each Object.entries(propertyPresets) as [key, preset]}
							<button
								type="button"
								class="btn {selectedPreset === key ? 'btn-primary' : 'btn-outline-primary'}"
								onclick={() => {
									selectedPreset = key;
									applyPreset(key);
								}}
							>
								{preset.name}
							</button>
						{/each}
					</div>
					<div class="mt-3">
						<small class="text-muted">
							Select a preset to quickly configure the tree with common property combinations.
						</small>
					</div>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔧 Core Properties Section -->
		<ShowcaseSection
			titleText="🔧 Core Properties"
			subtitleText="Essential properties that define tree behavior and data structure"
			demoColumnTitle="Property Details"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Implementation Notes">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Property</th>
								<th style="width: 15%">Type</th>
								<th style="width: 15%">Default</th>
								<th style="width: 45%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-warning">
								<td><code class="text-danger">data*</code></td>
								<td><code>Array&lt;object&gt;</code></td>
								<td><code>[]</code></td>
								<td>Array of tree node objects. Each object must have properties specified by idMember, pathMember, and displayValueMember.</td>
							</tr>
							<tr class="table-warning">
								<td><code class="text-danger">idMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name that contains unique identifiers for each node. Must be unique across all nodes.</td>
							</tr>
							<tr class="table-warning">
								<td><code class="text-danger">pathMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name that contains the hierarchical path (e.g., "1", "1.1", "1.1.1") using LTree format.</td>
							</tr>
							<tr class="table-warning">
								<td><code class="text-danger">displayValueMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name that contains the text to display for each node.</td>
							</tr>
							<tr>
								<td><code>expandLevel</code></td>
								<td><code>number</code></td>
								<td><code>2</code></td>
								<td>Initial expansion depth. Nodes at this level and above will be expanded by default.</td>
							</tr>
							<tr>
								<td><code>shouldToggleOnNodeClick</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>When true, clicking on a node will expand/collapse it instead of just selecting.</td>
							</tr>
						</tbody>
					</table>
					<div class="text-muted mt-2">
						<small>* Required properties highlighted in yellow</small>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Basic data structure example
const treeData = [
  {
    id: '1',           // idMember value
    path: '1',         // pathMember value
    name: 'Documents', // displayValueMember value
    type: 'folder',    // custom property
    size: null         // custom property
  },
  {
    id: '1.1',
    path: '1.1',       // Child of '1'
    name: 'Projects',
    type: 'folder',
    size: null
  },
  {
    id: '1.1.1',
    path: '1.1.1',    // Grandchild of '1'
    name: 'Website',
    type: 'project',
    size: '150MB'
  }
];

// Component usage
<Tree
  treeId="api-props-basic"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  expandLevel={3}
  shouldToggleOnNodeClick={true}
/>`}
					languageType="javascript"
					titleText="Data Structure & Usage"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🏗️ Data Structure Requirements</h6>
					<ul>
						<li><strong>Unique IDs:</strong> Each node must have a unique identifier</li>
						<li><strong>Path Hierarchy:</strong> Use dot notation like "1.2.3" for parent-child relationships</li>
						<li><strong>Flat Array:</strong> All nodes in a single array, not nested objects</li>
					</ul>

					<h6>📊 Path Format Examples</h6>
					<ul>
						<li><code>"1"</code> - Root level node</li>
						<li><code>"1.1"</code> - Child of node "1"</li>
						<li><code>"1.1.1"</code> - Grandchild of node "1"</li>
						<li><code>"2.5.3"</code> - Third child of fifth child of second root</li>
					</ul>

					<h6>⚡ Performance Notes</h6>
					<p>The component efficiently handles large datasets using the LTree structure for fast hierarchy lookups.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🎨 Styling & Display Properties Section -->
		<ShowcaseSection
			titleText="🎨 Styling & Display Properties"
			subtitleText="Properties that control visual appearance and user interface elements"
			demoColumnTitle="Styling Properties"
			controlsColumnTitle="Styling Examples"
			descriptionColumnTitle="CSS Integration">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Property</th>
								<th style="width: 15%">Type</th>
								<th style="width: 15%">Default</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>shouldUseBootstrapIconClasses</code></td>
								<td><code>boolean</code></td>
								<td><code>true</code></td>
								<td>Use Bootstrap's chevron-right/chevron-down for expand/collapse icons</td>
							</tr>
							<tr>
								<td><code>treeClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class applied to the root tree container</td>
							</tr>
							<tr>
								<td><code>nodeClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class applied to individual tree nodes</td>
							</tr>
							<tr>
								<td><code>selectedNodeClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class applied to selected nodes</td>
							</tr>
							<tr>
								<td><code>expandedNodeClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class applied to expanded parent nodes</td>
							</tr>
							<tr>
								<td><code>dragHighlightClass</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS class applied during drag operations for visual feedback</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Custom styling example */
.custom-tree {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
}

.custom-node {
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.custom-node:hover {
  background-color: #f8f9fa;
}

.selected-node {
  background-color: #0d6efd;
  color: white;
}

.expanded-node {
  font-weight: 600;
}

.drag-highlight {
  border: 2px dashed #0d6efd;
  background-color: rgba(13, 110, 253, 0.1);
}

<!-- Component with custom classes -->
<Tree
  treeId="api-props-styling"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  treeClass="custom-tree"
  nodeClass="custom-node"
  selectedNodeClass="selected-node"
  expandedNodeClass="expanded-node"
  dragHighlightClass="drag-highlight"
/>`}
					languageType="css"
					titleText="Custom Styling"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Bootstrap Integration</h6>
					<p>Works seamlessly with Bootstrap classes out of the box. Set <code>shouldUseBootstrapIconClasses</code> to false for custom icon solutions.</p>

					<h6>🖌️ Custom Themes</h6>
					<p>Use the various class properties to implement custom themes, dark modes, or brand-specific styling.</p>

					<h6>✨ State Classes</h6>
					<p>Different classes for selected, expanded, and drag states allow for rich visual feedback and smooth animations.</p>

					<h6>📱 Responsive Design</h6>
					<p>All styling properties work with responsive design patterns and CSS frameworks.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔄 Interaction Properties Section -->
		<ShowcaseSection
			titleText="🔄 Interaction Properties"
			subtitleText="Properties that control drag & drop, search, and user interactions"
			demoColumnTitle="Interaction Properties"
			controlsColumnTitle="Advanced Usage"
			descriptionColumnTitle="Interaction Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Property</th>
								<th style="width: 15%">Type</th>
								<th style="width: 15%">Default</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>isDragAndDropEnabled</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>Enable drag and drop functionality for reordering nodes</td>
							</tr>
							<tr>
								<td><code>dragValidationCallback</code></td>
								<td><code>function</code></td>
								<td><code>null</code></td>
								<td>Function to validate drag operations: (draggedNode, targetNode, position) => boolean</td>
							</tr>
							<tr>
								<td><code>searchText</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>Search query string that filters and highlights matching nodes</td>
							</tr>
							<tr>
								<td><code>getSearchValueCallback</code></td>
								<td><code>function</code></td>
								<td><code>null</code></td>
								<td>Custom function to extract searchable text from nodes: (node) => string</td>
							</tr>
							<tr>
								<td><code>sortCallback</code></td>
								<td><code>function</code></td>
								<td><code>null</code></td>
								<td>Custom sorting function for tree nodes: (items) => sortedItems</td>
							</tr>
							<tr>
								<td><code>shouldSelectOnClick</code></td>
								<td><code>boolean</code></td>
								<td><code>true</code></td>
								<td>Whether clicking a node should select it</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  // Custom drag validation
  const dragValidation = (draggedNode, targetNode, position) => {
    // Don't allow dropping files into other files
    if (draggedNode.data.type === 'file' &&
        targetNode.data.type === 'file' &&
        position === 'inside') {
      return false;
    }

    // Check permissions
    return draggedNode.data.canEdit && targetNode.data.canEdit;
  };

  // Custom search function
  const getSearchValue = (node) => {
    // Search in name, type, and custom properties
    return \`\${node.data.name} \${node.data.type} \${node.data.tags?.join(' ') || ''}\`.toLowerCase();
  };

  // Custom sort function
  const customSort = (items) => {
    return items.sort((a, b) => {
      // Folders first, then files
      if (a.data.type !== b.data.type) {
        return a.data.type === 'folder' ? -1 : 1;
      }
      // Then by modification date (newest first)
      return new Date(b.data.modified) - new Date(a.data.modified);
    });
  };

  let searchQuery = '';
</script>

<Tree
  treeId="api-props-advanced"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}
  dragValidationCallback={dragValidation}
  searchText={searchQuery}
  getSearchValueCallback={getSearchValue}
  sortCallback={customSort}
  shouldSelectOnClick={true}
/>`}
					languageType="svelte"
					titleText="Advanced Interactions"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🤏 Drag & Drop Validation</h6>
					<p>Use <code>dragValidationCallback</code> to implement business rules like preventing files from being dropped into other files or checking permissions.</p>

					<h6>🔍 Flexible Search</h6>
					<p>The search system uses FlexSearch for performance. Customize what's searchable with <code>getSearchValueCallback</code>.</p>

					<h6>📊 Dynamic Sorting</h6>
					<p>Sort callbacks receive tree nodes with access to original data via <code>node.data</code>. Useful for sorting by dates, types, or custom criteria.</p>

					<h6>⚡ Performance Tips</h6>
					<p>Validation and search callbacks are called frequently - keep them lightweight and avoid expensive operations.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>