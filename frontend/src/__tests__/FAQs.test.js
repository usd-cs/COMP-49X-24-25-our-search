import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FAQs from '../components/FAQs'
import { getAllAdminFAQsResponse, getAllFacultyFAQsResponse, getAllStudentFAQsResponse } from '../resources/mockData'
import { handleAdd, handleDelete, handleSave } from '../utils/faqFetching'
import { typeStudent } from '../resources/constants'

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
    match: '/all-student-faqs',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getAllStudentFAQsResponse
    }
  },
  {
    match: '/all-faculty-faqs',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getAllFacultyFAQsResponse
    }
  },
  {
    match: '/all-admin-faqs',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getAllAdminFAQsResponse
    }
  }
]

jest.mock('../utils/faqFetching', () => ({
  handleAdd: jest.fn(),
  handleSave: jest.fn(),
  handleDelete: jest.fn()
}))

describe('FAQs', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  describe('conditional rendering', () => {
    describe('for more than one type', () => {
      test('renders existing FAQs', async () => {
        renderWithTheme(<FAQs showingStudentFAQs showingFacultyFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.getByText(getAllStudentFAQsResponse[0].question)).toBeInTheDocument()
        expect(screen.getByText(getAllFacultyFAQsResponse[0].question)).toBeInTheDocument()
      })
    })

    describe('for students', () => {
      test('displays error message if initial fetching fails', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Internal Server Error'
        })

        renderWithTheme(<FAQs showingStudentFAQs />)

        await waitFor(() => {
          expect(screen.getByText(/Error loading/i)).toBeInTheDocument()
        })
      })
      test('renders existing FAQs', async () => {
        renderWithTheme(<FAQs showingStudentFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.getByText(getAllStudentFAQsResponse[0].question)).toBeInTheDocument()
        expect(screen.getByText(getAllStudentFAQsResponse[1].question)).toBeInTheDocument()
      })
      test('does not render existing FAQs for faculty or admin', async () => {
        renderWithTheme(<FAQs showingStudentFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.queryByText(getAllAdminFAQsResponse[0].question)).not.toBeInTheDocument()
        expect(screen.queryByText(getAllFacultyFAQsResponse[0].question)).not.toBeInTheDocument()
      })
    })

    describe('for faculty', () => {
      test('displays error message if initial fetching fails', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Internal Server Error'
        })

        renderWithTheme(<FAQs showingFacultyFAQs />)

        await waitFor(() => {
          expect(screen.getByText(/Error loading/i)).toBeInTheDocument()
        })
      })
      test('renders existing FAQs', async () => {
        renderWithTheme(<FAQs showingFacultyFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.getByText(getAllFacultyFAQsResponse[0].question)).toBeInTheDocument()
        expect(screen.getByText(getAllFacultyFAQsResponse[1].question)).toBeInTheDocument()
      })
      test('does not render existing FAQs for student or admin', async () => {
        renderWithTheme(<FAQs showingFacultyFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.queryByText(getAllAdminFAQsResponse[0].question)).not.toBeInTheDocument()
        expect(screen.queryByText(getAllStudentFAQsResponse[0].question)).not.toBeInTheDocument()
      })
    })

    describe('for admin', () => {
      test('displays error message if initial fetching fails', async () => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Internal Server Error'
        })

        renderWithTheme(<FAQs showingAdminFAQs />)

        await waitFor(() => {
          expect(screen.getByText(/Error loading/i)).toBeInTheDocument()
        })
      })
      test('renders existing FAQs', async () => {
        renderWithTheme(<FAQs showingAdminFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.getByText(getAllAdminFAQsResponse[0].question)).toBeInTheDocument()
        expect(screen.getByText(getAllAdminFAQsResponse[1].question)).toBeInTheDocument()
      })
      test('does not render existing FAQs for faculty or student', async () => {
        renderWithTheme(<FAQs showingAdminFAQs />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        expect(screen.queryByText(getAllStudentFAQsResponse[0].question)).not.toBeInTheDocument()
        expect(screen.queryByText(getAllFacultyFAQsResponse[0].question)).not.toBeInTheDocument()
      })
    })
  })

  describe('admin functions', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const deleteButton = screen.getAllByTestId('delete-btn')[0]
        fireEvent.click(deleteButton)

        expect(screen.getAllByText(/Are you sure you want to delete/i).length).toBeGreaterThan(0)

        const confirmDelete = screen.getAllByTestId('confirm')[0]
        expect(confirmDelete).toBeInTheDocument()
      })
      test('calls handleDelete on confirmation', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const deleteButton = screen.getAllByTestId('delete-btn')[0]
        fireEvent.click(deleteButton)
        const confirmDelete = screen.getAllByTestId('confirm')[0]
        fireEvent.click(confirmDelete)

        await waitFor(() => expect(handleDelete).toHaveBeenCalled())
      })
    })

    describe('editing', () => {
      test('shows edit button; shows save button after clicking edit', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const saveButton = screen.getAllByTestId('save-btn')[0]
        expect(saveButton).toBeInTheDocument()
      })
      test('shows new details after edited', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const questionInput = screen.getByDisplayValue(getAllAdminFAQsResponse[0].question)
        const answerInput = screen.getByDisplayValue(getAllAdminFAQsResponse[0].answer)
        const newQuestion = 'Mock new question'
        fireEvent.change(questionInput, { target: { value: newQuestion } })
        const newAnswer = 'Mock new answer here'
        fireEvent.change(answerInput, { target: { value: newAnswer } })

        expect(questionInput.value).toBe(newQuestion)
        expect(answerInput.value).toBe(newAnswer)
      })
      test('shows an option to cancel editing', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const cancelButton = screen.getAllByTestId('cancel-btn')[0]
        expect(cancelButton).toBeInTheDocument()
      })
      test('calls handleSave to handle edit action correctly', async () => {
        renderWithTheme(<FAQs showingStudentFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-btn')[0]
        fireEvent.click(editButton)
        const questionInput = screen.getByDisplayValue(getAllStudentFAQsResponse[0].question)
        const answerInput = screen.getByDisplayValue(getAllStudentFAQsResponse[0].answer)
        const newQuestion = 'Mock new question'
        fireEvent.change(questionInput, { target: { value: newQuestion } })
        const newAnswer = 'Mock new answer here'
        fireEvent.change(answerInput, { target: { value: newAnswer } })
        const saveButton = screen.queryAllByTestId('save-btn')[0]
        fireEvent.click(saveButton)

        await waitFor(() => expect(handleSave).toHaveBeenCalled())

        expect(screen.queryByDisplayValue(getAllStudentFAQsResponse[0].question)).not.toBeInTheDocument() // the student question has changed
      })
      test('cancels editing correctly', async () => {
        renderWithTheme(<FAQs showingStudentFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-btn')[0]
        fireEvent.click(editButton)
        const cancelButton = screen.getAllByTestId('cancel-btn')[0]
        fireEvent.click(cancelButton)

        // save no longer shows after cancelling
        expect(screen.queryByTestId('save-btn')).not.toBeInTheDocument()
      })
    })

    describe('adding', () => {
      test('there is a place to add new', async () => {
        renderWithTheme(<FAQs showingAdminFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const newQuestionInput = screen.getByLabelText(/new question/i)
        const newAnswerInput = screen.getByLabelText(/new answer/i)
        const addButton = screen.getAllByTestId('add-btn')[0]

        expect(newQuestionInput).toBeInTheDocument()
        expect(newAnswerInput).toBeInTheDocument()
        expect(addButton).toBeInTheDocument()
      })
      test('calls handleAdd to add new successfully', async () => {
        renderWithTheme(<FAQs showingFacultyFAQs isAdmin />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const newQuestionInput = screen.getByLabelText(/new question/i)
        const newAnswerInput = screen.getByLabelText(/new answer/i)
        fireEvent.change(newQuestionInput, { target: { value: 'New question here' } })
        fireEvent.change(newAnswerInput, { target: { value: 'New answer here' } })
        const addButton = screen.getAllByTestId('add-btn')[0]
        fireEvent.click(addButton)

        await waitFor(() => expect(handleAdd).toHaveBeenCalled())
      })
    })
  })
})
