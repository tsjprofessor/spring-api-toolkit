# Spring URL Jump

一个用于 VSCode/Qoder 的 Spring MVC URL 跳转插件，可通过 URL 直接定位到接口方法定义。

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

2. 在 VSCode/Qoder 中执行：
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
- `Spring URL Jump: Go To Endpoint By URL`

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

- `Cmd+\` / `Ctrl+\` 在部分键位方案下可能与编辑器分屏快捷键冲突。  
  处理方式：改用 `Cmd+Alt+N` / `Ctrl+Alt+N`，或自行重绑快捷键。
- 代码变更后如果候选结果未更新，可执行：
  - `Spring URL Jump: Refresh Index`

## 更新记录

详见 [CHANGELOG.md](./CHANGELOG.md)。

## 项目文档

- [需求文档（PRD）](./docs/prd.md)
- [架构文档](./docs/architecture/01-业务流程总览.md)
- [规则文档](./docs/rules/01-代码组织结构.md)
- [领域知识](./docs/domain-knowledge/01-业务概念索引.md)
