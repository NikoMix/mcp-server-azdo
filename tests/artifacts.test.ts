import * as artifacts from '../operations/artifacts.js';

// Unit tests for artifacts operations

describe('artifacts operations', () => {
  describe('feeds', () => {
    it('lists artifact feeds', async () => {
      jest.spyOn(artifacts, 'listArtifactFeeds').mockResolvedValueOnce({ value: [{ id: 'feed1', name: 'Feed 1', fullyQualifiedName: 'org/feed1', url: 'url' }] });
      const result = await artifacts.listArtifactFeeds('org');
      expect((result as any).value[0]).toHaveProperty('id', 'feed1');
    });
    it('gets an artifact feed', async () => {
      jest.spyOn(artifacts, 'getArtifactFeed').mockResolvedValueOnce({ id: 'feed1', name: 'Feed 1', fullyQualifiedName: 'org/feed1', url: 'url' });
      const result = await artifacts.getArtifactFeed('org', 'feed1');
      expect(result).toHaveProperty('id', 'feed1');
    });
    it('creates an artifact feed', async () => {
      jest.spyOn(artifacts, 'createArtifactFeed').mockResolvedValueOnce({ id: 'feed2', name: 'Feed 2', fullyQualifiedName: 'org/feed2', url: 'url' });
      const result = await artifacts.createArtifactFeed('org', { organization: 'org', name: 'Feed 2' });
      expect(result).toHaveProperty('name', 'Feed 2');
    });
    it('updates an artifact feed', async () => {
      jest.spyOn(artifacts, 'updateArtifactFeed').mockResolvedValueOnce({ id: 'feed1', name: 'Feed 1 updated', fullyQualifiedName: 'org/feed1', url: 'url' });
      const result = await artifacts.updateArtifactFeed('org', 'feed1', { organization: 'org', feedId: 'feed1', name: 'Feed 1 updated' });
      expect(result).toHaveProperty('name', 'Feed 1 updated');
    });
    it('deletes an artifact feed', async () => {
      jest.spyOn(artifacts, 'deleteArtifactFeed').mockResolvedValueOnce({ success: true });
      const result = await artifacts.deleteArtifactFeed('org', 'feed1');
      expect(result).toHaveProperty('success', true);
    });
  });
  describe('packages', () => {
    it('lists artifact packages', async () => {
      jest.spyOn(artifacts, 'listArtifactPackages').mockResolvedValueOnce({ value: [{ id: 'pkg1', name: 'pkg', protocolType: 'npm', url: 'url' }] });
      const result = await artifacts.listArtifactPackages('org', 'feed1');
      expect((result as any).value[0]).toHaveProperty('id', 'pkg1');
    });
    it('gets an artifact package', async () => {
      jest.spyOn(artifacts, 'getArtifactPackage').mockResolvedValueOnce({ id: 'pkg1', name: 'pkg', protocolType: 'npm', url: 'url' });
      const result = await artifacts.getArtifactPackage('org', 'feed1', 'pkg1');
      expect(result).toHaveProperty('id', 'pkg1');
    });
    it('deletes an artifact package', async () => {
      jest.spyOn(artifacts, 'deleteArtifactPackage').mockResolvedValueOnce({ success: true });
      const result = await artifacts.deleteArtifactPackage('org', 'feed1', 'pkg1');
      expect(result).toHaveProperty('success', true);
    });
  });
  describe('views', () => {
    it('lists artifact views', async () => {
      jest.spyOn(artifacts, 'listArtifactViews').mockResolvedValueOnce({ value: [{ id: 'view1', name: 'View 1', url: 'url' }] });
      const result = await artifacts.listArtifactViews('org', 'feed1');
      expect((result as any).value[0]).toHaveProperty('id', 'view1');
    });
    it('gets an artifact view', async () => {
      jest.spyOn(artifacts, 'getArtifactView').mockResolvedValueOnce({ id: 'view1', name: 'View 1', url: 'url' });
      const result = await artifacts.getArtifactView('org', 'feed1', 'view1');
      expect(result).toHaveProperty('id', 'view1');
    });
    it('creates an artifact view', async () => {
      jest.spyOn(artifacts, 'createArtifactView').mockResolvedValueOnce({ id: 'view2', name: 'View 2', url: 'url' });
      const result = await artifacts.createArtifactView('org', 'feed1', { organization: 'org', feedId: 'feed1', name: 'View 2' });
      expect(result).toHaveProperty('name', 'View 2');
    });
    it('updates an artifact view', async () => {
      jest.spyOn(artifacts, 'updateArtifactView').mockResolvedValueOnce({ id: 'view1', name: 'View 1 updated', url: 'url' });
      const result = await artifacts.updateArtifactView('org', 'feed1', 'view1', { organization: 'org', feedId: 'feed1', viewId: 'view1', name: 'View 1 updated' });
      expect(result).toHaveProperty('name', 'View 1 updated');
    });
    it('deletes an artifact view', async () => {
      jest.spyOn(artifacts, 'deleteArtifactView').mockResolvedValueOnce({ success: true });
      const result = await artifacts.deleteArtifactView('org', 'feed1', 'view1');
      expect(result).toHaveProperty('success', true);
    });
  });
});
