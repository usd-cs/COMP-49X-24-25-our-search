import React, { useState, useEffect } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress
} from '@mui/material'

export default function WeeklyNotificationDaySelector () {
  const [day, setDay] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // load the current setting
  useEffect(() => {
    fetch('/api/weekly-notification-day', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch current schedule day')
        return res.json()
      })
      .then(data => {
        setDay(data.day)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load scheduled day')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSave = () => {
    setError(null)
    fetch('/api/weekly-notification-day', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day })
    })
      .then(res => {
        if (!res.ok) throw new Error('Save failed')
      })
      .catch(err => {
        console.error(err)
        setError('Failed to save scheduled day')
      })
  }

  if (loading) {
    return (
      <Box textAlign='center' py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box mb={4} p={2} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
      <Typography variant='h6' gutterBottom>
        Weekly Notification Day
      </Typography>

      {error && (
        <Typography color='error' gutterBottom>
          {error}
        </Typography>
      )}

      <FormControl fullWidth>
        <InputLabel id='weekly-day-label'>Day of Week</InputLabel>
        <Select
          labelId='weekly-day-label'
          id='weekly-day-select'
          value={day}
          label='Day of Week'
          onChange={e => setDay(e.target.value)}
          data-testid='weekly-day-select'
        >
          {DAYS.map(d => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box textAlign='right' mt={2}>
        <Button
          variant='contained'
          onClick={handleSave}
          data-testid='save-weekly-day'
        >
          Save Day
        </Button>
      </Box>
    </Box>
  )
}
