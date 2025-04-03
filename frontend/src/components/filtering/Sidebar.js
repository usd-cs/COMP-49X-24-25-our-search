/**
 * @file Renders sidebar for filters via a MUI Drawer so it can be opened or closed.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material'
import SortRoundedIcon from '@mui/icons-material/SortRounded'
import { bgColor } from '../../resources/constants'

function Sidebar ({ drawerWidth, iconColor, open, isAdmin }) {
  const navigate = useNavigate()

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
          backgroundColor: bgColor
        }
      }}
    >
      <Box sx={{ width: drawerWidth, bgColor }} role='presentation'>
        <Typography variant='h6' sx={{ mt: 5 }}>
          Filters will go here
        </Typography>

        <List sx={{ mt: 5 }}>
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('?filter=test1')}>
                <ListItemIcon>
                  <SortRoundedIcon sx={{ color: iconColor }} />
                </ListItemIcon>
                <ListItemText primary='Test 1' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('?filter=test2')}>
                <ListItemIcon>
                  <SortRoundedIcon sx={{ color: iconColor }} />
                </ListItemIcon>
                <ListItemText primary='Test 2' />
              </ListItemButton>
            </ListItem>
          </>
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
