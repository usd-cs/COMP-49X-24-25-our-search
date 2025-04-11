/**
 * This component fetches the current professor's profile data, allows the admin
 * to edit the profile information and submits the updated data to the backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box, Button, TextField, Typography, Paper, CircularProgress, FormControl,
  InputLabel, Select, OutlinedInput, MenuItem, Chip, Divider
} from '@mui/material'
import { BACKEND_URL, viewFacultyFlag } from '../../resources/constants'
import fetchDepartments from '../../utils/fetchDepartments'
import { useNavigate, useParams } from 'react-router-dom'
import ClickForInfo from '../ClickForInfo'
import PersistentAlert from '../PersistentAlert'

const AdminFacultyEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    id: parseInt(id),
    name: '',
    email: '',
    department: []
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [departmentOptions, setDepartmentOptions] = useState([])

  const getNames = (list) => list.map(item => item.name)

  useEffect(() => {
    async function fetchData () {
      try {
        const deptsResponse = await fetchDepartments()
        const deptsAsNamesList = getNames(deptsResponse)
        setDepartmentOptions(deptsAsNamesList)

        const response = await fetch(`${BACKEND_URL}/faculty?id=${parseInt(id)}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        if (data) {
          if (data.id !== parseInt(id)) {
            throw new Error('ID in URL is not the same as returned.')
          }
          setFormData({
            id: data.id,
            name: `${data.firstName} ${data.lastName}` || '',
            email: data.email || '',
            department: data.department
          })
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching this profile. Please try again.')
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

    try {
      const response = await fetch(`${BACKEND_URL}/faculty`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        throw new Error(response.status)
      }
      const msg = `Changes saved for faculty: ${formData.name}.`
      navigate(`/posts?msg=${encodeURIComponent(msg)}&type=${encodeURIComponent('success')}&postsView=${encodeURIComponent(viewFacultyFlag)}`)
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
      <Button variant='outlined' onClick={() => { navigate('/posts') }} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant='h4' component='h1' gutterBottom>
        Edit Faculty Profile
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
                First and last name of the faculty member.
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

        <Divider>
          <Chip label='Email' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                The email cannot be changed.
              </Typography>
                                      }
          />
        </Divider>
        <TextField
          fullWidth
          label='Email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          disabled
        />

        <Divider>
          <Chip label='Department' />
          <ClickForInfo
            content={
              <Typography sx={{ fontSize: '1rem' }}>
                The department(s) the faculty member belongs to. This is simply informational.
                It does not affect how their projects are categorized.
              </Typography>
                                      }
          />
        </Divider>
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
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* No buttons present if there is an error fetching the data */}
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

export default AdminFacultyEdit
