import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

const PostDialog = ({ onClose, post }) => {
  if (!post) return null
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
    <Dialog
      open={!!post}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          '& .MuiDialogTitle-root': {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          },
          '& .MuiDialogContent-root': {
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }
        }
      }}
    >
      {/* Close Button */}
      <Button
        onClick={onClose}
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

      {/* Title */}
      <DialogTitle sx={{
        pt: 3,
        pb: 2,
        px: 4,
        fontSize: '1.5rem',
        fontWeight: 600
      }}
      >
        {name}
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 4, pb: 4 }}>
        {/* Description */}
        <Typography
          variant='body1'
          gutterBottom
          sx={{ mb: 3 }}
        >
          <strong>Description:</strong> {description}
        </Typography>

        {/* Layout for Remaining Fields */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginTop: '16px'
        }}
        >
          {/* Column 1 */}
          <div>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Qualifications:</strong> {desired_qualifications}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Status:</strong> {' '}
              <span style={{
                color: is_active ? '#2e7d32' : '#d32f2f',
                fontWeight: 500
              }}
              >
                {is_active ? 'Active' : 'Inactive'}
              </span>
            </Typography>
          </div>

          {/* Column 2 */}
          <div>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Topics:</strong> {umbrella_topics.join(', ')}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Periods:</strong> {research_periods.join(', ')}
            </Typography>
          </div>

          {/* Column 3 */}
          <div>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Majors:</strong> {majors.join(', ')}
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              <strong>Faculty:</strong> {`${faculty.first_name} ${faculty.last_name}`}
              <br />
              <a
                href={`mailto:${faculty.email}`}
                style={{
                  color: '#1976d2',
                  textDecoration: 'none'
                }}
              >
                {faculty.email}
              </a>
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDialog
