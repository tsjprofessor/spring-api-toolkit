// src/navigation/method-navigator.ts
import * as vscode from 'vscode';
import { Endpoint } from '../indexer/endpoint-model';
import { NavigateError } from '../infra/errors';
import { logger } from '../infra/logger';

/**
 * 导航到 endpoint 的方法定义
 */
export async function navigateToEndpoint(endpoint: Endpoint): Promise<void> {
  const startTime = Date.now();

  try {
    const document = await vscode.workspace.openTextDocument(endpoint.filePath);
    const editor = await vscode.window.showTextDocument(document, {
      preview: false,
      selection: new vscode.Selection(
        endpoint.range.start,
        endpoint.range.start
      )
    });

    // 将方法定义滚动到视图中心
    editor.revealRange(endpoint.range, vscode.TextEditorRevealType.InCenter);

    logger.info('navigate', 'Navigated to endpoint', {
      endpoint: `${endpoint.className}#${endpoint.methodName}`,
      filePath: endpoint.filePath,
      durationMs: Date.now() - startTime
    });
  } catch (error) {
    const navigateError = new NavigateError(
      `Failed to open file: ${endpoint.filePath}`,
      { filePath: endpoint.filePath, methodName: endpoint.methodName }
    );
    logger.error('navigate', navigateError.message, navigateError);
    throw navigateError;
  }
}