import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ManageVariables from '../../components/admin/ManageVariables'
import {
  getDepartmentsExpectedResponse,
  getResearchPeriodsExpectedResponse,
  getUmbrellaTopicsExpectedResponse,
  mockDisciplinesMajors,
  deleteDepartmentExpectedRequest,
  deleteResearchPeriodExpectedRequest,
  deleteUmbrellaTopicExpectedRequest,
  deleteDisciplineExpectedRequest,
  deleteMajorExpectedRequest,
  putDepartmentExpectedRequest,
  putResearchPeriodExpectedRequest,
  putUmbrellaTopicExpectedRequest,
  putDisciplineExpectedRequest
} from '../../resources/mockData'

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
    match: '/research-periods',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getResearchPeriodsExpectedResponse
    }
  },
  {
    match: '/disciplines',
    method: 'GET',
    response: {
      ok: true,
      json: async () => mockDisciplinesMajors
    }
  },
  {
    match: '/umbrella-topics',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getUmbrellaTopicsExpectedResponse
    }
  },
  {
    match: '/departments',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getDepartmentsExpectedResponse
    }
  },
  {
    match: '/disciplines',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => mockDisciplinesMajors
    }
  }
]

describe('ManageVariables', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  // test('shows loading spinner initially', async () => {
  //   renderWithTheme(<ManageVariables />)
  //   expect(await screen.findByTestId('initial-loading')).toBeInTheDocument()
  // }) // TODO

  test('shows some instructions for what the page is for', async () => {
    renderWithTheme(<ManageVariables />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
    // TODO
  })

  test('clicking "back" navigates back to posts page', async () => {
    renderWithTheme(<ManageVariables />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  test('displays error message if initial fetching of app variables fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)

    await waitFor(() => {
      expect(
        screen.getByText(/Error loading disciplines and majors. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  describe('conditional rendering when it loads up', () => {
    test('renders existing departments because showingDepartments = true', async () => {

    })
    test('renders existing disciplines and majors because showingDisciplinesMajors = true', async () => {
      renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getAllByText(mockDisciplinesMajors[0].name).length).toBeGreaterThan(0)
      expect(screen.getAllByText(mockDisciplinesMajors[0].majors[0].name).length).toBeGreaterThan(0)
    })
    test('renders existing umbrella topics because showingUmbrellaTopics = true', async () => {

    })
    test('renders existing research periods because showingResearchPeriods = true', async () => {

    })
    test('does not show departments when showingDepartments = false', async () => {

    })
    test('does not show disciplines or majors when showingDisciplinesMajors = false', async () => {

    })
    test('does not show umbrella topics when showingUmbrellaTopics = false', async () => {

    })
    test('does not show research periods when showingResearchPeriods = false', async () => {

    })
  })

  describe('handling departments', () => {

  })

  describe('handling research periods', () => {

  })

  describe('handling umbrella topics', () => {

  })

  describe('handling disciplines', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const deleteButton = screen.getAllByTestId('delete-discipline-btn')[0]
        fireEvent.click(deleteButton)

        expect(screen.getAllByText(/Are you sure you want to delete/i).length).toBeGreaterThan(0)

        const confirmDelete = screen.getAllByTestId('confirm')[0]
        expect(confirmDelete).toBeInTheDocument()
      })
    })
    describe('editing', () => {
      test('shows edit button; shows save button after clicking edit', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-discipline-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const saveButton = screen.getAllByTestId('save-discipline-btn')[0]
        expect(saveButton).toBeInTheDocument()
      })
      test('shows new details after edited', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-discipline-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const discNameInput = screen.getByDisplayValue(mockDisciplinesMajors[0].name)
        expect(discNameInput).toBeInTheDocument()

        const newName = 'New Name'
        fireEvent.change(discNameInput, { target: { value: newName } })

        expect(discNameInput.value).toBe(newName)
      })
      test('shows an option to cancel editing', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-discipline-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const cancelButton = screen.getAllByTestId('cancel-discipline-btn')[0]
        expect(cancelButton).toBeInTheDocument()
      })
    })
    describe('adding new', () => {
      test('there is a place to add new', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const newDiscInput = screen.getByLabelText(/new discipline name/i)
        const addButton = screen.getAllByTestId('add-discipline-btn')[0]

        expect(newDiscInput).toBeInTheDocument()
        expect(addButton).toBeInTheDocument()
      })
    })
  })

  describe('handling majors', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const deleteButton = screen.getAllByTestId('delete-major-btn')[0]
        fireEvent.click(deleteButton)

        expect(screen.getAllByText(/Are you sure you want to delete/i).length).toBeGreaterThan(0)

        const confirmDelete = screen.getAllByTestId('confirm')[0]
        expect(confirmDelete).toBeInTheDocument()
      })
    })
    describe('editing', () => {
      test('shows edit button; shows save button after clicking edit', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-major-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const saveButton = screen.getAllByTestId('save-major-btn')[0]
        expect(saveButton).toBeInTheDocument()
      })
      test('shows the edited major details after editing', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-major-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const majorNameInput = screen.getByDisplayValue(mockDisciplinesMajors[0].majors[0].name)
        expect(majorNameInput).toBeInTheDocument()

        const newName = 'New Name'
        fireEvent.change(majorNameInput, { target: { value: newName } })

        expect(majorNameInput.value).toBe(newName)
      })
      test('shows an option to cancel editing', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const editButton = screen.getAllByTestId('edit-major-btn')[0]
        expect(editButton).toBeInTheDocument()
        fireEvent.click(editButton)

        const cancelButton = screen.getAllByTestId('cancel-major-btn')[0]
        expect(cancelButton).toBeInTheDocument()
      })
    })
    describe('adding new', () => {
      test('there is a place to add new', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const newMajorInput = screen.getByLabelText(/new major name/i)
        const addButton = screen.getAllByTestId('add-major-btn')[0]
        const disciplineDropdown = screen.getByTestId('new-discipline-autocomplete')

        expect(disciplineDropdown).toBeInTheDocument()
        expect(newMajorInput).toBeInTheDocument()
        expect(addButton).toBeInTheDocument()
      })
      test('cannot add if not associated with a discipline', async () => {
        renderWithTheme(<ManageVariables showingDisciplinesAndMajors />)
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const newMajorInput = screen.getByLabelText(/new major name/i)
        const addButton = screen.getAllByTestId('add-major-btn')[0]

        fireEvent.change(newMajorInput, { target: { value: 'Artificial Intelligence' } })
        fireEvent.click(addButton)

        expect(screen.getByText(/error adding major/i)).toBeInTheDocument()
      })
    })
  })
})
