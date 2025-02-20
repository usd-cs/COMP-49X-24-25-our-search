import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MainLayout from '../components/MainLayout'
import { mockResearchOps } from '../resources/mockData'
import { appTitle } from '../resources/constants'
import { fetchProjectsUrl } from '../resources/constants'

// Mock MainAccordion to capture its props for testing
jest.mock('../components/MainAccordion', () => (props) => {
  return <div data-testid='main-accordion'>{JSON.stringify(props)}</div>
})

global.fetch = jest.fn();

describe('MainLayout', () => {
  beforeEach(() => {
    // Clear mocks before each test
    fetch.mockClear()
  })

  test('calls fetchPostings when it renders', async () => {
     // Mocking a successful fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResearchOps),
    })

    render(
      <MainLayout
        isStudent={true}
        isFaculty={false}
        isAdmin={false}
      />
    )

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    expect(fetch).toHaveBeenCalledWith(fetchProjectsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
    render(
      <MainLayout
        isStudent={true}
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
