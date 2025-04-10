/**
 * @file Logic and renders for the LandingPage with a description. It redirects to the Login page if the user has not logged in.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 */

import React from 'react'
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Card,
  CardContent,
  Divider,
  Dialog,
  IconButton
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { customBlueColor, darkBlueColor } from '../resources/constants'
import oldLogoUsd from '../images/oldLogoUsd.png'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import SchoolIcon from '@mui/icons-material/School'
import LoginIcon from '@mui/icons-material/Login'
import CloseIcon from '@mui/icons-material/Close'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(','),
    h1: {
      letterSpacing: '0.02em',
      fontWeight: 900
    },
    h4: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    }
  },
  palette: {
    primary: {
      main: customBlueColor,
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
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  }
})

function LandingPage ({ handleLogin, checkAuthError, logoutError }) {
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false)

  React.useEffect(() => {
    if (checkAuthError || logoutError) {
      setOpenErrorDialog(true)
    }
  }, [checkAuthError, logoutError])

  const renderServerErrors = () => {
    let checkAuthErrorMessage = ''
    let logoutErrorMessage = ''
    if (checkAuthError) {
      checkAuthErrorMessage = 'Sorry, we are having trouble connecting you to the server. Please try again later.'
    }
    if (logoutError) {
      logoutErrorMessage = 'Sorry, we are having trouble logging you out. Please try again later.'
    }

    if (!checkAuthError && !logoutError) {
      return null
    }

    return (
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <Alert
          severity='error'
          variant='filled'
          sx={{
            borderRadius: 0,
            fontSize: '1.25rem',
            py: 2,
            px: 2,
            display: 'flex',
            alignItems: 'center'
          }}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => setOpenErrorDialog(false)}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        >
          {checkAuthErrorMessage || logoutErrorMessage}
        </Alert>
      </Dialog>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      {renderServerErrors()}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, #e0f7fa 0%, ${customBlueColor}40 100%)`,
            pt: { xs: 4, md: 6 },
            pb: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Container maxWidth='lg'>
            <Grid2 container spacing={4} alignItems='center'>
              <Grid2 xs={12} md={6}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography
                    variant='h1'
                    sx={{
                      fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' },
                      color: darkBlueColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      lineHeight: 0.9,
                      mb: 2
                    }}
                  >
                    Our Search
                  </Typography>
                  <Typography
                    variant='h5'
                    sx={{
                      color: 'secondary.main',
                      mb: 4,
                      maxWidth: '600px',
                      fontWeight: 500
                    }}
                  >
                    Connecting USD students and faculty for meaningful research collaborations
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}
                  >
                    <Button
                      data-testid='login-button'
                      onClick={handleLogin}
                      sx={{
                        backgroundColor: 'secondary.main',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        px: 6,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#56687a',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                      variant='contained'
                      size='large'
                      endIcon={<LoginIcon />}
                    >
                      Login with USD Email
                    </Button>

                    <Typography
                      variant='body2'
                      sx={{
                        mt: { xs: 2, sm: 0 },
                        ml: { xs: 0, sm: 2 },
                        color: 'secondary.main',
                        fontSize: '1.2rem',
                        fontStyle: 'italic'
                      }}
                    >
                      *Must use your @sandiego.edu email
                    </Typography>
                  </Box>
                </Box>
              </Grid2>

              <Grid2 xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component='img'
                    src={oldLogoUsd}
                    alt='USD Logo'
                    sx={{
                      borderRadius: 4,
                      width: { xs: '100%', md: '100%' },
                      maxWidth: '320px'
                    }}
                  />
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>

        <Box
          sx={{
            bgcolor: '#faf5ed',
            py: { xs: 6, md: 10 }
          }}
        >
          <Container maxWidth='lg'>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <SchoolIcon sx={{ fontSize: 72, color: 'primary.main', mb: 2 }} />
              <Typography variant='h4' sx={{ color: 'secondary.main', mb: 2 }}>
                Enhancing Research Collaboration at USD
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  maxWidth: 800,
                  mx: 'auto',
                  fontSize: '1.4rem'
                }}
              >
                The SEARCH project enhances student-faculty collaboration at USD by
                streamlining research matching, enabling real-time connections,
                and improving efficiency through an intuitive web-based platform.
              </Typography>
              <Divider
                sx={{
                  maxWidth: 100,
                  mx: 'auto',
                  mt: 3,
                  borderColor: customBlueColor,
                  borderWidth: 2
                }}
              />
            </Box>

            <Grid2 container spacing={5}>
              <Grid2 xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: `${customBlueColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PersonSearchIcon sx={{ fontSize: 100, color: customBlueColor }} />
                  </Box>
                  <CardContent sx={{ px: 5, py: 4, flexGrow: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        color: 'secondary.main',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Streamlined Profiles
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'text.secondary',
                        mx: 'auto',
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                        textAlign: 'center'
                      }}
                    >
                      Students and faculty can create detailed profiles to showcase their
                      interests and research opportunities.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>

              <Grid2 xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: `${customBlueColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FilterAltIcon sx={{ fontSize: 100, color: customBlueColor }} />
                  </Box>
                  <CardContent sx={{ px: 13, py: 4, flexGrow: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        color: 'secondary.main',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Advanced Filtering
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'text.secondary',
                        mx: 'auto',
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                        textAlign: 'center'
                      }}
                    >
                      Search for opportunities or collaborators by department, keywords,
                      availability, and more.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>

              <Grid2 xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: `${customBlueColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <NotificationsActiveIcon sx={{ fontSize: 100, color: customBlueColor }} />
                  </Box>
                  <CardContent sx={{ px: 22, py: 4, flexGrow: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        color: 'secondary.main',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Real-Time Notifications
                    </Typography>
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'text.secondary',
                        mx: 'auto',
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                        textAlign: 'center'
                      }}
                    >
                      Stay updated with instant alerts for new matches, opportunities, or changes.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default LandingPage
