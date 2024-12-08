import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PostList from '../components/PostList'
import { mockThreeActiveProjects, mockTwoInactiveProjects } from '../resources/mockData'
import { noPostsMessage } from '../resources/constants'

describe('PostList', () => {
  const mockSetSelectedPost = jest.fn()

  test('renders the names, research periods, and faculty info of all projects if isStudent', () => {
    render(<PostList
      postings={mockThreeActiveProjects}
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    mockThreeActiveProjects.forEach((project) => { // all of these should render because they are all active
      const rowText = `${project.name} ${project.researchPeriods} ${project.faculty.firstName} ${project.faculty.lastName} ${project.faculty.email}`
      const row = screen.getByRole('row', { name: rowText })

      expect(row).toHaveTextContent(project.name)
      expect(row).toHaveTextContent(project.researchPeriods)
      expect(row).toHaveTextContent(project.faculty.lastName)
      expect(row).toHaveTextContent(project.faculty.email)
    })
  })

  test('renders message if no students/research opportunities exist', () => {
    render(<PostList
      postings={[]} // An empty array for no postings
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders message if no ACTIVE students/research opportunities exist', () => {
    render(<PostList
      postings={mockTwoInactiveProjects}
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('calls setSelectedPost if one if the postings is clicked', () => {
    render(<PostList
      postings={mockThreeActiveProjects}
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    const firstMockProject = mockThreeActiveProjects[0]
    const firstMockName = `${firstMockProject.name} ${firstMockProject.researchPeriods} ${firstMockProject.faculty.firstName} ${firstMockProject.faculty.lastName} ${firstMockProject.faculty.email}`
    const tableRow = screen.getByRole('row', { name: firstMockName })
    fireEvent.click(tableRow)

    expect(mockSetSelectedPost).toHaveBeenCalledTimes(1)
    expect(mockSetSelectedPost).toHaveBeenCalledWith(mockThreeActiveProjects[0])
  })
})
