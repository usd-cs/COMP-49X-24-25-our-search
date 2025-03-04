import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RoleSelection from '../components/RoleSelection'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('RoleSelection Component', () => {
  test('renders welcome messages and instructions', () => {
    renderWithTheme(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoleSelection />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to OUR SEARCH/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Please select your role to continue/i)
    ).toBeInTheDocument()
  })

  test('does not show the continue button initially', () => {
    renderWithTheme(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoleSelection />
      </MemoryRouter>
    )

    expect(
      screen.queryByRole('button', { name: /Continue as/i })
    ).not.toBeInTheDocument()
  })

  test('displays continue button after selecting the Student role', () => {
    renderWithTheme(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoleSelection />
      </MemoryRouter>
    )

    const studentRole = screen.getByText('Student')
    fireEvent.click(studentRole)

    expect(
      screen.getByRole('button', { name: /Continue as Student/i })
    ).toBeInTheDocument()
  })

  test('displays continue button after selecting the Professor role', () => {
    renderWithTheme(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoleSelection />
      </MemoryRouter>
    )

    const professorRole = screen.getByText('Professor')
    fireEvent.click(professorRole)

    expect(
      screen.getByRole('button', { name: /Continue as Professor/i })
    ).toBeInTheDocument()
  })
})
