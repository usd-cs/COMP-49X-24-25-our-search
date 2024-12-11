import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PostList from './PostList'
import PropTypes from 'prop-types'

function MajorAccordion ({ major, numPosts, setSelectedPost, isStudent }) {
  return (
    <Accordion disableGutters disabled={numPosts === 0}>
      <AccordionSummary
        expandIcon={numPosts > 0 ? <ExpandMoreIcon /> : null}
        aria-controls={`panel${major.id}-content`}
        id={`panel${major.id}-header`}
        sx={{ bgcolor: '#FAFAFA' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            data-testid='major-name'
            sx={{ fontWeight: 'bold' }}
          >
            {major.name}
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: 'gray', fontSize: '0.875rem', marginLeft: 1, fontWeight: 'normal' }}
          >
            ({numPosts} opportunities)
          </Typography>
        </Box>
      </AccordionSummary>
      {numPosts > 0 && (
        <AccordionDetails>
          <PostList
            postings={major.posts}
            setSelectedPost={setSelectedPost}
            isStudent={isStudent}
          />
        </AccordionDetails>
      )}
    </Accordion>
  )
}

MajorAccordion.propTypes = {
  major: PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired
  }).isRequired,
  numPosts: PropTypes.number.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MajorAccordion
