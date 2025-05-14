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
  const [filteredMsg, setFilteredMsg] = useState('')

  const [showMyOwnProject, setShowMyOwnProject] = useState(false)
  const closeMyProjectPopup = () => {
    setSelectedPost(null)
    setShowMyOwnProject(false)
  }

  const msg = searchParams.get('msg')
  const type = searchParams.get('type')
  const postsViewParam = searchParams.get('postsView')

  const getTotalPostCount = () => {
    if (postsView === viewFacultyFlag) {
      return postings.reduce((total, department) => {
        const deptPostCount = department.faculty.reduce((sum, faculty) => {
          return sum + (faculty.projects?.length || 0)
        }, 0)
        return total + deptPostCount
      }, 0)
    } else {
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

  useEffect(() => {
    // Every time this component mounts,
    // handle if there are URL params for messages
    if (!msg || !type) return // nothing to clear
    const timer = setTimeout(() => {
      const newSearch = postsViewParam ? `?postsView=${postsViewParam}` : ''
      navigate(newSearch, { replace: true })
    }, 5000)
    return () => clearTimeout(timer)
  }, [msg, type, postsViewParam, navigate])

  useEffect(() => {
    // Every time this component mounts,
    // reset the URL params to only include the postsView and
    // call fetchPostings to get the up-to-date posts

    // Read the URL params to decide what posts to display and filters to apply.
    // The URL is the only source to determine them.
    const params = new URLSearchParams(search)
    const desiredView = params.get('postsView') || viewProjectsFlag // default
    const paramsForFilters = (() => {
      params.delete('postsView')
      return params.toString()
    })()

    const load = async () => {
      setLoading(true)
      const data = await fetchPostings(
        isStudent,
        isFaculty,
        isAdmin,
        desiredView,
        paramsForFilters
      )
      setPostsView(desiredView) // always in sync with URL
      if (data.length === 0 && desiredView === viewMyProjectsFlag) {
        setError('Error loading projects. Try again later.')
      } else if (data.length === 0 && desiredView === viewStudentsFlag) {
        setError('Error loading students. Try again later.')
      } else if (data.length === 0 && desiredView === viewFacultyFlag) {
        setError('Error loading faculty. Try again later.')
      } else if (data.length === 0 && desiredView === viewMyProjectsFlag) {
        setError('Error loading your projects. Try again later.')
      } else {
        setPostings(data)
        setLoading(false)
      }
    }

    load()

    let msgAboutFilters = ''

    if (params.has('researchPeriods')) {
      msgAboutFilters += 'Filters applied: research period'
    }
    if (params.has('majors')) {
      msgAboutFilters += msgAboutFilters.length === 0
        ? 'Filters applied: majors'
        : ', majors'
    }
    if (params.has('umbrellaTopics')) {
      msgAboutFilters += msgAboutFilters.length === 0
        ? 'Filters applied: umbrella topics'
        : ', umbrella topics'
    }
    if (params.has('search')) {
      msgAboutFilters += msgAboutFilters.length === 0
        ? 'Filters applied: search bar'
        : ', search bar'
    }

    if (msgAboutFilters.length > 0) {
      setFilteredMsg(msgAboutFilters)
    } else {
      setFilteredMsg('')
    }
  }, [search, isStudent, isFaculty, isAdmin, fetchPostings])

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

  // Handler functions to effectively change the Posts page to show a different list of postings
  const changeToStudents = async () => {
    navigate(`?postsView=${viewStudentsFlag}`, { replace: true })
  }
  const changeToAllProjects = async () => {
    navigate(`?postsView=${viewProjectsFlag}`, { replace: true })
  }
  const changeToFaculty = async () => {
    navigate(`?postsView=${viewFacultyFlag}`, { replace: true })
  }
  const changeToMyProjects = async () => {
    navigate(`?postsView=${viewMyProjectsFlag}`, { replace: true })
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
            <Typography sx={{ mt: 1, ml: 3, fontWeight: 'bold', color: CUSTOM_BUTTON_COLOR }}>
              {filteredMsg}
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
