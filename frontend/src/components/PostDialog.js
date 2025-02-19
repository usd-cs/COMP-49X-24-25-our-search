/**
 * @file Render faculty and student information depending on the user, pop up when clicked called "Dialog".
 * 
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

const PostDialog = ({ onClose, post, isStudent, isFaculty, isAdmin }) => {
  if (!post) return null

  if (isStudent) {
    const { name, description, desiredQualifications, umbrellaTopics = [], researchPeriods = [], isActive, majors = [], faculty = {} } = post
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
                <strong>Qualifications:</strong> {desiredQualifications}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Status:</strong> {' '}
                <span style={{
                  color: isActive ? '#2e7d32' : '#d32f2f',
                  fontWeight: 500
                }}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </Typography>
            </div>
  
            {/* Column 2 */}
            <div>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Topics:</strong> {umbrellaTopics.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Periods:</strong> {researchPeriods.join(', ')}
              </Typography>
            </div>
  
            {/* Column 3 */}
            <div>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Majors:</strong> {majors.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Faculty:</strong> {`${faculty.firstName} ${faculty.lastName}`}
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
  } else if (isFaculty) {
    const { firstName, lastName, isActive, email, classStatus, graduationYear, majors = [], researchFieldInterests = [], researchPeriodsInterest = [], interestReason, hasPriorExperience } = post
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
          {firstName} {lastName}
        </DialogTitle>
  
        {/* Content */}
        <DialogContent sx={{ px: 4, pb: 4 }}>
          {/* Description */}
          <Typography
            variant='body1'
            gutterBottom
            sx={{ mb: 3 }}
          >
            <strong>Email:</strong> {email}
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
                <strong>Class Status:</strong> {classStatus}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Graduation Year:</strong> {graduationYear}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Status:</strong> {' '}
                <span style={{
                  color: isActive ? '#2e7d32' : '#d32f2f',
                  fontWeight: 500
                }}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Has Prior Experience:</strong> {' '}
                <span>
                  {hasPriorExperience ? 'Yes' : 'No'}
                </span>
              </Typography>
            </div>
  
            {/* Column 2 */}
            <div>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Research Period Interests:</strong> {researchPeriodsInterest.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Interest Reason:</strong> {interestReason}
              </Typography>
            </div>
  
            {/* Column 3 */}
            <div>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Majors:</strong> {majors.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Research Field Interests:</strong> {researchFieldInterests.join(', ')}
              </Typography>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  } else if (isAdmin) {
    // const { } = post
  }


}

export default PostDialog
