import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostDialog from '../components/PostDialog'
import { mockOneActiveProject, mockOneStudent } from '../resources/mockData'

describe('PostDialog Component', () => {
  describe('when user is a student', () => {
    it('renders the project details correctly for a student view (showing project info)', () => {
      render(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={true}
          isFaculty={false}
          isAdmin={false}
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
      render(
        <PostDialog
          onClose={() => {}}
          post={mockOneStudent}
          isStudent={false}
          isFaculty={true}
          isAdmin={false}
          facultyView={'students'}
        />
      )

      expect(screen.getByText('Test reason')).toBeInTheDocument()
      expect(screen.getByText('Augusto Escudero')).toBeInTheDocument()
      expect(screen.getByText('aescudero@sandiego.edu')).toBeInTheDocument()
      expect(screen.getByText('Computer Science')).toBeInTheDocument()
    })

    it('renders the project details correctly (faculty view is projects)', () => {
      render(
        <PostDialog
          onClose={() => {}}
          post={mockOneActiveProject}
          isStudent={false}
          isFaculty={true}
          isAdmin={false}
          facultyView={'projects'}
        />
      )

      expect(screen.getByText('AI Research')).toBeInTheDocument()
    })
  })

  it('renders the close button and triggers onClose when clicked', () => {
    const handleClose = jest.fn()
    render(
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

  it('does not render when project is null', () => {
    const { container } = render(
      <PostDialog onClose={() => {}} post={null} userType='student' />
    )
    expect(container.firstChild).toBeNull()
  })
})
