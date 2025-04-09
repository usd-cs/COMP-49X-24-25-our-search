import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'
import { BACKEND_URL, FRONTEND_URL } from '../resources/constants'

global.fetch = jest.fn()

describe('App', () => {
  beforeAll(() => {
    delete window.location
    window.location = { href: '' }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        isAuthenticated: 'false',
        isStudent: 'false',
        isFaculty: 'false',
        isAdmin: 'false'
      })
    })
  })

  test('calls handleLogin and redirects to login with backend if not logged in yet', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    const loginButton = await screen.findByTestId('login-button')
    fireEvent.click(loginButton)

    // Check if window.location.href was updated
    await waitFor(() => expect(window.location.href).toBe(BACKEND_URL))
  })

  test('calls handleLogin and redirects to /posts if logged in', async () => {
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
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    const loginButton = await screen.findByTestId('login-button')
    fireEvent.click(loginButton)

    await waitFor(() => expect(window.location.href).toBe(`${FRONTEND_URL}/posts`))
  })

  test('renders main layout if authenticated student', async () => {
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
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
    })
  })
  test('renders main layout if authenticated faculty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'true',
        isStudent: 'false',
        isFaculty: 'true',
        isAdmin: 'false'
      })
    })

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
    })
  })
  test('renders main layout if authenticated admin', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isAuthenticated: 'true',
        isStudent: 'false',
        isFaculty: 'false',
        isAdmin: 'true'
      })
    })

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    // Use a more specific query for the login button:
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })
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
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      <MemoryRouter initialEntries={['/ask-for-role']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument() // the login button is no longer there
    })
  })

  test('renders loading state initially', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: 'false' })
    })

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
  })

  test('handles authentication error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    })

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    )
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    expect(screen.getByText('Sorry, we are having trouble connecting you to the server. Please try again later.')).toBeInTheDocument()
  })
})
