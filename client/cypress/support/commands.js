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

Cypress.Commands.add('getByDataCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
Cypress.Commands.add('loginApi', () => {
  let user;
  let token;

  cy.request('POST', 'http://127.0.0.1:8000/api/login', {
    email: Cypress.env('email'),
    password: Cypress.env('password'),
  })
    .its('body')
    .then((res) => {
      console.log('THE RES: ', res);
      user = res.user;
      token = res.token;
    });
  cy.visit('/', {
    onBeforeLoad(win) {
      // and before the page finishes loading
      // set the user object in local storage
      win.localStorage.setItem('user', JSON.stringify(user));
      win.localStorage.setItem('token', token);
    },
  });
});
