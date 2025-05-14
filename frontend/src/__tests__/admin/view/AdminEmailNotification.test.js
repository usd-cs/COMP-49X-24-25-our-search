/* eslint-env jest */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdminEmailNotifications from '../../../components/admin/AdminEmailNotification'
import { getEmailTemplatesExpectedResponse, getEmailTemplateTimeResponse, putEmailTemplatesExpectedRequest } from '../../../resources/mockData'

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
    match: '/email-templates', // For GET request to fetch current email templates
    response: {
      ok: true,
      status: 200,
      json: async () => getEmailTemplatesExpectedResponse
    }
  },
  {
    match: '/email-templates', // For PUT request to update email templates
    response: {
      ok: true,
      status: 200,
      json: async () => putEmailTemplatesExpectedRequest
    }
  },
  {
    match: '/email-templates-time', // For GET request to fetch current email templates
    response: {
      ok: true,
      status: 200,
      json: async () => getEmailTemplateTimeResponse
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

  it('has edit buttons to begin editing the templates', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const editStudentSubjectButton = screen.getByTestId('edit-student-subject')
    const editStudentBodyButton = screen.getByTestId('edit-student-body')
    const editFacultySubjectButton = screen.getByTestId('edit-faculty-subject')
    const editFacultyBodyButton = screen.getByTestId('edit-faculty-body')

    expect(editStudentSubjectButton).toBeInTheDocument()
    expect(editStudentBodyButton).toBeInTheDocument()
    expect(editFacultySubjectButton).toBeInTheDocument()
    expect(editFacultyBodyButton).toBeInTheDocument()
  })

  it('submits updated email templates successfully and shows success message', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the student subject field (first instance)
    const editStudentSubjectButton = screen.getByTestId('edit-student-subject')
    userEvent.click(editStudentSubjectButton)
    const studentSubjectInputs = screen.getAllByLabelText('Subject', { selector: 'input' })
    userEvent.clear(studentSubjectInputs[0])
    await userEvent.type(studentSubjectInputs[0], 'OUR SEARCH App Reminder - Updated for Students')

    // Update the faculty body field (second instance of Email Body)
    const editFacultyBodyButton = screen.getByTestId('edit-faculty-body')
    userEvent.click(editFacultyBodyButton)
    const facultyBodyInputs = screen.getAllByLabelText('Email Body', { selector: 'textarea' })
    userEvent.clear(facultyBodyInputs[1])
    await userEvent.type(facultyBodyInputs[1], 'Dear faculty, updated message.')

    // Set date and time
    const dateInput = screen.getByLabelText(/Scheduled Date/i, { selector: 'input' })
    // const timeInput = screen.getByLabelText(/Scheduled Time/i, { selector: 'input' })

    fireEvent.change(dateInput, { target: { value: '04/25/2025' } })
    // fireEvent.change(timeInput, { target: { value: '10:30 AM' } })

    // Click the save changes button
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Email templates and time to send updated successfully./i)).toBeInTheDocument()
    })
  }, 20000)

  it('shows error if the user does not fill out the date and time right', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the student subject field (first instance)
    const editStudentSubjectButton = screen.getByTestId('edit-student-subject')
    userEvent.click(editStudentSubjectButton)
    const studentSubjectInputs = screen.getAllByLabelText('Subject', { selector: 'input' })
    userEvent.clear(studentSubjectInputs[0])
    await userEvent.type(studentSubjectInputs[0], 'OUR SEARCH App Reminder - Updated for Students')

    // Update the faculty body field (second instance of Email Body)
    const editFacultyBodyButton = screen.getByTestId('edit-faculty-body')
    userEvent.click(editFacultyBodyButton)
    const facultyBodyInputs = screen.getAllByLabelText('Email Body', { selector: 'textarea' })
    userEvent.clear(facultyBodyInputs[1])
    await userEvent.type(facultyBodyInputs[1], 'Dear faculty, updated message.')

    // Set date and time
    const dateInput = screen.getByLabelText(/Scheduled Date/i, { selector: 'input' })
    // const timeInput = screen.getByLabelText(/Scheduled Time/i, { selector: 'input' })

    await userEvent.clear(dateInput)
    await userEvent.type(dateInput, '04/25/2025')
    await userEvent.tab()

    // await userEvent.clear(timeInput)
    // await userEvent.type(timeInput, '10:30 AM')
    // await userEvent.tab()

    // Click the save changes button
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/Please select a date./i)).toBeInTheDocument()
    })
  }, 20000)

  it('ensures edited subject fields reflect changes before submission', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const editStudentSubjectButton = screen.getByTestId('edit-student-subject')
    const editFacultySubjectButton = screen.getByTestId('edit-faculty-subject')

    // Update the student subject
    userEvent.click(editStudentSubjectButton)
    const studentSubjectInput = screen.getAllByLabelText('Subject', { selector: 'input' })[0]
    userEvent.clear(studentSubjectInput)
    await userEvent.type(studentSubjectInput, 'OUR SEARCH App Reminder - Updated for Students')

    // Update the faculty subject
    userEvent.click(editFacultySubjectButton)
    const facultySubjectInput = screen.getAllByLabelText('Subject', { selector: 'input' })[1]
    userEvent.clear(facultySubjectInput)
    await userEvent.type(facultySubjectInput, 'OUR SEARCH App Reminder - Updated for Faculty')
  }, 20000)

  it('ensures edited body fields reflect changes before submission', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const editStudentBodyButton = screen.getByTestId('edit-student-body')
    const editFacultyBodyButton = screen.getByTestId('edit-faculty-body')

    // Update the student body
    userEvent.click(editStudentBodyButton)
    const studentBodyInput = screen.getAllByLabelText('Email Body', { selector: 'textarea' })[0]
    userEvent.clear(studentBodyInput)
    await userEvent.type(studentBodyInput, 'Dear student, updated message.')

    // Update the faculty body
    userEvent.click(editFacultyBodyButton)
    const facultyBodyInput = screen.getAllByLabelText('Email Body', { selector: 'textarea' })[1]
    userEvent.clear(facultyBodyInput)
    await userEvent.type(facultyBodyInput, 'Dear faculty, updated message.')
  }, 20000)

  it('displays an error message when submission fails', async () => {
    renderWithTheme(<AdminEmailNotifications />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })
    const saveButton = screen.getByRole('button', { name: /Save Changes/i })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
