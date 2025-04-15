import React, { useState } from 'react'
import {
  AppBar, Toolbar, Box, CssBaseline
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import TitleButton from './TitleButton'
import SearchBar from '../filtering/SearchBar'
import ViewProfile from '../profiles/ViewProfile'
import PostsLayout from '../posts/PostsLayout'
import { CUSTOM_BG_COLOR } from '../../resources/constants'
import Sidebar from '../filtering/Sidebar'
import PropTypes from 'prop-types'
import NavLinkItem from './NavLinkItem'

const drawerWidth = 250
const iconColor = '#0189ce'

const SharedLayout = ({ isStudent = false, isFaculty = false, isAdmin = false, handleLogout, showingPosts = false, children }) => {
  const [open, setOpen] = useState(false) // by default should be open

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

  const [searchParams] = useSearchParams()
  const postsViewParam = searchParams.get('postsView')

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
          bgcolor: CUSTOM_BG_COLOR
        }}
      >
        <Toolbar sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 }
        }}
        >
          {/* Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <TitleButton />
          </Box>

          {/* Center Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
            <NavLinkItem to='/posts'>Posts</NavLinkItem>
            <NavLinkItem to={FAQ_LINK}>FAQs</NavLinkItem>

            {isAdmin && (
              <>
                <NavLinkItem to='/disciplines-and-majors'>Manage Variables</NavLinkItem>
                <NavLinkItem to='/email-notifications'>Manage Email Notifications</NavLinkItem>
              </>
            )}
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {showingPosts && <SearchBar />}
            <ViewProfile
              isStudent={isStudent}
              isFaculty={isFaculty}
              isAdmin={isAdmin}
              handleLogout={handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Persistent Drawer */}
      {showingPosts && ( // only show filtering drawer when showing posts
        <Sidebar drawerWidth={drawerWidth} iconColor={iconColor} open={open} isAdmin={isAdmin} postsView={postsViewParam} toggleDrawer={toggleDrawer} />
      )}

      {/* Main Content that shifts when drawer is open */}
      <Box sx={{
        marginTop: {
          xs: 21,
          sm: 9,
          md: 8,
          lg: 7
        },
        paddingLeft: open ? `${drawerWidth}px` : '0',
        transition: 'padding 0.3s ease'
      }}
      >
        {showingPosts && <PostsLayout isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} toggleDrawer={toggleDrawer} drawerOpen={open} />}
      </Box>
      {!showingPosts && children}

    </>
  )
}

SharedLayout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default SharedLayout
