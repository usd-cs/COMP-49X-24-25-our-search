/**
 * StudentProfileEdit.js
 *
 * This component fetches the current student's profile data,
 * allows the user to edit their profile information (including setting the profile as inactive),
 * and submits the updated data to the backend.
 * It displays error and success messages based on the submission outcome.
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
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  RadioGroup,
  Radio,
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
  CalendarMonth,
  Class,
  MenuBook,
  Science,
  AccessTime,
  Notes,
  History,
  ToggleOn
} from '@mui/icons-material'
import { BACKEND_URL } from '../../resources/constants'
import fetchMajors from '../../utils/fetchMajors'
import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import { useNavigate } from 'react-router-dom'
import ClickForInfo from '../popups/ClickForInfo'
import PersistentAlert from '../popups/PersistentAlert'

// Helper functions takes the backend's response of objects (with ids and names)
// and parses it into an array of strings based on name. This is helpful for rendering
// the values prepopulated in the form's Select MenuItems.
const getNames = (list) => list.map(item => item.name)

const StudentProfileEdit = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    classStatus: '',
    majors: [],
    researchFieldInterests: [],
    researchPeriodsInterest: [],
    interestReason: '',
    hasPriorExperience: false,
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fadeIn, setFadeIn] = useState(false)
  const classStatusOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
  const [researchPeriodOptions, setResearchPeriodOptions] = useState([])
  const [majorAndFieldOptions, setMajorAndFieldOptions] = useState([])

  // Fetch the current profile and data for dropdowns to pre-populate the form
  useEffect(() => {
    async function fetchData () {
      try {
        const majorsRes = await fetchMajors()
        const majors = getNames(majorsRes)
        setMajorAndFieldOptions(majors)
        const researchPeriodsRes = await fetchResearchPeriods()
        const researchPeriods = getNames(researchPeriodsRes)
        setResearchPeriodOptions(researchPeriods)

        const response = await fetch(`${BACKEND_URL}/api/studentProfiles/current`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        if (data) {
          setFormData({
            name: `${data.firstName} ${data.lastName}` || '',
            graduationYear: data.graduationYear || '',
            classStatus: data.classStatus || [],
            majors: data.majors || [],
            researchFieldInterests: data.researchFieldInterests || [],
            researchPeriodsInterest: data.researchPeriodsInterest || [],
            interestReason: data.interestReason || '',
            hasPriorExperience: data.hasPriorExperience,
            isActive: data.isActive
          })
        }
      } catch (error) {
        setError('An unexpected error occurred while fetching your profile. Please try again.')
      } finally {
        setLoading(false)
        // Add a slight delay before showing content for a smooth fade-in effect
        setTimeout(() => setFadeIn(true), 100)
      }
    }
    fetchData()
  }, [])

  // Helper function for multi-select rendering
  // Because the form renders its Select MenuItems with
  // key=option (a string) and value=option (a string),
  // the the Chip must have key=option and value=option
  const renderMultiSelectChips = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((option) => (
        <Chip
          key={option}
          label={option}
          color='primary'
          variant='outlined'
          sx={{
            borderRadius: '16px',
            '& .MuiChip-label': { fontWeight: 500 }
          }}
        />
      ))}
    </Box>
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value === 'true' ? true : value === 'false' ? false : value
    }))
    // if (type === 'checkbox') {
    //   // For the inactive checkbox, if checked means "Set Profile as Inactive", then active = !checked.
    //   setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? !checked : value === "true" }))
    // } else {
    //   setFormData(prev => ({ ...prev, [name]: value }))
    // }
  }

  const handleMultiSelectChange = (event, fieldName) => {
    // when invoked, the fieldName must match the formData field name, written as a string,
    // e.g. fieldName='researchPeriods' if the formData has a formData.researchPeriods field.
    const { value } = event.target
    setFormData(prev => ({
      ...prev,
      [fieldName]: typeof value === 'string' ? value.split(',') : value
    }))
  }

  const handleReset = () => {
    window.location.reload()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError(null)
    try {
      // Ensure classStatus is converted from array to a single string value
      const updatedFormData = {
        ...formData,
        hasPriorExperience: Boolean(formData.hasPriorExperience),
        classStatus: formData.classStatus || '' // Convert to string or empty string if no value selected
      }
      const response = await fetch(`${BACKEND_URL}/api/studentProfiles/current`, {
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
      navigate('/view-student-profile')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
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

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
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
                onClick={() => navigate('/view-student-profile')}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Typography variant='h5' component='h1' fontWeight='500'>
              Edit Student Profile
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
              {getInitials(formData.name)}
            </Avatar>
          </Box>

          <CardContent sx={{ p: 4, pt: 5 }}>
            {error !== null && (
              <PersistentAlert msg={error} type='error' sx={{ mb: 3 }} />
            )}

            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Information Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <School fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Name
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        Your first and last name.
                      </Typography>
                    }
                  />
                </Stack>
                <TextField
                  fullWidth
                  label='Name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant='outlined'
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Box>

              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <CalendarMonth fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Graduation Year
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  label='Graduation Year'
                  name='graduationYear'
                  type='number'
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                  variant='outlined'
                />
              </Box>

              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <Class fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Class Status
                  </Typography>
                </Stack>
                <FormControl fullWidth required>
                  <InputLabel id='class-status-label'>Class Status</InputLabel>
                  <Select
                    labelId='class-status-label'
                    name='classStatus'
                    value={formData.classStatus}
                    onChange={handleChange}
                    input={<OutlinedInput label='Class Status' sx={{ borderRadius: 2 }} />}
                    renderValue={(selected) => selected || ''}
                  >
                    {classStatusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Major(s) Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <MenuBook fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Major(s)
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        Your declared major(s). If not declared, choose "Undeclared".
                      </Typography>
                    }
                  />
                </Stack>
                <FormControl fullWidth required>
                  <InputLabel id='major-label'>Major</InputLabel>
                  <Select
                    labelId='major-label'
                    multiple
                    name='majors'
                    value={formData.majors}
                    onChange={(e) => handleMultiSelectChange(e, 'majors')}
                    input={<OutlinedInput label='Major' sx={{ borderRadius: 2 }} />}
                    renderValue={renderMultiSelectChips}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    {majorAndFieldOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Research Field Interests Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <Science fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Research Field Interest(s)
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        The areas that you are interested in conducting research in.
                        Include your major if you want to do research related to your major.
                        These do not have to match your major.
                        You may be interested in doing research in areas other than what you are majoring in.
                      </Typography>
                    }
                  />
                </Stack>
                <FormControl fullWidth required>
                  <InputLabel id='research-field-label'>Research Field Interest(s)</InputLabel>
                  <Select
                    labelId='research-field-label'
                    multiple
                    name='researchFieldInterests'
                    value={formData.researchFieldInterests}
                    onChange={(e) => handleMultiSelectChange(e, 'researchFieldInterests')}
                    input={<OutlinedInput label='Research Field Interest(s)' sx={{ borderRadius: 2 }} />}
                    renderValue={renderMultiSelectChips}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    {majorAndFieldOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Research Period Interests Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <AccessTime fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Research Period Interest(s)
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        The time periods when you are available and interested in conducting research.
                      </Typography>
                    }
                  />
                </Stack>
                <FormControl fullWidth required>
                  <InputLabel id='research-period-label'>Research Period Interest(s)</InputLabel>
                  <Select
                    labelId='research-period-label'
                    multiple
                    name='researchPeriodsInterest'
                    value={formData.researchPeriodsInterest}
                    onChange={(e) => handleMultiSelectChange(e, 'researchPeriodsInterest')}
                    input={<OutlinedInput label='Research Period' sx={{ borderRadius: 2 }} />}
                    renderValue={renderMultiSelectChips}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
                    {researchPeriodOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant='caption' color='textSecondary' sx={{ mt: 0.5, ml: 1 }}>
                    Select Period(s) that you're interested in doing research
                  </Typography>
                </FormControl>
              </Box>

              {/* Interest Reason Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <Notes fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Interest Reason
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        Explain why you are interested in conducting research in your selected fields.
                      </Typography>
                    }
                  />
                </Stack>
                <TextField
                  fullWidth
                  label='Interest Reason'
                  name='interestReason'
                  value={formData.interestReason}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  variant='outlined'
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Box>

              {/* Prior Research Experience Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <History fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Prior Research Experience
                  </Typography>
                </Stack>
                <FormControl component='fieldset' required sx={{ ml: 1 }}>
                  <RadioGroup
                    row
                    name='hasPriorExperience'
                    value={formData.hasPriorExperience ? 'true' : 'false'}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value='true'
                      control={<Radio color='primary' />}
                      label={<Typography sx={{ fontWeight: 400 }}>Yes</Typography>}
                      sx={{ mr: 4 }}
                    />
                    <FormControlLabel
                      value='false'
                      control={<Radio color='primary' />}
                      label={<Typography sx={{ fontWeight: 400 }}>No</Typography>}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Profile Status Section */}
              <Box>
                <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
                  <ToggleOn fontSize='small' color='primary' />
                  <Typography variant='subtitle1' fontWeight='500' color='primary.main'>
                    Profile Status
                  </Typography>
                  <ClickForInfo
                    content={
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        Set your profile to inactive if you are not currently looking for research opportunities.
                      </Typography>
                    }
                  />
                </Stack>
                <FormControl component='fieldset' required sx={{ ml: 1 }}>
                  <RadioGroup
                    row
                    name='isActive'
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value='true'
                      control={<Radio color='primary' />}
                      label={<Typography sx={{ fontWeight: 400 }}>Active</Typography>}
                      sx={{ mr: 4 }}
                    />
                    <FormControlLabel
                      value='false'
                      control={<Radio color='primary' />}
                      label={<Typography sx={{ fontWeight: 400 }}>Inactive</Typography>}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* Form Buttons */}
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
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  )
}

export default StudentProfileEdit
