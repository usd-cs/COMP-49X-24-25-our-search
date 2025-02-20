import React from 'react'
import { render, screen } from '@testing-library/react'
import MainAccordion from '../components/MainAccordion'
import { errorLoadingPostingsMessage, noPostsMessage } from '../resources/constants'
import { mockResearchOps, viewStudentsFlag, viewProjectsFlag } from '../resources/mockData'

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

    // For Discipline Two, since no majors exist, the noPostsMessage should appear.
    expect(screen.getByText(noPostsMessage)).toBeInTheDocument()
  })

  test('renders majors for a discipline when they exist (student view)', () => {
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
                id: 101,
                name: 'Post 1',
                isActive: true,
                faculty: { firstName: 'Jane', lastName: 'Smith' },
                researchPeriods: ['Spring']
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
        isStudent
        isFaculty={false}
        isAdmin={false}
      />
    )
    // Verify that the major name is rendered (via MajorAccordion).
    expect(screen.getByText('Major A')).toBeInTheDocument()
  })

  test('renders discipline accordions and faculty post details when faculty view is students (faculy view)', () => {
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
        facultyView={viewStudentsFlag}
      />
    )
    // Verify discipline and major names.
    expect(screen.getByText('Discipline One')).toBeInTheDocument()
    expect(screen.getByText('Major A')).toBeInTheDocument()
    // In faculty view, the PostList should render the faculty details.
    expect(screen.getByText('Alice Wonder')).toBeInTheDocument()
    expect(screen.getByText(/Class Status: Senior/)).toBeInTheDocument()
    expect(screen.getByText(/Graduation Year: 2025/)).toBeInTheDocument()
    expect(screen.getByText(/Email: alice@example.com/)).toBeInTheDocument()
    expect(screen.getByText(/Majors: Sociology/)).toBeInTheDocument()
  })

  test('renders discipline accordions and faculty post details when faculty view is projects (faculty view)', () => {
    render(
      <MainAccordion
        postings={mockResearchOps}
        setSelectedPost={() => {}}
        isStudent={false}
        isFaculty
        isAdmin={false}
        facultyView={viewProjectsFlag}
      />
    )

    // the mockResearchOps has the word 'Computer Science' appearing 3 times, and 'Electrical Engineering' two times
    expect(screen.getAllByText('Computer Science')).toHaveLength(3)
    expect(screen.getAllByText('Electrical Engineering')).toHaveLength(2)
  })
})
