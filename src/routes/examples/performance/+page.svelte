<script lang="ts">
  import { DocLayout, ShowcaseSection, CodeBlock } from "@keenmate/svelte-docs";
  import { Tree } from "@keenmate/svelte-treeview";

  // Generate large dataset for performance testing
  function generateLargeDataset(size: number) {
    const data = [];
    const categories = [
      "Documents",
      "Images",
      "Videos",
      "Projects",
      "Archives",
    ];
    const subCategories = [
      "Work", "Personal", "Shared", "Archive", "Temp"
    ];
    const projectTypes = [
      "Web", "Mobile", "Desktop", "Backend", "Database"
    ];
    const fileTypes = [
      "pdf", "docx", "txt", "jpg", "png", "mp4", "zip", "js", "css", "html", "xlsx", "pptx"
    ];

    let itemCounter = 1;

    // First, create root categories (level 1)
    for (let index = 0; index < categories.length && itemCounter <= size; index++) {
      const category = categories[index];
      const rootPath = `${index + 1}`;
      data.push({
        id: `root-${index + 1}`,
        path: rootPath,
        name: `📁 ${category}`,
        type: "folder",
        size: null,
        lastModified: new Date().toISOString(),
      });

      // Create subcategories (level 2)
      for (let subIndex = 0; subIndex < subCategories.length && itemCounter <= size; subIndex++) {
        const subCategory = subCategories[subIndex];
        const subPath = `${rootPath}.${subIndex + 1}`;
        data.push({
          id: `sub-${index + 1}-${subIndex + 1}`,
          path: subPath,
          name: `📁 ${subCategory}`,
          type: "folder",
          size: null,
          lastModified: new Date().toISOString(),
        });

        // Create project folders (level 3)
        const projectCount = Math.floor(Math.random() * 3) + 2; // 2-4 projects per subcategory
        for (let projIndex = 0; projIndex < projectCount && itemCounter <= size; projIndex++) {
          const projectPath = `${subPath}.${projIndex + 1}`;
          const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];

          data.push({
            id: `proj-${index + 1}-${subIndex + 1}-${projIndex + 1}`,
            path: projectPath,
            name: `📁 ${projectType} Project ${projIndex + 1}`,
            type: "folder",
            size: null,
            lastModified: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
          });

          // Create files in projects (level 4)
          const fileCount = Math.floor(Math.random() * 8) + 3; // 3-10 files per project
          for (let fileIndex = 0; fileIndex < fileCount && itemCounter <= size; fileIndex++) {
            const filePath = `${projectPath}.${fileIndex + 1}`;
            const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const isSubFolder = Math.random() > 0.8; // 20% chance of subfolder

            data.push({
              id: `file-${itemCounter}`,
              path: filePath,
              name: isSubFolder
                ? `📁 ${fileType.toUpperCase()} Files`
                : `📄 ${category.toLowerCase()}_${itemCounter}.${fileType}`,
              type: isSubFolder ? "folder" : "file",
              size: isSubFolder ? null : `${Math.floor(Math.random() * 2000) + 10} KB`,
              lastModified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            });

            // If it's a subfolder, add some files inside (level 5)
            if (isSubFolder && itemCounter < size - 5) {
              const subFolderFileCount = Math.floor(Math.random() * 5) + 2; // 2-6 files
              for (let subFileIndex = 0; subFileIndex < subFolderFileCount && itemCounter <= size; subFileIndex++) {
                const subFilePath = `${filePath}.${subFileIndex + 1}`;
                const subFileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];

                data.push({
                  id: `subfile-${itemCounter}-${subFileIndex}`,
                  path: subFilePath,
                  name: `📄 ${fileType}_file_${subFileIndex + 1}.${subFileType}`,
                  type: "file",
                  size: `${Math.floor(Math.random() * 1500) + 5} KB`,
                  lastModified: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                });
              }
            }

            itemCounter++;
          }
        }
      }
    }

    return data;
  }

  // Different dataset sizes for testing
  const datasetSizes = {
    small: { size: 50, label: "Small (50 items)" },
    medium: { size: 200, label: "Medium (200 items)" },
    large: { size: 1000, label: "Large (1000 items)" },
    xlarge: { size: 5000, label: "Extra Large (5000 items)" },
  };

  // Performance configuration
  let selectedDatasetSize = $state("medium");
  let currentData = $state(generateLargeDataset(datasetSizes.medium.size));
  let renderTime = $state(0);
  let searchTime = $state(0);
  let memoryUsage = $state(0);

  // Performance settings
  let expandLevel = $state(1);
  let batchSize = $state(25);
  let batchTimeout = $state(50);
  let enableVirtualization = $state(false);
  let lazyLoading = $state(false);

  // Performance monitoring
  let performanceMetrics = $state({
    renderStart: 0,
    renderEnd: 0,
    searchStart: 0,
    searchEnd: 0,
    lastUpdate: "",
  });

  // Update dataset when size changes
  $effect(() => {
    const size = datasetSizes[selectedDatasetSize].size;
    const start = performance.now();
    currentData = generateLargeDataset(size);
    const end = performance.now();
    renderTime = Math.round(end - start);
    performanceMetrics.lastUpdate = new Date().toLocaleTimeString();
  });

  // Search performance testing
  let searchText = $state("");
  let searchResults = $state(0);

  $effect(() => {
    if (searchText) {
      const start = performance.now();
      const results = currentData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      const end = performance.now();
      searchTime = Math.round(end - start);
      searchResults = results.length;
    } else {
      searchTime = 0;
      searchResults = 0;
    }
  });

  // Memory usage estimation
  $effect(() => {
    if (performance.memory) {
      memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
  });

  // Optimization tips data
  const optimizationTips = [
    {
      title: "Limit Expand Level",
      description: "Keep expandLevel low (1-2) for large datasets",
      impact: "High",
      code: "expandLevel={1}",
    },
    {
      title: "Optimize Batch Size",
      description: "Smaller batches for better responsiveness",
      impact: "Medium",
      code: "indexerBatchSize={10}",
    },
    {
      title: "Increase Timeout",
      description: "Higher timeout prevents UI blocking",
      impact: "Medium",
      code: "indexerTimeout={100}",
    },
    {
      title: "Minimize DOM Updates",
      description: "Use stable keys and avoid unnecessary re-renders",
      impact: "High",
      code: "key={item.id}",
    },
    {
      title: "Debounce Search",
      description: "Add delay to search input to reduce queries",
      impact: "Medium",
      code: "debounce(search, 300)",
    },
  ];

  // Helper function to get level from path
  const getLevel = (path: string) => path.split(".").length;

  // Sort callback with performance consideration
  const sortCallback = (items: any[]) => {
    // Simple sort for better performance with large datasets
    return items.sort((a, b) => {
      // First by level (depth in tree)
      const levelA = getLevel(a.path);
      const levelB = getLevel(b.path);
      if (levelA !== levelB) {
        return levelA - levelB;
      }

      // Then folders first, then by name
      if (a.data.type !== b.data.type) {
        return a.data.type === "folder" ? -1 : 1;
      }

      // Finally by name
      return a.data.name.localeCompare(b.data.name);
    });
  };

  // Fast sort callback (less complex)
  const fastSortCallback = (items: any[]) => {
    // Skip sorting for better performance
    return items;
  };

  // Performance benchmark
  function runPerformanceBenchmark() {
    const sizes = [100, 500, 1000, 2000];
    const results = [];

    sizes.forEach((size) => {
      const start = performance.now();
      generateLargeDataset(size);
      const end = performance.now();
      results.push({
        size,
        time: Math.round(end - start),
      });
    });

    console.table(results);
    return results;
  }
</script>

<DocLayout
  titleText="Performance Examples"
  descriptionText="Large dataset handling, async indexing, and performance optimization techniques"
>
  <div class="py-1">
    <!-- Performance Monitoring -->
    <ShowcaseSection
      titleText="PF01 Performance Monitoring"
      subtitleText="Test different dataset sizes and monitor performance"
      demoColumnTitle="Large Dataset Demo"
      controlsColumnTitle="Performance Controls"
      descriptionColumnTitle="Metrics"
    >
      {#snippet demoContent()}
        <div class="tree-demo">
          <Tree
            treeId="performance-large-dataset"
            data={currentData}
            idMember="id"
            pathMember="path"
            displayValueMember="name"
            {expandLevel}
            shouldToggleOnNodeClick={true}
            shouldUseInternalSearchIndex={true}
            indexerBatchSize={batchSize}
            indexerTimeout={batchTimeout}
			shouldDisplayDebugInformation={true}
            {searchText}
            {sortCallback}
          />
        </div>
      {/snippet}

      {#snippet controlsContent()}
        <div class="tree-controls">
          <div class="form-group mb-3">
            <label class="form-label">Dataset Size</label>
            <select class="form-select" bind:value={selectedDatasetSize}>
              {#each Object.entries(datasetSizes) as [key, dataset]}
                <option value={key}>{dataset.label}</option>
              {/each}
            </select>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Expand Level: {expandLevel}</label>
            <input
              type="range"
              class="form-range"
              bind:value={expandLevel}
              min="0"
              max="5"
            />
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Batch Size: {batchSize}</label>
            <input
              type="range"
              class="form-range"
              bind:value={batchSize}
              min="5"
              max="100"
            />
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Timeout: {batchTimeout}ms</label>
            <input
              type="range"
              class="form-range"
              bind:value={batchTimeout}
              min="10"
              max="200"
            />
          </div>

          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={enableVirtualization}
              id="virtualization"
            />
            <label class="form-check-label" for="virtualization">
              Fast Mode (Disable Sorting)
            </label>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Search Performance Test</label>
            <input
              type="text"
              class="form-control form-control-sm"
              bind:value={searchText}
              placeholder="Type to test search performance"
            />
            {#if searchText}
              <small class="text-muted">
                {searchResults} results in {searchTime}ms
              </small>
            {/if}
          </div>
        </div>
      {/snippet}

      {#snippet descriptionContent()}
        <div class="prose">
          <h4>Performance Metrics</h4>
          <div class="metrics-grid">
            <div class="metric">
              <strong>Render Time:</strong>
              {renderTime}ms
            </div>
            <div class="metric">
              <strong>Search Time:</strong>
              {searchTime}ms
            </div>
            <div class="metric">
              <strong>Items:</strong>
              {currentData.length}
            </div>
            {#if memoryUsage > 0}
              <div class="metric">
                <strong>Memory:</strong>
                {memoryUsage}MB
              </div>
            {/if}
          </div>

          <h4>Performance Impact</h4>
          <ul>
            <li>
              <strong>Expand Level:</strong> Higher = slower initial render
            </li>
            <li><strong>Batch Size:</strong> Smaller = smoother UI</li>
            <li><strong>Timeout:</strong> Higher = less blocking</li>
            <li><strong>Sorting:</strong> Complex sorts slow down rendering</li>
          </ul>

          <h4>Last Updated</h4>
          <p class="tree-state">
            {performanceMetrics.lastUpdate || "Not yet"}
          </p>
        </div>
      {/snippet}
    </ShowcaseSection>

    <!-- Optimization Guide -->
    <ShowcaseSection
      titleText="PF02 Optimization Techniques"
      subtitleText="Best practices for large datasets and smooth performance"
      demoColumnTitle="Optimization Tips"
      controlsColumnTitle="Implementation"
      descriptionColumnTitle="Guidelines"
    >
      {#snippet demoContent()}
        <div class="optimization-tips">
          {#each optimizationTips as tip}
            <div class="tip-card p-3 mb-3 border rounded">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <h6 class="mb-0">{tip.title}</h6>
                <span
                  class="badge bg-{tip.impact === 'High'
                    ? 'danger'
                    : tip.impact === 'Medium'
                      ? 'warning'
                      : 'success'}"
                >
                  {tip.impact} Impact
                </span>
              </div>
              <p class="small text-muted mb-2">{tip.description}</p>
              <code class="small">{tip.code}</code>
            </div>
          {/each}
        </div>
      {/snippet}

      {#snippet controlsContent()}
        <CodeBlock
          codeContent={`// Performance-optimized configuration
<Tree
  treeId="performance-optimized-config"
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  
  // Limit initial expansion
  expandLevel={1}
  
  // Optimize indexing
  shouldUseInternalSearchIndex={true}
  indexerBatchSize={10}        // Smaller batches
  indexerTimeout={100}         // Higher timeout
  
  // Fast sorting
  sortCallback={fastSortCallback}
  
  // Minimal DOM updates
  shouldToggleOnNodeClick={false}
/>

// Fast sort callback
const fastSortCallback = (items) => {
  // Skip complex sorting for large datasets
  return items;
};

// Debounced search
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
  searchText = query;
}, 300);

// Virtual scrolling (for very large trees)
const VirtualTree = ({ data, height = 400 }) => {
  const itemHeight = 32;
  const visibleItems = Math.ceil(height / itemHeight);
  
  // Only render visible items
  const visibleData = data.slice(startIndex, startIndex + visibleItems);
  
  return (
    <Tree treeId="performance-virtual-scrolling" data={visibleData} ... />
  );
};`}
          languageType="svelte"
          titleText="Performance Configuration"
        />
      {/snippet}

      {#snippet descriptionContent()}
        <div class="prose">
          <h4>Performance Guidelines</h4>
          <ul>
            <li>
              <strong>Small datasets (&lt;100):</strong> All optimizations optional
            </li>
            <li>
              <strong>Medium datasets (100-1000):</strong> Limit expand level, optimize
              batching
            </li>
            <li>
              <strong>Large datasets (&gt;1000):</strong> All optimizations recommended
            </li>
            <li>
              <strong>Huge datasets (&gt;10000):</strong> Consider virtual scrolling
            </li>
          </ul>

          <h4>Memory Management</h4>
          <ul>
            <li>Avoid deep object nesting in data</li>
            <li>Use string IDs instead of numbers when possible</li>
            <li>Clean up event listeners</li>
            <li>Implement data pagination for huge datasets</li>
          </ul>

          <h4>Browser Limits</h4>
          <p>
            Most browsers handle 1000-5000 DOM nodes well. Beyond that, consider
            virtualization or pagination.
          </p>
        </div>
      {/snippet}
    </ShowcaseSection>

    <!-- Benchmarking -->
    <ShowcaseSection
      titleText="PF03 Performance Benchmarking"
      subtitleText="Measure and compare performance across different configurations"
      demoColumnTitle="Benchmark Results"
      controlsColumnTitle="Benchmark Code"
      descriptionColumnTitle="Analysis"
    >
      {#snippet demoContent()}
        <div class="benchmark-section">
          <button
            class="btn btn-primary mb-3"
            onclick={() => runPerformanceBenchmark()}
          >
            Run Performance Benchmark
          </button>

          <div class="performance-tips mt-4">
            <h6>Expected Performance (Desktop)</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Dataset Size</th>
                    <th>Render Time</th>
                    <th>Search Time</th>
                    <th>Memory Usage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>100 items</td>
                    <td>&lt; 10ms</td>
                    <td>&lt; 1ms</td>
                    <td>~1MB</td>
                  </tr>
                  <tr>
                    <td>500 items</td>
                    <td>&lt; 50ms</td>
                    <td>&lt; 5ms</td>
                    <td>~3MB</td>
                  </tr>
                  <tr>
                    <td>1000 items</td>
                    <td>&lt; 100ms</td>
                    <td>&lt; 10ms</td>
                    <td>~5MB</td>
                  </tr>
                  <tr class="table-warning">
                    <td>5000 items</td>
                    <td>&lt; 500ms</td>
                    <td>&lt; 50ms</td>
                    <td>~20MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <small class="text-muted"
              >Results may vary based on device performance and browser</small
            >
          </div>
        </div>
      {/snippet}

      {#snippet controlsContent()}
        <CodeBlock
          codeContent={`// Performance benchmark function
function runPerformanceBenchmark() {
  const sizes = [100, 500, 1000, 2000, 5000];
  const results = [];

  sizes.forEach(size => {
    // Test data generation
    const dataStart = performance.now();
    const data = generateLargeDataset(size);
    const dataEnd = performance.now();

    // Test tree rendering
    const renderStart = performance.now();
    // Simulate tree render
    const renderEnd = performance.now();

    // Test search performance
    const searchStart = performance.now();
    const searchResults = data.filter(item => 
      item.name.includes('test')
    );
    const searchEnd = performance.now();

    results.push({
      size,
      dataGeneration: Math.round(dataEnd - dataStart),
      renderTime: Math.round(renderEnd - renderStart),
      searchTime: Math.round(searchEnd - searchStart),
      memoryUsage: performance.memory ? 
        Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) 
        : 'N/A'
    });
  });

  console.table(results);
  return results;
}

// Performance monitoring
function monitorPerformance(callback) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        callback(entry);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
  return observer;
}`}
          languageType="javascript"
          titleText="Benchmarking Code"
        />
      {/snippet}

      {#snippet descriptionContent()}
        <div class="prose">
          <h4>Benchmark Categories</h4>
          <ul>
            <li><strong>Data Generation:</strong> Time to create dataset</li>
            <li><strong>Initial Render:</strong> First paint time</li>
            <li><strong>Search Performance:</strong> Query execution time</li>
            <li><strong>Memory Usage:</strong> Heap size consumption</li>
          </ul>

          <h4>Performance Targets</h4>
          <ul>
            <li><strong>Initial render:</strong> &lt; 100ms</li>
            <li><strong>Search queries:</strong> &lt; 50ms</li>
            <li><strong>Interactions:</strong> &lt; 16ms (60 FPS)</li>
            <li><strong>Memory growth:</strong> Linear with data size</li>
          </ul>

          <h4>Browser Tools</h4>
          <p>
            Use browser DevTools Performance tab to profile real-world usage
            patterns.
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
              <div class="display-6 mb-3">📊</div>
              <h5>Data Structure</h5>
              <p>Optimize your data for better performance</p>
              <a href="/examples/data-structure" class="btn btn-primary"
                >Data Guide</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center h-100">
            <div class="card-body">
              <div class="display-6 mb-3">🔍</div>
              <h5>Search Optimization</h5>
              <p>Advanced search and filtering techniques</p>
              <a href="/examples/search" class="btn btn-outline-primary"
                >Search Examples</a
              >
            </div>
          </div>
        </div>
        <div class="col-md-4">
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
  </div>
</DocLayout>

<style>
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .metric {
    padding: 0.5rem;
    background-color: var(--bs-light);
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .tip-card {
    transition: transform 0.2s;
  }

  .tip-card:hover {
    transform: translateY(-2px);
  }

  .performance-tips {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
