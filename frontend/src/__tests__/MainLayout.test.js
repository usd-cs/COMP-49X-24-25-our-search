import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MainLayout from '../components/MainLayout'
import { mockResearchOps, mockStudents, getAllFacultyExpectedResponse } from '../resources/mockData'
import { appTitle, fetchProjectsUrl, fetchStudentsUrl } from '../resources/constants'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate } from 'react-router-dom'

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

// Mock MainAccordion to capture its props for testing
jest.mock('../components/MainAccordion', () => (props) => {
  return <div data-testid='main-accordion'>{JSON.stringify(props)}</div>
})

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
    match: '/all-projects',
    response: {
      ok: true,
      json: async () => mockResearchOps
    }
  },
  {
    match: '/all-students',
    response: {
      ok: true,
      status: 200,
      json: async () => mockStudents
    }
  },
  {
    match: '/all-faculty',
    response: {
      ok: true,
      status: 200,
      json: async () => getAllFacultyExpectedResponse
    }
  }
]

describe('MainLayout', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    fetch.mockClear()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  test('renders app title', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps)

    renderWithTheme(
      <MainLayout
        isStudent
        isFaculty={false}
        isAdmin={false}
        fetchPostings={mockFetchPostings}
      />
    )

    await waitFor(() => {
      const title = screen.getByRole('button', { name: appTitle })
      expect(title).toBeInTheDocument()
    })
  })

  test('renders search bar', () => {
    // TODO in later sprints
  })

  test('renders sidebar', () => {
    // TODO in later sprints
  })

  test('passes correct props to MainAccordion', async () => {
    renderWithTheme(
      <MainLayout
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )

    const accordionProps = JSON.parse(screen.getByTestId('main-accordion').textContent)
    expect(accordionProps.isStudent).toBe(true)
    expect(accordionProps.isFaculty).toBe(false)
    expect(accordionProps.isAdmin).toBe(false)
  })

  describe('when user is student', () => {
    test('fetches projects when it renders', async () => {
      renderWithTheme(
        <MainLayout
          isStudent
          isFaculty={false}
          isAdmin={false}
        />
      )
      expect(fetch).toHaveBeenCalledWith(fetchProjectsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    })
    test('renders view profile button for student', async () => {
      renderWithTheme(
        <MainLayout
          isStudent
          isFaculty={false}
          isAdmin={false}
        />
      )
  
      const button = screen.getByRole('button', { name: /student/i }) || screen.getByTestId('student-profile-button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('when user is faculty', () => {
    test('renders view profile button for faculty', () => {
      renderWithTheme(
        <MainLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
  
      const button = screen.getByRole('button', { name: /faculty/i }) || screen.getByTestId('faculty-profile-button')
      expect(button).toBeInTheDocument()
    })
    test('renders buttons to toggle between students/projects', async () => {
      renderWithTheme(
        <MainLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
      
      expect(screen.getByText(/Students/)).toBeInTheDocument()
      expect(screen.getByText(/other projects/i)).toBeInTheDocument()
    })
    test('fetches students when it renders', async () => {
      renderWithTheme(
        <MainLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
      expect(fetch).toHaveBeenCalledWith(fetchStudentsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    })
  })

  describe('when user is admin', () => {
    test('renders view profile button for admin', () => {
      renderWithTheme(
        <MainLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
  
      const button = screen.getByRole('button', { name: /admin/i }) || screen.getByTestId('admin-profile-button')
      expect(button).toBeInTheDocument()
    })
    test('renders buttons to toggle between students/projects/faculty', () => {
      // TODO
    })
    test('fetches students when it renders', async () => {
      renderWithTheme(
        <MainLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
      expect(fetch).toHaveBeenCalledWith(fetchStudentsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    })
    describe('admin viewing projects', () => {
    // TODO
    })
    describe('admin viewing students', () => {
    // TODO
    })
    describe('admin viewing faculty', () => {
    // TODO
    })
  })

})
