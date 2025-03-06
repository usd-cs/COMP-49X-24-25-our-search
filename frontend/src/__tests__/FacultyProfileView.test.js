import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import FacultyProfileView from '../components/FacultyProfileView'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { mockThreeActiveProjects } from '../resources/mockData'

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

const dummyProfile = {
  firstName: 'Dr. John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  department: [{id:1, name:'Computer Science'}, {id:2,name:'Mathematics'}],
  projects: mockThreeActiveProjects
}

describe('FacultyProfileView', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<FacultyProfileView />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('navigates to /edit-professor-profile page when edit button is clicked', async () => {
    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /edit profile/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/edit-professor-profile')
  })

  it('navigates to /posts page when back button is clicked', async () => {
    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  it('navigates to /create-project page when create button is clicked', async () => {
    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /create new project/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/create-project')
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('displays profile data when fetch is successful', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => dummyProfile
    })

    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Check header and profile fields
    expect(screen.getByRole('heading', { name: /Faculty Profile/i })).toBeInTheDocument()
    expect(screen.getByText(/Dr\. John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/john\.doe@example\.com/)).toBeInTheDocument()
    expect(screen.getByText(/Computer Science, Mathematics/)).toBeInTheDocument()

    // Check the existence of Back and Edit Profile buttons
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()

    // Check the existence of projects post list
    expect(screen.getByText(/Post A/i)).toBeInTheDocument()
    expect(screen.getByText(/Post B/i)).toBeInTheDocument()
    expect(screen.getByText(/Chemistry/i)).toBeInTheDocument()
  })

  it('displays "No profile found." when profile is empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({})
    })
    
    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/No profile found\./i)).toBeInTheDocument()
    })
  })
})

describe('FacultyProfileView - Delete Profile', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    global.fetch = jest.fn()
  })

  it('shows the delete profile button', async () => {
    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const deleteButton = screen.getByRole('button', { name: /delete profile/i })
    expect(deleteButton).toBeInTheDocument()
  })

  it('shows confirmation dialog when delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => dummyProfile })

    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('sends DELETE request on confirmation', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => dummyProfile })

    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/facultyProfiles/current'),
      expect.objectContaining({ method: 'DELETE' })
    ))
  })

  it('displays error message if DELETE request fails', async () => {
    global.fetch
      .mockResolvedValueOnce({ // Mock the profile fetch call
        ok: true,
        json: async () => dummyProfile
      })
      .mockResolvedValueOnce({ // Mock the DELETE request failure
        ok: false,
        statusText: 'Failed to delete'
      })

    renderWithTheme(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    // Ensure the DELETE request was made
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/facultyProfiles/current'),
      expect.objectContaining({ method: 'DELETE', credentials: 'include' })
    ))

    const failureNotices = screen.getAllByText(/Failed to delete profile\. Please try again\./i)
    expect(failureNotices).toHaveLength(2)
  })
})
