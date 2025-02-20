import React from 'react'
import { render, screen, act, within } from '@testing-library/react'
import MajorAccordion from '../components/MajorAccordion'
import { mockMajorNoPosts, mockMajorOnePost, mockMajorOneStudent } from '../resources/mockData'

describe('MajorAccordion', function () {
  function getMockSetSelectedPost () {
    return jest.fn()
  }

  it('renders major name with 0 opportunities (student view)', function () {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent
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
        isStudent
        isFaculty={false}
        isAdmin={false}
        facultyView='projects'
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
  it('renders major name with 0 opportunities (faculty view)', function () {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent={false}
        isFaculty
        isAdmin={false}
        facultyView='students'
      />
    )
    expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument()
    expect(screen.getByText('(0 students)')).toBeInTheDocument()
  })

  it('renders major name and posts when present (faculty view, students)', function () {
    render(
      <MajorAccordion
        isStudent={false}
        isFaculty
        isAdmin={false}
        facultyView='students'
        major={mockMajorOneStudent}
        numPosts={mockMajorOneStudent.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
      />
    )

    // Find the expandable summary button with label showing "students"
    const majorButton = screen.getByRole('button', {
      name: new RegExp(`${mockMajorOneStudent.name}.*\\(${mockMajorOneStudent.posts.length} students\\)`, 'i')
    })

    expect(majorButton).toBeInTheDocument()

    // Expand the accordion
    act(() => {
      majorButton.click()
    })

    // After expansion, find the region and check for the student details
    const accordionRegion = screen.getByRole('region')
    expect(accordionRegion).toBeInTheDocument()

    // Check that the combined first and last name is rendered
    expect(within(accordionRegion).getByText('Augusto Escudero')).toBeInTheDocument()
  })

  it('renders major name and posts when present (faculty view, projects)', function () {
    render(
      <MajorAccordion
        isStudent={false}
        isFaculty
        isAdmin={false}
        facultyView='projects'
        major={mockMajorOnePost}
        numPosts={mockMajorOnePost.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
      />
    )

    // Find the expandable summary button with label showing "students"
    const majorButton = screen.getByRole('button', {
      name: new RegExp(`${mockMajorOnePost.name}.*\\(${mockMajorOnePost.posts.length} opportunities\\)`, 'i')
    })

    expect(majorButton).toBeInTheDocument()

    // Expand the accordion
    act(() => {
      majorButton.click()
    })

    // After expansion, find the region and check for the student details
    const accordionRegion = screen.getByRole('region')
    expect(accordionRegion).toBeInTheDocument()

    const postName = mockMajorOnePost.posts[0].name
    expect(within(accordionRegion).getByText(postName)).toBeInTheDocument()
  })
})
