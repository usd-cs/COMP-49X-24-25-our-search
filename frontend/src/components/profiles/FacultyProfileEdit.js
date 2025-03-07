/**
 * FacultyProfileEdit.js
 *
 * This component fetches the current professor's profile data,
 * allows the factuly member to edit their profile information (including setting the profile as inactive),
 * and submits the updated data to the backend.
 * @author Rayan Pal
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
  Chip
} from '@mui/material'
import { backendUrl } from '../../resources/constants'
import fetchDepartments from '../../utils/fetchDepartments'
import { useNavigate } from 'react-router-dom'

const FacultyProfileEdit = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: []
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [departmentOptions, setDepartmentOptions] = useState([])

  useEffect(() => {
    async function fetchData () {
      try {
        const depts = await fetchDepartments()
        setDepartmentOptions(depts)

        const response = await fetch(`${backendUrl}/api/facultyProfiles/current`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        if (data) {
          setFormData({
            name: `${data.firstName} ${data.lastName}` || '',
            email: data.email || '',
            department: data.department.map((dept) => dept.id) || []
          })
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching your profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper function for multi-select rendering when the 
  // arrays populating the Select are arrays of ids.
  // Because the form renders its Select MenuItems with
  // key=option.id (an int) and value=option.id (an int),
  // the the Chip must have key=id and value=option.name
  const renderMultiSelectChips = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((id) => {
        const option = departmentOptions.find((opt) => opt.id === id)
        return <Chip key={id} label={option ? option.name : ''} />
      })}
    </Box>
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: !checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleMultiSelectChange = (event, fieldName) => {
    // when invoked, the fieldName must match the formData field name, written as a string,
  // e.g. fieldName='researchPeriods' if the formData has a formData.researchPeriods field.
    const {
      target: { value }
    } = event
    setFormData({
      ...formData,
      [fieldName]: typeof value === 'string' ? value.split(',') : value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${backendUrl}/api/facultyProfiles/current`, {
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
      await response.json()
      setSuccess('Profile updated successfully.')
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Button variant='outlined' onClick={() => { navigate('/view-professor-profile') }} sx={{ mb: 2 }}>
        Back to profile
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Edit Faculty Profile
      </Typography>
      {error !== null && (
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
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <FormControl fullWidth required>
          <InputLabel id='department-label'>Department</InputLabel>
          <Select
            labelId='department-label'
            multiple
            name='department'
            value={formData.department}
            onChange={(e) => handleMultiSelectChange(e, 'department')}
            input={<OutlinedInput label='Department' />}
            renderValue={renderMultiSelectChips}
          >
            {departmentOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
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
        <Button onClick={handleReset} variant='contained' color='error' type='button' disabled={submitLoading}>
          Reset
        </Button>
        <Button variant='contained' color='primary' type='submit' disabled={submitLoading}>
          {submitLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  )
}

export default FacultyProfileEdit
