// src/matcher/match-result.ts
import { Endpoint } from '../indexer/endpoint-model';

export type MatchResultType = 'unique' | 'multiple' | 'none';

export interface MatchResult {
  readonly type: MatchResultType;
  readonly endpoints: Endpoint[];
}

export function uniqueMatch(endpoint: Endpoint): MatchResult {
  return { type: 'unique', endpoints: [endpoint] };
}

export function multipleMatch(endpoints: Endpoint[]): MatchResult {
  return { type: 'multiple', endpoints };
}

export function noMatch(): MatchResult {
  return { type: 'none', endpoints: [] };
}
