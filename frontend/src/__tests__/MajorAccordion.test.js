import React from 'react'
import { render, screen, act, within } from '@testing-library/react'
import MajorAccordion from '../components/MajorAccordion'
import { mockMajorNoPosts, mockMajorOnePost } from '../resources/mockData'

describe('MajorAccordion', function () {
  function getMockSetSelectedPost() {
    return jest.fn()
  }

  it('renders major name with 0 opportunities (student view)', function () {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent={true}
        isFaculty={false}
        isAdmin={false}
      />
    )
    expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument()
    expect(screen.getByText('(0 opportunities)')).toBeInTheDocument()
  })

  it('renders major name and posts when present (student view)', function () {
    render(
      <MajorAccordion
        major={mockMajorOnePost}
        numPosts={mockMajorOnePost.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent={true}
        isFaculty={false}
        isAdmin={false}
      />
    )

    // Find the expandable summary button
    const majorButton = screen.getByRole('button', {
      name: new RegExp(`${mockMajorOnePost.name}.*\\(${mockMajorOnePost.posts.length} opportunities\\)`, 'i')
    })

    expect(majorButton).toBeInTheDocument()
    expect(within(majorButton).getByText(mockMajorOnePost.name)).toBeInTheDocument()

    // Expand the accordion
    act(() => {
      majorButton.click()
    })

    // After expansion, find the region and check for the post name (student view renders post.name)
    const accordionRegion = screen.getByRole('region')
    expect(accordionRegion).toBeInTheDocument()

    const postName = mockMajorOnePost.posts[0].name
    expect(within(accordionRegion).getByText(postName)).toBeInTheDocument()
  })

  // New test for faculty view with no posts
  it('renders major name with correct label for faculty view (0 posts)', function () {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent={false}
        isFaculty={true}
        isAdmin={false}
      />
    )
    expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument()
    expect(screen.getByText('(0 students)')).toBeInTheDocument()
  })

  // Updated test for faculty view: verifies that the faculty details are rendered
  it('renders major name and posts when present for faculty view', function () {
    // Create a custom faculty post with the expected fields for faculty view
    const facultyPost = {
      id: 201,
      firstName: "Test",
      lastName: "User",
      classStatus: "Senior",
      graduationYear: 2025,
      email: "test@domain.com",
      majors: ["Sociology"],
      isActive: true
    }
    // Create a modified major object for faculty view using the faculty post
    const facultyMajor = {
      ...mockMajorOnePost,
      posts: [facultyPost]
    }

    render(
      <MajorAccordion
        major={facultyMajor}
        numPosts={facultyMajor.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent={false}
        isFaculty={true}
        isAdmin={false}
      />
    )

    // Find the expandable summary button with label showing "students"
    const majorButton = screen.getByRole('button', {
      name: new RegExp(`${facultyMajor.name}.*\\(${facultyMajor.posts.length} students\\)`, 'i')
    })

    expect(majorButton).toBeInTheDocument()
    expect(within(majorButton).getByText(facultyMajor.name)).toBeInTheDocument()

    // Expand the accordion
    act(() => {
      majorButton.click()
    })

    // After expansion, find the region and check for the faculty details
    const accordionRegion = screen.getByRole('region')
    expect(accordionRegion).toBeInTheDocument()

    // Check that the combined first and last name is rendered
    expect(within(accordionRegion).getByText("Test User")).toBeInTheDocument()
    expect(within(accordionRegion).getByText(/Class Status: Senior/)).toBeInTheDocument()
    expect(within(accordionRegion).getByText(/Graduation Year: 2025/)).toBeInTheDocument()
    expect(within(accordionRegion).getByText(/Email: test@domain.com/)).toBeInTheDocument()
    expect(within(accordionRegion).getByText(/Majors: Sociology/)).toBeInTheDocument()
  })
})
