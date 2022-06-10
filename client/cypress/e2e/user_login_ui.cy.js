/// <reference types="cypress" />

describe('User Login UI', () => {
  beforeEach(() => {
    cy.task('db:reset');
    // cy.request('POST', 'http://127.0.0.1:8000/api/test/mock-user');
    // ^this works too
    cy.task('db:seed:user');
    cy.visit('/login');
  });

  it('should let user login', () => {
    cy.getByDataCy('email').type('silas.corrin@gmail.com');
    cy.getByDataCy('password').type('hello123');

    cy.get("button[type='submit']").click();

    // is the below even necessary?
    // cy.intercept('POST', 'http://127.0.0.1:8000/api/login', (req) => {
    //   req.reply((res) => {
    //     res.send({
    //       id: 1,
    //       user: {
    //         email: 'silas.corrin@gmail.com',
    //         first_name: 'silas',
    //         last_name: 'corrin',
    //       },
    //       token:
    //         'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNpbGFzIENvcnJpbiAyIiwidXNlcl9pZCI6MjAsImlhdCI6MTY1NDcyMTQxMywiZXhwIjoxNjU0NzI1MDEzfQ.8W8sEgFpPwELFUe_N-iIPGnneZDB7_xWIMiukz_HYKk',
    //     });
    //   });
    // });

    cy.contains('silas').should('be.visible');
  });
});
