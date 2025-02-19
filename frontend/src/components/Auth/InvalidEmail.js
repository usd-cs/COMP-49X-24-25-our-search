/**
 * @file Renders a message if the user tried logging in with an invalid email.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Button, Typography, Box, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const InvalidEmail = () => {
  const navigate = useNavigate()

  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
      <Paper elevation={8} sx={{ padding: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant='h6' gutterBottom>
          Please use a valid USD email address (e.g., example@sandiego.edu) and try again.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/')}
          sx={{ marginTop: 2 }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  )
}

export default InvalidEmail
