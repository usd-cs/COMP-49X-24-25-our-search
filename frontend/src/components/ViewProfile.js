/**
 * @file Renders profile buttons with dropdown functionality for faculty and students
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React, { useState } from 'react'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import { backendUrl } from '../resources/constants'
import { useNavigate } from 'react-router-dom'

function ViewProfile ({ isStudent = false, isFaculty = false }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleViewProfile = () => {
    handleClose()
    if (isStudent && !isFaculty) {
      navigate('/view-student-profile')
    } else if (isFaculty && !isStudent) {
      navigate('/view-professor-profile')
    }
  }

  const handleCreateProject = () => {
    handleClose()
    if (isFaculty) {
      navigate('/create-project')
    }
  }

  const handleLogout = () => {
    console.log('Logging out')
    window.location.href = backendUrl + '/logout'
    handleClose()
  }

  if (isFaculty) {
    return (
      <Box>
        <Button
          id='faculty-profile-button'
          aria-controls={open ? 'faculty-profile-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<AccountCircleIcon />}
          sx={{
            borderRadius: '20px',
            padding: '6px 16px',
            textTransform: 'none',
            backgroundColor: '#e0f7fa',
            color: '#3F4B58',
            '&:hover': {
              backgroundColor: '#b2ebf2'
            }
          }}
        >
          Faculty
        </Button>
        <Menu
          id='faculty-profile-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'faculty-profile-button'
          }}
          PaperProps={{
            elevation: 4,
            sx: {
              width: 220,
              borderRadius: '12px',
              mt: 1
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleViewProfile} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SchoolIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>My Profile/Projects</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleCreateProject} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Create New Project</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize='small' color='error' />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              Logout
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    )
  }

  if (isStudent) {
    return (
      <Box>
        <Button
          id='student-profile-button'
          aria-controls={open ? 'student-profile-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<AccountCircleIcon />}
          sx={{
            borderRadius: '20px',
            padding: '6px 16px',
            textTransform: 'none',
            backgroundColor: '#e0f7fa',
            color: '#3F4B58',
            '&:hover': {
              backgroundColor: '#b2ebf2'
            }
          }}
        >
          Student
        </Button>
        <Menu
          id='student-profile-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'student-profile-button'
          }}
          PaperProps={{
            elevation: 4,
            sx: {
              width: 220,
              borderRadius: '12px',
              mt: 1
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleViewProfile} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>View My Profile</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize='small' color='error' />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ color: 'error' }}>
              Logout
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    )
  }
}

export default ViewProfile
