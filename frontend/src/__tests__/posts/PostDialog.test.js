import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostDialog from '../../components/posts/PostDialog'
import { mockOneActiveProject, mockOneStudent } from '../../resources/mockData'
import { viewStudentsFlag, viewProjectsFlag } from '../../resources/constants'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

// TODO

// Need to wrap the component in this because it uses react-router-dom
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
    </ThemeProvider>
  )
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}))

describe('PostDialog Component', () => {
  it('renders the close button and triggers onClose when clicked', () => {
    const handleClose = jest.fn()
    renderWithTheme(
      <PostDialog
        onClose={handleClose}
        post={mockOneActiveProject}
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )

    const closeButton = screen.getByText('X')
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when posts are null', () => {
    renderWithTheme(
      <PostDialog
        onClose={() => {}}
        post={null}
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('when user is a student', () => {
    it('renders the project details correctly for a student view (showing project info)', () => {
      renderWithTheme(       
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent
          isFaculty={false}
          isAdmin={false}
          postsView={viewProjectsFlag}
        />
      )

      expect(screen.getByText('AI Research')).toBeInTheDocument()
      expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument()

      expect(screen.getByText('Faculty:')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john.doe@sandiego.edu')).toBeInTheDocument()
    })
  })

  describe('when user is faculty', () => {
    it('renders the student details correctly (faculty view is students)', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewStudentsFlag}
        />
      )

      expect(screen.getByText('Test reason')).toBeInTheDocument()
      expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
      expect(screen.getByText('aescudero@sandiego.edu')).toBeInTheDocument()
      expect(screen.getByText('Computer Science')).toBeInTheDocument()
    })

    it('renders the project details correctly (faculty view is projects)', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
        />
      )

      expect(screen.getByText('AI Research')).toBeInTheDocument()
    })
  })

  describe('when user is admin', () => {
    it('renders faculty details correctly (admin viewing faculty)', () => {

    })

    it('renders student details correctly (admin viewing students)', () => {
      
    })

    it('renders project details correctly (admin viewing projects)', () => {
      
    })

    it('clicking faculty email sends to new send-email page', () => {
      
    })

    it('renders edit and delete buttons for project', () =>  {

    })
    it('renders edit and delete buttons for student', () =>  {
      
    })
    it('renders edit and delete buttons for faculty', () =>  {
      
    })
  })
})
