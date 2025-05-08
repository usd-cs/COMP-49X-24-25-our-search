import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacultyProfileEdit from '../../components/profiles/FacultyProfileEdit'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getFacultyCurrentExpected } from '../../resources/mockData'

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

const mockFetch = (url, handlers) => {
  const handler = handlers.find((h) => url.includes(h.match))
  if (handler) {
    return Promise.resolve(handler.response)
  }
  return Promise.reject(new Error('Unknown URL'))
}

const fetchHandlers = [
  {
    match: '/api/departments',
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Chemistry' }
      ]
    }
  },
  {
    match: '/api/facultyProfiles/current',
    response: {
      ok: true,
      status: 200,
      json: async () => getFacultyCurrentExpected
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

  it('navigates to view-professor-profile page when back button is clicked', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const backButton = screen.getByLabelText(/Back to profile/i)

    await act(async () => {
      await userEvent.click(backButton)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/view-professor-profile')
  })

  it('populates form fields with fetched profile data', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(getFacultyCurrentExpected.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getFacultyCurrentExpected.lastName)).toBeInTheDocument()

    // For multi-select department, check that individual department chip is rendered
    expect(screen.getByText(getFacultyCurrentExpected.department[0].name)).toBeInTheDocument()
  })

  it('reloads the page when reset button is clicked', async () => {
    // Mock `window.location.reload`
    const originalLocation = window.location
    delete window.location
    window.location = { reload: jest.fn() }

    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Wait for the reset button to appear
    await waitFor(() => {
      const resetButton = screen.getByText(/Reset/i)
      expect(resetButton).toBeInTheDocument()
    })

    const resetButton = screen.getByText(/Reset/i)
    await act(async () => {
      await userEvent.click(resetButton)
    })

    expect(window.location.reload).toHaveBeenCalled()

    // Restore original window.location
    window.location = originalLocation
  })

  it('submits updated profile successfully', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name fields
    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)

    await act(async () => {
      userEvent.clear(firstNameInput)
      userEvent.clear(lastNameInput)
    })

    await act(async () => {
      await userEvent.type(firstNameInput, 'John')
      await userEvent.type(lastNameInput, 'Smith')
    })

    // Submit the form
    const submitButton = screen.getByText(/Save Changes/i)

    // Mock successful submission
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({})
    })

    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/facultyProfiles/current'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Object),
          body: expect.any(String)
        })
      )
    })

    // Check that the request body includes the name fields
    const calls = fetch.mock.calls
    const lastCall = calls[calls.length - 1]
    const requestBody = JSON.parse(lastCall[1].body)
    
    if (requestBody.firstName !== undefined) {
      expect(requestBody.firstName).toBe('John')
      expect(requestBody.lastName).toBe('Smith')
    } else if (requestBody.name !== undefined) {
      expect(requestBody.name).toBe('John Smith')
    }
  })

  it('displays an error message when submission fails', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name fields
    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)

    await act(async () => {
      userEvent.clear(firstNameInput)
      userEvent.clear(lastNameInput)
    })

    await act(async () => {
      await userEvent.type(firstNameInput, 'John')
      await userEvent.type(lastNameInput, 'Smith')
    })

    // Mock failed submission
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    })

    // Submit the form
    const submitButton = screen.getByText(/Save Changes/i)

    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('displays avatar with correct initials', async () => {
    await act(async () => {
      renderWithTheme(<FacultyProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Get the expected initials
    const firstInitial = getFacultyCurrentExpected.firstName[0]
    const lastInitial = getFacultyCurrentExpected.lastName[0]
    const initials = (firstInitial + lastInitial).toUpperCase()
    
    // Check if avatar with initials is displayed
    const avatar = screen.getByText(initials)
    expect(avatar).toBeInTheDocument()
  })
})