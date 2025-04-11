/**
 * This component fetches the current student's profile data, allows the admin
 * to edit the profile information and submits the updated data to the backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, TextField, Typography, Paper, CircularProgress,
  FormControlLabel, FormControl, InputLabel, Select, OutlinedInput, MenuItem,
  Chip, RadioGroup, Radio, Divider
} from '@mui/material'
import { BACKEND_URL, viewStudentsFlag } from '../../resources/constants'
import fetchMajors from '../../utils/fetchMajors'
import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import { useNavigate, useParams } from 'react-router-dom'
import ClickForInfo from '../ClickForInfo'
import PersistentAlert from '../PersistentAlert'

// Helper functions takes the backend's response of objects (with ids and names)
// and parses it into an array of strings based on name. This is helpful for rendering
// the values prepopulated in the form's Select MenuItems.
const getNames = (list) => list.map(item => item.name)

const AdminStudentEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    id: parseInt(id),
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

        const response = await fetch(`${BACKEND_URL}/student?id=${parseInt(id)}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          console.log('here')
          throw new Error(response.status)
        }
        const data = await response.json()
        if (data) {
          if (data.id !== parseInt(id)) {
            throw new Error('ID in URL is not the same as returned.')
          }
          setFormData({
            id: data.id,
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
      } catch (err) {
        if (err.message === '400') {
          setError('Bad request')
        } else {
          setError('An unexpected error occurred while fetching this profile. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Helper function for multi-select rendering
  // Because the form renders its Select MenuItems with
  // key=option (a string) and value=option (a string),
  // the the Chip must have key=option and value=option
  const renderMultiSelectChips = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((option) => (
        <Chip key={option} label={option} />
      ))}
    </Box>
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value === 'true' ? true : value === 'false' ? false : value
    }))
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
      const updatedFormData = {
        ...formData,
        classStatus: formData.classStatus || '' // Convert to string or empty string if no value selected
      }
      const response = await fetch(`${BACKEND_URL}/student`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      })
      if (!response.ok) {
        throw new Error(response.status)
      }

      const msg = `Changes saved for student: ${formData.name}.`
      navigate(`/posts?msg=${encodeURIComponent(msg)}&type=${encodeURIComponent('success')}&postsView=${encodeURIComponent(viewStudentsFlag)}`)
    } catch (err) {
      if (err.message === '400') {
        setError('Bad request')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
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
      <Button variant='outlined' onClick={() => { navigate('/posts') }} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Edit Student Profile
      </Typography>
      {error !== null && (
        <PersistentAlert msg={error} type='error' />
      )}
      <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Divider>
          <Chip label='Name' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                First and last name of the student.
              </Typography>
            }
          />
        </Divider>
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
          id='graduationYear'
          label='Graduation Year'
          name='graduationYear'
          type='number'
          value={formData.graduationYear}
          onChange={handleChange}
          required
          data-testid='graduationYear'
        />
        <FormControl fullWidth required>
          <InputLabel id='class-status-label'>Class Status</InputLabel>
          <Select
            labelId='class-status-label'
            name='classStatus'
            value={formData.classStatus}
            onChange={handleChange}
            input={<OutlinedInput label='Class Status' />}
            renderValue={(selected) => selected || ''}
          >
            {classStatusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider>
          <Chip label='Major' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                The declared major(s) of the student. If not declared, choose "Undeclared".
              </Typography>
            }
          />
        </Divider>
        <FormControl fullWidth required>
          <InputLabel id='major-label'>Major</InputLabel>
          <Select
            labelId='major-label'
            multiple
            name='majors'
            value={formData.majors}
            onChange={(e) => handleMultiSelectChange(e, 'majors')}
            input={<OutlinedInput label='Major' />}
            renderValue={renderMultiSelectChips}
          >
            {majorAndFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider>
          <Chip label='Research Field Interest(s)' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                The areas that the student is interested in conducting research in.
                Include their major if they want to do research related to their major.
                These do not have to match their major.
                Students may be interested in doing research in areas other than what they are majoring in.
              </Typography>
            }
          />
        </Divider>
        <FormControl fullWidth required>
          <InputLabel id='research-field-label'>Research Field Interest(s)</InputLabel>
          <Select
            labelId='research-field-label'
            multiple
            name='researchFieldInterests'
            value={formData.researchFieldInterests}
            onChange={(e) => handleMultiSelectChange(e, 'researchFieldInterests')}
            input={<OutlinedInput label='Research Field Interest(s)' />}
            renderValue={renderMultiSelectChips}
          >
            {majorAndFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider>
          <Chip label='Additional Information' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                More information that is helpful for faculty to know about the student.
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
            onChange={(e) => handleMultiSelectChange(e, 'researchPeriodsInterest')}
            input={<OutlinedInput label='Research Period' />}
            renderValue={renderMultiSelectChips}
          >
            {researchPeriodOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
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
          multiline
          rows={4}
          required
        />
        <FormControl component='fieldset' required>
          <Typography variant='subtitle1'>Prior Research Experience</Typography>
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
        <FormControl component='fieldset' required>
          <Typography variant='subtitle1'>Profile Status</Typography>
          <RadioGroup
            row
            name='isActive'
            value={formData.isActive ? 'true' : 'false'}
            onChange={handleChange}
          >
            <FormControlLabel value='true' control={<Radio />} label='Active' />
            <FormControlLabel value='false' control={<Radio />} label='Inactive' />
          </RadioGroup>
        </FormControl>
        {error === null && (
          <>
            <Button onClick={handleReset} variant='contained' color='error' type='button' disabled={submitLoading}>
              Reset
            </Button>
            <Button variant='contained' color='primary' type='submit' disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  )
}

export default AdminStudentEdit
