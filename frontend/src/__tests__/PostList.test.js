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

  test('renders no postings message if not a student', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent={false}
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders no postings message if there are no postings', () => {
    render(
      <PostList
        postings={[]}
        setSelectedPost={mockSetSelectedPost}
        isStudent
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders no active postings message if no ACTIVE postings exist', () => {
    render(
      <PostList
        postings={mockTwoInactiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent
      />
    )

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders active postings with correct details for students', () => {
    render(
      <PostList
        postings={mockThreeActiveProjects}
        setSelectedPost={mockSetSelectedPost}
        isStudent
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
})
