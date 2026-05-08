# 更新日志

本文档记录本项目的主要版本变更。

## [0.0.5] - 2026-05-08

### 新增
- 新增 `restToolkit.sourceRoots` 配置，用于自定义 Spring MVC 注解扫描的 Java 源码目录。
- 当默认 `src/main/java` 不存在时，自动兜底扫描老 Spring MVC / Eclipse Web 项目常见的 `src` 目录。

### 优化
- 安装新版 VSIX 后建议执行 `Developer: Reload Window`，确保扩展代码与接口索引刷新到最新版本。

## [0.0.4] - 2026-04-26

### 优化
- 移除 `keyboard.dispatch: keyCode` 自动修复方案（该设置会导致 `Cmd+Alt+N` 等其他快捷键失效）。
- IME 提示简化为仅建议使用备用快捷键 `Cmd+Alt+N`。

## [0.0.3] - 2026-04-26

### 新增
- macOS 中文环境下首次激活时，自动提示中文输入法可能导致 `Cmd+\` 失效。
- 新增英文版 README（`README.en.md`）和 CHANGELOG（`CHANGELOG.en.md`）。

### 优化
- 统一品牌标识，将所有文档和配置中的 `Qoder` 引用替换为 `VSCode`。

## [0.0.2] - 2026-04-26

### 优化
- 更新插件图标为 `128x128` 版本，提升在扩展市场中的展示清晰度。

## [0.0.1] - 2026-04-26

### 新增
- 发布 **Spring API Toolkit** 初始版本。
- 支持通过 URL 跳转到 Spring MVC 接口方法。
- 支持实时搜索候选结果（边输入边匹配）。
- 支持多命中候选选择与稳定排序。
- 支持 context-path 与 URL 标准化匹配。
- 支持快捷键：
  - macOS：`Cmd+\`、`Cmd+Alt+N`
  - Windows/Linux：`Ctrl+\`、`Ctrl+Alt+N`

### 修复
- 修复类级 `@RequestMapping` 被误识别为方法级映射的问题。
- 修复关键词匹配能力，支持 `robot` 命中 `/group-robot/add`。
