/* global cy */

describe('Create Project Button E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/majors').as('getMajors')
    cy.intercept('GET', '/api/all-projects').as('getAllProjects')

    cy.visit('http://localhost/posts')

    cy.wait('@getMajors')
    cy.wait('@getAllProjects')
  })

  it('clicks the + button and navigates to Create Project page', () => {
    cy.get('button[aria-label="Create Project"]', { timeout: 10000 }).should('exist')

    cy.get('button[aria-label="Create Project"]').click()

    cy.url({ timeout: 10000 }).should('include', '/create-project')

    cy.get('input', { timeout: 10000 }).should('exist')
  })
})
