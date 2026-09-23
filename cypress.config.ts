import { defineConfig } from 'cypress'
let globalStore: Record<string, any> = {};
export default defineConfig({
  projectId: 'aq61or',
  
  e2e: {
    baseUrl:"https://development.oneselect.global/",
    defaultCommandTimeout:5000,
    setupNodeEvents(on, config) {
     on('task', {
        setGlobal({ key, value }) {
          globalStore[key] = value;
          return null;
        },
        getGlobal(key) {
          return globalStore[key] || null;
        }
      });
    },
  },
});
