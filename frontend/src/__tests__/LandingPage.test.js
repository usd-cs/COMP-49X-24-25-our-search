/* eslint-env jest */
// LandingPage.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LandingPage from '../components/LandingPage'

describe('LandingPage Component', () => {
  test('renders the main heading "Our Search"', () => {
    render(<LandingPage />)
    const mainHeading = screen.getByText(/Our Search/i)
    expect(mainHeading).toBeInTheDocument()
  })

  test('renders the LOGIN button', () => {
    render(<LandingPage />)
    const loginButton = screen.getByRole('button', { name: /LOGIN/i })
    expect(loginButton).toBeInTheDocument()
  })

  test('renders the login hint text "*Must use your @sandiego.edu email"', () => {
    render(<LandingPage />)
    const loginHint = screen.getByText(/\*Must use your @sandiego.edu email/i)
    expect(loginHint).toBeInTheDocument()
  })

  test('renders the SEARCH acronym definition', () => {
    render(<LandingPage />)
    const definition = screen.getByText(/The Student Engagement and Access Research Community Hub/i)
    expect(definition).toBeInTheDocument()
  })

  test('renders the section headers', () => {
    render(<LandingPage />)

    expect(screen.getByText(/Explore Research Opportunities at USD/i)).toBeInTheDocument()
    expect(screen.getByText(/student profiles/i)).toBeInTheDocument()
    expect(screen.getByText(/faculty profiles/i)).toBeInTheDocument()
    expect(screen.getByText(/filtering/i)).toBeInTheDocument()
    expect(screen.getByText(/notifications/i)).toBeInTheDocument()
  })

  test('renders error messages', () => {
    render(<LandingPage checkAuthError />)

    expect(screen.getByText(/try again/i)).toBeInTheDocument()
  })
})
