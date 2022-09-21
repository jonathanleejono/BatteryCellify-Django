const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config();

module.exports = defineConfig({
  env: {
    baseApiUrl: process.env.REACT_APP_API_URL,
  },
  e2e: {
    baseUrl: 'http://localhost:3000', // the react server
    excludeSpecPattern: ['**/2-advanced-examples/*'],
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
});
