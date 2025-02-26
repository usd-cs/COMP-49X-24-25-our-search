/* eslint-env jest */
/**
 * StudentProfileView.test.js
 *
 * This file has the tests for the StudentProfileView component.
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import StudentProfileView from '../components/StudentProfileView'

describe('StudentProfileView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading spinner initially', () => {
    render(<StudentProfileView />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays an error message when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    render(<StudentProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/Error: Internal Server Error/i)).toBeInTheDocument()
    })
  })

  it('displays profile data when fetch is successful', async () => {
    const dummyProfile = {
      name: 'Jane Doe',
      graduationYear: '2025',
      major: ['Computer Science'],
      classStatus: 'Senior',
      researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
      researchPeriodsInterest: ['Fall 2024'],
      interestReason: 'I want to gain research experience.',
      hasPriorExperience: 'yes'
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => dummyProfile
    })

    render(<StudentProfileView />)

    
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByRole('heading', { name: /Student Profile/i })).toBeInTheDocument()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.getByText(/Computer Science/)).toBeInTheDocument()
    expect(screen.getByText(/Senior/)).toBeInTheDocument()
    expect(screen.getByText(/Artificial Intelligence, Data Science/)).toBeInTheDocument()
    expect(screen.getByText(/Fall 2024/)).toBeInTheDocument()
    expect(screen.getByText(/I want to gain research experience\./i)).toBeInTheDocument()
    expect(screen.getByText(/Yes/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
  })

  it('displays "No profile found." when profile is null', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => null
    })

    render(<StudentProfileView />)
    await waitFor(() =>
      expect(screen.getByText(/No profile found\./i)).toBeInTheDocument()
    )
  })
})
