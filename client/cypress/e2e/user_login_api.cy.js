/// <reference types="cypress" />

describe('User Login Api', () => {
  before(() => {
    cy.task('db:reset');
    cy.task('db:seed:user');
    cy.loginApi();
  });

  it('shows loaded user', () => {
    cy.contains('silas').should('be.visible');
  });
});
