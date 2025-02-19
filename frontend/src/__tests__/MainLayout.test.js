import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MainLayout from '../components/MainLayout'
import { mockResearchOps } from '../resources/mockData'
import { appTitle } from '../resources/constants'

// Mock MainAccordion to capture its props for testing
jest.mock('../components/MainAccordion', () => (props) => {
  return <div data-testid='main-accordion'>{JSON.stringify(props)}</div>
})

describe('MainLayout', () => {
  test('calls fetchPostings when it renders', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps) // Mocking the function to resolve with an array

    render(
      <MainLayout
        isStudent
        isFaculty={false}
        isAdmin={false}
        fetchPostings={mockFetchPostings}
      />
    )

    await waitFor(() => {
      expect(mockFetchPostings).toHaveBeenCalledWith(true, false, false) // Verify the mock function was called with the correct arguments
    })
  })

  test('renders app title', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps)

    render(
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

  test('renders view profile button', () => {
    // Todo in later sprints
  })

  test('renders sidebar', () => {
    // Todo in later sprints
  })

  // New test: verifies that MainAccordion receives the correct props from MainLayout
  test('passes correct props to MainAccordion', async () => {
    const mockFetchPostings = jest.fn().mockResolvedValue(mockResearchOps)
    render(
      <MainLayout
        isStudent
        isFaculty
        isAdmin={false}
        fetchPostings={mockFetchPostings}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('main-accordion')).toBeInTheDocument()
    })

    const accordionProps = JSON.parse(screen.getByTestId('main-accordion').textContent)
    expect(accordionProps.isStudent).toBe(true)
    expect(accordionProps.isFaculty).toBe(true)
    expect(accordionProps.isAdmin).toBe(false)
    expect(accordionProps.postings).toEqual(mockResearchOps)
  })
})
