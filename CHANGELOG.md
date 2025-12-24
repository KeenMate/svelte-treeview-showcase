# Changelog

All notable changes to the svelte-treeview-showcase project.

## [Unreleased]

### Fixed
- **SF01 Search Layout** - Moved search input to controls column so it stays visible during result navigation
- **ShowcaseSection Props** - Fixed property names across all 16 pages using ShowcaseSection component
  - Renamed `demoColumnTitle` → `col1Title`
  - Renamed `controlsColumnTitle` → `col2Title`
  - Renamed `descriptionColumnTitle` → `col3Title`

### Added
- **Batch Operations Page** - New page at `/examples/batch-operations` documenting the `applyChanges()` API
  - API reference with TreeChange and ApplyChangesResult types
  - Interactive demo with batch create, update, delete, and mixed operations
  - Code examples for each operation type including "Replace Branch" pattern

- **D&D Scenarios Page** - New page at `/examples/drag-drop-scenarios` explaining real-world workflows
  - Scenario A: Full Redraw + State Preservation (server-owned data)
  - Scenario B: Same-Tree Reorganization with auto-handled moves (recommended)
  - Scenario C: Single-Tree CRUD operations (real-time editing)
  - Scenario D: Empty tree + build one by one (new project setup)
  - Scenario E: Batch create then save (wizard/draft mode)
  - Scenario F: Partial Branch Update / Lazy Load (uses `applyChanges()` for single re-render)
  - Interactive demos with mock database and activity logs
  - Full code examples for each scenario

- **Version Badge** - Displays `@keenmate/svelte-treeview` version in the header navbar
  - Compile-time constant via Vite's `define` option (not runtime)
  - Automatically syncs with package version at build time
  - Styled badge with responsive design

- **DD05 Drop Zone Styles** - Interactive demo for configuring drop zone appearance
  - Drop zone mode toggle (glow vs floating)
  - Floating layout options (around, above, below, wave, wave2)
  - Zone start position and max width controls
  - Ctrl+drag copy toggle
  - Session storage persistence for settings

### Fixed
- **DD01 Basic Drag & Drop** - Fixed cross-tree and same-tree drag operations
  - Added `orderMember="sortOrder"` for proper sibling ordering
  - Added `sortOrder` values to target data for above/below positioning
  - Library now auto-handles same-tree moves with proper sortOrder calculation

- **DD02 Tree Reorganization** - Fixed single-tree reordering
  - Added `orderMember="sortOrder"` prop
  - Added `sortOrder` values to reorder data
  - Fixed validation to allow file/folder above/below positioning

### Changed
- Updated `dragValidationCallback` to properly handle above/below positions
  - Files can now be positioned above/below other files (just not as children)
  - Added file and folder types to above/below validation rules
