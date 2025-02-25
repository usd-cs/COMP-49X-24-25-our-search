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
import ViewButton from './ViewButton'

import { useCallback } from 'react'
import { fetchStudentsUrl, fetchProjectsUrl, viewStudentsFlag, viewProjectsFlag } from '../resources/constants'
// import { mockStudents, mockResearchOps } from '../resources/mockData'

function MainLayout ({ isStudent, isFaculty, isAdmin }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [postings, setPostings] = useState([])
  const [facultyView, setFacultyView] = useState(viewStudentsFlag)
  const [loading, setLoading] = useState(false)

  // console.log('mainlayout', postings)

  /**
 * Function that filters for the postings to be displayed to the user.
 * The postings will either be students (if isFaculty) or research opportunities (if isStudent).
 * Returns:
 *  - all of the data for the displines
 *  - the majors under each displines
 *  - and the postings under each major
 *
 * useCallback is needed because the asynchronous fetch operation creates new function instances on each call.
 * We want new function instances to ensure that useEffect runs as expected (it gets called when
 * any of its dependencies change)
 */
  const fetchPostings = useCallback(async (isStudent, isFaculty, isAdmin, facultyView) => {
    let endpointUrl = ''

    if (isStudent || (isFaculty && facultyView === viewProjectsFlag)) {
      endpointUrl = fetchProjectsUrl
      // return mockResearchOps
    } else if (isFaculty && facultyView === viewStudentsFlag) {
      endpointUrl = fetchStudentsUrl
      // return mockStudents
    } else {
      return []
    }

    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch postings')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching postings:', error)
    }

    // Return an empty list if the fetch call fails
    return []
  }, [])

  useEffect(() => {
    console.log('useEffect triggered with facultyView:', facultyView)
    const fetchData = async () => {
      const posts = await fetchPostings(isStudent, isFaculty, isAdmin, facultyView)
      setPostings(posts)
    }
    fetchData()
  }, [isStudent, isFaculty, isAdmin, facultyView, fetchPostings])

  const renderFacultyViewBtns = () => {
    if (isFaculty) {
      return (
        <>
          <ViewButton isActive={facultyView === viewStudentsFlag} onClick={changeToStudents}>Students</ViewButton>
          <ViewButton isActive={facultyView === viewProjectsFlag} onClick={changeToProjects}>Other Projects</ViewButton>
        </>
      )
    }
  }
  const changeToStudents = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewStudentsFlag)
    setPostings(posts)
    setFacultyView(viewStudentsFlag)
    setLoading(false)
  }
  const changeToProjects = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewProjectsFlag)
    setPostings(posts)
    setFacultyView(viewProjectsFlag)
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
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
          {renderFacultyViewBtns()}

          {loading
            ? (
              <div>Loading...</div>
              )
            : (
              <>
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
                  isFaculty={isFaculty}
                  isAdmin={isAdmin}
                  facultyView={facultyView}
                />
                <PostDialog
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  isStudent={isStudent}
                  isFaculty={isFaculty}
                  isAdmin={isAdmin}
                  facultyView={facultyView}
                />
              </>
              )}
        </Box>
      </Box>
    </Box>
  )
}

MainLayout.propTypes = {
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired
}

export default MainLayout
