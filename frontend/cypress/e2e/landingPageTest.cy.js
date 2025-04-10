// cypress/e2e/landingPageTest.cy.js

describe('Landing Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost')
  })

  it('should render the landing page with the correct title and login button', () => {
    cy.contains('Our Search').should('be.visible')

    cy.get('[data-testid="login-button"]').should('be.visible')
  })
})
