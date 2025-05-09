/* global cy */

describe('Privacy Policy page', () => {
  it('should load and display the Privacy Policy', () => {
    cy.visit('http://localhost/privacy-policy')

    cy.location('pathname').should('eq', '/privacy-policy')

    cy.contains('h1, h2, h3', 'Privacy Policy').should('be.visible')

    cy.contains(
      'Policy changes',
      { matchCase: false }
    ).should('exist')
  })
})
