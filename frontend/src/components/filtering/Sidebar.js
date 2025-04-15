/**
 * @file Renders sidebar for filters via a MUI Drawer so it can be opened or closed.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
// import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Drawer,
  Button
} from '@mui/material'
import { CUSTOM_BG_COLOR, CUSTOM_BUTTON_COLOR, viewFacultyFlag, viewMyProjectsFlag, viewProjectsFlag, viewStudentsFlag } from '../../resources/constants'

function Sidebar ({ drawerWidth, open, postsView, toggleDrawer }) {
  // const navigate = useNavigate()

  // move close filters to inside bar

  if (!postsView) postsView = viewProjectsFlag

  const renderButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <Button
          variant='outlined'
      // onClick={()} navigate('/posts?umbrellatopics=topic1,topic2 & majors=major1,major2 blah')
          sx={{
            borderColor: CUSTOM_BUTTON_COLOR,
            textTransform: 'none',
            fontWeight: 'bold',
            color: CUSTOM_BUTTON_COLOR,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: `${CUSTOM_BUTTON_COLOR}80`
            },
            px: 2,
            py: 1,
            mt: 2
          }}
        >
          Apply
        </Button>
        <Button
          variant='outlined'
      // onClick={()}
          sx={{
            borderColor: CUSTOM_BUTTON_COLOR,
            textTransform: 'none',
            fontWeight: 'bold',
            color: CUSTOM_BUTTON_COLOR,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: `${CUSTOM_BUTTON_COLOR}80`
            },
            px: 2,
            py: 1,
            mt: 2
          }}
        >
          Reset
        </Button>
      </Box>
    )
  }

  const renderCloseButton = () => {
    return (
      <Button
        onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          minWidth: '40px',
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          p: 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        X
      </Button>
    )
  }

  const renderDrawerContent = () => {
    if (postsView === viewStudentsFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR }} role='presentation'>
          {renderCloseButton()}
          <Typography variant='h6' sx={{ mt: 5 }}>
            Filters will go here for students
          </Typography>
          {renderButtons()}

        </Box>
      )
    } else if (postsView === viewProjectsFlag || postsView === viewMyProjectsFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR }} role='presentation'>
          {renderCloseButton()}
          <Typography variant='h6' sx={{ mt: 5 }}>
            Filters will go here for projects
          </Typography>
          {renderButtons()}

        </Box>
      )
    } else if (postsView === viewFacultyFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR }} role='presentation'>
          {renderCloseButton()}
          <Typography variant='h6' sx={{ mt: 5 }}>
            Filters will go here for faculty
          </Typography>
          {renderButtons()}
        </Box>
      )
    }
  }

  return (
    <Drawer
      variant='persistent'
      anchor='left'
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: CUSTOM_BG_COLOR
        }
      }}
    >
      {renderDrawerContent()}
    </Drawer>
  )
}

export default Sidebar
