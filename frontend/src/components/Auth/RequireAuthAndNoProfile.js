/**
 * This component is responsible for protecting routes that require that the user is
 * (1) authenticated and (2) has no profile yet.
 * Ensures that parts of the app are protected. For example, you cannot go to /create-student-profile
 * or /create-professor-profile if you already have a profile. Sends client back to /posts if they try
 * to go to the create-profile screen but they already have a profile.
 * This component is used to wrap routes defined in App.js.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Navigate } from 'react-router-dom'

const RequireAuthAndNoProfile = ({ isAuthenticated, isStudent, isFaculty, isAdmin, children }) => {
  // Sends the user to the posts page if authenticated and no profile
  return isAuthenticated && !isFaculty && !isStudent && !isAdmin ? children : <Navigate to='/posts' replace />
}

export default RequireAuthAndNoProfile
