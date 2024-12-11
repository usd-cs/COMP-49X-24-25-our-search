import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MajorAccordion from './MajorAccordion'
import { errorLoadingPostingsMessage, noPostsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function MainAccordion ({ postings, setSelectedPost, isStudent }) {
  const renderMajors = (department) => {
    if (!isStudent || department.majors.length === 0) {
      return (
        <Typography style={{ padding: '16px' }}>
          {noPostsMessage}
        </Typography>
      )
    }

    return department.majors.map((major) => (
      <MajorAccordion
        key={major.id}
        major={major}
        numPosts={major.posts.length}
        setSelectedPost={setSelectedPost}
        isStudent={isStudent}
      />
    ))
  }

  const renderDepartments = () => {
    if (postings.length === 0) {
      return <Typography>{errorLoadingPostingsMessage}</Typography>
    }

    return postings.map((department) => (
      <Accordion
        key={`dept-${department.id}`}
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
          aria-controls={`panel${department.id}-content`}
          id={`panel${department.id}-header`}
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
              {department.name}
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
          {renderMajors(department)}
        </AccordionDetails>
      </Accordion>
    ))
  }

  return (
    <Box sx={{ p: 2, borderRadius: 2 }}>
      {renderDepartments()}
    </Box>
  )
}

MainAccordion.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MainAccordion
