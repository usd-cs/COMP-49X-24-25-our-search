/**
 * @file Logic and rendering for an accordion style view. Uses Material UI.
 * Any time students or projects are meant to be viewed, the posts are
 * grouped by discipline, and within each discipline, by major. Yielding
 * dropdowns of majors within dropdowns of disciplines.
 * Any time faculty are meant to be viewed, the posts are grouped by
 * department. Yielding one set of dropdowns for departments.
 *
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MajorAccordion from './MajorAccordion'
import PostList from './PostList'
import { ERROR_LOADING_POSTS_MSG, NO_FACULTY_MSG, NO_MAJORS_MSG, viewFacultyFlag } from '../../resources/constants'
import PropTypes from 'prop-types'

function MainAccordion ({ postings, setSelectedPost, isStudent, isFaculty, isAdmin, postsView }) {
  // renderMajors handles the logic for displaying majors of a given discipline
  // called for each discipline
  const renderMajors = (discipline) => {
    if (discipline.majors.length === 0) {
      return (
        <Typography style={{ padding: '16px' }} bgcolor='#F0F0F0'>
          {NO_MAJORS_MSG}
        </Typography>
      )
    }

    // numPosts definition: only want to show number of ACTIVE postings to students & faculty; admin can see all
    return discipline.majors.map((major) => (
      <MajorAccordion
        key={major.id}
        major={major}
        numPosts={(isStudent || isFaculty) ? major.posts.filter((post) => post.isActive).length : major.posts.length}
        setSelectedPost={setSelectedPost}
        isStudent={isStudent}
        isFaculty={isFaculty}
        isAdmin={isAdmin}
        postsView={postsView}
      />
    ))
  }

  // Render disciplines logic:
  // If no postings it shows an error message
  // Otherwise, it creates an accordion for each discipline
  const renderDisciplines = () => {
    if (postings.length === 0) {
      return <Typography>{ERROR_LOADING_POSTS_MSG}</Typography>
    }

    return postings.map((discipline) => (
      <Accordion
        key={`disc-${discipline.id}`}
        disableGutters
        sx={{
          mb: 2,
          boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px !important',
          overflow: 'hidden',
          '&:last-child': { mb: 0 },
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0,
            marginBottom: '16px !important',
            '&:last-child': {
              marginBottom: 0
            }
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${discipline.id}-content`}
          id={`panel${discipline.id}-header`}
          sx={{
            bgcolor: '#F0F0F0',
            borderRadius: '8px !important',
            minHeight: '48px',
            '& .MuiAccordionSummary-content': {
              margin: '12px 0'
            },
            '&.Mui-expanded': {
              borderRadius: '8px 8px 0 0 !important'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', mr: 1 }}>
              {discipline.name}
            </Typography>
            <Typography sx={{ color: 'gray' }}>
              ({discipline.majors.reduce((sum, major) => sum + major.posts.length, 0)})
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            bgcolor: '#F8F8F8',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '0 0 8px 8px'
          }}
        >
          {renderMajors(discipline)}
        </AccordionDetails>
      </Accordion>
    ))
  }

  const renderDepartments = () => {
    if (postings.length === 0) {
      return <Typography>{ERROR_LOADING_POSTS_MSG}</Typography>
    }

    return postings.map((department) => (
      <Accordion
        key={`dept-${department.id}`}
        disableGutters
        sx={{
          mb: 2,
          boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px !important',
          overflow: 'hidden',
          '&:last-child': { mb: 0 },
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0,
            marginBottom: '16px !important',
            '&:last-child': {
              marginBottom: 0
            }
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${department.id}-content`}
          id={`panel${department.id}-header`}
          sx={{
            bgcolor: '#F0F0F0',
            borderRadius: '8px !important',
            minHeight: '48px',
            '& .MuiAccordionSummary-content': {
              margin: '12px 0'
            },
            '&.Mui-expanded': {
              borderRadius: '8px 8px 0 0 !important'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', mr:1 }}>
              {department.name}
            </Typography>
            <Typography sx={{ color: 'gray' }}>
              ({department.faculty.length})
            </Typography>
          </Box>
        </AccordionSummary>

        {department.faculty.length > 0 && (
          <AccordionDetails>
            <PostList
              postings={department.faculty}
              setSelectedPost={setSelectedPost}
              isStudent={isStudent}
              isFaculty={isFaculty}
              isAdmin={isAdmin}
              postsView={postsView}
            />
          </AccordionDetails>
        )}

        {department.faculty.length === 0 && (
          <Typography style={{ padding: '16px' }} bgcolor='#F0F0F0'>
            {NO_FACULTY_MSG}
          </Typography>
        )}
      </Accordion>
    ))
  }

  // Admin's view of faculty will render accordions differently than students or projects
  // because faculty are grouped by department only.
  if (isAdmin && postsView === viewFacultyFlag) {
    return (
      <Box sx={{ p: 2, borderRadius: 2 }}>
        {renderDepartments()}
      </Box>
    )
  } else {
    return (
      <Box sx={{ p: 2, borderRadius: 2 }}>
        {renderDisciplines()}
      </Box>
    )
  }
}

MainAccordion.propTypes = {
  postings: PropTypes.array.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  isStudent: PropTypes.bool.isRequired
}

export default MainAccordion
