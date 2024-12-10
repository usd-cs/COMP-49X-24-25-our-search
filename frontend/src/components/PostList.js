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

function PostList ({ postings, setSelectedPost, isStudent }) {
  const activePostings = postings.filter((post) => post.is_active)

  return (
    <Box sx={{ p: 2 }}>
      {isStudent && postings.length > 0
        ? (
            activePostings.length > 0
              ? (
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
                          {post.faculty.first_name} {post.faculty.last_name}
                    &nbsp;&nbsp;•&nbsp;&nbsp;
                          {post.research_periods}
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

                          {post.umbrella_topics?.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocalOfferIcon color='action' fontSize='small' />
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {post.umbrella_topics.slice(0, 3).map((topic, index) => (
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
                                {post.umbrella_topics.length > 3 && (
                                  <Typography
                                    variant='body2'
                                    color='primary'
                                    sx={{ alignSelf: 'center' }}
                                  >
                                    +{post.umbrella_topics.length - 3} more
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
                )
              : (
                <Typography sx={{ p: 2 }}>{noPostsMessage}</Typography>
                )
          )
        : (
          <Typography sx={{ p: 2 }}>{noPostsMessage}</Typography>
          )}
    </Box>
  )
}

PostList.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default PostList
