import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FacultyProfileEdit from '../components/FacultyProfileEdit'

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

global.fetch = jest.fn()

const dummyProfile = {
  name: 'Dr. John Doe',
  email: 'john.doe@example.com',
  department: ['Computer Science', 'Mathematics'],
  active: true
}

// Helper method to mock the backend requests
const mockFetch = (url, handlers) => {
  const handler = handlers.find((h) => url.includes(h.match))
  if (handler) {
    return Promise.resolve(handler.response)
  }
  return Promise.reject(new Error('Unknown URL'))
}

// To mock the backend requests
const fetchHandlers = [
  {
    match: '/departments', // for the dropdown list population
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Chemistry' }
      ]
    }
  },
  {
    match: '/api/facultyProfiles/current', // to get current student data
    response: {
      ok: true,
      status: 201,
      json: async () => ({
        name: 'Dr. Jane Smith',
        email: 'jane@sandiego.edu',
        department: ['Computer Science'],
        active: true
      })
    }
  },
  {
    match: '/api/facultyProfiles', // mock a submission of editted data
    response: {
      ok: true,
      status: 201,
      json: async () => ({
        name: 'Jane Doe',
        email: 'janedoe@sandiego.edu',
        department: ['Computer Science'],
        active: false
      })
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
    expect(screen.getByDisplayValue('Dr. Jane Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@sandiego.edu')).toBeInTheDocument()
    // For multi-select department, check that individual department chips are rendered
    expect(screen.getByText('Computer Science')).toBeInTheDocument()

    // The "Set Profile as Inactive" checkbox should be unchecked when active is true
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    expect(inactiveCheckbox).not.toBeChecked()
  })

  it('submits updated profile successfully and shows success message', async () => {
    render(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Dr. Jane Smith')

    // Toggle inactive checkbox to set profile as inactive
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    await userEvent.click(inactiveCheckbox)
    expect(inactiveCheckbox).toBeChecked()

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully\./i)).toBeInTheDocument()
    })
  })

  it('displays an error message when submission fails', async () => {
    // Mock a response from a failed submission
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    renderWithTheme(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Change the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Dr. Jane Smith')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })
})
