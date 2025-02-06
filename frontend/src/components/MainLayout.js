/**
 * @file Renders the search bar, sidebar, accordions for posts to display and viewprofile.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import MainAccordion from './MainAccordion'
import PostDialog from './PostDialog'
import TitleButton from './TitleButton'
import SearchBar from './SearchBar'
import ViewProfile from './ViewProfile'
import Sidebar from './Sidebar'
import PropTypes from 'prop-types'

function MainLayout ({ isStudent, fetchPostings }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [postings, setPostings] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const posts = await fetchPostings(isStudent)
      setPostings(posts)
    }
    fetchData()
  }, [fetchPostings, isStudent])

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#FAFAFA'
    }}
    >

      {/* The outermost box that puts the header, search bar, and view profile button next to each other */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Horizontal layout
          justifyContent: 'space-between', // Distribute components evenly with space between them
          alignItems: 'center', // Vertically center items if necessary
          padding: 2
        }}
      >
        {/* Header */}
        <TitleButton />

        {/* Search bar */}
        {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
        <SearchBar />

        {/* View profile button */}
        {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
        <ViewProfile />

      </Box>

      {/* The outermost box that puts the sidebar and the tabs next to each other */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Horizontal layout
          gap: 2, // Space between components
          padding: 2
        }}
      >
        {/* Sidebar */}
        {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
        <Sidebar />

        {/* Main content */}
        <Box sx={{ width: '75%' }}>

          <MainAccordion
            sx={{
              maxHeight: { xs: '400px', md: '600px' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '4px'
              }
            }}
            postings={postings}
            setSelectedPost={setSelectedPost}
            isStudent={isStudent}
          />
          <PostDialog
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />

        </Box>
      </Box>
    </Box>
  )
}

MainLayout.propTypes = {
  isStudent: PropTypes.bool.isRequired,
  fetchPostings: PropTypes.func.isRequired
}

export default MainLayout
