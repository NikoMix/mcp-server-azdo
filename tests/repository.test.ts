import * as repository from '../operations/repository.js';

// Mock azDoRequest from utils
jest.mock('../common/utils.js', () => ({
  azDoRequest: jest.fn(async (...args) => {
    // Simulate Azure DevOps repository API responses
    const url = args[0];
    if (url.includes('/_apis/git/repositories') && args[1]?.method === 'POST') {
      // createAzdoRepository
      return {
        id: 'mock-repo-id',
        name: args[1].body.name,
        url: `https://dev.azure.com/mockorg/mockproj/_apis/git/repositories/mock-repo-id`,
        project: {
          id: 'mock-proj-id',
          name: args[1].body.project.name,
          url: `https://dev.azure.com/mockorg/_apis/projects/mock-proj-id`,
        },
      };
    }
    if (url.includes('/_apis/git/repositories')) {
      // searchAzdoRepositories
      return {
        value: [
          { id: '1', name: 'repo1', url: 'https://dev.azure.com/org/proj/_apis/git/repositories/1', project: { id: 'proj1', name: 'proj', url: 'https://dev.azure.com/org/_apis/projects/proj1' } },
          { id: '2', name: 'repo2', url: 'https://dev.azure.com/org/proj/_apis/git/repositories/2', project: { id: 'proj1', name: 'proj', url: 'https://dev.azure.com/org/_apis/projects/proj1' } },
        ]
      };
    }
    return {};
  })
}));

// Unit tests for repository operations

describe('repository operations', () => {
  // TODO: Add tests for each function in repository.ts
  test('should have tests for all exported functions', () => {
    expect(true).toBe(true);
  });
});

describe('azdo repository operations', () => {
  describe('createAzdoRepository', () => {
    it('creates a repository and returns its details', async () => {
      const result = await repository.createAzdoRepository({
        organization: 'mockorg',
        project: 'mockproj',
        name: 'myrepo',
        description: 'desc',
        defaultBranch: 'main',
      });
      expect(result).toHaveProperty('id', 'mock-repo-id');
      expect(result).toHaveProperty('name', 'myrepo');
      expect(result.project).toHaveProperty('name', 'mockproj');
    });
  });

  describe('searchAzdoRepositories', () => {
    it('returns all repositories if no query is given', async () => {
      const result = await repository.searchAzdoRepositories('org', 'proj');
      expect(result.total_count).toBe(2);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items[0]).toHaveProperty('name', 'repo1');
    });
    it('filters repositories by name if query is provided', async () => {
      const result = await repository.searchAzdoRepositories('org', 'proj', 'repo2');
      expect(result.total_count).toBe(1);
      expect(result.items[0]).toHaveProperty('name', 'repo2');
    });
  });
});