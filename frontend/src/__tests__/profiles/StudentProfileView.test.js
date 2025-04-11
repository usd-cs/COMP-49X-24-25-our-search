import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import StudentProfileView from '../../components/profiles/StudentProfileView'
import MemoryRouter from 'react-router-dom'

const mockedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}))

jest.mock('../../resources/constants', () => ({
  BACKEND_URL: 'http://localhost:8080'
}))

const mockProfileData = {
  firstName: 'Jane',
  lastName: 'Doe',
  graduationYear: '2025',
  majors: ['Computer Science', 'Mathematics'],
  classStatus: 'Junior',
  researchFieldInterests: ['Machine Learning', 'Computer Vision'],
  researchPeriodsInterest: ['Summer 2025', 'Fall 2025'],
  interestReason: 'I am interested in exploring the applications of AI in healthcare.',
  hasPriorExperience: true,
  isActive: true
}

const emptyStudentProfile = {
  firstName: '',
  lastName: '',
  graduationYear: '',
  majors: [],
  classStatus: '',
  researchFieldInterests: [],
  researchPeriodsInterest: [],
  interestReason: '',
  hasPriorExperience: 'no',
  isActive: false
}

global.fetch = jest.fn()

describe('Styled StudentProfileView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('displays loading state with proper styling', () => {
    global.fetch.mockImplementationOnce(() => new Promise(() => {}))

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  test('navigates back when back button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const backButton = screen.getByTestId('ArrowBackIcon').closest('button')
    fireEvent.click(backButton)

    expect(mockedNavigate).toHaveBeenCalledWith('/posts')
  })

  test('displays student profile data correctly with appropriate sections', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByText('Academic Information')).toBeInTheDocument()
    expect(screen.getByText('Research Interests')).toBeInTheDocument()
    expect(screen.getByText('Research Interest Statement')).toBeInTheDocument()

    expect(screen.getByText('Profile Status:')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()

    expect(screen.getByText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Expected Graduation')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('Class Standing')).toBeInTheDocument()
    expect(screen.getByText('Junior')).toBeInTheDocument()
    expect(screen.getByText('Prior Research Experience')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()

    expect(screen.getByText('Research Fields')).toBeInTheDocument()
    expect(screen.getByText('Machine Learning')).toBeInTheDocument()
    expect(screen.getByText('Computer Vision')).toBeInTheDocument()

    expect(screen.getByText('Availability')).toBeInTheDocument()
    expect(screen.getByText('Summer 2025')).toBeInTheDocument()
    expect(screen.getByText('Fall 2025')).toBeInTheDocument()

    expect(screen.getByText('I am interested in exploring the applications of AI in healthcare.')).toBeInTheDocument()
  })

  test('navigates to edit profile page when edit button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const editButton = screen.getByRole('button', { name: /edit profile/i })
    fireEvent.click(editButton)

    expect(mockedNavigate).toHaveBeenCalledWith('/edit-student-profile')
  })

  test('opens delete confirmation dialog when delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const deleteButton = screen.getByRole('button', { name: /delete profile/i })
    fireEvent.click(deleteButton)

    expect(deleteButton).toBeInTheDocument()
  })

  test('displays error message with alert styling when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const errorMessage = screen.getByText('An unexpected error occurred. Please try again.')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument()
  })

  test('displays empty state with Create Profile button when no profile exists', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...emptyStudentProfile })
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByText('No profile found. Please create a new profile.')).toBeInTheDocument()

    const createButton = screen.getByRole('button', { name: /create profile/i })
    expect(createButton).toBeInTheDocument()

    fireEvent.click(createButton)
    expect(mockedNavigate).toHaveBeenCalledWith('/edit-student-profile')
  })

  test('applies Tailwind-inspired styling to chips', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const majorChips = screen.getAllByText(/(Computer Science|Mathematics)/)
    expect(majorChips.length).toBe(2)

    const fieldChips = screen.getAllByText(/(Machine Learning|Computer Vision)/)
    expect(fieldChips.length).toBe(2)

    const periodChips = screen.getAllByText(/(Summer 2025|Fall 2025)/)
    expect(periodChips.length).toBe(2)
  })

  test('handles profile deletion successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    const oldWindowLocation = window.location
    delete window.location
    window.location = { href: jest.fn() }

    render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    global.fetch.mockResolvedValueOnce({
      ok: true
    })

    const deleteButton = screen.getByRole('button', { name: /delete profile/i })
    fireEvent.click(deleteButton)

    window.location = oldWindowLocation
  })

  test('renders responsive layout with appropriate grid structure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData
    })

    const { container } = render(
      <MemoryRouter>
        <StudentProfileView />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(container.querySelector('[class*="MuiContainer-root"]')).toBeInTheDocument()

    expect(container.querySelectorAll('[class*="MuiGrid-root"]').length).toBeGreaterThan(0)

    expect(container.querySelectorAll('[class*="MuiCard-root"]').length).toBeGreaterThan(0)
  })
})
