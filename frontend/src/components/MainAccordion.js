import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MajorAccordion from './MajorAccordion'
import { errorLoadingPostingsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function MainAccordion ({ postings, setSelectedPost, isStudent }) {
  if (postings.length === 0) {
    return <Typography>{errorLoadingPostingsMessage}</Typography>
  }

  return (
    <Box>
      {postings.map((department) => (
        <Accordion key={`dept=${department.id}`}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${department.id}-content`}
            id={`panel${department.id}-header`}
          >
            <Typography>{department.name}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {department.majors.map((major) => (
              <MajorAccordion
                key={major.id}
                major={major}
                setSelectedPost={setSelectedPost}
                isStudent={isStudent}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

MainAccordion.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MainAccordion
