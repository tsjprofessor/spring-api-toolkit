# Changelog

This document records the major version changes of this project.

## [0.0.4] - 2026-04-26

### Improved
- Removed `keyboard.dispatch: keyCode` auto-fix (it caused `Cmd+Alt+N` and other shortcuts to break).
- Simplified IME notification to only suggest using the alternate shortcut `Cmd+Alt+N`.

## [0.0.3] - 2026-04-26

### Added
- Auto-prompt on first activation for macOS Chinese locale users when `Cmd+\` may not work with Chinese IME.
- Added English README (`README.en.md`) and CHANGELOG (`CHANGELOG.en.md`).

### Improved
- Unified branding: replaced all `Qoder` references with `VSCode` across documentation and configuration.

## [0.0.2] - 2026-04-26

### Improved
- Updated extension icon to `128x128` for better display clarity in the marketplace.

## [0.0.1] - 2026-04-26

### Added
- Initial release of **Spring API Toolkit**.
- Navigate to Spring MVC endpoint methods by URL.
- Real-time search with live candidate matching.
- Multi-match candidate selection with stable sorting.
- Context-path and URL normalization support.
- Keyboard shortcuts:
  - macOS: `Cmd+\`, `Cmd+Alt+N`
  - Windows/Linux: `Ctrl+\`, `Ctrl+Alt+N`

### Fixed
- Fixed class-level `@RequestMapping` being incorrectly identified as method-level mapping.
- Fixed keyword matching to support partial matches (e.g., `robot` matches `/group-robot/add`).
