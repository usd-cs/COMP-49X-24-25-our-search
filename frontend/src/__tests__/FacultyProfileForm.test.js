/* eslint-env jest */
/**
 * FacultyProfileForm.test.js
 *
 * This file has the tests for the FacultyProfileForm component.
 * @author Rayan Pal
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacultyProfileForm from '../components/FacultyProfileForm'

describe('FacultyProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields and the submit button', () => {
    render(<FacultyProfileForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument()
    expect(screen.getByText(/Create Your Faculty Profile/i)).toBeInTheDocument()
  })

  it('submits the form with the correct data', async () => {
    // Mock console.log and global.fetch to simulate a successful POST response.
    console.log = jest.fn()
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, // Simulate an error response
      status: 201,
      statusText: 'Created',
      json: async () => ({
        name: 'Dr. John Doe',
        department: ['Engineering, Math, and Computer Science']
      })
    })

    render(<FacultyProfileForm />)

    // Fill out the form fields
    await userEvent.type(screen.getByLabelText(/Name/i), 'Dr. John Doe')

    // For the Department multi-select dropdown, open and select "Engineering, Math, and Computer Science"
    const departmentSelect = screen.getByLabelText(/Department/i)
    await userEvent.click(departmentSelect)
    const departmentOption = await screen.findByRole('option', { name: 'Engineering, Math, and Computer Science' })
    await userEvent.click(departmentOption)
    // Close the dropdown/popover by clicking outside
    await userEvent.click(document.body)

    // Submit the form by clicking the "Create Profile" text
    await userEvent.click(screen.getByText(/Create Profile/i))
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
        name: 'Dr. John Doe',
        department: ['Engineering, Math, and Computer Science']
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

    render(<FacultyProfileForm />)

    fireEvent.submit(screen.getByRole('button', { name: /Create Profile/i }))

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/There was an error creating your profile. Please try again./i)).toBeInTheDocument()
    })
  })
})
