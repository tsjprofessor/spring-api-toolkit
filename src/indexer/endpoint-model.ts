// src/indexer/endpoint-model.ts
import * as vscode from 'vscode';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface Endpoint {
  /** 模块名（多模块项目时区分） */
  readonly module: string;
  /** 文件绝对路径 */
  readonly filePath: string;
  /** Controller 类名 */
  readonly className: string;
  /** 方法名 */
  readonly methodName: string;
  /** HTTP 方法 */
  readonly httpMethod: HttpMethod;
  /** 类级路径（如 /user） */
  readonly classPath: string;
  /** 方法级路径（如 /add） */
  readonly methodPath: string;
  /** 完整路径（类级 + 方法级拼接后） */
  readonly fullPath: string;
  /** 方法在文件中的位置范围 */
  readonly range: vscode.Range;
}

export interface EndpointIndex {
  /** 所有已索引的 endpoint 列表 */
  readonly endpoints: Endpoint[];
  /** 索引构建时间戳 */
  readonly indexedAt: number;
  /** 索引版本（用于缓存失效判断） */
  readonly version: string;
}

/**
 * 构建完整路径
 */
export function composeFullPath(classPath: string, methodPath: string): string {
  const normalizedClassPath = classPath.startsWith('/') ? classPath : '/' + classPath;
  const normalizedMethodPath = methodPath.startsWith('/') ? methodPath : '/' + methodPath;

  // 合并路径，处理重复斜杠
  let composed = (normalizedClassPath + normalizedMethodPath)
    .replace(/\/+/g, '/')
    .replace(/\/$/g, '');

  if (!composed.startsWith('/')) {
    composed = '/' + composed;
  }
  return composed || '/';
}

/**
 * 从完整路径中提取标准化后的路径（用于匹配）
 */
export function normalizePath(path: string): string {
  let normalized = path.trim();
  // 移除首尾空格
  normalized = normalized.replace(/\/+/g, '/');
  // 处理尾斜杠
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  // 确保以 / 开头
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  return normalized.toLowerCase();
}
