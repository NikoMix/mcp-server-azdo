import * as files from '../operations/files.js';

// Mock azDoRequest from utils
jest.mock('../common/utils.js', () => ({
  azDoRequest: jest.fn(async (...args) => {
    const url = args[0];
    if (url.includes('/items?')) {
      // getAzdoFileContents
      return {
        path: '/README.md',
        content: 'Hello Azure DevOps',
        url: url,
      };
    }
    if (url.includes('/pushes?')) {
      // createOrUpdateAzdoFile or pushAzdoFiles
      return {
        pushId: 1,
        commits: [{ commitId: 'abc123', comment: args[1]?.body?.commits?.[0]?.comment }],
        refUpdates: [{ name: args[1]?.body?.refUpdates?.[0]?.name }],
      };
    }
    return {};
  })
}));

// Unit tests for files operations

describe('files operations', () => {
  // TODO: Add tests for each function in files.ts
  test('should have tests for all exported functions', () => {
    expect(true).toBe(true);
  });
});

describe('azdo files operations', () => {
  it('gets file contents', async () => {
    const result = await files.getAzdoFileContents('org', 'proj', 'repo', '/README.md', 'main');
    expect(result).toHaveProperty('path', '/README.md');
    expect(result).toHaveProperty('content', 'Hello Azure DevOps');
  });

  it('creates or updates a file', async () => {
    const result = await files.createOrUpdateAzdoFile('org', 'proj', 'repo', '/foo.txt', 'bar', 'my commit', 'main');
    const r = result as any;
    expect(r).toHaveProperty('pushId', 1);
    expect(r.commits[0]).toHaveProperty('comment', 'my commit');
    expect(r.refUpdates[0]).toHaveProperty('name', 'refs/heads/main');
  });

  it('pushes multiple files', async () => {
    const filesArr = [
      { path: '/a.txt', content: 'A' },
      { path: '/b.txt', content: 'B' },
    ];
    const result = await files.pushAzdoFiles('org', 'proj', 'repo', 'main', filesArr, 'multi commit');
    const r = result as any;
    expect(r).toHaveProperty('pushId', 1);
    expect(r.commits[0]).toHaveProperty('comment', 'multi commit');
    expect(r.refUpdates[0]).toHaveProperty('name', 'refs/heads/main');
  });
});
