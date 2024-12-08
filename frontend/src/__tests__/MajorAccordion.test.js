import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import MajorAccordion from '../components/MajorAccordion'
import { mockMajorNoPosts, mockMajorOnePost } from '../resources/mockData'

describe('MajorAccordion', () => {
  const mockSetSelectedPost = jest.fn()

  test('renders major name', () => {
    render(<MajorAccordion
      major={mockMajorNoPosts}
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument()
  })

  test('renders posts for the major', () => {
    render(<MajorAccordion
      major={mockMajorOnePost}
      setSelectedPost={mockSetSelectedPost}
      isStudent
           />)

    const majorHeader = screen.getByText(mockMajorOnePost.name)
    expect(majorHeader).toBeInTheDocument()

    // Expand the accordion to check for posts
    act(() => {
      majorHeader.click()
      expect(screen.getByText(mockMajorOnePost.posts[0].name)).toBeInTheDocument() // refer to post[0] because there is only one post in this mock data
    })
  })
})
