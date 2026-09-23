const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'aq61or',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
