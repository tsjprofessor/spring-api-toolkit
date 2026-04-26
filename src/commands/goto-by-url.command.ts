// src/commands/goto-by-url.command.ts
import * as vscode from 'vscode';
import { getEndpointIndexer } from '../indexer/endpoint-indexer';
import { matchByUrl } from '../matcher/url-matcher';
import { navigateToEndpoint } from '../navigation/method-navigator';
import { showEndpointQuickPick, showLiveEndpointSearchQuickPick } from '../ui/endpoint-quick-pick';
import { logger } from '../infra/logger';

/**
 * 执行 GoToByUrl 命令
 */
export async function executeGoToByUrlCommand(directInput?: string): Promise<void> {
  const startTime = Date.now();

  try {
    // 1. 获取索引
    const indexer = getEndpointIndexer();
    const index = await indexer.getIndex();
    const contextPath = vscode.workspace.getConfiguration('restToolkit').get<string>('contextPath', '');

    // 2. 无 directInput 时，使用实时搜索面板（边输入边搜索）
    if (!directInput) {
      const selected = await showLiveEndpointSearchQuickPick(index.endpoints, contextPath);
      if (!selected) {
        return;
      }
      await navigateToEndpoint(selected);
      return;
    }

    // 3. directInput 场景：按输入值执行一次匹配并跳转
    const input = directInput;
    logger.info('command', 'GoToByUrl triggered', { inputUrl: input });

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
