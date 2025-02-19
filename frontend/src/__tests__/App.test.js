import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'
// import { backendUrl } from '../resources/constants'

global.fetch = jest.fn()

describe('App', () => {
  beforeAll(() => {
    delete window.location
    window.location = { href: '' }
  })

  // TODO uncomment when landing page is implemented
  // test('calls handleLogin and redirects', () => {
  //   render(
  //     <MemoryRouter>
  //       <App />
  //     </MemoryRouter>
  //   )

  //   const loginButton = screen.getByText(/login/i) // Adjust according to where this button might be
  //   fireEvent.click(loginButton)

  //   // Check if window.location.href was updated
  //   expect(window.location.href).toBe(backendUrl) // Replace with your backend URL
  // })

  test('renders main layout if authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'true',
        isStudent: 'true',
        isFaculty: 'false',
        isAdmin: 'false'
      })
    })

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
    })
  })

  test('does not render main layout if not authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'false',
        isStudent: 'false',
        isFaculty: 'false',
        isAdmin: 'false'
      })
    })

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    // TODO add this back once LandingPage PR is merged
    // await waitFor(() => {
    //   expect(screen.getByText(/login/i)).toBeInTheDocument()
    // })
  })

  test('calls checkAuthStatus on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'false',
        isStudent: 'false',
        isFaculty: 'false',
        isAdmin: 'false'
      })
    })

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/check-auth'), expect.any(Object)))
  })

  test('renders RoleSelection on /ask-for-role route', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'true',
        isStudent: 'false',
        isFaculty: 'false',
        isAdmin: 'false'
      })
    })

    render(
      <MemoryRouter initialEntries={['/ask-for-role']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument() // the login button is no longer there
    })
  })
})
