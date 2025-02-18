import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MainLayout from '../components/MainLayout'
import { mockResearchOps } from '../resources/mockData'
import { appTitle } from '../resources/constants'

describe('MainLayout', () => {
  test('calls fetchPostings when it renders', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps) // Mocking the function to resolve with an empty array

    render(<MainLayout isStudent isFaculty={false} isAdmin={false} fetchPostings={mockFetchPostings} />)

    await waitFor(() => {
      expect(mockFetchPostings).toHaveBeenCalledWith(true, false, false) // Verify the mock function was called with correct argument
    })
  })

  test('renders app title', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps)

    render(<MainLayout isStudent isFaculty={false} isAdmin={false} fetchPostings={mockFetchPostings} />)

    await waitFor(() => {
      const title = screen.getByRole('button', { name: appTitle })
      expect(title).toBeInTheDocument()
    })
  })

  test('renders search bar', () => {
    // Todo in later sprints
  })

  test('renders view profile button', () => {
    // Todo in later sprints
  })

  test('renders sidebar', () => {
    // Todo in later sprints
  })
})
