/* eslint-env jest */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdminEmails from '../../../components/admin/AdminEmails'
import { handleAddEmail, handleDeleteEmail } from '../../../utils/adminFetching'
import { getAdminEmailsExpectedResponse } from '../../../resources/mockData'

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
    match: '/admin-emails',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getAdminEmailsExpectedResponse
    }
  }
]

jest.mock('../../../utils/adminFetching', () => ({
  handleAddEmail: jest.fn(),
  handleDeleteEmail: jest.fn()
}))

describe('AdminEmails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  describe('deleting', () => {
    test('asks for confirmation before deleting', async () => {
      renderWithTheme(<AdminEmails />)
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getByText(getAdminEmailsExpectedResponse[0].email)).toBeInTheDocument()

      const deleteButton = screen.getAllByTestId('delete-btn')[0]
      fireEvent.click(deleteButton)

      expect(screen.getAllByText(/Are you sure you want to delete/i).length).toBeGreaterThan(0)

      const confirmDelete = screen.getAllByTestId('confirm')[0]
      expect(confirmDelete).toBeInTheDocument()
    })
    test('calls handleDelete on confirmation', async () => {
      renderWithTheme(<AdminEmails />)
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const deleteButton = screen.getAllByTestId('delete-btn')[0]
      fireEvent.click(deleteButton)
      const confirmDelete = screen.getAllByTestId('confirm')[0]
      fireEvent.click(confirmDelete)

      await waitFor(() => expect(handleDeleteEmail).toHaveBeenCalled())
    })
  }, 300000)

  describe('adding', () => {
    test('there is a place to add new', async () => {
      renderWithTheme(<AdminEmails showingAdminFAQs isAdmin />)
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const newInput = screen.getByLabelText(/new email/i)
      const addButton = screen.getAllByTestId('add-btn')[0]

      expect(newInput).toBeInTheDocument()
      expect(addButton).toBeInTheDocument()
    })
    test('calls handleAdd to add new successfully', async () => {
      renderWithTheme(<AdminEmails showingFacultyFAQs isAdmin />)
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const newInput = screen.getByLabelText(/new email/i)
      fireEvent.change(newInput, { target: { value: 'me@sandiego.edu' } })
      const addButton = screen.getAllByTestId('add-btn')[0]
      fireEvent.click(addButton)

      await waitFor(() => expect(handleAddEmail).toHaveBeenCalled())
    })
  })
})
