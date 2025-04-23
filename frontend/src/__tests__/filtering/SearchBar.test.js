import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SearchBar from '../../components/filtering/SearchBar'

// Wrap component with ThemeProvider and MemoryRouter
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
  useNavigate: jest.fn(),
  useParams: jest.fn()
}))

global.fetch = jest.fn()

describe('Searchbar', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
  })

  test('renders umbrella topics, majors, and research periods filter options for projects view', async () => {
    renderWithTheme(<SearchBar />)
  })
})
