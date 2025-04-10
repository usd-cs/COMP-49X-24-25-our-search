/**
 * StudentProfileView.js
 *
 * This component fetches and displays the current student's profile information.
 * Styled with a cleaner, more modern approach similar to Tailwind designs.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, Typography, Paper, CircularProgress, Divider, 
  Card, CardContent, Avatar, Chip, Grid, Alert,
  Container, IconButton
} from '@mui/material'
import { 
  ArrowBack, Edit, DeleteOutlined, School, Person,
  Science, Psychology, Lightbulb, CheckCircle, Cancel,
  CalendarMonth, BookmarkBorder, MessageOutlined
} from '@mui/icons-material'
import { BACKEND_URL } from '../../resources/constants'
import { useNavigate } from 'react-router-dom'
import AreYouSureDialog from '../navigation/AreYouSureDialog'

// Colors inspired by Tailwind palette
const BLUE_COLOR = '#3b82f6'       // Tailwind blue-500
const BLUE_LIGHT = '#dbeafe'       // Tailwind blue-100
const PURPLE_LIGHT = '#f3e8ff'     // Tailwind purple-100
const PURPLE_TEXT = '#6b21a8'      // Tailwind purple-800
const GREEN_LIGHT = '#dcfce7'      // Tailwind green-100
const GREEN_TEXT = '#166534'       // Tailwind green-800
const GRAY_BG = '#f9fafb'          // Tailwind gray-50
const GRAY_TEXT = '#4b5563'        // Tailwind gray-600
const DARK_TEXT = '#1f2937'        // Tailwind gray-800

const emptyStudentProfile = {
  firstName: '',
  lastName: '',
  graduationYear: '',
  majors: [],
  classStatus: '',
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
        const response = await fetch(`${BACKEND_URL}/api/studentProfiles/current`, {
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
      const response = await fetch(`${BACKEND_URL}/api/studentProfiles/current`, {
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

  // Function to get full name
  const getFullName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`
    }
    return ''
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: BLUE_COLOR }} />
          <Typography variant="h6" sx={{ mt: 3, color: DARK_TEXT }}>Loading profile...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'white'
        }}
      >
        {/* Header with back button and status */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: DARK_TEXT }}>
              Student Profile
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1, color: GRAY_TEXT }}>
              Profile Status:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: profile.isActive ? 'success.main' : 'error.main' }}>
              {profile.isActive ? (
                <>
                  <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Active</Typography>
                </>
              ) : (
                <>
                  <Cancel fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">Inactive</Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Error message if any */}
        {error && (
          <Alert severity="error" sx={{ mx: 3, mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Profile content */}
        {profile.firstName !== '' ? (
          <Box sx={{ px: 3, pb: 3 }}>
            {/* Basic Information */}
            <Card
              variant="outlined"
              sx={{ 
                mb: 3, 
                bgcolor: GRAY_BG, 
                borderRadius: 2,
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: GRAY_TEXT }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                    Basic Information
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: GRAY_TEXT }}>Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{getFullName()}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: GRAY_TEXT }}>Class Standing</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{profile.classStatus || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: GRAY_TEXT }}>Expected Graduation</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{profile.graduationYear || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: GRAY_TEXT }}>Prior Research Experience</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{profile.hasPriorExperience ? 'Yes' : 'No'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card
              variant="outlined"
              sx={{ 
                mb: 3, 
                bgcolor: GRAY_BG, 
                borderRadius: 2,
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School sx={{ mr: 1, color: GRAY_TEXT }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                    Academic Information
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ color: GRAY_TEXT, mb: 1 }}>Majors</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(profile.majors) && profile.majors.length > 0 ? (
                      profile.majors.map((major, index) => (
                        <Chip 
                          key={index} 
                          label={major} 
                          size="small" 
                          sx={{ 
                            bgcolor: BLUE_LIGHT, 
                            color: BLUE_COLOR,
                            borderRadius: 10,
                            fontSize: '0.85rem',
                            py: 0.5,
                            fontWeight: 500
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body1">Not specified</Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Research Interests */}
            <Card
              variant="outlined"
              sx={{ 
                mb: 3, 
                bgcolor: GRAY_BG, 
                borderRadius: 2,
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookmarkBorder sx={{ mr: 1, color: GRAY_TEXT }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                    Research Interests
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: GRAY_TEXT, mb: 1 }}>Research Fields</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(profile.researchFieldInterests) && profile.researchFieldInterests.length > 0 ? (
                      profile.researchFieldInterests.map((field, index) => (
                        <Chip 
                          key={index} 
                          label={field} 
                          size="small" 
                          sx={{ 
                            bgcolor: PURPLE_LIGHT, 
                            color: PURPLE_TEXT,
                            borderRadius: 10,
                            fontSize: '0.85rem',
                            py: 0.5,
                            fontWeight: 500
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body1">Not specified</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: GRAY_TEXT, mb: 1 }}>Availability</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(profile.researchPeriodsInterest) && profile.researchPeriodsInterest.length > 0 ? (
                      profile.researchPeriodsInterest.map((period, index) => (
                        <Chip 
                          key={index} 
                          label={period} 
                          size="small" 
                          sx={{ 
                            bgcolor: GREEN_LIGHT, 
                            color: GREEN_TEXT,
                            borderRadius: 10,
                            fontSize: '0.85rem',
                            py: 0.5,
                            fontWeight: 500
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body1">Not specified</Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Interest Statement */}
            <Card
              variant="outlined"
              sx={{ 
                mb: 3, 
                bgcolor: GRAY_BG, 
                borderRadius: 2,
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MessageOutlined sx={{ mr: 1, color: GRAY_TEXT }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                    Research Interest Statement
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ color: DARK_TEXT }}>
                  {profile.interestReason || 'Not provided'}
                </Typography>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                disabled={profile.firstName === '' || error !== null}
                onClick={() => { navigate('/edit-student-profile') }}
                sx={{ 
                  bgcolor: BLUE_COLOR,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#2563eb' // darker blue
                  }
                }}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlined />}
                disabled={profile.firstName === '' || error !== null}
                onClick={() => setOpenDeleteDialog(true)}
                sx={{ 
                  borderRadius: 2
                }}
              >
                Delete Profile
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              No profile found. Please create a new profile.
            </Alert>
            <Button
              variant="contained"
              sx={{ 
                mt: 2,
                bgcolor: BLUE_COLOR,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#2563eb'
                }
              }}
              onClick={() => { navigate('/edit-student-profile') }}
            >
              Create Profile
            </Button>
          </Box>
        )}
      </Paper>

      <AreYouSureDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteProfile}
        error={error}
        action='delete'
      />
    </Container>
  )
}

export default StudentProfileView