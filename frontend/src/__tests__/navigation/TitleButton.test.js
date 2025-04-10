import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TitleButton from '../../components/navigation/TitleButton'
import { APP_TITLE, FRONTEND_URL } from '../../resources/constants'

describe('TitleButton', () => {
  beforeEach(() => {
    // Mocking `window.location.href` to avoid actual navigation
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' } // Initialize with an empty string
    })
  })

  afterEach(() => {
    jest.restoreAllMocks() // Restoring the original implementation of `window.location` after the test
  })

  test('renders the app title button', () => {
    render(<TitleButton />)

    const titleButton = screen.getByRole('button', { name: APP_TITLE })
    expect(titleButton).toBeInTheDocument()
  })

  test('sends the page location to /posts if button is clicked', () => {
    render(<TitleButton />)

    const titleButton = screen.getByRole('button', { name: APP_TITLE })
    fireEvent.click(titleButton)

    expect(window.location.href).toBe(FRONTEND_URL + '/posts') // Match the correct URL
  })
})
