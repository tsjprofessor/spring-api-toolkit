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

export const logger = {
  info(stage: string, message: string, data?: Record<string, unknown>): void {
    const channel = getChannel();
    const formatted = formatMessage(stage, message);
    channel.appendLine(data ? `${formatted} ${JSON.stringify(data)}` : formatted);
  },

  warn(stage: string, message: string, data?: Record<string, unknown>): void {
    const channel = getChannel();
    const formatted = formatMessage(stage, `[WARN] ${message}`);
    channel.appendLine(data ? `${formatted} ${JSON.stringify(data)}` : formatted);
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