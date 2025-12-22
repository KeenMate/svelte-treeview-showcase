<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for styling demos
	const themeData = [
		{ id: '1', path: '1', name: '🎨 Design System', type: 'category' },
		{ id: '1.1', path: '1.1', name: 'Colors', type: 'folder' },
		{ id: '1.1.1', path: '1.1.1', name: 'Primary Blue', type: 'color', value: '#007bff' },
		{ id: '1.1.2', path: '1.1.2', name: 'Success Green', type: 'color', value: '#28a745' },
		{ id: '1.1.3', path: '1.1.3', name: 'Warning Orange', type: 'color', value: '#ffc107' },
		{ id: '1.2', path: '1.2', name: 'Typography', type: 'folder' },
		{ id: '1.2.1', path: '1.2.1', name: 'Headings', type: 'typography' },
		{ id: '1.2.2', path: '1.2.2', name: 'Body Text', type: 'typography' },
		{ id: '1.3', path: '1.3', name: 'Components', type: 'folder' },
		{ id: '1.3.1', path: '1.3.1', name: 'Buttons', type: 'component' },
		{ id: '1.3.2', path: '1.3.2', name: 'Forms', type: 'component' },
		{ id: '2', path: '2', name: '📱 Responsive', type: 'category' },
		{ id: '2.1', path: '2.1', name: 'Mobile Styles', type: 'responsive' },
		{ id: '2.2', path: '2.2', name: 'Tablet Styles', type: 'responsive' }
	];

	// Theme configurations
	let selectedTheme = $state('default');
	let customNodeClass = $state('');
	let customTreeClass = $state('');
	let useBootstrapIcons = $state(true);

	const themes = {
		default: {
			name: 'Default Theme',
			treeClass: '',
			nodeClass: '',
			description: 'Standard appearance with minimal styling'
		},
		dark: {
			name: 'Dark Theme',
			treeClass: 'theme-dark',
			nodeClass: 'node-dark',
			description: 'Dark background with light text'
		},
		compact: {
			name: 'Compact Theme',
			treeClass: 'theme-compact',
			nodeClass: 'node-compact',
			description: 'Reduced spacing for dense layouts'
		},
		colorful: {
			name: 'Colorful Theme',
			treeClass: 'theme-colorful',
			nodeClass: 'node-colorful',
			description: 'Color-coded by node type'
		},
		minimal: {
			name: 'Minimal Theme',
			treeClass: 'theme-minimal',
			nodeClass: 'node-minimal',
			description: 'Clean, minimal design'
		}
	};

	$effect(() => {
		const theme = themes[selectedTheme];
		customTreeClass = theme.treeClass;
		customNodeClass = theme.nodeClass;
	});

	// Icon configuration
	const iconData = [
		{ id: '1', path: '1', name: '📁 With Emojis', type: 'folder' },
		{ id: '1.1', path: '1.1', name: '📄 Document.pdf', type: 'file' },
		{ id: '1.2', path: '1.2', name: '🖼️ Image.png', type: 'image' },
		{ id: '2', path: '2', name: 'folder Without Emojis', type: 'folder' },
		{ id: '2.1', path: '2.1', name: 'document.txt', type: 'file' },
		{ id: '2.2', path: '2.2', name: 'photo.jpg', type: 'image' }
	];

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

			// Then by type priority
			if (a.data.type !== b.data.type) {
				const typeOrder = { category: 0, folder: 1, color: 2, typography: 3, component: 4, responsive: 5, file: 6, image: 7 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};
</script>

<DocLayout
	titleText="Custom Styling Examples"
	descriptionText="Visual customization, theming options, and CSS class configurations">

	<div class="py-1">
		<!-- Theme Showcase -->
		<ShowcaseSection
			titleText="CS01 Pre-built Themes"
			subtitleText="Choose from different visual themes"
			demoColumnTitle="Live Theme Demo"
			controlsColumnTitle="Theme Selection"
			descriptionColumnTitle="Theme Features">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="styling-theme-demo"
						data={themeData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						treeRootClass={customTreeClass}
						nodeClass={customNodeClass}
						shouldUseBootstrapIconClasses={useBootstrapIcons}
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">Select Theme</label>
						<select class="form-select" bind:value={selectedTheme}>
							{#each Object.entries(themes) as [key, theme]}
								<option value={key}>{theme.name}</option>
							{/each}
						</select>
						<small class="text-muted">{themes[selectedTheme].description}</small>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							bind:checked={useBootstrapIcons}
							id="bootstrapIcons"
						/>
						<label class="form-check-label" for="bootstrapIcons">
							Use Bootstrap Icon Classes
						</label>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Tree Class</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={customTreeClass}
							placeholder="Custom tree CSS class"
						/>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Node Class</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={customNodeClass}
							placeholder="Custom node CSS class"
						/>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Available Themes</h4>
					<ul>
						<li><strong>Default:</strong> Clean, standard appearance</li>
						<li><strong>Dark:</strong> Dark background with light text</li>
						<li><strong>Compact:</strong> Reduced spacing for dense layouts</li>
						<li><strong>Colorful:</strong> Color-coded by node type</li>
						<li><strong>Minimal:</strong> Ultra-clean design</li>
					</ul>

					<h4>CSS Classes</h4>
					<ul>
						<li><code>treeRootClass</code> - Applied to root tree element</li>
						<li><code>nodeClass</code> - Applied to each tree node</li>
						<li><code>shouldUseBootstrapIconClasses</code> - Enable Bootstrap icons</li>
					</ul>

					<h4>Current Theme</h4>
					<p class="tree-state">
						{themes[selectedTheme].name}
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- CSS Customization -->
		<ShowcaseSection
			titleText="CS02 CSS Customization Guide"
			subtitleText="Learn how to create custom styles for your tree"
			demoColumnTitle="CSS Examples"
			controlsColumnTitle="Theme CSS"
			descriptionColumnTitle="Styling Tips">

			{#snippet demoContent()}
				<CodeBlock
					codeContent={`/* Dark Theme Example */
.theme-dark {
  background-color: #2d3748;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.node-dark {
  color: #e2e8f0;
  padding: 0.5rem;
  border-radius: 4px;
}

.node-dark:hover {
  background-color: #4a5568;
}

.node-dark.selected {
  background-color: #3182ce;
  color: white;
}

/* Compact Theme Example */
.theme-compact {
  font-size: 0.85rem;
  line-height: 1.2;
}

.node-compact {
  padding: 0.25rem;
  margin: 0.1rem 0;
}

/* Colorful Theme Example */
.node-colorful[data-type="folder"] {
  background-color: #fff3cd;
  border-left: 3px solid #ffc107;
}

.node-colorful[data-type="file"] {
  background-color: #d1ecf1;
  border-left: 3px solid #17a2b8;
}

.node-colorful[data-type="image"] {
  background-color: #d4edda;
  border-left: 3px solid #28a745;
}`}
					languageType="css"
					titleText="Theme Styles"
				/>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Custom CSS Variables */
.custom-tree {
  --tree-node-padding: 0.75rem;
  --tree-node-hover-bg: #f8f9fa;
  --tree-node-selected-bg: #007bff;
  --tree-node-border-radius: 6px;
  --tree-indent-size: 1.5rem;
}

/* Node Type Specific Styling */
.tree-node[data-type="category"] {
  font-weight: bold;
  background-color: var(--bs-primary-bg-subtle);
  margin-bottom: 0.5rem;
}

.tree-node[data-type="folder"] {
  font-weight: 500;
}

.tree-node[data-type="file"] {
  font-style: italic;
  opacity: 0.8;
}

/* Icon Customization */
.tree-node-icon {
  margin-right: 0.5rem;
  font-size: 1.1em;
}

/* Expand/Collapse Button */
.tree-expand-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--bs-secondary);
  color: white;
  border: none;
  font-size: 0.75rem;
}

.tree-expand-button:hover {
  background-color: var(--bs-primary);
}`}
					languageType="css"
					titleText="Advanced Styling"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>CSS Selectors</h4>
					<ul>
						<li><code>.tree-root</code> - Root tree container</li>
						<li><code>.tree-node</code> - Individual tree nodes</li>
						<li><code>.tree-node-content</code> - Node content wrapper</li>
						<li><code>.tree-node-icon</code> - Node icons</li>
						<li><code>.tree-expand-button</code> - Expand/collapse buttons</li>
					</ul>

					<h4>Data Attributes</h4>
					<ul>
						<li><code>[data-type]</code> - Node type for type-specific styling</li>
						<li><code>[data-level]</code> - Node depth level</li>
						<li><code>[data-expanded]</code> - Expansion state</li>
						<li><code>[data-selected]</code> - Selection state</li>
					</ul>

					<h4>CSS Variables</h4>
					<p>
						Use CSS custom properties for consistent theming across
						your entire tree component.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Icon Configuration -->
		<ShowcaseSection
			titleText="CS03 Icon Configuration"
			subtitleText="Different approaches to displaying icons"
			demoColumnTitle="Icon Examples"
			controlsColumnTitle="Icon Settings"
			descriptionColumnTitle="Icon Options">

			{#snippet demoContent()}
				<div class="row">
					<div class="col-md-6">
						<h6 class="text-primary mb-3">With Bootstrap Icons</h6>
						<div class="tree-demo" style="min-height: 200px;">
							<Tree
								treeId="styling-bootstrap-icons"
								data={iconData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								shouldUseBootstrapIconClasses={true}
								{sortCallback}
								expandLevel={3}
							/>
						</div>
					</div>
					<div class="col-md-6">
						<h6 class="text-success mb-3">With Emoji Icons</h6>
						<div class="tree-demo" style="min-height: 200px;">
							<Tree
								treeId="styling-emoji-icons"
								data={iconData}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								shouldUseBootstrapIconClasses={false}
								{sortCallback}
								expandLevel={3}
							/>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<!-- Enable Bootstrap Icons -->
<Tree
  treeId="styling-bootstrap-example"
  {data}
  shouldUseBootstrapIconClasses={true}
/>

<!-- Use Emoji Icons (default) -->
<Tree
  treeId="styling-emoji-example"
  {data}
  shouldUseBootstrapIconClasses={false}
/>

/* Custom Icon CSS */
.tree-node-icon.bi-folder {
  color: #ffc107;
}

.tree-node-icon.bi-file-text {
  color: #6c757d;
}

.tree-node-icon.bi-image {
  color: #28a745;
}

/* Custom icon mapping */
const getCustomIcon = (nodeType) => {
  const icons = {
    folder: '📁',
    file: '📄',
    image: '🖼️',
    category: '📂'
  };
  return icons[nodeType] || '📄';
};`}
					languageType="svelte"
					titleText="Icon Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Icon Systems</h4>
					<ul>
						<li><strong>Bootstrap Icons:</strong> Consistent, scalable vector icons</li>
						<li><strong>Emoji Icons:</strong> Colorful, universally supported</li>
						<li><strong>Custom Icons:</strong> Font icons or SVG sprites</li>
						<li><strong>No Icons:</strong> Text-only display</li>
					</ul>

					<h4>Bootstrap Icon Classes</h4>
					<p>
						When enabled, the tree uses Bootstrap icon classes like
						<code>bi-folder</code>, <code>bi-file-text</code>, etc.
					</p>

					<h4>Icon Customization</h4>
					<ul>
						<li>Override icon classes with CSS</li>
						<li>Use data attributes for type-specific styling</li>
						<li>Implement custom icon mappings</li>
						<li>Support for icon fonts and SVG sprites</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Responsive Design -->
		<div class="mt-5">
			<h2 class="mb-4">Responsive Design Examples</h2>
			<div class="row g-4">
				<div class="col-lg-6">
					<h4>Mobile-First CSS</h4>
					<CodeBlock
						codeContent={`/* Mobile-first responsive tree */
.responsive-tree {
  padding: 0.5rem;
}

.responsive-tree .tree-node {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  margin-bottom: 0.25rem;
}

/* Tablet */
@media (min-width: 768px) {
  .responsive-tree .tree-node {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

/* Desktop */
@media (min-width: 992px) {
  .responsive-tree .tree-node {
    padding: 0.375rem;
    font-size: 0.875rem;
  }
}

/* Touch-friendly targets */
@media (pointer: coarse) {
  .tree-expand-button {
    min-width: 44px;
    min-height: 44px;
  }
}`}
						languageType="css"
						titleText="Responsive Styles"
					/>
				</div>
				<div class="col-lg-6">
					<h4>Dark Mode Support</h4>
					<CodeBlock
						codeContent={`/* Automatic dark mode */
@media (prefers-color-scheme: dark) {
  .auto-theme {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }

  .auto-theme .tree-node:hover {
    background-color: #333;
  }

  .auto-theme .tree-node.selected {
    background-color: #0d6efd;
    color: white;
  }
}

/* Manual dark mode toggle */
.dark-mode .tree-root {
  background-color: #2d3748;
  color: #e2e8f0;
}

.dark-mode .tree-node {
  border-color: #4a5568;
}

.dark-mode .tree-node:hover {
  background-color: #4a5568;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .tree-node {
    border: 2px solid currentColor;
  }
}`}
						languageType="css"
						titleText="Dark Mode & Accessibility"
					/>
				</div>
			</div>
		</div>

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
							<div class="display-6 mb-3">⚡</div>
							<h5>Performance</h5>
							<p>Optimize for large datasets</p>
							<a href="/examples/performance" class="btn btn-outline-primary">Performance Tips</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🎨</div>
							<h5>API Styling</h5>
							<p>Complete styling reference</p>
							<a href="/api/styling" class="btn btn-outline-primary">API Reference</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</DocLayout>

<style>
	/* Demo themes */
	:global(.theme-dark) {
		background-color: #2d3748;
		color: #e2e8f0;
		border-radius: 8px;
		padding: 1rem;
	}

	:global(.node-dark) {
		color: #e2e8f0;
		padding: 0.5rem;
		border-radius: 4px;
	}

	:global(.node-dark:hover) {
		background-color: #4a5568;
	}

	:global(.theme-compact) {
		font-size: 0.85rem;
		line-height: 1.2;
	}

	:global(.node-compact) {
		padding: 0.25rem;
		margin: 0.1rem 0;
	}

	:global(.theme-colorful .tree-node[data-type="category"]) {
		background-color: #fff3cd;
		border-left: 3px solid #ffc107;
		padding: 0.5rem;
		margin-bottom: 0.25rem;
	}

	:global(.theme-colorful .tree-node[data-type="folder"]) {
		background-color: #d1ecf1;
		border-left: 3px solid #17a2b8;
		padding: 0.375rem;
	}

	:global(.theme-colorful .tree-node[data-type="color"]) {
		background-color: #d4edda;
		border-left: 3px solid #28a745;
		padding: 0.375rem;
	}

	:global(.theme-minimal) {
		border: none;
		background: transparent;
	}

	:global(.node-minimal) {
		border: none;
		background: transparent;
		padding: 0.25rem 0;
	}

	:global(.node-minimal:hover) {
		background-color: #f8f9fa;
	}
</style>