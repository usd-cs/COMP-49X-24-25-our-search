import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
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

  test('shows loading spinner initially', async () => {

  })

  test('shows some instructions for what the page is for', async () => {

  })

  test('clicking "back" navigates back to posts page', async () => {

  })

  test('displays error message if initial fetching of app variables fails', async () => {

  })

  describe('conditional rendering when it loads up', () => {
    test('renders existing departments because showingDepartments = true', async () => {

    })
    test('renders existing disciplines and majors because showingDisciplinesMajors = true', async () => {

    })
    test('renders existing departments because showingUmbrellaTopics = true', async () => {

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
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {

      })
      test('shows error message if the resource cannot be deleted', async () => {

      })
      test('shows success message when deleted', async () => {

      })
    })
    describe('editting', () => {
      test('shows error message if the request to edit fails', async () => {

      })
      test('shows success message when editted', async () => {

      })
    })
    describe('adding new', () => {
      test('shows error message if the request fails', async () => {

      })
      test('shows success message when added', async () => {

      })
    })
  })

  describe('handling research periods', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {

      })
      test('shows error message if the resource cannot be deleted', async () => {

      })
      test('shows success message when deleted', async () => {

      })
    })
    describe('editting', () => {
      test('shows error message if the request to edit fails', async () => {

      })
      test('shows success message when editted', async () => {

      })
    })
    describe('adding new', () => {
      test('shows error message if the request fails', async () => {

      })
      test('shows success message when added', async () => {

      })
    })
  })

  describe('handling umbrella topics', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {

      })
      test('shows error message if the resource cannot be deleted', async () => {

      })
      test('shows success message when deleted', async () => {

      })
    })
    describe('editting', () => {
      test('shows error message if the request to edit fails', async () => {

      })
      test('shows success message when editted', async () => {

      })
    })
    describe('adding new', () => {
      test('shows error message if the request fails', async () => {

      })
      test('shows success message when added', async () => {

      })
    })
  })

  describe('handling disciplines', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {

      })
      test('shows error message if the resource cannot be deleted', async () => {

      })
      test('shows success message when deleted', async () => {

      })
    })
    describe('editting', () => {
      test('shows error message if the request to edit fails', async () => {

      })
      test('shows success message when editted', async () => {

      })
    })
    describe('adding new', () => {
      test('shows error message if the request fails', async () => {

      })
      test('shows success message when added', async () => {

      })
    })
  })

  describe('handling majors', () => {
    describe('deleting', () => {
      test('asks for confirmation before deleting', async () => {

      })
      test('shows error message if the resource cannot be deleted', async () => {

      })
      test('shows success message when deleted', async () => {

      })
    })
    describe('editting', () => {
      test('shows error message if the request to edit fails', async () => {

      })
      test('shows success message when editted', async () => {

      })
    })
    describe('adding new', () => {
      test('cannot add if not associated with a discipline', async () => {

      })
      test('shows error message if the request fails', async () => {

      })
      test('shows success message when added', async () => {

      })
    })
  })
})
