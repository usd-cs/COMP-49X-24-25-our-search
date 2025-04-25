/**
 * @file This file is the main entry point for the application and authentication.
 * Contains various routes for the app and the UI to display based on authentication status.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import { BACKEND_URL, FRONTEND_URL } from './resources/constants'
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
import ResearchOpportunityForm from './components/projects/ResearchOpportunityForm.js'
import AdminFacultyEdit from './components/admin/AdminFacultyEdit.js'
import ManageVariables from './components/admin/ManageVariables.js'
import AdminStudentEdit from './components/admin/AdminStudentEdit.js'
import ProjectEdit from './components/projects/ProjectEdit.js'
import AdminEmailNotifications from './components/admin/AdminEmailNotification.js'
import FAQs from './components/FAQs.js'
import SharedLayout from './components/navigation/SharedLayout.js'

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
    if (window.Cypress) {
      console.log("Cypress Window - Bypassing Authentication");
      setisAuthenticated(true);
      setIsStudent(false);
      setIsFaculty(true);
      setIsAdmin(false);
      setLoading(false);
    } else {
      checkAuthStatus();
    }
  }, []);

  // Calls the backend to check if the user is logged in
  // Sets 'isAuthenticated', 'isStudent', 'isFaculty', and 'isAdmin' variables accordingly
  const checkAuthStatus = async () => {

    console.log(BACKEND_URL)
    try {
      const response = await fetch(`${BACKEND_URL}/check-auth`, {
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
    if (isAuthenticated) {
      window.location.href = `${FRONTEND_URL}/posts`
    } else {
      window.location.href = `${BACKEND_URL}`
    }
  }

  // Calls the backend to logout
  // Clears the session storage to wipe all memory of user who was previously logged in
  const handleLogout = async () => {
    try {
      setisAuthenticated(false)
      setIsStudent(false)
      setIsFaculty(false)
      setIsAdmin(false)

      window.location.href = BACKEND_URL + '/logout'
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

  return (
    <Routes>
      <Route
        path='/disciplines-and-majors'
        element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <ManageVariables showingDisciplinesAndMajors />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

      <Route
        path='/other-app-vars'
        element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <ManageVariables showingDepartments showingResearchPeriods showingUmbrellaTopics />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

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
            <SharedLayout
              isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}
              showingPosts
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
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <StudentProfileView />
            </SharedLayout>
          </RequireStudentProfile>
      }
      />

      <Route
        path='/edit-student-profile' element={
          <RequireStudentProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <StudentProfileEdit />
            </SharedLayout>
          </RequireStudentProfile>
      }
      />

      <Route
        path='/view-professor-profile' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <FacultyProfileView />
            </SharedLayout>
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/edit-professor-profile' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <FacultyProfileEdit />
            </SharedLayout>
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/create-project' element={
          <RequireFacultyProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <ResearchOpportunityForm />
            </SharedLayout>
            <TitleButton />
          </RequireFacultyProfile>
      }
      />

      <Route
        path='/faculty/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <AdminFacultyEdit />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

      <Route
        path='/project/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <ProjectEdit />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

      <Route
        path='/student/:id' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <AdminStudentEdit />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

      <Route
        path='/email-notifications' element={
          <RequireAdminProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <AdminEmailNotifications />
            </SharedLayout>
          </RequireAdminProfile>
      }
      />

      <Route
        path='/student-faqs' element={
          <RequireProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <FAQs showingStudentFAQs />
            </SharedLayout>
          </RequireProfile>
      }
      />

      <Route
        path='/faculty-faqs' element={
          <RequireProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <FAQs showingFacultyFAQs />
            </SharedLayout>
          </RequireProfile>
      }
      />

      <Route
        path='/admin-faqs' element={
          <RequireProfile
            isAuthenticated={isAuthenticated}
            isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin}
          >
            <SharedLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout}>
              <FAQs showingAdminFAQs showingStudentFAQs showingFacultyFAQs isAdmin />
            </SharedLayout>
          </RequireProfile>
      }
      />

    </Routes>
  )
}

export default App
