/**
 * @file Render faculty and student information depending on the user, pop up when clicked called "Dialog".
 * If rendering projects, display all project info.
 * If rendering students, display all student info.
 * If rendering faculty, display all faculty info.
 * Can render projects for students, faculty, and admin roles.
 * Can render students for faculty and admin roles.
 * Can render faculty for admin role only.
 *
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Sharthok Rayan <rpal@sandiego.edu>
 */
import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Typography, Chip, Box } from '@mui/material'
import { viewStudentsFlag, viewProjectsFlag, viewFacultyFlag, BACKEND_URL } from '../../resources/constants'
import { Link, useNavigate } from 'react-router-dom'
import AreYouSureDialog from '../popups/AreYouSureDialog'
import ProjectEdit from '../projects/ProjectEdit'
import ClickForInfo from '../popups/ClickForInfo'

// Defining the CSS for the Dialog once because it is shared by every view
const DialogTheme = ({ open, onClose, title, children }) => (
  <Dialog
    open={open}
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
    <DialogTitle
      sx={{
        pt: 3,
        pb: 2,
        px: 4,
        fontSize: '1.5rem',
        fontWeight: 600
      }}
    >
      {title}
    </DialogTitle>
    <DialogContent sx={{ px: 4, pb: 4 }}>{children}</DialogContent>
  </Dialog>
)

const PostDialog = ({ onClose, post, isStudent, isFaculty, isAdmin, postsView = viewProjectsFlag, isOnFacultyProfile, showMyOwnProject, setShowMyOwnProject }) => {
  const navigate = useNavigate()
  const [error, setError] = useState(null) // set to a string value to display error messages
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false) // true if the "are you sure?" dialogue is visible
  const [myProjectId, setMyProjectId] = useState(null) // int id of the faculty member's project they are viewing

  if (!post) return null

  function getDeleteUrl (postsView) {
    let url = ''
    if (postsView === viewFacultyFlag) {
      url = `${BACKEND_URL}/faculty`
    } else if (postsView === viewStudentsFlag) {
      url = `${BACKEND_URL}/student`
    } else if (postsView === viewProjectsFlag) {
      url = `${BACKEND_URL}/project`
    }
    return url
  }

  const handleDelete = async (id) => {
    const url = getDeleteUrl(postsView)

    if (url === '') {
      setError('An unexpected error occurred deleting post. Please try again.')
    } else {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })
        if (!response.ok) {
          throw new Error(response.status)
        }
        if (isOnFacultyProfile) {
          window.location.href = '/view-professor-profile'
        } else {
          window.location.href = '/posts'
        }
      } catch (err) {
        if (err.message === '400') {
          setError('Bad request')
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
      }
    }
  }

  const handleCancel = () => {
    setOpenDeleteDialog(false)
    if (error !== null) {
      setError(null)
    }
  }

  const handleEditMyOwnProjectClick = (id) => {
    setShowMyOwnProject(true)
    setMyProjectId(id)
  }

  if (showMyOwnProject) {
    return (
      <>
        <DialogTheme open={!!post} onClose={onClose} title={post.name}>
          <ProjectEdit isFaculty myFacultyProjectId={myProjectId} />
        </DialogTheme>
      </>
    )
  } else if (isStudent || ((isFaculty || isAdmin) && postsView === viewProjectsFlag)) { // rendering projects
    const { id, name, description, desiredQualifications, umbrellaTopics = [], researchPeriods = [], isActive, majors = [], faculty = {} } = post
    return (
      <>
        <DialogTheme open={!!post} onClose={onClose} title={name}>

          <Typography
            variant='body1'
            gutterBottom
            sx={{ mb: 3 }}
          >
            <strong>Description:</strong> {description}
          </Typography>

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
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      When active, this project's information is visible to students and faculty.
                    </Typography>
                  }
                />
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
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      These are broad, cross-disciplinary themes that help categorize research projects beyond
                      official major names. They are concepts that can span across many fields.
                      They reflect broader areas of interest that may not be captured by a specific major.
                    </Typography>
                  }
                />
                <strong>Umbrella Topics:</strong> {umbrellaTopics.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Research Periods:</strong> {researchPeriods.join(', ')}
              </Typography>
            </div>

            {/* Column 3 */}
            <div>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      The research fields most relevant to this project.
                    </Typography>
                  }
                />
                <strong>Majors:</strong> {majors.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <strong>Faculty:</strong> {`${faculty.firstName} ${faculty.lastName}`}
                <br />
                <Link
                  // to={`/email-faculty/${faculty.email}`}
                        // https://stackoverflow.com/questions/6548570/url-to-compose-a-message-in-gmail-with-full-gmail-interface-and-specified-to-b
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none'
                  }}
                  data-testid='email-link'
                >
                  {faculty.email}
                </Link>
              </Typography>
            </div>
          </div>
          {/* Actions Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Align buttons in the center
              gap: 2, // Space between buttons
              mt: 3 // Add margin to create space above the buttons
            }}
          >

            {(isAdmin || (isFaculty && isOnFacultyProfile)) && (
              <>
                {isAdmin && ( // admin are able to edit any project, so they can go to /project/id
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => { navigate(`/project/${id}`) }}
                  >
                    Edit Project
                  </Button>
                )}

                {isOnFacultyProfile && ( // faculty are only able to edit their own projects. They cannot go to /project/id to prevent seeing any project id.
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => handleEditMyOwnProjectClick(id)}
                  >
                    Edit Project
                  </Button>
                )}

                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete Project
                </Button>
              </>
            )}

          </Box>
        </DialogTheme>

        <AreYouSureDialog
          open={openDeleteDialog}
          onClose={handleCancel}
          onConfirm={() => handleDelete(id)}
          error={error}
          action='delete'
        />
      </>
    )
  // rendering students
  } else if ((isFaculty || isAdmin) && postsView === viewStudentsFlag) {
    const { id, firstName, lastName, isActive, email, classStatus, graduationYear, majors = [], researchFieldInterests = [], researchPeriodsInterest = [], interestReason, hasPriorExperience } = post
    return (
      <>
        <DialogTheme open={!!post} onClose={onClose} title={firstName + ' ' + lastName}>
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
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      When active, this student's profile is visible because they are actively seeking research opportunities.
                    </Typography>
                }
                />
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
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      The declared major(s) of the student.
                    </Typography>
                  }
                />
                <strong>Majors:</strong> {majors.join(', ')}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                <ClickForInfo
                  content={
                    <Typography sx={{ fontSize: '1rem' }}>
                      The areas that the student is interested in conducting research in.
                      Include their major if they want to do research related to their major.
                      These do not have to match their major.
                      Students may be interested in doing research in areas other than what they are majoring in.
                    </Typography>
                  }
                />
                <strong>Research Field Interests:</strong> {researchFieldInterests.join(', ')}
              </Typography>
            </div>
          </div>

          {/* Actions Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Align buttons in the center
              gap: 2, // Space between buttons
              mt: 3 // Add margin to create space above the buttons
            }}
          >

            {isAdmin && (
              <>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => { navigate(`/student/${id}`) }}
                >
                  Edit Profile
                </Button>

                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete Profile
                </Button>
              </>
            )}
          </Box>
        </DialogTheme>

        <AreYouSureDialog
          open={openDeleteDialog}
          onClose={handleCancel}
          onConfirm={() => handleDelete(id)}
          error={error}
          action='delete'
        />
      </>
    )
  // rendering faculty
  } else if (isAdmin && postsView === viewFacultyFlag) {
    const { id, firstName, lastName, email, department, projects } = post
    return (
      <>
        <DialogTheme open={!!post} onClose={onClose} title={firstName + ' ' + lastName}>
          <Typography
            variant='body1'
            gutterBottom
            sx={{ mb: 3 }}
          >
            <strong>Email:</strong>{' '}
            <Link
              // to={`/email-faculty/${email}`}
              // https://stackoverflow.com/questions/6548570/url-to-compose-a-message-in-gmail-with-full-gmail-interface-and-specified-to-b
              style={{
                color: '#1976d2',
                textDecoration: 'none'
              }}
              data-testid='email-link'
            >
              {email}
            </Link>
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
                <strong>Department(s):</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {department.map((dept) => (
                  <Chip
                    key={dept}
                    label={dept}
                    sx={{
                      bgcolor: 'grey.200'
                    }}
                  />
                ))}
              </Box>
            </div>

            <div>
              {/* Link to edit each project */}
              <Typography variant='body2' sx={{ mb: 1, mt: 3 }}>
                <strong>Active Projects:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {projects.filter((proj) => proj.isActive).length > 0
                  ? (
                      projects.filter((proj) => proj.isActive).map((proj) => (
                        <Typography
                          key={proj.id}
                          variant='body2'
                          component='a'
                          href={`/project/${proj.id}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {proj.name}
                        </Typography>
                      ))
                    )
                  : (
                    <Typography variant='body2' sx={{ color: 'grey' }}>
                      None
                    </Typography>
                    )}
              </Box>
            </div>

            {/* Column 2 */}
            <div>
              <Typography variant='body2' sx={{ mb: 1, mt: 3 }}>
                <strong>Inactive Projects:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {projects.filter((proj) => !proj.isActive).length > 0
                  ? (
                      projects.filter((proj) => !proj.isActive).map((proj) => (
                        <Typography
                          key={proj.id}
                          variant='body2'
                          component='a'
                          href={`/project/${proj.id}`}
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {proj.name}
                        </Typography>
                      ))
                    )
                  : (
                    <Typography variant='body2' sx={{ color: 'grey' }}>
                      None
                    </Typography>
                    )}
              </Box>
            </div>
          </div>

          {/* Actions Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Align buttons in the center
              gap: 2, // Space between buttons
              mt: 3 // Add margin to create space above the buttons
            }}
          >

            {isAdmin && (
              <>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => { navigate(`/faculty/${id}`) }}
                >
                  Edit Profile
                </Button>

                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete Profile
                </Button>
              </>
            )}
          </Box>
        </DialogTheme>

        <AreYouSureDialog
          open={openDeleteDialog}
          onClose={handleCancel}
          onConfirm={() => handleDelete(id)}
          error={error}
          action='delete'
        />
      </>
    )
  }
}

export default PostDialog
