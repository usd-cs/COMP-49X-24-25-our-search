import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import SharedLayout from '../../components/navigation/SharedLayout'
import { Typography } from '@mui/material'

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

describe('SharedLayout', () => {
  const mockNavigate = jest.fn()
  const handleLogout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    // fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  test('clicking icon navigates to /disciplines-and-majors', async () => {
    renderWithTheme(<SharedLayout isAdmin />)

    const button = screen.getByTestId('manage-app-variables-icon')
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/disciplines-and-majors')
  })

  test('clicking icon navigates to /email-notifications', async () => {
    renderWithTheme(<SharedLayout isAdmin />)

    const button = screen.getByTestId('manage-email-notifications-icon')
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/email-notifications')
  })

  test('renders the ViewProfile component', async () => {
    renderWithTheme(<SharedLayout isAdmin handleLogout={handleLogout} />)
    const profilebtn = screen.getByText(/admin/i)
    expect(profilebtn).toBeInTheDocument()
  })

  test('renders the SearchBar', async () => {
    renderWithTheme(<SharedLayout showingPosts handleLogout={handleLogout} />)
    const searchbar = screen.getAllByText(/search/i)[0]
    expect(searchbar).toBeInTheDocument()
  })

  test('renders the TitleButton', async () => {
    renderWithTheme(<SharedLayout showingPosts handleLogout={handleLogout} />)

    const titleBtn = screen.getByText(/OUR SEARCH/i)
    expect(titleBtn).toBeInTheDocument()
  })

  test('renders the SideBar only if showingPosts = true', async () => {
    renderWithTheme(<SharedLayout showingPosts handleLogout={handleLogout} />)

    const sidebarText = screen.getByText(/filters/i)
    expect(sidebarText).toBeInTheDocument()
  })

  test('does NOT render the SideBar only if showingPosts = false', async () => {
    renderWithTheme(<SharedLayout handleLogout={handleLogout} />)

    const sidebarText = screen.queryByText(/filters/i)
    expect(sidebarText).not.toBeInTheDocument()
  })

  test('if showingPosts = true, it renders the PostsLayout', async () => {
    renderWithTheme(<SharedLayout showingPosts handleLogout={handleLogout} />)

    const postsLayoutText = screen.getByText(/error loading/i)
    expect(postsLayoutText).toBeInTheDocument()
  })

  test('if showingPosts = false, it renders children', async () => {
    renderWithTheme(
      <SharedLayout handleLogout={handleLogout}>
        <Typography>
          Mock children
        </Typography>
      </SharedLayout>
    )

    const children = screen.getByText(/mock children/i)
    expect(children).toBeInTheDocument()
  })
})
