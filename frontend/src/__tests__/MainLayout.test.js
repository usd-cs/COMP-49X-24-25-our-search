import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MainLayout from '../components/MainLayout'
import { mockResearchOps } from '../resources/mockData'
import { appTitle, fetchProjectsUrl } from '../resources/constants'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

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

// const fetchHandlers = [
//   {
//     match: '/all-projects',
//     response: {
//       ok: true,
//       json: async () => 
//     }
//   },
//   {
//     match: '/all-students',
//     response: {
//       ok: true,
//       status: 200,
//       json: async () => 
//     }
//   },
//   {
//     match: '/all-faculty',
//     response: {
//       ok: true,
//       status: 200,
//       json: async () => 
//     }
//   }
// ]

describe('MainLayout', () => {
  beforeEach(() => {
    // Clear mocks before each test
    fetch.mockClear()
  })

  test('calls fetchPostings when it renders', async () => {
    // Mocking a successful fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResearchOps)
    })

    renderWithTheme(
      <MainLayout
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    expect(fetch).toHaveBeenCalledWith(fetchProjectsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
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
    // Todo in later sprints
  })

  test('renders view profile button for student', () => {
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

  test('renders sidebar', () => {
    // Todo in later sprints
  })

  // New test: verifies that MainAccordion receives the correct props from MainLayout
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
})
