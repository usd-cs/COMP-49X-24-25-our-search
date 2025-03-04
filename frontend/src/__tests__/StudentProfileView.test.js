/* eslint-env jest */
/**
 * StudentProfileView.test.js
 *
 * This file has the tests for the StudentProfileView component.
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import StudentProfileView from '../components/StudentProfileView'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate } from 'react-router-dom'

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

describe('StudentProfileView', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<StudentProfileView />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to /edit-student-profile page when edit button is clicked', async () => {
    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /edit profile/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/edit-student-profile')
  })

  it('navigates to /posts page when back button is clicked', async () => {
    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  it('displays a custom error message when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('displays profile data when fetch is successful', async () => {
    const dummyProfile = {
      name: 'Jane Doe',
      graduationYear: '2025',
      major: ['Computer Science'],
      classStatus: 'Senior',
      researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
      researchPeriodsInterest: ['Fall 2024'],
      interestReason: 'I want to gain research experience.',
      hasPriorExperience: 'yes'
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => dummyProfile
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByRole('heading', { name: /Student Profile/i })).toBeInTheDocument()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.getByText(/Computer Science/)).toBeInTheDocument()
    expect(screen.getByText(/Senior/)).toBeInTheDocument()
    expect(screen.getByText(/Artificial Intelligence, Data Science/)).toBeInTheDocument()
    expect(screen.getByText(/Fall 2024/)).toBeInTheDocument()
    expect(screen.getByText(/I want to gain research experience\./i)).toBeInTheDocument()
    expect(screen.getByText(/Yes/)).toBeInTheDocument()

    // Verify the presence of the Edit Profile button
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()

    // Verify the presence of the Back button
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
  })

  it('displays "No profile found." when profile is null', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => null
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/No profile found\./i)).toBeInTheDocument()
    })
  })
})
