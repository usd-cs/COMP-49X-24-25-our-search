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

  test('renders the FAKE LOGIN button', () => {
    render(<LandingPage />)
    const loginButton = screen.getByRole('button', { name: /LOGIN/i })
    expect(loginButton).toBeInTheDocument()
  })

  test('renders the login hint text "*Must use your @sandiego.edu email"', () => {
    render(<LandingPage />)
    const loginHint = screen.getByText(/\*Must use your @sandiego.edu email/i)
    expect(loginHint).toBeInTheDocument()
  })

  test('renders the project description text', () => {
    render(<LandingPage />)
    const description = screen.getByText(/The SEARCH project enhances student-faculty collaboration at USD by/i)
    expect(description).toBeInTheDocument()
  })

  test('renders the section headers', () => {
    render(<LandingPage />)
    const streamlinedProfiles = screen.getByText(/Streamlined Profiles/i)
    const advancedFiltering = screen.getByText(/Advanced Filtering/i)
    const realTimeNotifications = screen.getByText(/Real-Time Notifications/i)

    expect(streamlinedProfiles).toBeInTheDocument()
    expect(advancedFiltering).toBeInTheDocument()
    expect(realTimeNotifications).toBeInTheDocument()
  })
})
