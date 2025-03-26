import React, { useState } from 'react'
import { AppBar, Toolbar, Box, IconButton, Tooltip, CssBaseline, Drawer, Typography, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useNavigate } from 'react-router-dom'
import TitleButton from './TitleButton'
import SearchBar from '../filtering/SearchBar'
import ViewProfile from '../profiles/ViewProfile'
import MainLayout from '../MainLayout'
import { bgColor } from '../../resources/constants'
import SortRoundedIcon from '@mui/icons-material/SortRounded'

const drawerWidth = 250
const iconColor = '#0189ce'

const Navbar = ({ isStudent, isFaculty, isAdmin, handleLogout, showingPosts = false }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true) // by default should be open

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const drawerContent = (
    <Box sx={{ width: drawerWidth, bgColor }} role='presentation'>
      <Typography variant='h6' sx={{mt: 5}}>
        Filters will go here
      </Typography>
      
      <List sx={{mt: 5}}>
        {isAdmin && (
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
        )}
      </List>
    </Box>
  )

  return (
    <>
      <CssBaseline />
      {/* Navbar with dynamic margin when drawer is open */}
      <AppBar
        position='fixed'
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          transition: 'margin 0.3s ease',
          marginLeft: open ? `${drawerWidth}px` : '0',
          width: open && showingPosts ? `calc(100% - ${drawerWidth}px)` : '100%',
          bgcolor: bgColor
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Left Side: Drawer Icon & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showingPosts && ( // only show the drawer icon to show filters if showing posts
              <IconButton edge='start' onClick={toggleDrawer} sx={{ mr: 1 }}>
              <MenuIcon sx={{ color: iconColor }} />
            </IconButton>
            )}
            <TitleButton />
          </Box>

          {/* Center: SearchBar */}
          {showingPosts && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Box>
          )}

          {/* Right Side: Admin Icons & ViewProfile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAdmin && (
              <>
                <Tooltip title='Manage App Variables' arrow>
                  <IconButton onClick={() => navigate('/disciplines-and-majors')}>
                    <AdminPanelSettingsIcon sx={{ color: iconColor }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Manage Email Notifications' arrow>
                  <IconButton onClick={() => navigate('/email-notifications')}>
                    <ScheduleSendIcon sx={{ color: iconColor }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <ViewProfile isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Persistent Drawer */}
      {showingPosts && ( // only show filtering drawer when showing posts
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
      {drawerContent}
    </Drawer>
      )}

      {/* Main Content that shifts when drawer is open */}
      <Box sx={{ marginTop: 8, paddingLeft: open ? `${drawerWidth}px` : '0', transition: 'padding 0.3s ease' }}>
        {showingPosts && <MainLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} />}
      </Box>
    </>
  )
}

export default Navbar
