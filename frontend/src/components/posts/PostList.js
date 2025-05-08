/**
 * @file Renders postings with the umbrella topics and oppportunites if there are any.
 * If rendering projects, display: project name, faculty name, research period(s), research field(s), umbrella topic(s)
 * If rendering students, display: first name, last name, class status, graduation year, email, major(s)
 * If rendering faculty, display: first name, last name, email, department(s).
 *
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Rayan Pal <rpal@sandiego.edu>
 */
import React from 'react'
import {
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import SchoolIcon from '@mui/icons-material/School'
import DomainIcon from '@mui/icons-material/Domain'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { NO_MAJORS_MSG, viewProjectsFlag, viewStudentsFlag, viewFacultyFlag } from '../../resources/constants'
import PropTypes from 'prop-types'

function PostList ({ postings, setSelectedPost, isStudent, isFaculty, isAdmin, postsView, isOnFacultyProfile }) {
  // Handle email click using sandiego.edu Gmail interface
  const handleEmailClick = (e, emailAddress, subject, body = '') => {
    e.stopPropagation() // Prevent card click
    
    // Format the Gmail URL for sandiego.edu accounts
    const gmailUrl = new URL('https://mail.google.com/a/sandiego.edu/mail');
    gmailUrl.searchParams.append('view', 'cm');
    gmailUrl.searchParams.append('fs', '1');
    gmailUrl.searchParams.append('to', emailAddress);
    gmailUrl.searchParams.append('su', subject);
    
    if (body) {
      gmailUrl.searchParams.append('body', body);
    }
    
    // Open in a new tab
    window.open(gmailUrl.toString(), '_blank');
  }

  // Filter out inactive postings.
  let postsToDisplay
  if (isStudent || (isFaculty && !isOnFacultyProfile)) {
    postsToDisplay = postings.filter((post) => post.isActive)
  } else {
    postsToDisplay = postings // admin should be able to see all active/inactive postings; faculty should be able to see all of their own active/inactive projects
  }

  if (postsToDisplay.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ p: 2 }}>{NO_MAJORS_MSG}</Typography>
      </Box>
    )
  }

  // rendering projects
  if (isStudent || ((isFaculty || isAdmin) && postsView === viewProjectsFlag)) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {postsToDisplay.map((post) => (
            <Card
              key={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                },
                position: 'relative'
              }}
            >
              <CardContent>
                {!isOnFacultyProfile && !isAdmin && (
                  <Tooltip title="Contact faculty via USD email">
                    <IconButton
                      sx={{ position: 'absolute', right: 8, top: 8, color: 'action.active' }}
                      onClick={(e) => handleEmailClick(
                        e, 
                        post.faculty.email,
                        `Inquiry about research opportunity: ${post.name}`,
                        `Hello Professor ${post.faculty.lastName},\n\nI am interested in learning more about your research opportunity "${post.name}".\n\n`
                      )}
                      data-testid='email-icon'
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {!post.isActive && (isAdmin || isOnFacultyProfile) && (
                  <Chip
                    label='Inactive'
                    sx={{
                      color: 'red',
                      position: 'absolute',
                      top: 8,
                      right: 20
                    }}
                    data-testid='inactive-chip'
                  />
                )}
                {post.isActive && (isAdmin || isOnFacultyProfile) && (
                  <Chip
                    label='Active'
                    sx={{
                      color: 'green',
                      position: 'absolute',
                      top: 8,
                      right: 20
                    }}
                    data-testid='active-chip'
                  />
                )}

                <Typography variant='h7' fontWeight='bold' component='div' sx={{ mb: 1, pr: 5 }}>
                  {post.name}
                </Typography>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    mb: 2
                  }}
                  variant='body2'
                >
                  {post.faculty.firstName} {post.faculty.lastName}
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  {post.researchPeriods.join(', ')}
                </Typography>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color='action' fontSize='small' />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {post.majors?.map((major, index) => (
                        <Chip
                          key={index}
                          label={major}
                          size='small'
                          sx={{
                            bgcolor: 'grey.100',
                            height: '24px'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {post.umbrellaTopics?.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LightbulbIcon color='action' fontSize='small' />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {post.umbrellaTopics.slice(0, 3).map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            size='small'
                            sx={{
                              bgcolor: 'grey.100',
                              height: '24px'
                            }}
                          />
                        ))}
                        {post.umbrellaTopics.length > 3 && (
                          <Typography
                            variant='body2'
                            color='primary'
                            sx={{ alignSelf: 'center' }}
                          >
                            +{post.umbrellaTopics.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    )

  // rendering students
  } else if ((isFaculty || isAdmin) && postsView === viewStudentsFlag) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {postsToDisplay.map((post) => (
            <Card
              key={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                },
                position: 'relative'
              }}
            >
              <CardContent>
                {!isOnFacultyProfile && !isAdmin && (
                  <Tooltip title="Contact student via USD email">
                    <IconButton
                      sx={{ position: 'absolute', right: 8, top: 8, color: 'action.active' }}
                      onClick={(e) => handleEmailClick(
                        e, 
                        post.email, 
                        `Regarding your interest in research`,
                        `Hello ${post.firstName},\n\nI'm writing regarding your interest in research opportunities.\n\n`
                      )}
                      data-testid='email-icon'
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {!post.isActive && isAdmin && (
                  <Chip
                    label='Inactive'
                    sx={{
                      color: 'red',
                      position: 'absolute',
                      top: 8,
                      right: 20
                    }}
                  />
                )}
                {post.isActive && isAdmin && (
                  <Chip
                    label='Active'
                    sx={{
                      color: 'green',
                      position: 'absolute',
                      top: 8,
                      right: 20
                    }}
                  />
                )}

                <Typography variant='h7' fontWeight='bold' component='div' sx={{ mb: 1, pr: 5 }}>
                  {post.firstName} {post.lastName}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {post.classStatus}
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  Class of {post.graduationYear}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {post.email}
                </Typography>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color='action' fontSize='small' />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {post.majors?.map((major, index) => (
                        <Chip
                          key={index}
                          label={major}
                          size='small'
                          sx={{
                            bgcolor: 'grey.100',
                            height: '24px'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    )

  // rendering faculty
  } else if (isAdmin && postsView === viewFacultyFlag) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {postsToDisplay.map((post) => (
            <Card
              key={`post-${post.id}`}
              onClick={() => setSelectedPost(post)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                },
                position: 'relative'
              }}
            >
              <CardContent>
                <Typography variant='h7' fontWeight='bold' component='div' sx={{ mb: 1, pr: 5 }}>
                  {post.firstName} {post.lastName}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  {post.email}
                </Typography>

                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant='body2'>Projects: </Typography>
                  <Chip
                    label={`${post.projects.filter(project => project.isActive).length} Active`}
                    size='small'
                    sx={{
                      color: 'green'
                    }}
                  />
                  <Chip
                    label={`${post.projects.filter(project => !project.isActive).length} Inactive`}
                    size='small'
                    sx={{
                      color: 'red'
                    }}
                  />
                </Box>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DomainIcon color='action' fontSize='small' />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {post.department?.map((department, index) => (
                        <Chip
                          key={index}
                          label={department}
                          size='small'
                          sx={{
                            bgcolor: 'grey.100',
                            height: '24px'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    )

  // fallback for error
  } else {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ p: 2 }}>{NO_MAJORS_MSG}</Typography>
      </Box>
    )
  }
}

PostList.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool,
  postsView: PropTypes.string,
  isOnFacultyProfile: PropTypes.bool
}

export default PostList