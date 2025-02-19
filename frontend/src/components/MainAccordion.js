/**
 * @file Logic and renders for majors of given discipline in an accordion style where there are dropdowns
 * for each discipline and within each discipline there are dropdowns for each major.Uses Material UI.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MajorAccordion from './MajorAccordion'
import { errorLoadingPostingsMessage, noPostsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function MainAccordion ({ postings, setSelectedPost, isStudent, isFaculty, isAdmin }) {
  // renderMajors handles the logic for displaying majors of a given discipline
  const renderMajors = (discipline) => {
    if (discipline.majors.length === 0) {
      return (
        <Typography style={{ padding: '16px' }}>
          {noPostsMessage}
        </Typography>
      )
    }

    return discipline.majors.map((major) => (
      <MajorAccordion
        key={major.id}
        major={major}
        numPosts={major.posts.length}
        setSelectedPost={setSelectedPost}
        isStudent={isStudent}
        isFaculty={isFaculty}
        isAdmin={isAdmin}
      />
    ))
  }

  // Render disciplines logic:
  // If no postings it shows an error message
  // Otherwise, it creates an accordion for each discipline
  const renderdisciplines = () => {
    if (postings.length === 0) {
      return <Typography>{errorLoadingPostingsMessage}</Typography>
    }

    return postings.map((discipline) => (
      <Accordion
        key={`dept-${discipline.id}`}
        disableGutters
        sx={{
          mb: 2,
          boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px !important',
          overflow: 'hidden',
          '&:last-child': { mb: 0 },
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0,
            marginBottom: '16px !important',
            '&:last-child': {
              marginBottom: 0
            }
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${discipline.id}-content`}
          id={`panel${discipline.id}-header`}
          sx={{
            bgcolor: '#F0F0F0',
            borderRadius: '8px !important',
            minHeight: '48px',
            '& .MuiAccordionSummary-content': {
              margin: '12px 0'
            },
            '&.Mui-expanded': {
              borderRadius: '8px 8px 0 0 !important'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {discipline.name}
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            bgcolor: '#F8F8F8',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '0 0 8px 8px'
          }}
        >
          {renderMajors(discipline)}
        </AccordionDetails>
      </Accordion>
    ))
  }

  return (
    <Box sx={{ p: 2, borderRadius: 2 }}>
      {renderdisciplines()}
    </Box>
  )
}

MainAccordion.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MainAccordion
