/**
 * @file Renders the search bar, sidebar, accordions for posts to display and viewprofile.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Box, CircularProgress } from '@mui/material'
import MainAccordion from './MainAccordion'
import PostDialog from './posts/PostDialog'
import TitleButton from './navigation/TitleButton'
import SearchBar from './filtering/SearchBar'
import ViewProfile from './profiles/ViewProfile'
import Sidebar from './filtering/Sidebar'
import PropTypes from 'prop-types'
import ViewButton from './filtering/ViewButton'
import { fetchStudentsUrl, fetchProjectsUrl, fetchFacultyUrl, viewStudentsFlag, viewProjectsFlag, viewFacultyFlag } from '../resources/constants'
// import { mockStudents, mockResearchOps, getAllFacultyExpectedResponse } from '../resources/mockData'

function MainLayout ({ isStudent, isFaculty, isAdmin, handleLogout }) {
  const [selectedPost, setSelectedPost] = useState(null)
  const [postings, setPostings] = useState([])
  const [postsView, setPostsView] = useState(viewStudentsFlag)
  const [loading, setLoading] = useState(false)

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
  const fetchPostings = useCallback(async (isStudent, isFaculty, isAdmin, postsView) => {
    let endpointUrl = ''

    if (isStudent || ((isFaculty || isAdmin) && postsView === viewProjectsFlag)) {
      endpointUrl = fetchProjectsUrl
    } else if ((isFaculty || isAdmin) && postsView === viewStudentsFlag) {
      endpointUrl = fetchStudentsUrl
    } else if (isAdmin && postsView === viewFacultyFlag) {
      endpointUrl = fetchFacultyUrl
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

  // Every time this component mounts, call fetchPostings to get the up-to-date posts
  useEffect(() => {
    const fetchData = async () => {
      const posts = await fetchPostings(isStudent, isFaculty, isAdmin, postsView)
      setPostings(posts)
    }
    fetchData()
  }, [isStudent, isFaculty, isAdmin, postsView, fetchPostings])

  const renderFacultyViewBtns = () => {
    if (isFaculty) {
      return (
        <>
          <ViewButton isActive={postsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
          <ViewButton isActive={postsView === viewProjectsFlag} onClick={changeToProjects} data-testid='projects-btn'>Other Projects</ViewButton>
        </>
      )
    }
  }
  const renderAdminButtons = () => {
    if (isAdmin) {
      return (
        <>
          <ViewButton isActive={postsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
          <ViewButton isActive={postsView === viewProjectsFlag} onClick={changeToProjects} data-testid='projects-btn'>Projects</ViewButton>
          <ViewButton isActive={postsView === viewFacultyFlag} onClick={changeToFaculty} data-testid='faculty-btn'>Faculty</ViewButton>
        </>
      )
    }
  }
  // Since the useStates trigger React to re-render before the useEffect triggers another re-render,
  // need to setLoading state to true to allow time for the new fetchPostings call to return with correct
  // data and to set the other states. Finally, setLoading back to false to display the right information.
  const changeToStudents = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewStudentsFlag)
    setPostings(posts)
    setPostsView(viewStudentsFlag)
    setLoading(false)
  }
  const changeToProjects = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewProjectsFlag)
    setPostings(posts)
    setPostsView(viewProjectsFlag)
    setLoading(false)
  }
  const changeToFaculty = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewFacultyFlag)
    setPostings(posts)
    setPostsView(viewFacultyFlag)
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
        <ViewProfile isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} handleLogout={handleLogout} />
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
          {renderAdminButtons()}

          {loading
            ? (
              <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
              </Box>
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
                  postsView={postsView}
                />
                <PostDialog
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  isStudent={isStudent}
                  isFaculty={isFaculty}
                  isAdmin={isAdmin}
                  postsView={postsView}
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
