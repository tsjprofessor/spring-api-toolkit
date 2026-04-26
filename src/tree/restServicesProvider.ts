import * as vscode from 'vscode';

interface EndpointItem {
  label: string;
  method: string;
  path: string;
  fullPath: string;
  uri: vscode.Uri;
  range: vscode.Range;
}

type Node = ServiceNode | EndpointNode;

class ServiceNode extends vscode.TreeItem {
  constructor(public readonly labelText: string, public readonly children: EndpointNode[]) {
    super(labelText, vscode.TreeItemCollapsibleState.Expanded);
    this.contextValue = 'serviceNode';
  }
}

class EndpointNode extends vscode.TreeItem {
  constructor(public readonly endpoint: EndpointItem) {
    super(`${endpoint.method} ${endpoint.path}`, vscode.TreeItemCollapsibleState.None);
    this.description = endpoint.label;
    this.contextValue = 'endpointNode';
    this.command = {
      command: 'restToolkit.gotoByUrl',
      title: 'Go To Endpoint',
      arguments: [`${endpoint.method} ${endpoint.path}`]
    };
  }
}

export class RestServicesProvider implements vscode.TreeDataProvider<Node> {
  private readonly emitter = new vscode.EventEmitter<Node | undefined | null | void>();
  private services: ServiceNode[] = [];
  private endpoints: EndpointItem[] = [];

  readonly onDidChangeTreeData = this.emitter.event;

  refresh(): void {
    this.emitter.fire();
  }

  bootstrapMockData(): void {
    const uri = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!uri) {
      return;
    }

    const fileUri = vscode.Uri.joinPath(uri, 'README.md');

    const endpointA: EndpointItem = {
      label: 'UserController.list',
      method: 'GET',
      path: '/api/users',
      fullPath: '/api/users',
      uri: fileUri,
      range: new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 1))
    };

    const endpointB: EndpointItem = {
      label: 'UserController.create',
      method: 'POST',
      path: '/api/users',
      fullPath: '/api/users',
      uri: fileUri,
      range: new vscode.Range(new vscode.Position(20, 0), new vscode.Position(20, 1))
    };

    this.endpoints = [endpointA, endpointB];
    this.services = [new ServiceNode('UserController', this.endpoints.map((item) => new EndpointNode(item)))];
    this.refresh();
  }

  findByUrl(input: string): EndpointItem | undefined {
    const normalized = input.trim().toLowerCase();
    return this.endpoints.find((endpoint) => {
      const key = `${endpoint.method} ${endpoint.path}`.toLowerCase();
      return key === normalized || endpoint.path.toLowerCase() === normalized;
    });
  }

  resolveEndpoint(item?: unknown): EndpointItem | undefined {
    if (item instanceof EndpointNode) {
      return item.endpoint;
    }
    return undefined;
  }

  getTreeItem(element: Node): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Node): Thenable<Node[]> {
    if (!element) {
      return Promise.resolve(this.services);
    }
    if (element instanceof ServiceNode) {
      return Promise.resolve(element.children);
    }
    return Promise.resolve([]);
  }
}
