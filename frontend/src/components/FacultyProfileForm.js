/**
 * FacultyProfileForm.js
 *
 * This component creates the UI for faculty to make their profile.
 * It includes fields for name, email, and department.
 */

import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

const FacultyProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
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
    console.log('Submitted data: ', formData)
    // Sends POST request to backend to create faculty profile
    try {
      const response = await fetch('/api/faculty/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        console.error('Error creating profile:', response.statusText)
      } else {
        console.log('Profile created successfully')
      }
    } catch (error) {
      console.error('Error during profile creation:', error)
    }
  }

  const handleBack = () => {
    console.log('Back button pressed')
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
        fullWidth
        label='Department'
        name='department'
        value={formData.department}
        onChange={handleChange}
        margin='normal'
        required
      />
      <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
        Create Profile
      </Button>
    </Box>
  )
}

export default FacultyProfileForm
