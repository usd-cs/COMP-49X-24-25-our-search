/**
 * @file This file is the main entry point for the application and authentication.
 * Contains various routes for the app and the UI to display based on authentication status.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import MainLayout from './components/MainLayout'
import { backendUrl } from './resources/constants'
import { Routes, Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import RequireAuth from './components/authentication/RequireAuth'
import RequireProfile from './components/authentication/RequireProfile'
import RequireAuthAndNoProfile from './components/authentication/RequireAuthAndNoProfile.js'
import RequireStudentProfile from './components/authentication/RequireStudentProfile.js'
import RequireAdminProfile from './components/authentication/RequireAdminProfile.js'
import RoleSelection from './components/authentication/RoleSelection.js'
import StudentProfileForm from './components/profiles/StudentProfileForm'
import FacultyProfileForm from './components/profiles/FacultyProfileForm'
import InvalidEmail from './components/authentication/InvalidEmail'
import Logout from './components/authentication/Logout.js'
import LandingPage from './components/LandingPage'
import StudentProfileView from './components/profiles/StudentProfileView.js'
import StudentProfileEdit from './components/profiles/StudentProfileEdit.js'
import TitleButton from './components/navigation/TitleButton.js'
import RequireFacultyProfile from './components/authentication/RequireFacultyProfile.js'
import FacultyProfileView from './components/profiles/FacultyProfileView.js'
import FacultyProfileEdit from './components/profiles/FacultyProfileEdit.js'
import ResearchOpportunityForm from './components/ResearchOpportunityForm.js'
import AdminFacultyEdit from './components/admin/AdminFacultyEdit.js'
import AdminStudentEdit from './components/admin/AdminStudentEdit.js'
import ProjectEdit from './components/projects/ProjectEdit.js'
import AdminEmailNotifications from './components/admin/AdminEmailNotification.js'

function App () {
  const [isAuthenticated, setisAuthenticated] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFaculty, setIsFaculty] = useState(false)
  const [checkAuthError, setCheckAuthError] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const [loading, setLoading] = useState(true) // Loading state is required to ensure that nothing loads until the call to the backend has returned a response.

  // Fire these methods when the app loads
  useEffect(() => {
    checkAuthStatus() // Need to check if user is logged in
  }, [])

  // Calls the backend to check if the user is logged in
  // Sets 'isAuthenticated', 'isStudent', 'isFaculty', and 'isAdmin' variables accordingly
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/check-auth`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        console.log('check auth error')
        throw new Error('Failed to fetch authentication status')
      }

      const data = await response.json()
      if (data.isAuthenticated === 'true') {
        setisAuthenticated(true)
        if (data.isStudent === 'true') {
          setIsStudent(true)
        } else if (data.isFaculty === 'true') {
          setIsFaculty(true)
        } else if (data.isAdmin === 'true') {
          setIsAdmin(true)
        }
      }
      // else isAuthenticated is false
    } catch (error) {
      console.error('Error fetching checking authentication status:', error)
      setCheckAuthError(true)
    } finally {
      setLoading(false) // Set loading to false when check is done
    }
  }

  // Redirect to the backend for login
  const handleLogin = () => {
    window.location.href = `${backendUrl}`
  }

  // Calls the backend to logout
  // Clears the session storage to wipe all memory of user who was previously logged in
  const handleLogout = async () => {
    try {
      setisAuthenticated(false)
      setIsStudent(false)
      setIsFaculty(false)
      setIsAdmin(false)

      window.location.href = backendUrl + '/logout'
    } catch (error) {
      console.error(error)
      setLogoutError(true)
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  // Once authenticated, render MainLayout.
  return (

    <Routes>
      <Route
        path='/'
        element={<LandingPage handleLogin={handleLogin} checkAuthError={checkAuthError} logoutError={logoutError} />}
      />

      <Route
        path='/invalid-email'
        element={<InvalidEmail />}
      />

      <Route
        path='/logout'
        element={<Logout />}
      />

      <Route
        path='/ask-for-role' element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <RoleSelection />
          </RequireAuth>
      }
      />

      <Route
        path='/create-professor-profile' element={
          <RequireAuthAndNoProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <FacultyProfileForm />
          </RequireAuthAndNoProfile>
      }
      />

      <Route
        path='/create-student-profile' element={
          <RequireAuthAndNoProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <StudentProfileForm />
          </RequireAuthAndNoProfile>
      }
      />

      <Route
        path='/posts' element={
          <RequireProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <MainLayout
              isAuthenticated={isAuthenticated}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              isStudent={isStudent}
              isFaculty={isFaculty}
              isAdmin={isAdmin}
            />
          </RequireProfile>
      }
      />

      <Route
        path='/view-student-profile' element={
          <RequireStudentProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <StudentProfileView />
          </RequireStudentProfile>
      }
      />

      <Route
        path='/edit-student-profile' element={
          <RequireStudentProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <StudentProfileEdit />
          </RequireStudentProfile>
      }
      />

      <Route
        path='/view-professor-profile' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <FacultyProfileView />
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/edit-professor-profile' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <FacultyProfileEdit />
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/create-project' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <ResearchOpportunityForm />
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/faculty/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <AdminFacultyEdit />
          </RequireAdminProfile>
      }
      />

      <Route
        path='/project/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <ProjectEdit />
          </RequireAdminProfile>
      }
      />

      <Route
        path='/student/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <AdminStudentEdit />
          </RequireAdminProfile>
      }
      />

      <Route
        path='/email-notifications' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            <AdminEmailNotifications />
          </RequireAdminProfile>
      }
      />

      <Route
        path='/email-faculty/:email' element={
          <RequireProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <TitleButton />
            {/* TODO in later sprint */}
          </RequireProfile>
      }
      />

    </Routes>
  )
}

export default App
