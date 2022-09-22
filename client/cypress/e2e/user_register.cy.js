/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import { registerUserUrl } from '../../src/constants/apiUrls';
import { apiUrl } from '../support/commands';

const userData = {
  email: faker.internet.email(),
  name: faker.name.lastName(),
  password: faker.internet.password(),
};

describe('Testing User Register', () => {
  beforeEach(() => {
    cy.intercept('POST', `${apiUrl}${registerUserUrl}`, (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          email: userData.email,
          name: userData.name,
        },
      });
    }).as('registerPost');

    cy.visit('/register');
  });

  it('should let user register', () => {
    cy.get('input[name="name"]').type(userData.name);
    cy.get('input[name="email"]').type(userData.email);
    cy.get('input[name="password"]').type(userData.password);

    cy.get("button[type='submit']").click();

    cy.wait('@registerPost');

    cy.contains(`Hello there ${userData.name}!`).should('be.visible');
  });
});
