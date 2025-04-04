import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PostsLayout from '../../components/posts/PostsLayout'
import { mockResearchOps, mockStudents, getAllFacultyExpectedResponse } from '../../resources/mockData'
import { fetchFacultyUrl, fetchProjectsUrl, fetchStudentsUrl } from '../../resources/constants'
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
jest.mock('../../components/posts/MainAccordion', () => (props) => {
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

describe('PostsLayout', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    fetch.mockClear()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  describe('when user is student', () => {
    test('fetches projects when it renders', async () => {
      renderWithTheme(
        <PostsLayout
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
    test('passes correct props to MainAccordion', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent
          isFaculty={false}
          isAdmin={false}
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const accordionProps = JSON.parse(screen.getByTestId('main-accordion').textContent)
      expect(accordionProps.isStudent).toBe(true)
      expect(accordionProps.isFaculty).toBe(false)
      expect(accordionProps.isAdmin).toBe(false)
      expect(accordionProps.postings).toEqual(mockResearchOps)
    })
  })

  describe('when user is faculty', () => {
    test('renders buttons to toggle between students/projects', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getByTestId('students-btn')).toBeInTheDocument()
      expect(screen.getByTestId('projects-btn')).toBeInTheDocument()
    })
    test('fetches students when it renders', async () => {
      renderWithTheme(
        <PostsLayout
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
    test('clicking "other projects" button fetches projects', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty
          isAdmin={false}
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const projectsButton = screen.getByTestId('projects-btn')
      fireEvent.click(projectsButton)

      expect(fetch).toHaveBeenCalledWith(fetchProjectsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    })
  })

  describe('when user is admin', () => {
    test('renders buttons to toggle between students/projects/faculty', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getByTestId('students-btn')).toBeInTheDocument()
      expect(screen.getByTestId('projects-btn')).toBeInTheDocument()
      expect(screen.getByTestId('faculty-btn')).toBeInTheDocument()
    })
    test('renders button to manage app variables', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getByTestId('manage-vars-btn')).toBeInTheDocument()
    })
    test('renders button to manage app email notifications', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      expect(screen.getByTestId('manage-emails-btn')).toBeInTheDocument()
    })
    test('clicking button to manage vars sends to new page', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const adminButton = screen.getByTestId('manage-vars-btn')
      fireEvent.click(adminButton)

      expect(mockNavigate).toHaveBeenCalledWith('/disciplines-and-majors')
    })
    test('clicking button manage app email notifications sends to new page', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
        />
      )
      await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

      const adminButton = screen.getByTestId('manage-emails-btn')
      fireEvent.click(adminButton)

      expect(mockNavigate).toHaveBeenCalledWith('/email-notifications')
    })
    test('fetches students when it renders', async () => {
      renderWithTheme(
        <PostsLayout
          isStudent={false}
          isFaculty={false}
          isAdmin
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
      test('clicking "projects" button fetches projects', async () => {
        renderWithTheme(
          <PostsLayout
            isStudent={false}
            isFaculty={false}
            isAdmin
          />
        )
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const projectsButton = screen.getByTestId('projects-btn')
        fireEvent.click(projectsButton)

        expect(fetch).toHaveBeenCalledWith(fetchProjectsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
      })
    })
    describe('admin viewing students', () => {
      test('clicking "students" button fetches students', async () => {
        renderWithTheme(
          <PostsLayout
            isStudent={false}
            isFaculty={false}
            isAdmin
          />
        )
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const projectsButton = screen.getByTestId('students-btn')
        fireEvent.click(projectsButton)

        expect(fetch).toHaveBeenCalledWith(fetchStudentsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
      })
    })
    describe('admin viewing faculty', () => {
      test('clicking "faculty" button fetches faculty', async () => {
        renderWithTheme(
          <PostsLayout
            isStudent={false}
            isFaculty={false}
            isAdmin
          />
        )
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

        const projectsButton = screen.getByTestId('faculty-btn')
        fireEvent.click(projectsButton)

        expect(fetch).toHaveBeenCalledWith(fetchFacultyUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
      })
    })
  })
})
