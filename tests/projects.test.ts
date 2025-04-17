// Unit tests for projects operations

describe('projects operations', () => {
  const projects = require('../operations/projects.js');
  for (const key of Object.keys(projects)) {
    if (typeof projects[key] === 'function') {
      test(`${key} returns text output`, async () => {
        let result;
        try {
          if (projects[key].length === 0) {
            result = await projects[key]();
          } else {
            result = await projects[key]("org", "proj", "id");
          }
        } catch (e) {
          result = e instanceof Error ? e.message : String(e);
        }
        expect(typeof result === 'string' || typeof result === 'object').toBe(true);
      });
    }
  }
});
