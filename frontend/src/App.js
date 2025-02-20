/**
 * @file This file is the main entry point for the application and authentication.
 * Contains various routes for the app and the UI to display based on authentication status.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import MainLayout from './components/MainLayout'
import fetchPostings from './utils/fetchPostings' // we want to pass this into MainLayout so we can test that it gets called
import { backendUrl } from './resources/constants'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/Auth/RequireAuth'
import RequireProfile from './components/Auth/RequireProfile'
import RequireAuthAndNoProfile from './components/Auth/RequireAuthAndNoProfile.js'
import RoleSelection from './components/RoleSelection'
import StudentProfileForm from './components/StudentProfileForm'
import FacultyProfileForm from './components/FacultyProfileForm'
import InvalidEmail from './components/Auth/InvalidEmail'
import Logout from './components/Auth/Logout.js'
import LandingPage from './components/LandingPage'

function App () {
  const [isAuthenticated, setisAuthenticated] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFaculty, setIsFaculty] = useState(false)
  const [error505, setError505] = useState(false)
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
      setError505(true)
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
    // try {
    //   await fetch(`${backendUrl}/logout`, {
    //     credentials: 'include',
    //     method: 'POST',
    //     redirect: 'follow'
    //   })
    //   sessionStorage.clear()
    //   setisAuthenticated(false)
    //   setIsStudent(false)
    //   setIsFaculty(false)
    //   setIsAdmin(false)
    //   window.location.href = '/'
    // } catch (error) {
    //   console.error('Error logging out:', error)
    // }
  }

  if (loading) {
    return <div>Loading...</div> // TODO some other indicator
  }

  // Once authenticated, render MainLayout.
  return (

    <Routes>
      <Route
        path='/'
        element={<LandingPage handleLogin={handleLogin} />}
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
          <RequireAuthAndNoProfile isAuthenticated={isAuthenticated}>
            <FacultyProfileForm />
          </RequireAuthAndNoProfile>
      }
      />

      <Route
        path='/create-student-profile' element={
          <RequireAuthAndNoProfile isAuthenticated={isAuthenticated}>
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
              error505={error505}
              isAuthenticated={isAuthenticated}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              fetchPostings={fetchPostings}
              isStudent={isStudent}
              isFaculty={isFaculty}
              isAdmin={isAdmin}
            />
          </RequireProfile>
      }
      />

    </Routes>
  )
}

export default App
