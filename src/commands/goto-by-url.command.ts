// src/commands/goto-by-url.command.ts
import * as vscode from 'vscode';
import { getEndpointIndexer } from '../indexer/endpoint-indexer';
import { matchByUrl } from '../matcher/url-matcher';
import { navigateToEndpoint } from '../navigation/method-navigator';
import { showEndpointQuickPick } from '../ui/endpoint-quick-pick';
import { logger } from '../infra/logger';

/**
 * 执行 GoToByUrl 命令
 */
export async function executeGoToByUrlCommand(directInput?: string): Promise<void> {
  const startTime = Date.now();

  try {
    // 1. 获取用户输入
    const input = directInput ?? await vscode.window.showInputBox({
      placeHolder: 'GET /api/users/1 or /api/users/1',
      prompt: 'Input URL (or METHOD + URL) to navigate to endpoint'
    });

    if (!input) {
      return;
    }

    logger.info('command', 'GoToByUrl triggered', { inputUrl: input });

    // 2. 获取索引
    const indexer = getEndpointIndexer();
    const index = await indexer.getIndex();

    // 3. 匹配
    const contextPath = vscode.workspace.getConfiguration('restToolkit').get<string>('contextPath', '');
    const matchResult = matchByUrl(index.endpoints, input, contextPath);

    // 4. 处理匹配结果
    switch (matchResult.type) {
      case 'unique': {
        await navigateToEndpoint(matchResult.endpoints[0]);
        vscode.window.showInformationMessage(`Jumped to ${matchResult.endpoints[0].className}#${matchResult.endpoints[0].methodName}`);
        break;
      }

      case 'multiple': {
        const selected = await showEndpointQuickPick(matchResult.endpoints);
        if (selected) {
          await navigateToEndpoint(selected);
        }
        break;
      }

      case 'none': {
        vscode.window.showWarningMessage('未匹配到接口方法');
        break;
      }
    }

    logger.info('command', 'GoToByUrl completed', {
      inputUrl: input,
      matchType: matchResult.type,
      durationMs: Date.now() - startTime
    });

  } catch (error) {
    logger.error('command', 'GoToByUrl failed', error instanceof Error ? error : new Error(String(error)));
    vscode.window.showErrorMessage(`跳转失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}
