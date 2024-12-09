import React from 'react'
import { render, screen } from '@testing-library/react'
import { appTitle } from '../resources/constants'
import App from '../App'

describe('App', () => {
  test('renders app title', () => {
    render(<App />)

    const title = screen.getByRole('button', { name: appTitle })
    expect(title).toBeInTheDocument()
  })
})
