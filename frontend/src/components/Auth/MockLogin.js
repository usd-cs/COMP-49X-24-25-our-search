// This component renders the landing page with a centered login button.
//
// - Uses the `useAuth` hook to access the `handleLogin` function.
// - The login button triggers the authentication process.
// - Allows users to log in with the backend.

import React from 'react'
import { Button, Box } from '@mui/material'

function MockLogin ({ handleLogin }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
      }}
    >
      This is a placeholder. 
      <Button
        variant='contained'
        color='primary'
        disableRipple
        disableElevation
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  )
}

export default MockLogin