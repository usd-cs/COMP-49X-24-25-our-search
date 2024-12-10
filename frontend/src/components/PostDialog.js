import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

/* eslint-disable camelcase */
const PostDialog = ({ onClose, post }) => {
  if (!post) return null

  const {
    name,
    description,
    desired_qualifications,
    umbrella_topics = [],
    research_periods = [],
    is_active,
    majors = [],
    faculty = []
  } = post

  // TODO in later sprint: if isStudent render x, but if isFaculty render y

  return (
    <Dialog open={!!post} onClose={onClose} maxWidth='md' fullWidth>
      {/* Close Button */}
      <Button onClick={onClose} sx={{ position: 'absolute', top: 6, right: 6 }}>
        X
      </Button>

      {/* Title */}
      <DialogTitle>{name}</DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Description */}
        <Typography variant='body1' gutterBottom>
          <strong>Description:</strong> {description}
        </Typography>

        {/* Layout for Remaining Fields */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
          {/* Column 1 */}
          <div>
            <Typography variant='body2'>
              <strong>Qualifications:</strong> {desired_qualifications}
            </Typography>
            <Typography variant='body2'>
              <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
            </Typography>
          </div>

          {/* Column 2 */}
          <div>
            <Typography variant='body2'>
              <strong>Topics:</strong> {umbrella_topics.join(', ')}
            </Typography>
            <Typography variant='body2'>
              <strong>Periods:</strong> {research_periods.join(', ')}
            </Typography>
          </div>

          {/* Column 3 */}
          <div>
            <Typography variant='body2'>
              <strong>Majors:</strong> {majors.join(', ')}
            </Typography>
            <Typography variant='body2'>
              <strong>Faculty:</strong> {`${faculty.first_name} ${faculty.last_name} (${faculty.email})`}
            </Typography>
            {/* {TODO: this only displays the first faculty member listed, but what if there are multiple?} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

PostDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    desired_qualifications: PropTypes.string,
    umbrella_topics: PropTypes.arrayOf(PropTypes.string),
    research_periods: PropTypes.arrayOf(PropTypes.string),
    is_active: PropTypes.bool.isRequired,
    majors: PropTypes.arrayOf(PropTypes.string),
    faculty: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string
    })

  })
}
/* eslint-disable camelcase */

export default PostDialog
