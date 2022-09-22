/// <reference types="cypress" />

import { authUserUrl } from '../../src/constants/apiUrls';
import { apiUrl, userData } from '../support/commands';

describe('User Update', () => {
  // make this before each, not before
  beforeEach(() => {
    cy.loginUserCommand();

    cy.intercept('GET', `${apiUrl}${authUserUrl}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          email: userData.email,
          name: userData.name,
        },
      });
    }).as('mockGetUser');

    cy.intercept('PATCH', `${apiUrl}${authUserUrl}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          email: userData.email,
          name: 'annie',
        },
      });
    }).as('mockPatchUser');
  });

  it('should let user update profile', () => {
    cy.visit('/profile');

    cy.wait('@mockGetUser');

    // note: it's data_cy and not data-cy because
    // textfield inputProps can't use a hyphen in prop key
    cy.get("[data_cy='profile-name-input']").clear().type('annie');

    cy.get("button[type='submit']").click();

    cy.wait('@mockPatchUser');

    cy.contains(`Profile updated!`).should('be.visible');

    cy.getByDataCy('dashboard-sidebar-name').should('contain', 'annie');
  });
});
