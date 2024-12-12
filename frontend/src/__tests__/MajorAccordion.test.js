import React from 'react'
import { render, screen, act, within } from '@testing-library/react'
import MajorAccordion from '../components/MajorAccordion'
import { mockMajorNoPosts, mockMajorOnePost } from '../resources/mockData'

describe('MajorAccordion', function () {
  function getMockSetSelectedPost () {
    return jest.fn()
  }

  it('renders major name with 0 opportunities', function () {
    render(
      <MajorAccordion
        major={mockMajorNoPosts}
        numPosts={mockMajorNoPosts.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent
      />
    )
    expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument()
    expect(screen.getByText('(0 opportunities)')).toBeInTheDocument()
  })

  it('renders major name and posts when present', function () {
    render(
      <MajorAccordion
        major={mockMajorOnePost}
        numPosts={mockMajorOnePost.posts.length}
        setSelectedPost={getMockSetSelectedPost()}
        isStudent
      />
    )

    // Find the expandable summary button
    const majorButton = screen.getByRole('button', {
      name: new RegExp(`${mockMajorOnePost.name}.*\\(${mockMajorOnePost.posts.length} opportunities\\)`, 'i')
    })

    expect(majorButton).toBeInTheDocument()

    // Check for the major name within the summary (button)
    expect(within(majorButton).getByText(mockMajorOnePost.name)).toBeInTheDocument()

    // Expand the accordion
    act(() => {
      majorButton.click()
    })

    // After expansion, find the region and check for the post name
    const accordionRegion = screen.getByRole('region')
    expect(accordionRegion).toBeInTheDocument()

    const postName = mockMajorOnePost.posts[0].name
    expect(within(accordionRegion).getByText(postName)).toBeInTheDocument()
  })
})
