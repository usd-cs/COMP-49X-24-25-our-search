import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  useTheme,
  alpha,
  IconButton,
  Fade
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router-dom'

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('')
  const theme = useTheme()
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const RoleButton = ({ role, icon, description }) => (
    <Paper
      elevation={selectedRole === role ? 8 : 2}
      sx={{
        width: '100%',
        maxWidth: 400,
        height: 280,
        m: 2,
        borderRadius: 8,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        backgroundColor: selectedRole === role
          ? alpha(theme.palette.primary.main, 0.1)
          : 'background.paper',
        '&:hover': {
          transform: 'translateY(-8px)',
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }
      }}
      onClick={() => handleRoleSelect(role)}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <IconButton
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            backgroundColor: selectedRole === role
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent'
          }}
        >
          {icon}
        </IconButton>
        <Typography variant='h4' component='h2' gutterBottom>
          {role}
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          align='center'
          sx={{ mt: 1 }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth='lg'>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Typography
            variant='h2'
            component='h1'
            gutterBottom
            align='center'
            color='#A7C8E8'
            fontWeight=' 400'
          >
            Welcome to OUR SEARCH
          </Typography>

          <Typography
            variant='h5'
            color='text.secondary'
            align='center'
            sx={{ mb: 8 }}
          >
            Please select your role to continue
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'

            }}
          >
            <RoleButton
              role='Student'
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              description='View research opportunities at USD'
            />
            <RoleButton
              role='Professor'
              icon={<AccountBalanceIcon sx={{ fontSize: 40 }} />}
              description='Publish posts about your upcoming or ongoing research opportunities'
            />
          </Box>

          {selectedRole && (
            <Fade in timeout={1000}>
              <Box
                sx={{
                  mt: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography
                  variant='subtitle1'
                  color='text.secondary'
                  sx={{
                    opacity: 0.9,
                    fontStyle: 'italic'
                  }}
                />
                <Button
                  onClick={() => navigate(`/create-${selectedRole.toLowerCase()}-profile`)}
                  variant='contained'
                  size='large'
                  startIcon={<PersonIcon sx={{ fontSize: 24 }} />}
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: 8,
                    textTransform: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                    transition: 'all 0.3s ease-in-out',
                    background: (theme) => `linear-gradient(45deg, 
                    ${theme.palette.primary.main}, 
                    ${theme.palette.primary.dark}
                )`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 12px 28px ${alpha(theme.palette.primary.main, 0.35)}`
                    },
                    '&:active': {
                      transform: 'translateY(1px)'
                    }
                  }}
                >
                  Continue as {selectedRole}
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default RoleSelection
