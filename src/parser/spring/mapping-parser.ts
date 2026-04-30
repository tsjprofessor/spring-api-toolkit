// src/parser/spring/mapping-parser.ts
import * as vscode from 'vscode';
import { HttpMethod, Endpoint, composeFullPath, EndpointMethod } from '../../indexer/endpoint-model';

/**
 * 将代码中的注释替换为空格
 * 这样可以保持行号和字符位置不变，同时避免正则表达式匹配到注释中的内容
 */
function replaceCommentsWithSpaces(text: string): string {
  // 替换多行注释为等长的空格
  let result = text.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    return ' '.repeat(match.length);
  });
  // 替换单行注释为等长的空格
  result = result.replace(/\/\/.*$/gm, (match) => {
    return ' '.repeat(match.length);
  });
  return result;
}

const HTTP_METHOD_MAPPINGS: Record<string, HttpMethod> = {
  'GetMapping': 'GET',
  'PostMapping': 'POST',
  'PutMapping': 'PUT',
  'DeleteMapping': 'DELETE',
  'PatchMapping': 'PATCH',
  'HeadMapping': 'HEAD',
  'OptionsMapping': 'OPTIONS'
};

const ANNOTATION_PATTERN = /@(RequestMapping|GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping|HeadMapping|OptionsMapping)\s*\(([\s\S]*?)\)/g;

/**
 * 从注解参数中提取路径
 */
function extractPathFromAnnotation(annotationArgs: string): string {
  // 处理 value = "/path" 或 path = "/path" 格式
  const valueMatch = annotationArgs.match(/(?:value|path)\s*=\s*"([^"]+)"/);
  if (valueMatch) {
    return valueMatch[1];
  }

  // 处理直接路径格式 @GetMapping("/path")
  const directPathMatch = annotationArgs.match(/"([^"]+)"/);
  if (directPathMatch) {
    return directPathMatch[1];
  }

  // 处理数组格式 @GetMapping({"/path1", "/path2"})
  const arrayMatch = annotationArgs.match(/\{\s*"([^"]+)"/);
  if (arrayMatch) {
    return arrayMatch[1];
  }

  return '';
}

/**
 * 从注解参数中提取 HTTP 方法（仅用于 @RequestMapping）
 */
function extractMethodsFromRequestMapping(annotationArgs: string): HttpMethod[] {
  const methodsBlockMatch = annotationArgs.match(/method\s*=\s*(\{[\s\S]*?\}|[^,)\n]+)/);
  if (!methodsBlockMatch) {
    return [];
  }

  const block = methodsBlockMatch[1];
  const methodMatches = block.match(/(?:RequestMethod\.)?(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/gi) ?? [];
  const methods = methodMatches
    .map((m) => m.replace(/RequestMethod\./i, '').toUpperCase() as HttpMethod);

  return Array.from(new Set(methods));
}

/**
 * 找到方法的结束行
 */
function findMethodEndLine(lines: string[], startLine: number): number {
  let braceCount = 0;
  let inMethod = false;

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];

    for (const char of line) {
      if (char === '{') {
        braceCount++;
        inMethod = true;
      } else if (char === '}') {
        braceCount--;
        if (inMethod && braceCount === 0) {
          return i;
        }
      }
    }
  }

  return startLine;
}

/**
 * 解析文件中的 Spring Controller 信息
 */
export function parseSpringMappings(
  document: vscode.TextDocument,
  module: string
): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const text = document.getText();
  const textWithoutComments = replaceCommentsWithSpaces(text);
  const lines = text.split('\n');

  // 查找类信息与类级注解
  let classPath = '';
  let className = '';
  let classLine = 0;
  let classDeclarationIndex = -1;

  // 先查找类声明
  const classMatch = textWithoutComments.match(/(?:public\s+)?(?:final\s+)?class\s+(\w+)/);
  if (classMatch) {
    className = classMatch[1];
    classDeclarationIndex = textWithoutComments.indexOf(`class ${className}`);
    classLine = textWithoutComments.substring(0, classDeclarationIndex).split('\n').length - 1;
  }

  if (!className) {
    return endpoints;
  }

  // 再从类声明之前的注解中提取类级 @RequestMapping 路径
  const classPrefix = textWithoutComments.substring(0, classDeclarationIndex);
  ANNOTATION_PATTERN.lastIndex = 0;
  let classLevelMatch: RegExpExecArray | null;
  while ((classLevelMatch = ANNOTATION_PATTERN.exec(classPrefix)) !== null) {
    const annotationName = classLevelMatch[1];
    const annotationArgs = classLevelMatch[2];
    if (annotationName === 'RequestMapping') {
      classPath = extractPathFromAnnotation(annotationArgs);
    }
  }

  // 重置全局正则表达式的 lastIndex，避免状态问题
  ANNOTATION_PATTERN.lastIndex = 0;

  // 查找所有方法级注解（使用无注释文本避免匹配到注释中的内容）
  let match: RegExpExecArray | null;
  while ((match = ANNOTATION_PATTERN.exec(textWithoutComments)) !== null) {
    const annotationName = match[1];
    const annotationArgs = match[2];
    const annotationStart = match.index;

    // 跳过类声明之前的注解（例如类级 @RequestMapping）
    if (annotationStart < classDeclarationIndex) {
      continue;
    }

    // 查找注解所属的方法（使用无注释文本，但位置索引保持一致）
    const afterAnnotation = textWithoutComments.substring(annotationStart);
    const methodMatch = afterAnnotation.match(/(?:public|private|protected)?\s*(?:\w+(?:<[^>]+>)?)\s+(\w+)\s*\(/);

    if (methodMatch) {
      const methodName = methodMatch[1];
      const methodPath = extractPathFromAnnotation(annotationArgs);

      const fullPath = composeFullPath(classPath, methodPath);

      // 计算方法在文件中的位置（由于注释被替换为空格，位置索引保持一致）
      const methodStartInFile = text.indexOf(methodMatch[0], annotationStart);
      const methodStartLine = text.substring(0, methodStartInFile).split('\n').length - 1;
      const methodEndLine = findMethodEndLine(lines, methodStartLine);

      const range = new vscode.Range(
        new vscode.Position(methodStartLine, 0),
        new vscode.Position(methodEndLine, lines[methodEndLine]?.length ?? 0)
      );

      let endpointMethods: EndpointMethod[] = [];
      if (annotationName === 'RequestMapping') {
        const explicitMethods = extractMethodsFromRequestMapping(annotationArgs);
        endpointMethods = explicitMethods.length > 0 ? explicitMethods : ['ANY'];
      } else {
        endpointMethods = [HTTP_METHOD_MAPPINGS[annotationName] ?? 'GET'];
      }

      for (const endpointMethod of endpointMethods) {
        endpoints.push({
          module,
          filePath: document.uri.fsPath,
          className,
          methodName,
          httpMethod: endpointMethod,
          classPath,
          methodPath,
          fullPath,
          range
        });
      }
    }
  }

  return endpoints;
}
