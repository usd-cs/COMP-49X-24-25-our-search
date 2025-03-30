import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ProjectEdit from '../../components/projects/ProjectEdit'
import {
  getProjectExpectedResponse, putProjectExpectedRequest,
  getResearchPeriodsExpectedResponse, getUmbrellaTopicsExpectedResponse, mockDisciplinesMajors
} from '../../resources/mockData'

// Wrap component with ThemeProvider and MemoryRouter
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/project/${getProjectExpectedResponse.id}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
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
    match: '/project',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getProjectExpectedResponse
    }
  },
  {
    match: '/project',
    method: 'PUT',
    response: {
      ok: true,
      status: 200,
      json: async () => putProjectExpectedRequest
    }
  }
]

describe('ProjectEdit', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    useParams.mockReturnValue({ id: getProjectExpectedResponse.id })
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<ProjectEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching project fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<ProjectEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while getting project details\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched project data', async () => {
    renderWithTheme(<ProjectEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByDisplayValue(getProjectExpectedResponse.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(getProjectExpectedResponse.description)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /desired qualifications/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /desired qualifications/i })).toHaveValue(getProjectExpectedResponse.desiredQualifications)
    expect(screen.getByText(getProjectExpectedResponse.umbrellaTopics[0])).toBeInTheDocument() // indexing the array at 0 because the mock data only has 1 element
    expect(screen.getByText(getProjectExpectedResponse.researchPeriods[0])).toBeInTheDocument()
    expect(screen.getByText(getProjectExpectedResponse.majors[0])).toBeInTheDocument()
  })

  it('submits updated profile successfully and shows success message', async () => {
    renderWithTheme(<ProjectEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Mock updating the project name and description
    const titleInput = screen.getByLabelText(/Project Title/i)
    userEvent.clear(titleInput)
    await userEvent.type(titleInput, putProjectExpectedRequest.title)
    const descriptionInput = screen.getByLabelText(/Research Description/i)
    await userEvent.type(descriptionInput, putProjectExpectedRequest.description)

    // Submit the form without interacting with any inactive checkbox (since active field is not used)
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Research opportunity updated successfully\./i)).toBeInTheDocument()
    })
  }, 20000) // increasing test timeout because there are a lot of fields to mock filling out

  it('displays an error message when submission fails', async () => {
    renderWithTheme(<ProjectEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Mock updating the project name and description
    const titleInput = screen.getByLabelText(/Project Title/i)
    userEvent.clear(titleInput)
    await userEvent.type(titleInput, putProjectExpectedRequest.title)
    const descriptionInput = screen.getByLabelText(/Research Description/i)
    await userEvent.type(descriptionInput, putProjectExpectedRequest.description)

    // Mock the failed submission
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('does not display submit button when fetching the profile to initially populate the form fails', async () => {
    // Mock the failed fetch
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error'
    })

    renderWithTheme(<ProjectEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.queryByRole('button', { name: /Submit/i })).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred while getting project details\. Please try again\./i)).toBeInTheDocument()
    })
  })
})
