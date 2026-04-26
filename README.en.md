# Spring API Toolkit

A VSCode extension for navigating to Spring MVC endpoint method definitions by URL.

## Current Status (Completed)

**Spring API Toolkit** has completed its `0.0.1` core deliverables, positioned as a URL-to-code navigation tool for Spring MVC projects.

### What We've Built

1. **URL-to-Method Navigation**
   - Supports input like `/path` or `METHOD /path`
   - Jumps directly to the corresponding Controller method

2. **Real-time Search**
   - Results update as you type
   - No need to press Enter before seeing candidates

3. **Multi-Match Selection**
   - When multiple candidates match the same path, a selection list is shown
   - Stable sorting ensures predictable result ordering

4. **URL Normalization**
   - Supports `context-path` prefix handling
   - Handles trailing slashes and duplicate slashes
   - Case-insensitive matching
   - Keyword fuzzy matching (e.g., `robot` matches `/group-robot/add`)

5. **Index & Refresh**
   - Scans Spring MVC annotations to build an endpoint index
   - Supports manual index refresh
   - Automatically invalidates and rebuilds index on file save

6. **Publishing-Ready**
   - Extension metadata, icon, README, and CHANGELOG are complete
   - Commands, keybindings, and log output channel are unified under `Spring API Toolkit`

## Features

- Navigate to Spring MVC endpoint methods by URL
- Real-time search as you type
- Supported input formats:
  - `/group-robot/add`
  - `POST /group-robot/add`
- Multi-result candidate selection (stable sorting)
- URL normalization:
  - Context-path prefix handling
  - Trailing slash handling
  - Duplicate slash handling
  - Case-insensitive matching

## Installation

### Option 1: Local VSIX Install

1. Package the extension:

```bash
npx @vscode/vsce package
```

2. In VSCode, run:
   - `Extensions: Install from VSIX...`

3. Select the generated `.vsix` file to install.

### Option 2: Development Mode

1. Install dependencies:

```bash
npm install
```

2. Build:

```bash
npm run build
```

3. Press `F5` to launch the Extension Development Host.

## Usage

1. Run the command:
   - `Spring API Toolkit: Go To Endpoint By URL`

2. Type a URL in the input box and see matching results in real time.

3. Press Enter to jump to the target method definition.

## Keyboard Shortcuts

- macOS:
  - `Cmd+\`
  - `Cmd+Alt+N`
- Windows/Linux:
  - `Ctrl+\`
  - `Ctrl+Alt+N`

> **Note for macOS users with Chinese Input Method (IME):**
> `Cmd+\` may not work when a Chinese IME is active, because the IME intercepts the `\` key at the OS level. Workarounds:
> 1. Use the alternate shortcut `Cmd+Alt+N`.
> 2. Set `"keyboard.dispatch": "keyCode"` in your VS Code settings (`Cmd+Shift+P` > `Preferences: Open User Settings (JSON)`), then restart VS Code.

## Known Issues

- **`Cmd+\` may not work on macOS with Chinese IME active**
  The Chinese input method intercepts the `\` key at the OS level (converting it to `、`), preventing the shortcut from reaching VS Code.
  Workarounds (pick one):
  1. Use the alternate shortcut `Cmd+Alt+N`.
  2. Add `"keyboard.dispatch": "keyCode"` to your VS Code settings and restart.
     The extension will automatically detect and suggest this setting on first activation.
- `Cmd+\` / `Ctrl+\` may conflict with the editor's split-view shortcut in some keymaps.
  Workaround: use `Cmd+Alt+N` / `Ctrl+Alt+N`, or rebind the shortcut.
- If candidates are not updated after code changes, run:
  - `Spring API Toolkit: Refresh Index`

## Changelog

See [CHANGELOG.en.md](./CHANGELOG.en.md).

## Documentation

- [PRD](./docs/prd.md)
- [Architecture](./docs/architecture/01-业务流程总览.md)
- [Rules](./docs/rules/01-代码组织结构.md)
- [Domain Knowledge](./docs/domain-knowledge/01-业务概念索引.md)
