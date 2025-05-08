/**
 * FacultyProfileEdit.js
 *
 * This component fetches the current professor's profile data,
 * allows the faculty member to edit their profile information,
 * and submits the updated data to the backend.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 * @author Eduardo Perez Rocha
 */

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  Avatar,
  Card,
  CardContent,
  Fade,
  Container,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  ArrowBack,
  Save,
  RestartAlt,
  School,
  Email
} from '@mui/icons-material'
import { BACKEND_URL } from '../../resources/constants'
import fetchDepartments from '../../utils/fetchDepartments'
import { useNavigate } from 'react-router-dom'
import ClickForInfo from '../popups/ClickForInfo'
import PersistentAlert from '../popups/PersistentAlert'

const FacultyProfileEdit = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: []
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    async function fetchData () {
      try {
        const depts = await fetchDepartments()
        setDepartmentOptions(depts)

        const response = await fetch(`${BACKEND_URL}/api/facultyProfiles/current`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        if (data) {
          const ids = data.department.map((dept) => dept.id)
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            department: ids || []
          })
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching your profile. Please try again.')
      } finally {
        setLoading(false)
        setTimeout(() => setFadeIn(true), 100)
      }
    }
    fetchData()
  }, [])

  const renderMultiSelectChips = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((id) => {
        const option = departmentOptions.find((opt) => opt.id === id)
        return (
          <Chip
            key={id}
            label={option ? option.name : ''}
            color='primary'
            variant='outlined'
            sx={{
              borderRadius: '16px',
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
        )
      })}
    </Box>
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear name error when user types in either name field
    if (name === 'firstName' || name === 'lastName') {
      setNameError(null)
    }
  }

  const handleMultiSelectChange = (event, fieldName) => {
    const {
      target: { value }
    } = event

    setFormData({
      ...formData,
      [fieldName]: typeof value === 'string' ? value.split(',') : value
    })
  }

  const mapDepartmentIdsToNames = (departmentIds, departmentOptions) => {
    return departmentIds
      .map(id => {
        const department = departmentOptions.find(option => option.id === id)
        return department ? department.name : null
      })
      .filter(Boolean)
  }

  const validateName = () => {
    if (!formData.firstName.trim()) {
      setNameError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setNameError('Last name is required')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateName()) {
      return
    }
    
    setSubmitLoading(true)
    setError(null)

    try {
      const updatedFormData = {
        ...formData,
        department: mapDepartmentIdsToNames(formData.department, departmentOptions)
      }

      const response = await fetch(`${BACKEND_URL}/api/facultyProfiles/current`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      navigate('/view-professor-profile')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleReset = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  return (
    <Container maxWidth='md'>
      <Fade in={fadeIn} timeout={800}>
        <Card
          elevation={4} sx={{
            mt: 4,
            mb: 4,
            borderRadius: 2,
            overflow: 'visible'
          }}
        >
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: 'primary.main',
            color: 'white',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          }}
          >
            <Tooltip title='Back to profile'>
              <IconButton
                color='inherit'
                onClick={() => navigate('/view-professor-profile')}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Typography variant='h5' component='h1' fontWeight='500'>
              Edit Faculty Profile
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: -4
          }}
          >
            <Avatar
              sx={{
                width: 84,
                height: 84,
                bgcolor: 'secondary.main',
                fontSize: '2rem',
                boxShadow: 3
              }}
            >
              {getInitials(formData.firstName, formData.lastName)}
            </Avatar>
          </Box>

          <CardContent sx={{ p: 4, pt: 5 }}>
            {error !== null && (
              <PersistentAlert msg={error} type='error' sx={{ mb: 3 }} />
            )}

            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <School fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Name
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        Both first and last name are required.
                      </Typography>
                    }
                  />
                </Stack>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label='First Name'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    variant='outlined'
                    error={nameError && nameError.includes('First')}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    variant='outlined'
                    error={nameError && nameError.includes('Last')}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Stack>
                
                {nameError && (
                  <Typography color='error' variant='caption' sx={{ mt: 1, display: 'block' }}>
                    {nameError}
                  </Typography>
                )}
              </Box>

              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <Email fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Email
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        You must always use USD email
                      </Typography>
                    }
                  />
                </Stack>
                <TextField
                  fullWidth
                  label='Your email cannot be changed'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  variant='outlined'
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Box>

              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <School fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Department
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        The department(s) you belong to. This is simply informational.
                        It does not affect how your projects are categorized.
                      </Typography>
                    }
                  />
                </Stack>
                <FormControl fullWidth required>
                  <InputLabel id='department-label'>Select Department(s)</InputLabel>
                  <Select
                    labelId='department-label'
                    multiple
                    name='department'
                    value={formData.department}
                    onChange={(e) => handleMultiSelectChange(e, 'department')}
                    input={<OutlinedInput label='Select Department(s)' sx={{ borderRadius: 2 }} />}
                    renderValue={renderMultiSelectChips}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    {departmentOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {error === null && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                  gap: 2
                }}
                >
                  <Button
                    onClick={handleReset}
                    variant='outlined'
                    color='error'
                    type='button'
                    disabled={submitLoading}
                    startIcon={<RestartAlt />}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={submitLoading}
                    startIcon={<Save />}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 2
                    }}
                  >
                    {submitLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  )
}

export default FacultyProfileEdit