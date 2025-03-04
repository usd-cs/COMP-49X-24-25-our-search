import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RequireStudentProfile from '../../components/Auth/RequireStudentProfile'

// Helper component for testing navigation
const TestComponent = () => <div>Protected Content</div>

describe('RequireStudentProfile Component', () => {
  const renderWithRouter = (authProps) => {
    return render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path='/'
            element={
              <RequireStudentProfile {...authProps}>
                <TestComponent />
              </RequireStudentProfile>
            }
          />
          <Route path='/posts' element={<div>Redirected</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  test('renders children if authenticated and has student profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: true, isFaculty: false, isAdmin: false })

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  test('redirects if authenticated and has faculty profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: false, isFaculty: true, isAdmin: false })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Redirected')).toBeInTheDocument()
  })

  test('redirects if authenticated and has admin profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: false, isFaculty: false, isAdmin: true })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Redirected')).toBeInTheDocument()
  })

  test('redirects if authenticated but no has profile', () => {
    renderWithRouter({ isAuthenticated: true, isStudent: false, isFaculty: false, isAdmin: false })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Redirected')).toBeInTheDocument()
  })

  test('redirects if not authenticated', () => {
    renderWithRouter({ isAuthenticated: false, isStudent: false, isFaculty: false, isAdmin: false })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Redirected')).toBeInTheDocument()
  })
})
