/**
 * @file ManageVariables.js
 * @description serves as a parent file that dynamically renders different administrative sections
 *              (Disciplines, Majors, Research Periods, Umbrella Topics, and Departments) based on the props provided.
 *              It allows users to edit, add, and delete these entities while handling data fetching and updates.
 *              Has sets of unique useState variables for each resource (editingId, editedName, etc) because the page
 *              renders different resources conditionally.
 *              The rendering logic is determined by props like `showingDepartments`, `showingDisciplinesAndMajors`, etc.
 *
 * @imports fetchResearchPeriods, fetch... to prepopulate data.
 * @imports renderDisicplines, render... to show the data on the screen.
 * @imports handleAdd..., handleSave..., handleDelete... to execute communication with backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Typography, CircularProgress, Box, Button } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import {
  renderDisciplines,
  renderMajors,
  renderResearchPeriods,
  renderUmbrellaTopics,
  renderDepartments
} from './RenderAdminVariables'
import AreYouSureDialog from '../navigation/AreYouSureDialog'

import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import fetchUmbrellaTopics from '../../utils/fetchUmbrellaTopics'
import fetchDisciplines from '../../utils/fetchDisciplines'
import fetchDepartments from '../../utils/fetchDepartments'

import {
  handleSaveMajor, handleAddMajor, handleDeleteMajor,
  handleSaveDiscipline, handleAddDiscipline, handleDeleteDiscipline,
  handleSaveUmbrella, handleAddUmbrella, handleDeleteUmbrella,
  handleSavePeriod, handleAddPeriod, handleDeletePeriod,
  handleSaveDepartment, handleAddDepartment, handleDeleteDepartment
} from '../../utils/adminFetching'
import PersistentAlert from '../PersistentAlert'
import getDataFrom from '../../utils/getDataFrom'
import { GET_DISCIPLINES_ENDPOINT } from '../../resources/constants'

function ManageVariables ({
  showingDisciplinesAndMajors = false,
  showingResearchPeriods = false,
  showingUmbrellaTopics = false,
  showingDepartments = false
}) {
  const navigate = useNavigate()

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingDisciplinesMajors, setLoadingDisciplinesMajors] = useState(true)
  const [loadingUmbrellaTopics, setLoadingUmbrellaTopics] = useState(true)
  const [loadingResearchPeriods, setLoadingResearchPeriods] = useState(true)
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  const [error, setError] = useState(null)

  // disciplines
  const [disciplines, setDisciplines] = useState([])
  const [editingIdDiscipline, setEditingIdDiscipline] = useState(null)
  const [editedNameDiscipline, setEditedNameDiscipline] = useState('')
  const [newDisciplineName, setNewDisciplineName] = useState('')
  const [deletingIdDiscipline, setDeletingIdDiscipline] = useState(null)

  // majors
  const [majors, setMajors] = useState([]) // array of majors with their disciplines
  const [editingIdMajor, setEditingIdMajor] = useState(null)
  const [editedNameMajor, setEditedNameMajor] = useState('')
  const [selectedDisciplines, setSelectedDisciplines] = useState({}) // dict of majorId with discipline(s) each major is under. Used to prepopulate discipline dropdowns.
  const [newMajorName, setNewMajorName] = useState('')
  const [newMajorDisciplines, setNewMajorDisciplines] = useState([]) // array of strings sent in backend request for editing and adding a major
  const [deletingIdMajor, setDeletingIdMajor] = useState(null)

  // umbrella topics
  const [umbrellaTopics, setUmbrellaTopics] = useState([])
  const [editingIdUmbrella, setEditingIdUmbrella] = useState(null)
  const [editedNameUmbrella, setEditedNameUmbrella] = useState('')
  const [newUmbrellaName, setNewUmbrellaName] = useState('')
  const [deletingIdUmbrella, setDeletingIdUmbrella] = useState(null)

  // research periods
  const [researchPeriods, setResearchPeriods] = useState([])
  const [editingIdPeriod, setEditingIdPeriod] = useState(null)
  const [editedNamePeriod, setEditedNamePeriod] = useState('')
  const [newPeriodName, setNewPeriodName] = useState('')
  const [deletingIdPeriod, setDeletingIdPeriod] = useState(null)

  // departments
  const [departments, setDepartments] = useState([])
  const [editingIdDepartment, setEditingIdDepartment] = useState(null)
  const [editedNameDepartment, setEditedNameDepartment] = useState('')
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [deletingIdDepartment, setDeletingIdDepartment] = useState(null)

  const handleBeginDeleteMajor = (id) => {
    setDeletingIdMajor(id)
    setOpenDeleteDialog(true)
  }
  const handleBeginDeleteDiscipline = (id) => {
    setDeletingIdDiscipline(id)
    setOpenDeleteDialog(true)
  }
  const handleBeginDeleteUmbrella = (id) => {
    setDeletingIdUmbrella(id)
    setOpenDeleteDialog(true)
  }
  const handleBeginDeletePeriods = (id) => {
    setDeletingIdPeriod(id)
    setOpenDeleteDialog(true)
  }
  const handleBeginDeleteDepartment = (id) => {
    setDeletingIdDepartment(id)
    setOpenDeleteDialog(true)
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    if (error !== null) {
      setError(null)
    }
    if (deletingIdDiscipline !== null) { setDeletingIdDiscipline(null) }
    if (deletingIdMajor !== null) { setDeletingIdMajor(null) }
    if (deletingIdUmbrella !== null) { setDeletingIdUmbrella(null) }
    if (deletingIdPeriod !== null) { setDeletingIdPeriod(null) }
    if (deletingIdDepartment !== null) { setDeletingIdDepartment(null) }
  }

  function prepopulateMajorsWithDisciplines (disciplinesRes) {
    // Extract unique majors and associate them with disciplines
    // key: majorId, value: object with majorId, majorName, list of discipline objects with id and name
    const majorMap = {}
    disciplinesRes.forEach(discipline => {
      discipline.majors.forEach(major => {
        if (!majorMap[major.id]) {
          majorMap[major.id] = { ...major, disciplines: [] }
        }
        majorMap[major.id].disciplines.push(discipline)
      })
    })

    setMajors(Object.values(majorMap)) // converts values into an array
    // majorMap has key: majorId, value: object containing major id, name, disciplines (array of discipline objects with id, name, majors)
    // ex: { 1: {id: 1, name: 'major name', disciplines: [{id, name, majors ...}]}, ...}
    // majors is just [ {id, name, disciplines}, {...}, ... ]

    // Prepopulate discipline selections per major
    // key: majorId, value: object with disciplineId, disciplineName, list of majors
    const prepopulatedMajorDisciplines = {}
    Object.values(majorMap).forEach(major => {
      // this makes the discipline drop-down empty if under "Other"
      // if (major.disciplines.length === 1 && major.disciplines[0].name === 'Other') {
      // prepopulatedMajorDisciplines[major.id] = []
      // } else {
      //   prepopulatedMajorDisciplines[major.id] = major.disciplines
      // }

      // this makes the discipline drop-down show "Other" as the preselected "discipline"
      prepopulatedMajorDisciplines[major.id] = major.disciplines
    })

    setSelectedDisciplines(prepopulatedMajorDisciplines)
  }

  // when the page loads up, get all of the things to render
  useEffect(() => {
    async function fetchData () {
      try {
        let disciplinesRes = []
        let researchPeriodsRes = []
        let umbrellaTopicsRes = []
        let departmentsRes = []
        if (showingDisciplinesAndMajors) {
          disciplinesRes = await getDataFrom(GET_DISCIPLINES_ENDPOINT)
        }
        if (showingResearchPeriods) {
          researchPeriodsRes = await fetchResearchPeriods()
        }
        if (showingUmbrellaTopics) {
          umbrellaTopicsRes = await fetchUmbrellaTopics()
        }
        if (showingDepartments) {
          departmentsRes = await fetchDepartments()
        }

        if (showingDisciplinesAndMajors) {
          setDisciplines(disciplinesRes)
          prepopulateMajorsWithDisciplines(disciplinesRes)
          setLoadingDisciplinesMajors(false)
        }
        if (showingUmbrellaTopics) {
          setUmbrellaTopics(umbrellaTopicsRes)
          setLoadingUmbrellaTopics(false)
        }
        if (showingResearchPeriods) {
          setResearchPeriods(researchPeriodsRes)
          setLoadingResearchPeriods(false)
        }
        if (showingDepartments) {
          setDepartments(departmentsRes)
          setLoadingDepartments(false)
        }
      } catch (error) {
        setError('Error loading data. Please try again later.')
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchData()
  }, [showingDisciplinesAndMajors, showingUmbrellaTopics, showingResearchPeriods, showingDepartments])

  // ------------------ MAJORS FUNCTIONS ------------------ //

  const handleEditMajor = (id, name) => {
    setEditingIdMajor(id) // Allows the user to begin editting the major name
    setEditedNameMajor(name)
  }

  // Cancel MAJOR Edit is the only Cancel Edit function that needs an id because majors have disciplines associated
  const handleCancelMajorEdit = (id) => {
    setSelectedDisciplines(prev => ({ // Set the disciplines back to what they originally were
      ...prev,
      [id]: majors.find(m => m.id === id)?.disciplines[0].name !== 'Other' ? majors.find(m => m.id === id)?.disciplines : [] // set selected disciplines to empty array if the major previously had no discipline
    }))
    setEditingIdMajor(null) // Stop editting this major
    setEditedNameMajor('')
    setError(null)
  }

  const onSaveMajor = async (id) => {
    await handleSaveMajor(id, editedNameMajor, setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)
  }

  const onAddMajor = async () => {
    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)
  }

  // ------------------ DISCIPLINES FUNCTIONS ------------------ //
  const handleEditDiscipline = (id, name) => {
    setEditingIdDiscipline(id) // Allows the user to begin editting
    setEditedNameDiscipline(name)
  }

  const handleCancelDisciplineEdit = () => {
    setEditingIdDiscipline(null) // Stop editting this
    setEditedNameDiscipline('')
    setError(null)
  }

  const onSaveDiscipline = async (id) => {
    await handleSaveDiscipline(id, editedNameDiscipline, disciplines, setDisciplines, setEditingIdDiscipline, setError)
  }

  const onAddDiscipline = async () => {
    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, fetchDisciplines, setError)
  }

  // ------------------ UMBRELLA TOPICS FUNCTIONS ------------------ //
  const handleEditUmbrella = (id, name) => {
    setEditingIdUmbrella(id) // Allows the user to begin editting
    setEditedNameUmbrella(name)
  }

  const handleCancelUmbrellaEdit = () => {
    setEditingIdUmbrella(null) // Stop editting this
    setEditedNameUmbrella('')
    setError(null)
  }

  const onSaveUmbrella = async (id) => {
    await handleSaveUmbrella(id, editedNameUmbrella, umbrellaTopics, setUmbrellaTopics, setEditingIdUmbrella, setError)
  }

  const onAddUmbrella = async () => {
    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, fetchUmbrellaTopics, setError)
  }

  // ------------------ RESEARCH PERIODS FUNCTIONS ------------------ //
  const handleEditPeriod = (id, name) => {
    setEditingIdPeriod(id) // Allows the user to begin editting
    setEditedNamePeriod(name)
  }

  const handleCancelPeriodEdit = () => {
    setEditingIdPeriod(null) // Stop editting this
    setEditedNamePeriod('')
    setError(null)
  }

  const onSavePeriod = async (id) => {
    await handleSavePeriod(id, editedNamePeriod, setResearchPeriods, researchPeriods, setEditingIdPeriod, setError)
  }

  const onAddPeriod = async () => {
    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, fetchResearchPeriods, setError)
  }

  // ------------------ DEPARTMENTS FUNCTIONS ------------------ //
  const handleEditDepartment = (id, name) => {
    setEditingIdDepartment(id) // Allows the user to begin editting
    setEditedNameDepartment(name)
  }

  const handleCancelDepartmentEdit = () => {
    setEditingIdDepartment(null) // Stop editting this
    setEditedNameDepartment('')
    setError(null)
  }

  const onSaveDepartment = async (id) => {
    await handleSaveDepartment(id, editedNameDepartment, departments, setDepartments, setEditingIdDepartment, setError)
  }

  const onAddDepartment = async () => {
    await handleAddDepartment(newDepartmentName, setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)
  }

  // uses deletingId to know which delete function to call on the shared AreYouSureDialog box
  const onDelete = async () => {
    if (deletingIdDiscipline !== null) {
      await handleDeleteDiscipline(deletingIdDiscipline, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)
    }
    if (deletingIdMajor !== null) {
      await handleDeleteMajor(deletingIdMajor, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)
    }
    if (deletingIdUmbrella !== null) {
      await handleDeleteUmbrella(deletingIdUmbrella, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)
    }
    if (deletingIdPeriod !== null) {
      await handleDeletePeriod(deletingIdPeriod, setLoadingResearchPeriods, researchPeriods, setResearchPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)
    }
    if (deletingIdDepartment !== null) {
      await handleDeleteDepartment(deletingIdDepartment, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)
    }
  }

  // ------------------ MAIN ------------------ //

  if (loadingInitial) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress data-testid='initial-loading' />
      </Box>
    )
  }
  return (
    <>
      <Box sx={{ display: 'flex', margin: 3 }}>
        <Button variant='outlined' onClick={() => { navigate('/posts') }} sx={{ mr: 2 }}>
          Back
        </Button>
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ marginTop: 2 }}>
        <Typography variant='h2'>Manage App Variables</Typography>
        {error && (
          <PersistentAlert msg={error} type='error' />
        )}

      </Box>
      <Box sx={{ padding: 3, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='body1'>
          <InfoIcon />
          Here you can manage the data included in the OUR SEARCH app.
        </Typography>
        <Typography sx={{ padding: 2 }} color='red'>
          Instructions:
          To edit variables, click the pencil icon on the right. Once edited, click Save.
          To delete variables, click the trash icon on the right.
          To add new variables, fill in the input boxes on the bottom. Then click Add.
        </Typography>
        <Typography sx={{ padding: 2 }} color='red'>
          Note that you cannot remove umbrella topics, research periods, or majors if there are already projects, students, or faculty currently attached to them. You must delete those connections first.
          By deleting a department, any faculty previously associated with that department will no longer be associated with it.
          "Other" encapsulates majors that are not under a discipline.
          You cannot edit the Undeclared major.
        </Typography>
      </Box>
      <Box sx={{ padding: 1, maxWidth: 900, margin: 'auto' }} display='flex' justifyContent='center' alignItems='center'>
        <Button onClick={() => navigate('/disciplines-and-majors')}>Disciplines</Button>
        <Button onClick={() => navigate('/disciplines-and-majors')}>Majors</Button>
        <Button onClick={() => navigate('/other-app-vars')}>Research Periods</Button>
        <Button onClick={() => navigate('/other-app-vars')}>Umbrella Topics</Button>
        <Button onClick={() => navigate('/other-app-vars')}>Departments</Button>
        <Button onClick={() => navigate('/admin-faqs')}>FAQs</Button>
      </Box>
      {showingDisciplinesAndMajors && renderDisciplines({
        loadingDisciplinesMajors,
        disciplines,
        editingIdDiscipline,
        newDisciplineName,
        setNewDisciplineName,
        setEditedNameDiscipline,
        handleEditDiscipline,
        handleCancelDisciplineEdit,
        handleBeginDeleteDiscipline,
        handleSaveDiscipline: onSaveDiscipline,
        handleAddDiscipline: onAddDiscipline
      })}
      {showingDisciplinesAndMajors && renderMajors({
        loadingDisciplinesMajors,
        disciplines,
        majors,
        selectedDisciplines,
        setSelectedDisciplines,
        newMajorDisciplines,
        setNewMajorDisciplines,
        editingIdMajor,
        newMajorName,
        setNewMajorName,
        setEditedNameMajor,
        handleEditMajor,
        handleCancelMajorEdit,
        handleBeginDeleteMajor,
        handleSaveMajor: onSaveMajor,
        handleAddMajor: onAddMajor
      })}
      {showingUmbrellaTopics && renderUmbrellaTopics({
        loadingUmbrellaTopics,
        umbrellaTopics,
        editingIdUmbrella,
        newUmbrellaName,
        setNewUmbrellaName,
        setEditedNameUmbrella,
        handleEditUmbrella,
        handleCancelUmbrellaEdit,
        handleBeginDeleteUmbrella,
        handleSaveUmbrella: onSaveUmbrella,
        handleAddUmbrella: onAddUmbrella
      })}
      {showingResearchPeriods && renderResearchPeriods({
        loadingResearchPeriods,
        researchPeriods,
        editingIdPeriod,
        newPeriodName,
        setNewPeriodName,
        setEditedNamePeriod,
        handleEditPeriod,
        handleCancelPeriodEdit,
        handleBeginDeletePeriods,
        handleSavePeriod: onSavePeriod,
        handleAddPeriod: onAddPeriod
      })}

      {showingDepartments && renderDepartments({
        loadingDepartments,
        departments,
        editingIdDepartment,
        newDepartmentName,
        setNewDepartmentName,
        setEditedNameDepartment,
        handleEditDepartment,
        handleCancelDepartmentEdit,
        handleBeginDeleteDepartment,
        handleSaveDepartment: onSaveDepartment,
        handleAddDepartment: onAddDepartment
      })}

      <AreYouSureDialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={() => onDelete()}
        error={error}
        action='delete'
      />
    </>
  )
}

export default ManageVariables
