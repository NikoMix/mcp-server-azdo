import * as branches from '../operations/branches.js';

// Mock azDoRequest from utils
jest.mock('../common/utils.js', () => ({
  azDoRequest: jest.fn(async (...args) => {
    // Simulate different responses based on URL
    const url = args[0];
    if (url.includes('/_apis/git/repositories/') && url.includes('?api-version=7.1-preview.1')) {
      if (url.includes('/refs?filter=heads/')) {
        // getBranchObjectId
        return { value: [{ name: 'refs/heads/branch', objectId: 'mocksha' }] };
      }
      if (url.match(/\/repositories\/[^/]+\?api-version/)) {
        // getDefaultBranchObjectId
        return { defaultBranch: 'refs/heads/main' };
      }
      if (url.includes('/refs?api-version=7.1-preview.1')) {
        // createAzdoBranch or updateAzdoBranch
        return { value: [{ name: 'refs/heads/feature', objectId: 'mocksha' }] };
      }
    }
    return { value: [{ name: 'refs/heads/branch', objectId: 'mocksha' }] };
  })
}));

describe('azdo branches operations', () => {
  describe('getDefaultBranchObjectId', () => {
    it('returns objectId for default branch', async () => {
      const sha = await branches.getDefaultBranchObjectId('org', 'proj', 'repo');
      expect(sha).toBe('mocksha');
    });
  });

  describe('getBranchObjectId', () => {
    it('returns objectId for given branch', async () => {
      const sha = await branches.getBranchObjectId('org', 'proj', 'repo', 'branch');
      expect(sha).toBe('mocksha');
    });
  });

  describe('createAzdoBranch', () => {
    it('creates a branch and returns reference', async () => {
      const ref = await branches.createAzdoBranch('org', 'proj', 'repo', 'feature', 'abc');
      expect(ref).toHaveProperty('objectId', 'mocksha');
    });
  });

  describe('createAzdoBranchFromRef', () => {
    it('creates a branch from another branch', async () => {
      const ref = await branches.createAzdoBranchFromRef('org', 'proj', 'repo', 'newBranch', 'fromBranch');
      expect(ref).toHaveProperty('objectId', 'mocksha');
    });
    it('creates a branch from default branch if fromBranch not provided', async () => {
      const ref = await branches.createAzdoBranchFromRef('org', 'proj', 'repo', 'newBranch');
      expect(ref).toHaveProperty('objectId', 'mocksha');
    });
  });

  describe('updateAzdoBranch', () => {
    it('updates a branch and returns reference', async () => {
      const ref = await branches.updateAzdoBranch('org', 'proj', 'repo', 'branch', 'sha');
      expect(ref).toHaveProperty('objectId', 'mocksha');
    });
  });
});
