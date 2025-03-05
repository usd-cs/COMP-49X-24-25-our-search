/**
 * FacultyProfileView.js
 *
 * This component fetches and displays the current faculty profile information.
 * It displays fields such as name, email, and department.
 * @author Rayan Pal
 */

import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { backendUrl } from '../resources/constants'
import { useNavigate } from 'react-router-dom'
import { viewProjectsFlag } from '../resources/constants'
import PostList from './PostList'
import PostDialog from './PostDialog'

export const emptyProfile = {
  name: '',
  email: '',
  department: [],
  projects: []
}

const FacultyProfileView = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/facultyProfiles/current`, {
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
      {profile
        ? (
          <Box>
            <Typography variant='body1'><strong>Name:</strong> {profile.name}</Typography>
            <Typography variant='body1'><strong>Email:</strong> {profile.email}</Typography>
            <Typography variant='body1'>
              <strong>Department:</strong> {Array.isArray(profile.department) ? profile.department.join(', ') : profile.department}
            </Typography>
          </Box>
          )
        : (
          <Typography variant='body1'>No profile found.</Typography>
          )}

<Typography variant='h6'>
              <strong>My Projects</strong>
            </Typography>
      <PostList
                  postings={profile.projects}
                  setSelectedPost={setSelectedPost}
                  isStudent={false}
                  isFaculty={true}
                  isAdmin={false}
                  facultyView={viewProjectsFlag}
                />
                <PostDialog
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  isStudent={false}
                  isFaculty={true}
                  isAdmin={false}
                  facultyView={viewProjectsFlag}
                />
      <Button variant='contained' color='primary' fullWidth sx={{ mt: 3 }} onClick={() => { navigate('/edit-professor-profile') }}>
        Edit Profile
      </Button>
    </Paper>
  )
}

export default FacultyProfileView
