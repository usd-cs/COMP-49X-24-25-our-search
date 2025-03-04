import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RequireAuthAndNoProfile from '../components/Auth/RequireAuthAndNoProfile'

// Helper component for testing navigation
const TestComponent = () => <div>Protected Content</div>

describe('RequireAuthAndNoProfile Component', () => {
  const renderWithRouter = (authProps) => {
    return render(
      <MemoryRouter initialEntries={['/protected']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path='/protected'
            element={
              <RequireAuthAndNoProfile {...authProps}>
                <TestComponent />
              </RequireAuthAndNoProfile>
            }
          />
          <Route path='/posts' element={<div>Redirected to Posts</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  test('renders children if authenticated and has no profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: false, isFaculty: false, isAdmin: false })

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  test('redirects to /posts if user is authenticated and has a profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: true, isFaculty: false, isAdmin: false })

    expect(screen.getByText('Redirected to Posts')).toBeInTheDocument()
  })

  test('redirects to /posts if user is not authenticated', () => {
    renderWithRouter({ isAuthenticated: false, isStudent: false, isFaculty: false, isAdmin: false })

    expect(screen.getByText('Redirected to Posts')).toBeInTheDocument()
  })
})
