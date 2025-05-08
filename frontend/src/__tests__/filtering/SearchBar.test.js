import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SearchBar from '../../components/filtering/SearchBar'
import { viewProjectsFlag } from '../../resources/constants'

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
  const handleApply = jest.fn()
  const setSearchQuery = jest.fn()

  const defaultProps = {
    handleApply,
    searchQuery: '',
    setSearchQuery,
    postsView: viewProjectsFlag
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls handleApply when Enter is pressed', async () => {
    renderWithTheme(<SearchBar {...defaultProps} />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(input, 'test{enter}')
    expect(handleApply).toHaveBeenCalledTimes(1)
  })

  test('calls handleApply when clicking the search icon', async () => {
    const { container } = renderWithTheme(<SearchBar {...defaultProps} />)
    const input = screen.getByRole('textbox', { name: /search/i })
    await userEvent.type(input, 'icon test')
    const svg = container.querySelector('svg')
    fireEvent.click(svg)
    expect(handleApply).toHaveBeenCalledTimes(1)
  })
})
