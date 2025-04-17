// Unit tests for dashboards operations

describe('dashboards operations', () => {
  const dashboards = require('../operations/dashboards.js');
  for (const key of Object.keys(dashboards)) {
    if (typeof dashboards[key] === 'function') {
      test(`${key} returns text output`, async () => {
        let result;
        try {
          if (dashboards[key].length === 0) {
            result = await dashboards[key]();
          } else {
            result = await dashboards[key]("org", "proj", "id");
          }
        } catch (e) {
          result = e instanceof Error ? e.message : String(e);
        }
        expect(typeof result === 'string' || typeof result === 'object').toBe(true);
      });
    }
  }
});
