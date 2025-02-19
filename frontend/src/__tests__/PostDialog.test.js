import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostDialog from '../components/PostDialog'
import { mockOneActiveProject, mockProjectForFaculty } from '../resources/mockData'

describe('PostDialog Component', () => {
  it('renders the project details correctly for a student view', () => {
    render(
      <PostDialog
        onClose={() => {}}
        post={mockOneActiveProject}
        userType='student'
      />
    )

    // Title
    expect(screen.getByText('AI Research')).toBeInTheDocument()

    // Description
    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument()

    // Desired Qualifications
    expect(screen.getByText('Qualifications:')).toBeInTheDocument()
    expect(
      screen.getByText('Experience in Python and AI frameworks.')
    ).toBeInTheDocument()

    // Umbrella Topics
    expect(screen.getByText('Topics:')).toBeInTheDocument()
    expect(screen.getByText('AI, Education')).toBeInTheDocument()

    // Research Periods
    expect(screen.getByText('Periods:')).toBeInTheDocument()
    expect(screen.getByText('Spring 2024, Fall 2024')).toBeInTheDocument()

    // Status
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()

    // Faculty info should be rendered for a student view
    expect(screen.getByText('Faculty:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@sandiego.edu')).toBeInTheDocument()

    // In the student view, we assume that the majors label is not rendered separately.
    expect(screen.queryByText('Majors:')).not.toBeInTheDocument()
  })

  describe('PostDialog Component', () => {
    describe('when user is a student', () => {
      it('renders the project details correctly for a student view (showing faculty info)', () => {
        render(
          <PostDialog
            onClose={() => {}}
            post={mockOneActiveProject}
            userType='student'
          />
        )

        expect(screen.getByText('AI Research')).toBeInTheDocument()
        expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument()

        expect(screen.getByText('Faculty:')).toBeInTheDocument()
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('john.doe@sandiego.edu')).toBeInTheDocument()

        // Ensure that no student information is rendered
        expect(screen.queryByText(/Students:/)).not.toBeInTheDocument()
      })
    })

    describe('when user is a faculty', () => {
      it('renders the project details correctly for a faculty view (showing student info)', () => {
        render(
          <PostDialog
            onClose={() => {}}
            post={mockProjectForFaculty}
            userType='faculty'
          />
        )

        // Title and Description
        expect(screen.getByText('AI Research')).toBeInTheDocument()
        expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument()

        expect(
          screen.getByText('Computer Science Students:')
        ).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('jane.smith@sandiego.edu')).toBeInTheDocument()
        expect(screen.getByText('Senior')).toBeInTheDocument()
        expect(screen.getByText('2025')).toBeInTheDocument()

        expect(screen.getByText('Education Students:')).toBeInTheDocument()
        expect(screen.getAllByText('No students found.').length).toBeGreaterThanOrEqual(1)

        // Faculty info should not be rendered
        expect(screen.queryByText('Faculty:')).not.toBeInTheDocument()
      })
    })

    it('renders the close button and triggers onClose when clicked', () => {
      const handleClose = jest.fn()
      render(
        <PostDialog
          onClose={handleClose}
          post={mockOneActiveProject}
          userType='student'
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
})
