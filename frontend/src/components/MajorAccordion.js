/**
 * @file Manages the remove expanding icon if there are no posts.
 * Child component of MainAccordion to render each major dropdown.
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PostList from './PostList'
import PropTypes from 'prop-types'

function MajorAccordion ({ major, numPosts, setSelectedPost, isStudent, isFaculty, isAdmin }) {
  return (
    // Disable and remove the expand icon if there are no posts
    <Accordion disableGutters disabled={numPosts === 0}>
      <AccordionSummary
        expandIcon={numPosts > 0 ? <ExpandMoreIcon /> : null}
        aria-controls={`panel${major.id}-content`}
        id={`panel${major.id}-header`}
        sx={{ bgcolor: '#FAFAFA' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography data-testid='major-name' sx={{ fontWeight: 'bold' }}>
            {major.name}
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: 'gray', fontSize: '0.875rem', marginLeft: 1, fontWeight: 'normal' }}
          >
            ({numPosts} {isStudent ? (numPosts === 1 ? 'opportunity' : 'opportunities') : (numPosts === 1 ? 'student' : 'students')})
          </Typography>
        </Box>
      </AccordionSummary>
      {numPosts > 0 && (
        <AccordionDetails>
          <PostList postings={major.posts} setSelectedPost={setSelectedPost} isStudent={isStudent} isFaculty={isFaculty} isAdmin={isAdmin} />
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
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired

}

export default MajorAccordion
