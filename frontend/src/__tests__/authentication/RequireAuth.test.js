import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RequireAuth from '../../components/authentication/RequireAuth'

// Helper component for testing navigation
const TestComponent = () => <div>Protected Content</div>

describe('RequireAuth Component', () => {
  const renderWithRouter = (authProps) => {
    return render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path='/'
            element={
              <RequireAuth {...authProps}>
                <TestComponent />
              </RequireAuth>
            }
          />
          <Route path='/' element={<div>Redirected to Landing</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  test('renders children if authenticated', () => {
    renderWithRouter({ isAuthenticated: true })

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  test('redirects to / if user is not authenticated', () => {
    renderWithRouter({ isAuthenticated: false })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
