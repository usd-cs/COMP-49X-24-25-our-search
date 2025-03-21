import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AdminStudentEdit from '../../components/admin/AdminStudentEdit'
import { getStudentExpectedResponse, putStudentExpectedRequest,
  getResearchPeriodsExpectedResponse, getMajorsExpectedResponse
 } from '../../resources/mockData'

 // Wrap component with ThemeProvider and MemoryRouter
 const renderWithTheme = (ui) => {
   const theme = createTheme()
   return render(
     <ThemeProvider theme={theme}>
       <MemoryRouter initialEntries={[`/faculty/${getFacultyExpectedResponse.id}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>
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
     match: '/',
     method: 'GET',
     response: {
       ok: true,
       json: async () => 
     }
   },
   {
     match: '/student',
     method: 'GET',
     response: {
       ok: true,
       status: 200,
       json: async () => 
     }
   },
   {
     match: '/student/',
     method: 'PUT',
     response: {
       ok: true,
       status: 200,
       json: async () => 
     }
   }
 ]

 describe('AdminStudentEdit', () => {
   const mockNavigate = jest.fn()
 
   beforeEach(() => {
     jest.clearAllMocks()
     useNavigate.mockReturnValue(mockNavigate)
     useParams.mockReturnValue({ id: getFacultyExpectedResponse.id })
     fetch.mockImplementation((url) => mockFetch(url, fetchHandlers))
   })

 })