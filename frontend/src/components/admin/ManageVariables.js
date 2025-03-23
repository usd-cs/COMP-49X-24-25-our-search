/**
 * This component //TODO
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import { Typography, CircularProgress, Box, Button } from '@mui/material'
import {
  renderDisciplines, renderMajors,
  renderResearchPeriods,
  renderUmbrellaTopics,
  renderDepartments
} from './RenderAdminVariables'
import AreYouSureDialog from '../navigation/AreYouSureDialog'

import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import fetchUmbrellaTopics from '../../utils/fetchUmbrellaTopics'
import fetchDisciplines from '../../utils/fetchDisciplines'
import fetchDepartments from '../../utils/fetchDepartments'

import { useNavigate } from 'react-router-dom'

import { backendUrl } from '../../resources/constants'

// TODO remove
import { getDepartmentsExpectedResponse, getResearchPeriodsExpectedResponse, getUmbrellaTopicsExpectedResponse, mockDisciplinesMajors } from '../../resources/mockData'

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
  const [success, setSuccess] = useState(null) //TODO

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
        // researchPeriodsRes = getResearchPeriodsExpectedResponse //TODO
      }
      if (showingUmbrellaTopics) {
        umbrellaTopicsRes = await fetchUmbrellaTopics()
        // umbrellaTopicsRes = getUmbrellaTopicsExpectedResponse //TODO
      }
      if (showingDepartments) {
        departmentsRes = await fetchDepartments()
        // departmentsRes = getDepartmentsExpectedResponse //TODO
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

  const handleSaveMajor = async (id) => {
    if (selectedDisciplines[id].length === 0) {
      setError('You must associate this major with one or more disciplines. Please try again.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/major?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editedNameMajor,
          disciplines: selectedDisciplines[id].map(d => d.name)
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setMajors(majors.map(m =>
        m.id === id ? { ...m, name: editedNameMajor, disciplines: selectedDisciplines[id] } : m
      ))
      setError(null)
      setEditingIdMajor(null)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${editedNameMajor} cannot be editted due to conflicts with other data. Then try again.`)
      } else {
        setError(`Unexpected error updating major: ${editedNameMajor}.`)
      }
    }
  }

  const handleDeleteMajor = async (id) => {
    setLoadingDisciplinesMajors(true)

    const major = majors.find(m => m.id === id)
    if (!major) {
      setError('Major not found.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/major?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setMajors(majors.filter(m => m.id !== id))
      setError(null)
      setDeletingIdMajor(null)
      setOpenDeleteDialog(false)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${major.name} cannot be deleted because it has connections to other disciplines, projects, or students. Please edit or remove those connections first. Then try again.`)
      } else {
        setError(`Unexpected error deleting major: ${major.name}`)
      }
    } finally {
      setLoadingDisciplinesMajors(false)
    }
  }

  const handleAddMajor = async () => {
    if (!newMajorName.trim()) {
      setError('Error adding major. Must have a name.')
      return
    }
    if (newMajorDisciplines.length === 0) {
      setError('Error adding major. Must be under at least one discipline.')
      return
    }

    setLoadingDisciplinesMajors(true)

    const newMajor = {
      name: newMajorName,
      disciplines: newMajorDisciplines
    }

    try {
      const response = await fetch(`${backendUrl}/major`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMajor)
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      const newDisciplinesRes = await fetchDisciplines()
      if (newDisciplinesRes.length === 0) {
        throw new Error('505')
      } else {
        setDisciplines(newDisciplinesRes)
        prepopulateMajorsWithDisciplines(newDisciplinesRes)
      }

      setNewMajorName('')
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '505') {
        setError('Major added, but there was an error loading updated disciplines and majors data.')
      } else {
        setError(`Unexpected error adding major: ${newMajorName}.`)
      }
    } finally {
      setLoadingDisciplinesMajors(false)
    }
  }

  // ------------------ DISCIPLINES FUNCTIONS ------------------ //
  const handleEditDiscipline = (id, name) => {
    setEditingIdDiscipline(id) // Allows the user to begin editting
    setEditedNameDiscipline(name)
  }

  const handleCancelDisciplineEdit = (id) => {
    setEditingIdDiscipline(null) // Stop editting this
    setEditedNameDiscipline('')
    setError(null)
  }

  const handleSaveDiscipline = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/discipline?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editedNameDiscipline
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setDisciplines(majors.map(d =>
        d.id === id ? { ...d, name: editedNameDiscipline } : d
      ))
      setError(null)
      setEditingIdDiscipline(null)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${editedNameDiscipline} cannot be editted due to conflicts with other data. Then try again.`)
      } else {
        setError(`Unexpected error updating discipline: ${editedNameDiscipline}.`)
      }
    }
  }

  const handleDeleteDiscipline = async (id) => {
    setLoadingDisciplinesMajors(true)

    const disc = disciplines.find(m => m.id === id)
    if (!disc) {
      setError('Discipline not found.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/discipline?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setDisciplines(disciplines.filter(d => d.id !== id))
      setError(null)
      setDeletingIdDiscipline(null)
      setOpenDeleteDialog(false)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${disc.name} cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Then try again.`)
      } else {
        setError(`Unexpected error deleting discipline: ${disc.name}.`)
      }
    } finally {
      setLoadingDisciplinesMajors(false)
    }
  }

  const handleAddDiscipline = async () => {
    if (!newDisciplineName.trim()) {
      setError('Error adding discipline. Must have a name.')
      return
    }

    setLoadingDisciplinesMajors(true)

    try {
      const response = await fetch(`${backendUrl}/major`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDisciplineName })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      const newDisciplinesRes = await fetchDisciplines()
      if (newDisciplinesRes.length === 0) {
        throw new Error('505')
      } else {
        setDisciplines(newDisciplinesRes)
        prepopulateMajorsWithDisciplines(newDisciplinesRes)
      }

      setNewDisciplineName('')
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '505') {
        setError('Discipline added, but there was an error loading updated disciplines and majors data.')
      } else {
        setError(`Unexpected error adding discipline: ${newDisciplineName}.`)
      }
    } finally {
      setLoadingDisciplinesMajors(false)
    }
  }

  // ------------------ UMBRELLA TOPICS FUNCTIONS ------------------ //
  const handleEditUmbrella = (id, name) => {
    setEditingIdUmbrella(id) // Allows the user to begin editting
    setEditedNameUmbrella(name)
  }

  const handleCancelUmbrellaEdit = (id) => {
    setEditingIdUmbrella(null) // Stop editting this
    setEditedNameUmbrella('')
    setError(null)
  }

  const handleSaveUmbrella = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/umbrella-topic?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editedNameUmbrella
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setUmbrellaTopics(umbrellaTopics.map(u =>
        u.id === id ? { ...u, name: editedNameUmbrella } : u
      ))
      setError(null)
      setEditingIdUmbrella(null)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${editedNameUmbrella} cannot be editted due to conflicts with other data. Then try again.`)
      } else {
        setError(`Unexpected error updating umbrella topic: ${editedNameUmbrella}.`)
      }
    }
  }

  const handleDeleteUmbrella = async (id) => {
    setLoadingUmbrellaTopics(true)

    const topic = umbrellaTopics.find(m => m.id === id)
    if (!topic) {
      setError('Umbrella topic not found.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/umbrella-topic?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setUmbrellaTopics(umbrellaTopics.filter(u => u.id !== id))
      setError(null)
      setDeletingIdUmbrella(null)
      setOpenDeleteDialog(false)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${topic.name} cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Then try again.`)
      } else {
        setError(`Unexpected error deleting topic: ${topic.name}.`)
      }
    } finally {
      setLoadingUmbrellaTopics(false)
    }
  }

  const handleAddUmbrella = async () => {
    if (!newUmbrellaName.trim()) {
      setError('Error adding umbrella topic. Must have a name.')
      return
    }

    setLoadingUmbrellaTopics(true)

    try {
      const response = await fetch(`${backendUrl}/umbrella-topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUmbrellaName })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      const newUmbrellaTopics = await fetchUmbrellaTopics()
      if (newUmbrellaTopics.length === 0) {
        throw new Error('505')
      } else {
        setUmbrellaTopics(newUmbrellaTopics)
      }

      setNewUmbrellaName('')
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '505') {
        setError('Topic added, but there was an error loading updated umbrella topics data.')
      } else {
        setError(`Unexpected error adding topic: ${newUmbrellaName}.`)
      }
    } finally {
      setLoadingUmbrellaTopics(false)
    }
  }

  // ------------------ RESEARCH PERIODS FUNCTIONS ------------------ //
  const handleEditPeriod = (id, name) => {
    setEditingIdPeriod(id) // Allows the user to begin editting
    setEditedNamePeriod(name)
  }

  const handleCancelPeriodEdit = (id) => {
    setEditingIdPeriod(null) // Stop editting this
    setEditedNamePeriod('')
    setError(null)
  }

  const handleSavePeriod = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/research-period?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editedNamePeriod
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setResearchPeriods(researchPeriods.map(u =>
        u.id === id ? { ...u, name: editedNamePeriod } : u
      ))
      setError(null)
      setEditingIdPeriod(null)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${editedNamePeriod} cannot be editted due to conflicts with other data. Then try again.`)
      } else {
        setError(`Unexpected error updating research period: ${editedNamePeriod}.`)
      }
    }
  }

  const handleDeletePeriod= async (id) => {
    setLoadingResearchPeriods(true)

    const period = researchPeriods.find(m => m.id === id)
    if (!period) {
      setError('Research period not found.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/research-period?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setResearchPeriods(researchPeriods.filter(u => u.id !== id))
      setError(null)
      setDeletingIdMajor(null)
      setOpenDeleteDialog(false)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${period.name} cannot be deleted because it has connections to other projects and/or students. Please edit or remove those connections first. Then try again.`)
      } else {
        setError(`Unexpected error deleting research period: ${period.name}.`)
      }
    } finally {
      setLoadingResearchPeriods(false)
    }
  }

  const handleAddPeriod = async () => {
    if (!newPeriodName.trim()) {
      setError('Error adding research period. Must have a name.')
      return
    }

    setLoadingResearchPeriods(true)

    try {
      const response = await fetch(`${backendUrl}/research-period`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPeriodName })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      const newResearchPeriods = await fetchResearchPeriods()
      if (newResearchPeriods.length === 0) {
        throw new Error('505')
      } else {
        setUmbrellaTopics(newResearchPeriods)
      }

      setNewPeriodName('')
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '505') {
        setError('Period added, but there was an error loading updated research periods data.')
      } else {
        setError(`Unexpected error adding period: ${newPeriodName}.`)
      }
    } finally {
      setLoadingResearchPeriods(false)
    }
  }

  // ------------------ DEPARTMENTS FUNCTIONS ------------------ //
  const handleEditDepartment = (id, name) => {
    setEditingIdDepartment(id) // Allows the user to begin editting
    setEditedNameDepartment(name)
  }

  const handleCancelDepartmentEdit = (id) => {
    setEditingIdDepartment(null) // Stop editting this
    setEditedNameDepartment('')
    setError(null)
  }

  const handleSaveDepartment = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/department?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editedNameDepartment
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setDepartments(departments.map(u =>
        u.id === id ? { ...u, name: editedNameDepartment } : u
      ))
      setError(null)
      setEditingIdDepartment(null)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${editedNameDepartment} cannot be editted due to conflicts with other data. Then try again.`)
      } else {
        setError(`Unexpected error updating department: ${editedNameDepartment}.`)
      }
    }
  }

  const handleDeleteDepartment = async (id) => {
    setLoadingDepartments(true)

    const dept = departments.find(m => m.id === id)
    if (!dept) {
      setError('Department not found.')
      return
    }

    try {
      const response = await fetch(`${backendUrl}/department?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id
        })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      setDepartments(departments.filter(u => u.id !== id))
      setError(null)
      setDeletingIdDepartment(null)
      setOpenDeleteDialog(false)
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '409') {
        setError(`${dept.name} cannot be deleted because it has connections to other faculty. Please edit or remove those connections first. Then try again.`)
      } else {
        setError(`Unexpected error deleting department: ${dept.name}.`)
      }
    } finally {
      setLoadingDepartments(false)
    }
  }

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      setError('Error adding department. Must have a name.')
      return
    }

    setLoadingDepartments(true)

    try {
      const response = await fetch(`${backendUrl}/department`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDepartmentName })
      })

      if (!response.ok) {
        throw new Error(response.status)
      }

      const newDepartments = await fetchDepartments()
      if (newDepartments.length === 0) {
        throw new Error('505')
      } else {
        setDepartments(newDepartments)
      }

      setNewDepartmentName('')
    } catch (error) {
      if (error.message === '400') {
        setError('Bad request.')
      } else if (error.message === '505') {
        setError('Department added, but there was an error loading updated data.')
      } else {
        setError(`Unexpected error adding department: ${newDepartmentName}.`)
      }
    } finally {
      setLoadingDepartments(false)
    }
  }

   // uses deletingId to know which delete function to call on the shared AreYouSureDialog box
   const handleDelete = async () => {
    if (deletingIdDiscipline !== null) {
      await handleDeleteDiscipline(deletingIdDiscipline)
    }
    if (deletingIdMajor !== null) {
      await handleDeleteMajor(deletingIdMajor)
    }
    if (deletingIdUmbrella !== null) {
      await handleDeleteUmbrella(deletingIdUmbrella)
    }
    if (deletingIdPeriod !== null) {
      await handleDeletePeriod(deletingIdPeriod)
    }
    if (deletingIdDepartment !== null) {
      await handleDeleteDepartment(deletingIdDepartment)
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
        handleSaveDiscipline,
        handleAddDiscipline
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
        handleSaveMajor,
        handleAddMajor
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
        handleSaveUmbrella,
        handleAddUmbrella
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
        handleSavePeriod,
        handleAddPeriod
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
        handleSaveDepartment,
        handleAddDepartment
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
