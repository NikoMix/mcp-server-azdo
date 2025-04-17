import * as search from '../operations/search.js';
import { AzdoCodeSearchSchema, AzdoWorkItemSearchSchema, AzdoUserSearchSchema } from '../operations/search.js';

// Unit tests for search operations

describe('search operations', () => {
  test('AzdoCodeSearchSchema validates minimal input', () => {
    const valid = AzdoCodeSearchSchema.safeParse({ organization: 'org', project: 'proj', searchText: 'foo' });
    expect(valid.success).toBe(true);
  });

  test('AzdoWorkItemSearchSchema validates minimal input', () => {
    const valid = AzdoWorkItemSearchSchema.safeParse({ organization: 'org', project: 'proj', searchText: 'bug' });
    expect(valid.success).toBe(true);
  });

  test('AzdoUserSearchSchema validates minimal input', () => {
    const valid = AzdoUserSearchSchema.safeParse({ organization: 'org', searchText: 'john' });
    expect(valid.success).toBe(true);
  });

  test('searchCode, searchWorkItems, and searchUsers are functions', () => {
    expect(typeof search.searchCode).toBe('function');
    expect(typeof search.searchWorkItems).toBe('function');
    expect(typeof search.searchUsers).toBe('function');
  });
});
