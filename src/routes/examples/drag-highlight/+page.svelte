<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Sample data for drag highlight demo
	const highlightData = [
		{ id: '1', path: '1', name: '📋 Project Management', type: 'category', isDraggable: false, isDropAllowed: true },
		{ id: '1.1', path: '1.1', name: '📝 Tasks', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: '1.1.1', path: '1.1.1', name: 'Design Homepage', type: 'task', isDraggable: true, isDropAllowed: false, priority: 'high' },
		{ id: '1.1.2', path: '1.1.2', name: 'Write Documentation', type: 'task', isDraggable: true, isDropAllowed: false, priority: 'medium' },
		{ id: '1.1.3', path: '1.1.3', name: 'Code Review', type: 'task', isDraggable: true, isDropAllowed: false, priority: 'low' },
		{ id: '1.2', path: '1.2', name: '📁 Resources', type: 'folder', isDraggable: true, isDropAllowed: true },
		{ id: '1.2.1', path: '1.2.1', name: 'Design Assets', type: 'resource', isDraggable: true, isDropAllowed: false },
		{ id: '1.2.2', path: '1.2.2', name: 'Code Templates', type: 'resource', isDraggable: true, isDropAllowed: false },
		{ id: '2', path: '2', name: '🎯 Status Columns', type: 'category', isDraggable: false, isDropAllowed: false },
		{ id: '2.1', path: '2.1', name: '🔄 In Progress', type: 'status', isDraggable: false, isDropAllowed: true },
		{ id: '2.2', path: '2.2', name: '✅ Complete', type: 'status', isDraggable: false, isDropAllowed: true },
		{ id: '2.3', path: '2.3', name: '⏸️ On Hold', type: 'status', isDraggable: false, isDropAllowed: true }
	];

	// Highlight configuration
	let selectedHighlightStyle = $state('default');
	let customHighlightClass = $state('');

	const highlightStyles = {
		default: {
			name: 'Default Highlight',
			class: '',
			description: 'Standard blue drop zone highlight'
		},
		success: {
			name: 'Success Highlight',
			class: 'drag-highlight-success',
			description: 'Green highlight for valid drops'
		},
		warning: {
			name: 'Warning Highlight',
			class: 'drag-highlight-warning',
			description: 'Orange highlight for conditional drops'
		},
		error: {
			name: 'Error Highlight',
			class: 'drag-highlight-error',
			description: 'Red highlight for invalid drops'
		},
		pulse: {
			name: 'Pulse Animation',
			class: 'drag-highlight-pulse',
			description: 'Animated pulsing highlight'
		},
		glow: {
			name: 'Glow Effect',
			class: 'drag-highlight-glow',
			description: 'Glowing border effect'
		}
	};

	$effect(() => {
		const style = highlightStyles[selectedHighlightStyle];
		customHighlightClass = style.class;
	});

	// Event tracking
	let dragEvents = $state<string[]>([]);

	// Drag validation with different highlight types
	const dragValidationCallback = (draggedNode: any, targetNode: any, position: string) => {
		// Log the validation attempt
		const message = `Validating: ${draggedNode.data.name} → ${targetNode.data.name}`;
		dragEvents = [message, ...dragEvents.slice(0, 9)];

		// Tasks can go to status columns
		if (draggedNode.data.type === 'task' && targetNode.data.type === 'status') {
			return true;
		}

		// Resources can go to folders
		if (draggedNode.data.type === 'resource' && targetNode.data.type === 'folder') {
			return true;
		}

		// Folders can be reorganized
		if (draggedNode.data.type === 'folder' && targetNode.data.type === 'folder') {
			return true;
		}

		return false;
	};

	// Event handlers - using callback-style props (Svelte 5)
	const handleDragStart = (node: any, event: DragEvent) => {
		const message = `🟡 Started dragging: ${node.data.name}`;
		dragEvents = [message, ...dragEvents.slice(0, 9)];
	};

	const handleDragOver = (node: any, event: DragEvent) => {
		const message = `🔵 Hovering over: ${node.data.name}`;
		dragEvents = [message, ...dragEvents.slice(0, 9)];
	};

	const handleDrop = (dropNode: any, draggedNode: any, position: string, event: DragEvent | TouchEvent, operation: string) => {
		const targetName = dropNode?.data?.name || 'root';
		const message = `✅ Dropped: ${draggedNode.data.name} → ${targetName} (${position}, ${operation})`;
		dragEvents = [message, ...dragEvents.slice(0, 9)];
	};

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
				const typeOrder = { category: 0, folder: 1, status: 2, task: 3, resource: 4 };
				return (typeOrder[a.data.type] || 999) - (typeOrder[b.data.type] || 999);
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};
</script>

<DocLayout
	titleText="Drag Highlight Examples"
	descriptionText="Visual feedback during drag operations with customizable highlighting">

	<div class="py-1">
		<!-- Interactive Highlight Demo -->
		<ShowcaseSection
			titleText="DH01 Interactive Highlight Demo"
			subtitleText="Try different highlight styles during drag operations"
			demoColumnTitle="Drag & Drop Tree"
			controlsColumnTitle="Highlight Controls"
			descriptionColumnTitle="Highlight Features">

			{#snippet demoContent()}
				<div class="tree-demo">
					<div class="alert alert-info mb-3">
						<strong>💡 Try this:</strong> Drag tasks to status columns or resources to folders
					</div>
					<Tree
						treeId="drag-highlight-basic"
						data={highlightData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						isDragAndDropEnabled={true}
						{dragValidationCallback}
						dragHighlightClass={customHighlightClass}
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						onNodeDragStart={handleDragStart}
						onNodeDragOver={handleDragOver}
						onNodeDrop={handleDrop}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">Highlight Style</label>
						<select class="form-select" bind:value={selectedHighlightStyle}>
							{#each Object.entries(highlightStyles) as [key, style]}
								<option value={key}>{style.name}</option>
							{/each}
						</select>
						<small class="text-muted">{highlightStyles[selectedHighlightStyle].description}</small>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Custom Class</label>
						<input
							type="text"
							class="form-control form-control-sm"
							bind:value={customHighlightClass}
							placeholder="drag-highlight-custom"
						/>
					</div>

					<h6>Drag Events</h6>
					<div class="event-log" style="max-height: 200px; overflow-y: auto;">
						{#if dragEvents.length > 0}
							{#each dragEvents as event}
								<div class="small font-monospace mb-1 p-2 bg-light rounded">{event}</div>
							{/each}
						{:else}
							<div class="text-muted">Start dragging to see events</div>
						{/if}
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Highlight Types</h4>
					<ul>
						<li><strong>Default:</strong> Standard blue drop zone highlight</li>
						<li><strong>Success:</strong> Green for confirmed valid drops</li>
						<li><strong>Warning:</strong> Orange for conditional operations</li>
						<li><strong>Error:</strong> Red for invalid drop attempts</li>
						<li><strong>Pulse:</strong> Animated attention-grabbing effect</li>
						<li><strong>Glow:</strong> Subtle glowing border effect</li>
					</ul>

					<h4>Dynamic Highlighting</h4>
					<p>
						Highlight styles can change based on drag validation,
						node types, or business rules.
					</p>

					<h4>Current Style</h4>
					<p class="tree-state">
						{highlightStyles[selectedHighlightStyle].name}
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- CSS Implementation -->
		<ShowcaseSection
			titleText="DH02 CSS Implementation"
			subtitleText="How to create custom drag highlight styles"
			demoColumnTitle="CSS Examples"
			controlsColumnTitle="Configuration"
			descriptionColumnTitle="Implementation">

			{#snippet demoContent()}
				<CodeBlock
					codeContent={`/* Success Highlight */
.drag-highlight-success {
  background-color: rgba(40, 167, 69, 0.1);
  border: 2px dashed #28a745;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.3);
}

/* Warning Highlight */
.drag-highlight-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border: 2px dashed #ffc107;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
}

/* Error Highlight */
.drag-highlight-error {
  background-color: rgba(220, 53, 69, 0.1);
  border: 2px dashed #dc3545;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.3);
}

/* Pulse Animation */
.drag-highlight-pulse {
  background-color: rgba(0, 123, 255, 0.1);
  border: 2px solid #007bff;
  border-radius: 6px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* Glow Effect */
.drag-highlight-glow {
  background-color: rgba(111, 66, 193, 0.1);
  border: 2px solid #6f42c1;
  border-radius: 8px;
  box-shadow: 
    0 0 20px rgba(111, 66, 193, 0.4),
    inset 0 0 20px rgba(111, 66, 193, 0.1);
}`}
					languageType="css"
					titleText="Highlight Styles"
				/>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<Tree
  treeId="drag-highlight-example"
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  
  // Enable drag & drop
  isDragAndDropEnabled={true}
  
  // Set highlight class
  dragHighlightClass="drag-highlight-success"
  
  // Validation callback
  dragValidationCallback={validateDrop}
/>

// Dynamic highlight based on validation
const getDynamicHighlight = (draggedNode, targetNode) => {
  if (isValidDrop(draggedNode, targetNode)) {
    return 'drag-highlight-success';
  } else if (isConditionalDrop(draggedNode, targetNode)) {
    return 'drag-highlight-warning';
  } else {
    return 'drag-highlight-error';
  }
};

// Update highlight during drag operations
function handleDragOver(event) {
  const { draggedNode, targetNode } = event.detail;
  const highlightClass = getDynamicHighlight(draggedNode, targetNode);
  
  // Update tree highlight class
  treeComponent.setHighlightClass(highlightClass);
}`}
					languageType="svelte"
					titleText="Dynamic Highlights"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Highlight Properties</h4>
					<ul>
						<li><code>dragHighlightClass</code> - CSS class for drop zones</li>
						<li><code>background-color</code> - Highlight background</li>
						<li><code>border</code> - Drop zone border style</li>
						<li><code>box-shadow</code> - Glow and depth effects</li>
						<li><code>animation</code> - Movement and attention effects</li>
					</ul>

					<h4>Best Practices</h4>
					<ul>
						<li>Use consistent color schemes</li>
						<li>Ensure sufficient contrast</li>
						<li>Test with different backgrounds</li>
						<li>Consider accessibility guidelines</li>
						<li>Avoid overly distracting animations</li>
					</ul>

					<h4>Performance</h4>
					<p>
						Use CSS transforms and opacity for animations
						instead of changing layout properties.
					</p>
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
							<p>Optimize for large datasets and smooth animations</p>
							<a href="/examples/performance" class="btn btn-primary">Performance Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">📊</div>
							<h5>Data Structure</h5>
							<p>Understand hierarchical data organization</p>
							<a href="/examples/data-structure" class="btn btn-outline-primary">Data Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔄</div>
							<h5>Drag & Drop</h5>
							<p>Advanced drag and drop interactions</p>
							<a href="/examples/drag-drop" class="btn btn-outline-primary">Drag & Drop</a>
						</div>
					</div>
				</div>
		</div>
		</div>
	</div>
</DocLayout>

<style>
	/* Demo highlight styles */
	:global(.drag-highlight-success) {
		background-color: rgba(40, 167, 69, 0.1);
		border: 2px dashed #28a745;
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(40, 167, 69, 0.3);
	}

	:global(.drag-highlight-warning) {
		background-color: rgba(255, 193, 7, 0.1);
		border: 2px dashed #ffc107;
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
	}

	:global(.drag-highlight-error) {
		background-color: rgba(220, 53, 69, 0.1);
		border: 2px dashed #dc3545;
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(220, 53, 69, 0.3);
	}

	:global(.drag-highlight-pulse) {
		background-color: rgba(0, 123, 255, 0.1);
		border: 2px solid #007bff;
		border-radius: 6px;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.02); opacity: 0.8; }
		100% { transform: scale(1); opacity: 1; }
	}

	:global(.drag-highlight-glow) {
		background-color: rgba(111, 66, 193, 0.1);
		border: 2px solid #6f42c1;
		border-radius: 8px;
		box-shadow: 
			0 0 20px rgba(111, 66, 193, 0.4),
			inset 0 0 20px rgba(111, 66, 193, 0.1);
	}
</style>