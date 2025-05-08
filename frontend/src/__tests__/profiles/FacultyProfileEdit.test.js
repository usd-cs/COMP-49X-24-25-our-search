import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileEdit from '../../components/profiles/StudentProfileEdit'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getStudentCurrentExpected, putStudentCurrentExpected } from '../../resources/mockData'

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
    match: '/majors',
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Chemistry' }
      ]
    }
  },
  {
    match: '/research-periods',
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Fall 2025' },
        { id: 2, name: 'Spring 2025' }
      ]
    }
  },
  {
    match: '/api/studentProfiles/current',
    response: {
      ok: true,
      status: 201,
      json: async () => (getStudentCurrentExpected)
    }
  },
  {
    match: '/api/studentProfiles/current',
    response: {
      ok: true,
      status: 201,
      json: async () => (putStudentCurrentExpected)
    }
  }
]

wjest.useFakeTimers()

describe('StudentProfileEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))

    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it('shows a loading spinner initially', async () => {
    const originalFetch = global.fetch
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}))

    let container
    await act(async () => {
      const rendered = renderWithTheme(<StudentProfileEdit />)
      container = rendered.container
    })

    const spinner = container.querySelector('.MuiCircularProgress-root')
    expect(spinner).toBeInTheDocument()

    global.fetch = originalFetch
  })

  it('navigates to /view-student-profile page when back button is clicked', async () => {
    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    const backButton = screen.getByLabelText(/Back to profile/i)

    await act(async () => {
      await userEvent.click(backButton)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/view-student-profile')
  })

  it('reloads the page when reset button is clicked', async () => {
    const originalLocation = window.location
    delete window.location
    window.location = { reload: jest.fn() }

    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    const button = screen.getByRole('button', { name: /Reset/i })

    await act(async () => {
      await userEvent.click(button)
    })

    expect(window.location.reload).toHaveBeenCalled()

    window.location = originalLocation
  })

  it('displays a custom error message when fetching profile fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    expect(screen.getByDisplayValue(getStudentCurrentExpected.firstName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getStudentCurrentExpected.lastName)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getStudentCurrentExpected.graduationYear)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getStudentCurrentExpected.interestReason)).toBeInTheDocument()

    expect(screen.getByText(getStudentCurrentExpected.classStatus)).toBeInTheDocument()

    const setMajorAndFieldOptions = screen.getAllByText(getStudentCurrentExpected.researchFieldInterests[0])
    expect(setMajorAndFieldOptions).toHaveLength(2)

    const researchPeriodOptions = screen.getAllByText(getStudentCurrentExpected.researchPeriodsInterest[0])
    expect(researchPeriodOptions.length).toBeGreaterThan(0)

    expect(screen.getByRole('radio', { name: /Yes/i })).toBeChecked()

    const inactiveRadio = screen.getByLabelText(/Inactive/i)
    expect(inactiveRadio).not.toBeChecked()
  })

  it('submits updated profile successfully', async () => {
    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Run timers for the fade-in effect
    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // Update the first name field
    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)

    await act(async () => {
      userEvent.clear(firstNameInput)
      userEvent.clear(lastNameInput)
    })

    await act(async () => {
      await userEvent.type(firstNameInput, 'Jane')
      await userEvent.type(lastNameInput, 'Smith')
    })

    const inactiveRadio = screen.getByLabelText(/Inactive/i) // Use label to target specific radio

    await act(async () => {
      await userEvent.click(inactiveRadio)
    })

    expect(inactiveRadio).toBeChecked()

    // Submit the form - now the button text has changed to "Save Changes"
    const submitButton = screen.getByRole('button', { name: /Save Changes/i })

    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/student'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Object),
          body: expect.any(String)
        })
      )
    })

    // Check that the request body includes the combined name
    const calls = fetch.mock.calls
    const lastCall = calls[calls.length - 1]
    const requestBody = JSON.parse(lastCall[1].body)
    expect(requestBody.name).toBe('Jane Smith')
  })

  it('displays an error message when submission fails', async () => {
    // Mock a response from a failed submission
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    // Change the name fields
    const firstNameInput = screen.getByLabelText(/First Name/i)
    const lastNameInput = screen.getByLabelText(/Last Name/i)

    await act(async () => {
      userEvent.clear(firstNameInput)
      userEvent.clear(lastNameInput)
    })

    await act(async () => {
      await userEvent.type(firstNameInput, 'Jane')
      await userEvent.type(lastNameInput, 'Smith')
    })

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Save Changes/i })

    await act(async () => {
      await userEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('displays avatar with correct initials', async () => {
    await act(async () => {
      renderWithTheme(<StudentProfileEdit />)
    })

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    await act(async () => {
      jest.advanceTimersByTime(200)
    })

    const firstInitial = getStudentCurrentExpected.firstName[0]
    const lastInitial = getStudentCurrentExpected.lastName[0]
    const initials = (firstInitial + lastInitial).toUpperCase()

    const avatar = screen.getByText(initials)
    expect(avatar).toBeInTheDocument()
  })
})
