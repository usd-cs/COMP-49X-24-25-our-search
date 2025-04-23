/**
 * @file Renders the posts to display.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Divider, Button, Fab, Tooltip, Typography } from '@mui/material'
import MainAccordion from './MainAccordion'
import PostDialog from './PostDialog'
import PropTypes from 'prop-types'
import ViewButton from '../filtering/ViewButton'
import { GET_STUDENTS_URL, GET_PROJECTS_URL, GET_FACULTY_URL, viewStudentsFlag, viewProjectsFlag, viewFacultyFlag, CUSTOM_BG_COLOR, viewMyProjectsFlag, CURRENT_FACULTY_ENDPOINT, CUSTOM_BUTTON_COLOR, ERROR_LOADING_POSTS_MSG } from '../../resources/constants'
import PersistentAlert from '../popups/PersistentAlert'
import PostList from './PostList'
import AddIcon from '@mui/icons-material/Add'

function PostsLayout ({ isStudent, isFaculty, isAdmin, toggleDrawer, drawerOpen }) {
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState(null)
  const [postings, setPostings] = useState([])
  const [postsView, setPostsView] = useState(viewProjectsFlag)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [error, setError] = useState(null)
  const { search } = useLocation()

  const [showMyOwnProject, setShowMyOwnProject] = useState(false)
  const closeMyProjectPopup = () => {
    setSelectedPost(null)
    setShowMyOwnProject(false)
  }

  const msg = searchParams.get('msg')
  const type = searchParams.get('type')
  const postsViewParam = searchParams.get('postsView')

  const getTotalPostCount = () => {
    return postings.reduce((disciplineSum, discipline) => {
      const majors = discipline.majors || []
      const postsInDiscipline = majors.reduce((majorSum, major) => {
        const visiblePosts = (isStudent || isFaculty)
          ? major.posts.filter((post) => post.isActive)
          : major.posts
        return majorSum + visiblePosts.length
      }, 0)
      return disciplineSum + postsInDiscipline
    }, 0)
  }

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
  const fetchPostings = useCallback(async (isStudent, isFaculty, isAdmin, postsView, paramsForFilters) => {
    let endpointUrl = ''
    if (isFaculty && postsView === viewMyProjectsFlag) {
      // return getFacultyCurrentExpected.projects
      endpointUrl = CURRENT_FACULTY_ENDPOINT
    } else if (isStudent || ((isFaculty || isAdmin) && postsView === viewProjectsFlag)) {
      // return mockResearchOps
      endpointUrl = GET_PROJECTS_URL
    } else if ((isFaculty || isAdmin) && postsView === viewStudentsFlag) {
      // return mockStudents
      endpointUrl = GET_STUDENTS_URL
    } else if (isAdmin && postsView === viewFacultyFlag) {
      // return getAllFacultyExpectedResponse
      endpointUrl = GET_FACULTY_URL
    } else {
      return []
    }

    if (paramsForFilters) {
      endpointUrl += `?${paramsForFilters}`
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
      if (postsView === viewMyProjectsFlag) return data.projects
      else return data
    } catch (error) {
      console.error('Error fetching postings:', error)
    }

    // Return an empty list if the fetch call fails
    return []
  }, [])

  // Every time this component mounts,
  // reset the URL params to only include the postsView and
  // call fetchPostings to get the up-to-date posts
  useEffect(() => {
    // handle if there are URL params for messages
    if (msg && type) {
      // Set a timer to clear the query params after 5 seconds
      const timer = setTimeout(() => {
        // Remove 'msg' and 'type' from the query params
        const newSearch = postsViewParam ? `?postsView=${postsViewParam}` : ''
        navigate(newSearch, { replace: true })
      }, 5000)

      return () => clearTimeout(timer) // Cleanup timer if the component unmounts
    }

    // handle if there are URL params to trigger filters
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.delete('postsView')
    const paramsForFilters = currentParams.toString()

    // fetch the data to show
    const fetchData = async () => {
      // PostsLayout is the primary controller of postsView, which gets passed to child components.
      // postsView is determined by the URL parameters. If no URL param is specified, it defaults to 'viewProjectsFlag'
      if (postsViewParam) {
        if ((postsViewParam === viewFacultyFlag && !isAdmin) || (postsViewParam === viewMyProjectsFlag && !isFaculty)) {
          // not allowed: dont change to the new postsView
          const posts = await fetchPostings(isStudent, isFaculty, isAdmin, postsView, paramsForFilters)
          setPostings(posts)
        } else {
          // allowed: fetchPostings with the specified postsViewParam and set new postsView
          const posts = await fetchPostings(isStudent, isFaculty, isAdmin, postsViewParam, paramsForFilters)
          setPostsView(postsViewParam)
          setPostings(posts)
        }
      } else {
        const posts = await fetchPostings(isStudent, isFaculty, isAdmin, postsView, paramsForFilters)
        setPostings(posts)
      }
    }
    fetchData()
  }, [search, isStudent, isFaculty, isAdmin, postsView, fetchPostings, postsViewParam, msg, type, navigate])

  const renderFacultyViewBtns = () => {
    if (isFaculty) {
      return (
        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Divider sx={{ mb: 1 }} />
          <ViewButton isActive={postsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
          <ViewButton isActive={postsView === viewProjectsFlag} onClick={changeToAllProjects} data-testid='projects-btn'>All Projects</ViewButton>
          <ViewButton isActive={postsView === viewMyProjectsFlag} onClick={changeToMyProjects} data-testid='my-projects-btn'>My Projects</ViewButton>
          <Divider sx={{ mt: 1 }} />
        </Box>
      )
    }
  }
  // const renderAdminManageButtons = () => {
  //   return (
  //     <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>

  //       <Button
  //         variant='outlined' sx={{ borderRadius: '20px', padding: '10px 20px' }}
  //         onClick={() => navigate('/disciplines-and-majors')} data-testid='manage-vars-btn'
  //       >Manage App Variables
  //       </Button>

  //       <Button
  //         variant='outlined' sx={{ borderRadius: '20px', padding: '10px 20px' }}
  //         onClick={() => navigate('/email-notifications')} data-testid='manage-emails-btn'
  //       >Manage Email Notifications
  //       </Button>

  //     </Box>
  //   )
  // }
  const renderAdminPostsViewButtons = () => {
    return (
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', '&::-webkit-scrollbar': { display: 'none' } }}>
        <Divider sx={{ mb: 1 }} />
        <ViewButton isActive={postsView === viewStudentsFlag} onClick={changeToStudents} data-testid='students-btn'>Students</ViewButton>
        <ViewButton isActive={postsView === viewProjectsFlag} onClick={changeToAllProjects} data-testid='projects-btn'>Projects</ViewButton>
        <ViewButton isActive={postsView === viewFacultyFlag} onClick={changeToFaculty} data-testid='faculty-btn'>Faculty</ViewButton>
        <Divider sx={{ mt: 1 }} />
      </Box>
    )
  }
  const renderAdminButtons = () => {
    if (isAdmin) {
      return (
        <>
          {/* {renderAdminManageButtons()} */}
          {renderAdminPostsViewButtons()}
        </>
      )
    }
  }
  const renderShowFilterBtn = () => {
    return (
      <Button
        variant='outlined'
        onClick={toggleDrawer}
        sx={{
          borderColor: CUSTOM_BUTTON_COLOR,
          textTransform: 'none',
          fontWeight: 'bold',
          color: drawerOpen ? CUSTOM_BUTTON_COLOR : 'white',
          borderRadius: '20px',
          backgroundColor: drawerOpen ? 'transparent' : CUSTOM_BUTTON_COLOR,
          '&:hover': {
            backgroundColor: `${CUSTOM_BUTTON_COLOR}80`,
            borderColor: `${CUSTOM_BUTTON_COLOR}80`
          },
          px: 2,
          py: 1,
          mt: 2
        }}
      >
        {drawerOpen ? 'Hide Filters' : 'Show Filters'}
      </Button>
    )
  }
  const renderCreateProjectBtn = () => {
    return (
      <Tooltip title='Create Project' arrow>
        <Fab
          color='primary'
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300
          }}
          onClick={() => navigate('/create-project')}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    )
  }
  // Since the useStates trigger React to re-render before the useEffect triggers another re-render,
  // need to setLoading state to true to allow time for the new fetchPostings call to return with correct
  // data and to set the other states. Finally, setLoading back to false to display the right information.
  const changeToStudents = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewStudentsFlag)
    if (posts.length === 0) {
      setError('Error loading students.')
    } else {
      setPostings(posts)
      setPostsView(viewStudentsFlag)
      const newSearch = `?postsView=${viewStudentsFlag}`
      navigate(newSearch, { replace: true })
      setLoading(false)
    }
  }
  const changeToAllProjects = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewProjectsFlag)
    if (posts.length === 0) {
      setError('Error loading projects.')
    } else {
      setPostings(posts)
      setPostsView(viewProjectsFlag)
      const newSearch = `?postsView=${viewProjectsFlag}`
      navigate(newSearch, { replace: true })
      setLoading(false)
    }
  }
  const changeToFaculty = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewFacultyFlag)
    if (posts.length === 0) {
      setError('Error loading faculty.')
    } else {
      setPostings(posts)
      setPostsView(viewFacultyFlag)
      const newSearch = `?postsView=${viewFacultyFlag}`
      navigate(newSearch, { replace: true })
      setLoading(false)
    }
  }
  const changeToMyProjects = async () => {
    setLoading(true)
    const posts = await fetchPostings(isStudent, isFaculty, isAdmin, viewMyProjectsFlag)
    if (posts.length === 0) {
      setError('Error loading your projects.')
    } else {
      setPostings(posts)
      setPostsView(viewMyProjectsFlag)
      const newSearch = `?postsView=${viewMyProjectsFlag}`
      navigate(newSearch, { replace: true })
      setLoading(false)
    }
  }

  if (isFaculty && postsView === viewMyProjectsFlag) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: CUSTOM_BG_COLOR }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 2 }}>
          <Box sx={{ width: '100%' }}>
            {renderCreateProjectBtn()}
            {msg && type && <PersistentAlert msg={msg} type={type} />}
            {error !== null && <PersistentAlert msg={error} type='error' />}
            {renderFacultyViewBtns()}
            {renderShowFilterBtn()}
            {loading
              ? (
                <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                  <CircularProgress />
                </Box>
                )
              : (
                <> {(!postings) && (
                  { ERROR_LOADING_POSTS_MSG }
                )}
                  <Box sx={{ p: 2, borderRadius: 2 }}>
                    <PostList
                      postings={postings}
                      setSelectedPost={setSelectedPost}
                      isStudent={false}
                      isFaculty
                      isAdmin={false}
                      postsView={viewProjectsFlag}
                      isOnFacultyProfile
                    />
                  </Box>
                  <PostDialog
                    post={selectedPost}
                    onClose={() => closeMyProjectPopup()}
                    isStudent={isStudent}
                    isFaculty={isFaculty}
                    isAdmin={isAdmin}
                    postsView={viewProjectsFlag}
                    isOnFacultyProfile
                    showMyOwnProject={showMyOwnProject}
                    setShowMyOwnProject={setShowMyOwnProject}
                  />
                </>
                )}
          </Box>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: CUSTOM_BG_COLOR }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 2 }}>
          <Box sx={{ width: '100%' }}>
            {isFaculty && (
              renderCreateProjectBtn()
            )}
            {msg && type && <PersistentAlert msg={msg} type={type} />}
            {error !== null && <PersistentAlert msg={error} type='error' />}

            {renderFacultyViewBtns()}
            {renderAdminButtons()}
            {renderShowFilterBtn()}
            <Typography sx={{ mt: 2, ml: 3, fontWeight: 'bold' }}>
              Results: {getTotalPostCount()} Posts
            </Typography>
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
}

PostsLayout.propTypes = {
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default PostsLayout
