// tests/unit/url-matcher.test.ts
import { matchByUrl, parseUserInput } from '../../src/matcher/url-matcher';
import { Endpoint } from '../../src/indexer/endpoint-model';

// 创建 mock Endpoint 对象
const mockEndpoint = (overrides: Partial<Endpoint>): Endpoint => ({
  module: 'test',
  filePath: '/test/TestController.java',
  className: 'TestController',
  methodName: 'testMethod',
  httpMethod: 'GET',
  classPath: '',
  methodPath: '/test',
  fullPath: '/test',
  range: { start: { line: 0, character: 0 }, end: { line: 10, character: 0 } } as any,
  ...overrides
});

describe('parseUserInput', () => {
  it('should parse path only', () => {
    const result = parseUserInput('/user/add');
    expect(result.path).toBe('/user/add');
    expect(result.method).toBeUndefined();
  });

  it('should parse METHOD + path', () => {
    const result = parseUserInput('POST /user/add');
    expect(result.path).toBe('/user/add');
    expect(result.method).toBe('POST');
  });

  it('should handle case-insensitive method', () => {
    const result = parseUserInput('get /user/add');
    expect(result.method).toBe('GET');
  });
});

describe('matchByUrl', () => {
  it('should return unique match for exact path', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add', methodName: 'add' })
    ];

    const result = matchByUrl(endpoints, '/user/add');
    expect(result.type).toBe('unique');
    expect(result.endpoints[0].methodName).toBe('add');
  });

  it('should normalize path case', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/User/Add', methodName: 'add' })
    ];

    const result = matchByUrl(endpoints, '/user/add');
    expect(result.type).toBe('unique');
  });

  it('should handle trailing slash', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add', methodName: 'add' })
    ];

    const result = matchByUrl(endpoints, '/user/add/');
    expect(result.type).toBe('unique');
  });

  it('should return none for no match', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add' })
    ];

    const result = matchByUrl(endpoints, '/nonexistent');
    expect(result.type).toBe('none');
  });

  it('should filter by HTTP method when specified', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add', httpMethod: 'GET', methodName: 'getAdd' }),
      mockEndpoint({ fullPath: '/user/add', httpMethod: 'POST', methodName: 'postAdd' })
    ];

    const result = matchByUrl(endpoints, 'POST /user/add');
    expect(result.type).toBe('unique');
    expect(result.endpoints[0].methodName).toBe('postAdd');
  });

  it('should return multiple match when multiple endpoints match', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add', className: 'UserController', methodName: 'add1' }),
      mockEndpoint({ fullPath: '/user/add', className: 'AdminController', methodName: 'add2' })
    ];

    const result = matchByUrl(endpoints, '/user/add');
    expect(result.type).toBe('multiple');
    expect(result.endpoints.length).toBe(2);
  });

  it('should handle duplicate slashes in path', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/user/add', methodName: 'add' })
    ];

    const result = matchByUrl(endpoints, '//user///add');
    expect(result.type).toBe('unique');
  });

  it('should return unique match for prefix match when only one candidate', () => {
    const endpoints: Endpoint[] = [
      mockEndpoint({ fullPath: '/api/user/add', methodName: 'add' })
    ];

    // input path is a prefix of endpoint path, should match
    const result = matchByUrl(endpoints, '/api/user');
    expect(result.type).toBe('unique');
  });
});