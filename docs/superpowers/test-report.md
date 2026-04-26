# 测试报告

## 测试环境
- 日期：2026-04-26
- VSCode 版本：[填写]
- 插件版本：0.1.0

## 构建产物验证

| 文件 | 状态 |
|------|------|
| out/extension.js | 存在 |
| out/commands/goto-by-url.command.js | 存在 |
| out/indexer/endpoint-indexer.js | 存在 |
| out/matcher/url-matcher.js | 存在 |
| out/navigation/method-navigator.js | 存在 |
| out/ui/endpoint-quick-pick.js | 存在 |

## 功能测试

### F1: URL 到方法跳转
| 输入 | 期望 | 结果 |
|------|------|------|
| /user/add | UserController#add | 通过/失败 |
| POST /user/add | UserController#add | 通过/失败 |
| /User/Add | UserController#add | 通过/失败 |

### F2: 多命中处理
| 场景 | 结果 |
|------|------|
| 多个相同路径 | Quick Pick 显示 |

### F3: 未命中处理
| 输入 | 结果 |
|------|------|
| /nonexistent | 显示"未匹配到接口方法" |

## 命中率统计
- 总样本数：[填写]
- 命中成功数：[填写]
- 命中率：[填写]%

## 问题记录
| 编号 | 问题描述 | 严重程度 | 状态 |
|------|----------|----------|------|
| 1 | [填写] | 高/中/低 | 待修复/已修复 |

---

# 手动测试步骤

以下测试步骤需要用户手动执行：

## Step 1: 在 VSCode Extension Development Host 中测试

1. 按 F5 启动调试
2. 打开一个包含 Spring Controller 的 Java 项目
3. 按 Cmd+\ 触发命令
4. 输入 `/user/add`
5. 验证是否跳转到正确的方法

## Step 2: 测试多命中场景

1. 创建包含多个相同路径的测试用例
2. 验证 Quick Pick 是否正确显示
3. 选择后验证跳转

## Step 3: 测试未命中场景

1. 输入不存在的路径
2. 验证显示"未匹配到接口方法"提示

## 测试签名

- 测试人员：[填写]
- 测试日期：[填写]
- 审核人员：[填写]
