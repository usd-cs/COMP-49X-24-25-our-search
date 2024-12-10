import React from 'react'
import { Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'
import { noPostsMessage } from '../resources/constants'
import PropTypes from 'prop-types'

function PostList ({ postings, setSelectedPost, isStudent }) {
  const activePosts = postings.filter((post) => post.isActive)

  if (!isStudent) {
    return (
      <TableContainer component={Paper}>
        <Typography style={{ padding: '16px' }}>{noPostsMessage}</Typography>
      </TableContainer>
    )
  }

  if (postings.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Typography style={{ padding: '16px' }}>{noPostsMessage}</Typography>
      </TableContainer>
    )
  }

  if (activePosts.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Typography style={{ padding: '16px' }}>{noPostsMessage}</Typography>
      </TableContainer>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {activePosts.map((post) => (
            <TableRow
              key={`post-${post.id}`}
              hover
              onClick={() => setSelectedPost(post)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{post.name}</TableCell>
              <TableCell>{post.researchPeriods}</TableCell>
              <TableCell>
                {post.faculty.firstName} {post.faculty.lastName}
              </TableCell>
              <TableCell>{post.faculty.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

PostList.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default PostList
