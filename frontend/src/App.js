/**
 * @file the main entry point for the application and authentication.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import MainLayout from './components/MainLayout'
import LandingPage from './components/LandingPage' // make sure this path is correct
import fetchPostings from './utils/fetchPostings' // we want to pass this into MainLayout so we can test that it gets called
import { backendUrl } from './resources/constants'
// import LandingPage from './components/LandingPage'

function App () {
  const [isAuthenticated, setisAuthenticated] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFaculty, setIsFaculty] = useState(false)
  const [error505, setError505] = useState(false)

  // always check with the backend to see if the user is authenticated when the app loads
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Calls the backend to check if the user is logged in
  // Sets 'isAuthenticated', 'isStudent', 'isFaculty', and 'isAdmin' variables accordingly
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/check-auth`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch authentication status')
      }

      const data = await response.json()
      const isLoggedIn = data.isAuthenticated
      if (isLoggedIn === 'true') {
        setisAuthenticated(true)
        if (data.isStudent === 'true') {
          setIsStudent(true)
        } else if (data.isFaculty === 'true') {
          setIsFaculty(true)
        } else if (data.isAdmin === 'true') {
          setIsAdmin(true)
        }
      } else {
        setisAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking authentication status:', error)
      setError505(true)
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
      await fetch(`${backendUrl}/logout`, {
        credentials: 'include',
        method: 'POST',
        redirect: 'follow'
      })
      sessionStorage.clear()
      setisAuthenticated(false)
      setIsStudent(false)
      setIsFaculty(false)
      setIsAdmin(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <LandingPage
        handleLogin={handleLogin}
      />
    )
  }

  // Once authenticated, render MainLayout.
  return (
    // if not authenticated, render the landing page, which prompts the user to login
    // else render the main layout
    <>
      {!isAuthenticated
        ? (
          <div>Landing/login page will go here</div>
          )
        : (
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
          )}
    </>
  )
}

export default App
