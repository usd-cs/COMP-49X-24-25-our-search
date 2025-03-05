import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Card,
  Chip,
  OutlinedInput,
  Switch,
  FormGroup,
  Tooltip,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom'
import fetchMajors from '../utils/fetchMajors'
import fetchResearchPeriods from '../utils/fetchResearchPeriods'
import fetchUmbrellaTopics from '../utils/fetchUmbrellaTopics'
import fetchDisciplines from '../utils/fetchDisciplines'
import { backendUrl } from '../resources/constants'

// Helper function for multi-select rendering
const renderMultiSelectChips = (selected) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {selected.map((value) => (
      <Chip key={value.id} label={value.name} />
    ))}
  </Box>
)

const ResearchOpportunityForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [researchPeriodOptions, setResearchPeriodOptions] = useState([])
  const [majorAndFieldOptions, setMajorAndFieldOptions] = useState([])
  const [umbrellaTopics, setUmbrellaTopics] = useState([])
  const [disciplines, setDisciplines] = useState([])
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researchFields: [],
    disciplines: [],
    researchInterests: [],
    researchPeriods: [], // Store periods
    desiredQualifications: '',
    umbrellaTopics: [],
    isActive: false // Default to inactive
  })

  const [newPeriod, setNewPeriod] = useState({
    startTerm: '',
    endTerm: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fetch the current profile and data for dropdowns to pre-populate the form
  useEffect(() => {
    async function fetchData () {
      try {
        const majors = await fetchMajors()
        setMajorAndFieldOptions(majors)
        const researchPeriods = await fetchResearchPeriods()
        setResearchPeriodOptions(researchPeriods)
        const topics = await fetchUmbrellaTopics()
        setUmbrellaTopics(topics)
        const disc = await fetchDisciplines()
        setDisciplines(disc)
      } catch (error) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Handle switch toggle for active/inactive
  const handleActiveToggle = () => {
    setFormData({
      ...formData,
      isActive: !formData.isActive
    })
  }

  // Handle multi-select changes
  const handleMultiSelectChange = (event, fieldName) => {
    const {
      target: { value }
    } = event
    setFormData({
      ...formData,
      [fieldName]: typeof value === 'string' ? value.split(',') : value
    })
  }

  // Handle period input changes
  const handlePeriodChange = (field, value) => {
    setNewPeriod({
      ...newPeriod,
      [field]: value
    })
  }

  // Add a new research period
  const addResearchPeriod = () => {
    const { startTerm, endTerm } = newPeriod

    if (!startTerm) {
      setFormErrors({
        ...formErrors,
        newPeriod: 'At least the first semester is required'
      })
      return
    }

    // If it's a single semester period
    if (!endTerm) {
      // Check for duplicates
      const isDuplicate = formData.researchPeriods.some(
        period => period.periodString === startTerm
      )

      if (isDuplicate) {
        setFormErrors({
          ...formErrors,
          newPeriod: 'This semester has already been added'
        })
        return
      }

      // Add the single semester period
      const newPeriodObj = {
        startTerm,
        endTerm: null,
        periodString: startTerm
      }

      setFormData({
        ...formData,
        researchPeriods: [...formData.researchPeriods, newPeriodObj]
      })
    }
    // If it's a multi-semester period
    else {
      // Check start term is before end term
      const startIndex = researchPeriodOptions.indexOf(startTerm)
      const endIndex = researchPeriodOptions.indexOf(endTerm)

      if (startIndex >= endIndex) {
        setFormErrors({
          ...formErrors,
          newPeriod: 'End semester must be after start semester'
        })
        return
      }

      // Format the period for display
      const periodString = `${startTerm} to ${endTerm}`

      // Check for duplicates
      const isDuplicate = formData.researchPeriods.some(
        period => period.periodString === periodString
      )

      if (isDuplicate) {
        setFormErrors({
          ...formErrors,
          newPeriod: 'This research period has already been added'
        })
        return
      }

      // Add the multi-semester period
      const newPeriodObj = {
        startTerm,
        endTerm,
        periodString
      }

      setFormData({
        ...formData,
        researchPeriods: [...formData.researchPeriods, newPeriodObj]
      })
    }

    // Reset the inputs
    setNewPeriod({ startTerm: '', endTerm: '' })
    setFormErrors({ ...formErrors, newPeriod: null })
  }

  // Remove a research period
  const removeResearchPeriod = (index) => {
    const updatedPeriods = [...formData.researchPeriods]
    updatedPeriods.splice(index, 1)
    setFormData({
      ...formData,
      researchPeriods: updatedPeriods
    })
  }

  // Form validation
  const validateForm = () => {
    const errors = {}

    if (!formData.title) errors.title = 'Research title is required'
    if (!formData.description) errors.description = 'Description is required'

    if (formData.researchFields.length === 0) {
      errors.researchFields = 'At least one research field is required'
    }

    if (formData.disciplines.length === 0) {
      errors.disciplines = 'At least one discipline is required'
    }

    if (formData.researchPeriods.length === 0) {
      errors.researchPeriods = 'At least one research period is required'
    }

    if (formData.umbrellaTopics.length === 0) {
      errors.umbrellaTopics = 'At least one umbrella topic is required'
    }

    return errors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const errors = validateForm()

    if (Object.keys(errors).length === 0) {
      setSubmitting(true)
      setFormErrors({})

      try {
        const response = await fetch(`${backendUrl}/create-project`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }

        setSubmitSuccess(true)
      } catch (error) {
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setSubmitting(false)
      }
    } else {
      setFormErrors(errors)
      console.log('Validation errors:', errors)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 3 }}>
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <Button variant='outlined' onClick={() => { navigate('/posts') }} sx={{ mb: 2 }}>
          Back
        </Button>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Typography variant='h4' component='h1' fontWeight='500'>
            Create Research Opportunity
          </Typography>
          <Typography variant='subtitle1' sx={{ mt: 1, opacity: 0.9 }}>
            Create a new research opportunity for students
          </Typography>
        </Box>

        {/* Success Message */}
        {submitSuccess && (
          <Alert
            severity='success'
            variant='filled'
            sx={{ borderRadius: 0 }}
          >
            Research opportunity created successfully.
            {formData.isActive
              ? ' It is now visible to students.'
              : ' It has been saved as inactive.'}
          </Alert>
        )}

        {/* Form */}
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ p: 4 }}>
          {/* Project Status */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              p: 2,
              border: '1px solid',
              borderColor: formData.isActive ? 'success.main' : 'warning.main',
              borderRadius: 1,
              bgcolor: formData.isActive ? 'rgba(46, 125, 50, 0.05)' : 'rgba(237, 108, 2, 0.05)',
              color: formData.isActive ? 'success.dark' : 'warning.dark'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {formData.isActive
                ? (
                  <VisibilityIcon sx={{ mr: 1 }} />
                  )
                : (
                  <VisibilityOffIcon sx={{ mr: 1 }} />
                  )}
              <Typography variant='subtitle1' fontWeight='500'>
                {formData.isActive
                  ? 'Active: Students can view and apply to this opportunity'
                  : 'Inactive: This opportunity is hidden from students'}
              </Typography>
            </Box>
            <FormGroup>
              <Tooltip title={formData.isActive
                ? 'Switch to hide this opportunity from students'
                : 'Switch to make this opportunity visible to students'}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleActiveToggle}
                      name='isActive'
                      color={formData.isActive ? 'success' : 'warning'}
                    />
                  }
                  label={formData.isActive ? 'Active' : 'Inactive'}
                />
              </Tooltip>
            </FormGroup>
          </Box>

          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              id='title'
              name='title'
              label='Research Title'
              value={formData.title}
              onChange={handleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              variant='outlined'
              sx={{ mb: 3 }}
            />

            <TextField
              required
              fullWidth
              id='description'
              name='description'
              label='Research Description'
              value={formData.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              variant='outlined'
              multiline
              rows={3}
            />
          </Box>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider><Chip label='Fields & Interests' /></Divider>
          </Box>

          {/* Research Fields */}
          <Box sx={{ mb: 3 }}>
            <FormControl
              fullWidth
              required
              error={!!formErrors.researchFields}
              sx={{ mb: 3 }}
            >
              <InputLabel id='research-fields-label'>Research Fields/Majors</InputLabel>
              <Select
                labelId='research-fields-label'
                id='researchFields'
                name='researchFields'
                multiple
                value={formData.researchFields}
                onChange={(e) => handleMultiSelectChange(e, 'researchFields')}
                input={<OutlinedInput label='Research Fields/Majors' />}
                renderValue={renderMultiSelectChips}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 240
                    }
                  }
                }}
              >
                {majorAndFieldOptions.map((field, index) => (
                  <MenuItem key={field.id || index} value={field}>
                    {field.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.researchFields && (
                <FormHelperText>{formErrors.researchFields}</FormHelperText>
              )}
            </FormControl>

            {/* Disciplines */}
            <FormControl
              fullWidth
              required
              error={!!formErrors.disciplines}
              sx={{ mb: 3 }}
            >
              <InputLabel id='disciplines-label'>Disciplines</InputLabel>
              <Select
                labelId='disciplines-label'
                id='disciplines'
                name='disciplines'
                multiple
                value={formData.disciplines}
                onChange={(e) => handleMultiSelectChange(e, 'disciplines')}
                input={<OutlinedInput label='Disciplines' />}
                renderValue={renderMultiSelectChips}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 240
                    }
                  }
                }}
              >
                {disciplines.map((discipline) => (
                  <MenuItem key={discipline.id} value={discipline}>
                    {discipline.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.disciplines && (
                <FormHelperText>{formErrors.disciplines}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider><Chip label='Research Periods' /></Divider>
          </Box>

          {/* Research Periods */}
          <Box sx={{ mb: 3 }}>
            {/* Current Research Periods */}
            {formData.researchPeriods.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Research Periods
                </Typography>
                <Card variant='outlined'>
                  <List dense>
                    {formData.researchPeriods.map((period, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Divider />}
                        <ListItem
                          secondaryAction={
                            <IconButton
                              edge='end'
                              aria-label='delete'
                              onClick={() => removeResearchPeriod(index)}
                              size='small'
                              color='error'
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={period.periodString}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Card>
                {formErrors.researchPeriods && (
                  <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                    {formErrors.researchPeriods}
                  </Typography>
                )}
              </Box>
            )}

            {/* Add New Research Period */}
            <Typography variant='subtitle1' gutterBottom>
              Add Research Period
            </Typography>

            {/* Semester Selection */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 2,
                alignItems: 'center'
              }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '60px' }}>
                  <Typography>From:</Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel id='start-semester-label'>Select Semester</InputLabel>
                  <Select
                    labelId='start-semester-label'
                    id='startTerm'
                    value={newPeriod.startTerm}
                    onChange={(e) => handlePeriodChange('startTerm', e.target.value)}
                    label='Select Semester'
                  >
                    <MenuItem value=''>
                      <em>Select a semester</em>
                    </MenuItem>
                    {researchPeriodOptions.map((term) => (
                      <MenuItem key={term.id} value={term.name}>
                        {term.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '60px' }}>
                  <Typography>To:</Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel id='end-semester-label'>Select Semester (Not mandatory)</InputLabel>
                  <Select
                    labelId='end-semester-label'
                    id='endTerm'
                    value={newPeriod.endTerm}
                    onChange={(e) => handlePeriodChange('endTerm', e.target.value)}
                    label='Select Semester (Not mandatory)'
                  >
                    <MenuItem value=''>
                      <em>Select a semester</em>
                    </MenuItem>
                    {researchPeriodOptions.map((term) => (
                      <MenuItem key={term.id} value={term.name}>
                        {term.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Add Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={addResearchPeriod}
                  startIcon={<AddIcon />}
                  disabled={!newPeriod.startTerm}
                  aria-label='add-period-button'
                >
                  Add Period
                </Button>
              </Box>
            </Box>

            {formErrors.newPeriod && (
              <Typography variant='body2' color='error' sx={{ mt: 1, mb: 2 }}>
                {formErrors.newPeriod}
              </Typography>
            )}
          </Box>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider><Chip label='Additional Information' /></Divider>
          </Box>

          {/* Desired Qualifications */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id='desiredQualifications'
              name='desiredQualifications'
              label='Desired Qualifications'
              value={formData.desiredQualifications}
              onChange={handleChange}
              variant='outlined'
              multiline
              rows={2}
              placeholder='Describe qualifications students should have (courses, skills, etc.)'
            />
          </Box>

          {/* Umbrella Topics */}
          <Box sx={{ mb: 3 }}>
            <FormControl
              fullWidth
              required
              error={!!formErrors.umbrellaTopics}
            >
              <InputLabel id='umbrella-topics-label'>Umbrella Topics</InputLabel>
              <Select
                labelId='umbrella-topics-label'
                id='umbrellaTopics'
                name='umbrellaTopics'
                multiple
                value={formData.umbrellaTopics}
                onChange={(e) => handleMultiSelectChange(e, 'umbrellaTopics')}
                input={<OutlinedInput label='Umbrella Topics' />}
                renderValue={renderMultiSelectChips}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 240
                    }
                  }
                }}
              >
                {umbrellaTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.umbrellaTopics && (
                <FormHelperText>{formErrors.umbrellaTopics}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {submitting && (
            <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 1 }}>
              Submitting...
            </Typography>
          )}
          {/* Submit Button */}
          <Box sx={{ mt: 4 }}>
            <Button
              type='submit'
              fullWidth
              aria-label='submit-button'
              variant='contained'
              color='primary'
              size='large'
              disabled={submitting}
              startIcon={<SaveIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Create
            </Button>
            <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 1 }}>
              {formData.isActive
                ? 'This research opportunity will be published and visible to students.'
                : 'This research opportunity will be saved as inactive and can be published later.'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default ResearchOpportunityForm
