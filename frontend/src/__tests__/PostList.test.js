import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostList from '../components/PostList'
import { mockThreeActiveProjects, mockTwoInactiveProjects } from '../resources/mockData'
import { noPostsMessage } from '../resources/constants'

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
        isStudent={true} // TODO
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders no active postings message if no ACTIVE postings exist', () => {
    render(
      <PostList
        postings={mockTwoInactiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={true} // TODO true
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  // TODO this test but renders students for faculty

  test('renders active postings with correct details for students', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={true} // true
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
        isStudent={true} // TODO
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

  // New test for faculty view:
  // Verifies that when isFaculty is true and isStudent is false,
  // the component renders firstName, lastName, classStatus, graduationYear, majors, and email.
  test('renders active postings with correct details for faculty', () => {
    const mockFacultyPostings = [
      {
        id: 0,
        firstName: "Augusto",
        lastName: "Escudero",
        email: "aescudero@sandiego.edu",
        classStatus: "Senior",
        graduationYear: 2025,
        majors: ["Computer Science"],
        isActive: true
      }
    ]

    render(
      <PostList
        postings={mockFacultyPostings}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
        isFaculty={true}
      />
    )

    expect(screen.getByText("Augusto Escudero")).toBeInTheDocument()
    expect(screen.getByText(/Class Status: Senior/)).toBeInTheDocument()
    expect(screen.getByText(/Graduation Year: 2025/)).toBeInTheDocument()
    expect(screen.getByText(/Email: aescudero@sandiego.edu/)).toBeInTheDocument()
    expect(screen.getByText(/Majors: Computer Science/)).toBeInTheDocument()
  })
})
