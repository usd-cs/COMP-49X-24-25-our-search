import React, { useState } from 'react'
import MainLayout from './components/MainLayout'
import LandingPage from './components/LandingPage' // make sure this path is correct
import fetchPostings from './utils/fetchPostings' // we want to pass this into MainLayout so we can test that it gets called

function App () {
  const [isStudent] = useState(true) // hardcoded to true for sprint 1
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    // TODO Logic
    // For demonstration, we'll simply update the authentication state.
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <LandingPage
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
      />
    )
  }

  // Once authenticated, render MainLayout.
  return (
    <MainLayout
      isStudent={isStudent}
      fetchPostings={fetchPostings}
    />
  )
}

export default App
