/* eslint-env jest */
/**
 * FacultyProfileForm.test.js
 *
 * This file has the tests for the FacultyProfileForm component.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument()
  })

  it('submits the form with the correct data', async () => {
    console.log = jest.fn()

    render(<FacultyProfileForm />)

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/Name/i), 'Dr. John Doe')
    await userEvent.type(screen.getByLabelText(/Email/i), 'john.doe@example.com')
    await userEvent.type(screen.getByLabelText(/Department/i), 'Computer Science')

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /Create Profile/i }))

    expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      department: 'Computer Science'
    })
  })
})
