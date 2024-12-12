import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MajorAccordion from '../components/MajorAccordion'
import { mockMajorNoPosts, mockMajorOnePost } from '../resources/mockData'

describe('MajorAccordion', () => {
  const mockSetSelectedPost = jest.fn()

  test('renders major name', () => {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={mockSetSelectedPost}
        isStudent
      />
    )

    // Find the major name using test ID instead of text content
    // to account for multiple elements that include the name of the
    // major.
    const majorNameEl = screen.getByTestId('major-name')
    expect(majorNameEl).toHaveTextContent(mockMajorNoPosts.name)
    expect(screen.getByText('(0 opportunities)')).toBeInTheDocument()
  })

  test('renders posts for the major', async () => {
    render(
      <MajorAccordion
        major={mockMajorOnePost}
        numPosts={mockMajorOnePost.posts.length}
        setSelectedPost={mockSetSelectedPost}
        isStudent
      />
    )

    // Find the major name using test ID
    const majorNameEl = screen.getByTestId('major-name')
    expect(majorNameEl).toHaveTextContent(mockMajorOnePost.name)
    expect(screen.getByText('(1 opportunities)')).toBeInTheDocument()

    // Find and click the accordion summary
    const accordionButton = screen.getByRole('button')
    await userEvent.click(accordionButton)

    // After expansion, verify the post content
    const firstPostName = mockMajorOnePost.posts[0].name
    expect(screen.getByText(firstPostName)).toBeInTheDocument()
  })
})
