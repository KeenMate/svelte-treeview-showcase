<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Quick start data
	const quickStartData = [
		{ id: '1', path: '1', name: 'Documents' },
		{ id: '1.1', path: '1.1', name: 'Projects' },
		{ id: '1.1.1', path: '1.1.1', name: 'My App' },
		{ id: '2', path: '2', name: 'Downloads' }
	];

	// Configuration example data
	const configData = [
		{ id: 'root', path: 'root', title: 'Root Folder', type: 'folder' },
		{ id: 'child1', path: 'root.child1', title: 'Child 1', type: 'folder' },
		{ id: 'child2', path: 'root.child2', title: 'Child 2', type: 'file' },
		{ id: 'grandchild', path: 'root.child1.grandchild', title: 'Grandchild', type: 'file' }
	];

	// Sort callback for configuration example
	const customSort = (items: any[]) => {
		return items.sort((a, b) => {
			// Folders first, then files
			if (a.data.type !== b.data.type) {
				return a.data.type === 'folder' ? -1 : 1;
			}
			return a.data.title.localeCompare(b.data.title);
		});
	};
</script>

<DocLayout
	titleText="Getting Started"
	descriptionText="Learn how to install and use @keenmate/svelte-treeview in your Svelte 5 project">

	<div class="py-1">
		<!-- Installation -->
		<ShowcaseSection
			titleText="GS01 Installation"
			subtitleText="Add the treeview component to your project"
			demoColumnTitle="Package Manager"
			controlsColumnTitle="Verify Installation"
			descriptionColumnTitle="Requirements">

			{#snippet demoContent()}
				<CodeBlock
					codeContent="npm install @keenmate/svelte-treeview"
					languageType="bash"
					titleText="npm"
				/>
				<CodeBlock
					codeContent="pnpm add @keenmate/svelte-treeview"
					languageType="bash"
					titleText="pnpm"
				/>
				<CodeBlock
					codeContent="yarn add @keenmate/svelte-treeview"
					languageType="bash"
					titleText="yarn"
				/>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Check if installation was successful
import { Tree } from '@keenmate/svelte-treeview';

console.log(Tree); // Should output the component`}
					languageType="javascript"
					titleText="Verify Import"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Requirements</h4>
					<ul>
						<li><strong>Svelte 5</strong> - Uses modern runes syntax</li>
						<li><strong>SvelteKit</strong> - For proper module resolution</li>
						<li><strong>TypeScript</strong> - Optional but recommended</li>
					</ul>
					<h4>Browser Support</h4>
					<p>
						Modern browsers with ES2020 support. IE11 is not supported.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Quick Start -->
		<ShowcaseSection
			titleText="GS02 Quick Start"
			subtitleText="Get a basic tree up and running in minutes"
			demoColumnTitle="Live Example"
			controlsColumnTitle="Complete Code"
			descriptionColumnTitle="Key Concepts">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						data={quickStartData}
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
    { id: '1', path: '1', name: 'Documents' },
    { id: '1.1', path: '1.1', name: 'Projects' },
    { id: '1.1.1', path: '1.1.1', name: 'My App' },
    { id: '2', path: '2', name: 'Downloads' }
  ];
</script>

<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
/>`}
					languageType="svelte"
					titleText="Basic Usage"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Required Properties</h4>
					<ul>
						<li><code>data</code> - Array of tree nodes</li>
						<li><code>idMember</code> - Property for unique IDs</li>
						<li><code>pathMember</code> - Property for hierarchical paths</li>
						<li><code>displayValueMember</code> - Property to display</li>
					</ul>
					<h4>Path Structure</h4>
					<p>
						Paths define hierarchy: "1" (root), "1.1" (child), "1.1.1" (grandchild).
						This LTree-inspired structure is efficient and flexible.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Configuration -->
		<ShowcaseSection
			titleText="GS03 Basic Configuration"
			subtitleText="Customize behavior and appearance"
			demoColumnTitle="Configured Tree"
			controlsColumnTitle="Configuration Code"
			descriptionColumnTitle="Configuration Options">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						data={configData}
						idMember="id"
						pathMember="path"
						displayValueMember="title"
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						sortCallback={customSort}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<script>
  const data = [
    { id: 'root', path: 'root', title: 'Root Folder', type: 'folder' },
    { id: 'child1', path: 'root.child1', title: 'Child 1', type: 'folder' },
    { id: 'child2', path: 'root.child2', title: 'Child 2', type: 'file' },
    { id: 'grandchild', path: 'root.child1.grandchild', title: 'Grandchild', type: 'file' }
  ];

  const customSort = (items) => {
    return items.sort((a, b) => {
      // Folders first, then files
      if (a.data.type !== b.data.type) {
        return a.data.type === 'folder' ? -1 : 1;
      }
      return a.data.title.localeCompare(b.data.title);
    });
  };
</script>

<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="title"
  expandLevel={3}
  shouldToggleOnNodeClick={true}
  sortCallback={customSort}
/>`}
					languageType="svelte"
					titleText="With Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Common Options</h4>
					<ul>
						<li><code>expandLevel</code> - Auto-expand depth (default: 2)</li>
						<li><code>shouldToggleOnNodeClick</code> - Click to expand/collapse</li>
						<li><code>sortCallback</code> - Custom sorting function</li>
					</ul>
					<h4>Sorting</h4>
					<p>
						Sort callback receives array of tree nodes with <code>.data</code>
						property containing your original data object.
					</p>
					<h4>Custom Data</h4>
					<p>
						Add any properties to your data objects - they're accessible
						via <code>node.data</code> in callbacks and templates.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Next Steps -->
		<div class="mt-5">
			<h2 class="mb-4">Next Steps</h2>
			<div class="row g-4">
				<div class="col-md-6 col-lg-3">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🌳</div>
							<h5>Basic Examples</h5>
							<p>Learn core features and configurations</p>
							<a href="/examples/basic" class="btn btn-primary">View Examples</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔍</div>
							<h5>Search & Filter</h5>
							<p>Add search functionality to your trees</p>
							<a href="/examples/search" class="btn btn-outline-primary">Learn Search</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔄</div>
							<h5>Drag & Drop</h5>
							<p>Interactive tree manipulation</p>
							<a href="/examples/drag-drop" class="btn btn-outline-primary">Try Drag & Drop</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">📚</div>
							<h5>API Reference</h5>
							<p>Complete component documentation</p>
							<a href="/api/tree" class="btn btn-outline-primary">API Docs</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Common Patterns -->
		<div class="mt-5">
			<h2 class="mb-4">Common Patterns</h2>
			<div class="row g-4">
				<div class="col-lg-6">
					<h4>File System Tree</h4>
					<CodeBlock
						codeContent={`const fileData = [
  { id: '1', path: '1', name: 'src', type: 'folder' },
  { id: '1.1', path: '1.1', name: 'components', type: 'folder' },
  { id: '1.1.1', path: '1.1.1', name: 'Tree.svelte', type: 'file' },
  { id: '1.2', path: '1.2', name: 'utils', type: 'folder' },
  { id: '1.2.1', path: '1.2.1', name: 'helpers.js', type: 'file' }
];

const fileSort = (items) => {
  return items.sort((a, b) => {
    if (a.data.type !== b.data.type) {
      return a.data.type === 'folder' ? -1 : 1;
    }
    return a.data.name.localeCompare(b.data.name);
  });
};`}
						languageType="javascript"
						titleText="File System Structure"
					/>
				</div>
				<div class="col-lg-6">
					<h4>Navigation Menu</h4>
					<CodeBlock
						codeContent={`const navData = [
  { id: 'home', path: 'home', label: 'Home', url: '/' },
  { id: 'products', path: 'products', label: 'Products', url: '/products' },
  { id: 'electronics', path: 'products.electronics', label: 'Electronics', url: '/products/electronics' },
  { id: 'laptops', path: 'products.electronics.laptops', label: 'Laptops', url: '/products/electronics/laptops' },
  { id: 'about', path: 'about', label: 'About', url: '/about' }
];`}
						languageType="javascript"
						titleText="Navigation Structure"
					/>
				</div>
			</div>
		</div>
	</div>
</DocLayout>