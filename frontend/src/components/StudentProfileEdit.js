/**
 * StudentProfileEdit.js
 *
 * This component fetches the current student's profile data,
 * allows the user to edit their profile information (including setting the profile as inactive),
 * and submits the updated data to the backend.
 * It displays error and success messages based on the submission outcome.
 */

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  RadioGroup,
  Radio
} from '@mui/material'
import { backendUrl } from '../resources/constants'

const classStatusOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
const majorOptions = ['Computer Science', 'Mathematics', 'Biology', 'Physics']
const researchFieldOptions = ['Artificial Intelligence', 'Data Science', 'Cybersecurity']

const StudentProfileEdit = () => {
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    classStatus: [],
    major: [],
    researchFieldInterests: [],
    researchPeriodsInterest: [],
    interestReason: '',
    hasPriorExperience: '',
    active: true // true means active; false means inactive
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch the current profile to pre-populate the form
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
        if (data) {
          setFormData({
            name: data.name || '',
            graduationYear: data.graduationYear || '',
            classStatus: data.classStatus || [],
            major: data.major || [],
            researchFieldInterests: data.researchFieldInterests || [],
            researchPeriodsInterest: data.researchPeriodsInterest || [],
            interestReason: data.interestReason || '',
            hasPriorExperience: data.hasPriorExperience || '',
            active: data.active !== undefined ? data.active : true
          })
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching your profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    if (type === 'checkbox') {
      // For the inactive checkbox, if checked means "Set Profile as Inactive", then active = !checked.
      setFormData(prev => ({ ...prev, [name]: !checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleMultiSelectChange = (event, fieldName) => {
    const { value } = event.target
    setFormData(prev => ({
      ...prev,
      [fieldName]: typeof value === 'string' ? value.split(',') : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${backendUrl}/api/studentProfiles`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const result = await response.json()
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitLoading(false)
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
      <Typography variant='h4' component='h1' gutterBottom>
        Edit Student Profile
      </Typography>
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color='primary' sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
      <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label='Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label='Graduation Year'
          name='graduationYear'
          type='number'
          value={formData.graduationYear}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth required>
          <InputLabel id='class-status-label'>Class Status</InputLabel>
          <Select
            labelId='class-status-label'
            multiple
            name='classStatus'
            value={formData.classStatus}
            onChange={(e) => handleMultiSelectChange(e, 'classStatus')}
            input={<OutlinedInput label='Class Status' />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {classStatusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel id='major-label'>Major</InputLabel>
          <Select
            labelId='major-label'
            multiple
            name='major'
            value={formData.major}
            onChange={(e) => handleMultiSelectChange(e, 'major')}
            input={<OutlinedInput label='Major' />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {majorOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel id='research-field-label'>Research Field Interest(s)</InputLabel>
          <Select
            labelId='research-field-label'
            multiple
            name='researchFieldInterests'
            value={formData.researchFieldInterests}
            onChange={(e) => handleMultiSelectChange(e, 'researchFieldInterests')}
            input={<OutlinedInput label='Research Field Interest(s)' />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {researchFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label='Research Period(s)'
          name='researchPeriodsInterest'
          value={Array.isArray(formData.researchPeriodsInterest) ? formData.researchPeriodsInterest.join(', ') : formData.researchPeriodsInterest}
          onChange={(e) => handleMultiSelectChange(e, 'researchPeriodsInterest')}
          helperText='Enter research periods separated by commas.'
          required
        />
        <TextField
          fullWidth
          label='Interest Reason'
          name='interestReason'
          value={formData.interestReason}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <FormControl component='fieldset' required>
          <Typography variant='subtitle1'>Prior Research Experience</Typography>
          <RadioGroup
            row
            name='hasPriorExperience'
            value={formData.hasPriorExperience}
            onChange={handleChange}
          >
            <FormControlLabel value='yes' control={<Radio />} label='Yes' />
            <FormControlLabel value='no' control={<Radio />} label='No' />
          </RadioGroup>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={!formData.active}
              onChange={handleChange}
              name='active'
            />
          }
          label='Set Profile as Inactive'
        />
        <Button variant='contained' color='primary' type='submit' disabled={submitLoading}>
          {submitLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  )
}

export default StudentProfileEdit
