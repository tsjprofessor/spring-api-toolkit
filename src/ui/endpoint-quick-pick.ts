// src/ui/endpoint-quick-pick.ts
import * as vscode from 'vscode';
import { Endpoint } from '../indexer/endpoint-model';
import { logger } from '../infra/logger';

interface EndpointQuickPickItem extends vscode.QuickPickItem {
  readonly endpoint: Endpoint;
}

/**
 * 显示多命中选择对话框
 */
export async function showEndpointQuickPick(
  endpoints: Endpoint[]
): Promise<Endpoint | undefined> {
  if (endpoints.length === 0) {
    return undefined;
  }

  const items: EndpointQuickPickItem[] = endpoints.map(endpoint => ({
    label: endpoint.fullPath,
    description: `${endpoint.httpMethod} - ${endpoint.className}#${endpoint.methodName}`,
    detail: endpoint.filePath,
    endpoint
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select an endpoint to navigate',
    matchOnDescription: true,
    matchOnDetail: true
  });

  if (selected) {
    logger.info('ui', 'User selected endpoint', {
      endpoint: `${selected.endpoint.className}#${selected.endpoint.methodName}`
    });
  }

  return selected?.endpoint;
}
