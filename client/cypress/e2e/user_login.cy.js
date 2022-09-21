/// <reference types="cypress" />

describe('Testing User Login (Command)', () => {
  beforeEach(() => {
    cy.loginUserCommand();
  });

  it('should let user login', () => {
    cy.contains(`Welcome back!`).should('be.visible');
  });
});
