import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileEdit from '../components/StudentProfileEdit'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { dummyStudentProfile } from '../resources/mockData'

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
      json: async () => ({
        name: 'Jane Doe',
        graduationYear: '2025',
        major: ['Computer Science'],
        classStatus: ['Senior'],
        researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
        researchPeriodsInterest: ['Fall 2024'],
        interestReason: 'I want to gain research experience.',
        hasPriorExperience: 'yes',
        active: true
      })
    }
  },
  {
    match: '/api/studentProfiles/current', // mock a submission of editted student data
    response: {
      ok: true,
      status: 201,
      json: async () => ({
        name: 'Jane Smith',
        graduationYear: '2025',
        major: ['Computer Science'],
        classStatus: ['Senior'],
        researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
        researchPeriodsInterest: ['Fall 2024'],
        interestReason: 'I want to gain research experience.',
        hasPriorExperience: 'yes',
        active: false
      })
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
    expect(screen.getByDisplayValue(dummyStudentProfile.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyStudentProfile.graduationYear)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyStudentProfile.interestReason)).toBeInTheDocument()

    // For multi-select fields rendered as chips, check individual items
    expect(screen.getByText('Computer Science')).toBeInTheDocument() // Major
    expect(screen.getByText('Senior')).toBeInTheDocument() // Class Status
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument() // Research Field Interests
    expect(screen.getByText('Data Science')).toBeInTheDocument() // Research Field Interests

    // Research Period(s) is a TextField showing a joined string
    expect(screen.getByDisplayValue(dummyStudentProfile.researchPeriodsInterest.join(', '))).toBeInTheDocument()

    // Verify Prior Research Experience radio group: radio with label "Yes" should be checked
    const yesRadio = screen.getByRole('radio', { name: /Yes/i })
    expect(yesRadio).toBeChecked()

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
