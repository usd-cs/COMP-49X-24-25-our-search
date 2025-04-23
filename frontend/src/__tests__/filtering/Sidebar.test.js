import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Sidebar from '../../components/filtering/Sidebar'
import { getMajorsExpectedResponse, getUmbrellaTopicsExpectedResponse, getResearchPeriodsExpectedResponse } from '../../resources/mockData'
import { viewProjectsFlag, viewStudentsFlag } from '../../resources/constants'

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
    match: '/umbrella-topics',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getUmbrellaTopicsExpectedResponse
    }
  },
  {
    match: '/majors',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getMajorsExpectedResponse
    }
  }
]

describe('SideBar', () => {
  const mockNavigate = jest.fn()
  const mockToggleDrawer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  test('renders umbrella topics, majors, and research periods filter options for projects view', async () => {
    renderWithTheme(<Sidebar drawerWidth={250} iconColor='#0189ce' postsView={viewProjectsFlag} toggleDrawer={mockToggleDrawer} />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    getMajorsExpectedResponse.forEach((major) => {
      expect(screen.getByText(major.name)).toBeInTheDocument()
    })
    getUmbrellaTopicsExpectedResponse.forEach((topic) => {
      expect(screen.getByText(topic.name)).toBeInTheDocument()
    })
    getResearchPeriodsExpectedResponse.forEach((period) => {
      expect(screen.getByText(period.name)).toBeInTheDocument()
    })
  })

  test('does not show umbrella topics filter options for students view', async () => {
    renderWithTheme(<Sidebar drawerWidth={250} iconColor='#0189ce' postsView={viewStudentsFlag} toggleDrawer={mockToggleDrawer} />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.queryByText(getUmbrellaTopicsExpectedResponse[0].name)).not.toBeInTheDocument()
  })

  test('renders majors and research periods filter options for projects view', async () => {
    renderWithTheme(<Sidebar drawerWidth={250} iconColor='#0189ce' postsView={viewProjectsFlag} toggleDrawer={mockToggleDrawer} />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    getMajorsExpectedResponse.forEach((major) => {
      expect(screen.getByText(major.name)).toBeInTheDocument()
    })
    getResearchPeriodsExpectedResponse.forEach((period) => {
      expect(screen.getByText(period.name)).toBeInTheDocument()
    })
  })

  test('clicking apply adds the filters to the url params', async () => {
    renderWithTheme(<Sidebar drawerWidth={250} iconColor='#0189ce' postsView={viewProjectsFlag} toggleDrawer={mockToggleDrawer} />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Click the first Major checkbox
    const majorCheckbox = screen.getByLabelText(getMajorsExpectedResponse[0].name) // adjust this to match actual label
    fireEvent.click(majorCheckbox)

    // Click the first Research Period checkbox
    const researchPeriodCheckbox = screen.getByLabelText(getResearchPeriodsExpectedResponse[0].name) // adjust this to match actual label
    fireEvent.click(researchPeriodCheckbox)

    // Click Apply button
    fireEvent.click(screen.getByText(/Apply/i))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })

    const calledWith = mockNavigate.mock.calls[0][0]
    const params = new URLSearchParams(calledWith.split('?')[1])
    expect(params.has('majors')).toBe(true)
    expect(params.has('researchPeriods')).toBe(true)
  })

  test('clicking reset clears all the url params and the filter checkboxes', async () => {
    renderWithTheme(<Sidebar drawerWidth={250} iconColor='#0189ce' postsView={viewStudentsFlag} toggleDrawer={mockToggleDrawer} />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const majorCheckbox = screen.getByLabelText(getMajorsExpectedResponse[0].name)
    fireEvent.click(majorCheckbox)

    fireEvent.click(screen.getByText(/reset/i))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })

    const params = new URLSearchParams(window.location.search)
    expect(params.has('majors')).toBe(false)
    expect(params.has('researchPeriods')).toBe(false)
    expect(params.has('umbrellaTopics')).toBe(false)

    expect(majorCheckbox).not.toBeChecked()
  })
})
