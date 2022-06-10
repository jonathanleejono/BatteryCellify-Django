/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('User Register', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.visit('/register');
  });

  it('should let user register', () => {
    const userData = {
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      password: faker.internet.password(),
    };

    cy.getByDataCy('first-name').type(userData.first_name);
    cy.getByDataCy('last_name').type(userData.last_name);
    cy.getByDataCy('email').type(userData.email);
    cy.getByDataCy('password').type(userData.password);

    cy.get("button[type='submit']").click();

    cy.intercept('POST', 'http://127.0.0.1:8000/api/register', (req) => {
      req.reply((res) => {
        res.send({
          id: 1,
          user: {
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
          },
          token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNpbGFzIENvcnJpbiAyIiwidXNlcl9pZCI6MjAsImlhdCI6MTY1NDcyMTQxMywiZXhwIjoxNjU0NzI1MDEzfQ.8W8sEgFpPwELFUe_N-iIPGnneZDB7_xWIMiukz_HYKk',
        });
      });
    });

    cy.contains(userData.first_name).should('be.visible');
  });
});
