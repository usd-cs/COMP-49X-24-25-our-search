/**
 * @file Component that requires the user to change to a PC in order to complete the process.
 * @author Eduardo Perez Rocha
 */

import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useMediaQuery
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { CUSTOM_BLUE_COLOR, DARK_BLUE_COLOR } from '../resources/constants'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    }
  },
  palette: {
    primary: {
      main: CUSTOM_BLUE_COLOR,
      contrastText: '#fff'
    },
    secondary: {
      main: '#4682B4',
      contrastText: '#fff'
    },
    background: {
      default: '#ffffff',
      paper: '#fff',
      light: '#e0f7fa',
      warm: '#FAF5ED'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '12px 30px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }
      }
    }
  }
})

const MobileRedirectMessage = ({ children, maxWidth = 768 }) => {
  const isMobile = useMediaQuery(`(max-width:${maxWidth}px)`)

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, #e0f7fa 0%, ${CUSTOM_BLUE_COLOR}40 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
        >
          <Card
            elevation={6}
            sx={{
              maxWidth: 450,
              width: '100%',
              overflow: 'visible',
              position: 'relative',
              mt: { xs: 0, sm: -6 }
            }}
          >
            <Box sx={{
              position: 'absolute',
              top: -50,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'white',
              borderRadius: '50%',
              p: 2,
              boxShadow: 3
            }}
            >
              <LaptopMacIcon sx={{ fontSize: 60, color: DARK_BLUE_COLOR }} />
            </Box>

            <CardContent sx={{ p: 4, pt: 6, textAlign: 'center' }}>
              <Typography
                variant='h4'
                sx={{
                  color: DARK_BLUE_COLOR,
                  mb: 3,
                  mt: 2
                }}
              >
                Desktop Access Required
              </Typography>

              <Typography
                variant='body1'
                sx={{
                  fontSize: '1.2rem',
                  mb: 4,
                  lineHeight: 1.5
                }}
              >
                Our research platform requires a larger screen size to provide the optimal experience. Please continue on a desktop or laptop computer to access all functionality.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant='contained'
                  color='secondary'
                  fullWidth
                  startIcon={<OpenInNewIcon />}
                  onClick={() => {                    
                    window.location.href = 'https://oursearch.com'
                  }}    
                  sx={{
                    mb: 1,
                    py: 1.5,
                    backgroundColor: 'secondary.main',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#56687a',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  Visit Landing Page
                </Button>
              </Box>

            </CardContent>
          </Card>

          <Typography
            variant='body2'
            sx={{
              color: DARK_BLUE_COLOR,
              mt: 4,
              maxWidth: 400,
              textAlign: 'center'
            }}
          >
            The SEARCH platform is optimized for larger screens to facilitate detailed research project browsing and collaboration.
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  return children
}

export const MobileBlockPage = ({ maxWidth = 768 }) => {
  const isMobile = useMediaQuery(`(max-width:${maxWidth}px)`)

  if (!isMobile) return null

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        minHeight: '100vh',
        background: `linear-gradient(135deg, #e0f7fa 0%, ${CUSTOM_BLUE_COLOR}40 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
      >
        <Card
          elevation={6}
          sx={{
            maxWidth: 450,
            width: '100%',
            overflow: 'visible',
            position: 'relative',
            mt: { xs: 0, sm: -6 }
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'white',
            borderRadius: '50%',
            p: 2,
            boxShadow: 3
          }}
          >
            <LaptopMacIcon sx={{ fontSize: 60, color: DARK_BLUE_COLOR }} />
          </Box>

          <CardContent sx={{ p: 4, pt: 6, textAlign: 'center' }}>
            <Typography
              variant='h4'
              sx={{
                color: DARK_BLUE_COLOR,
                mb: 3,
                mt: 2
              }}
            >
              Desktop Access Required
            </Typography>

            <Typography
              variant='body1'
              sx={{
                fontSize: '1.2rem',
                mb: 4,
                lineHeight: 1.5
              }}
            >
              Our research platform requires a larger screen size to provide the optimal experience. Please continue on a desktop or laptop computer to access all functionality.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                color='secondary'
                fullWidth
                startIcon={<OpenInNewIcon />}
                onClick={() => {                    
                    window.location.href = 'https://oursearch.com'
                }}    
                sx={{
                  mb: 1,
                  py: 1.5,
                  backgroundColor: 'secondary.main',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#56687a',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                Visit Main USD Website
              </Button>
            </Box>

            <Typography
              variant='body2'
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                mt: 2
              }}
            >
              This site requires a screen width of at least {maxWidth} pixels.
              Please access using a desktop or laptop computer.
            </Typography>
          </CardContent>
        </Card>

        <Typography
          variant='body2'
          sx={{
            color: DARK_BLUE_COLOR,
            mt: 4,
            maxWidth: 400,
            textAlign: 'center'
          }}
        >
          The SEARCH platform is optimized for larger screens to facilitate detailed research project browsing and collaboration.
        </Typography>
      </Box>
    </ThemeProvider>
  )
}

export default MobileRedirectMessage
