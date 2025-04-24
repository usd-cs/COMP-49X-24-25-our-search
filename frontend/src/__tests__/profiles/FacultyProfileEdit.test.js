import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
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

// Mock setTimeout
jest.useFakeTimers()

describe('FacultyProfileEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))

    // Clear any pending timeouts
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('shows a loading spinner initially', async () => {
    // Mock fetch to return a promise that never resolves
    // This will keep the component in loading state
    const originalFetch = global.fetch
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}))

    let container
    await act(async () => {
      const rendered = renderWithTheme(<FacultyProfileEdit />)
      container = rendered.container
    })

    // Look for the CircularProgress component by its class name instead of role
    const spinner = container.querySelector('.MuiCircularProgress-root')
    expect(spinner).toBeInTheDocument()

    // Restore the original fetch for other tests
    global.fetch = originalFetch
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(getFacultyCurrentExpected.firstName + ' ' + getFacultyCurrentExpected.lastName)).toBeInTheDocument()

    // For multi-select department, check that individual department chip is rendered
    expect(screen.getByText(getFacultyCurrentExpected.department[0].name)).toBeInTheDocument()
  })

  it('submits updated profile successfully', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    await act(async () => {
      userEvent.clear(nameInput)
    })

    await act(async () => {
      await userEvent.type(nameInput, putFacultyCurrentExpected.name)
    })

    // Submit the form - now the button text has changed to "Save Changes"
    const submitButton = screen.getByRole('button', { name: /Save Changes/i })
    await act(async () => {
      await userEvent.click(submitButton)
    })

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
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    const nameInput = screen.getByLabelText(/Name/i)
    await act(async () => {
      userEvent.clear(nameInput)
    })

    await act(async () => {
      await userEvent.type(nameInput, putFacultyCurrentExpected.name)
    })

    // Mock the failed submission
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    // Submit button text is now "Save Changes" instead of "Submit"
    const submitButton = screen.getByRole('button', { name: /Save Changes/i })
    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('does not display submit buttons when fetching the profile to initially populate the form fails', async () => {
    // Mock the failed fetch
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Check for both Reset and Save Changes buttons
    expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Save Changes/i })).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('navigates back to profile view when back button is clicked', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // The back button is now an IconButton with ArrowBack icon and tooltip
    const backButton = screen.getByLabelText(/Back to profile/i)
    await act(async () => {
      await userEvent.click(backButton)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/view-professor-profile')
  })

  it('resets form data when Reset button is clicked', async () => {
    // Override the window.location.reload method
    const originalLocation = window.location
    delete window.location
    window.location = { reload: jest.fn() }

    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // Click Reset button
    const resetButton = screen.getByRole('button', { name: /Reset/i })
    await act(async () => {
      await userEvent.click(resetButton)
    })

    expect(window.location.reload).toHaveBeenCalled()

    // Restore original window.location
    window.location = originalLocation
  })
})
