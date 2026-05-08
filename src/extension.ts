// src/extension.ts
import * as vscode from 'vscode';
import { executeGoToByUrlCommand } from './commands/goto-by-url.command';
import { getEndpointIndexer, resetEndpointIndexer } from './indexer/endpoint-indexer';
import { initLogger, disposeLogger } from './infra/logger';

export function activate(context: vscode.ExtensionContext): void {
  // 初始化 Logger
  initLogger(context);

  // 注册核心命令
  const gotoByUrlCommand = vscode.commands.registerCommand(
    'restToolkit.gotoByUrl',
    executeGoToByUrlCommand
  );

  const refreshCommand = vscode.commands.registerCommand(
    'restToolkit.refreshServices',
    async () => {
      const indexer = getEndpointIndexer();
      indexer.invalidate();
      await indexer.getIndex();
      vscode.window.showInformationMessage('Spring API Toolkit index refreshed');
    }
  );

  // 文件变更时触发索引失效（500ms 防抖，避免连续保存时频繁重建）
  let debounceTimer: NodeJS.Timeout | undefined;
  const fileWatcher = vscode.workspace.onDidSaveTextDocument((doc) => {
    if (doc.uri.fsPath.endsWith('.java')) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        getEndpointIndexer().invalidate();
      }, 500);
    }
  });

  context.subscriptions.push(
    gotoByUrlCommand,
    refreshCommand,
    fileWatcher
  );

  // macOS + 中文环境：提示使用备用快捷键
  showImeKeybindingHint(context);

  // 预热索引（后台执行）
  getEndpointIndexer().getIndex().catch(err => {
    console.error('Failed to build initial index:', err);
  });
}

const IME_HINT_DISMISSED_KEY = 'restToolkit.imeHintDismissed';

function showImeKeybindingHint(context: vscode.ExtensionContext): void {
  if (process.platform !== 'darwin') {
    return;
  }
  if (!vscode.env.language.startsWith('zh')) {
    return;
  }
  if (context.globalState.get<boolean>(IME_HINT_DISMISSED_KEY)) {
    return;
  }

  const dismiss = '知道了';

  vscode.window
    .showInformationMessage(
      '中文输入法下 Cmd+\\ 可能失效，请使用备用快捷键 Cmd+Alt+N。',
      dismiss
    )
    .then(() => {
      context.globalState.update(IME_HINT_DISMISSED_KEY, true);
    });
}

export function deactivate(): void {
  resetEndpointIndexer();
  disposeLogger();
}
