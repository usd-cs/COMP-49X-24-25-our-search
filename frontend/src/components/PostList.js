/**
 * @file Renders postings with the umbrella topics and oppportunites if there are any
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
  Chip
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import SchoolIcon from '@mui/icons-material/School'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { noPostsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function PostList ({ postings, setSelectedPost, isStudent, isFaculty, isAdmin }) {
  // Filter out inactive postings.
  const activePostings = postings.filter((post) => post.isActive)

  if (postings.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ p: 2 }}>{noPostsMessage}</Typography>
      </Box>
    )
  }

  if (activePostings.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ p: 2 }}>{noPostsMessage}</Typography>
      </Box>
    )
  }

  // if isStudent: render research name, faculty name, umbrella topics
  // if isFaculty: render first name, last name, classStatus, graduationYear, majors, email
  if (isStudent) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {activePostings.map((post) => (
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
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'action.active'
                  }}
                >
                  <EmailIcon />
                </IconButton>

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
                      <LocalOfferIcon color='action' fontSize='small' />
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
  } else if (isFaculty) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {activePostings.map((post) => (
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
                  Class Status: {post.classStatus}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Graduation Year: {post.graduationYear}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Email: {post.email}
                </Typography>
                <Typography variant='body2'>
                  Majors: {Array.isArray(post.majors) ? post.majors.join(', ') : post.majors}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    )
  } else {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ p: 2 }}>{noPostsMessage}</Typography>
      </Box>
    )
  }
}

PostList.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool
}

export default PostList
