import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ResearchOpportunityForm from '../components/ResearchOpportunityForm'
import { createProjectExpectedRequest, mockDisciplinesMajors } from '../resources/mockData'

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
    match: '/disciplines',
    response: {
      ok: true,
      status: 201,
      json: async () => mockDisciplinesMajors
    }
  },
  {
    match: '/umbrella-topics',
    response: {
      ok: true,
      status: 201,
      json: async () => [
        { id: 1, name: 'topic 1' },
        { id: 2, name: 'AI' }
      ]
    }
  },
  {
    match: '/create-project',
    response: {
      ok: true,
      status: 201,
      json: async () => (createProjectExpectedRequest)
    }
  }
]

describe('ResearchOpportunityForm', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<ResearchOpportunityForm />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to /posts page when back button is clicked', async () => {
    renderWithTheme(<ResearchOpportunityForm />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  it('submits updated project successfully and shows success message', async () => {
    renderWithTheme(<ResearchOpportunityForm />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Fill out the title.
    const titleInput = screen.getByLabelText(/Project Title/i)
    await userEvent.type(titleInput, 'Test Opportunity Title')

    // Fill out the description.
    const descriptionInput = screen.getByLabelText(/Research Description/i)
    await userEvent.type(
      descriptionInput,
      'This is a test description for the research opportunity.'
    )

    // Fill out Research Fields / Majors.
    // const disciplineSelect = screen.getByLabelText(mockDisciplinesMajors[0].name)
    const disciplineSelect = screen.getByLabelText('Engineering, Math, and Life Sciences') // or
    await userEvent.click(disciplineSelect)
    const majorOption = await screen.findByRole('option', { name: mockDisciplinesMajors[0].majors[0].name })
    await userEvent.click(majorOption)

    // Fill out Umbrella Topics.
    const umbrellaTopicsSelect = screen.getByLabelText(/Umbrella Topics/i)
    await userEvent.click(umbrellaTopicsSelect)
    const umbrellaOption = await screen.findByRole('option', { name: 'AI' })
    await userEvent.click(umbrellaOption)

    // Add research period.
    const periodSelect = screen.getByLabelText(/Research Periods/i)
    await userEvent.click(periodSelect)
    const semesterOption = await screen.findByRole('option', { name: 'Fall 2025' })
    await userEvent.click(semesterOption)

    // Submit form
    const submitButton = screen.getByLabelText('submit-button')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Research opportunity created successfully. It has been saved as inactive./i)).toBeInTheDocument()
    })

    // Verify fetch was called with '/create-project'
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/create-project'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Object),
          body: expect.any(String)
        })
      )
    })
  })
})
