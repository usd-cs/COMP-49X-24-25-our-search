import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileEdit from '../../components/profiles/StudentProfileEdit'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { getStudentCurrentExpected, putStudentCurrentExpected } from '../../resources/mockData'

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
    match: '/majors', // for the dropdown list population
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Chemistry' }
      ]
    }
  },
  {
    match: '/research-periods', // for the dropdown list population
    response: {
      ok: true,
      json: async () => [
        { id: 1, name: 'Fall 2025' },
        { id: 2, name: 'Spring 2025' }
      ]
    }
  },
  {
    match: '/api/studentProfiles/current', // to get current student data
    response: {
      ok: true,
      status: 201,
      json: async () => (getStudentCurrentExpected)
    }
  },
  {
    match: '/api/studentProfiles/current', // mock a submission of editted student data
    response: {
      ok: true,
      status: 201,
      json: async () => (putStudentCurrentExpected)
    }
  }
]

describe('StudentProfileEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<StudentProfileEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to /view-student-profile page when back button is clicked', async () => {
    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back to profile/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/view-student-profile')
  })

  it('reloads the page when reset button is clicked', async () => {
    // Mock `window.location.reload`
    const reloadMock = jest.fn()
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadMock }
    })
    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(button)

    expect(reloadMock).toHaveBeenCalled()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    const name = getStudentCurrentExpected.firstName + ' ' + getStudentCurrentExpected.lastName
    expect(screen.getByDisplayValue(name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getStudentCurrentExpected.graduationYear)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getStudentCurrentExpected.interestReason)).toBeInTheDocument()

    // For multi-select fields rendered as chips, check individual items
    expect(screen.getByText(getStudentCurrentExpected.classStatus)).toBeInTheDocument()
    // There are two dropdowns for research field interest and major, both with the same values, so
    // the test needs to query for ALL by text to get both times the values appear
    const setMajorAndFieldOptions = screen.getAllByText(getStudentCurrentExpected.researchFieldInterests[0])
    expect(setMajorAndFieldOptions).toHaveLength(2)

    // Research Period(s) is a TextField showing a joined string
    expect(screen.getByDisplayValue(getStudentCurrentExpected.researchPeriodsInterest.join(', '))).toBeInTheDocument()

    // Verify Prior Research Experience radio group: radio with label "Yes" should be checked
    if (getStudentCurrentExpected.hasPriorExperience) {
      expect(screen.getByRole('radio', { name: /Yes/i })).toBeChecked()
    } else {
      expect(screen.getByRole('radio', { name: /No/i })).toBeChecked()
    }

    // The "Set Profile as Inactive" checkbox should be unchecked when active is true
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    expect(inactiveCheckbox).not.toBeChecked()
  })

  it('submits updated profile successfully and shows success message', async () => {
    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jane Smith')

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

    renderWithTheme(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Change the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jane Smith')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
