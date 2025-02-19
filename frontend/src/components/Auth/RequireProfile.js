/**
 * This component is responsible for protecting routes that require that the user is
 * (1) authenticated and (2) has a profile. Ensures that parts of the app are protected.
 * If the user is not authenticated and does not have a profile, it redirects them to the landing page (/).
 * This component is used to wrap routes defined in App.js.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Navigate } from 'react-router-dom'

const RequireProfile = ({ isAuthenticated, isStudent, isFaculty, isAdmin, children }) => {
  // Sends the user to the Landing page if not authenticated and no profile
  return isAuthenticated && (isFaculty || isStudent || isAdmin) ? children : <Navigate to='/' replace />
}

export default RequireProfile
