/* eslint-env jest */
import React from 'react'
import { render, screen } from '@testing-library/react'
import PersistentAlert from '../../components/popups/PersistentAlert'

describe('PersistentAlert', () => {
  it('renders nothing when msg is null', () => {
    render(<PersistentAlert msg={null} type='success' />)
    const alert = screen.queryByRole('alert')
    expect(alert).not.toBeInTheDocument()
  })

  it('renders alert with correct message', () => {
    render(<PersistentAlert msg='Test message' type='success' />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders with correct severity type when valid', () => {
    render(<PersistentAlert msg='Success!' type='success' />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardSuccess')
  })

  it('defaults to info severity for invalid type', () => {
    render(<PersistentAlert msg='Fallback to info' type='invalidType' />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardInfo')
  })

  it('uses info severity when no type is passed', () => {
    render(<PersistentAlert msg='No type provided' />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardInfo')
  })
})
