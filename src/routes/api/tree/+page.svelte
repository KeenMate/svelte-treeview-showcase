<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Example data for API demonstration
	const apiDemoData = [
		{ id: '1', path: '1', name: 'Documents', type: 'folder' },
		{ id: '1.1', path: '1.1', name: 'Projects', type: 'folder' },
		{ id: '1.1.1', path: '1.1.1', name: 'Website', type: 'project' },
		{ id: '1.1.1.1', path: '1.1.1.1', name: 'Frontend', type: 'folder' },
		{ id: '1.1.1.1.1', path: '1.1.1.1.1', name: 'Components', type: 'folder' },
		{ id: '1.1.1.1.1.1', path: '1.1.1.1.1.1', name: 'Tree.svelte', type: 'file' },
		{ id: '1.1.1.2', path: '1.1.1.2', name: 'Backend', type: 'folder' },
		{ id: '1.1.1.2.1', path: '1.1.1.2.1', name: 'API', type: 'folder' },
		{ id: '1.1.2', path: '1.1.2', name: 'Mobile App', type: 'project' },
		{ id: '2', path: '2', name: 'Images', type: 'folder' },
		{ id: '2.1', path: '2.1', name: 'Icons', type: 'folder' },
		{ id: '2.1.1', path: '2.1.1', name: 'logo.png', type: 'file' }
	];
</script>

<DocLayout
	titleText="Tree Component API"
	descriptionText="Complete API reference for the Tree component with all properties, methods, and events">

	<div class="py-1">

		<!-- 🔧 Properties Section -->
		<ShowcaseSection
			titleText="TR01 🔧 Properties"
			subtitleText="All available properties for the Tree component"
			col1Title="Property Reference"
			col2Title="Usage Examples"
			col3Title="Property Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Property</th>
								<th style="width: 15%">Type</th>
								<th style="width: 15%">Default</th>
								<th style="width: 50%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code class="text-danger">data*</code></td>
								<td><code>Array&lt;object&gt;</code></td>
								<td><code>[]</code></td>
								<td>Array of tree node objects with hierarchical structure</td>
							</tr>
							<tr>
								<td><code class="text-danger">idMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name for unique node identifiers</td>
							</tr>
							<tr>
								<td><code class="text-danger">pathMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name for hierarchical path structure</td>
							</tr>
							<tr>
								<td><code class="text-danger">displayValueMember*</code></td>
								<td><code>string</code></td>
								<td><code>-</code></td>
								<td>Property name for displayed node text</td>
							</tr>
							<tr>
								<td><code>expandLevel</code></td>
								<td><code>number</code></td>
								<td><code>2</code></td>
								<td>Default expansion depth for tree nodes</td>
							</tr>
							<tr>
								<td><code>shouldToggleOnNodeClick</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>Enable expand/collapse on node click</td>
							</tr>
							<tr>
								<td><code>shouldUseBootstrapIconClasses</code></td>
								<td><code>boolean</code></td>
								<td><code>true</code></td>
								<td>Use Bootstrap icon classes for expand/collapse</td>
							</tr>
							<tr>
								<td><code>isDragAndDropEnabled</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>Enable drag and drop functionality</td>
							</tr>
							<tr>
								<td><code>sortCallback</code></td>
								<td><code>function</code></td>
								<td><code>null</code></td>
								<td>Custom sorting function for tree nodes</td>
							</tr>
							<tr>
								<td><code>searchText</code></td>
								<td><code>string</code></td>
								<td><code>''</code></td>
								<td>Search query string for filtering nodes</td>
							</tr>
						</tbody>
					</table>
					<div class="text-muted mt-2">
						<small>* Required properties</small>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<!-- Basic usage with required properties -->
<Tree
  treeId="api-tree-basic"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
/>

<!-- With common options -->
<Tree
  treeId="api-tree-options"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  expandLevel={3}
  shouldToggleOnNodeClick={true}
  isDragAndDropEnabled={true}
  searchText={searchQuery}
/>`}
					languageType="svelte"
					titleText="Property Usage"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>📋 Required Properties</h5>
					<p>The four required properties define the data structure:</p>
					<ul>
						<li><strong>data:</strong> Array of your tree objects</li>
						<li><strong>idMember:</strong> Unique identifier field name</li>
						<li><strong>pathMember:</strong> Hierarchical path field name</li>
						<li><strong>displayValueMember:</strong> Display text field name</li>
					</ul>

					<h5>🎯 Path Structure</h5>
					<p>Uses LTree-inspired paths like "1", "1.1", "1.1.1" for hierarchy.</p>

					<h5>🔍 Search Integration</h5>
					<p>Built-in FlexSearch integration with <code>searchText</code> property.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🎭 Template Snippets Section -->
		<ShowcaseSection
			titleText="TR02 🎭 Template Snippets"
			subtitleText="Customizable snippet templates for advanced styling"
			col1Title="Available Snippets"
			col2Title="Snippet Usage"
			col3Title="Customization Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Snippet</th>
								<th style="width: 35%">Purpose</th>
								<th style="width: 40%">Parameters</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>nodeContent</code></td>
								<td>Custom node display content</td>
								<td><code>node, level, isExpanded</code></td>
							</tr>
							<tr>
								<td><code>expandIcon</code></td>
								<td>Custom expand/collapse icons</td>
								<td><code>isExpanded, hasChildren</code></td>
							</tr>
							<tr>
								<td><code>dragHandle</code></td>
								<td>Custom drag handle element</td>
								<td><code>node, isDragging</code></td>
							</tr>
							<tr>
								<td><code>loadingContent</code></td>
								<td>Loading state indicator</td>
								<td><code>node</code></td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<Tree treeId="api-tree-snippets" data={treeData} idMember="id" pathMember="path" displayValueMember="name">
  {#snippet nodeContent(node, level, isExpanded)}
    <div class="custom-node">
      <i class="icon-{node.data.type}"></i>
      <span class="node-name">{node.data.name}</span>
      {#if node.data.badge}
        <span class="badge bg-primary">{node.data.badge}</span>
      {/if}
    </div>
  {/snippet}

  {#snippet expandIcon(isExpanded, hasChildren)}
    {#if hasChildren}
      <i class="bi bi-{isExpanded ? 'chevron-down' : 'chevron-right'}"></i>
    {/if}
  {/snippet}
</Tree>`}
					languageType="svelte"
					titleText="Custom Snippets"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🎨 Node Content</h5>
					<p>Override default node rendering with custom HTML, icons, badges, and interactive elements.</p>

					<h5>🔽 Expand Icons</h5>
					<p>Customize expand/collapse indicators. Great for custom icon sets or animated transitions.</p>

					<h5>🤏 Drag Handles</h5>
					<p>Custom drag handles for better UX when drag & drop is enabled.</p>

					<h5>⏳ Loading States</h5>
					<p>Show custom loading indicators for async operations.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🖱️ Context Menu Section -->
		<ShowcaseSection
			titleText="TR03 🖱️ Context Menu API"
			subtitleText="Right-click context menus with callback and snippet approaches"
			col1Title="Context Menu Properties"
			col2Title="Context Menu Usage"
			col3Title="Context Menu Features">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Property</th>
								<th style="width: 20%">Type</th>
								<th style="width: 15%">Default</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>contextMenuCallback</code></td>
								<td><code>(node, closeMenuCallback) => ContextMenuItem[]</code></td>
								<td><code>null</code></td>
								<td>Function returning ContextMenuItem[] for dynamic menus. <strong>🆕 v4.3.1:</strong> Now receives <code>closeMenuCallback</code> parameter</td>
							</tr>
							<tr>
								<td><code>contextMenuXOffset</code></td>
								<td><code>number</code></td>
								<td><code>8</code></td>
								<td>Horizontal offset from cursor position (px)</td>
							</tr>
							<tr>
								<td><code>contextMenuYOffset</code></td>
								<td><code>number</code></td>
								<td><code>0</code></td>
								<td>Vertical offset from cursor position (px)</td>
							</tr>
							<tr>
								<td><code>shouldDisplayContextMenuInDebugMode</code></td>
								<td><code>boolean</code></td>
								<td><code>false</code></td>
								<td>Show persistent debug context menu at fixed position</td>
							</tr>
						</tbody>
					</table>

					<div class="mt-4">
						<h6>ContextMenuItem Interface</h6>
						<div class="table-responsive">
							<table class="table table-hover">
								<thead class="table-secondary">
									<tr>
										<th style="width: 20%">Property</th>
										<th style="width: 25%">Type</th>
										<th style="width: 15%">Required</th>
										<th style="width: 40%">Description</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>icon</code></td>
										<td><code>string</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td>Icon or emoji for menu item</td>
									</tr>
									<tr>
										<td><code>title</code></td>
										<td><code>string</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td>Display text for menu item</td>
									</tr>
									<tr>
										<td><code>callback</code></td>
										<td><code>() => void | Promise&lt;void&gt;</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td><strong>🆕 v4.3.1:</strong> Sync or async function to execute</td>
									</tr>
									<tr>
										<td><code>isDisabled</code></td>
										<td><code>boolean</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td>Disable menu item interaction</td>
									</tr>
									<tr>
										<td><code>isDivider</code></td>
										<td><code>boolean</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td>Render as visual separator line</td>
									</tr>
									<tr>
										<td><code>className</code></td>
										<td><code>string</code></td>
										<td><span class="text-muted">Optional</span></td>
										<td>CSS classes for custom styling</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div class="alert alert-success mt-3">
						<h6><strong>🆕 New in v4.3.1 (2025-09-25):</strong></h6>
						<ul class="mb-0">
							<li><strong>Async Callback Support:</strong> Menu callbacks can now return <code>Promise&lt;void&gt;</code></li>
							<li><strong>Automatic Error Handling:</strong> Failed async operations are caught and logged automatically</li>
							<li><strong>Enhanced Menu Control:</strong> Callbacks receive <code>closeMenuCallback</code> parameter for programmatic control</li>
						</ul>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<!-- Callback-based Context Menu (Recommended) -->
<Tree
  treeId="context-menu-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  contextMenuCallback={createContextMenu}
  contextMenuXOffset={10}
  contextMenuYOffset={-5}
/>

<script>
  // Callback function - NEW: Async support in v4.3.1
  const createContextMenu = (node, closeMenuCallback) => {
    return [
      {
        icon: '🔗',
        title: 'Copy Link (Async)',
        callback: async () => {
          // Async operations now fully supported
          await navigator.clipboard.writeText(node.data.url);
          console.log('Link copied successfully');
          closeMenuCallback(); // Optional: close menu after success
        }
      },
      {
        icon: '📁',
        title: 'Create Folder',
        callback: async () => {
          try {
            await createFolder(node.data.path);
            // Success - menu closes automatically
          } catch (error) {
            // Error caught and logged automatically
            console.error('Failed to create folder:', error);
            // Menu stays open for retry
          }
        }
      },
      { isDivider: true },
      {
        icon: '🗑️',
        title: 'Delete',
        callback: () => deleteItem(node),
        isDisabled: !node.data.canDelete,
        className: 'text-danger'
      }
    ];
  };
</script>

<!-- Snippet-based Context Menu (Advanced) -->
<Tree treeId="snippet-context-tree" data={treeData} idMember="id" pathMember="path" displayValueMember="name">
  {#snippet contextMenu(node, closeMenu)}
    <div class="ltree-context-menu">
      <button class="ltree-context-menu-item" onclick={() => action(node, closeMenu)}>
        <span class="ltree-context-menu-icon">⚙️</span>
        <span class="ltree-context-menu-label">Custom Action</span>
      </button>
    </div>
  {/snippet}
</Tree>`}
					languageType="svelte"
					titleText="Context Menu Implementation"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🔄 Two Approaches</h5>
					<ul>
						<li><strong>Callback-based:</strong> Dynamic, type-safe, recommended for most cases</li>
						<li><strong>Snippet-based:</strong> Full control, custom layouts, advanced styling</li>
					</ul>

					<h5>🆕 Async Callback Features (v4.3.1)</h5>
					<ul>
						<li><strong>Promise Support:</strong> Return <code>Promise&lt;void&gt;</code> from callbacks</li>
						<li><strong>Error Handling:</strong> Automatic try/catch wrapper with console logging</li>
						<li><strong>Menu Control:</strong> Optional <code>closeMenuCallback</code> parameter</li>
						<li><strong>Robustness:</strong> Menu stays open on errors for user retry</li>
					</ul>

					<h5>📍 Position Control</h5>
					<p>Fine-tune menu positioning with X/Y offset properties for optimal cursor clearance.</p>

					<h5>🔧 Debug Mode</h5>
					<p>Use <code>shouldDisplayContextMenuInDebugMode</code> for persistent menu display during development.</p>

					<h5>🎨 Styling Options</h5>
					<p>Apply custom CSS classes with <code>className</code> property or use snippet approach for complete control.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🎪 Events Section -->
		<ShowcaseSection
			titleText="TR04 🎪 Callback Props"
			subtitleText="Svelte 5 callback props for interaction handling"
			col1Title="Available Callbacks"
			col2Title="Callback Usage"
			col3Title="Callback Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Callback</th>
								<th style="width: 35%">Trigger</th>
								<th style="width: 40%">Signature</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>onNodeClicked</code></td>
								<td>User clicks on a node</td>
								<td><code>(node: LTreeNode&lt;T&gt;) =&gt; void</code></td>
							</tr>
							<tr>
								<td><code>onNodeDragStart</code></td>
								<td>Drag operation begins</td>
								<td><code>(node, event: DragEvent) =&gt; void</code></td>
							</tr>
							<tr>
								<td><code>onNodeDragOver</code></td>
								<td>Dragging over a node</td>
								<td><code>(node, event: DragEvent) =&gt; void</code></td>
							</tr>
							<tr class="table-info">
								<td><code>onNodeDrop</code></td>
								<td>Drop operation completes</td>
								<td><code>(dropNode, draggedNode, position, event, operation)</code></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="alert alert-info mt-2 small">
					<strong>Note:</strong> Svelte 5 uses callback props, not event dispatchers. Pass functions directly: <code>onNodeClicked={'{'}handler{'}'}</code>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  import { Tree, type LTreeNode } from '@keenmate/svelte-treeview';

  // Svelte 5 callback props (not event dispatchers)
  function handleNodeClicked(node: LTreeNode<MyData>) {
    console.log('Node clicked:', node.path, node.data?.name);
  }

  function handleNodeDragStart(node: LTreeNode<MyData>, event: DragEvent) {
    console.log('Drag started:', node.path);
  }

  function handleNodeDrop(
    dropNode: LTreeNode<MyData> | null,
    draggedNode: LTreeNode<MyData>,
    position: 'above' | 'below' | 'child',
    event: DragEvent | TouchEvent,
    operation: 'move' | 'copy'
  ) {
    console.log(\`\${operation}: \${draggedNode.path} → \${dropNode?.path ?? 'root'} (\${position})\`);
  }
</script>

<Tree
  treeId="api-tree-events"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  isDragAndDropEnabled={true}
  onNodeClicked={handleNodeClicked}
  onNodeDragStart={handleNodeDragStart}
  onNodeDrop={handleNodeDrop}
/>`}
					languageType="svelte"
					titleText="Callback Props (Svelte 5)"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🖱️ User Interactions</h5>
					<p>Use <code>onNodeClicked</code> to handle clicks on tree nodes.</p>

					<h5>🔄 Drag & Drop</h5>
					<p>Use <code>onNodeDrop</code> with position and operation parameters for full control.</p>

					<h5>🎯 onNodeDrop Params</h5>
					<ul class="small">
						<li><code>position</code>: 'above' | 'below' | 'child'</li>
						<li><code>operation</code>: 'move' | 'copy'</li>
						<li><code>dropNode</code>: null for root drops</li>
					</ul>

					<h5>💡 Svelte 5 Pattern</h5>
					<p>Callbacks receive node directly, not CustomEvent objects.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔧 Public Methods Section (v4.5.0+) -->
		<ShowcaseSection
			titleText="TR05 🔧 Public Methods (v4.5.0+)"
			subtitleText="Tree manipulation methods for programmatic control"
			col1Title="Method Reference"
			col2Title="Usage Examples"
			col3Title="Implementation Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 35%">Method</th>
								<th style="width: 25%">Returns</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-info">
								<td><code>addNode(parentPath, data, pathSegment?)</code></td>
								<td><code>AddNodeResult</code></td>
								<td>Add a new node under the specified parent</td>
							</tr>
							<tr class="table-info">
								<td><code>moveNode(sourcePath, targetPath, position)</code></td>
								<td><code>MoveNodeResult</code></td>
								<td>Move a node to a new location</td>
							</tr>
							<tr class="table-info">
								<td><code>removeNode(path)</code></td>
								<td><code>RemoveNodeResult</code></td>
								<td>Remove a node and its descendants</td>
							</tr>
							<tr class="table-info">
								<td><code>updateNode(path, changes)</code></td>
								<td><code>UpdateNodeResult</code></td>
								<td>Update node data properties</td>
							</tr>
							<tr>
								<td><code>copyNodeWithDescendants(node, parentPath, transformer)</code></td>
								<td><code>CopyResult</code></td>
								<td>Deep copy a node subtree with data transformation</td>
							</tr>
							<tr>
								<td><code>getNodeByPath(path)</code></td>
								<td><code>LTreeNode | null</code></td>
								<td>Get a node by its path</td>
							</tr>
							<tr>
								<td><code>getChildren(parentPath)</code></td>
								<td><code>LTreeNode[]</code></td>
								<td>Get direct children of a node</td>
							</tr>
							<tr>
								<td><code>getSiblings(path)</code></td>
								<td><code>LTreeNode[]</code></td>
								<td>Get siblings of a node</td>
							</tr>
							<tr>
								<td><code>getAllData()</code></td>
								<td><code>T[]</code></td>
								<td>Extract all node data for persistence</td>
							</tr>
							<tr>
								<td><code>getExpandedPaths()</code></td>
								<td><code>string[]</code></td>
								<td>Get currently expanded node paths</td>
							</tr>
							<tr>
								<td><code>setExpandedPaths(paths)</code></td>
								<td><code>void</code></td>
								<td>Restore expanded state after data reload</td>
							</tr>
							<tr>
								<td><code>expandNodes(path)</code> / <code>collapseNodes(path)</code></td>
								<td><code>void</code></td>
								<td>Expand/collapse a specific node</td>
							</tr>
							<tr>
								<td><code>expandAll()</code> / <code>collapseAll()</code></td>
								<td><code>void</code></td>
								<td>Expand/collapse all nodes</td>
							</tr>
							<tr>
								<td><code>scrollToPath(path, options?)</code></td>
								<td><code>void</code></td>
								<td>Scroll to and highlight a node</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="alert alert-success mt-3 small">
					<strong>🆕 v4.5.0:</strong> Methods highlighted in blue are new tree editor methods for CRUD operations.
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  let treeRef;

  // Add a new node
  function handleAdd() {
    const newItem = { id: nextId++, name: 'New Item', sortOrder: 10 };
    const result = treeRef.addNode(selectedNode?.path || '', newItem);

    if (result.success) {
      console.log('Added at path:', result.node.path);
      saveToDatabase(result.node.data);
    }
  }

  // Move a node
  function handleMove(targetPath, position) {
    // position: 'above' | 'below' | 'child'
    const result = treeRef.moveNode(selectedNode.path, targetPath, position);

    if (result.success) {
      console.log('Moved to:', result.newPath);
      saveToDatabase({ from: result.oldPath, to: result.newPath });
    }
  }

  // Remove a node
  function handleDelete() {
    const result = treeRef.removeNode(selectedNode.path);

    if (result.success) {
      console.log('Removed', result.removedCount, 'nodes');
      deleteFromDatabase(result.removedPaths);
    }
  }

  // Update node data
  function handleRename(newName) {
    const result = treeRef.updateNode(selectedNode.path, { name: newName });

    if (result.success) {
      saveToDatabase(result.node.data);
    }
  }

  // Save/restore expansion state across reloads
  async function reloadFromDatabase() {
    const expandedPaths = treeRef.getExpandedPaths();

    data = await fetchFromDatabase();
    await tick();

    treeRef.setExpandedPaths(expandedPaths);
  }

  // Get all data for batch save
  function saveAll() {
    const allData = treeRef.getAllData();
    saveBatchToDatabase(allData);
  }
</script>

<Tree
  bind:this={treeRef}
  treeId="editor-tree"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  orderMember="sortOrder"
/>`}
					languageType="svelte"
					titleText="Tree Editor Methods"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>📝 CRUD Operations</h6>
					<p>Use <code>addNode</code>, <code>updateNode</code>, <code>removeNode</code> for direct tree manipulation without full data reload.</p>

					<h6>🔄 Move Operations</h6>
					<p><code>moveNode</code> accepts position: 'above' | 'below' | 'child' to control placement.</p>

					<h6>💾 State Preservation</h6>
					<p>Use <code>getExpandedPaths</code> / <code>setExpandedPaths</code> to preserve UI state across data reloads.</p>

					<h6>📦 Batch Operations</h6>
					<p><code>getAllData()</code> extracts all node data for batch database saves.</p>

					<h6>🎯 Result Objects</h6>
					<p>All CRUD methods return result objects with:</p>
					<ul class="small">
						<li><code>success: boolean</code></li>
						<li><code>node?: LTreeNode</code> (the affected node)</li>
						<li><code>error?: string</code> (if failed)</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 💡 Usage Examples Section -->
		<ShowcaseSection
			titleText="TR06 💡 Usage Examples"
			subtitleText="Common implementation patterns and use cases"
			col1Title="Live Example"
			col2Title="Complete Code"
			col3Title="Implementation Notes">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="api-tree-demo"
						data={apiDemoData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						expandLevel={5}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  const fileSystemData = [
    { id: '1', path: '1', name: 'src', type: 'folder' },
    { id: '1.1', path: '1.1', name: 'components', type: 'folder' },
    { id: '1.1.1', path: '1.1.1', name: 'Tree.svelte', type: 'file' },
    { id: '1.2', path: '1.2', name: 'utils', type: 'folder' },
    { id: '2', path: '2', name: 'package.json', type: 'file' }
  ];

  const sortByTypeAndName = (items) => {
    return items.sort((a, b) => {
      // Folders first
      if (a.data.type !== b.data.type) {
        return a.data.type === 'folder' ? -1 : 1;
      }
      // Then by name
      return a.data.name.localeCompare(b.data.name);
    });
  };
</script>

<Tree
  treeId="api-tree-filesystem"
  data={fileSystemData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  sortCallback={sortByTypeAndName}
  shouldToggleOnNodeClick={true}
  expandLevel={3}
/>`}
					languageType="svelte"
					titleText="File System Tree"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>📁 File System Pattern</h5>
					<p>Common pattern for displaying folder structures with custom sorting to show folders before files.</p>

					<h5>🎯 Key Features Used</h5>
					<ul>
						<li>Custom sort callback</li>
						<li>Click to expand/collapse</li>
						<li>Multi-level expansion</li>
						<li>Type-based organization</li>
					</ul>

					<h5>🔧 Customization Tips</h5>
					<p>Add icons, badges, or context menus using the nodeContent snippet for enhanced UX.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- ♿ Accessibility Section -->
		<ShowcaseSection
			titleText="TR07 ♿ Accessibility"
			subtitleText="Built-in accessibility features and best practices"
			col1Title="Accessibility Features"
			col2Title="ARIA Implementation"
			col3Title="Accessibility Guide">

			{#snippet demoContent()}
				<div class="list-group">
					<div class="list-group-item d-flex align-items-center">
						<i class="bi bi-check-circle-fill text-success me-3"></i>
						<div>
							<strong>Keyboard Navigation</strong>
							<br><small class="text-muted">Arrow keys, Enter, Space for full navigation</small>
						</div>
					</div>
					<div class="list-group-item d-flex align-items-center">
						<i class="bi bi-check-circle-fill text-success me-3"></i>
						<div>
							<strong>ARIA Tree Pattern</strong>
							<br><small class="text-muted">Proper tree, treeitem, and group roles</small>
						</div>
					</div>
					<div class="list-group-item d-flex align-items-center">
						<i class="bi bi-check-circle-fill text-success me-3"></i>
						<div>
							<strong>Screen Reader Support</strong>
							<br><small class="text-muted">aria-expanded, aria-selected, aria-level</small>
						</div>
					</div>
					<div class="list-group-item d-flex align-items-center">
						<i class="bi bi-check-circle-fill text-success me-3"></i>
						<div>
							<strong>Focus Management</strong>
							<br><small class="text-muted">Visible focus indicators and proper tab order</small>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<!-- ARIA attributes are automatically applied -->
<div role="tree" aria-label="File system navigation">
  <div role="treeitem"
       aria-expanded="true"
       aria-level="1"
       tabindex="0">
    Documents
    <div role="group">
      <div role="treeitem"
           aria-expanded="false"
           aria-level="2"
           tabindex="-1">
        Projects
      </div>
    </div>
  </div>
</div>

<!-- Custom aria-label for better context -->
<Tree
  treeId="api-tree-aria"
  data={treeData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  aria-label="Project file structure"
/>`}
					languageType="html"
					titleText="ARIA Structure"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>⌨️ Keyboard Shortcuts</h5>
					<ul>
						<li><kbd>↑↓</kbd> Navigate between nodes</li>
						<li><kbd>←→</kbd> Expand/collapse nodes</li>
						<li><kbd>Enter</kbd> Activate/select node</li>
						<li><kbd>Space</kbd> Toggle selection</li>
						<li><kbd>Home/End</kbd> First/last node</li>
					</ul>

					<h5>🔊 Screen Readers</h5>
					<p>Announces node names, levels, expansion state, and selection status automatically.</p>

					<h5>🎨 High Contrast</h5>
					<p>Focus indicators work with Windows High Contrast mode and respect user preferences.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>