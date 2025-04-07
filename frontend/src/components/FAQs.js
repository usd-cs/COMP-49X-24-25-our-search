/**
 * @file FAQs.js
 * @description Provides the implementation for rendering, managing, and controlling FAQs for different user types (students, faculty, and admin).
 *              The main features include:
 *              - Shared `renderFAQs` function to dynamically render FAQs, reducing code repetition.
 *              - Admin privileges to edit, add, and delete FAQs with confirmation dialogues.
 *              - Dynamic actions (`on<Action>()` functions) for precise control based on the type of FAQ being updated.
 *              - React state management for storing FAQs, managing edit and delete dialogs, and handling errors.
 *
 * @imports getDataFrom(url) to prepopulate data.
 * @imports url definitions from 'constants.js'
 * @imports AreYouSureDialogue to ask the admin to confirm before deleting.
 * @imports handleAdd..., handleSave..., handleDelete... to execute communication with backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'

import {
  Typography, CircularProgress, Box, Button,
  TextField, IconButton, List, ListItem,
  Accordion, AccordionDetails, AccordionSummary
} from '@mui/material'
import { Edit, Delete, Save, Cancel } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import AreYouSureDialog from './navigation/AreYouSureDialog'

import getDataFrom from '../utils/getDataFrom'
import { handleAdd, handleSave, handleDelete } from '../utils/faqFetching'

import { FETCH_STUDENT_FAQS_URL, FETCH_ADMIN_FAQS_URL, FETCH_FACULTY_FAQS_URL, CUSTOM_BLUE_COLOR, TYPE_STUDENT, TYPE_FACULTY, TYPE_ADMIN } from '../resources/constants'

function FAQs ({
  showingStudentFAQs = false,
  showingFacultyFAQs = false,
  showingAdminFAQs = false,
  isAdmin = false
}) {
  const [error, setError] = useState(null)

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [loadingFaculty, setLoadingFaculty] = useState(true)
  const [loadingAdmin, setLoadingAdmin] = useState(true)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const [studentFAQs, setStudentFAQs] = useState([])
  const [facultyFAQs, setFacultyFAQs] = useState([])
  const [adminFAQs, setAdminFAQs] = useState([])

  // student
  const [editingIdStudent, setEditingIdStudent] = useState(null)
  const [editedQuestionStudent, setEditedQuestionStudent] = useState('')
  const [editedAnswerStudent, setEditedAnswerStudent] = useState('')
  const [newQuestionStudent, setNewQuestionStudent] = useState('')
  const [newAnswerStudent, setNewAnswerStudent] = useState('')
  const [deletingIdStudent, setDeletingIdStudent] = useState(null)

  // faculty
  const [editingIdFaculty, setEditingIdFaculty] = useState(null)
  const [editedQuestionFaculty, setEditedQuestionFaculty] = useState('')
  const [editedAnswerFaculty, setEditedAnswerFaculty] = useState('')
  const [newQuestionFaculty, setNewQuestionFaculty] = useState('')
  const [newAnswerFaculty, setNewAnswerFaculty] = useState('')
  const [deletingIdFaculty, setDeletingIdFaculty] = useState(null)

  // admin
  const [editingIdAdmin, setEditingIdAdmin] = useState(null)
  const [editedQuestionAdmin, setEditedQuestionAdmin] = useState('')
  const [editedAnswerAdmin, setEditedAnswerAdmin] = useState('')
  const [newQuestionAdmin, setNewQuestionAdmin] = useState('')
  const [newAnswerAdmin, setNewAnswerAdmin] = useState('')
  const [deletingIdAdmin, setDeletingIdAdmin] = useState(null)

  useEffect(() => {
    async function fetchData () {
      let studentsRes = []
      let facultyRes = []
      let adminRes = []
      if (showingStudentFAQs) {
        studentsRes = await getDataFrom(FETCH_STUDENT_FAQS_URL)
        if (studentsRes.length === 0) {
          setError('Error loading students FAQs. Please try again.')
        } else {
          setStudentFAQs(studentsRes)
          setLoadingStudents(false)
        }
      }
      if (showingFacultyFAQs) {
        facultyRes = await getDataFrom(FETCH_FACULTY_FAQS_URL)
        if (facultyRes.length === 0) {
          setError('Error loading faculty FAQs. Please try again.')
        } else {
          setFacultyFAQs(facultyRes)
          setLoadingFaculty(false)
        }
      }
      if (showingAdminFAQs) {
        adminRes = await getDataFrom(FETCH_ADMIN_FAQS_URL)
        if (adminRes.length === 0) {
          setError('Error loading admin FAQs. Please try again.')
        } else {
          setAdminFAQs(adminRes)
          setLoadingAdmin(false)
        }
      }

      setLoadingInitial(false)
    }
    fetchData()
  }, [showingStudentFAQs, showingFacultyFAQs, showingAdminFAQs])

  const onBeginDelete = (id, type) => {
    switch (type) {
      case TYPE_STUDENT:
        setDeletingIdStudent(id)
        break
      case TYPE_FACULTY:
        setDeletingIdFaculty(id)
        break
      case TYPE_ADMIN:
        setDeletingIdAdmin(id)
        break
      default:
        break
    }
    setOpenDeleteDialog(true)
  }

  const onCancelDelete = () => {
    setOpenDeleteDialog(false)
    if (error !== null) {
      setError(null)
    }
    if (deletingIdStudent !== null) { setDeletingIdStudent(null) }
    if (deletingIdFaculty !== null) { setDeletingIdFaculty(null) }
    if (deletingIdAdmin !== null) { setDeletingIdAdmin(null) }
  }

  const onBeginEdit = (id, type, question, answer) => {
    switch (type) {
      case TYPE_STUDENT:
        setEditingIdStudent(id)
        setEditedQuestionStudent(question)
        setEditedAnswerStudent(answer)
        break
      case TYPE_FACULTY:
        setEditingIdFaculty(id)
        setEditedQuestionFaculty(question)
        setEditedAnswerFaculty(answer)
        break
      case TYPE_ADMIN:
        setEditingIdAdmin(id)
        setEditedQuestionAdmin(question)
        setEditedAnswerAdmin(answer)
        break
      default:
        break
    }
  }

  const onCancelEdit = (type) => { // Stop editting this
    switch (type) {
      case TYPE_STUDENT:
        setEditingIdStudent(null)
        setEditedQuestionStudent('')
        setEditedAnswerStudent('')
        break
      case TYPE_FACULTY:
        setEditingIdFaculty(null)
        setEditedQuestionFaculty('')
        setEditedAnswerFaculty('')
        break
      case TYPE_ADMIN:
        setEditingIdAdmin(null)
        setEditedQuestionAdmin('')
        setEditedAnswerAdmin('')
        break
      default:
        break
    }

    setError(null)
  }

  const onSave = async (id, type) => {
    switch (type) {
      case TYPE_STUDENT:
        await handleSave(TYPE_STUDENT, id, editedQuestionStudent, editedAnswerStudent,
          studentFAQs, setStudentFAQs, setEditingIdStudent, setError)
        break
      case TYPE_FACULTY:
        await handleSave(TYPE_FACULTY, id, editedQuestionFaculty, editedAnswerFaculty,
          facultyFAQs, setFacultyFAQs, setEditingIdFaculty, setError)
        break
      case TYPE_ADMIN:
        await handleSave(TYPE_ADMIN, id, editedQuestionAdmin, editedAnswerAdmin,
          adminFAQs, setAdminFAQs, setEditingIdAdmin, setError)
        break
      default:
        break
    }
  }

  const onAdd = async (type) => {
    switch (type) {
      case TYPE_STUDENT:
        await handleAdd(TYPE_STUDENT, newQuestionStudent, newAnswerStudent, setNewQuestionStudent, setNewAnswerStudent,
          setStudentFAQs, setLoadingStudents, setError)
        break
      case TYPE_FACULTY:
        await handleAdd(TYPE_FACULTY, newQuestionFaculty, newAnswerFaculty, setNewQuestionFaculty, setNewAnswerFaculty,
          setFacultyFAQs, setLoadingFaculty, setError)
        break
      case TYPE_ADMIN:
        await handleAdd(TYPE_ADMIN, newQuestionAdmin, newAnswerAdmin, setNewQuestionAdmin, setNewAnswerAdmin,
          setAdminFAQs, setLoadingAdmin, setError)
        break
      default:
        break
    }
  }

  const onDelete = async () => {
    if (deletingIdStudent !== null) {
      await handleDelete(TYPE_STUDENT, deletingIdStudent, setLoadingStudents, studentFAQs,
        setStudentFAQs, setDeletingIdStudent, setOpenDeleteDialog, setError)
    } else if (deletingIdFaculty !== null) {
      await handleDelete(TYPE_FACULTY, deletingIdFaculty, setLoadingFaculty, facultyFAQs,
        setFacultyFAQs, setDeletingIdFaculty, setOpenDeleteDialog, setError)
    } else if (deletingIdAdmin !== null) {
      await handleDelete(TYPE_ADMIN, deletingIdAdmin, setLoadingAdmin, adminFAQs,
        setAdminFAQs, setDeletingIdAdmin, setOpenDeleteDialog, setError)
    }
  }

  const renderInnerLoading = (title) => {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>{title}</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  const renderFAQs = ({
    title,
    type,
    FAQs,
    editingId,
    setEditedQuestion,
    setEditedAnswer,
    newQuestion,
    newAnswer,
    setNewQuestion,
    setNewAnswer
  }) => {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>{title}</Typography>
        <List>
          {FAQs.map(({ id, question, answer }) => (
            <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingId === id ? '10px' : '0px' }}>

                {/* Textbox, can edit once the edit button is clicked */}
                {editingId === id
                  ? (
                    <>
                      <TextField
                        defaultValue={question}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                        size='medium'
                        autoFocus
                        multiline
                        rows={4}
                        sx={{ width: '50%' }}
                      />
                      <TextField
                        defaultValue={answer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        size='medium'
                        autoFocus
                        multiline
                        rows={4}
                        sx={{ width: '50%' }}
                      />
                    </>
                    )
                  : (
                    <>
                      <Accordion
                        key={`accordion-${type}-${id}`}
                        disableGutters
                        sx={{
                          width: '90%',
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
                          aria-controls={`panel-${type}${id}-content`}
                          id={`panel-${type}${id}-header`}
                          sx={{
                            bgcolor: CUSTOM_BLUE_COLOR,
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
                          <Typography sx={{ }}>{question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ }}>
                          <Typography sx={{ }}>
                            {answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                    )}

                {/* Edit and Delete buttons */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {editingId !== id && (
                      <>
                        <IconButton onClick={() => onBeginEdit(id, type, question, answer)} data-testid='edit-btn'>
                          <Edit />
                        </IconButton>

                        <IconButton onClick={() => onBeginDelete(id, type)} color='error' data-testid='delete-btn'>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </div>
                )}

              </div>

              {/* Save and cancel buttons below */}
              {isAdmin && editingId === id && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                  <Button
                    variant='contained' color='primary'
                    startIcon={<Save />}
                    onClick={() => onSave(id, type)}
                    data-testid='save-btn'
                  >
                    Save
                  </Button>
                  <Button
                    variant='outlined' color='warning'
                    startIcon={<Cancel />}
                    onClick={() => onCancelEdit(type)}
                    data-testid='cancel-btn'
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </ListItem>
          ))}
        </List>

        {/* Add New Section */}
        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
            <TextField
              label={`New Question (${type})`}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              size='small'
              sx={{ width: '35%' }}
            />
            <TextField
              label={`New Answer (${type})`}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              size='small'
              sx={{ width: '35%' }}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={() => onAdd(type)}
              startIcon={<AddIcon />}
              sx={{ mx: '50px' }}
              data-testid='add-btn'
            >
              Add
            </Button>
          </div>
        )}
      </Box>
    )
  }

  if (loadingInitial) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress data-testid='initial-loading' />
      </Box>
    )
  } else {
    return (
      <>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ marginTop: 2 }}>
          <Typography variant='h2'>Frequently Asked Questions</Typography>
          {error && (
            <Typography variant='body1' color='error' sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        {showingAdminFAQs && loadingAdmin && (
          renderInnerLoading('Admin FAQs')
        )}
        {showingAdminFAQs && !loadingAdmin && renderFAQs({
          title: 'Admin FAQs',
          type: TYPE_ADMIN,
          FAQs: adminFAQs,
          editingId: editingIdAdmin,
          setEditedQuestion: setEditedQuestionAdmin,
          setEditedAnswer: setEditedAnswerAdmin,
          newQuestion: newQuestionAdmin,
          newAnswer: newAnswerAdmin,
          setNewQuestion: setNewQuestionAdmin,
          setNewAnswer: setNewAnswerAdmin
        })}

        {showingStudentFAQs && loadingStudents && (
          renderInnerLoading('Student FAQs')
        )}
        {showingStudentFAQs && !loadingStudents && renderFAQs({
          title: 'Student FAQs',
          type: TYPE_STUDENT,
          FAQs: studentFAQs,
          editingId: editingIdStudent,
          setEditedQuestion: setEditedQuestionStudent,
          setEditedAnswer: setEditedAnswerStudent,
          newQuestion: newQuestionStudent,
          newAnswer: newAnswerStudent,
          setNewQuestion: setNewQuestionStudent,
          setNewAnswer: setNewAnswerStudent
        })}

        {showingFacultyFAQs && loadingFaculty && (
          renderInnerLoading('Faculty FAQs')
        )}
        {showingFacultyFAQs && !loadingFaculty && renderFAQs({
          title: 'Faculty FAQs',
          type: TYPE_FACULTY,
          FAQs: facultyFAQs,
          editingId: editingIdFaculty,
          setEditedQuestion: setEditedQuestionFaculty,
          setEditedAnswer: setEditedAnswerFaculty,
          newQuestion: newQuestionFaculty,
          newAnswer: newAnswerFaculty,
          setNewQuestion: setNewQuestionFaculty,
          setNewAnswer: setNewAnswerFaculty
        })}

        <AreYouSureDialog
          open={openDeleteDialog}
          onClose={onCancelDelete}
          onConfirm={() => onDelete()}
          error={error}
          action='delete'
        />
      </>
    )
  }
}

export default FAQs
