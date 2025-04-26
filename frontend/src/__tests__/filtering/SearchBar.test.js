import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SearchBar from '../../components/filtering/SearchBar'

const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {ui}
      </MemoryRouter>
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

  test('renders umbrella topics, majors, and research periods filter options for projects view', () => {
    renderWithTheme(<SearchBar />)
  })

  test('updates the input value as the user types', async () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(input, 'hello world')
    expect(input).toHaveValue('hello world')
  })

  test('navigates with ?search=… when Enter is pressed', async () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(input, 'foo bar{enter}')
    expect(mockNavigate).toHaveBeenCalledWith('?search=foo+bar', { replace: true })
  })

  test('removes the search param when input is cleared and Enter is pressed', async () => {
    renderWithTheme(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search/i })

    await userEvent.type(input, 'abc{enter}')
    expect(mockNavigate).toHaveBeenLastCalledWith('?search=abc', { replace: true })

    await userEvent.clear(input)
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    expect(mockNavigate).toHaveBeenLastCalledWith('?', { replace: true })
  })

  test('navigates when clicking the search icon', async () => {
    const { container } = renderWithTheme(<SearchBar />)
    const input = screen.getByRole('textbox', { name: /search/i })

    await userEvent.type(input, 'icon test')
    const svg = container.querySelector('svg')
    fireEvent.click(svg)

    expect(mockNavigate).toHaveBeenCalledWith('?search=icon+test', { replace: true })
  })
})
