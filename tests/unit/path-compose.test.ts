// tests/unit/path-compose.test.ts
import { composeFullPath, normalizePath } from '../../src/indexer/endpoint-model';

describe('composeFullPath', () => {
  it('should compose class and method paths', () => {
    expect(composeFullPath('/user', '/add')).toBe('/user/add');
  });

  it('should handle paths without leading slash', () => {
    expect(composeFullPath('user', 'add')).toBe('/user/add');
  });

  it('should handle empty class path', () => {
    expect(composeFullPath('', '/add')).toBe('/add');
  });

  it('should normalize duplicate slashes', () => {
    expect(composeFullPath('/user/', '/add')).toBe('/user/add');
  });

  it('should handle empty method path', () => {
    expect(composeFullPath('/user', '')).toBe('/user');
  });

  it('should handle both empty paths', () => {
    expect(composeFullPath('', '')).toBe('/');
  });

  it('should handle null/undefined gracefully', () => {
    expect(composeFullPath(null as any, undefined as any)).toBe('/');
  });
});

describe('normalizePath', () => {
  it('should convert to lowercase', () => {
    expect(normalizePath('/User/Add')).toBe('/user/add');
  });

  it('should remove trailing slash', () => {
    expect(normalizePath('/user/add/')).toBe('/user/add');
  });

  it('should normalize duplicate slashes', () => {
    expect(normalizePath('/user//add')).toBe('/user/add');
  });

  it('should ensure leading slash', () => {
    expect(normalizePath('user/add')).toBe('/user/add');
  });

  it('should handle empty string', () => {
    expect(normalizePath('')).toBe('/');
  });

  it('should handle null/undefined', () => {
    expect(normalizePath(null as any)).toBe('/');
    expect(normalizePath(undefined as any)).toBe('/');
  });

  it('should handle root path', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('should handle multiple trailing slashes', () => {
    expect(normalizePath('/user/add///')).toBe('/user/add');
  });

  it('should handle path with leading and trailing spaces', () => {
    expect(normalizePath('  /user/add  ')).toBe('/user/add');
  });
});