/**
 * @file Renders sidebar for filters via a MUI Drawer so it can be opened or closed.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Typography, Drawer,
  Button, Accordion, AccordionSummary, Checkbox,
  AccordionDetails, FormControlLabel, Divider, CircularProgress
} from '@mui/material'
import SearchBar from './SearchBar'
import PersistentAlert from '../popups/PersistentAlert'
import {
  CUSTOM_BG_COLOR, CUSTOM_BUTTON_COLOR,
  viewFacultyFlag, viewMyProjectsFlag, viewProjectsFlag, viewStudentsFlag,
  GET_MAJORS_ENDPOINT, GET_UMBRELLA_TOPICS_ENDPOINT, GET_RESEARCH_PERIODS_ENDPOINT,
  CUSTOM_RED_COLOR
} from '../../resources/constants'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import getDataFrom from '../../utils/getDataFrom'
import { getMajorsExpectedResponse, getResearchPeriodsExpectedResponse, getUmbrellaTopicsExpectedResponse } from '../../resources/mockData'

function Sidebar ({ drawerWidth, open, postsView, toggleDrawer }) {
  if (!postsView) postsView = viewProjectsFlag

  const { search } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState(null)
  const [loadingInitial, setLoadingInitial] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  // filters for projects only
  const [umbrellaTopics, setUmbrellaTopics] = useState(getUmbrellaTopicsExpectedResponse)
  const [selectedUmbrellaTopics, setSelectedUmbrellaTopics] = useState([]) // selected determines what is checked already

  // filters for both students and projects
  const [researchPeriods, setResearchPeriods] = useState(getResearchPeriodsExpectedResponse)
  const [selectedResearchPeriods, setSelectedResearchPeriods] = useState([])
  const [majors, setMajors] = useState(getMajorsExpectedResponse)
  const [selectedMajors, setSelectedMajors] = useState([])

  const TYPE_MAJORS = 'Majors'
  const TYPE_UMBRELLA_TOPICS = 'Umbrella Topics'
  const TYPE_RESEARCH_PERIODS = 'Research Periods'

  const getFilteredIds = (param) => {
    return param.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
  }

  // when the page loads up, get all of the things to render
  useEffect(() => {
    // prepopulate the items as already selected if they are currently in the search params
    const currentParams = new URLSearchParams(search)

    // refresh the selected... variables
    setSelectedMajors([])
    setSelectedResearchPeriods([])
    setSelectedUmbrellaTopics([])

    const periodParam = currentParams.get('researchPeriods')
    if (periodParam) {
      const periodIds = getFilteredIds(periodParam)
      setSelectedResearchPeriods(periodIds)
    }
    const majorsParam = currentParams.get('majors')
    if (majorsParam) {
      const majorIds = getFilteredIds(majorsParam)
      setSelectedMajors(majorIds)
    }
    const umbrellaParam = currentParams.get('umbrellaTopics')
    if (umbrellaParam) {
      const umbrellaIds = getFilteredIds(umbrellaParam)
      setSelectedUmbrellaTopics(umbrellaIds)
    }

    async function fetchData () {
      try {
        const majorsRes = await getDataFrom(GET_MAJORS_ENDPOINT)
        setMajors(majorsRes)

        const umbrellaTopicsRes = await getDataFrom(GET_UMBRELLA_TOPICS_ENDPOINT)
        setUmbrellaTopics(umbrellaTopicsRes)

        const researchPeriodsRes = await getDataFrom(GET_RESEARCH_PERIODS_ENDPOINT)
        setResearchPeriods(researchPeriodsRes)
      } catch (error) {
        setError('Error loading filters data. Please try again later.')
      } finally {
        setLoadingInitial(false)
      }
    }
    // fetchData()
  }, [postsView, search])

  const handleCheckboxChange = (id, type) => {
    switch (type) {
      case TYPE_MAJORS:
        setSelectedMajors((prev) =>
          prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        )
        break
      case TYPE_RESEARCH_PERIODS:
        setSelectedResearchPeriods((prev) =>
          prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        )
        break
      case TYPE_UMBRELLA_TOPICS:
        setSelectedUmbrellaTopics((prev) =>
          prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        )
        break
      default:
        break
    }
  }

  const handleApply = () => {
    // clone existing params so we don't clobber unrelated ones
    const next = new URLSearchParams(searchParams)

    if (searchQuery) {
      next.set('search', searchQuery)
    } else {
      next.delete('search')
    }

    if (selectedMajors.length) {
      next.set('majors', selectedMajors.join(','))
    } else {
      next.delete('majors')
    }

    if (selectedResearchPeriods.length) {
      next.set('researchPeriods', selectedResearchPeriods.join(','))
    } else {
      next.delete('researchPeriods')
    }

    if (selectedUmbrellaTopics.length) {
      next.set('umbrellaTopics', selectedUmbrellaTopics.join(','))
    } else {
      next.delete('umbrellaTopics')
    }

    navigate(`?${next.toString()}`, { replace: true })
  }

  const handleReset = () => {
    setSelectedMajors([])
    setSelectedResearchPeriods([])
    setSelectedUmbrellaTopics([])
    setSearchQuery('')

    // remove only the filter params, keep any others
    const next = new URLSearchParams(searchParams)
    next.delete('majors')
    next.delete('researchPeriods')
    next.delete('umbrellaTopics')
    next.delete('search')

    navigate(`?${next.toString()}`, { replace: true })
  }

  const renderApplyResetButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 2 }}>
        <Button
          variant='outlined'
          onClick={handleApply}
          sx={{
            borderColor: CUSTOM_BUTTON_COLOR,
            textTransform: 'none',
            fontWeight: 'bold',
            color: CUSTOM_BUTTON_COLOR,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: `${CUSTOM_BUTTON_COLOR}80`
            },
            px: 2,
            py: 1,
            mt: 2
          }}
        >
          Apply
        </Button>
        <Button
          variant='outlined'
          onClick={handleReset}
          sx={{
            borderColor: CUSTOM_RED_COLOR,
            textTransform: 'none',
            fontWeight: 'bold',
            color: CUSTOM_RED_COLOR,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: '#dc7b7b'
            },
            px: 2,
            py: 1,
            mt: 2
          }}
        >
          Reset
        </Button>
      </Box>
    )
  }

  const renderCloseButton = () => {
    return (
      <Button
        onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          minWidth: '40px',
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          p: 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        X
      </Button>
    )
  }

  const renderFilterAccordion = (type, items, selectedItems) => {
    return (
      <Accordion
        disableGutters
        sx={{
          backgroundColor: CUSTOM_BG_COLOR,
          p: 1,
          boxShadow: 0,
          overflow: 'hidden',
          '&:last-child': { mb: 0 },
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: '48px',
            '& .MuiAccordionSummary-content': {
              margin: '12px 0'
            }
          }}
        >
          <Typography variant='subtitle1'>{type}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id, type)}
                />
            }
              label={item.name}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    )
  }

  const renderDrawerContent = () => {
    if (postsView === viewStudentsFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR, mt: 7 }} role='presentation'>
          {renderCloseButton()}
          <SearchBar handleApply={handleApply} searchQuery={searchQuery} setSearchQuery={setSearchQuery} postsView={postsView} />
          <Typography variant='h6' sx={{ mt: 6, ml: 2 }}>
            Filter
          </Typography>
          <Divider />
          {renderFilterAccordion(TYPE_MAJORS, majors, selectedMajors)}
          <Divider />
          {renderFilterAccordion(TYPE_RESEARCH_PERIODS, researchPeriods, selectedResearchPeriods)}
          <Divider />
          {renderApplyResetButtons()}

        </Box>
      )
    } else if (postsView === viewProjectsFlag || postsView === viewMyProjectsFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR, mt: 7 }} role='presentation'>
          {renderCloseButton()}
          <SearchBar handleApply={handleApply} searchQuery={searchQuery} setSearchQuery={setSearchQuery} postsView={postsView} />
          <Typography variant='h6' sx={{ mt: 3, ml: 2, mb: 1 }}>
            Filter
          </Typography>
          <Divider />
          {renderFilterAccordion(TYPE_MAJORS, majors, selectedMajors)}
          <Divider />
          {renderFilterAccordion(TYPE_RESEARCH_PERIODS, researchPeriods, selectedResearchPeriods)}
          <Divider />
          {renderFilterAccordion(TYPE_UMBRELLA_TOPICS, umbrellaTopics, selectedUmbrellaTopics)}
          <Divider />
          {renderApplyResetButtons()}
        </Box>
      )
    } else if (postsView === viewFacultyFlag) {
      return (
        <Box sx={{ width: drawerWidth, CUSTOM_BG_COLOR, mt: 7 }} role='presentation'>
          {renderCloseButton()}
          <SearchBar handleApply={handleApply} searchQuery={searchQuery} setSearchQuery={setSearchQuery} postsView={postsView} />
        </Box>
      )
    }
  }

  if (loadingInitial) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress data-testid='initial-loading' />
      </Box>
    )
  } else {
    return (
      <>
        {error && (
          <PersistentAlert msg={error} type='error' />
        )}
        <Drawer
          variant='persistent'
          anchor='left'
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: CUSTOM_BG_COLOR
            }
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      </>
    )
  }
}

export default Sidebar
