<script lang="ts">
	import { DocLayout, ShowcaseSection, FeatureCard, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for live demo
	const sampleData = [
		{ id: '1', path: '1', name: 'Documents', type: 'folder', size: null },
		{ id: '1.1', path: '1.1', name: 'Projects', type: 'folder', size: null },
		{ id: '1.1.1', path: '1.1.1', name: 'Project A', type: 'folder', size: null },
		{ id: '1.1.2', path: '1.1.2', name: 'Project B', type: 'folder', size: null },
		{ id: '1.1.3', path: '1.1.3', name: 'report.pdf', type: 'file', size: '2.3 MB' },
		{ id: '1.2', path: '1.2', name: 'Templates', type: 'folder', size: null },
		{ id: '1.2.1', path: '1.2.1', name: 'invoice.docx', type: 'file', size: '45 KB' },
		{ id: '2', path: '2', name: 'Pictures', type: 'folder', size: null },
		{ id: '2.1', path: '2.1', name: 'Vacation', type: 'folder', size: null },
		{ id: '2.1.1', path: '2.1.1', name: 'beach.jpg', type: 'file', size: '1.8 MB' },
		{ id: '3', path: '3', name: 'Music', type: 'folder', size: null }
	];

	// Demo state
	let basicTreeData = $state(sampleData);
	let expandLevel = $state(2);

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
</script>

<DocLayout
	titleText="Svelte Treeview Showcase"
	descriptionText="High-performance, feature-rich hierarchical tree view component for Svelte 5">

	<!-- Hero Section -->
	<div class="py-1">
		<div class="text-center mb-5">
			<h1 class="display-4 fw-bold mb-4">
				<span class="text-primary">@keenmate/svelte-treeview</span>
			</h1>
			<p class="lead mb-4">
				A high-performance, feature-rich hierarchical tree view component for Svelte 5 with drag & drop support, search functionality, and flexible data structures using LTree.
			</p>
			<div class="d-flex gap-3 justify-content-center flex-wrap">
				<a href="/getting-started" class="btn btn-primary btn-lg">
					🚀 Get Started
				</a>
				<a href="/examples/basic" class="btn btn-outline-primary btn-lg">
					🌳 View Examples
				</a>
				<a href="https://github.com/keenmate/svelte-treeview" target="_blank" class="btn btn-outline-dark btn-lg">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="me-2">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					</svg>
					GitHub
				</a>
			</div>
		</div>

		<!-- Key Features -->
		<div class="row g-4 mb-5">
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="⚡"
					titleText="Svelte 5 Native"
					descriptionText="Built with Svelte 5 runes for optimal performance and modern reactive patterns"
					variantType="primary"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🌳"
					titleText="LTree Structure"
					descriptionText="Path-based hierarchical data structure inspired by PostgreSQL LTree for efficiency"
					variantType="success"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🔍"
					titleText="FlexSearch Integration"
					descriptionText="Built-in search functionality with async indexing and fuzzy matching"
					variantType="info"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🔄"
					titleText="Drag & Drop"
					descriptionText="Interactive drag and drop with validation, visual feedback, and customizable behavior"
					variantType="warning"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🎨"
					titleText="Highly Customizable"
					descriptionText="Full control over styling, templates, and behavior with extensive theming options"
					variantType="danger"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="📱"
					titleText="Performance Optimized"
					descriptionText="Virtual scrolling, lazy loading, and optimized rendering for large datasets"
					variantType="secondary"
				/>
			</div>
		</div>

		<!-- Quick Install -->
		<ShowcaseSection
			titleText="Quick Installation"
			subtitleText="Get started in seconds"
			col1Title="Package Manager"
			col2Title="Import"
			col3Title="Usage">

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
					codeContent={`import { Tree } from '@keenmate/svelte-treeview';`}
					languageType="javascript"
					titleText="Import component"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Simple to Use</h4>
					<p>
						Install the package using your preferred package manager, then import and use the Tree component in your Svelte application.
					</p>
					<h4>Zero Configuration</h4>
					<p>
						Works out of the box with sensible defaults for common use cases like file systems and navigation trees.
					</p>
					<h4>Framework Agnostic Styling</h4>
					<p>
						Use with any CSS framework or custom styles. Bootstrap classes are supported out of the box.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Example Usage -->
		<div class="mt-5">
			<h2 class="mb-4">Example Usage</h2>
			<div class="row g-4">
				<div class="col-lg-6">
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
  displayValueMember="name" />`}
						languageType="svelte"
						titleText="Basic Tree"
					/>
				</div>
				<div class="col-lg-6">
					<CodeBlock
						codeContent={`<script>
  import { Tree } from '@keenmate/svelte-treeview';

  const sortCallback = (items) => {
    return items.sort((a, b) =>
      a.data.name.localeCompare(b.data.name)
    );
  };
</script>

<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  {sortCallback}
  expandLevel={3}
  shouldToggleOnNodeClick={true} />`}
						languageType="svelte"
						titleText="Advanced Tree"
					/>
				</div>
			</div>
		</div>

		<!-- Stats -->
		<div class="row text-center mt-5 pt-5 border-top">
			<div class="col-md-3">
				<h3 class="display-6 fw-bold text-primary">🌳</h3>
				<p class="text-muted">Hierarchical Structure</p>
			</div>
			<div class="col-md-3">
				<h3 class="display-6 fw-bold text-primary">🔍</h3>
				<p class="text-muted">Search & Filter</p>
			</div>
			<div class="col-md-3">
				<h3 class="display-6 fw-bold text-primary">🔄</h3>
				<p class="text-muted">Drag & Drop</p>
			</div>
			<div class="col-md-3">
				<h3 class="display-6 fw-bold text-primary">⚡</h3>
				<p class="text-muted">High Performance</p>
			</div>
		</div>
	</div>
</DocLayout>