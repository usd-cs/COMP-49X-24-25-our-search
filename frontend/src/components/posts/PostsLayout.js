/**
 * @file Renders the search bar, sidebar, accordions for posts to display and viewprofile.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Divider, Button } from '@mui/material'
import MainAccordion from './MainAccordion'
import PostDialog from './PostDialog'
import PropTypes from 'prop-types'
import ViewButton from '../filtering/ViewButton'
import { GET_STUDENTS_URL, GET_PROJECTS_URL, GET_FACULTY_URL, viewStudentsFlag, viewProjectsFlag, viewFacultyFlag, CUSTOM_BG_COLOR, viewMyProjectsFlag, CURRENT_FACULTY_ENDPOINT } from '../../resources/constants'
import PersistentAlert from '../PersistentAlert'
import getDataFrom from '../../utils/getDataFrom'

function PostsLayout ({ isStudent, isFaculty, isAdmin }) {
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState(null)
  const [postings, setPostings] = useState([])
  const [postsView] = useState(viewStudentsFlag)
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()

  const msg = searchParams.get('msg')
  const type = searchParams.get('type')
  const postsViewParam = searchParams.get('postsView')

  const effectivePostsView = postsViewParam !== null ? postsViewParam : postsView

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
  const fetchPostings = useCallback(async (isStudent, isFaculty, isAdmin, effectivePostsView) => {
    let endpointUrl = ''

    if (isStudent || ((isFaculty || isAdmin) && effectivePostsView === viewProjectsFlag)) {
      endpointUrl = GET_PROJECTS_URL
    } else if ((isFaculty || isAdmin) && effectivePostsView === viewStudentsFlag) {
      endpointUrl = GET_STUDENTS_URL
    } else if (isAdmin && effectivePostsView === viewFacultyFlag) {
      endpointUrl = GET_FACULTY_URL
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
    if (msg && type) {
      // Set a timer to clear the query params after 5 seconds
      const timer = setTimeout(() => {
        // Remove 'msg' and 'type' from the query params
        // navigate({ search: '' }, { replace: true });
        const newSearch = postsViewParam ? `?postsView=${postsViewParam}` : ''
        navigate(newSearch, { replace: true })
      }, 5000)

      return () => clearTimeout(timer) // Cleanup timer if the component unmounts
    }

    const fetchData = async () => {
      const posts = await fetchPostings(isStudent, isFaculty, isAdmin, effectivePostsView)
      setPostings(posts)
    }
    fetchData()
  }, [isStudent, isFaculty, isAdmin, effectivePostsView, fetchPostings, msg, type, navigate, postsViewParam])

  const renderFacultyViewBtns = () => {
    if (isFaculty) {
      return (
        <>
          <Divider sx={{ mb: 1 }} />
          <ViewButton isActive={effectivePostsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
          <ViewButton isActive={effectivePostsView === viewProjectsFlag} onClick={changeToProjects} data-testid='projects-btn'>All Projects</ViewButton>
          <ViewButton isActive={effectivePostsView === viewMyProjectsFlag} onClick={changeToMyProjects} data-testid='projects-btn'>My Projects</ViewButton>
          <Divider sx={{ mt: 1 }} />
        </>
      )
    }
  }
  const renderAdminManageButtons = () => {
    return (
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>

        <Button
          variant='outlined' sx={{ borderRadius: '20px', padding: '10px 20px' }}
          onClick={() => navigate('/disciplines-and-majors')} data-testid='manage-vars-btn'
        >Manage App Variables
        </Button>

        <Button
          variant='outlined' sx={{ borderRadius: '20px', padding: '10px 20px' }}
          onClick={() => navigate('/email-notifications')} data-testid='manage-emails-btn'
        >Manage Email Notifications
        </Button>

      </Box>
    )
  }
  const renderAdminPostsViewButtons = () => {
    return (
      <>
        <Divider />
        <ViewButton isActive={effectivePostsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
        <ViewButton isActive={effectivePostsView === viewProjectsFlag} onClick={changeToProjects} data-testid='projects-btn'>Projects</ViewButton>
        <ViewButton isActive={effectivePostsView === viewFacultyFlag} onClick={changeToFaculty} data-testid='faculty-btn'>Faculty</ViewButton>
        <Divider />
      </>
    )
  }
  const renderAdminButtons = () => {
    if (isAdmin) {
      return (
        <>
          {renderAdminManageButtons()}
          {renderAdminPostsViewButtons()}
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
    const newSearch = `?postsView=${viewStudentsFlag}`
    navigate(newSearch, { replace: true })
    setLoading(false)
  }
  const changeToProjects = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewProjectsFlag)
    setPostings(posts)
    const newSearch = `?postsView=${viewProjectsFlag}`
    navigate(newSearch, { replace: true })
    setLoading(false)
  }
  const changeToFaculty = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewFacultyFlag)
    setPostings(posts)
    const newSearch = `?postsView=${viewFacultyFlag}`
    navigate(newSearch, { replace: true })
    setLoading(false)
  }
  const changeToMyProjects = async () => {
    setLoading(true)
    try {
      const profile = await getDataFrom(CURRENT_FACULTY_ENDPOINT)
      setPostings(profile.projects)
      setLoading(false)
    } catch (error) {

    } finally {
      const newSearch = `?postsView=${viewMyProjectsFlag}`
      navigate(newSearch, { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: CUSTOM_BG_COLOR }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 2 }}>
        <Box sx={{ width: '100%' }}>
          {msg && type && <PersistentAlert msg={msg} type={type} />}
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
                  postsView={effectivePostsView}
                />
                <PostDialog
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  isStudent={isStudent}
                  isFaculty={isFaculty}
                  isAdmin={isAdmin}
                  postsView={effectivePostsView}
                />
              </>
              )}
        </Box>
      </Box>
    </Box>
  )
}

PostsLayout.propTypes = {
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default PostsLayout
