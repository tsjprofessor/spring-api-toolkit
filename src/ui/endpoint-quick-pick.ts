// src/ui/endpoint-quick-pick.ts
import * as vscode from 'vscode';
import { Endpoint } from '../indexer/endpoint-model';
import { logger } from '../infra/logger';
import { matchByUrl } from '../matcher/url-matcher';

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

/**
 * 显示“边输入边搜索”的 URL 输入与候选面板
 */
export async function showLiveEndpointSearchQuickPick(
  endpoints: Endpoint[],
  contextPath: string
): Promise<Endpoint | undefined> {
  return new Promise<Endpoint | undefined>((resolve) => {
    const quickPick = vscode.window.createQuickPick<EndpointQuickPickItem>();
    quickPick.title = 'Enter service URL path:';
    quickPick.placeholder = '/user/add or POST /user/add';
    quickPick.matchOnDescription = true;
    quickPick.matchOnDetail = true;
    quickPick.ignoreFocusOut = false;

    const toItems = (matches: Endpoint[]): EndpointQuickPickItem[] => {
      return matches.map((endpoint) => ({
        label: endpoint.fullPath,
        description: `${endpoint.className}#${endpoint.methodName}`,
        detail: `${endpoint.httpMethod}  ${endpoint.filePath}`,
        endpoint
      }));
    };

    const updateItems = (input: string): void => {
      const trimmed = input.trim();
      if (!trimmed) {
        quickPick.items = [];
        quickPick.placeholder = '/user/add or POST /user/add';
        return;
      }

      const result = matchByUrl(endpoints, trimmed, contextPath);
      const matchedEndpoints =
        result.type === 'none' ? [] : result.endpoints;

      quickPick.items = toItems(matchedEndpoints);
      if (matchedEndpoints.length === 0) {
        quickPick.placeholder = 'No matches found';
      } else {
        quickPick.placeholder = `${matchedEndpoints.length} matches`;
      }
    };

    const onChangeValue = quickPick.onDidChangeValue(updateItems);

    const onAccept = quickPick.onDidAccept(() => {
      const selected =
        quickPick.selectedItems[0] ?? quickPick.items[0];
      if (!selected) {
        return;
      }
      logger.info('ui', 'User selected endpoint from live search', {
        endpoint: `${selected.endpoint.className}#${selected.endpoint.methodName}`,
        inputUrl: quickPick.value
      });
      quickPick.hide();
      resolve(selected.endpoint);
    });

    const onHide = quickPick.onDidHide(() => {
      onChangeValue.dispose();
      onAccept.dispose();
      onHide.dispose();
      resolve(undefined);
    });

    quickPick.show();
  });
}
