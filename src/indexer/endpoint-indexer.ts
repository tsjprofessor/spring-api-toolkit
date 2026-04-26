// src/indexer/endpoint-indexer.ts
import * as vscode from 'vscode';
import { Endpoint, EndpointIndex } from './endpoint-model';
import { parseSpringMappings } from '../parser/spring/mapping-parser';
import { logger } from '../infra/logger';

const INDEX_VERSION = '1.0.0';

export class EndpointIndexer {
  private index: EndpointIndex | undefined;
  private indexingPromise: Promise<EndpointIndex> | undefined;

  constructor() {}

  /**
   * 获取或构建索引
   */
  async getIndex(): Promise<EndpointIndex> {
    if (this.index) {
      // 检查版本号，版本不匹配时重新构建
      if (this.index.version !== INDEX_VERSION) {
        this.index = undefined;
      } else {
        return this.index;
      }
    }

    if (this.indexingPromise) {
      return this.indexingPromise;
    }

    this.indexingPromise = this.buildIndex();
    try {
      this.index = await this.indexingPromise;
      return this.index;
    } finally {
      this.indexingPromise = undefined;
    }
  }

  /**
   * 使缓存失效，触发重新索引
   */
  invalidate(): void {
    this.index = undefined;
    // 清除正在进行的索引构建，下次调用 getIndex() 会重新构建
    this.indexingPromise = undefined;
  }

  /**
   * 构建索引
   */
  private async buildIndex(): Promise<EndpointIndex> {
    const startTime = Date.now();
    logger.info('scan', 'Starting endpoint index build');

    const endpoints: Endpoint[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders ?? [];

    for (const folder of workspaceFolders) {
      const moduleEndpoints = await this.scanModule(folder.uri.fsPath, folder.name);
      endpoints.push(...moduleEndpoints);
    }

    const duration = Date.now() - startTime;
    logger.info('scan', 'Index build completed', {
      endpointCount: endpoints.length,
      durationMs: duration
    });

    return {
      endpoints,
      indexedAt: Date.now(),
      version: INDEX_VERSION
    };
  }

  /**
   * 扫描单个模块
   */
  private async scanModule(modulePath: string, moduleName: string): Promise<Endpoint[]> {
    const javaSrcPath = vscode.Uri.file(`${modulePath}/src/main/java`);

    try {
      // 检查 src/main/java 是否存在
      await vscode.workspace.fs.stat(javaSrcPath);
    } catch {
      // 不存在则扫描整个模块
      return this.scanDirectory(vscode.Uri.file(modulePath), moduleName);
    }

    return this.scanDirectory(javaSrcPath, moduleName);
  }

  /**
   * 递归扫描目录
   */
  private async scanDirectory(dirUri: vscode.Uri, moduleName: string): Promise<Endpoint[]> {
    const endpoints: Endpoint[] = [];
    const ignoreGlobs = vscode.workspace.getConfiguration('restToolkit').get<string[]>('ignoreGlobs', [
      '**/target/**',
      '**/build/**',
      '**/.git/**',
      '**/node_modules/**'
    ]);

    const files = await vscode.workspace.findFiles(
      new vscode.RelativePattern(dirUri, '**/*.{java,kt}'),
      `{${ignoreGlobs.join(',')}}`
    );

    for (const file of files) {
      try {
        const document = await vscode.workspace.openTextDocument(file);
        const fileEndpoints = parseSpringMappings(document, moduleName);
        endpoints.push(...fileEndpoints);
      } catch (error) {
        logger.warn('scan', `Failed to parse file: ${file.fsPath}`, {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return endpoints;
  }
}

/**
 * 创建单例索引器实例
 */
let indexerInstance: EndpointIndexer | undefined;

export function getEndpointIndexer(): EndpointIndexer {
  if (!indexerInstance) {
    indexerInstance = new EndpointIndexer();
  }
  return indexerInstance;
}

export function resetEndpointIndexer(): void {
  indexerInstance = undefined;
}