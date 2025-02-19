/**
 * FacultyProfileForm.js
 *
 * This component creates the UI for faculty to make their profile.
 * It includes fields for name, email, and department.
 *
 * @author Rayan Pal
 */

import React, { useState } from 'react'
import { frontendUrl } from '../resources/constants'
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material'
import { backendUrl } from '../resources/constants'


const FacultyProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      console.log('Submitted data: ', result)
      if (!response.ok) {
        console.error('Error creating profile:', response.statusText)
        throw new Error('Error creating profile:', response.statusText)
      } else {
        console.log('Profile created successfully')
      }
    } catch (error) {
      console.error('Error during profile creation:', error)
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
      <TextField
        fullWidth
        label='Name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        margin='normal'
        required
      />
      <TextField
        fullWidth
        label='Email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        margin='normal'
        required
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
