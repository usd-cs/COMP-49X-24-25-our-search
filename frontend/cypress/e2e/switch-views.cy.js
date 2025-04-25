/* global cy */

describe('Faculty Switch Views E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/majors').as('getMajors')
    cy.intercept('GET', '/api/all-projects').as('getAllProjects')

    cy.visit('http://localhost/posts')

    cy.wait('@getMajors')
    cy.wait('@getAllProjects')
  })

  it('switches between Students, All Projects, and My Projects views', () => {
    cy.contains('Students', { timeout: 10000 }).should('exist').click()

    cy.contains('Results', { timeout: 10000 }).should('exist')

    cy.contains('All Projects', { timeout: 10000 }).should('exist').click()

    cy.contains('Results', { timeout: 10000 }).should('exist')

    cy.contains('My Projects', { timeout: 10000 }).should('exist').click()

    cy.contains('Results', { timeout: 10000 }).should('exist')
  })
})
