import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacultyProfileEdit from '../components/FacultyProfileEdit'

describe('FacultyProfileEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading spinner initially', () => {
    render(<FacultyProfileEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    render(<FacultyProfileEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    const dummyProfile = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      department: ['Computer Science', 'Mathematics'],
      active: true
    }

    // Mock GET fetch for initial profile data
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => dummyProfile
    })

    render(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(dummyProfile.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyProfile.email)).toBeInTheDocument()
    // For multi-select department, check that individual department chips are rendered
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()

    // The "Set Profile as Inactive" checkbox should be unchecked when active is true
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    expect(inactiveCheckbox).not.toBeChecked()
  })

  it('submits updated profile successfully and shows success message', async () => {
    const dummyProfile = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      department: ['Computer Science', 'Mathematics'],
      active: true
    }

    // Mock GET fetch for initial profile data, then mock PUT submission for update
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => dummyProfile
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...dummyProfile, name: 'Dr. Jane Smith', active: false })
      })

    render(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Dr. Jane Smith')

    // Toggle inactive checkbox to set profile as inactive
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    await userEvent.click(inactiveCheckbox)
    expect(inactiveCheckbox).toBeChecked()

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully\./i)).toBeInTheDocument()
    })
  })

  it('displays an error message when submission fails', async () => {
    const dummyProfile = {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      department: ['Computer Science', 'Mathematics'],
      active: true
    }

    // Mock GET fetch for initial profile data, then mock PUT submission failure
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => dummyProfile
      })
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      })

    render(<FacultyProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Change the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Dr. Jane Smith')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })
})
