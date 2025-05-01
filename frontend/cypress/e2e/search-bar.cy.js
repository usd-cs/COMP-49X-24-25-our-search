/* global cy */

describe('Search Bar E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/majors', []).as('getMajors')

    cy.intercept('GET', '/api/all-projects', [{
      id: 1,
      name: 'Engineering',
      majors: [
        {
          id: 101,
          name: 'Computer Science',
          posts: [
            {
              id: 1001,
              name: 'Mock Research Project',
              isActive: true,
              faculty: { firstName: 'John', lastName: 'Doe' },
              researchPeriods: ['Spring 2025'],
              majors: ['Computer Science'],
              umbrellaTopics: ['AI', 'ML']
            }
          ]
        }
      ]
    }]).as('getAllProjects')

    cy.intercept('GET', '/api/umbrella-topics', []).as('getUmbrellaTopics')
    cy.intercept('GET', '/api/research-periods', []).as('getResearchPeriods')

    cy.visit('http://localhost/posts')
    cy.wait('@getMajors')
    cy.wait('@getAllProjects')
    cy.wait('@getUmbrellaTopics')
    cy.wait('@getResearchPeriods')
  })

  it('shows the search field', () => {
    cy.contains('Show Filters', { timeout: 10000 }).click()
    cy.get('.MuiDrawer-paper', { timeout: 10000 }).should('be.visible')
    cy.get('#searchField', { timeout: 10000 }).should('be.visible')
  })
})
