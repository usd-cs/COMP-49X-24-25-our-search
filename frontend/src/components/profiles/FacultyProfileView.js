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
  Box, Button, Typography, Paper, CircularProgress, Divider,
  Card, CardContent, Avatar, Chip, Alert,
  Container, IconButton
} from '@mui/material'
import { 
  ArrowBack, Edit, DeleteOutlined,
  Email, Work, BookmarkBorder, Add,
  VerifiedUser
} from '@mui/icons-material'
import { BACKEND_URL, CURRENT_FACULTY_ENDPOINT, viewProjectsFlag } from '../../resources/constants'
import { useNavigate } from 'react-router-dom'
import PostList from '../posts/PostList'
import PostDialog from '../posts/PostDialog'
import AreYouSureDialog from '../navigation/AreYouSureDialog'
import getDataFrom from '../../utils/getDataFrom'

// Colors inspired by Tailwind palette
const BLUE_COLOR = '#3b82f6'       // Tailwind blue-500
const BLUE_LIGHT = '#dbeafe'       // Tailwind blue-100
const INDIGO_LIGHT = '#e0e7ff'     // Tailwind indigo-100
const INDIGO_TEXT = '#4338ca'      // Tailwind indigo-700
const GRAY_BG = '#f9fafb'          // Tailwind gray-50
const GRAY_TEXT = '#4b5563'        // Tailwind gray-600
const DARK_TEXT = '#1f2937'        // Tailwind gray-800

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

  // Function to get initials for avatar
  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    }
    return 'FP' // Faculty Profile default
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
      <Container maxWidth="md">
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
        {/* Header with back button and title */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: DARK_TEXT }}>
              Faculty Profile
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={{ color: BLUE_COLOR, mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: BLUE_COLOR }}>
              Faculty Member
            </Typography>
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
            {/* Basic Profile Information */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: BLUE_COLOR,
                  color: 'white',
                  fontSize: 28,
                  fontWeight: 'bold',
                  mr: 3
                }}
              >
                {getInitials()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                  {getFullName()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Email sx={{ fontSize: 18, color: GRAY_TEXT, mr: 0.5 }} />
                  <Typography variant="body1" sx={{ color: GRAY_TEXT }}>
                    {profile.email || 'Email not available'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Department Information */}
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
                  <Work sx={{ mr: 1, color: GRAY_TEXT }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: DARK_TEXT }}>
                    Department Information
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ color: GRAY_TEXT, mb: 1 }}>Departments</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(profile.department) && profile.department.length > 0 ? (
                      getNames(profile.department).map((dept, index) => (
                        <Chip 
                          key={index} 
                          label={dept} 
                          size="small" 
                          sx={{ 
                            bgcolor: INDIGO_LIGHT, 
                            color: INDIGO_TEXT,
                            borderRadius: 10,
                            fontSize: '0.85rem',
                            py: 0.5,
                            fontWeight: 500
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body1">No departments specified</Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Projects */}
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
                    Projects
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 1 }}>
                  {profile.projects.length === 0 ? (
                    <Typography variant="body1" sx={{ color: GRAY_TEXT, py: 2 }}>
                      No projects yet
                    </Typography>
                  ) : (
                    <>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, mb: 2 }}>
                        <PostList
                          postings={profile.projects}
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
                    variant='outlined'
                    startIcon={<Add />}
                    fullWidth
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      color: BLUE_COLOR,
                      borderColor: BLUE_COLOR,
                      '&:hover': {
                        borderColor: BLUE_COLOR,
                        bgcolor: BLUE_LIGHT
                      }
                    }}
                    disabled={profile.firstName === '' || error !== null}
                    onClick={() => { navigate('/create-project') }}
                  >
                    Create new project
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                fullWidth
                disabled={profile.firstName === '' || error !== null}
                onClick={() => { navigate('/edit-professor-profile') }}
                sx={{ 
                  bgcolor: BLUE_COLOR,
                  borderRadius: 2,
                  py: 1.2,
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
                fullWidth
                disabled={profile.firstName === '' || error !== null}
                onClick={() => setOpenDeleteDialog(true)}
                sx={{ 
                  borderRadius: 2,
                  py: 1.2
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
              onClick={() => { navigate('/edit-professor-profile') }}
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

export default FacultyProfileView