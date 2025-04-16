import * as commits from '../operations/commits.js';

// Mock azDoRequest from utils
jest.mock('../common/utils.js', () => ({
  azDoRequest: jest.fn(async (...args) => {
    // Simulate a response for the Azure DevOps commits API
    if (typeof args[0] === 'string' && args[0].includes('/_apis/git/repositories/') && args[0].includes('/commits')) {
      return {
        count: 2,
        value: [
          { commitId: 'abc123', comment: 'Initial commit', author: { displayName: 'Alice', id: '1', uniqueName: 'alice@example.com', imageUrl: '', url: '' }, committer: { displayName: 'Alice', id: '1', uniqueName: 'alice@example.com', imageUrl: '', url: '' }, url: 'https://dev.azure.com/org/proj/_apis/git/repositories/repo/commits/abc123' },
          { commitId: 'def456', comment: 'Second commit', author: { displayName: 'Bob', id: '2', uniqueName: 'bob@example.com', imageUrl: '', url: '' }, committer: { displayName: 'Bob', id: '2', uniqueName: 'bob@example.com', imageUrl: '', url: '' }, url: 'https://dev.azure.com/org/proj/_apis/git/repositories/repo/commits/def456' }
        ]
      };
    }
    return {};
  })
}));

// Unit tests for commits operations

describe('commits operations', () => {
  // TODO: Add tests for each function in commits.ts
  test('should have tests for all exported functions', () => {
    expect(true).toBe(true);
  });
});

describe('azdo commits operations', () => {
  describe('listAzdoCommits', () => {
    it('returns a list of commits for a repository', async () => {
      const result = await commits.listAzdoCommits('org', 'proj', 'repo');
      expect(typeof result).toBe('object');
      if (result && typeof result === 'object' && 'value' in result && Array.isArray(result.value)) {
        expect(result).toHaveProperty('count', 2);
        expect(Array.isArray(result.value)).toBe(true);
        expect(result.value[0]).toHaveProperty('commitId', 'abc123');
      } else {
        throw new Error('Unexpected result structure');
      }
    });
    it('passes branch, top, and skip as query params', async () => {
      await commits.listAzdoCommits('org', 'proj', 'repo', 'main', 5, 2);
      const call = require('../common/utils.js').azDoRequest.mock.calls.pop();
      expect(call[0]).toContain('searchCriteria.itemVersion.version=main');
      expect(call[0]).toContain('$top=5');
      expect(call[0]).toContain('$skip=2');
    });
  });
});
