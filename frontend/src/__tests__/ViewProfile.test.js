import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ViewProfile from '../components/ViewProfile'

describe('ViewProfile Component', () => {
  describe('Faculty view', () => {
    beforeEach(() => {
      render(<ViewProfile isFaculty isStudent={false} />)
    })

    test('renders the faculty profile button', () => {
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      expect(facultyButton).toBeInTheDocument()
      expect(facultyButton).toHaveAttribute('id', 'faculty-profile-button')
    })

    test('opens and displays faculty dropdown menu items when faculty button is clicked', () => {
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)

      const profileOption = screen.getByText(/My Profile\/Projects/i)
      const createProjectOption = screen.getByText(/Create New Project/i)
      const logoutOption = screen.getByText(/Logout/i)

      expect(profileOption).toBeVisible()
      expect(createProjectOption).toBeVisible()
      expect(logoutOption).toBeVisible()
    })

    test('closes the menu when a menu item is clicked', () => {
      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)

      const profileOption = screen.getByText(/My Profile\/Projects/i)
      expect(profileOption).toBeVisible()

      fireEvent.click(profileOption)

      expect(profileOption).not.toBeVisible()
    })

    test('logout functionality redirects to /logout', () => {
      delete window.location
      window.location = { href: '' }

      const facultyButton = screen.getByRole('button', { name: /Faculty/i })
      fireEvent.click(facultyButton)
      const logoutOption = screen.getByText(/Logout/i)
      fireEvent.click(logoutOption)

      expect(window.location.href).toBe('/logout')
    })
  })

  describe('Student view', () => {
    beforeEach(() => {
      render(<ViewProfile isFaculty={false} isStudent />)
    })

    test('renders the student profile button', () => {
      const studentButton = screen.getByRole('button', { name: /Student/i })
      expect(studentButton).toBeInTheDocument()
      expect(studentButton).toHaveAttribute('id', 'student-profile-button')
    })

    test('opens and displays student dropdown menu items when student button is clicked', () => {
      const studentButton = screen.getByRole('button', { name: /Student/i })
      fireEvent.click(studentButton)

      const viewProfileOption = screen.getByText(/View My Profile/i)
      const logoutOption = screen.getByText(/Logout/i)

      expect(viewProfileOption).toBeVisible()
      expect(logoutOption).toBeVisible()
    })

    test('closes the menu when a menu item is clicked in student view', () => {
      const studentButton = screen.getByRole('button', { name: /Student/i })
      fireEvent.click(studentButton)

      const viewProfileOption = screen.getByText(/View My Profile/i)
      expect(viewProfileOption).toBeVisible()

      fireEvent.click(viewProfileOption)

      expect(viewProfileOption).not.toBeVisible()
    })

    test('logout functionality redirects to /logout in student view', () => {
      delete window.location
      window.location = { href: '' }

      const studentButton = screen.getByRole('button', { name: /Student/i })
      fireEvent.click(studentButton)
      const logoutOption = screen.getByText(/Logout/i)
      fireEvent.click(logoutOption)

      expect(window.location.href).toBe('/logout')
    })
  })
})
