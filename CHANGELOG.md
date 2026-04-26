# 更新日志

本文档记录本项目的主要版本变更。

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
