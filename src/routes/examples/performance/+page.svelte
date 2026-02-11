<script lang="ts">
  import { DocLayout, ShowcaseSection, CodeBlock } from "@keenmate/svelte-docs";
  import { Tree } from "@keenmate/svelte-treeview";
  import { untrack } from "svelte";

  // Countries + States + Cities (slim version, ~2MB instead of 46MB)
  const COUNTRIES_DATA_URL = '/countries-states-cities.json';

  interface StateData {
    name: string;
    cities: string[];  // Just city names
  }

  interface CountryData {
    name: string;
    emoji: string;
    states: StateData[];
  }

  interface TreeNode {
    id: string;
    path: string;
    name: string;
    type: string;
    size: string | null;
    lastModified: string;
  }

  let isLoadingCountries = $state(false);
  let countriesLoadError = $state<string | null>(null);
  let dataSource = $state<'synthetic' | 'countries'>('countries');
  let initialLoadDone = false;

  async function loadCountriesData(): Promise<TreeNode[]> {
    isLoadingCountries = true;
    countriesLoadError = null;

    try {
      const response = await fetch(COUNTRIES_DATA_URL);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const countries: CountryData[] = await response.json();
      return transformCountriesData(countries);
    } catch (error) {
      countriesLoadError = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      isLoadingCountries = false;
    }
  }

  function transformCountriesData(countries: CountryData[]): TreeNode[] {
    const nodes: TreeNode[] = [];
    let id = 1;

    countries.forEach((country, countryIdx) => {
      const countryPath = String(countryIdx + 1);
      const hasStates = country.states && country.states.length > 0;
      const totalCities = hasStates
        ? country.states.reduce((sum, s) => sum + (s.cities?.length || 0), 0)
        : 0;

      // Country node
      nodes.push({
        id: `country-${id++}`,
        path: countryPath,
        name: `${country.emoji || '🌍'} ${country.name}`,
        type: 'country',
        size: hasStates ? `${country.states.length} states, ${totalCities} cities` : null,
        lastModified: new Date().toISOString(),
      });

      if (hasStates) {
        country.states.forEach((state, stateIdx) => {
          const statePath = `${countryPath}.${stateIdx + 1}`;
          const hasCities = state.cities && state.cities.length > 0;

          // State node
          nodes.push({
            id: `state-${id++}`,
            path: statePath,
            name: `📍 ${state.name}`,
            type: 'state',
            size: hasCities ? `${state.cities.length} cities` : null,
            lastModified: new Date().toISOString(),
          });

          // City nodes
          if (hasCities) {
            state.cities.forEach((cityName, cityIdx) => {
              nodes.push({
                id: `city-${id++}`,
                path: `${statePath}.${cityIdx + 1}`,
                name: `🏙️ ${cityName}`,
                type: 'city',
                size: null,
                lastModified: new Date().toISOString(),
              });
            });
          }
        });
      }
    });

    return nodes;
  }

  async function handleLoadCountries() {
    console.log('[Performance] Loading countries data...');
    const start = performance.now();
    try {
      const data = await loadCountriesData();
      console.log('[Performance] Countries loaded:', data.length, 'nodes');
      currentData = data;
      dataSource = 'countries';
      const end = performance.now();
      renderTime = Math.round(end - start);
      performanceMetrics.lastUpdate = new Date().toLocaleTimeString();
      console.log('[Performance] Incrementing treeKey to remount tree');
      treeKey++;
    } catch (error) {
      console.error('Failed to load countries data:', error);
    }
  }

  // Generate large synthetic dataset for performance testing
  function generateLargeDataset(size: number): TreeNode[] {
    const data: TreeNode[] = [];
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
  // 🆕 v4.6.0: Use $state.raw() for large datasets to avoid Svelte's deep proxy overhead
  // Start empty, will load countries on mount
  let currentData = $state.raw<TreeNode[]>([]);
  let renderTime = $state(0);
  let searchTime = $state(0);
  let memoryUsage = $state(0);

  // Performance settings
  let expandLevel = $state(1);
  let batchSize = $state(25);
  let batchTimeout = $state(50);
  let enableVirtualization = $state(false);
  let lazyLoading = $state(false);

  // 🆕 v4.6.0: Progressive flat rendering settings
  let useFlatRendering = $state(true);
  let progressiveRender = $state(true);
  let initialBatchSize = $state(20);
  let maxBatchSize = $state(500);
  let isRendering = $state(false);

  // Key to force Tree re-mount when settings change
  let treeKey = $state(0);
  function reloadTree() {
    console.log('[Performance] Manual reload triggered');
    treeKey++;
  }

  // Load countries data on mount (default data source)
  $effect(() => {
    if (!initialLoadDone) {
      initialLoadDone = true;
      console.log('[Performance] Initial load - fetching countries data');
      handleLoadCountries();
    }
  });

  // Log and react to expandLevel changes
  $effect(() => {
    console.log('[Performance] expandLevel changed to:', expandLevel);
    // expandLevel only takes effect on mount, so we need to remount the tree
    // Skip on initial load since countries loader will handle the first mount
    if (initialLoadDone && currentData.length > 0) {
      untrack(() => {
        console.log('[Performance] Remounting tree with new expandLevel');
        treeKey++;
      });
    }
  });

  // Performance monitoring
  let performanceMetrics = $state({
    renderStart: 0,
    renderEnd: 0,
    searchStart: 0,
    searchEnd: 0,
    lastUpdate: "",
  });

  // Update dataset when size changes (synthetic data)
  function loadDataset(size: number) {
    console.log('[Performance] Loading synthetic dataset, size:', size);
    const start = performance.now();
    currentData = generateLargeDataset(size);
    dataSource = 'synthetic';
    const end = performance.now();
    renderTime = Math.round(end - start);
    console.log('[Performance] Synthetic data loaded:', currentData.length, 'nodes in', renderTime, 'ms');
    performanceMetrics.lastUpdate = new Date().toLocaleTimeString();
    treeKey++; // Force tree re-mount with new data
  }

  // React to dataset size changes (only when in synthetic mode)
  $effect(() => {
    const size = datasetSizes[selectedDatasetSize].size;
    // Only reload if we're already showing synthetic data (user changed size dropdown)
    if (dataSource === 'synthetic' && currentData.length > 0) {
      console.log('[Performance] Dataset size changed to:', size);
      untrack(() => loadDataset(size));
    }
  });

  // Search with navigation
  let searchText = $state("");
  let searchResultNodes = $state<any[]>([]);
  let searchResults = $state(0);
  let currentSearchIndex = $state(-1);
  let treeRef = $state<any>(null);

  function performSearch() {
    if (!treeRef || !searchText.trim()) {
      searchResultNodes = [];
      currentSearchIndex = -1;
      searchTime = 0;
      searchResults = 0;
      return;
    }

    const start = performance.now();
    const results = treeRef.searchNodes(searchText);
    const end = performance.now();

    searchTime = Math.round(end - start);
    searchResultNodes = results || [];
    searchResults = searchResultNodes.length;
    currentSearchIndex = searchResultNodes.length > 0 ? 0 : -1;

    // Navigate to first result
    if (currentSearchIndex >= 0) {
      navigateToResult(currentSearchIndex);
    }
  }

  function navigateToResult(index: number) {
    if (searchResultNodes.length === 0 || !treeRef) return;

    const node = searchResultNodes[index];
    treeRef.scrollToPath(node.path, {
      expand: true,
      highlight: true,
      containerScroll: true
    });
  }

  function nextResult() {
    if (searchResultNodes.length === 0) return;
    currentSearchIndex = (currentSearchIndex + 1) % searchResultNodes.length;
    navigateToResult(currentSearchIndex);
  }

  function prevResult() {
    if (searchResultNodes.length === 0) return;
    currentSearchIndex = (currentSearchIndex - 1 + searchResultNodes.length) % searchResultNodes.length;
    navigateToResult(currentSearchIndex);
  }

  function handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (searchResultNodes.length === 0) {
        performSearch();
      } else {
        nextResult();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextResult();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      prevResult();
    }
  }

  // Memory usage estimation
  $effect(() => {
    if (performance.memory) {
      memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
  });

  // Optimization tips data
  const optimizationTips = [
    {
      title: "🆕 Use $state.raw() (v4.6.0)",
      description: "Avoid Svelte's deep proxy overhead for large arrays (5000x faster!)",
      impact: "High",
      code: "let data = $state.raw([...])",
    },
    {
      title: "🆕 Flat Rendering (v4.6.0)",
      description: "Single loop rendering instead of recursive components (12x faster)",
      impact: "High",
      code: "useFlatRendering={true}",
    },
    {
      title: "🆕 Progressive Render (v4.6.0)",
      description: "Render in batches (20→40→80...) to prevent UI freeze",
      impact: "High",
      code: "progressiveRender={true}",
    },
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
      col1Title="Large Dataset Demo"
      col2Title="Performance Controls"
      col3Title="Metrics"
    >
      {#snippet demoContent()}
        <div class="tree-demo">
          <!-- Search Bar -->
          <div class="search-bar mb-2">
            <div class="input-group input-group-sm">
              <input
                type="text"
                class="form-control"
                bind:value={searchText}
                onkeydown={handleSearchKeydown}
                placeholder="Search nodes... (Enter to search, ↑↓ to navigate)"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                onclick={performSearch}
                title="Search (Enter)"
              >
                🔍
              </button>
              <button
                class="btn btn-outline-secondary"
                type="button"
                onclick={prevResult}
                disabled={searchResultNodes.length === 0}
                title="Previous (↑)"
              >
                ▲
              </button>
              <button
                class="btn btn-outline-secondary"
                type="button"
                onclick={nextResult}
                disabled={searchResultNodes.length === 0}
                title="Next (↓ or Enter)"
              >
                ▼
              </button>
            </div>
            {#if searchResultNodes.length > 0}
              <small class="text-muted">
                {currentSearchIndex + 1} / {searchResults} results ({searchTime}ms)
              </small>
            {:else if searchText && searchResults === 0 && searchTime > 0}
              <small class="text-muted">No results ({searchTime}ms)</small>
            {/if}
          </div>

          <!-- Tree Container -->
          {#if isLoadingCountries}
            <div class="alert alert-info py-2">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading ~28K nodes...
            </div>
          {:else if currentData.length === 0}
            <div class="alert alert-warning py-2">
              No data loaded yet.
            </div>
          {:else}
          {#key treeKey}
            <Tree
              bind:this={treeRef}
              treeId="performance-large-dataset"
              data={currentData}
              idMember="id"
              pathMember="path"
              displayValueMember="name"
              searchValueMember="name"
              {expandLevel}
              shouldToggleOnNodeClick={true}
              shouldUseInternalSearchIndex={true}
              indexerBatchSize={batchSize}
              indexerTimeout={batchTimeout}
              shouldDisplayDebugInformation={true}
              sortCallback={enableVirtualization ? fastSortCallback : sortCallback}
              {useFlatRendering}
              {progressiveRender}
              {initialBatchSize}
              {maxBatchSize}
              bind:isRendering
            />
          {/key}
          {#if isRendering}
            <div class="alert alert-info mt-2 py-1">
              <small>🔄 Progressive rendering in progress...</small>
            </div>
          {/if}
          {/if}
        </div>

        <!-- Performance Metrics -->
        <div class="metrics-grid mt-2">
          <div class="metric">
            <strong>Data Source:</strong>
            {dataSource === 'countries' ? '🌍 Countries/States/Cities' : '📁 Synthetic'}
          </div>
          <div class="metric">
            <strong>Items:</strong>
            {currentData.length.toLocaleString()}
          </div>
          <div class="metric">
            <strong>Load Time:</strong>
            {renderTime}ms
          </div>
          <div class="metric">
            <strong>Search Time:</strong>
            {searchTime}ms
          </div>
          {#if memoryUsage > 0}
            <div class="metric">
              <strong>Memory:</strong>
              {memoryUsage}MB
            </div>
          {/if}
        </div>
      {/snippet}

      {#snippet controlsContent()}
        <div class="tree-controls">
          <!-- Data Source Selection -->
          <div class="form-group mb-3">
            <label class="form-label">Data Source</label>
            <div class="btn-group w-100 mb-2" role="group">
              <button
                type="button"
                class="btn btn-sm {dataSource === 'countries' ? 'btn-primary' : 'btn-outline-primary'}"
                onclick={handleLoadCountries}
                disabled={isLoadingCountries}
              >
                {#if isLoadingCountries}
                  <span class="spinner-border spinner-border-sm me-1"></span>
                {/if}
                🌍 Countries/States/Cities (~28K)
              </button>
              <button
                type="button"
                class="btn btn-sm {dataSource === 'synthetic' ? 'btn-primary' : 'btn-outline-primary'}"
                onclick={() => loadDataset(datasetSizes[selectedDatasetSize].size)}
              >
                📁 Synthetic Data
              </button>
            </div>
            {#if countriesLoadError}
              <div class="alert alert-danger py-1 mb-2">
                <small>Failed to load: {countriesLoadError}</small>
              </div>
            {/if}
          </div>

          {#if dataSource === 'synthetic'}
            <div class="form-group mb-3">
              <label class="form-label">Synthetic Dataset Size</label>
              <select class="form-select" bind:value={selectedDatasetSize}>
                {#each Object.entries(datasetSizes) as [key, dataset]}
                  <option value={key}>{dataset.label}</option>
                {/each}
              </select>
            </div>
          {/if}

          <div class="form-group mb-2">
            <label class="form-label">Expand Level: {expandLevel}</label>
            <input
              type="range"
              class="form-range"
              bind:value={expandLevel}
              min="0"
              max="5"
            />
            <small class="text-muted">How many levels to expand initially (0=collapsed, 5=deep)</small>
          </div>

          <div class="form-group mb-2">
            <label class="form-label">Indexer Batch Size: {batchSize}</label>
            <input
              type="range"
              class="form-range"
              bind:value={batchSize}
              min="5"
              max="100"
            />
            <small class="text-muted">Nodes indexed per batch (for search)</small>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">Indexer Timeout: {batchTimeout}ms</label>
            <input
              type="range"
              class="form-range"
              bind:value={batchTimeout}
              min="10"
              max="200"
            />
            <small class="text-muted">Delay between index batches (higher = less blocking)</small>
          </div>

          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={useFlatRendering}
              id="flatRendering"
            />
            <label class="form-check-label" for="flatRendering">
              🆕 Flat Rendering (v4.6.0)
            </label>
          </div>
          <small class="text-muted d-block mb-2 ms-4">Single loop instead of recursive components - 12x faster</small>

          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={progressiveRender}
              id="progressiveRender"
            />
            <label class="form-check-label" for="progressiveRender">
              🆕 Progressive Render (v4.6.0)
            </label>
          </div>
          <small class="text-muted d-block mb-2 ms-4">Render in batches (20→40→80...) for instant first paint</small>

          {#if progressiveRender}
            <div class="form-group mb-2">
              <label class="form-label small">Initial Batch: {initialBatchSize}</label>
              <input
                type="range"
                class="form-range"
                bind:value={initialBatchSize}
                min="5"
                max="100"
              />
            </div>

            <div class="form-group mb-3">
              <label class="form-label small">Max Batch: {maxBatchSize}</label>
              <input
                type="range"
                class="form-range"
                bind:value={maxBatchSize}
                min="100"
                max="1000"
                step="100"
              />
            </div>
          {/if}

          <div class="form-check mb-1">
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={enableVirtualization}
              id="virtualization"
            />
            <label class="form-check-label" for="virtualization">
              Fast Mode (Skip Sorting)
            </label>
          </div>
          <small class="text-muted d-block mb-3 ms-4">Disables custom sort callback for faster rendering</small>

          <button class="btn btn-primary btn-sm w-100" onclick={reloadTree}>
            🔄 Apply Settings & Reload Tree
          </button>
        </div>
      {/snippet}

      {#snippet descriptionContent()}
        <div class="prose">
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
      col1Title="Optimization Tips"
      col2Title="Implementation"
      col3Title="Guidelines"
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
          codeContent={`<script>
  // 🆕 v4.6.0: CRITICAL - Use $state.raw() for large datasets!
  // This avoids Svelte's deep proxy overhead (5000x faster)
  let data = $state.raw(largeDataset);

  // Track rendering progress
  let isRendering = $state(false);
</script>

// 🆕 v4.6.0 Performance-optimized configuration
<Tree
  treeId="performance-optimized-config"
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"

  // 🆕 v4.6.0: Flat rendering (12x faster initial render)
  useFlatRendering={true}

  // 🆕 v4.6.0: Progressive batching (20→40→80→160...)
  progressiveRender={true}
  initialBatchSize={20}    // Instant first paint
  maxBatchSize={500}       // Cap for large batches

  // Track rendering state
  bind:isRendering
  onRenderComplete={() => console.log('Done!')}

  // Limit initial expansion
  expandLevel={1}

  // Optimize indexing
  shouldUseInternalSearchIndex={true}
  indexerBatchSize={10}
  indexerTimeout={100}
/>

{#if isRendering}
  <div class="loading">Rendering...</div>
{/if}

// Debounced search for large datasets
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
  searchText = query;
}, 300);`}
          languageType="svelte"
          titleText="v4.6.0 Performance Configuration"
        />
      {/snippet}

      {#snippet descriptionContent()}
        <div class="prose">
          <h4>🆕 v4.6.0 Performance Guidelines</h4>
          <ul>
            <li>
              <strong>Always use <code>$state.raw()</code></strong> for data arrays with 1000+ items
            </li>
            <li>
              <strong>Flat rendering</strong> is now default and 12x faster
            </li>
            <li>
              <strong>Progressive render</strong> gives instant first paint
            </li>
          </ul>

          <h4>Dataset Size Recommendations</h4>
          <ul>
            <li>
              <strong>&lt;100:</strong> All optimizations optional
            </li>
            <li>
              <strong>100-1000:</strong> Use <code>$state.raw()</code>, limit expand level
            </li>
            <li>
              <strong>1000-5000:</strong> All optimizations recommended
            </li>
            <li>
              <strong>&gt;5000:</strong> Consider pagination or lazy loading
            </li>
          </ul>

          <h4>Key v4.6.0 Settings</h4>
          <ul>
            <li><code>useFlatRendering={'{'}true{'}'}</code> (default)</li>
            <li><code>progressiveRender={'{'}true{'}'}</code> (default)</li>
            <li><code>initialBatchSize={'{'}20{'}'}</code> for instant first paint</li>
          </ul>
        </div>
      {/snippet}
    </ShowcaseSection>

    <!-- Benchmarking -->
    <ShowcaseSection
      titleText="PF03 Performance Benchmarking"
      subtitleText="Measure and compare performance across different configurations"
      col1Title="Benchmark Results"
      col2Title="Benchmark Code"
      col3Title="Analysis"
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
            <h6>Expected Performance with v4.6.0 Flat Rendering</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Dataset Size</th>
                    <th>First Paint</th>
                    <th>Full Render</th>
                    <th>Search Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>100 items</td>
                    <td class="text-success">&lt; 5ms</td>
                    <td>&lt; 10ms</td>
                    <td>&lt; 1ms</td>
                  </tr>
                  <tr>
                    <td>500 items</td>
                    <td class="text-success">&lt; 5ms</td>
                    <td>&lt; 30ms</td>
                    <td>&lt; 5ms</td>
                  </tr>
                  <tr>
                    <td>1000 items</td>
                    <td class="text-success">&lt; 5ms</td>
                    <td>&lt; 50ms</td>
                    <td>&lt; 10ms</td>
                  </tr>
                  <tr class="table-success">
                    <td>5000 items</td>
                    <td class="text-success">&lt; 5ms</td>
                    <td>&lt; 150ms</td>
                    <td>&lt; 50ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <small class="text-muted">
              🆕 v4.6.0: First paint is instant (~20 nodes), then progressive fill-in.
              Use <code>$state.raw()</code> for these results!
            </small>
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
