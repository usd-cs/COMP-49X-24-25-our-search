/* eslint-env jest */
/**
 * StudentProfileForm.test.js
 *
 * This file has the tests for the StudentProfileForm component.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudentProfileForm from '../components/StudentProfileForm'

describe('StudentProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields and the submit button', () => {
    render(<StudentProfileForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Major/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Class Status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Research Field/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Research Period/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interest Reason/i)).toBeInTheDocument()
    expect(screen.getByText(/Do you have prior research experience/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument()
  })

  it('submits the form with the correct data', async () => {
    // Verify the submission data
    console.log = jest.fn()

    render(<StudentProfileForm />)

    // Fill out text fields
    await userEvent.type(screen.getByLabelText(/Name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane.doe@example.com')

    // For Major dropdown: open and select "Computer Science"
    const majorSelect = screen.getByLabelText(/Major/i)
    await userEvent.click(majorSelect)
    const majorOption = await screen.findByRole('option', { name: 'Computer Science' })
    await userEvent.click(majorOption)

    // For Class Status dropdown: open and select "Senior"
    const classStatusSelect = screen.getByLabelText(/Class Status/i)
    await userEvent.click(classStatusSelect)
    const seniorOption = await screen.findByRole('option', { name: 'Senior' })
    await userEvent.click(seniorOption)

    // For Research Field dropdown: open and select "Artificial Intelligence"
    const researchFieldSelect = screen.getByLabelText(/Research Field/i)
    await userEvent.click(researchFieldSelect)
    const researchFieldOption = await screen.findByRole('option', { name: 'Artificial Intelligence' })
    await userEvent.click(researchFieldOption)

    // For Research Period dropdown: open and select "Fall 2024"
    const researchPeriodSelect = screen.getByLabelText(/Research Period/i)
    await userEvent.click(researchPeriodSelect)
    const researchPeriodOption = await screen.findByRole('option', { name: 'Fall 2024' })
    await userEvent.click(researchPeriodOption)

    // Fill out Interest Reason text field
    await userEvent.type(
      screen.getByLabelText(/Interest Reason/i),
      'I want to gain research experience and contribute to innovative projects.'
    )

    // Click the radio button for prior experience (Yes)
    await userEvent.click(screen.getByLabelText(/Yes/i))

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /Create Profile/i }))

    expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      major: 'Computer Science',
      classStatus: 'Senior',
      researchFieldInterests: 'Artificial Intelligence',
      researchPeriodsInterest: 'Fall 2024',
      interestReason: 'I want to gain research experience and contribute to innovative projects.',
      hasPriorExperience: 'yes'
    })
  })
})
