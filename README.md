# Spring API Toolkit

一个用于 VSCode 的 Spring MVC URL 跳转插件，可通过 URL 直接定位到接口方法定义。

## 项目现状（已完成）

**Spring API Toolkit** 当前已完成 `0.0.1` 的核心能力交付，定位是一个面向 Spring MVC 的 URL 反查与代码跳转工具。

### 我们已经完成了什么

1. **URL 直达方法定义**
- 支持输入 `/path` 或 `METHOD /path`
- 可直接跳转到对应 Controller 方法

2. **实时搜索交互**
- 打开命令后可边输入边搜索
- 无需先回车再展示候选结果

3. **多命中选择机制**
- 当同一路径存在多个候选时，支持列表选择后跳转
- 使用稳定排序规则保证结果可预期

4. **路径标准化匹配**
- 支持 `context-path` 前缀处理
- 支持尾斜杠、重复斜杠归一化
- 支持大小写不敏感匹配
- 支持关键词模糊匹配（如 `robot` 命中 `/group-robot/add`）

5. **索引与刷新能力**
- 扫描 Spring MVC 注解生成接口索引
- 支持手动刷新索引
- 文件保存后自动触发索引失效重建

6. **可发布工程化基础**
- 插件元信息、图标、README、CHANGELOG 已补齐
- 命令、快捷键、日志输出通道已统一为 `Spring API Toolkit`

## 功能特性

- 通过 URL 跳转到 Spring MVC 接口方法
- 输入过程中实时搜索候选结果
- 支持输入格式：
  - `/group-robot/add`
  - `POST /group-robot/add`
- 多结果候选选择（稳定排序）
- 支持 URL 标准化：
  - context-path 前缀处理
  - 尾斜杠处理
  - 重复斜杠处理
  - 大小写不敏感匹配

## 安装方式

### 方式一：本地 VSIX 安装

1. 打包插件：

```bash
npx @vscode/vsce package
```

2. 在 VSCode 中执行：
- `Extensions: Install from VSIX...`

3. 选择生成的 `.vsix` 文件安装。

### 方式二：开发模式运行

1. 安装依赖：

```bash
npm install
```

2. 构建：

```bash
npm run build
```

3. 按 `F5` 启动 Extension Development Host。

## 使用方法

1. 执行命令：
- `Spring API Toolkit: Go To Endpoint By URL`

2. 在弹出的输入框中输入 URL，实时查看候选结果。

3. 回车跳转到目标方法定义。

## 快捷键

- macOS：
  - `Cmd+\`
  - `Cmd+Alt+N`
- Windows/Linux：
  - `Ctrl+\`
  - `Ctrl+Alt+N`

说明：在 `package.json` 里，mac 的 `Option` 键写作 `Alt`。

## 已知问题

- **macOS 中文输入法下 `Cmd+\` 可能失效**  
  原因：中文输入法会在系统层面拦截 `\` 键（转为顿号 `、`），导致快捷键无法触发。  
  解决方式（任选其一）：
  1. 使用备用快捷键 `Cmd+Alt+N`。
  2. 在 VS Code 设置中添加 `"keyboard.dispatch": "keyCode"`，重启后生效。  
     插件首次激活时会自动检测并提示此设置。
- `Cmd+\` / `Ctrl+\` 在部分键位方案下可能与编辑器分屏快捷键冲突。  
  处理方式：改用 `Cmd+Alt+N` / `Ctrl+Alt+N`，或自行重绑快捷键。
- 代码变更后如果候选结果未更新，可执行：
  - `Spring API Toolkit: Refresh Index`

## 更新记录

详见 [CHANGELOG.md](./CHANGELOG.md)。

## 项目文档

- [需求文档（PRD）](./docs/prd.md)
- [架构文档](./docs/architecture/01-业务流程总览.md)
- [规则文档](./docs/rules/01-代码组织结构.md)
- [领域知识](./docs/domain-knowledge/01-业务概念索引.md)
