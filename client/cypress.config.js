const { defineConfig } = require('cypress');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

module.exports = defineConfig({
  env: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    // excludeSpecPattern: ['**/2-advanced-examples/*', '**/1-getting-started/*'],
    excludeSpecPattern: '**/2-advanced-examples/*',
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // const testDataApiEndpoint = `${config.env.apiUrl}/testData`;
      on('task', {
        async 'db:seed:user'() {
          // seed database with test data
          // const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
          const { data } = await axios.post('http://127.0.0.1:8000/api/test/mock-user');
          return data;
          // ^must return data for this work
          // cy does not work here
          // cy.request('POST', 'http://127.0.0.1:8000/api/test/mock-user');
        },
      });
      on('task', {
        async 'db:reset'() {
          // const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
          const { data } = await axios.delete('http://127.0.0.1:8000/api/test/clear-db');
          return data;
        },
      });
    },
  },
});
