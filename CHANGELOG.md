# Changelog

All notable changes to the svelte-treeview-showcase project.

## [Unreleased]

### Added
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
