/**
 * FacultyProfileView.js
 *
 * This component fetches and displays the current faculty profile information.
 * It displays fields such as name, email, and department.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Paper, CircularProgress
} from '@mui/material'
import { BACKEND_URL, CURRENT_FACULTY_ENDPOINT, viewProjectsFlag } from '../../resources/constants'
import { useNavigate } from 'react-router-dom'
import PostList from '../posts/PostList'
import PostDialog from '../posts/PostDialog'
import AreYouSureDialog from '../navigation/AreYouSureDialog'
import PersistentAlert from '../PersistentAlert'
import getDataFrom from '../../utils/getDataFrom'

const emptyFacultyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  department: [],
  projects: []
}

// Helper functions takes the backend's response of objects (with ids and names)
// and parses it into an array of strings based on name. This is helpful for rendering
// the values prepopulated in the view.
const getNames = (list) => list.map(item => item.name)

const FacultyProfileView = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyFacultyProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [showMyOwnProject, setShowMyOwnProject] = useState(false) // true if a faculty member is viewing their own project

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDataFrom(CURRENT_FACULTY_ENDPOINT)
        setProfile(data)
      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleBack = () => {
    navigate('/posts')
  }

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(CURRENT_FACULTY_ENDPOINT, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete profile')
      } else {
        window.location.href = BACKEND_URL + '/logout' // log out of google entirely
      }
    } catch (err) {
      setError('Failed to delete profile. Please try again.')
    }
  }

  const closePopup = () => {
    setSelectedPost(null)
    setShowMyOwnProject(false)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Button variant='outlined' onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Faculty Profile
      </Typography>
      {error !== null && (
        <PersistentAlert msg={error} type='error' />
      )}
      {profile.firstName !== ''
        ? (
          <Box>
            <Typography variant='body1'><strong>Name:</strong> {profile.firstName} {profile.lastName}</Typography>
            <Typography variant='body1'><strong>Email:</strong> {profile.email}</Typography>
            <Typography variant='body1'>
              <strong>Department:</strong> {Array.isArray(getNames(profile.department)) ? getNames(profile.department).join(', ') : getNames(profile.department)}
            </Typography>
          </Box>
          )
        : (
          <Typography variant='body1'>No profile found.</Typography>
          )}

      <Typography variant='h6'>
        Projects
      </Typography>
      {profile.projects.length === 0
        ? (
          <Typography variant='body1'>
            No projects yet
          </Typography>
          )
        : (
          <>
            <PostList
              postings={profile.projects}
              setSelectedPost={setSelectedPost}
              isStudent={false}
              isFaculty
              isAdmin={false}
              postsView={viewProjectsFlag}
              isOnFacultyProfile
            />
            <PostDialog
              post={selectedPost}
              onClose={() => closePopup()}
              isStudent={false}
              isFaculty
              isAdmin={false}
              postsView={viewProjectsFlag}
              isOnFacultyProfile
              showMyOwnProject={showMyOwnProject}
              setShowMyOwnProject={setShowMyOwnProject}
            />
          </>
          )}
      <Button
        variant='outlined' color='primary' fullWidth sx={{ mt: 3 }}
        disabled={profile.firstName === '' || error !== null}
        onClick={() => { navigate('/create-project') }}
      >
        Create new project
      </Button>
      <Button
        variant='contained' color='primary' fullWidth sx={{ mt: 3 }}
        disabled={profile.firstName === '' || error !== null}
        onClick={() => { navigate('/edit-professor-profile') }}
      >
        Edit Profile
      </Button>
      <Button
        variant='contained' color='error' fullWidth sx={{ mt: 3 }}
        disabled={profile.firstName === '' || error !== null}
        onClick={() => setOpenDeleteDialog(true)}
      >
        Delete Profile
      </Button>

      <AreYouSureDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteProfile}
        error={error}
        action='delete'
      />

    </Paper>
  )
}

export default FacultyProfileView
