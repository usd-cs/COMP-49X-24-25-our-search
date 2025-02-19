/**
 * @file Render faculty and student information depending on the user, pop up when clicked called "Dialog".
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Typography } from '@mui/material'

const PostDialog = ({ onClose, post, userType }) => {
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

  const isStudent = userType === 'student'
  const isFaculty = userType === 'faculty'

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
          {isStudent && (
              // If current user is a student, show Faculty info
              <>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  <strong>Faculty:</strong>{' '}
                  {faculty.firstName && faculty.lastName
                    ? `${faculty.firstName} ${faculty.lastName}`
                    : 'N/A'}
                </Typography>
                {faculty.email && (
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    <a
                      href={`mailto:${faculty.email}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {faculty.email}
                    </a>
                  </Typography>
                )}
              </>
            )}
            {isFaculty && (
              // If current user is a faculty, show Student information
              <>
                {majors && majors.length > 0 ? (
                  majors.map((major, idx) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <Typography variant='body2' sx={{ mb: 1 }}>
                        <strong>{major.name} Students:</strong>
                      </Typography>
                      {major.students && major.students.length > 0 ? (
                        major.students.map((student) => (
                          <div
                            key={student.id}
                            style={{
                              marginLeft: '16px',
                              marginBottom: '8px',
                              borderBottom: '1px solid #eee',
                              paddingBottom: '8px'
                            }}
                          >
                            <Typography variant='body2'>
                              {student.firstName} {student.lastName}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Email:</strong>{' '}
                              <a
                                href={`mailto:${student.email}`}
                                style={{
                                  color: '#1976d2',
                                  textDecoration: 'none'
                                }}
                              >
                                {student.email}
                              </a>
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Class Status:</strong> {student.classStatus}
                            </Typography>
                            <Typography variant='body2'>
                              <strong>Graduation Year:</strong> {student.graduationYear}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography variant='body2' sx={{ ml: 2 }}>
                          No students found.
                        </Typography>
                      )}
                    </div>
                  ))
                ) : (
                  <Typography variant='body2'>No major information available.</Typography>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDialog
