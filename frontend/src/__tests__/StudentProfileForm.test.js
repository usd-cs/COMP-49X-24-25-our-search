/* eslint-env jest */
/**
 * StudentProfileForm.test.js
 *
 * This file has the tests for the StudentProfileForm component.
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileForm from '../components/StudentProfileForm'

describe('StudentProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields, header and the submit button', () => {
    render(<StudentProfileForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Graduation Year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Major\(s\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Class Status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Research Field Interest\(s\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Research Period Interest\(s\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Reason/i)).toBeInTheDocument()
    expect(screen.getByText(/Do you have prior research experience/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Create Your Student Profile/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument()
  })

  it('allows multiple selection in Research Field Interest(s) multi-select dropdown', async () => {
    render(<StudentProfileForm />)
    const researchFieldSelect = screen.getByLabelText(/Research Field Interest\(s\)/i)
    // Open dropdown and select "Artificial Intelligence"
    await userEvent.click(researchFieldSelect)
    const aiOption = await screen.findByRole('option', { name: 'Artificial Intelligence' })
    await userEvent.click(aiOption)
    // Re-open dropdown and select "Cybersecurity"
    await userEvent.click(researchFieldSelect)
    const cybersecurityOption = await screen.findByRole('option', { name: 'Cybersecurity' })
    await userEvent.click(cybersecurityOption)
    // Verify that chips for both options appear
    expect(screen.getAllByText('Artificial Intelligence').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cybersecurity').length).toBeGreaterThan(0)
  })

  it('allows multiple selection in Major multi-select dropdown', async () => {
    render(<StudentProfileForm />)
    const majorSelect = screen.getByLabelText(/Major\(s\)/i)
    // Open dropdown and select "Computer Science"
    await userEvent.click(majorSelect)
    const csOption = await screen.findByRole('option', { name: 'Computer Science' })
    await userEvent.click(csOption)
    // Verify that the selection appears
    expect(screen.getAllByText('Computer Science').length).toBeGreaterThan(0)
  })

  it('allows multiple selection in Research Period multi-select dropdown', async () => {
    render(<StudentProfileForm />)
    const researchPeriodSelect = screen.getByLabelText(/Research Period Interest\(s\)/i)
    // Open dropdown and select "Fall 2024"
    await userEvent.click(researchPeriodSelect)
    const fallOption = await screen.findByRole('option', { name: 'Fall 2024' })
    await userEvent.click(fallOption)
    // Re-open dropdown and select "Spring 2025"
    await userEvent.click(researchPeriodSelect)
    const springOption = await screen.findByRole('option', { name: 'Spring 2025' })
    await userEvent.click(springOption)
    // Verify that chips for both options appear
    expect(screen.getAllByText('Fall 2024').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Spring 2025').length).toBeGreaterThan(0)
  })

  it('submits the form with the correct data', async () => {
    // Mock console.log and global.fetch to simulate a successful POST response.
    console.log = jest.fn()
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      statusText: 'Created',
      json: async () => ({
        name: 'Jane Doe',
        graduationYear: '2025',
        major: ['Computer Science'],
        classStatus: 'Senior',
        researchFieldInterests: ['Artificial Intelligence', 'Cybersecurity'],
        researchPeriodsInterest: ['Fall 2024', 'Spring 2025'],
        interestReason: 'I want to gain research experience and contribute to innovative projects.',
        hasPriorExperience: 'yes'
      })
    })

    render(<StudentProfileForm />)

    // Fill out text fields
    await userEvent.type(screen.getByLabelText(/Name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/Graduation Year/i), '2025')

    // For Major multi-select: open and select "Computer Science"
    const majorSelect = screen.getByLabelText(/Major/i)
    await userEvent.click(majorSelect)
    const csOption = await screen.findByRole('option', { name: 'Computer Science' })
    await userEvent.click(csOption)
    await userEvent.keyboard('{Escape}')

    // For Class Status dropdown: open and select "Senior"
    const classStatusSelect = screen.getByLabelText(/Class Status/i)
    await userEvent.click(classStatusSelect)
    const seniorOption = await screen.findByRole('option', { name: 'Senior' })
    await userEvent.click(seniorOption)

    // For Research Field Interest(s) multi-select: select "Artificial Intelligence" and "Cybersecurity"
    const researchFieldSelect = screen.getByLabelText(/Research Field Interest\(s\)/i)
    await userEvent.click(researchFieldSelect)
    const aiOption = await screen.findByRole('option', { name: 'Artificial Intelligence' })
    await userEvent.click(aiOption)
    await userEvent.click(researchFieldSelect)
    const cybersecurityOption = await screen.findByRole('option', { name: 'Cybersecurity' })
    await userEvent.click(cybersecurityOption)
    await userEvent.keyboard('{Escape}')

    // For Research Period multi-select: open and select "Fall 2024" and "Spring 2025"
    const researchPeriodSelect = screen.getByLabelText(/Research Period Interest\(s\)/i)
    await userEvent.click(researchPeriodSelect)
    const fallOption = await screen.findByRole('option', { name: 'Fall 2024' })
    await userEvent.click(fallOption)
    await userEvent.click(researchPeriodSelect)
    const springOption = await screen.findByRole('option', { name: 'Spring 2025' })
    await userEvent.click(springOption)
    await userEvent.keyboard('{Escape}')

    // Fill out Interest Reason text field
    await userEvent.type(
      screen.getByLabelText(/Interest Reason/i),
      'I want to gain research experience and contribute to innovative projects.'
    )

    // Click the radio button for prior research experience (Yes)
    await userEvent.click(screen.getByLabelText(/Yes/i))

    // Submit the form by clicking the Create Profile button
    const submitButton = screen.getByRole('button', { name: /Create Profile/i })
    await userEvent.click(submitButton)

    // Wait for the asynchronous submission to finish and check that console.log was called with the expected data.
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
        name: 'Jane Doe',
        graduationYear: '2025',
        major: ['Computer Science'],
        classStatus: 'Senior',
        researchFieldInterests: ['Artificial Intelligence', 'Cybersecurity'],
        researchPeriodsInterest: ['Fall 2024', 'Spring 2025'],
        interestReason: 'I want to gain research experience and contribute to innovative projects.',
        hasPriorExperience: 'yes'
      })
    })
  })
  it('renders error message if the submission fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false, // Simulate an error response
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({
        message: 'Something went wrong'
      })
    })

    render(<StudentProfileForm />)

    fireEvent.submit(screen.getByRole('button', { name: /Create Profile/i }))

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/There was an error creating your profile. Please try again./i)).toBeInTheDocument()
    })
  })
})
