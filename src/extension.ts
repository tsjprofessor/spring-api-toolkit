// src/extension.ts
import * as vscode from 'vscode';
import { executeGoToByUrlCommand } from './commands/goto-by-url.command';
import { getEndpointIndexer, resetEndpointIndexer } from './indexer/endpoint-indexer';
import { initLogger, disposeLogger } from './infra/logger';
import { RestServicesProvider } from './tree/restServicesProvider';

export function activate(context: vscode.ExtensionContext): void {
  // 初始化 Logger
  initLogger(context);

  // 保留原有的 Tree View（MVP 不实现，但保留占位）
  const provider = new RestServicesProvider();
  const treeView = vscode.window.createTreeView('restToolkit.services', {
    treeDataProvider: provider,
    showCollapseAll: true
  });

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
      provider.refresh();
      vscode.window.showInformationMessage('Spring API Toolkit index refreshed');
    }
  );

  // 文件变更时触发增量索引（简化实现：标记缓存失效）
  const fileWatcher = vscode.workspace.onDidSaveTextDocument((doc) => {
    if (doc.uri.fsPath.endsWith('.java') || doc.uri.fsPath.endsWith('.kt')) {
      getEndpointIndexer().invalidate();
    }
  });

  context.subscriptions.push(
    treeView,
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
