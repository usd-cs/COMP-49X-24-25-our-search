import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostList from '../../components/posts/PostList'
import { mockOneActiveProject, mockThreeActiveProjects, mockTwoInactiveProjects, mockOneFaculty, mockOneStudent } from '../../resources/mockData'
import { noPostsMessage, viewStudentsFlag, viewProjectsFlag, viewFacultyFlag } from '../../resources/constants'

describe('PostList', () => {
  const mockSetSelectedPost = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders no postings message if not a student, faculty, or admin', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty={false}
        isAdmin={false}
        isOnFacultyProfile={false}
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders no postings message if there are no postings', () => {
    render(
      <PostList
        postings={[]}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty={false}
        isAdmin={false}
        isOnFacultyProfile={false}
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('calls setSelectedPost when a card is clicked', async () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent
        isFaculty={false}
        isAdmin={false}
        isOnFacultyProfile={false}
      />
    )

    const firstProject = mockThreeActiveProjects[0]
    const card = screen.getByText(firstProject.name).closest('.MuiCard-root')
    expect(card).not.toBeNull()

    await userEvent.click(card)

    expect(mockSetSelectedPost).toHaveBeenCalledTimes(1)
    expect(mockSetSelectedPost).toHaveBeenCalledWith(firstProject)
  })

  describe('when user is student', () => {
    it('renders no active postings message if no ACTIVE postings exist', () => {
      render(
        <PostList
          postings={mockTwoInactiveProjects}
          setSelectedPost={mockSetSelectedPost}
          isStudent
          isFaculty={false}
          isAdmin={false}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
    })

    it('renders active postings with correct details', () => {
      render(
        <PostList
          postings={mockThreeActiveProjects}
          setSelectedPost={mockSetSelectedPost}
          isStudent
          isFaculty={false}
          isAdmin={false}
          isOnFacultyProfile={false}
        />
      )

      mockThreeActiveProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
        expect(screen.getByText(new RegExp(`${project.faculty.firstName} ${project.faculty.lastName}`, 'i'))).toBeInTheDocument()

        project.researchPeriods.forEach((period) => {
          const researchReferences = screen.queryAllByText(new RegExp(period))
          expect(researchReferences.length).toBeGreaterThan(0)
        })

        project.umbrellaTopics.slice(0, 3).forEach((topic) => {
          expect(screen.getByText(topic)).toBeInTheDocument()
        })

        project.majors.forEach((major) => {
          const majorReferences = screen.getAllByText(major)
          expect(majorReferences.length).toBeGreaterThan(0) // At least major for "Computer Science" exists in the mock data
        })
      })
    })

    it('renders email icon button', () => {
      render(
        <PostList
          postings={[mockOneActiveProject]}
          setSelectedPost={mockSetSelectedPost}
          isStudent
          isFaculty={false}
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile={false}
        />
      )
      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).toBeInTheDocument()
    })
  })

  describe('when user is faculty, viewing projects', () => {
    it('renders no active postings message if no ACTIVE postings exist', () => {
      render(
        <PostList
          postings={mockTwoInactiveProjects}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
    })

    it('renders active postings with correct details (faculty view is projects)', () => {
      render(
        <PostList
          postings={[mockOneActiveProject]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText(mockOneActiveProject.name)).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`${mockOneActiveProject.faculty.firstName} ${mockOneActiveProject.faculty.lastName}`, 'i'))).toBeInTheDocument()

      mockOneActiveProject.researchPeriods.forEach((period) => {
        const researchReferences = screen.queryAllByText(new RegExp(period))
        expect(researchReferences.length).toBeGreaterThan(0)
      })

      mockOneActiveProject.umbrellaTopics.slice(0, 3).forEach((topic) => {
        expect(screen.getByText(topic)).toBeInTheDocument()
      })

      mockOneActiveProject.majors.forEach((major) => {
        const majorReferences = screen.getAllByText(major)
        expect(majorReferences.length).toBeGreaterThan(0)
      })
    })

    it('renders email icon button', () => {
      render(
        <PostList
          postings={[mockOneActiveProject]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile={false}
        />
      )
      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).toBeInTheDocument()
    })
  })

  describe('when user is faculty, viewing students', () => {
    it('renders active postings with correct details (faculty view is students)', () => {
      render(
        <PostList
          postings={[mockOneStudent]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewStudentsFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
      expect(screen.getByText(/Senior/i)).toBeInTheDocument()
      expect(screen.getByText(/Class of 2025/)).toBeInTheDocument()
      expect(screen.getByText(/aescudero@sandiego.edu/)).toBeInTheDocument()
      expect(screen.getByText(/Computer Science/)).toBeInTheDocument()
    })
  })

  describe('when user is faculty, viewing their own profile', () => {
    it('does not render email icon button', () => {
      render(
        <PostList
          postings={[mockOneActiveProject]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile
        />
      )

      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).not.toBeInTheDocument()
    })
    it('renders all projects (active and inactive) with correct details', () => {
      const activeAndInactiveProjects = mockThreeActiveProjects.concat(mockTwoInactiveProjects)
      render(
        <PostList
          postings={activeAndInactiveProjects}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile
        />
      )

      expect(screen.getAllByTestId('active-chip').length).toBe(3)
      expect(screen.getAllByTestId('inactive-chip').length).toBe(2)

      mockThreeActiveProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
        const nameRefs = screen.getAllByText(new RegExp(`${project.faculty.firstName} ${project.faculty.lastName}`, 'i'))
        expect(nameRefs.length).toBeGreaterThan(0)

        project.researchPeriods.forEach((period) => {
          const researchReferences = screen.queryAllByText(new RegExp(period))
          expect(researchReferences.length).toBeGreaterThan(0)
        })

        project.umbrellaTopics.slice(0, 3).forEach((topic) => {
          expect(screen.getByText(topic)).toBeInTheDocument()
        })

        project.majors.forEach((major) => {
          const majorReferences = screen.getAllByText(major)
          expect(majorReferences.length).toBeGreaterThan(0) // At least major for "Computer Science" exists in the mock data
        })
      })
      mockTwoInactiveProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
        const nameRefs = screen.getAllByText(new RegExp(`${project.faculty.firstName} ${project.faculty.lastName}`, 'i'))
        expect(nameRefs.length).toBeGreaterThan(0)

        project.researchPeriods.forEach((period) => {
          const researchReferences = screen.queryAllByText(new RegExp(period))
          expect(researchReferences.length).toBeGreaterThan(0)
        })

        project.umbrellaTopics.slice(0, 3).forEach((topic) => {
          expect(screen.getByText(topic)).toBeInTheDocument()
        })

        project.majors.forEach((major) => {
          const majorReferences = screen.getAllByText(major)
          expect(majorReferences.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('when user is admin, viewing students', () => {
    it('renders students with correct details', () => {
      render(
        <PostList
          postings={[mockOneStudent]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
      expect(screen.getByText(/Senior/i)).toBeInTheDocument()
      expect(screen.getByText(/Class of 2025/)).toBeInTheDocument()
      expect(screen.getByText(/aescudero@sandiego.edu/)).toBeInTheDocument()
      expect(screen.getByText(/Computer Science/)).toBeInTheDocument()
    })
    it('does not render email icon button', () => {
      render(
        <PostList
          postings={[mockOneStudent]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
          isOnFacultyProfile={false}
        />
      )

      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).not.toBeInTheDocument()
    })
  })

  describe('when user is admin, viewing projects', () => {
    it('renders all projects (active and inactive) with correct details', () => {
      const activeAndInactiveProjects = mockThreeActiveProjects.concat(mockTwoInactiveProjects)
      render(
        <PostList
          postings={activeAndInactiveProjects}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getAllByTestId('active-chip').length).toBe(3)
      expect(screen.getAllByTestId('inactive-chip').length).toBe(2)

      mockThreeActiveProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
        const nameRefs = screen.getAllByText(new RegExp(`${project.faculty.firstName} ${project.faculty.lastName}`, 'i'))
        expect(nameRefs.length).toBeGreaterThan(0)

        project.researchPeriods.forEach((period) => {
          const researchReferences = screen.queryAllByText(new RegExp(period))
          expect(researchReferences.length).toBeGreaterThan(0)
        })

        project.umbrellaTopics.slice(0, 3).forEach((topic) => {
          expect(screen.getByText(topic)).toBeInTheDocument()
        })

        project.majors.forEach((major) => {
          const majorReferences = screen.getAllByText(major)
          expect(majorReferences.length).toBeGreaterThan(0) // At least major for "Computer Science" exists in the mock data
        })
      })
      mockTwoInactiveProjects.forEach((project) => {
        expect(screen.getByText(project.name)).toBeInTheDocument()
        const nameRefs = screen.getAllByText(new RegExp(`${project.faculty.firstName} ${project.faculty.lastName}`, 'i'))
        expect(nameRefs.length).toBeGreaterThan(0)

        project.researchPeriods.forEach((period) => {
          const researchReferences = screen.queryAllByText(new RegExp(period))
          expect(researchReferences.length).toBeGreaterThan(0)
        })

        project.umbrellaTopics.slice(0, 3).forEach((topic) => {
          expect(screen.getByText(topic)).toBeInTheDocument()
        })

        project.majors.forEach((major) => {
          const majorReferences = screen.getAllByText(major)
          expect(majorReferences.length).toBeGreaterThan(0)
        })
      })
    })
    it('does not render email icon button', () => {
      render(
        <PostList
          postings={[mockOneActiveProject]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
          isOnFacultyProfile
        />
      )

      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).not.toBeInTheDocument()
    })
  })

  describe('when user is admin, viewing faculty', () => {
    it('renders all faculty with correct details', () => {
      render(
        <PostList
          postings={[mockOneFaculty]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
          isOnFacultyProfile={false}
        />
      )

      expect(screen.getByText(new RegExp(`${mockOneFaculty.firstName} ${mockOneFaculty.lastName}`, 'i'))).toBeInTheDocument()
      expect(screen.getByText(mockOneFaculty.email)).toBeInTheDocument()
    })
    it('does not render email icon button', () => {
      render(
        <PostList
          postings={[mockOneFaculty]}
          setSelectedPost={mockSetSelectedPost}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
          isOnFacultyProfile={false}
        />
      )

      const emailIcon = screen.queryByTestId('email-icon')
      expect(emailIcon).not.toBeInTheDocument()
    })
  })
})
