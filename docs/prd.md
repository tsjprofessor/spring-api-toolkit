# Spring API Toolkit 插件 PRD（极简 MVP）

- 文档版本：v0.1.0
- 文档日期：2026-04-26
- 文档状态：已确认（极简 MVP）
- 关联文档：`docs/requirements.md`

## 1. 产品目标

在 VSCode 中提供一个最小但可用的能力：
1. 用户输入 URL 路径（如 `/user/add`）后，能直接跳转到对应 Controller 方法（如 `UserController.add`）。

本期只做 URL 搜索跳转主能力，其他能力全部延期。

## 2. 核心用户场景

1. 用户已知接口路径但不知道实现位置。
2. 用户在命令中输入 `/user/add`。
3. 插件直接定位并打开 `UserController.add` 方法定义。

## 3. MVP 范围

### 3.1 本期必做（In Scope）

#### F1. URL 到方法跳转
1. 提供命令：`Spring API Toolkit: Go To Endpoint By URL`。
2. 输入支持：
- `/user/add`
- `POST /user/add`（可选 METHOD 前缀）
3. 支持 Spring 常见路径拼接：类级路径 + 方法级路径（如 `/user` + `/add`）。
4. 命中逻辑：
- 唯一命中：直接跳转到方法定义。
- 多个命中：显示候选列表，用户选择后跳转到对应方法。
- 未命中：提示“未匹配到接口方法”。

#### F2. 最小框架与语言支持
1. Spring MVC / Spring Boot 常见注解：
- `@RequestMapping`
- `@GetMapping`
- `@PostMapping`
- `@PutMapping`
- `@DeleteMapping`
- `@PatchMapping`
2. 语言支持：
- Java：本期必做
- Kotlin：与 Java 同等验收口径

#### F3. URL 标准化处理
1. 支持 `context-path` 前缀参与匹配。
2. 需要处理尾斜杠（`/user/add/` -> `/user/add`）。
3. 需要处理重复斜杠（`/user//add` -> `/user/add`）。
4. 需要处理大小写差异（按不区分大小写匹配）。

#### F4. 扫描范围
1. 仅扫描 `src/main/java`（多模块项目按模块分别扫描该目录）。
2. 不扫描测试代码目录。

#### F5. 交互与展示
1. 交互样式按你提供的参考图执行：
- 顶部输入框实时搜索。
- 无命中时显示 `No matches found`。
- 多命中列表展示 `path (Controller#method)` 形式。
2. 快捷键：
- 主快捷键：`Ctrl+\\` / `Cmd+\\`
- 备用快捷键：`Ctrl+Alt+N` / `Cmd+Alt+N`

### 3.2 本期不做（Out of Scope）

1. REST Services Tree。
2. 内置 HTTP 请求工具。
3. 复制 URL / Query / cURL。
4. JSON 工具（格式化、类转 JSON、JSON 转类）。
5. JAX-RS 支持（延期到后续版本）。
6. 请求历史、环境切换（dev/test/prod）。

## 4. 验收标准（MVP）

1. 示例场景必须通过：
- 类路径 `/user`，方法路径 `/add`，输入 `/user/add`，可定位到 `add` 方法。
- 类路径 `/user`，方法路径 `/update`，输入 `/user/update`，可定位到 `update` 方法。
2. 常见 Spring 注解写法下命中率 >= 95%。
3. 多命中时可选择目标；未命中时有明确提示。
4. 跳转后光标定位到方法定义行。
5. 命中率样例来源：`/Users/professor/workspace/company/git` 下所有存在接口定义的项目。

## 5. 非功能要求

1. 首次扫描性能目标：中小项目可接受（目标 < 3s）。
2. 文件变更后支持增量刷新索引。
3. 不阻塞编辑器主线程。

## 6. 版本计划

1. 当前版本：`0.1.0`（极简 MVP）
2. 下一阶段（候选）：
- JAX-RS 支持
- Services Tree
- HTTP 请求工具

## 7. 风险与应对

1. 风险：路径写法复杂导致命中下降。
- 应对：先覆盖高频注解与路径拼接规则，持续补充解析规则。
2. 风险：大型仓库索引慢。
- 应对：增量索引 + 缓存 + 去抖刷新。
