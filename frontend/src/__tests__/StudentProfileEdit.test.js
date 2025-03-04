import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileEdit from '../components/StudentProfileEdit'

describe('StudentProfileEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading spinner initially', () => {
    render(<StudentProfileEdit />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays a custom error message when fetching profile fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    })

    render(<StudentProfileEdit />)
    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred while fetching your profile\. Please try again\./i)
      ).toBeInTheDocument()
    })
  })

  it('populates form fields with fetched profile data', async () => {
    const dummyProfile = {
      name: 'Jane Doe',
      graduationYear: '2025',
      major: ['Computer Science'],
      classStatus: ['Senior'],
      researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
      researchPeriodsInterest: ['Fall 2024'],
      interestReason: 'I want to gain research experience.',
      hasPriorExperience: 'yes',
      active: true
    }

    // Mock GET fetch for initial profile data
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => dummyProfile
    })

    render(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Verify that text fields are pre-populated
    expect(screen.getByDisplayValue(dummyProfile.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyProfile.graduationYear)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyProfile.interestReason)).toBeInTheDocument()
    
    // For multi-select fields rendered as chips, check individual items
    expect(screen.getByText('Computer Science')).toBeInTheDocument() // Major
    expect(screen.getByText('Senior')).toBeInTheDocument() // Class Status
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument() // Research Field Interests
    expect(screen.getByText('Data Science')).toBeInTheDocument() // Research Field Interests

    // Research Period(s) is a TextField showing a joined string
    expect(screen.getByDisplayValue(dummyProfile.researchPeriodsInterest.join(', '))).toBeInTheDocument()

    // Verify Prior Research Experience radio group: radio with label "Yes" should be checked
    const yesRadio = screen.getByRole('radio', { name: /Yes/i })
    expect(yesRadio).toBeChecked()

    // The "Set Profile as Inactive" checkbox should be unchecked when active is true
    const inactiveCheckbox = screen.getByRole('checkbox', { name: /Set Profile as Inactive/i })
    expect(inactiveCheckbox).not.toBeChecked()
  })

  it('submits updated profile successfully and shows success message', async () => {
    const dummyProfile = {
      name: 'Jane Doe',
      graduationYear: '2025',
      major: ['Computer Science'],
      classStatus: ['Senior'],
      researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
      researchPeriodsInterest: ['Fall 2024'],
      interestReason: 'I want to gain research experience.',
      hasPriorExperience: 'yes',
      active: true
    }

    // Mock GET fetch for initial profile data
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => dummyProfile
      })
      // Mock PUT submission for profile update
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...dummyProfile, name: 'Jane Smith', active: false })
      })

    render(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Update the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jane Smith')

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
      name: 'Jane Doe',
      graduationYear: '2025',
      major: ['Computer Science'],
      classStatus: ['Senior'],
      researchFieldInterests: ['Artificial Intelligence', 'Data Science'],
      researchPeriodsInterest: ['Fall 2024'],
      interestReason: 'I want to gain research experience.',
      hasPriorExperience: 'yes',
      active: true
    }

    // Mock GET fetch for profile data
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => dummyProfile
      })
      // Mock PUT submission failure
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      })

    render(<StudentProfileEdit />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    // Change the name field
    const nameInput = screen.getByLabelText(/Name/i)
    userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jane Smith')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument()
    })
  })
})