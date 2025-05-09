/* global cy */

describe('FAQs page', () => {
  it('should load and display the Faculty FAQs section', () => {
    cy.visit('http://localhost/faculty-faqs')

    cy.location('pathname').should('eq', '/faculty-faqs')

    cy.contains('Faculty FAQs').should('be.visible')
  })
})
