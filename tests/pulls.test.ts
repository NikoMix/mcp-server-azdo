import * as pulls from '../operations/pulls.js';

// Mock azDoRequest from utils
jest.mock('../common/utils.js', () => ({
  azDoRequest: jest.fn(async (...args) => {
    const url = args[0];
    if (url.includes('/pullrequests?api-version')) {
      if (args[1]?.method === 'POST') {
        // createAzdoPullRequest
        return {
          pullRequestId: 1,
          codeReviewId: 1,
          status: 'active',
          createdBy: { id: 'u', displayName: 'User', uniqueName: 'user', imageUrl: '', url: '' },
          creationDate: '2024-01-01T00:00:00Z',
          title: args[1].body.title,
          description: args[1].body.description,
          sourceRefName: args[1].body.sourceRefName,
          targetRefName: args[1].body.targetRefName,
          mergeStatus: 'notSet',
          mergeId: 'm',
          lastMergeSourceCommit: { commitId: 'sha', url: '' },
          lastMergeTargetCommit: { commitId: 'sha', url: '' },
          lastMergeCommit: { commitId: 'sha', url: '' },
          reviewers: [],
          url: 'url',
          supportsIterations: true,
        };
      }
      // listAzdoPullRequests
      return {
        value: [
          {
            pullRequestId: 1,
            codeReviewId: 1,
            status: 'active',
            createdBy: { id: 'u', displayName: 'User', uniqueName: 'user', imageUrl: '', url: '' },
            creationDate: '2024-01-01T00:00:00Z',
            title: 'PR',
            description: 'desc',
            sourceRefName: 'refs/heads/feature',
            targetRefName: 'refs/heads/main',
            mergeStatus: 'notSet',
            mergeId: 'm',
            lastMergeSourceCommit: { commitId: 'sha', url: '' },
            lastMergeTargetCommit: { commitId: 'sha', url: '' },
            lastMergeCommit: { commitId: 'sha', url: '' },
            reviewers: [],
            url: 'url',
            supportsIterations: true,
          }
        ]
      };
    }
    if (url.match(/pullrequests\/\d+\?api-version/)) {
      // getAzdoPullRequest or mergeAzdoPullRequest
      return {
        pullRequestId: 1,
        codeReviewId: 1,
        status: 'completed',
        createdBy: { id: 'u', displayName: 'User', uniqueName: 'user', imageUrl: '', url: '' },
        creationDate: '2024-01-01T00:00:00Z',
        title: 'PR',
        description: 'desc',
        sourceRefName: 'refs/heads/feature',
        targetRefName: 'refs/heads/main',
        mergeStatus: 'succeeded',
        mergeId: 'm',
        lastMergeSourceCommit: { commitId: 'sha', url: '' },
        lastMergeTargetCommit: { commitId: 'sha', url: '' },
        lastMergeCommit: { commitId: 'sha', url: '' },
        reviewers: [],
        url: 'url',
        supportsIterations: true,
      };
    }
    if (url.includes('/iterations/1/changes')) {
      // getAzdoPullRequestFiles
      return {
        changes: [
          { item: { path: '/file.txt', url: 'url' }, changeType: 'edit' }
        ]
      };
    }
    if (url.includes('/threads?api-version')) {
      // getAzdoPullRequestComments
      return {
        value: [
          {
            comments: [
              {
                id: 1,
                author: { id: 'u', displayName: 'User', uniqueName: 'user', imageUrl: '', url: '' },
                content: 'Comment',
                publishedDate: '2024-01-01T00:00:00Z',
                lastUpdatedDate: '2024-01-01T00:00:00Z',
                commentType: 'text',
                url: 'url',
              }
            ]
          }
        ]
      };
    }
    return {};
  })
}));

describe('azdo pulls operations', () => {
  it('creates a pull request', async () => {
    const result = await pulls.createAzdoPullRequest({
      organization: 'org',
      project: 'proj',
      repositoryId: 'repo',
      title: 'My PR',
      description: 'desc',
      sourceRefName: 'refs/heads/feature',
      targetRefName: 'refs/heads/main',
      reviewers: ['u'],
    });
    expect(result).toHaveProperty('pullRequestId', 1);
    expect(result).toHaveProperty('title', 'My PR');
  });

  it('gets a pull request', async () => {
    const result = await pulls.getAzdoPullRequest('org', 'proj', 'repo', 1);
    expect(result).toHaveProperty('pullRequestId', 1);
    expect(result).toHaveProperty('status', 'completed');
  });

  it('lists pull requests', async () => {
    const result = await pulls.listAzdoPullRequests('org', 'proj', 'repo', {});
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('pullRequestId', 1);
  });

  it('merges a pull request', async () => {
    const result = await pulls.mergeAzdoPullRequest('org', 'proj', 'repo', 1, { status: 'completed' });
    expect(result).toHaveProperty('pullRequestId', 1);
    expect(result).toHaveProperty('status', 'completed');
  });

  it('gets pull request files', async () => {
    const result = await pulls.getAzdoPullRequestFiles('org', 'proj', 'repo', 1);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('path', '/file.txt');
    expect(result[0]).toHaveProperty('changeType', 'edit');
  });

  it('gets pull request comments', async () => {
    const result = await pulls.getAzdoPullRequestComments('org', 'proj', 'repo', 1);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('content', 'Comment');
  });
});
