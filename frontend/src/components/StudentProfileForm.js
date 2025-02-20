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
  Typography,
  Select,
  InputLabel,
  OutlinedInput,
  Chip
} from '@mui/material'
import { backendUrl } from '../resources/constants'

const researchFieldOptions = ['Artificial Intelligence', 'Data Science', 'Cybersecurity']

const StudentProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    classStatus: '',
    researchFieldInterests: [],
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
      const response = await fetch(backendUrl + '/api/studentProfiles', {
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

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, display: 'flex', flexDirection: 'column' }}
    >
      <Button variant='outlined' onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Create Your Student Profile
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
      {/* Convert Major to a dropdown */}
      <TextField
        select
        fullWidth
        label='Major'
        name='major'
        value={formData.major}
        onChange={handleChange}
        margin='normal'
        required
      >
        <MenuItem value='Computer Science'>Computer Science</MenuItem>
        <MenuItem value='Mathematics'>Mathematics</MenuItem>
        <MenuItem value='Biology'>Biology</MenuItem>
      </TextField>
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
      {/* Convert Research Field Interests to a multi-select dropdown populated from a hardcoded array */}
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='research-field-label'>Research Field</InputLabel>
        <Select
          labelId='research-field-label'
          multiple
          name='researchFieldInterests'
          value={formData.researchFieldInterests}
          onChange={handleChange}
          input={<OutlinedInput label='Research Field' />}
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
      {/* Convert Research Periods Interest to a dropdown */}
      <TextField
        select
        fullWidth
        label='Research Period'
        name='researchPeriodsInterest'
        value={formData.researchPeriodsInterest}
        onChange={handleChange}
        margin='normal'
        required
        helperText='Select research period'
      >
        <MenuItem value='Fall 2024'>Fall 2024</MenuItem>
        <MenuItem value='Spring 2025'>Spring 2025</MenuItem>
        <MenuItem value='Summer 2025'>Summer 2025</MenuItem>
      </TextField>
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
      {/* Create Profile button moved to the bottom and set to full width */}
      <Button type='submit' variant='contained' color='primary' sx={{ mt: 4 }} fullWidth>
        Create Profile
      </Button>
    </Box>
  )
}

export default StudentProfileForm
