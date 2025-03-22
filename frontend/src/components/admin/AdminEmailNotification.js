/**
 * AdminEmailNotifications.js
 * This component allows the admin to manage email notifications.
 * It fetches the current email templates for both students and faculty,
 * and displays two sections:
 *  - Email to Students: with editable subject and body fields.
 *  - Email to Faculty: with editable subject and body fields.
 *
 * @author Rayan Pal
 *
 */
import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Paper, CircularProgress, TextField, IconButton, Divider } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { backendUrl } from '../../resources/constants'
import { useNavigate } from 'react-router-dom'

const AdminEmailNotifications = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState({
    STUDENTS: { subject: '', body: '' },
    FACULTY: { subject: '', body: '' }
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [editing, setEditing] = useState({
    studentSubject: false,
    studentBody: false,
    facultySubject: false,
    facultyBody: false
  })

  // Fetch the current email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${backendUrl}/email-notifications`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        const mappedTemplates = data.reduce((acc, template) => {
          acc[template.type] = { subject: template.subject, body: template.body }
          return acc
        }, {})
        setTemplates(mappedTemplates)
      } catch (err) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const handleBack = () => {
    navigate('/posts')
  }

  const handleFieldChange = (type, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }))
  }

  const toggleEditing = (fieldKey) => {
    setEditing(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }))
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const templatesArray = [
        { type: 'STUDENTS', subject: templates.STUDENTS.subject, body: templates.STUDENTS.body },
        { type: 'FACULTY', subject: templates.FACULTY.subject, body: templates.FACULTY.body }
      ]
      const response = await fetch(`${backendUrl}/email-notifications`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templatesArray)
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      await response.json()
      setSuccess('Email templates updated successfully.')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
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
    <Paper sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      {/* Back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button variant='outlined' onClick={handleBack} sx={{ backgroundColor: 'lightblue', mr: 2 }}>
          Back
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography variant='h4'>Manage App Notifications</Typography>
        </Box>
      </Box>

      {/* Section: Email to Students */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' gutterBottom>
          Email to Students
        </Typography>
        <Typography variant='subtitle1' sx={{ mb: 2, color: 'text.secondary' }}>
          This email will be sent to all students at the start of the academic year to notify them about their status on the app.
        </Typography>
        {/* Subject Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label='Subject'
            value={templates.STUDENTS.subject}
            onChange={(e) => handleFieldChange('STUDENTS', 'subject', e.target.value)}
            disabled={!editing.studentSubject}
          />
          <IconButton onClick={() => toggleEditing('studentSubject')}>
            <EditIcon />
          </IconButton>
        </Box>
        {/* Body Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label='Email Body'
            value={templates.STUDENTS.body}
            onChange={(e) => handleFieldChange('STUDENTS', 'body', e.target.value)}
            disabled={!editing.studentBody}
            multiline
            rows={4}
          />
          <IconButton onClick={() => toggleEditing('studentBody')}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Section: Email to Faculty */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' gutterBottom>
          Email to Faculty
        </Typography>
        <Typography variant='subtitle1' sx={{ mb: 2, color: 'text.secondary' }}>
          This email will be sent to all faculty at the start of the academic year to notify them about their status on the app.
        </Typography>
        {/* Subject Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label='Subject'
            value={templates.FACULTY.subject}
            onChange={(e) => handleFieldChange('FACULTY', 'subject', e.target.value)}
            disabled={!editing.facultySubject}
          />
          <IconButton onClick={() => toggleEditing('facultySubject')}>
            <EditIcon />
          </IconButton>
        </Box>
        {/* Body Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label='Email Body'
            value={templates.FACULTY.body}
            onChange={(e) => handleFieldChange('FACULTY', 'body', e.target.value)}
            disabled={!editing.facultyBody}
            multiline
            rows={4}
          />
          <IconButton onClick={() => toggleEditing('facultyBody')}>
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Success and Error messages */}
      {success && (
        <Typography color='primary' sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Save Button */}
      <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={handleSubmit}
        disabled={submitLoading}
        sx={{ mt: 2 }}
      >
        {submitLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Paper>
  )
}

export default AdminEmailNotifications
