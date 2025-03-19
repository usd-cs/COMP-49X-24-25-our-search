import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostList from '../../components/posts/PostList'
import { mockOneActiveProject, mockThreeActiveProjects, mockTwoInactiveProjects } from '../../resources/mockData'
import { noPostsMessage, viewStudentsFlag, viewProjectsFlag } from '../../resources/constants'

describe('PostList', () => {
  const mockSetSelectedPost = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders no postings message if not a student or faculty', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty={false}
        isAdmin={false}
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
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders no active postings message if no ACTIVE postings exist', () => {
    render(
      <PostList
        postings={mockTwoInactiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty={false}
        isAdmin={false}
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders active postings with correct details (student view)', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )

    mockThreeActiveProjects.forEach((project) => {
      // Verify the project name
      expect(screen.getByText(project.name)).toBeInTheDocument()

      // Verify faculty name and research period using a more flexible approach
      const detailsText = screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes(project.faculty.firstName) &&
          content.includes(project.faculty.lastName) &&
          content.includes(project.researchPeriods)
        )
      })
      expect(detailsText).toBeInTheDocument()
    })
  })

  test('calls setSelectedPost when a card is clicked', async () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )

    const firstProject = mockThreeActiveProjects[0]
    const card = screen.getByText(firstProject.name).closest('.MuiCard-root')
    expect(card).not.toBeNull()

    // Use userEvent instead of fireEvent for better interaction simulation
    await userEvent.click(card)

    expect(mockSetSelectedPost).toHaveBeenCalledTimes(1)
    expect(mockSetSelectedPost).toHaveBeenCalledWith(firstProject)
  })

  test('renders active postings with correct details (faculty view is students)', () => {
    const mockFacultyPostings = [
      {
        id: 0,
        firstName: 'Augusto',
        lastName: 'Escudero',
        email: 'aescudero@sandiego.edu',
        classStatus: 'Senior',
        graduationYear: 2025,
        majors: ['Computer Science'],
        isActive: true
      }
    ]

    render(
      <PostList
        postings={mockFacultyPostings}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty
        isAdmin={false}
        postsView={viewStudentsFlag}
      />
    )

    expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
    expect(screen.getByText(/Class Status: Senior/)).toBeInTheDocument()
    expect(screen.getByText(/Graduation Year: 2025/)).toBeInTheDocument()
    expect(screen.getByText(/Email: aescudero@sandiego.edu/)).toBeInTheDocument()
    expect(screen.getByText(/Majors: Computer Science/)).toBeInTheDocument()
  })

  test('renders active postings with correct details (faculty view is projects)', () => {
    render(
      <PostList
        postings={[mockOneActiveProject]}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty
        isAdmin={false}
        postsView={viewProjectsFlag}
      />
    )

    expect(screen.getByText('AI Research')).toBeInTheDocument()
  })
})
