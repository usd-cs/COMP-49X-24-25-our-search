import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

global.fetch = jest.fn()

describe('App', () => {
  test('renders main layout if authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: 'true' })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByText(/login/i)).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(/our search/i)).toBeInTheDocument() // Assuming "our search" is in MainLayout
    })
  })

  test('does not render main layout if not authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: 'false' })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByText(/our search/i)).not.toBeInTheDocument() // Assuming "our search" is in MainLayout
    })
  })

  test('calls checkAuthStatus on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAuthenticated: 'true' })
    })

    render(<App />)

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/check-auth'), expect.any(Object)))
  })
})
