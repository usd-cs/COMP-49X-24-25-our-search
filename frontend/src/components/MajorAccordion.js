import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PostList from './PostList'
import PropTypes from 'prop-types'

function MajorAccordion ({ major, setSelectedPost, isStudent }) {
  return (
    <Accordion>

      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${major.id}-content`}
        id={`panel${major.id}-header`}
      >
        <Typography>{major.name}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <PostList
          postings={major.posts}
          setSelectedPost={setSelectedPost}
          isStudent={isStudent}
        />
      </AccordionDetails>

    </Accordion>
  )
}

MajorAccordion.propTypes = {
  major: PropTypes.shape({
    name: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired
  }),
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MajorAccordion
