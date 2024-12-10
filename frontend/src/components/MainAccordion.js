import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MajorAccordion from './MajorAccordion'
import { errorLoadingPostingsMessage, noPostsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function MainAccordion ({ postings, setSelectedPost, isStudent }) {
  return (
    <Box sx={{ p: 2, borderRadius: 2 }}>
      {postings.length > 0
        ? (
            postings.map((department, index) => (
              <Accordion
                key={`dept=${department.id}`}
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
                  {isStudent && postings.length > 0
                    ? (
                        department.majors.map((major) => (
                          <MajorAccordion
                            key={major.id}
                            major={major}
                            numPosts={major.posts.length}
                            setSelectedPost={setSelectedPost}
                            isStudent={isStudent}
                          />
                        ))
                      )
                    : (
                      <Typography style={{ padding: '16px' }}>
                        {noPostsMessage}
                      </Typography>
                      )}
                </AccordionDetails>
              </Accordion>
            ))
          )
        : (
          <Typography>{errorLoadingPostingsMessage}</Typography>
          )}
    </Box>
  )
}

MainAccordion.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MainAccordion
