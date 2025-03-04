import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import InvalidEmail from '../components/Auth/InvalidEmail'

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

describe('InvalidEmail Component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate)
  })

  test('navigates to login page when button is clicked', () => {
    renderWithTheme(<InvalidEmail />)

    const button = screen.getByRole('button', { name: /back to login/i })
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('renders the error message', () => {
    renderWithTheme(<InvalidEmail />)

    expect(screen.getByText((content) =>
      content.includes('Please use a valid USD email address')
    )).toBeInTheDocument()
  })

  test('renders the back to login button', () => {
    renderWithTheme(<InvalidEmail />)

    expect(
      screen.getByRole('button', { name: /back to login/i })
    ).toBeInTheDocument()
  })
})
