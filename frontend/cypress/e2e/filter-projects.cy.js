/* global cy */

describe('Filter Projects E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/majors').as('getMajors')
    cy.intercept('GET', '/api/all-projects').as('getAllProjects')

    cy.visit('http://localhost/posts')

    cy.wait('@getMajors')
    cy.wait('@getAllProjects')
  })

  it('opens filter, expands all sections, and clicks Apply', () => {
    cy.contains('Show Filters', { timeout: 10000 }).click()

    cy.contains('Majors', { timeout: 10000 }).click()

    cy.contains('Research Periods', { timeout: 10000 }).click()

    cy.contains('Umbrella Topics', { timeout: 10000 }).click()

    cy.contains('Apply', { timeout: 10000 }).click()

    cy.url({ timeout: 10000 }).should('include', '/posts')
  })
})
