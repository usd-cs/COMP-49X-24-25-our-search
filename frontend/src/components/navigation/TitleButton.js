/**
 * @file Renders title of the website "Our Search"
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { APP_TITLE, CUSTOM_BLUE_COLOR } from '../../resources/constants'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Arial Narrow',
      'Arial',
      'sans-serif'
    ].join(','),
    h5: {
      fontWeight: 900,
      letterSpacing: '0.02em',
      lineHeight: 1
    }
  }
})

function TitleButton () {
  const handleClick = () => {
    window.location.href = '/posts'
  }
  // Clickable title that uses a custom theme and reloads the page
  return (
    <Box
      component='button'
      onClick={handleClick}
      sx={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'inherit'
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography
          variant='h5'
          sx={{
            fontFamily: "'Arial Narrow', Arial, sans-serif",
            fontWeight: 900,
            fontSize: '2.5rem',
            color: CUSTOM_BLUE_COLOR,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 0.9
          }}
        >
          {APP_TITLE}
        </Typography>
      </ThemeProvider>
    </Box>
  )
}

export default TitleButton
