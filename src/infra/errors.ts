export class ParseError extends Error {
  constructor(message: string, public readonly filePath: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ParseError';
  }
}

export class MatchError extends Error {
  constructor(message: string, public readonly inputUrl: string) {
    super(message);
    this.name = 'MatchError';
  }
}

export class NavigateError extends Error {
  constructor(message: string, public readonly endpoint: { filePath: string; methodName: string }) {
    super(message);
    this.name = 'NavigateError';
  }
}

export function isParseError(error: unknown): error is ParseError {
  return error instanceof Error && error.name === 'ParseError';
}

export function isMatchError(error: unknown): error is MatchError {
  return error instanceof Error && error.name === 'MatchError';
}

export function isNavigateError(error: unknown): error is NavigateError {
  return error instanceof Error && error.name === 'NavigateError';
}