import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AreYouSureDialog from '../../components/popups/AreYouSureDialog'

describe('AreYouSureDialog Component', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the dialog when open is true', () => {
    render(
      <AreYouSureDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        action='delete'
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render the dialog when open is false', () => {
    render(
      <AreYouSureDialog
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        action='delete'
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays the header title "Confirm Action"', () => {
    render(
      <AreYouSureDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        action='anything'
      />
    )
    expect(screen.getByText(/confirm action/i)).toBeInTheDocument()
  })

  it('renders the error message when provided', () => {
    render(
      <AreYouSureDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        error='An error occurred'
        action='delete'
      />
    )
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
  })

  it('calls onClose when the "Cancel" button is clicked', () => {
    render(
      <AreYouSureDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        action='delete'
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when the action button is clicked', () => {
    render(
      <AreYouSureDialog
        open
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        action='delete'
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })
})
