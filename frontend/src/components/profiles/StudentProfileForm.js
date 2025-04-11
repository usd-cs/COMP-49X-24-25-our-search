/**
 * StudentProfileForm.js
 *
 * This component creates  the UI for students to make their profile.
 * It includes fields for name, email, major, class status, research field interests,
 * research periods interest, interest reason, and prior research experience.
 *
 * @author Rayan Pal
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, FormControl, FormControlLabel, FormLabel,
  MenuItem, Radio, RadioGroup, TextField, Typography, Select,
  InputLabel, OutlinedInput, Chip, CircularProgress, Divider
} from '@mui/material'
import { BACKEND_URL, FRONTEND_URL } from '../../resources/constants'
import fetchMajors from '../../utils/fetchMajors'
import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import ClickForInfo from '../ClickForInfo'
import PersistentAlert from '../PersistentAlert'

const StudentProfileForm = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [researchPeriodOptions, setResearchPeriodOptions] = useState([])
  const [majorAndFieldOptions, setMajorAndFieldOptions] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    major: [],
    classStatus: '',
    graduationYear: '',
    researchFieldInterests: [],
    researchPeriodsInterest: [],
    interestReason: '',
    hasPriorExperience: false
  })

  useEffect(() => {
    async function fetchData () {
      try {
        const majors = await fetchMajors()
        setMajorAndFieldOptions(majors)
        const researchPeriods = await fetchResearchPeriods()
        setResearchPeriodOptions(researchPeriods)
      } catch (error) {
        console.error('Error fetching data for dropdowns:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = event => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value === 'true' ? true : value === 'false' ? false : value
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const response = await fetch(BACKEND_URL + '/api/studentProfiles', {
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
        window.location.href = `${BACKEND_URL}/login`
      }

      if (!response.ok) {
        throw new Error('Error creating profile:', response.statusText)
      } else {
        const result = await response.json()
        console.log('Submitted data: ', result)
        console.log('Profile created successfully')
        window.location.href = FRONTEND_URL + '/posts'
      }
    } catch (error) {
      console.error('Error during profile creation:', error)
      setError(true)
    }
  }

  const handleBack = () => {
    window.location.href = FRONTEND_URL + '/ask-for-role'
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
      <Button variant='outlined' onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Create Your Student Profile
      </Typography>
      {error === true && (
        <PersistentAlert msg='There was an error creating your profile. Please try again.' type='error' />
      )}
      <Divider>
        <Chip label='Basic Information' />
      </Divider>
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
      {/* Graduation Year Field */}
      <TextField
        fullWidth
        label='Graduation Year'
        name='graduationYear'
        type='number'
        value={formData.graduationYear}
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

      <Divider>
        <Chip label='Major(s)' />
        <ClickForInfo
          content={
            <Typography sx={{ fontSize: '1rem' }}>
              Your declared major(s). If not declared, choose "Undeclared".
            </Typography>
            }
        />
      </Divider>
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='major-label'>Major(s)</InputLabel>
        <Select
          labelId='major-label'
          multiple
          name='major'
          value={formData.major}
          onChange={handleChange}
          input={<OutlinedInput label='Major' />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {majorAndFieldOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider>
        <Chip label='Research Field Interest(s)' />
        <ClickForInfo
          content={
            <Typography sx={{ fontSize: '1rem' }}>
              The areas that the you are interested in conducting research in.
              Include your major if you want to do research related to your major.
              These do not have to match your major.
              You may be interested in doing research in areas other than what you are majoring in.
            </Typography>
            }
        />
      </Divider>
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='research-field-label'>Research Field Interest(s)</InputLabel>
        <Select
          labelId='research-field-label'
          multiple
          name='researchFieldInterests'
          value={formData.researchFieldInterests}
          onChange={handleChange}
          input={<OutlinedInput label='Research Field Interest(s)' />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {majorAndFieldOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant='caption' color='textSecondary'>
          Select all Research Fields that you're interested in. Include major if desired.
        </Typography>
      </FormControl>
      <Divider>
        <Chip label='Additional Information' />
        <ClickForInfo
          content={
            <Typography sx={{ fontSize: '1rem' }}>
              More information that is helpful for faculty to know about you.
            </Typography>
            }
        />
      </Divider>
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='research-period-label'>Research Period Interest(s)</InputLabel>
        <Select
          labelId='research-period-label'
          multiple
          name='researchPeriodsInterest'
          value={formData.researchPeriodsInterest}
          onChange={handleChange}
          input={<OutlinedInput label='Research Period' />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {researchPeriodOptions.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant='caption' color='textSecondary'>
          Select Period(s) that you're interested in doing research
        </Typography>
      </FormControl>
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
          value={formData.hasPriorExperience ? 'true' : 'false'}
          onChange={handleChange}
        >
          <FormControlLabel value='true' control={<Radio />} label='Yes' />
          <FormControlLabel value='false' control={<Radio />} label='No' />
        </RadioGroup>
      </FormControl>

      <Button type='submit' variant='contained' color='primary' sx={{ mt: 4 }} fullWidth>
        Create Profile
      </Button>
    </Box>
  )
}

export default StudentProfileForm
