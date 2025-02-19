/**
 * StudentProfileForm.js
 *
 * This component creates  the UI for students to make their profile.
 * It includes fields for name, email, major, class status, research field interests,
 * research periods interest, interest reason, and prior research experience.
 *
 * @author Rayan Pal
 */

import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'

const StudentProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    classStatus: '',
    researchFieldInterests: '',
    researchPeriodsInterest: '',
    interestReason: '',
    hasPriorExperience: ''
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
      const response = await fetch('/api/studentProfiles', {
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
        Create Your Profile
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
        label='Major'
        name='major'
        value={formData.major}
        onChange={handleChange}
        margin='normal'
        required
      />
      <TextField
        select
        fullWidth
        label='Class Status'
        name='classStatus'
        value={formData.classStatus}
        onChange={handleChange}
        margin='normal'
        required
      >
        <MenuItem value=''>
          <em>Select Class Status</em>
        </MenuItem>
        <MenuItem value='Freshman'>Freshman</MenuItem>
        <MenuItem value='Sophomore'>Sophomore</MenuItem>
        <MenuItem value='Junior'>Junior</MenuItem>
        <MenuItem value='Senior'>Senior</MenuItem>
        <MenuItem value='Graduate'>Graduate</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label='Research Field Interests'
        name='researchFieldInterests'
        value={formData.researchFieldInterests}
        onChange={handleChange}
        margin='normal'
        required
        helperText='Enter interests separated by commas'
      />
      <TextField
        fullWidth
        label='Research Periods Interest'
        name='researchPeriodsInterest'
        value={formData.researchPeriodsInterest}
        onChange={handleChange}
        margin='normal'
        required
        helperText='Enter research periods (e.g., Fall 2024, Spring 2025)'
      />
      <TextField
        fullWidth
        label='Interest Reason'
        name='interestReason'
        value={formData.interestReason}
        onChange={handleChange}
        margin='normal'
        required
        multiline
        rows={4}
      />
      <FormControl component='fieldset' margin='normal'>
        <FormLabel component='legend'>
          Do you have prior research experience?
        </FormLabel>
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
      <Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }}>
        Create Profile
      </Button>
    </Box>
  )
}

export default StudentProfileForm
