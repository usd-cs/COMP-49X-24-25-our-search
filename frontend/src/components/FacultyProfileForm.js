/**
 * FacultyProfileForm.js
 *
 * This component creates the UI for faculty to make their profile.
 * It includes fields for name, email, and department.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import { frontendUrl, backendUrl } from '../resources/constants'
import {
  Box, Button, TextField, Typography, MenuItem,
  FormControl, InputLabel, Select, OutlinedInput, Chip, CircularProgress
} from '@mui/material'
import fetchDepartments from '../utils/fetchDepartments'

const FacultyProfileForm = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [departmentOptions, setDepartmentOptions] = useState([])

  useEffect(() => {
    async function fetchData () {
      try {
        const departments = await fetchDepartments()
        setDepartmentOptions(departments)
      } catch (error) {
        console.error('Error fetching departments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    department: []
  })

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const response = await fetch(backendUrl + '/api/facultyProfiles', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'manual',
        body: JSON.stringify(formData)
      })

      // include for the edge case if the user's authentication session ends on the backend
      // the user will need to login again
      if (response.status === 0) {
        window.location.href = `${backendUrl}/login`
      }

      if (!response.ok) {
        throw new Error('Error creating profile:', response.statusText)
      } else {
        console.log('Profile created successfully')
        const result = await response.json()
        console.log('Submitted data: ', result)
        window.location.href = frontendUrl + '/posts'
      }
    } catch (error) {
      console.error('Error during profile creation:', error)
      setError(true)
    }
  }
  const handleBack = () => {
    window.location.href = frontendUrl + '/ask-for-role'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}
    >
      <Button
        variant='outlined'
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Create Your Faculty Profile
      </Typography>
      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          There was an error creating your profile. Please try again.
        </Typography>
      )}
      <TextField
        fullWidth
        label='Name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        margin='normal'
        required
        error={formData.name && !/^[A-Za-z]+( [A-Za-z]+){1,}$/.test(formData.name)}
        helperText='Enter your full name (First and Last required)'
        // enforces the name to be at least two words long
      />
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='department-label'>Department(s)</InputLabel>
        <Select
          labelId='department-label'
          multiple
          name='department'
          value={formData.department}
          onChange={handleChange}
          input={<OutlinedInput label='department' />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {departmentOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
        Create Profile
      </Button>
    </Box>
  )
}

export default FacultyProfileForm
