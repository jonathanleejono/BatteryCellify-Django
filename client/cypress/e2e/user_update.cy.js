/// <reference types="cypress" />

describe('User Update', () => {
  // make this before each, not before
  beforeEach(() => {
    cy.task('db:reset');
    cy.task('db:seed:user');
    cy.loginApi();
  });

  it('shows loaded user', () => {
    cy.contains('silas').should('be.visible');
  });

  it('should let user update', () => {
    cy.visit('/profile');

    // BIG NOTE: CHECK THE UNDERSCORE -> it's data_cy and not data-cy
    cy.get("[data_cy='first-name-input']").clear().type('annie');

    cy.get("button[type='submit']").click();

    cy.getByDataCy('dashboard-sidebar-name').should('contain', 'annie');
  });
});
