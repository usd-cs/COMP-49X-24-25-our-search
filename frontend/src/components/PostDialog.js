import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

const PostDialog = ({ onClose, post }) => {
  if (!post) return null

  const {
    name,
    description,
    desiredQualifications,
    umbrellaTopics = [],
    researchPeriods = [],
    isActive,
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
              <strong>Qualifications:</strong> {desiredQualifications}
            </Typography>
            <Typography variant='body2'>
              <strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </div>

          {/* Column 2 */}
          <div>
            <Typography variant='body2'>
              <strong>Topics:</strong> {umbrellaTopics.join(', ')}
            </Typography>
            <Typography variant='body2'>
              <strong>Periods:</strong> {researchPeriods.join(', ')}
            </Typography>
          </div>

          {/* Column 3 */}
          <div>
            <Typography variant='body2'>
              <strong>Majors:</strong> {majors.join(', ')}
            </Typography>
            <Typography variant='body2'>
              <strong>Faculty:</strong> {`${faculty.firstName} ${faculty.lastName} (${faculty.email})`}
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
    desiredQualifications: PropTypes.string,
    umbrellaTopics: PropTypes.arrayOf(PropTypes.string),
    researchPeriods: PropTypes.arrayOf(PropTypes.string),
    isActive: PropTypes.bool.isRequired,
    majors: PropTypes.arrayOf(PropTypes.string),
    faculty: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string
    })

  })
}

export default PostDialog
