/**
 * @file ManageVariables.js
 * @description serves as a parent file that dynamically renders different administrative sections 
 *              (Disciplines, Majors, Research Periods, Umbrella Topics, and Departments) based on the props provided.
 *              It allows users to edit, add, and delete these entities while handling data fetching and updates.
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
  const [majors, setMajors] = useState([])
  const [editingIdMajor, setEditingIdMajor] = useState(null)
  const [editedNameMajor, setEditedNameMajor] = useState('')
  const [selectedDisciplines, setSelectedDisciplines] = useState({})
  const [newMajorName, setNewMajorName] = useState('')
  const [newMajorDisciplines, setNewMajorDisciplines] = useState([])
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

    // Prepopulate discipline selections per major
    const prepopulatedMajorDisciplines = {}
    Object.values(majorMap).forEach(major => {
      prepopulatedMajorDisciplines[major.id] = major.disciplines
    })

    setSelectedDisciplines(prepopulatedMajorDisciplines)
  }

  // when the page loads up, get all of the things to render
  useEffect(() => {
    async function fetchData () {
      let disciplinesRes = []
      let researchPeriodsRes = []
      let umbrellaTopicsRes = []
      let departmentsRes = []
      if (showingDisciplinesAndMajors) {
        disciplinesRes = await fetchDisciplines()
        // disciplinesRes = mockDisciplinesMajors // TODO remove after testing
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
        if (disciplinesRes.length === 0) {
          setError('Error loading disciplines and majors. Please try again.')
        } else {
          setDisciplines(disciplinesRes)
          prepopulateMajorsWithDisciplines(disciplinesRes)
          setLoadingDisciplinesMajors(false)
        }
      }
      if (showingUmbrellaTopics) {
        if (umbrellaTopicsRes.length === 0) {
          setError('Error loading umbrella topics. Please try again.')
        } else {
          setUmbrellaTopics(umbrellaTopicsRes)
          setLoadingUmbrellaTopics(false)
        }
      }
      if (showingResearchPeriods) {
        if (researchPeriodsRes.length === 0) {
          setError('Error loading research periods. Please try again.')
        } else {
          setResearchPeriods(researchPeriodsRes)
          setLoadingResearchPeriods(false)
        }
      }
      if (showingDepartments) {
        if (departmentsRes.length === 0) {
          setError('Error loading departments. Please try again.')
        } else {
          setDepartments(departmentsRes)
          setLoadingDepartments(false)
        }
      }
      setLoadingInitial(false)
    }
    fetchData()
  }, [showingDisciplinesAndMajors, showingUmbrellaTopics, showingResearchPeriods, showingDepartments])

  // ------------------ MAJORS FUNCTIONS ------------------ //

  const handleEditMajor = (id, name) => {
    setEditingIdMajor(id) // Allows the user to begin editting the major name
    setEditedNameMajor(name)
  }

  const handleCancelMajorEdit = (id) => {
    setSelectedDisciplines(prev => ({ // Set the disciplines back to what they originally were
      ...prev,
      [id]: majors.find(m => m.id === id)?.disciplines || []
    }))
    setEditingIdMajor(null) // Stop editting this major
    setEditedNameMajor('')
    setError(null)
  }

  const onSaveMajor = async (id) => {
    await handleSaveMajor(id, editedNameMajor, setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)
  }

  const onAddMajor = async (id) => {
    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, fetchDisciplines, setError)
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

  const onAddDiscipline = async (id) => {
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

  const onAddUmbrella = async (id) => {
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

  const onAddPeriod = async (id) => {
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

  const onAddDepartment = async (id) => {
    await handleAddDepartment(newDepartmentName, setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)
  }

  // uses deletingId to know which delete function to call on the shared AreYouSureDialog box
  const handleDelete = async () => {
    if (deletingIdDiscipline !== null) {
      await handleDeleteDiscipline(deletingIdDiscipline, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError)
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
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ marginTop: 2 }}>
        <Button variant='outlined' onClick={() => { navigate('/posts') }} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant='h2'>Manage App Variables</Typography>
        {error && (
          <Typography variant='body1' color='error' sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
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
        onConfirm={() => handleDelete()}
        error={error}
        action='delete'
      />
    </>
  )
}

export default ManageVariables
