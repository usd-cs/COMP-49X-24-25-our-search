import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdminEmailNotifications from '../../components/admin/AdminEmailNotification'
import { getEmailTemplatesExpectedResponse, putEmailTemplatesExpectedRequest } from '../../resources/mockData'

// Wrap component with theme and router
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  )
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

global.fetch = jest.fn()

// Helper method to mock backend responses
const mockFetch = (url, handlers) => {
  const handler = handlers.find((h) => url.includes(h.match))
  if (handler) {
    return Promise.resolve(handler.response)
  }
  return Promise.reject(new Error('Unknown URL'))
}

const fetchHandlers = [
  {
    match: '/email-notifications', // For GET request to fetch current email templates
    response: {
      ok: true,
      status: 200,
      json: async () => getEmailTemplatesExpectedResponse
    }
  },
  {
    match: '/email-notifications', // For PUT request to update email templates
    response: {
      ok: true,
      status: 200,
      json: async () => putEmailTemplatesExpectedRequest
    }
  }
]

describe('AdminEmailNotifications', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<AdminEmailNotifications />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching templates fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched email templates', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Check header is present
    expect(screen.getByRole('heading', { name: /Manage App Notifications/i })).toBeInTheDocument()

    // For Students section, use getAllByDisplayValue to handle duplicate inputs
    const studentTemplate = getEmailTemplatesExpectedResponse.find(t => t.type === 'STUDENTS')
    const studentSubjectInputs = screen.getAllByDisplayValue(studentTemplate.subject)
    expect(studentSubjectInputs.length).toBeGreaterThan(0)
    const studentBodyInputs = screen.getAllByDisplayValue(studentTemplate.body)
    expect(studentBodyInputs.length).toBeGreaterThan(0)

    // For Faculty section, similarly check subject and body inputs
    const facultyTemplate = getEmailTemplatesExpectedResponse.find(t => t.type === 'FACULTY')
    const facultySubjectInputs = screen.getAllByDisplayValue(facultyTemplate.subject)
    expect(facultySubjectInputs.length).toBeGreaterThan(0)
    const facultyBodyInputs = screen.getAllByDisplayValue(facultyTemplate.body)
    expect(facultyBodyInputs.length).toBeGreaterThan(0)

    // Check that the Back and Save Changes buttons are present
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
  })

  it('submits updated email templates successfully and shows success message', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the student subject field (first instance)
    const studentSubjectInputs = screen.getAllByLabelText('Subject', { selector: 'input' })
    userEvent.clear(studentSubjectInputs[0])
    await userEvent.type(studentSubjectInputs[0], 'OUR SEARCH App Reminder - Updated for Students')
    
    // Update the faculty body field (second instance of Email Body)
    const facultyBodyInputs = screen.getAllByLabelText('Email Body', { selector: 'textarea' })
    userEvent.clear(facultyBodyInputs[1])
    await userEvent.type(facultyBodyInputs[1], 'Dear faculty, updated message.')
    
    // Click the save changes button
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await userEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Email templates updated successfully\./i)).toBeInTheDocument()
    })
  })

  it('displays an error message when submission fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
