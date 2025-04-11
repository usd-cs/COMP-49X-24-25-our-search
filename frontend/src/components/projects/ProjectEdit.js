/**
 * This component fetches the current project's data, allows the admin
 * to edit the project information and submits the updated data to the backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Divider,
  Chip,
  Switch,
  FormGroup,
  Tooltip,
  CircularProgress,
  Autocomplete
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useParams, useNavigate } from 'react-router-dom'
import { BACKEND_URL, GET_DISCIPLINES_ENDPOINT, GET_RESEARCH_PERIODS_ENDPOINT, GET_UMBRELLA_TOPICS_ENDPOINT, viewMyProjectsFlag, viewProjectsFlag } from '../../resources/constants'
import PersistentAlert from '../PersistentAlert'
import getDataFrom from '../../utils/getDataFrom'
import ClickForInfo from '../ClickForInfo'

const ProjectEdit = ({ isFaculty = false, myFacultyProjectId = null }) => {
  // If admin is editing any project, id comes from URL params. If faculty is editing their own project, id comes from prop
  const { id } = useParams()
  const projectId = isFaculty ? myFacultyProjectId : id

  const [formData, setFormData] = useState({
    id: projectId,
    title: '',
    description: '',
    disciplines: [],
    researchPeriods: [],
    umbrellaTopics: [],
    desiredQualifications: '',
    isActive: false
  })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [researchPeriodOptions, setResearchPeriodOptions] = useState([])
  const [umbrellaTopics, setUmbrellaTopics] = useState([])
  const [disciplineOptions, setDisciplineOptions] = useState([])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [selectedMajors, setSelectedMajors] = useState({}) // key: disciplineId, value: list of major objects {id, name}

  // Creates a list for the PUT /project expected request body.
  // That is, a list of each discipline {id: x, name: disciplineName, majors: [...]}
  // where majors:[...] is a list of majors for this project
  const getDisciplinesToReturn = (selected) => {
    const toReturn = disciplineOptions.map(discipline => {
      // For each discipline, check if this discipline has selected majors
      const majors = selected[discipline.id] || []

      return {
        id: discipline.id,
        name: discipline.name, // Include the name of the discipline
        majors // Include the selected majors
      }
    })
    return toReturn
  }
  // Updates the form data to include the selected majors and their associated discipline
  const handleMajorChange = (disciplineId, event) => {
    const newSelectedMajors = { ...selectedMajors, [disciplineId]: event.target.value }

    setSelectedMajors(newSelectedMajors)

    const disciplinesToReturn = getDisciplinesToReturn(newSelectedMajors)

    setFormData({
      ...formData,
      disciplines: disciplinesToReturn
    })
  }

  // Formats the majors from the current project into a dictionary
  // (key: disciplineId, value: list of major objects) that the multiselect
  // dropdowns can read to pre-populate the form. Example output:
  // {
  //   1: [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Math' }],
  //   2: [{ id: 3, name: 'Biology' }]
  // }
  const getSelectedMajors = (disciplines, majorsList) => {
    return disciplines.reduce((acc, discipline) => {
      const filteredMajors = discipline.majors.filter(major =>
        majorsList.includes(major.name)
      )

      if (filteredMajors.length > 0) {
        acc[discipline.id] = filteredMajors
      }

      return acc
    }, {})
  }

  // Fetch the current profile and data for dropdowns to pre-populate the form
  useEffect(() => {
    async function fetchData () {
      try {
        const [researchPeriodsRes, umbrellaTopicsRes, disciplinesRes] = await Promise.all([
          getDataFrom(GET_RESEARCH_PERIODS_ENDPOINT),
          getDataFrom(GET_UMBRELLA_TOPICS_ENDPOINT),
          getDataFrom(GET_DISCIPLINES_ENDPOINT)
        ])
        setResearchPeriodOptions(researchPeriodsRes)
        setUmbrellaTopics(umbrellaTopicsRes)
        setDisciplineOptions(disciplinesRes)

        const url = `${BACKEND_URL}/project?id=${parseInt(projectId)}`
        const project = await getDataFrom(url)

        if (project.id !== parseInt(projectId)) throw new Error(`ID in request ${parseInt(projectId)} is not the same as returned ${project.id}.`)

        const selectedMajors = getSelectedMajors(disciplinesRes, project.majors)
        setSelectedMajors(selectedMajors)

        setFormData({
          id: parseInt(projectId),
          title: project.name,
          description: project.description,
          disciplines: [],
          researchPeriods: researchPeriodsRes.filter((p) => project.researchPeriods.includes(p.name)),
          umbrellaTopics: umbrellaTopicsRes.filter((t) => project.umbrellaTopics.includes(t.name)),
          desiredQualifications: project.desiredQualifications,
          isActive: project.isActive
        })
      } catch (error) {
        // setError(error.message)
        setError('An unexpected error occurred while getting project details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

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

  // Handle Select changes
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

  // Form validation
  const validateForm = () => {
    const errors = {}

    if (!formData.title) errors.title = 'Project title is required'
    if (!formData.description) errors.description = 'Description is required'

    // Check if at least one discipline has selected majors
    const selectedDisciples = Object.values(selectedMajors)
    const hasSelectedMajors = selectedDisciples.some((majors) => majors.length > 0)
    if (!hasSelectedMajors) {
      errors.disciplines = 'At least one discipline with a major must be selected'
    }

    return errors
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const errors = validateForm()

    if (Object.keys(errors).length === 0) {
      setSubmitting(true)
      setFormErrors({})

      const disciplinesToReturn = getDisciplinesToReturn(selectedMajors)

      const formDataWithDisciplines = {
        ...formData,
        disciplines: disciplinesToReturn
      }

      try {
        const response = await fetch(`${BACKEND_URL}/project`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataWithDisciplines)
        })
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const msg = 'Research opportunity edited successfully.'
        if (isFaculty) {
          navigate(`/posts?msg=${encodeURIComponent(msg)}&type=${encodeURIComponent('success')}&postsView=${encodeURIComponent(viewMyProjectsFlag)}`)
        } else {
          navigate(`/posts?msg=${encodeURIComponent(msg)}&type=${encodeURIComponent('success')}&postsView=${encodeURIComponent(viewProjectsFlag)}`)
        }
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

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {error && (
        <Box sx={{ mt: 4, p: 3 }}>
          <PersistentAlert msg={error} type='error' />
        </Box>
      )}
      <Paper
        elevation={3}
        sx={{
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Typography variant='h4' component='h1' fontWeight='500'>
            Edit Research Opportunity
          </Typography>
          <Typography variant='subtitle1' sx={{ mt: 1, opacity: 0.9 }}>
            Edit the details of your research opportunity. When the opportunity is set to active, it will be visible to
            students and other faculty on this platform.
          </Typography>
        </Box>

        {/* Form */}
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ p: 4 }}>
          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              id='title'
              name='title'
              label='Project Title'
              value={formData.title}
              onChange={handleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              variant='outlined'
              sx={{ mb: 3 }}
              placeholder='Give your project a title'
            />

            {/* Description */}
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
              placeholder='Describe what your project is about'
            />
          </Box>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Chip label='Majors' />
              <ClickForInfo
                content={
                  <Typography sx={{ fontSize: '1rem' }}>
                    Select the majors most relevant to your project.
                    Students from these academic backgrounds will see it as a match.
                  </Typography>
                              }
              />
            </Divider>
          </Box>

          {/* Disciplines and Research Fields */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant='description' sx={{ mb: 2 }}>
              Choose one or more majors for your project.
            </Typography>
            <Typography variant='description' sx={{ mb: 2 }}>
              Below shows one drop-down menu for each discipline.
              The disciplines contain majors to choose from.
            </Typography>
            <Typography variant='description' sx={{ mb: 2 }}>
              You have to choose from at least one drop-down.
            </Typography>
            {disciplineOptions.map((discipline) => (
              <FormControl
                key={discipline.id}
                fullWidth
                margin='normal'
                error={!!formErrors.disciplines}
                id={`discipline-${discipline.id}`} // These ids help for testing- so the test knows what input label to use
              >
                <Autocomplete
                  multiple
                  id={`autocomplete-${discipline.id}`}
                  options={discipline.majors}
                  getOptionLabel={(option) => option.name}
                  value={selectedMajors[discipline.id] || []}
                  onChange={(event, newValue) => handleMajorChange(discipline.id, { target: { value: newValue } })}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
                    ))}
                  renderInput={(params) => <TextField {...params} label={discipline.name} />}
                  disableCloseOnSelect
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                {formErrors.disciplines && (
                  <FormHelperText>{formErrors.disciplines}</FormHelperText>
                )}
              </FormControl>
            ))}
          </Box>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Chip label='Research Periods' />
              <ClickForInfo
                content={
                  <Typography sx={{ fontSize: '1rem' }}>
                    Choose the time period(s) for which your project will be happening.
                    Your project may take place over multiple periods.
                    If you aren't sure yet, you can can leave this blank and edit it later.
                  </Typography>
                              }
              />
            </Divider>
          </Box>

          {/* Research Periods */}
          <FormControl
            fullWidth
            error={!!formErrors.researchPeriods}
            sx={{ mb: 3 }}
          >
            <Autocomplete
              multiple
              id='research-periods'
              options={researchPeriodOptions}
              getOptionLabel={(option) => option.name}
              value={formData.researchPeriods}
              onChange={(event, newValue) =>
                handleMultiSelectChange({ target: { value: newValue } }, 'researchPeriods')}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
                ))}
              renderInput={(params) => <TextField {...params} label='Research Period(s)' />}
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            {formErrors.researchPeriods && (
              <FormHelperText>{formErrors.researchPeriods}</FormHelperText>
            )}
          </FormControl>

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Chip label='Desired Qualifications' />
              <ClickForInfo
                content={
                  <Typography sx={{ fontSize: '1rem' }}>
                    Describe qualifications students should have (courses, skills, etc.).
                  </Typography>
                              }
              />
            </Divider>
          </Box>

          {/* Desired Qualifications */}
          <Box sx={{ mb: 3 }}>
            <TextField
              required
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

          {/* Section Divider */}
          <Box sx={{ my: 3 }}>
            <Divider>
              <Chip label='Umbrella Topics' />
              <ClickForInfo
                content={
                  <Typography sx={{ fontSize: '1rem' }}>
                    These are broad, cross-disciplinary themes that help categorize research projects beyond
                    official major names. They are concepts that can span across many fields.
                    They reflect broader areas of interest that may not be captured by a student's specific major.
                  </Typography>
                          }
              />
            </Divider>
          </Box>

          {/* Umbrella Topics */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth error={!!formErrors.umbrellaTopics}>
              <Autocomplete
                multiple
                id='umbrellaTopics'
                options={umbrellaTopics}
                getOptionLabel={(option) => option.name}
                value={formData.umbrellaTopics}
                onChange={(event, newValue) =>
                  handleMultiSelectChange({ target: { value: newValue } }, 'umbrellaTopics')}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip key={option.id} label={option.name} {...getTagProps({ index })} />
                  ))}
                renderInput={(params) => <TextField {...params} label='Umbrella Topic(s)' />}
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              {formErrors.umbrellaTopics && (
                <FormHelperText>{formErrors.umbrellaTopics}</FormHelperText>
              )}
            </FormControl>
          </Box>

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
              bgcolor: formData.isActive
                ? 'rgba(46, 125, 50, 0.05)'
                : 'rgba(237, 108, 2, 0.05)',
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
                  ? 'Active: Students can view this opportunity'
                  : 'Inactive: This opportunity is hidden from students'}
              </Typography>
            </Box>
            <FormGroup>
              <Tooltip
                title={
                  formData.isActive
                    ? 'Switch to hide this opportunity from students'
                    : 'Switch to make this opportunity visible to students'
                }
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

          {submitting && (
            <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 1 }}>
              Submitting...
            </Typography>
          )}

          <>
            {/* Submit Button */}
            <Box sx={{ mt: 4 }}>
              <Button
                type='submit'
                fullWidth
                aria-label='submit-button'
                variant='contained'
                color='primary'
                size='large'
                startIcon={<SaveIcon />}
                disabled={submitting || error !== null}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Save changes
              </Button>
            </Box>
          </>

          <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 1 }}>
            {formData.isActive
              ? 'This research opportunity will be published and visible to students.'
              : 'This research opportunity will be saved as inactive and can be published later.'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default ProjectEdit
