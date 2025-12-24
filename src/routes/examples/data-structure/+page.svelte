<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// LTree structure examples
	const ltreeData = [
		{ id: '1', path: '1', name: 'Root Level 1', depth: 1 },
		{ id: '1.1', path: '1.1', name: 'Child 1.1', depth: 2 },
		{ id: '1.1.1', path: '1.1.1', name: 'Grandchild 1.1.1', depth: 3 },
		{ id: '1.1.2', path: '1.1.2', name: 'Grandchild 1.1.2', depth: 3 },
		{ id: '1.2', path: '1.2', name: 'Child 1.2', depth: 2 },
		{ id: '2', path: '2', name: 'Root Level 2', depth: 1 },
		{ id: '2.1', path: '2.1', name: 'Child 2.1', depth: 2 },
		{ id: '2.1.1', path: '2.1.1', name: 'Grandchild 2.1.1', depth: 3 }
	];

	// Windows file system with real paths
	const fileSystemData = [
		{ id: 'fs1', path: 'C:', name: 'C:', type: 'drive', size: null },
		{ id: 'fs2', path: 'C:\\Users', name: 'Users', type: 'folder', size: null },
		{ id: 'fs3', path: 'C:\\Users\\Bob', name: 'Bob', type: 'folder', size: null },
		{ id: 'fs4', path: 'C:\\Users\\Bob\\Documents', name: 'Documents', type: 'folder', size: null },
		{ id: 'fs5', path: 'C:\\Users\\Bob\\Documents\\Report.pdf', name: 'Report.pdf', type: 'file', size: '2.3 MB' },
		{ id: 'fs6', path: 'C:\\Users\\Bob\\Documents\\Budget.xlsx', name: 'Budget.xlsx', type: 'file', size: '856 KB' },
		{ id: 'fs7', path: 'C:\\Users\\Bob\\Pictures', name: 'Pictures', type: 'folder', size: null },
		{ id: 'fs8', path: 'C:\\Users\\Bob\\Pictures\\Vacation.jpg', name: 'Vacation.jpg', type: 'file', size: '3.2 MB' },
		{ id: 'fs9', path: 'C:\\Users\\Alice', name: 'Alice', type: 'folder', size: null },
		{ id: 'fs10', path: 'C:\\Users\\Alice\\Desktop', name: 'Desktop', type: 'folder', size: null },
		{ id: 'fs11', path: 'C:\\Program Files', name: 'Program Files', type: 'folder', size: null },
		{ id: 'fs12', path: 'C:\\Program Files\\MyApp', name: 'MyApp', type: 'folder', size: null },
		{ id: 'fs13', path: 'C:\\Program Files\\MyApp\\app.exe', name: 'app.exe', type: 'file', size: '45.2 MB' }
	];


	// Custom separator examples
	const customSeparatorData = [
		{ id: 'root', path: 'root', name: 'Application Root', type: 'app' },
		{ id: 'auth', path: 'root/auth', name: 'Authentication', type: 'module' },
		{ id: 'login', path: 'root/auth/login', name: 'Login Page', type: 'page' },
		{ id: 'register', path: 'root/auth/register', name: 'Register Page', type: 'page' },
		{ id: 'users', path: 'root/users', name: 'User Management', type: 'module' },
		{ id: 'list', path: 'root/users/list', name: 'User List', type: 'page' },
		{ id: 'profile', path: 'root/users/profile', name: 'User Profile', type: 'page' }
	];

	// Data with pre-calculated metadata
	const enrichedData = [
		{
			id: '1',
			path: '1',
			name: 'Root Node',
			level: 1,
			parentPath: null,
			hasChildren: true,
			type: 'root'
		},
		{
			id: '1.1',
			path: '1.1',
			name: 'First Child',
			level: 2,
			parentPath: '1',
			hasChildren: true,
			type: 'branch'
		},
		{
			id: '1.1.1',
			path: '1.1.1',
			name: 'Grandchild A',
			level: 3,
			parentPath: '1.1',
			hasChildren: false,
			type: 'leaf'
		},
		{
			id: '1.1.2',
			path: '1.1.2',
			name: 'Grandchild B',
			level: 3,
			parentPath: '1.1',
			hasChildren: false,
			type: 'leaf'
		},
		{
			id: '1.2',
			path: '1.2',
			name: 'Second Child',
			level: 2,
			parentPath: '1',
			hasChildren: false,
			type: 'leaf'
		}
	];

	// Minimal data (auto-calculated metadata)
	const minimalData = [
		{ id: 'a', path: 'a', name: 'Auto Root' },
		{ id: 'b', path: 'a.b', name: 'Auto Child 1' },
		{ id: 'c', path: 'a.b.c', name: 'Auto Grandchild' },
		{ id: 'd', path: 'a.d', name: 'Auto Child 2' }
	];

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Helper function to get level from path with custom separator
	const getLevelWithSeparator = (path: string, separator: string = '.') => path.split(separator).length;

	// Sort callback for basic LTree
	const sortCallback = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree)
			const levelA = getLevel(a.path);
			const levelB = getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Sort callback for custom separator paths
	const sortCallbackCustomSeparator = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree with / separator)
			const levelA = getLevelWithSeparator(a.path, '/');
			const levelB = getLevelWithSeparator(b.path, '/');
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Sort callback for Windows file system (backslash separator)
	const sortCallbackFileSystem = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree with \ separator)
			const levelA = getLevelWithSeparator(a.path, '\\');
			const levelB = getLevelWithSeparator(b.path, '\\');
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then drives first, folders second, files last
			if (a.data.type !== b.data.type) {
				const typeOrder = { drive: 0, folder: 1, file: 2 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Sort callback for enriched data (can use pre-calculated level)
	const sortCallbackEnriched = (items: any[]) => {
		return items.sort((a, b) => {
			// Use pre-calculated level if available, otherwise calculate
			const levelA = a.data.level || getLevel(a.path);
			const levelB = b.data.level || getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Backslash separator constant for Windows paths
	const backslashSeparator = '\\';
</script>

<DocLayout
	titleText="Data Structure Examples"
	descriptionText="Understand the path-based LTree structure and data organization">

	<div class="py-1">
		<!-- Custom Path Separators -->
		<ShowcaseSection
			titleText="DS01 Custom Path Separators"
			subtitleText="LTree paths can use any separator, not just dots"
			col1Title="Slash-separated Paths"
			col2Title="Separator Configuration"
			col3Title="Flexibility">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="data-structure-custom-separator"
						data={customSeparatorData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						treePathSeparator="/"
						sortCallback={sortCallbackCustomSeparator}
						expandLevel={4}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Custom separator example with '/'
const data = [
  { id: 'root', path: 'root', name: 'Application Root' },
  { id: 'auth', path: 'root/auth', name: 'Authentication' },
  { id: 'login', path: 'root/auth/login', name: 'Login Page' },
  { id: 'users', path: 'root/users', name: 'User Management' },
  { id: 'list', path: 'root/users/list', name: 'User List' }
];

// Tree component configuration
<Tree
  treeId="data-structure-separator-example"
  data={data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  treePathSeparator="/"  // IMPORTANT: Tell Tree about custom separator!
  sortCallback={sortCallback}
  expandLevel={4}
/>

// Custom sort for '/' separator
const sortCallback = (items) => {
  return items.sort((a, b) => {
    // Calculate level with custom separator
    const levelA = a.path.split('/').length;
    const levelB = b.path.split('/').length;

    if (levelA !== levelB) {
      return levelA - levelB;
    }

    return a.data.name.localeCompare(b.data.name);
  });
};`}
					languageType="javascript"
					titleText="Custom Separator Setup"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Separator Options</h4>
					<ul>
						<li><strong>Dot notation:</strong> <code>1.2.3</code> (default) - <code>treePathSeparator="."</code></li>
						<li><strong>Slash paths:</strong> <code>root/auth/login</code> - <code>treePathSeparator="/"</code></li>
						<li><strong>Windows paths:</strong> <code>C:\Users\Bob</code> - <code>treePathSeparator="\\\\"</code></li>
						<li><strong>Pipe separated:</strong> <code>company|dept|team</code> - <code>treePathSeparator="|"</code></li>
						<li><strong>Double colon:</strong> <code>a::b::c</code> - <code>treePathSeparator="::"</code></li>
						<li><strong>Arrow notation:</strong> <code>root->child->leaf</code> - <code>treePathSeparator="->"</code></li>
					</ul>

					<h4>Use Cases</h4>
					<ul>
						<li>URL-like structures</li>
						<li>File system paths</li>
						<li>Namespace hierarchies</li>
						<li>Custom business logic</li>
					</ul>

					<h4>Implementation Note</h4>
					<p>
						<strong>⚠️ Important:</strong> You must set the <code>treePathSeparator</code> property
						on the Tree component when using custom separators! Default is "." (dot).
					</p>
					<p>
						The separator is used for:
					</p>
					<ul>
						<li>Calculating node levels automatically</li>
						<li>Finding parent-child relationships</li>
						<li>Determining hasChildren property</li>
						<li>Tree expansion/collapse logic</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Automatic Metadata Calculation -->
		<ShowcaseSection
			titleText="DS02 Automatic Metadata Calculation"
			subtitleText="Tree automatically calculates level, parentPath, and hasChildren"
			col1Title="Minimal Data"
			col2Title="What Gets Calculated"
			col3Title="Automatic Features">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="data-structure-minimal"
						data={minimalData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{sortCallback}
						expandLevel={4}
						shouldToggleOnNodeClick={true}
					/>
					<div class="alert alert-info mt-3">
						<strong>💡 This tree uses minimal data</strong> - only id, path, and name are provided.
						Level, parentPath, and hasChildren are calculated automatically!
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Minimal data - only required properties
const minimalData = [
  { id: 'a', path: 'a', name: 'Auto Root' },
  { id: 'b', path: 'a.b', name: 'Auto Child 1' },
  { id: 'c', path: 'a.b.c', name: 'Auto Grandchild' },
  { id: 'd', path: 'a.d', name: 'Auto Child 2' }
];

// Tree component automatically calculates:
// - level: path.split('.').length
// - parentPath: path without last segment
// - hasChildren: true if other nodes start with this path + '.'

// Runtime calculation example:
// For path 'a.b':
// - level = 2 (2 segments)
// - parentPath = 'a'
// - hasChildren = true (because 'a.b.c' exists)`}
					languageType="javascript"
					titleText="Automatic Calculation"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Auto-Calculated Properties</h4>
					<ul>
						<li><strong>level:</strong> Depth in hierarchy (path segment count)</li>
						<li><strong>parentPath:</strong> Path of parent node</li>
						<li><strong>hasChildren:</strong> Whether node has child nodes</li>
					</ul>

					<h4>Benefits</h4>
					<ul>
						<li>Reduces data payload size</li>
						<li>Prevents inconsistencies</li>
						<li>Simplifies data preparation</li>
						<li>Always accurate calculations</li>
					</ul>

					<h4>Performance Note</h4>
					<p>
						For large datasets, consider pre-calculating these values
						on the server to improve client-side performance.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Pre-calculated Metadata -->
		<ShowcaseSection
			titleText="DS03 Pre-calculated Metadata"
			subtitleText="Optimize performance by providing level, parentPath, and hasChildren"
			col1Title="Enriched Data"
			col2Title="Manual Optimization"
			col3Title="Performance Benefits">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="data-structure-enriched"
						data={enrichedData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						sortCallback={sortCallbackEnriched}
						expandLevel={4}
						shouldToggleOnNodeClick={true}
					/>
					<div class="alert alert-success mt-3">
						<strong>⚡ Optimized data</strong> - level, parentPath, and hasChildren are pre-calculated
						for faster rendering with large datasets.
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Enriched data with pre-calculated metadata
const enrichedData = [
  {
    id: '1',
    path: '1',
    name: 'Root Node',
    level: 1,           // Pre-calculated
    parentPath: null,   // Pre-calculated
    hasChildren: true,  // Pre-calculated
    type: 'root'
  },
  {
    id: '1.1',
    path: '1.1',
    name: 'First Child',
    level: 2,
    parentPath: '1',
    hasChildren: true,
    type: 'branch'
  },
  {
    id: '1.1.1',
    path: '1.1.1',
    name: 'Grandchild A',
    level: 3,
    parentPath: '1.1',
    hasChildren: false,
    type: 'leaf'
  }
];`}
					languageType="javascript"
					titleText="Pre-calculated Data"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>When to Pre-calculate</h4>
					<ul>
						<li><strong>Data already available:</strong> When server/database already has these values</li>
						<li><strong>Very large datasets:</strong> 15,000+ nodes for noticeable benefit</li>
						<li><strong>Frequent re-renders:</strong> When tree re-renders often</li>
						<li><strong>Server-side rendering:</strong> For better initial load performance</li>
					</ul>

					<h4>Database Examples</h4>
					<p><strong>PostgreSQL with LTree:</strong></p>
					<pre><code>{`SELECT
  id,
  path,
  name,
  nlevel(path) as level,
  subpath(path, 0, -1) as parent_path,
  EXISTS(SELECT 1 FROM table t2
         WHERE t2.path <@ table.path
         AND t2.path != table.path) as has_children
FROM table
ORDER BY path;`}</code></pre>

					<h4>Performance Impact</h4>
					<p>
						Pre-calculation provides minimal performance gain - typically 10-50ms
						on very large datasets (15k+ nodes). The main benefit is when data
						is already calculated server-side.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- LTree Structure -->
		<ShowcaseSection
			titleText="DS04 LTree Path Structure"
			subtitleText="Understanding the hierarchical path system"
			col1Title="Path Visualization"
			col2Title="Path Examples"
			col3Title="LTree Concepts">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="data-structure-ltree"
						data={ltreeData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{sortCallback}
						expandLevel={4}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// LTree path examples
const data = [
  { id: '1', path: '1', name: 'Root Level 1' },
  { id: '1.1', path: '1.1', name: 'Child 1.1' },
  { id: '1.1.1', path: '1.1.1', name: 'Grandchild 1.1.1' },
  { id: '1.1.2', path: '1.1.2', name: 'Grandchild 1.1.2' },
  { id: '1.2', path: '1.2', name: 'Child 1.2' },
  { id: '2', path: '2', name: 'Root Level 2' },
  { id: '2.1', path: '2.1', name: 'Child 2.1' }
];

// Path structure rules:
// - Root nodes: "1", "2", "3", etc.
// - Children: "1.1", "1.2", "2.1", etc.
// - Grandchildren: "1.1.1", "1.1.2", etc.
// - No limit on depth

// Querying paths:
// - Find children of "1": paths starting with "1."
// - Find all descendants of "1.1": paths starting with "1.1."
// - Get parent of "1.1.2": remove last segment -> "1.1"
// - Get level: count dots + 1`}
					languageType="javascript"
					titleText="LTree Structure"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>LTree Benefits</h4>
					<ul>
						<li><strong>Efficient queries:</strong> Find children/ancestors quickly</li>
						<li><strong>Unlimited depth:</strong> No artificial hierarchy limits</li>
						<li><strong>Sorting friendly:</strong> Natural lexicographic order</li>
						<li><strong>Database compatible:</strong> Works with PostgreSQL LTree</li>
					</ul>

					<h4>Path Rules</h4>
					<ul>
						<li>Use dots to separate levels</li>
						<li>Start numbering from 1</li>
						<li>Keep paths short for performance</li>
						<li>Use consistent numbering scheme</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- File System Example -->
		<ShowcaseSection
			titleText="DS05 Windows File System Structure"
			subtitleText="Real Windows paths with backslash separator"
			col1Title="Windows File Tree"
			col2Title="Data Structure"
			col3Title="Implementation">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						treeId="data-structure-filesystem"
						data={fileSystemData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						treePathSeparator={backslashSeparator}
						shouldDisplayDebugInformation={true}
						sortCallback={sortCallbackFileSystem}
						expandLevel={5}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Windows file system with real paths
const fileSystemData = [
  {
    id: 'fs1',
    path: 'C:',
    name: 'C:',
    type: 'drive',
    size: null
  },
  {
    id: 'fs2',
    path: 'C:\\\\Users',
    name: 'Users',
    type: 'folder',
    size: null
  },
  {
    id: 'fs3',
    path: 'C:\\\\Users\\\\Bob',
    name: 'Bob',
    type: 'folder',
    size: null
  },
  {
    id: 'fs4',
    path: 'C:\\\\Users\\\\Bob\\\\Documents',
    name: 'Documents',
    type: 'folder',
    size: null
  },
  {
    id: 'fs5',
    path: 'C:\\\\Users\\\\Bob\\\\Documents\\\\Report.pdf',
    name: 'Report.pdf',
    type: 'file',
    size: '2.3 MB'
  }
];

// Tree configuration for Windows paths
<Tree
  treeId="data-structure-windows-example"
  data={fileSystemData}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  treePathSeparator="\\\\"  // Use double backslash for Windows paths
  sortCallback={sortCallback}
  expandLevel={5}
/>`}
					languageType="javascript"
					titleText="File System Data"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Windows File System Features</h4>
					<ul>
						<li><strong>Real paths:</strong> Actual Windows file paths</li>
						<li><strong>Backslash separator:</strong> <code>treePathSeparator="\\"</code></li>
						<li><strong>Mixed types:</strong> Drives, folders, files</li>
						<li><strong>File metadata:</strong> Size, type information</li>
					</ul>

					<h4>Path Examples</h4>
					<ul>
						<li><code>C:</code> - Drive root</li>
						<li><code>C:\\Users</code> - System folder</li>
						<li><code>C:\\Users\\Bob</code> - User folder</li>
						<li><code>C:\\Users\\Bob\\Documents\\Report.pdf</code> - File</li>
					</ul>

					<h4>Implementation Notes</h4>
					<ul>
						<li>Escape backslashes in JavaScript strings: use <code>\\\\</code> in strings for single <code>\\</code></li>
						<li>Set <code>treePathSeparator="\\\\"</code> property for backslash separator</li>
						<li>Sort by type (drives, folders, files)</li>
						<li>Handle deep nesting naturally</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Data Structure Comparison -->
		<ShowcaseSection
			titleText="DS06 Data Structure Comparison"
			subtitleText="Choose the right approach for your use case"
			col1Title="Approach Comparison"
			col2Title="Performance Analysis"
			col3Title="Best Practices">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Approach</th>
								<th>Data Size</th>
								<th>Performance</th>
								<th>Use Case</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><strong>Minimal Data</strong></td>
								<td>Smallest</td>
								<td>Excellent (&lt; 15k nodes)</td>
								<td>Simple trees, most use cases</td>
							</tr>
							<tr>
								<td><strong>Pre-calculated</strong></td>
								<td>Larger</td>
								<td>Always optimal</td>
								<td>When available from source</td>
							</tr>
							<tr>
								<td><strong>Custom Separators</strong></td>
								<td>Variable</td>
								<td>Good</td>
								<td>URLs, file paths, namespaces</td>
							</tr>
							<tr>
								<td><strong>PostgreSQL LTree</strong></td>
								<td>Optimized</td>
								<td>Excellent</td>
								<td>Database-driven applications</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// Decision Matrix

// Small datasets (< 1000 nodes)
✅ Use minimal data (auto-calculation is fast)
✅ Pre-calculated metadata is always better if available
⚠️ Performance difference negligible

// Medium datasets (1000-15000 nodes)
✅ Auto-calculation still performs well
✅ Pre-calculated saves ~10-50ms calculation time
⚠️ Consider pre-calculating for frequent re-renders

// Large datasets (15000+ nodes)
✅ Pre-calculate level, parentPath, hasChildren
✅ Performance gain: tens of milliseconds
✅ Use database-optimized queries
✅ Consider lazy loading

// Special requirements
🌐 URLs/paths → Custom separators
🗄️ PostgreSQL → LTree extension
📊 Analytics → Pre-calculated metadata
🔄 Real-time → Minimal payload`}
					languageType="text"
					titleText="Decision Guide"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Performance Guidelines</h4>
					<ul>
						<li><strong>Auto-calculation:</strong> Excellent for &lt; 15k nodes</li>
						<li><strong>Pre-calculated metadata:</strong> Always preferred when available from source</li>
						<li><strong>Performance penalty:</strong> Only ~10-50ms on very large datasets (15k+ nodes)</li>
						<li><strong>Database queries:</strong> Use LTree for complex hierarchies</li>
						<li><strong>Real bottleneck:</strong> Usually rendering, not calculation</li>
					</ul>

					<h4>Migration Path</h4>
					<ol>
						<li><strong>Start simple:</strong> Use minimal data structure</li>
						<li><strong>Measure if needed:</strong> Performance is rarely an issue</li>
						<li><strong>Pre-calculate when available:</strong> Use server data if already computed</li>
						<li><strong>Optimize for 15k+ nodes:</strong> Only then consider dedicated optimization</li>
					</ol>

					<h4>Common Patterns</h4>
					<ul>
						<li><strong>File browsers:</strong> Slash-separated paths</li>
						<li><strong>Organizations:</strong> Dot notation with pre-calculation</li>
						<li><strong>Menus:</strong> Minimal data with auto-calculation</li>
						<li><strong>Categories:</strong> PostgreSQL LTree for complex queries</li>
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
							<div class="display-6 mb-3">⚡</div>
							<h5>Performance</h5>
							<p>Optimize data structures for speed</p>
							<a href="/examples/performance" class="btn btn-primary">Performance Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔍</div>
							<h5>Search Examples</h5>
							<p>Search and filter hierarchical data</p>
							<a href="/examples/search" class="btn btn-outline-primary">Search Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">📚</div>
							<h5>API Reference</h5>
							<p>Complete documentation</p>
							<a href="/api/tree" class="btn btn-outline-primary">API Docs</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</DocLayout>