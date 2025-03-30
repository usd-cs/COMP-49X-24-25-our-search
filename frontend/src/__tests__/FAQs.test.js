import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FAQs from '../components/FAQs'
import { getAllAdminFAQsResponse, getAllFacultyFAQsResponse, getAllStudentFAQsResponse } from '../resources/mockData'

// Wrap component with ThemeProvider and MemoryRouter
const renderWithTheme = (ui) => {
  const theme = createTheme()
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
    </ThemeProvider>
  )
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn()
}))

global.fetch = jest.fn()

// Helper to simulate backend responses
const mockFetch = (url, handlers) => {
  const handler = handlers.find((h) => url.includes(h.match))
  if (handler) {
    return Promise.resolve(handler.response)
  }
  return Promise.reject(new Error('Unknown URL'))
}

const fetchHandlers = [
  {
    match: '/all-student-faqs',
    method: 'GET',
    response: {
      ok: true,
      json: async () => getAllStudentFAQsResponse
    }
  },
  {
    match: '/all-faculty-faqs',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getAllFacultyFAQsResponse
    }
  },
  {
    match: '/all-admin-faqs',
    method: 'GET',
    response: {
      ok: true,
      status: 200,
      json: async () => getAllAdminFAQsResponse
    }
  }
]

describe('FAQs', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useNavigate.mockReturnValue(mockNavigate)
    fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
  })

  test(' ', async () => {
    renderWithTheme(<FAQs />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

  })

  describe('conditional rendering when it loads up', () => {

  })

  describe('deleting', () => {

  })

  describe('editing', () => {

  })

  describe('adding', () => {

  })

})