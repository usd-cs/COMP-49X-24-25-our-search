import React, { useState } from 'react'
import {
  AppBar, Toolbar, Box, IconButton, Tooltip, CssBaseline,
  BottomNavigation, BottomNavigationAction
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import MenuIcon from '@mui/icons-material/Menu'
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useNavigate, Link } from 'react-router-dom'
import TitleButton from './TitleButton'
import SearchBar from '../filtering/SearchBar'
import ViewProfile from '../profiles/ViewProfile'
import PostsLayout from '../posts/PostsLayout'
import { bgColor } from '../../resources/constants'
import Sidebar from '../filtering/Sidebar'
import PropTypes from 'prop-types'

const drawerWidth = 250
const iconColor = '#0189ce'

const SharedLayout = ({ isStudent = false, isFaculty = false, isAdmin = false, handleLogout, showingPosts = false, children }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true) // by default should be open

  const toggleDrawer = () => {
    setOpen(!open)
  }

  let FAQ_LINK = '/posts' // default to stay on posts page if there is an error passing user role props
  if (isFaculty) {
    FAQ_LINK = '/faculty-faqs'
  } else if (isAdmin) {
    FAQ_LINK = '/admin-faqs'
  } else if (isStudent) {
    FAQ_LINK = '/student-faqs'
  }

  return (
    <>
      <CssBaseline />
      {/* SharedLayout with dynamic margin when drawer is open */}
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
                <Tooltip title='Manage App Variables' arrow data-testid='manage-app-variables-icon'>
                  <IconButton onClick={() => navigate('/disciplines-and-majors')}>
                    <AdminPanelSettingsIcon sx={{ color: iconColor }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Manage Email Notifications' arrow data-testid='manage-email-notifications-icon'>
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
        <Sidebar drawerWidth={drawerWidth} iconColor={iconColor} open={open} isAdmin={isAdmin} />
      )}

      {/* Main Content that shifts when drawer is open */}
      <Box sx={{ marginTop: 8, paddingLeft: open ? `${drawerWidth}px` : '0', transition: 'padding 0.3s ease' }}>
        {showingPosts && <PostsLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} />}
      </Box>
      {!showingPosts && children}

      {/* extra padding above the bottom navigation so nothing gets cut off by the bottom nav */}
      <Box sx={{ mb: 20 }} />

      <BottomNavigation
        showLabels
        sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          display: 'flex',
          paddingLeft: open ? `${drawerWidth}px` : '0',
          transition: 'padding 0.3s ease',
          height: 80,
          bgcolor: '#DFEAF4'
        }}
      >
        <BottomNavigationAction
          label='Posts' icon={<HomeIcon />}
          component={Link} to='/posts'
        />
        <BottomNavigationAction
          label='FAQs' icon={<HelpCenterIcon />}
          component={Link} to={FAQ_LINK}
        />

        {isAdmin && (
          <BottomNavigationAction
            label='App Variables' icon={<AdminPanelSettingsIcon />}
            component={Link} to='/disciplines-and-majors'
          />
        )}
        {isAdmin && (
          <BottomNavigationAction
            label='Email Notifications' icon={<ScheduleSendIcon />}
            component={Link} to='/email-notifications'
          />
        )}

      </BottomNavigation>
    </>
  )
}

SharedLayout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default SharedLayout
