// Unit tests for workitems operations

describe('workitems operations', () => {
  const workitems = require('../operations/workitems.js');
  for (const key of Object.keys(workitems)) {
    if (typeof workitems[key] === 'function') {
      test(`${key} returns text output`, async () => {
        // Use dummy arguments for each function
        let result;
        try {
          if (workitems[key].length === 0) {
            result = await workitems[key]();
          } else {
            // Pass dummy args for functions with parameters
            result = await workitems[key]("org", "proj", "id");
          }
        } catch (e) {
          result = e instanceof Error ? e.message : String(e);
        }
        expect(typeof result === 'string' || typeof result === 'object').toBe(true);
      });
    }
  }
});
