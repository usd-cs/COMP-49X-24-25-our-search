import React from 'react'
import { render, screen } from '@testing-library/react'
import MainAccordion from '../components/MainAccordion'
import { errorLoadingPostingsMessage, NO_MAJORS_MSG, viewFacultyFlag, viewStudentsFlag, viewProjectsFlag } from '../resources/constants'
import { mockResearchOps, getAllFacultyExpectedResponse, mockStudents } from '../resources/mockData'

describe('MainAccordion', () => {
  test('renders error message when no postings are provided', () => {
    render(
      <MainAccordion
        postings={[]}
        setSelectedPost={() => {}}
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )
    expect(screen.getByText(errorLoadingPostingsMessage)).toBeInTheDocument()
  })

  describe('when user is student', () => {
    test('renders discipline accordions when postings exist (student view)', () => {
      const mockPostings = [
        {
          id: 1,
          name: 'Discipline One',
          majors: [
            {
              id: 10,
              name: 'Major A',
              posts: [] // No posts in Major A
            },
            {
              id: 11,
              name: 'Major B',
              posts: [
                {
                  id: 101,
                  name: 'Post 1',
                  isActive: true,
                  faculty: { firstName: 'John', lastName: 'Doe' },
                  researchPeriods: ['Fall']
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'Discipline Two',
          majors: [] // No majors for Discipline Two
        }
      ]

      render(
        <MainAccordion
          postings={mockPostings}
          setSelectedPost={() => {}}
          isStudent
          isFaculty={false}
          isAdmin={false}
        />
      )

      expect(screen.getByText('Discipline One')).toBeInTheDocument()
      expect(screen.getByText('Discipline Two')).toBeInTheDocument()

      // For Discipline Two, since no majors exist, the NO_MAJORS_MSG should appear.
      expect(screen.getByText(NO_MAJORS_MSG)).toBeInTheDocument()
    })
  })

  describe('when user is faculty', () => {
    test('renders discipline accordions and student post details when view is students (faculty view)', () => {
      const mockPostings = [
        {
          id: 1,
          name: 'Discipline One',
          majors: [
            {
              id: 10,
              name: 'Major A',
              posts: [
                {
                  id: 201,
                  // For faculty view, the PostList renders the faculty details instead of the post name.
                  firstName: 'Alice',
                  lastName: 'Wonder',
                  classStatus: 'Senior',
                  graduationYear: 2025,
                  email: 'alice@example.com',
                  majors: ['Sociology'],
                  isActive: true
                }
              ]
            }
          ]
        }
      ]
      render(
        <MainAccordion
          postings={mockPostings}
          setSelectedPost={() => {}}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewStudentsFlag}
        />
      )
      // Verify discipline and major names.
      expect(screen.getByText('Discipline One')).toBeInTheDocument()
      expect(screen.getByText('Major A')).toBeInTheDocument()
    })

    test('renders discipline accordions and project post details when view is projects (faculty view)', () => {
      render(
        <MainAccordion
          postings={mockResearchOps}
          setSelectedPost={() => {}}
          isStudent={false}
          isFaculty
          isAdmin={false}
          postsView={viewProjectsFlag}
        />
      )

      // the mockResearchOps has the word 'Computer Science' appearing 3 times,
      // and 'Electrical Engineering' 1 time (once for each accordion)
      expect(screen.getAllByText('Computer Science')).toHaveLength(3)
      expect(screen.getAllByText('Electrical Engineering')).toHaveLength(1)
    })
  })

  describe('when user is admin', () => {
    test('renders discipline accordions and student post details when view is students (admin view)', () => {
      render(
        <MainAccordion
          postings={mockStudents}
          setSelectedPost={() => {}}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewStudentsFlag}
        />
      )

      expect(screen.getByText(mockStudents[0].name)).toBeInTheDocument()
      expect(screen.getByText(mockStudents[1].name)).toBeInTheDocument()
      // mockStudents mentions Computer Science 3 times for the first student's major/research field interests
      expect(screen.getAllByText('Computer Science')).toHaveLength(3)
    })

    test('renders discipline accordions and project post details when view is projects (admin view)', () => {
      render(
        <MainAccordion
          postings={mockResearchOps}
          setSelectedPost={() => {}}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewProjectsFlag}
        />
      )

      // the mockResearchOps has the word 'Computer Science' appearing 3 times
      expect(screen.getAllByText('Computer Science')).toHaveLength(3)
    })

    test('renders department accordions and faculty post details when view is faculty (admin view)', () => {
      render(
        <MainAccordion
          postings={getAllFacultyExpectedResponse}
          setSelectedPost={() => {}}
          isStudent={false}
          isFaculty={false}
          isAdmin
          postsView={viewFacultyFlag}
        />
      )

      // the first part of the mockData is a mock of a department with no faculty so the name will only appear once (0 faculty in the mockData)
      expect(screen.getAllByText(getAllFacultyExpectedResponse[0].name)).toHaveLength(1)
      // second department name appears 2 times because there is the title and 1 faculty in the mockdata
      expect(screen.getAllByText(getAllFacultyExpectedResponse[2].name)).toHaveLength(2)
    })
  })
})
