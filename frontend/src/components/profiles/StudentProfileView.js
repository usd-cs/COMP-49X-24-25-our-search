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
  Box, Button, Typography, Paper, CircularProgress
} from '@mui/material'
import { backendUrl } from '../../resources/constants'
import { useNavigate } from 'react-router-dom'
import AreYouSureDialog from '../navigation/AreYouSureDialog'

const emptyStudentProfile = {
  firstName: '',
  lastName: '',
  graduationYear: '',
  majors: [],
  classStatus: [],
  researchFieldInterests: [],
  researchPeriodsInterest: [],
  interestReason: '',
  hasPriorExperience: 'no',
  isActive: false
}

const StudentProfileView = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(emptyStudentProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/studentProfiles/current`, {
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
      const response = await fetch(`${backendUrl}/api/studentProfiles/current`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to delete profile')
      } else {
        window.location.href = backendUrl + '/logout' // log out of google entirely
      }
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
      {error !== null && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {profile.firstName !== ''
        ? (
          <Box>
            <Typography variant='body1'><strong>Name:</strong>{profile.firstName} {profile.lastName}</Typography>
            <Typography variant='body1'><strong>Graduation Year:</strong> {profile.graduationYear}</Typography>
            <Typography variant='body1'>
              <strong>Major(s):</strong> {Array.isArray(profile.majors) ? profile.majors.join(', ') : profile.majors}
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
              <strong>Prior Research Experience:</strong> {profile.hasPriorExperience ? 'Yes' : 'No'}
            </Typography>
            <Typography variant='body1'>
              <strong>Status:</strong> {profile.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
          )
        : (
          <Typography variant='body1'>No profile found.</Typography>
          )}
      <Button
        variant='contained' color='primary' fullWidth sx={{ mt: 3 }}
        disabled={profile.firstName === '' || error !== null}
        onClick={() => { navigate('/edit-student-profile') }}
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

export default StudentProfileView
