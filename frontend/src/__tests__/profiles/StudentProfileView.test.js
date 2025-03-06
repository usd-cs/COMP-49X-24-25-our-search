/* eslint-env jest */
/**
 * StudentProfileView.test.js
 *
 * This file has the tests for the StudentProfileView component.
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import StudentProfileView from '../../components/profiles/StudentProfileView'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { getStudentCurrentExpected } from '../../resources/mockData'

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

describe('StudentProfileView', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
  })

  it('shows a loading spinner initially', () => {
    renderWithTheme(<StudentProfileView />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('disables the edit profile button if fetch does not return expected student data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({})
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const editButton = screen.getByRole('button', { name: /edit profile/i })
    expect(editButton).toBeDisabled()
  })

  it('navigates to /edit-student-profile page when edit button is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => (getStudentCurrentExpected)
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /edit profile/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/edit-student-profile')
  })

  it('navigates to /posts page when back button is clicked', async () => {
    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const button = screen.getByRole('button', { name: /back/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/posts')
  })

  it('displays a custom error message when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })

  it('displays profile data when fetch is successful', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => (getStudentCurrentExpected)
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(screen.getByRole('heading', { name: /Student Profile/i })).toBeInTheDocument()
    expect(screen.getByText(getStudentCurrentExpected.firstName + ' ' + getStudentCurrentExpected.lastName)).toBeInTheDocument()
    expect(screen.getByText(getStudentCurrentExpected.graduationYear)).toBeInTheDocument()
    expect(screen.getByText(getStudentCurrentExpected.classStatus)).toBeInTheDocument()
    const researchFieldPattern = new RegExp(getStudentCurrentExpected.researchFieldInterests.join(', '), 'i')
    expect(screen.getByText(researchFieldPattern)).toBeInTheDocument()
    expect(screen.getByText(getStudentCurrentExpected.researchPeriodsInterest[0])).toBeInTheDocument()
    expect(screen.getByText(getStudentCurrentExpected.interestReason)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(getStudentCurrentExpected.hasPriorExperience, 'i'))).toBeInTheDocument()

    // Verify the presence of the Edit Profile button
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()

    // Verify the presence of the Back button
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument()
  })

  it('displays "No profile found." when profile is empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({})
    })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => {
      expect(screen.getByText(/No profile found\./i)).toBeInTheDocument()
    })
  })
})

describe('StudentProfileView - Delete Profile', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    global.fetch = jest.fn()
  })

  it('shows the delete profile button', async () => {
    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const deleteButton = screen.getByRole('button', { name: /delete profile/i })
    expect(deleteButton).toBeInTheDocument()
  })

  it('shows confirmation dialog when delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => getStudentCurrentExpected })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('sends DELETE request on confirmation', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => getStudentCurrentExpected })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/studentProfiles/current'),
      expect.objectContaining({ method: 'DELETE' })
    ))
  })

  it('displays error message if DELETE request fails', async () => {
    global.fetch
      .mockResolvedValueOnce({ // Mock the profile fetch call
        ok: true,
        json: async () => getStudentCurrentExpected
      })
      .mockResolvedValueOnce({ // Mock the DELETE request failure
        ok: false,
        statusText: 'Failed to delete'
      })

    renderWithTheme(<StudentProfileView />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /delete profile/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2))

    // Ensure the DELETE request was made
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/studentProfiles/current'),
      expect.objectContaining({ method: 'DELETE', credentials: 'include' })
    ))

    // Check if error messages appear twice
    const failureNotices = screen.getAllByText(/Failed to delete profile\. Please try again\./i)
    expect(failureNotices).toHaveLength(2)
  })
})
