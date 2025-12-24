<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for styling demonstration
	const stylingData = [
		{ id: '1', path: '1', name: '🎨 Design System', type: 'category' },
		{ id: '1.1', path: '1.1', name: 'Colors', type: 'folder' },
		{ id: '1.1.1', path: '1.1.1', name: 'Primary', type: 'color' },
		{ id: '1.1.2', path: '1.1.2', name: 'Secondary', type: 'color' },
		{ id: '1.2', path: '1.2', name: 'Typography', type: 'folder' },
		{ id: '1.2.1', path: '1.2.1', name: 'Headings', type: 'text' },
		{ id: '1.2.2', path: '1.2.2', name: 'Body Text', type: 'text' },
		{ id: '2', path: '2', name: '📱 Components', type: 'category' },
		{ id: '2.1', path: '2.1', name: 'Buttons', type: 'component' },
		{ id: '2.2', path: '2.2', name: 'Forms', type: 'component' }
	];

	// Theme styles
	let selectedTheme = $state('default');
	let customTreeClass = $state('');
	let customNodeClass = $state('');
	let useBootstrapIcons = $state(true);

	const themes = {
		default: {
			name: 'Default',
			treeClass: '',
			nodeClass: '',
			description: 'Standard Bootstrap styling'
		},
		dark: {
			name: 'Dark Theme',
			treeClass: 'tree-dark',
			nodeClass: 'node-dark',
			description: 'Dark background with light text'
		},
		colorful: {
			name: 'Colorful',
			treeClass: 'tree-colorful',
			nodeClass: 'node-colorful',
			description: 'Color-coded by node type'
		},
		compact: {
			name: 'Compact',
			treeClass: 'tree-compact',
			nodeClass: 'node-compact',
			description: 'Reduced spacing and padding'
		},
		minimal: {
			name: 'Minimal',
			treeClass: 'tree-minimal',
			nodeClass: 'node-minimal',
			description: 'Clean, minimal design'
		}
	};

	$effect(() => {
		const theme = themes[selectedTheme];
		customTreeClass = theme.treeClass;
		customNodeClass = theme.nodeClass;
	});

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
				const typeOrder = { category: 0, folder: 1, component: 2, color: 3, text: 4 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};
</script>

<DocLayout
	titleText="Styling Reference"
	descriptionText="Complete CSS customization guide for the Tree component with themes and examples">

	<div class="py-1">

		<!-- 🎨 Theme Gallery Section -->
		<ShowcaseSection
			titleText="ST01 🎨 Theme Gallery"
			subtitleText="Pre-built themes and live styling examples"
			col1Title="Live Theme Preview"
			col2Title="Theme Selector"
			col3Title="Theme Details">

			{#snippet demoContent()}
				<div class="tree-demo" style="min-height: 350px;">
					<Tree
						treeId="api-styling-theme-gallery"
						data={stylingData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						shouldUseBootstrapIconClasses={useBootstrapIcons}
						treeClass={customTreeClass}
						nodeClass={customNodeClass}
						{sortCallback}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="theme-controls">
					<div class="mb-3">
						<label class="form-label">Select Theme:</label>
						<select class="form-select" bind:value={selectedTheme}>
							{#each Object.entries(themes) as [key, theme]}
								<option value={key}>{theme.name}</option>
							{/each}
						</select>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							id="bootstrapIcons"
							bind:checked={useBootstrapIcons}
						/>
						<label class="form-check-label" for="bootstrapIcons">
							Use Bootstrap Icons
						</label>
					</div>

					<div class="mt-3">
						<small class="text-muted">
							<strong>Applied Classes:</strong><br>
							Tree: <code>{customTreeClass || 'none'}</code><br>
							Node: <code>{customNodeClass || 'none'}</code>
						</small>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="theme-info">
					<h6>{themes[selectedTheme].name}</h6>
					<p class="mb-3">{themes[selectedTheme].description}</p>

					<h6>🎯 Theme Features:</h6>
					<ul class="list-unstyled">
						<li>✅ Responsive design</li>
						<li>✅ Accessibility compliant</li>
						<li>✅ Smooth animations</li>
						<li>✅ Bootstrap integration</li>
						<li>✅ Custom color schemes</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔧 CSS Classes Section -->
		<ShowcaseSection
			titleText="ST02 🔧 CSS Classes & Selectors"
			subtitleText="Available CSS classes and selectors for customization"
			col1Title="CSS Class Reference"
			col2Title="Styling Examples"
			col3Title="CSS Architecture">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Class/Selector</th>
								<th style="width: 15%">Type</th>
								<th style="width: 20%">Element</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-info">
								<td><code>.svelte-tree</code></td>
								<td>Default</td>
								<td>Root container</td>
								<td>Main tree wrapper element - always present</td>
							</tr>
							<tr class="table-info">
								<td><code>.svelte-tree-node</code></td>
								<td>Default</td>
								<td>Tree node</td>
								<td>Individual node wrapper - contains content and children</td>
							</tr>
							<tr class="table-info">
								<td><code>.svelte-tree-content</code></td>
								<td>Default</td>
								<td>Node content</td>
								<td>Node display content area (text, icons, etc.)</td>
							</tr>
							<tr class="table-info">
								<td><code>.svelte-tree-expand</code></td>
								<td>Default</td>
								<td>Expand button</td>
								<td>Expand/collapse button element</td>
							</tr>
							<tr class="table-warning">
								<td><code>treeClass</code></td>
								<td>Custom</td>
								<td>Root container</td>
								<td>Custom class applied via component prop</td>
							</tr>
							<tr class="table-warning">
								<td><code>nodeClass</code></td>
								<td>Custom</td>
								<td>Tree node</td>
								<td>Custom class applied to each node</td>
							</tr>
							<tr class="table-warning">
								<td><code>selectedNodeClass</code></td>
								<td>Custom</td>
								<td>Selected node</td>
								<td>Applied to currently selected node</td>
							</tr>
							<tr class="table-warning">
								<td><code>expandedNodeClass</code></td>
								<td>Custom</td>
								<td>Expanded node</td>
								<td>Applied to expanded parent nodes</td>
							</tr>
							<tr class="table-success">
								<td><code>[data-level]</code></td>
								<td>Attribute</td>
								<td>Tree node</td>
								<td>Node depth level for custom styling</td>
							</tr>
							<tr class="table-success">
								<td><code>[data-expanded]</code></td>
								<td>Attribute</td>
								<td>Tree node</td>
								<td>Boolean attribute for expanded state</td>
							</tr>
							<tr class="table-success">
								<td><code>[data-selected]</code></td>
								<td>Attribute</td>
								<td>Tree node</td>
								<td>Boolean attribute for selection state</td>
							</tr>
						</tbody>
					</table>
					<div class="text-muted mt-2">
						<small>
							<span class="badge bg-info">Blue</span> Default classes
							<span class="badge bg-warning text-dark">Yellow</span> Custom prop classes
							<span class="badge bg-success">Green</span> Data attributes
						</small>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Target default classes */
.svelte-tree {
  font-family: 'Inter', sans-serif;
  --tree-indent: 1.5rem;
  --tree-icon-size: 1rem;
}

.svelte-tree-node {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.svelte-tree-node:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.svelte-tree-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.svelte-tree-expand {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}

/* Use data attributes for state */
.svelte-tree-node[data-level="1"] {
  font-weight: 600;
}

.svelte-tree-node[data-selected="true"] {
  background-color: #007bff;
  color: white;
}

.svelte-tree-node[data-expanded="true"] .svelte-tree-expand {
  transform: rotate(90deg);
}

/* Custom classes via props */
.my-custom-tree {
  border: 2px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
}

.my-custom-node {
  margin: 0.125rem 0;
  padding: 0.375rem 0.75rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}`}
					languageType="css"
					titleText="CSS Customization"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🏗️ CSS Architecture</h6>
					<p>The component uses a predictable class hierarchy with default classes, custom prop classes, and data attributes.</p>

					<h6>🎯 Targeting Strategy</h6>
					<ul>
						<li><strong>Default classes:</strong> Always available for basic styling</li>
						<li><strong>Props classes:</strong> Component-specific customization</li>
						<li><strong>Data attributes:</strong> State-based styling</li>
					</ul>

					<h6>⚡ Performance Notes</h6>
					<p>Use CSS custom properties (variables) for dynamic theming without JavaScript overhead.</p>

					<h6>📱 Responsive Design</h6>
					<p>All classes work with media queries and responsive utilities.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🌈 Custom Themes Section -->
		<ShowcaseSection
			titleText="ST03 🌈 Custom Themes"
			subtitleText="Create your own themes with CSS custom properties"
			col1Title="Theme Examples"
			col2Title="Theme Implementation"
			col3Title="Theming Guide">

			{#snippet demoContent()}
				<div class="row g-3">
					<div class="col-lg-6">
						<h6>🌙 Dark Theme</h6>
						<div class="tree-demo tree-dark" style="min-height: 200px;">
							<Tree
								treeId="api-styling-dark-theme"
								data={stylingData.slice(0, 6)}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								expandLevel={2}
								treeClass="tree-dark"
								nodeClass="node-dark"
							/>
						</div>
					</div>
					<div class="col-lg-6">
						<h6>🎨 Colorful Theme</h6>
						<div class="tree-demo tree-colorful" style="min-height: 200px;">
							<Tree
								treeId="api-styling-colorful-theme"
								data={stylingData.slice(0, 6)}
								idMember="id"
								pathMember="path"
								displayValueMember="name"
								expandLevel={2}
								treeClass="tree-colorful"
								nodeClass="node-colorful"
							/>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Dark Theme */
.tree-dark {
  --tree-bg: #2d3748;
  --tree-text: #e2e8f0;
  --tree-hover-bg: #4a5568;
  --tree-selected-bg: #3182ce;
  --tree-border: #4a5568;

  background-color: var(--tree-bg);
  color: var(--tree-text);
  border: 1px solid var(--tree-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

.node-dark:hover {
  background-color: var(--tree-hover-bg);
}

.node-dark[data-selected="true"] {
  background-color: var(--tree-selected-bg);
}

/* Colorful Theme */
.tree-colorful {
  --category-color: #e53e3e;
  --folder-color: #3182ce;
  --component-color: #38a169;
  --color-color: #d69e2e;
  --text-color: #805ad5;
}

.node-colorful[data-type="category"] {
  border-left: 4px solid var(--category-color);
}

.node-colorful[data-type="folder"] {
  border-left: 4px solid var(--folder-color);
}

.node-colorful[data-type="component"] {
  border-left: 4px solid var(--component-color);
}

/* Compact Theme */
.tree-compact .svelte-tree-node {
  padding: 0.125rem 0.25rem;
  font-size: 0.875rem;
}

.tree-compact {
  --tree-indent: 1rem;
  --tree-icon-size: 0.75rem;
}

/* Custom animations */
.svelte-tree-node {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.svelte-tree-expand {
  transition: transform 0.2s ease;
}

.svelte-tree-node[data-expanded="true"] .svelte-tree-expand {
  transform: rotate(90deg);
}`}
					languageType="css"
					titleText="Custom Themes"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎨 CSS Custom Properties</h6>
					<p>Use CSS variables for consistent, maintainable themes that can be changed dynamically.</p>

					<h6>🔄 Dynamic Theming</h6>
					<p>Change themes at runtime by updating CSS custom property values with JavaScript.</p>

					<h6>🌓 Dark Mode Support</h6>
					<p>Use <code>prefers-color-scheme</code> media query to automatically switch themes based on user preferences.</p>

					<h6>✨ Animation & Transitions</h6>
					<p>Add smooth transitions and micro-interactions to enhance user experience.</p>

					<h6>📐 Layout Customization</h6>
					<p>Control spacing, indentation, and sizing with custom properties for consistent scaling.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 📱 Responsive Design Section -->
		<ShowcaseSection
			titleText="ST04 📱 Responsive Design"
			subtitleText="Mobile-friendly styling and responsive behaviors"
			col1Title="Responsive Features"
			col2Title="Responsive CSS"
			col3Title="Mobile Optimization">

			{#snippet demoContent()}
				<div class="responsive-features">
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">✅ Touch-Friendly Interactions</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">Minimum 44px touch targets, appropriate spacing for mobile devices</small>
						</div>
					</div>
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">✅ Responsive Typography</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">Scales appropriately across devices with fluid typography</small>
						</div>
					</div>
					<div class="card mb-3">
						<div class="card-header">
							<h6 class="mb-0">✅ Flexible Layout</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">Adapts to container width, works in sidebars and full-width layouts</small>
						</div>
					</div>
					<div class="card">
						<div class="card-header">
							<h6 class="mb-0">✅ Keyboard Navigation</h6>
						</div>
						<div class="card-body">
							<small class="text-muted">Full keyboard support with visible focus indicators</small>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Mobile-first responsive design */
.svelte-tree {
  /* Base mobile styles */
  --tree-indent: 1rem;
  --tree-node-padding: 0.75rem;
  --tree-icon-size: 1.25rem;
  --tree-font-size: 1rem;
}

.svelte-tree-node {
  padding: var(--tree-node-padding);
  font-size: var(--tree-font-size);
  min-height: 44px; /* Touch target minimum */
}

.svelte-tree-expand {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tablet and up */
@media (min-width: 768px) {
  .svelte-tree {
    --tree-indent: 1.5rem;
    --tree-node-padding: 0.5rem;
    --tree-icon-size: 1rem;
    --tree-font-size: 0.875rem;
  }

  .svelte-tree-node {
    min-height: auto;
  }

  .svelte-tree-expand {
    min-width: auto;
    min-height: auto;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .svelte-tree {
    --tree-indent: 2rem;
  }

  .svelte-tree-node:hover {
    background-color: rgba(0, 123, 255, 0.05);
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 2dppx) {
  .svelte-tree-expand {
    /* Sharper icons for retina displays */
    image-rendering: -webkit-optimize-contrast;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .svelte-tree-node {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .svelte-tree-node:focus {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}`}
					languageType="css"
					titleText="Responsive Styling"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>📱 Mobile-First Approach</h6>
					<p>Styles start with mobile-optimized defaults and enhance for larger screens.</p>

					<h6>👆 Touch Optimization</h6>
					<ul>
						<li>44px minimum touch targets</li>
						<li>Appropriate spacing between interactive elements</li>
						<li>Clear visual feedback for touches</li>
					</ul>

					<h6>♿ Accessibility</h6>
					<ul>
						<li>Respect user motion preferences</li>
						<li>High contrast mode support</li>
						<li>Keyboard navigation indicators</li>
						<li>Screen reader compatibility</li>
					</ul>

					<h6>⚡ Performance</h6>
					<p>Efficient CSS that doesn't impact rendering performance on mobile devices.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🎯 Drag & Drop Classes Section (v4.5.0+) -->
		<ShowcaseSection
			titleText="ST05 🎯 Drag & Drop Styling (v4.5.0+)"
			subtitleText="CSS classes for drag-drop visual feedback, drop zones, and touch support"
			col1Title="Class Reference"
			col2Title="Styling Examples"
			col3Title="Implementation Guide">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Class</th>
								<th style="width: 20%">Category</th>
								<th style="width: 50%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-info">
								<td><code>.ltree-dragover-highlight</code></td>
								<td>Drag Over</td>
								<td>Simple border highlight on drag-over target</td>
							</tr>
							<tr class="table-info">
								<td><code>.ltree-dragover-glow</code></td>
								<td>Drag Over</td>
								<td>Glow effect with arrow indicators for drop positions</td>
							</tr>
							<tr class="table-success">
								<td><code>.ltree-glow-above</code></td>
								<td>Glow Position</td>
								<td>Green glow on top edge (insert above)</td>
							</tr>
							<tr class="table-success">
								<td><code>.ltree-glow-below</code></td>
								<td>Glow Position</td>
								<td>Orange glow on bottom edge (insert below)</td>
							</tr>
							<tr class="table-success">
								<td><code>.ltree-glow-child</code></td>
								<td>Glow Position</td>
								<td>Purple glow on right edge (insert as child)</td>
							</tr>
							<tr class="table-warning">
								<td><code>.ltree-drop-placeholder</code></td>
								<td>Empty Tree</td>
								<td>Container for empty tree drop zone</td>
							</tr>
							<tr class="table-warning">
								<td><code>.ltree-drop-placeholder-content</code></td>
								<td>Empty Tree</td>
								<td>Content inside empty tree placeholder</td>
							</tr>
							<tr class="table-warning">
								<td><code>.ltree-root-drop-zone</code></td>
								<td>Root Drop</td>
								<td>Drop zone at bottom of non-empty trees</td>
							</tr>
							<tr>
								<td><code>.ltree-touch-ghost</code></td>
								<td>Touch</td>
								<td>Ghost element that follows finger during touch drag</td>
							</tr>
							<tr>
								<td><code>.ltree-loading-overlay</code></td>
								<td>Loading</td>
								<td>Semi-transparent overlay during isLoading=true</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="alert alert-info mt-3 small">
					<strong>Tip:</strong> Use <code>dragOverNodeClass="ltree-dragover-glow"</code> to enable the glow mode with arrow indicators.
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`/* Customize glow colors */
.ltree-node-content.ltree-glow-above {
  box-shadow: inset 0 3px 0 0 #86b398; /* Green top glow */
}

.ltree-node-content.ltree-glow-below {
  box-shadow: inset 0 -3px 0 0 #f2b69e; /* Orange bottom glow */
}

.ltree-node-content.ltree-glow-child {
  box-shadow: inset -3px 0 0 0 #a79bc6; /* Purple right glow */
}

/* Custom touch ghost styling */
.ltree-touch-ghost {
  --tree-ghost-bg: rgba(13, 110, 253, 0.9);
  --tree-ghost-color: white;
  background: var(--tree-ghost-bg);
  color: var(--tree-ghost-color);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  max-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Empty tree placeholder */
.ltree-drop-placeholder {
  border: 2px dashed #dee2e6;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
}

.ltree-drop-placeholder.drag-over {
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.05);
}

/* Loading overlay */
.ltree-loading-overlay {
  background: rgba(255, 255, 255, 0.8);
  /* Custom loading indicator */
}

/* SCSS variables for arrow indicators */
$drop-arrow-above: url("data:...");  /* Lucide arrow-big-up */
$drop-arrow-below: url("data:...");  /* Lucide arrow-big-down */
$drop-arrow-child: url("data:...");  /* Lucide arrow-big-right-dash */
$drop-arrow-size: 24px;
$drop-arrow-position: 66%;
$drop-arrow-child-rotation: 45deg;`}
					languageType="scss"
					titleText="Drag & Drop Customization"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h6>🎯 Glow Mode</h6>
					<p>Use <code>dragOverNodeClass="ltree-dragover-glow"</code> for position-aware visual feedback with directional arrows.</p>

					<h6>📱 Touch Ghost</h6>
					<p>Customize the ghost element that follows the user's finger during touch drag operations using CSS variables.</p>

					<h6>📦 Empty Tree Drop</h6>
					<p>Use the <code>dropPlaceholder</code> snippet to create custom drop targets for empty trees.</p>

					<h6>⏳ Loading State</h6>
					<p>The <code>isLoading</code> prop shows an overlay - customize it with CSS.</p>

					<h6>🎨 SCSS Customization</h6>
					<p>Override SCSS variables before importing styles for deep customization of drop indicators and arrows.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>

<style>
	/* Demo theme styles */
	:global(.tree-dark) {
		background-color: #2d3748;
		color: #e2e8f0;
		border: 1px solid #4a5568;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	:global(.node-dark:hover) {
		background-color: #4a5568;
	}

	:global(.tree-colorful .svelte-tree-node) {
		border-left: 4px solid transparent;
		margin: 0.125rem 0;
		padding-left: 0.75rem;
	}

	:global(.tree-colorful .svelte-tree-node:nth-child(1)) {
		border-left-color: #e53e3e;
	}

	:global(.tree-colorful .svelte-tree-node:nth-child(2)) {
		border-left-color: #3182ce;
	}

	:global(.tree-colorful .svelte-tree-node:nth-child(3)) {
		border-left-color: #38a169;
	}

	:global(.tree-colorful .svelte-tree-node:nth-child(4)) {
		border-left-color: #d69e2e;
	}

	:global(.tree-colorful .svelte-tree-node:nth-child(5)) {
		border-left-color: #805ad5;
	}
</style>