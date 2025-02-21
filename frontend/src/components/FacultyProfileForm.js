/**
 * FacultyProfileForm.js
 *
 * This component creates the UI for faculty to make their profile.
 * It includes fields for name, email, and department.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState } from 'react'
import { frontendUrl, backendUrl } from '../resources/constants'
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material'

const FacultyProfileForm = () => {
  const [error, setError] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    department: [] // Changed from string to array for multi-select
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

  // Hardcoded list of departments
  const departmentOptions = [
    'Computer Science',
    'Mathematics',
    'Biology',
    'Physics'
  ]

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
      <TextField
        select
        fullWidth
        label='Department'
        name='department'
        value={formData.department}
        onChange={handleChange}
        margin='normal'
        required
        SelectProps={{
          multiple: true
        }}
      >
        <MenuItem value=''>
          <em>Select Department</em>
        </MenuItem>
        {departmentOptions.map(dept => (
          <MenuItem key={dept} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </TextField>
      <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
        Create Profile
      </Button>
    </Box>
  )
}

export default FacultyProfileForm
