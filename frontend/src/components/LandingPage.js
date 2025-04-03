/**
 * @file Logic and renders for the LandingPage with a description. It redirects to the Login page if the user has not logged in.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 */

import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { customBlueColor } from '../resources/constants'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Arial Narrow',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      letterSpacing: '0.02em',
      lineHeight: 1
    }
  }
})

function LandingPage ({ handleLogin, checkAuthError, logoutError }) {
  const renderServerErrors = () => {
    let checkAuthErrorMessage = ''
    let logoutErrorMessage = ''
    if (checkAuthError) {
      checkAuthErrorMessage = 'Sorry, we are having trouble connecting you to the server. Please try again later.'
    }
    if (logoutError) {
      logoutErrorMessage = 'Sorry, we are having trouble logging you out. Please try again later.'
    }
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='20vh' sx={{ bgcolor: '#e0f7fa' }}>
        <Typography style={{ padding: '16px', color: 'red' }}>
          {checkAuthErrorMessage}
          {logoutErrorMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      {renderServerErrors()}
      <Box
        sx={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#e0f7fa'
        }}
      >
        <Box sx={{ pt: 4, textAlign: 'center', height: 300 }}>
          <Typography
            variant='h1'
            sx={{
              fontFamily: "'Arial Narrow', Arial, sans-serif",
              fontWeight: 900,
              fontSize: '15.5rem',
              color: customBlueColor,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: 0.9
            }}
          >
            Our Search
          </Typography>
          <Button
            data-testid='login-button' onClick={handleLogin}
            sx={{
              mt: 2,
              backgroundColor: '#3F4B58',
              borderRadius: '50px',
              color: '#fff',
              padding: '12px 36px',
              fontSize: '1.25rem',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#70869C'
              }
            }}
            variant='contained'
            size='large'
          >
            LOGIN
          </Button>
          <Typography
            variant='subtitle1'
            sx={{
              mt: 2,
              color: '#3F4B58',
              fontSize: '1rem',
              fontStyle: 'bold'
            }}
          >
            Must use your @sandiego.edu email to login
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FAF5ED',
          px: 2
        }}
      >
        <Box sx={{ maxWidth: 800, textAlign: 'center' }}>
          <Typography variant='body1' sx={{ color: '#333', mb: 3 }}>
            The SEARCH project enhances student-faculty collaboration at USD by
            streamlining research matching, enabling real-time connections,
            and improving efficiency through an intuitive web-based platform.
          </Typography>

          <Typography variant='h6' sx={{ color: 'customBlueColor', fontWeight: 'bold', mb: 1 }}>
            Streamlined Profiles
          </Typography>
          <Typography variant='body1' sx={{ color: '#333', mb: 3 }}>
            Students and faculty can create detailed profiles to showcase their
            interests and research opportunities.
          </Typography>

          <Typography variant='h6' sx={{ color: 'customBlueColor', fontWeight: 'bold', mb: 1 }}>
            Advanced Filtering
          </Typography>
          <Typography variant='body1' sx={{ color: '#333', mb: 3 }}>
            Search for opportunities or collaborators by department, keywords,
            availability, and more.
          </Typography>

          <Typography variant='h6' sx={{ color: 'customBlueColor', fontWeight: 'bold', mb: 1 }}>
            Real-Time Notifications
          </Typography>
          <Typography variant='body1' sx={{ color: '#333', mb: 3 }}>
            Stay updated with instant alerts for new matches, opportunities, or changes.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default LandingPage
