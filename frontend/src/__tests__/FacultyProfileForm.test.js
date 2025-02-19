/* eslint-env jest */
/**
 * FacultyProfileForm.test.js
 *
 * This file has the tests for the FacultyProfileForm component.
 * @author Rayan Pal
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacultyProfileForm from '../components/FacultyProfileForm'

describe('FacultyProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields and the submit button', () => {
    render(<FacultyProfileForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument()
    expect(screen.getByText(/Create Your Faculty Profile/i)).toBeInTheDocument()
  })

  it('submits the form with the correct data', async () => {
    console.log = jest.fn()
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        name: 'Dr. John Doe',
        email: 'john.doe@example.com',
        department: 'Computer Science'
      })
    })

    render(<FacultyProfileForm />)

    // Fill out the form fields
    await userEvent.type(screen.getByLabelText(/Name/i), 'Dr. John Doe')
    await userEvent.type(screen.getByLabelText(/Email/i), 'john.doe@example.com')

    // For the Department multi-select dropdown, open and select "Computer Science"
    const departmentSelect = screen.getByLabelText(/Department/i)
    await userEvent.click(departmentSelect)
    const departmentOption = await screen.findByRole('option', { name: 'Computer Science' })
    await userEvent.click(departmentOption)
    // Close the dropdown/popover by clicking outside
    await userEvent.click(document.body)

    // Submit the form by clicking the "Create Profile" text (instead of role button)
    await userEvent.click(screen.getByText(/Create Profile/i))
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
        name: 'Dr. John Doe',
        email: 'john.doe@example.com',
        department: 'Computer Science'
      })
    })
  })
})
