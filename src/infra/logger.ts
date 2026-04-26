import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Qoder REST Toolkit');
  }
  return outputChannel;
}

function formatMessage(stage: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${stage}] ${message}`;
}

function safeStringify(data: Record<string, unknown>): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '[无法序列化数据]';
  }
}

export function initLogger(context: vscode.ExtensionContext): void {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Qoder REST Toolkit');
  }
  context.subscriptions.push(outputChannel);
}

export const logger = {
  info(stage: string, message: string, data?: Record<string, unknown>): void {
    const channel = getChannel();
    const formatted = formatMessage(stage, message);
    channel.appendLine(data ? `${formatted} ${safeStringify(data)}` : formatted);
  },

  warn(stage: string, message: string, data?: Record<string, unknown>): void {
    const channel = getChannel();
    const formatted = formatMessage(stage, `[WARN] ${message}`);
    channel.appendLine(data ? `${formatted} ${safeStringify(data)}` : formatted);
  },

  error(stage: string, message: string, error?: Error): void {
    const channel = getChannel();
    const formatted = formatMessage(stage, `[ERROR] ${message}`);
    channel.appendLine(formatted);
    if (error?.stack) {
      channel.appendLine(error.stack);
    }
  }
};

export function disposeLogger(): void {
  outputChannel?.dispose();
  outputChannel = undefined;
}
