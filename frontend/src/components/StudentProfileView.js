/**
 * StudentProfileView.js
 *
 * This component fetches and displays the current student's profile information.
 * It displays fields such as name, graduation year, major, class status, research field interests,
 * research periods interest, interest reason, and prior research experience.
 * An "Edit Profile" button is provided at the bottom.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Paper, CircularProgress,
  DialogActions, Dialog, DialogContent, DialogTitle, DialogContentText
} from '@mui/material'
import { backendUrl } from '../resources/constants'
import { useNavigate } from 'react-router-dom'

export const emptyProfile = {
  name: '',
  graduationYear: '',
  major: [],
  classStatus: [],
  researchFieldInterests: [],
  researchPeriodsInterest: [],
  interestReason: '',
  hasPriorExperience: 'no',
  active: false
}

const StudentProfileView = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/studentProfiles/current`, {
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
      const response = await fetch(`${backendUrl}/api/studentProfiles/current`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete profile')
      }
      navigate('/')
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
        Student Profile
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
            <Typography variant='body1'><strong>Graduation Year:</strong> {profile.graduationYear}</Typography>
            <Typography variant='body1'>
              <strong>Major:</strong> {Array.isArray(profile.major) ? profile.major.join(', ') : profile.major}
            </Typography>
            <Typography variant='body1'><strong>Class Status:</strong> {profile.classStatus}</Typography>
            <Typography variant='body1'>
              <strong>Research Field Interest(s):</strong> {Array.isArray(profile.researchFieldInterests) ? profile.researchFieldInterests.join(', ') : profile.researchFieldInterests}
            </Typography>
            <Typography variant='body1'>
              <strong>Research Period(s):</strong> {Array.isArray(profile.researchPeriodsInterest) ? profile.researchPeriodsInterest.join(', ') : profile.researchPeriodsInterest}
            </Typography>
            <Typography variant='body1'><strong>Interest Reason:</strong> {profile.interestReason}</Typography>
            <Typography variant='body1'>
              <strong>Prior Research Experience:</strong> {profile.hasPriorExperience === 'yes' ? 'Yes' : 'No'}
            </Typography>
          </Box>
          )
        : (
          <Typography variant='body1'>No profile found.</Typography>
          )}
      <Button variant='contained' color='primary' fullWidth sx={{ mt: 3 }} onClick={() => { navigate('/edit-student-profile') }}>
        Edit Profile
      </Button>

      <Button
        variant='contained' color='error' fullWidth sx={{ mt: 3 }}
        disabled={profile.name === '' || error}
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

export default StudentProfileView
