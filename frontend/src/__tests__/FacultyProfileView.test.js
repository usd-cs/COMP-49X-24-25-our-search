import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacultyProfileView from '../components/FacultyProfileView'

describe('FacultyProfileView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading spinner initially', () => {
    render(<FacultyProfileView />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    render(<FacultyProfileView />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('displays profile data when fetch is successful', async () => {
    const dummyProfile = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      department: ['Computer Science', 'Mathematics']
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => dummyProfile
    })

    render(<FacultyProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Check header and profile fields
    expect(screen.getByRole('heading', { name: /Faculty Profile/i })).toBeInTheDocument()
    expect(screen.getByText(/Dr\. John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/john\.doe@example\.com/)).toBeInTheDocument()
    expect(screen.getByText(/Computer Science, Mathematics/)).toBeInTheDocument()

    // Check the existence of Back and Edit Profile buttons
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
  })

  it('displays "No profile found." when profile is null', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => null
    })

    render(<FacultyProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/No profile found\./i)).toBeInTheDocument()
    })
  })
})
