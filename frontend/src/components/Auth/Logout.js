/**
 * @file Renders a message that the user successfully logged out and a button to go back to landing page/login screen.
 *
 * @author Natalie Jungquist
 */

import React from 'react'
import { Button, Typography, Box, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
      <Paper elevation={8} sx={{ padding: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant='h6' gutterBottom color='green'>
          You have successfully logged out.
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

export default Logout
