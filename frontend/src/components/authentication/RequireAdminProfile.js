/**
 * This component is responsible for protecting routes that require that the user is
 * (1) authenticated and (2) has an admin profile only. Ensures that parts of the app
 * are protected. For example, you cannot go to /student/:id to edit a specific
 * student's information if you are not an admin.
 * Sends client back to /posts if they try to go to any unprotected screen
 * This component is used to wrap routes defined in App.js.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Navigate } from 'react-router-dom'

const RequireAdminProfile = ({ isAuthenticated, isStudent, isFaculty, isAdmin, children }) => {
  // Sends the user to the posts page if not an authenticated student
  return isAuthenticated && isAdmin && !isFaculty && !isStudent ? children : <Navigate to='/posts' replace />
}

export default RequireAdminProfile
