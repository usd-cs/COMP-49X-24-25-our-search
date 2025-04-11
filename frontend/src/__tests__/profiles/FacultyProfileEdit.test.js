import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FacultyProfileEdit from '../../components/profiles/FacultyProfileEdit'
import { getFacultyCurrentExpected, putFacultyCurrentExpected, getDepartmentsExpectedResponse } from '../../resources/mockData'

// Wrap component with ThemeProvider and MemoryRouter
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

global.fetch = jest.fn()

// Helper to simulate backend responses
const mockFetch = (url, handlers) => {
  const handler = handlers.find((h) => url.includes(h.match))
  if (handler) {
    return Promise.resolve(handler.response)
  }
  return Promise.reject(new Error('Unknown URL'))
}

const fetchHandlers = [
  {
    match: '/departments', // For fetching departments if needed
    response: {
      ok: true,
      json: async () => getDepartmentsExpectedResponse
    }
  },
  {
    match: '/api/facultyProfiles/current', // For GET request to fetch current profile
    response: {
      ok: true,
      status: 200,
      json: async () => (getFacultyCurrentExpected)
    }
  },
  {
    match: '/api/facultyProfiles/current', // For PUT request to update profile
    response: {
      ok: true,
      status: 200,
      json: async () => (putFacultyCurrentExpected)
    }
  }
]

describe('FacultyProfileEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<FacultyProfileEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(getFacultyCurrentExpected.firstName + ' ' + getFacultyCurrentExpected.lastName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getFacultyCurrentExpected.email)).toBeInTheDocument()
    // For multi-select department, check that individual department chip is rendered
    expect(screen.getByText(getFacultyCurrentExpected.department[0].name)).toBeInTheDocument()
  })

  it('submits updated profile successfully', async () => {
    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, putFacultyCurrentExpected.name)

    // Submit the form without interacting with any inactive checkbox (since active field is not used)
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/faculty'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Object),
          body: expect.any(String)
        })
      )
    })
  })

  it('displays an error message when submission fails', async () => {
    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, putFacultyCurrentExpected.name)

    // Mock the failed submission
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('does not display submit button when fetching the profile to initially populate the form fails', async () => {
    // Mock the failed fetch
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.queryByRole('button', { name: /Submit/i })).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
