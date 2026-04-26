// tests/__mocks__/vscode.ts
// Mock vscode module for unit tests

const mockOutputChannel = {
  appendLine: jest.fn(),
  dispose: jest.fn()
};

const mockWindow = {
  createOutputChannel: jest.fn(() => mockOutputChannel),
  showQuickPick: jest.fn(),
  showInputBox: jest.fn(),
  showErrorMessage: jest.fn(),
  showInformationMessage: jest.fn()
};

const mockWorkspace = {
  workspaceFolders: [],
  getConfiguration: jest.fn(() => ({
    get: jest.fn()
  }))
};

const mockCommands = {
  registerCommand: jest.fn()
};

const mockLanguages = {
  createDiagnosticCollection: jest.fn()
};

class MockRange {
  start: any;
  end: any;
  constructor(start: any, end: any) {
    this.start = start;
    this.end = end;
  }
}

class MockPosition {
  line: number;
  character: number;
  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;
  }
}

const mockUri = {
  file: jest.fn((path: string) => ({ fsPath: path })),
  parse: jest.fn()
};

class MockLocation {
  uri: any;
  range: any;
  constructor(uri: any, range: any) {
    this.uri = uri;
    this.range = range;
  }
}

const DiagnosticSeverity = {
  Error: 0,
  Warning: 1,
  Information: 2,
  Hint: 3
};

const ViewColumn = {
  One: 1,
  Two: 2,
  Three: 3
};

// Export both named and default exports to match vscode module structure
export const window = mockWindow;
export const workspace = mockWorkspace;
export const commands = mockCommands;
export const languages = mockLanguages;
export const Range = MockRange;
export const Position = MockPosition;
export const Uri = mockUri;
export const Location = MockLocation;
export { DiagnosticSeverity, ViewColumn };

export default {
  window: mockWindow,
  workspace: mockWorkspace,
  commands: mockCommands,
  languages: mockLanguages,
  Range: MockRange,
  Position: MockPosition,
  Uri: mockUri,
  Location: MockLocation,
  DiagnosticSeverity,
  ViewColumn
};