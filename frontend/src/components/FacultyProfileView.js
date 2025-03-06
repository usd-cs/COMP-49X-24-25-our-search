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
  Box, Button, Typography, Paper, CircularProgress,
  DialogActions, Dialog, DialogContent, DialogTitle, DialogContentText
} from '@mui/material'
import { backendUrl, viewProjectsFlag } from '../resources/constants'
import { useNavigate } from 'react-router-dom'
import PostList from './PostList'
import PostDialog from './PostDialog'

export const emptyProfile = {
  firstName: '', 
  lastName: '',
  email: '',
  department: [],
  projects: []
}

const getNames = (list) => list.map(item => item.name)

const FacultyProfileView = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/facultyProfiles/current`, {
          method: 'GET',
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
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
      const response = await fetch(`${backendUrl}/api/facultyProfiles/current`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete profile')
      }
      navigate('/') // go back to login/landing screen
    } catch (err) {
      setError('Failed to delete profile. Please try again.')
    }
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
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
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
              facultyView={viewProjectsFlag}
              isOnFacultyProfile
            />
            <PostDialog
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
              isStudent={false}
              isFaculty
              isAdmin={false}
              facultyView={viewProjectsFlag}
            />
          </>
          )}
      <Button variant='outlined' color='primary' fullWidth sx={{ mt: 3 }} onClick={() => { navigate('/create-project') }}>
        Create new project
      </Button>
      <Button variant='contained' color='primary' fullWidth sx={{ mt: 3 }} onClick={() => { navigate('/edit-professor-profile') }}>
        Edit Profile
      </Button>
      <Button
        variant='contained' color='error' fullWidth sx={{ mt: 3 }}
        disabled={profile.firstName === '' || error}
        onClick={() => setOpenDeleteDialog(true)}
      >
        Delete Profile
      </Button>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone.
          </DialogContentText>

          {error && (
            <Typography color='error' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteProfile} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default FacultyProfileView
