import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdminFacultyEdit from '../../../components/admin/AdminFacultyEdit'
import { getDepartmentsExpectedResponse, getFacultyExpectedResponse, putFacultyExpectedRequest } from '../../../resources/mockData'

// Wrap component with ThemeProvider and MemoryRouter
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/faculty/${getFacultyExpectedResponse.id}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
    </ThemeProvider>
  )
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn()
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
    match: '/departments',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getDepartmentsExpectedResponse
    }
  },
  {
    match: '/faculty', // For GET request to fetch current profile
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => (getFacultyExpectedResponse)
    }
  },
  {
    match: '/faculty', // For PUT request to update profile
    method: 'PUT',
    response: {
      ok: true,
      status: 200,
      json: async () => (putFacultyExpectedRequest)
    }
  }
]

describe('AdminFacultyEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    useParams.mockReturnValue({ id: getFacultyExpectedResponse.id })
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('navigates to /posts when back button is clicked', async () => {
    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<AdminFacultyEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching this profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(getFacultyExpectedResponse.firstName + ' ' + getFacultyExpectedResponse.lastName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getFacultyExpectedResponse.email)).toBeInTheDocument()
    // For multi-select department, check that individual department chip is rendered
    getFacultyExpectedResponse.department.forEach((dept) => {
      expect(screen.getByText(new RegExp(dept, 'i'))).toBeInTheDocument()
    })
  })

  it('submits updated profile successfully and shows success message', async () => {
    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, putFacultyExpectedRequest.name)

    // Submit the form without interacting with any inactive checkbox (since active field is not used)
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully\./i)).toBeInTheDocument()
    })
  })

  it('displays an error message when submission fails', async () => {
    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, putFacultyExpectedRequest.name)

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

    renderWithTheme(<AdminFacultyEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.queryByRole('button', { name: /Submit/i })).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred while fetching this profile\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
