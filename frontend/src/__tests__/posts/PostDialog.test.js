import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostDialog from '../../components/posts/PostDialog'
import { mockOneActiveProject, mockOneFaculty, mockOneStudent } from '../../resources/mockData'
import { viewStudentsFlag, viewProjectsFlag, viewFacultyFlag } from '../../resources/constants'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, useNavigate, Routes, Route } from 'react-router-dom'

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
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

describe('PostDialog Component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
  })

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

      expect(screen.getByText(mockOneActiveProject.name)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.description)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.desiredQualifications)).toBeInTheDocument()
      expect(screen.getByText('Status:')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.firstName + ' ' + mockOneActiveProject.faculty.lastName)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.email)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.umbrellaTopics[0])).toBeInTheDocument()
      mockOneActiveProject.majors.forEach((major) => {
        const majorRefs = screen.getAllByText(new RegExp(major, 'i'))
        expect(majorRefs.length).toBeGreaterThan(0)
      })
    })

    it('does NOT edit and delete buttons for project', () => {
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

      expect(screen.queryByRole('button', { name: /edit project/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete project/i })).not.toBeInTheDocument()
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

      expect(screen.getByText(mockOneActiveProject.name)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.description)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.desiredQualifications)).toBeInTheDocument()
      expect(screen.getByText('Status:')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.firstName + ' ' + mockOneActiveProject.faculty.lastName)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.email)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.umbrellaTopics[0])).toBeInTheDocument()
      mockOneActiveProject.majors.forEach((major) => {
        const majorRefs = screen.getAllByText(new RegExp(major, 'i'))
        expect(majorRefs.length).toBeGreaterThan(0)
      })
    })
    it('does NOT edit and delete buttons for project', () => {
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

      expect(screen.queryByRole('button', { name: /edit project/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete project/i })).not.toBeInTheDocument()
    })
    it('does NOT redner edit and delete buttons for student', () => {
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

      expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete profile/i })).not.toBeInTheDocument()
    })
  })

  describe('when user is admin', () => {
    it('renders faculty details correctly (admin viewing faculty)', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneFaculty}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
        />
      )
      expect(screen.getByText(mockOneFaculty.firstName + ' ' + mockOneFaculty.lastName)).toBeInTheDocument()
      expect(screen.getByText(mockOneFaculty.email)).toBeInTheDocument()
      mockOneFaculty.department.forEach((dept) => {
        const deptRef = screen.getAllByText(new RegExp(dept, 'i'))
        expect(deptRef.length).toBeGreaterThan(0)
      })
      mockOneFaculty.projects.forEach((proj) => {
        expect(screen.getByText(proj.name)).toBeInTheDocument()
      })
    })

    it('renders student details correctly (admin viewing students)', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
        />
      )

      expect(screen.getByText('Test reason')).toBeInTheDocument()
      expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
      expect(screen.getByText('aescudero@sandiego.edu')).toBeInTheDocument()
      expect(screen.getByText('Computer Science')).toBeInTheDocument()
    })

    it('renders project details correctly (admin viewing projects)', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
        />
      )

      expect(screen.getByText(mockOneActiveProject.name)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.description)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.desiredQualifications)).toBeInTheDocument()
      expect(screen.getByText('Status:')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.firstName + ' ' + mockOneActiveProject.faculty.lastName)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.faculty.email)).toBeInTheDocument()
      expect(screen.getByText(mockOneActiveProject.umbrellaTopics[0])).toBeInTheDocument()
      mockOneActiveProject.majors.forEach((major) => {
        const majorRefs = screen.getAllByText(new RegExp(major, 'i'))
        expect(majorRefs.length).toBeGreaterThan(0)
      })
    })

    it('clicking faculty email sends to new send-email page', () => {
      render(
        <MemoryRouter initialEntries={['/posts']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route
              path='/posts'
              element={
                <PostDialog
                  onClose={() => {}}
                  post={mockOneFaculty}
                  isStudent={false}
                  isFaculty={false}
                  isAdmin
                  postsView={viewFacultyFlag}
                />
              }
            />
            {/* Mock the destination route */}
            <Route path='/email-faculty/:email' element={<div>Send Email Page</div>} />
          </Routes>
        </MemoryRouter>
      )

      const emailLink = screen.getByTestId('email-link')
      expect(emailLink).toBeInTheDocument()
      fireEvent.click(emailLink)

      expect(screen.getByText('Send Email Page')).toBeInTheDocument()
    })

    it('renders edit and delete buttons for project', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
        />
      )

      expect(screen.getByRole('button', { name: /edit project/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete project/i })).toBeInTheDocument()
    })
    it('renders edit and delete buttons for student', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
        />
      )

      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete profile/i })).toBeInTheDocument()
    })
    it('renders edit and delete buttons for faculty', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneFaculty}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
        />
      )

      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete profile/i })).toBeInTheDocument()
    })

    it('clicking edit faculty sends to faculty page', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneFaculty}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
        />
      )

      const button = screen.getByRole('button', { name: /edit profile/i })
      fireEvent.click(button)

      expect(mockNavigate).toHaveBeenCalledWith(`/faculty/${mockOneFaculty.id}`)
    })
    it('clicking edit student sends to student page', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
        />
      )

      const button = screen.getByRole('button', { name: /edit profile/i })
      fireEvent.click(button)

      expect(mockNavigate).toHaveBeenCalledWith(`/student/${mockOneStudent.id}`)
    })
    it('clicking edit project sends to project page', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
        />
      )

      const button = screen.getByRole('button', { name: /edit project/i })
      fireEvent.click(button)

      expect(mockNavigate).toHaveBeenCalledWith(`/project/${mockOneActiveProject.id}`)
    })

    it('clicking delete faculty opens "are you sure you want to delete?" popup', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneFaculty}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
        />
      )

      const button = screen.getByRole('button', { name: /delete profile/i })
      fireEvent.click(button)

      expect(screen.getByText(/are you sure you want to delete\?/i)).toBeInTheDocument()
    })
    it('clicking delete student opens "are you sure you want to delete?" popup', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
        />
      )

      const button = screen.getByRole('button', { name: /delete profile/i })
      fireEvent.click(button)

      expect(screen.getByText(/are you sure you want to delete\?/i)).toBeInTheDocument()
    })
    it('clicking delete project opens "are you sure you want to delete?" popup', () => {
      renderWithTheme(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
        />
      )

      const button = screen.getByRole('button', { name: /delete project/i })
      fireEvent.click(button)

      expect(screen.getByText(/are you sure you want to delete\?/i)).toBeInTheDocument()
    })
  })
})
