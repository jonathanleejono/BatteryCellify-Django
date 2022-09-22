// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { loginUserUrl } from '../../src/constants/apiUrls';

// found in cypress config
export const apiUrl = Cypress.env('baseApiUrl');

export const userData = {
  email: 'bob@gmail.com',
  name: 'bob',
  password: 'bobspassword',
};

Cypress.Commands.add('getByDataCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add('loginUserCommand', () => {
  cy.intercept('POST', `${apiUrl}${loginUserUrl}`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        id: 1,
        email: userData.email,
        name: userData.name,
      },
    });
  }).as('loginPost');

  cy.visit('/login');

  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="password"]').type(userData.password);

  cy.get("button[type='submit']").click();

  cy.wait('@loginPost');
});
