import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import ViewProfile from '../../components/profiles/ViewProfile'

// Need to wrap the component in this because it uses navigate from react-router-dom
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
    </ThemeProvider>
  )
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

describe('ViewProfile Component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate)
  })

  describe('Faculty view', () => {
    test('renders the faculty profile button', () => {
      renderWithTheme(<ViewProfile isFaculty isStudent={false} />)
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      expect(facultyButton).toBeInTheDocument()
      expect(facultyButton).toHaveAttribute('id', 'faculty-profile-button')
    })

    test('opens and displays faculty dropdown menu items when faculty button is clicked', () => {
      renderWithTheme(<ViewProfile isFaculty isStudent={false} />)
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)

      const profileOption = screen.getByText(/My Profile\/Projects/i)
      const createProjectOption = screen.getByText(/Create New Project/i)
      const logoutOption = screen.getByText(/Logout/i)

      expect(profileOption).toBeVisible()
      expect(createProjectOption).toBeVisible()
      expect(logoutOption).toBeVisible()
    })

    test('closes the menu and navigates to new page when a my profile/projects item is clicked', () => {
      renderWithTheme(<ViewProfile isFaculty isStudent={false} />)
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)

      const profileOption = screen.getByText(/My Profile\/Projects/i)
      expect(profileOption).toBeVisible()

      fireEvent.click(profileOption)

      expect(profileOption).not.toBeVisible()
      expect(mockNavigate).toHaveBeenCalledWith('/view-professor-profile')
    })

    test('closes the menu and navigates to new page when a create new project item is clicked', () => {
      renderWithTheme(<ViewProfile isFaculty isStudent={false} />)
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)

      const profileOption = screen.getByText(/create new project/i)
      expect(profileOption).toBeVisible()

      fireEvent.click(profileOption)

      expect(profileOption).not.toBeVisible()
      expect(mockNavigate).toHaveBeenCalledWith('/create-project')
    })
  })

  describe('Student view', () => {
    test('renders the student profile button', () => {
      renderWithTheme(<ViewProfile isFaculty={false} isStudent />)
      const studentButton = screen.getByRole('button', { name: /Student/i })
      expect(studentButton).toBeInTheDocument()
      expect(studentButton).toHaveAttribute('id', 'student-profile-button')
    })

    test('opens and displays student dropdown menu items when student button is clicked', () => {
      renderWithTheme(<ViewProfile isFaculty={false} isStudent />)
      const studentButton = screen.getByRole('button', { name: /Student/i })
      fireEvent.click(studentButton)

      const viewProfileOption = screen.getByText(/View My Profile/i)
      const logoutOption = screen.getByText(/Logout/i)

      expect(viewProfileOption).toBeVisible()
      expect(logoutOption).toBeVisible()
    })

    test('closes the menu and navigates to new page when a menu item is clicked in student view', () => {
      renderWithTheme(<ViewProfile isFaculty={false} isStudent />)
      const studentButton = screen.getByRole('button', { name: /Student/i })
      fireEvent.click(studentButton)

      const viewProfileOption = screen.getByText(/View My Profile/i)
      expect(viewProfileOption).toBeVisible()

      fireEvent.click(viewProfileOption)

      expect(viewProfileOption).not.toBeVisible()
      expect(mockNavigate).toHaveBeenCalledWith('/view-student-profile')
    })
  })

  describe('Admin view', () => {
    test('renders the admin profile button', () => {
      renderWithTheme(<ViewProfile isFaculty={false} isStudent={false} isAdmin />)
      const adminButton = screen.getByRole('button', { name: /Admin/i })
      expect(adminButton).toBeInTheDocument()
      expect(adminButton).toHaveAttribute('id', 'admin-profile-button')
    })

    test('opens and displays student dropdown menu items when student button is clicked', () => {
      renderWithTheme(<ViewProfile isFaculty={false} isStudent={false} isAdmin />)
      const adminButton = screen.getByRole('button', { name: /Admin/i })
      fireEvent.click(adminButton)

      const logoutOption = screen.getByText(/Logout/i)

      expect(logoutOption).toBeVisible()
    })
  })
})
