// src/matcher/url-matcher.ts
import { Endpoint, normalizePath, HttpMethod } from '../indexer/endpoint-model';
import { MatchResult, uniqueMatch, multipleMatch, noMatch } from './match-result';
import { logger } from '../infra/logger';

/**
 * 解析用户输入的 URL，提取路径和可选的 HTTP 方法
 */
export function parseUserInput(input: string): { path: string; method: HttpMethod | undefined } {
  const trimmed = input.trim();

  // 尝试解析 "GET /path" 或 "POST /path" 格式
  const methodPathMatch = trimmed.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(.+)$/i);
  if (methodPathMatch) {
    return {
      method: methodPathMatch[1].toUpperCase() as HttpMethod,
      path: methodPathMatch[2].trim()
    };
  }

  return { path: trimmed, method: undefined };
}

/**
 * 匹配排序规则：
 * 1. 规范化后精确匹配优先
 * 2. 前缀匹配优先于包含匹配
 * 3. 路径长度更短优先
 * 4. Controller#method 字典序稳定排序
 */
function compareEndpoints(a: Endpoint, b: Endpoint, normalizedInput: string): number {
  const normalizedA = normalizePath(a.fullPath);
  const normalizedB = normalizePath(b.fullPath);

  // 1. 规范化后精确匹配优先
  const exactA = normalizedA === normalizedInput ? 1 : 0;
  const exactB = normalizedB === normalizedInput ? 1 : 0;
  if (exactA !== exactB) return exactB - exactA;

  // 2. 前缀匹配优先于包含匹配
  const prefixA = normalizedInput.startsWith(normalizedA) ? 1 : 0;
  const prefixB = normalizedInput.startsWith(normalizedB) ? 1 : 0;
  const containsA = normalizedA.includes(normalizedInput) ? 1 : 0;
  const containsB = normalizedB.includes(normalizedInput) ? 1 : 0;

  const scoreA = prefixA * 2 + containsA;
  const scoreB = prefixB * 2 + containsB;
  if (scoreA !== scoreB) return scoreB - scoreA;

  // 3. 路径长度更短优先
  if (a.fullPath.length !== b.fullPath.length) {
    return a.fullPath.length - b.fullPath.length;
  }

  // 4. Controller#method 字典序稳定排序
  const keyA = `${a.className}#${a.methodName}`;
  const keyB = `${b.className}#${b.methodName}`;
  return keyA.localeCompare(keyB);
}

/**
 * 执行 URL 匹配
 */
export function matchByUrl(
  endpoints: Endpoint[],
  input: string,
  contextPath?: string
): MatchResult {
  const startTime = Date.now();
  const { path, method } = parseUserInput(input);

  // 应用 context-path 前缀移除
  let normalizedPath = path;
  if (contextPath && normalizedPath.startsWith(contextPath)) {
    normalizedPath = normalizedPath.slice(contextPath.length);
  }

  normalizedPath = normalizePath(normalizedPath);

  // 筛选匹配的 endpoint
  let candidates = endpoints.filter(endpoint => {
    // 如果用户指定了方法，必须匹配
    if (method && endpoint.httpMethod !== method) {
      return false;
    }

    const normalizedEndpointPath = normalizePath(endpoint.fullPath);
    // 精确匹配或包含匹配
    return normalizedEndpointPath === normalizedPath ||
           normalizedPath.includes(normalizedEndpointPath) ||
           normalizedEndpointPath.includes(normalizedPath);
  });

  // 排序
  candidates.sort((a, b) => compareEndpoints(a, b, normalizedPath));

  // 尝试精确匹配
  const exactMatches = candidates.filter(c =>
    normalizePath(c.fullPath) === normalizedPath
  );

  if (exactMatches.length === 1) {
    logger.info('match', 'Unique match found', {
      inputUrl: input,
      endpoint: `${exactMatches[0].className}#${exactMatches[0].methodName}`,
      durationMs: Date.now() - startTime
    });
    return uniqueMatch(exactMatches[0]);
  }

  if (exactMatches.length > 1) {
    logger.info('match', 'Multiple exact matches found', {
      inputUrl: input,
      count: exactMatches.length
    });
    return multipleMatch(exactMatches);
  }

  if (candidates.length === 1) {
    logger.info('match', 'Unique candidate match', {
      inputUrl: input,
      endpoint: `${candidates[0].className}#${candidates[0].methodName}`
    });
    return uniqueMatch(candidates[0]);
  }

  if (candidates.length > 1) {
    logger.info('match', 'Multiple candidates found', {
      inputUrl: input,
      count: candidates.length
    });
    return multipleMatch(candidates);
  }

  logger.warn('match', 'No match found', {
    inputUrl: input,
    endpointCount: endpoints.length
  });
  return noMatch();
}
