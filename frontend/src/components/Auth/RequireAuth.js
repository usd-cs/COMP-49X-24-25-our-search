/**
 * This component is responsible for protecting routes that require that the user is
 * (1) authenticated. Ensures that parts of the app are protected.
 * If the user is not authenticated, it redirects them to the landing page (/).
 * *
 * This component is used to wrap routes defined in App.js.
 * Note that user does NOT have to have a profile to access routes wrapped by this component.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Navigate } from 'react-router-dom'

const RequireProfile = ({ isAuthenticated, children }) => {
  // Sends the user to the Landing page if not authenticated
  return isAuthenticated ? children : <Navigate to='/' replace />
}

export default RequireProfile
