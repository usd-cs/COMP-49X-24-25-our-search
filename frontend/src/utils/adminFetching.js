/**
 * @file adminFetching.js
 * @description defines functions that make requests to the backend to edit/save, add, and delete:
 *              1. majors
 *              2. disciplines
 *              3. umbrella topics
 *              4. research periods
 *              5. departments
 * The function parameters are used to help define what needs to be edited/saved, added,
 * or deleted, and what needs to happen once the requests succeed or fail.
 *
 * @author Natalie Jungquist
 */

import { BACKEND_URL } from '../resources/constants'

// ------------------ MAJORS FUNCTIONS ------------------ //
export const handleSaveMajor = async (id, editedNameMajor, setEditingIdMajor, selectedDisciplines, majors, setMajors, setError) => {
  if (!editedNameMajor.trim()) {
    setError('Error editing major. Must have a name.')
    return
  }

  const sendTheseDisciplines = selectedDisciplines[id].map(d => d.name)

  try {
    const response = await fetch(`${BACKEND_URL}/major?id=${id}`, {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: editedNameMajor,
        disciplines: sendTheseDisciplines
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
      setError(`${editedNameMajor} cannot be editted due to conflicts with other data. Remove connections, then try again.`)
    } else if (error.message === '403') {
      setError('\'Undeclared\' is permanent and cannot be editted.')
    } else {
      setError(`Unexpected error updating major: ${editedNameMajor}.`)
    }
  }
}

export const handleAddMajor = async (newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, fetchDisciplines, setError) => {
  if (!newMajorName.trim()) {
    setError('Error adding major. Must have a name.')
    return
  }

  setLoadingDisciplinesMajors(true)

  const newMajor = {
    name: newMajorName,
    disciplines: newMajorDisciplines.map(discipline => discipline.name)
  }

  try {
    const response = await fetch(`${BACKEND_URL}/major`, {
      credentials: 'include',
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
    } else if (error.message === '403') {
      setError('\'Undeclared\' is permanent and cannot be duplicated.')
    } else if (error.message === '505') {
      setError('Major added, but there was an error loading updated disciplines and majors data.')
    } else {
      setError(`Unexpected error adding major: ${newMajorName}.`)
    }
  } finally {
    setLoadingDisciplinesMajors(false)
  }
}

export const handleDeleteMajor = async (id, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError) => {
  setLoadingDisciplinesMajors(true)

  const major = majors.find(m => m.id === id)
  if (!major) {
    setError('Major not found.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/major?id=${id}`, {
      credentials: 'include',
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
    } else if (error.message === '403') {
      setError('\'Undeclared\' is permanent and cannot be deleted.')
    } else if (error.message === '409') {
      setError(`${major.name} cannot be deleted because it has connections to other disciplines, projects, or students. Please edit or remove those connections first. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error deleting major: ${major.name}.`)
    }
  } finally {
    setLoadingDisciplinesMajors(false)
  }
}

// ------------------ DISCIPLINES FUNCTIONS ------------------ //
export const handleSaveDiscipline = async (id, editedNameDiscipline, disciplines, setDisciplines, setEditingIdDiscipline, setError) => {
  if (!editedNameDiscipline.trim()) {
    setError('Error editing discipline. Must have a name.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/discipline?id=${id}`, {
      credentials: 'include',
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

    setDisciplines(disciplines.map(d =>
      d.id === id ? { ...d, name: editedNameDiscipline } : d
    ))
    setError(null)
    setEditingIdDiscipline(null)
  } catch (error) {
    if (error.message === '400') {
      setError('Bad request.')
    } else if (error.message === '403') {
      setError('Discipline is permanent and cannot be editted.')
    } else if (error.message === '409') {
      setError(`${editedNameDiscipline} cannot be editted due to conflicts with other data. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error updating discipline: ${editedNameDiscipline}.`)
    }
  }
}

export const handleAddDiscipline = async (newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, fetchDisciplines, setError) => {
  if (!newDisciplineName.trim()) {
    setError('Error adding discipline. Must have a name.')
    return
  }

  setLoadingDisciplinesMajors(true)

  try {
    const response = await fetch(`${BACKEND_URL}/discipline`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDisciplineName })
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
    } else if (error.message === '403') {
      setError('Discipline is permanent and cannot be duplicated.')
    } else if (error.message === '505') {
      setError('Discipline added, but there was an error loading updated disciplines and majors data.')
    } else {
      setError(`Unexpected error adding discipline: ${newDisciplineName}.`)
    }
  } finally {
    setLoadingDisciplinesMajors(false)
  }
}

export const handleDeleteDiscipline = async (id, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines) => {
  setLoadingDisciplinesMajors(true)

  const disc = disciplines.find(m => m.id === id)
  if (!disc) {
    setError('Discipline not found.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/discipline?id=${id}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id
      })
    })

    if (!response.ok) {
      throw new Error(response.status)
    }

    // fetch again to show new disciplines and majors connections because the discipline that
    // was just deleted may have been connected to majors. Now the connections to those majors is removed.
    const newDisciplinesRes = await fetchDisciplines()
    if (newDisciplinesRes.length === 0) {
      throw new Error('505')
    } else {
      setDisciplines(newDisciplinesRes)
      prepopulateMajorsWithDisciplines(newDisciplinesRes)
    }
    setError(null)
    setDeletingIdDiscipline(null)
    setOpenDeleteDialog(false)
  } catch (error) {
    if (error.message === '400') {
      setError('Bad request.')
    } else if (error.message === '409') {
      setError(`${disc.name} cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Remove connections, then try again.`)
    } else if (error.message === '403') {
      setError('Discipline is permanent and cannot be deleted.')
    } else if (error.message === '505') {
      setError('Discipline deleted, but there was an error loading updated disciplines and majors data.')
    } else {
      setError(`Unexpected error deleting discipline: ${disc.name}.`)
    }
  } finally {
    setLoadingDisciplinesMajors(false)
  }
}

// ------------------ UMBRELLA TOPICS FUNCTIONS ------------------ //
export const handleSaveUmbrella = async (id, editedNameUmbrella, umbrellaTopics, setUmbrellaTopics, setEditingIdUmbrella, setError) => {
  if (!editedNameUmbrella.trim()) {
    setError('Error editing topic. Must have a name.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/umbrella-topic?id=${id}`, {
      credentials: 'include',
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
      setError(`${editedNameUmbrella} cannot be editted due to conflicts with other data. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error updating umbrella topic: ${editedNameUmbrella}.`)
    }
  }
}

export const handleAddUmbrella = async (newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, fetchUmbrellaTopics, setError) => {
  if (!newUmbrellaName.trim()) {
    setError('Error adding umbrella topic. Must have a name.')
    return
  }

  setLoadingUmbrellaTopics(true)

  try {
    const response = await fetch(`${BACKEND_URL}/umbrella-topic`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUmbrellaName })
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

export const handleDeleteUmbrella = async (id, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError) => {
  setLoadingUmbrellaTopics(true)

  const topic = umbrellaTopics.find(m => m.id === id)
  if (!topic) {
    setError('Umbrella topic not found.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/umbrella-topic?id=${id}`, {
      credentials: 'include',
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
      setError(`${topic.name} cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error deleting topic: ${topic.name}.`)
    }
  } finally {
    setLoadingUmbrellaTopics(false)
  }
}

// ------------------ RESEARCH PERIODS FUNCTIONS ------------------ //
export const handleSavePeriod = async (id, editedNamePeriod, setResearchPeriods, researchPeriods, setEditingIdPeriod, setError) => {
  if (!editedNamePeriod.trim()) {
    setError('Error editing research period. Must have a name.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/research-period?id=${id}`, {
      credentials: 'include',
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
      setError(`${editedNamePeriod} cannot be editted due to conflicts with other data. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error updating research period: ${editedNamePeriod}.`)
    }
  }
}

export const handleAddPeriod = async (newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, fetchResearchPeriods, setError) => {
  if (!newPeriodName.trim()) {
    setError('Error adding research period. Must have a name.')
    return
  }

  setLoadingResearchPeriods(true)

  try {
    const response = await fetch(`${BACKEND_URL}/research-period`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPeriodName })
    })

    if (!response.ok) {
      throw new Error(response.status)
    }

    const newResearchPeriods = await fetchResearchPeriods()
    if (newResearchPeriods.length === 0) {
      throw new Error('505')
    } else {
      setResearchPeriods(newResearchPeriods)
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

export const handleDeletePeriod = async (id, setLoadingResearchPeriods, researchPeriods, setResearchPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError) => {
  setLoadingResearchPeriods(true)

  const period = researchPeriods.find(m => m.id === id)
  if (!period) {
    setError('Research period not found.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/research-period?id=${id}`, {
      credentials: 'include',
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
    setDeletingIdPeriod(null)
    setOpenDeleteDialog(false)
  } catch (error) {
    if (error.message === '400') {
      setError('Bad request.')
    } else if (error.message === '409') {
      setError(`${period.name} cannot be deleted because it has connections to other projects and/or students. Please edit or remove those connections first. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error deleting research period: ${period.name}.`)
    }
  } finally {
    setLoadingResearchPeriods(false)
  }
}

// ------------------ DEPARTMENTS FUNCTIONS ------------------ //
export const handleSaveDepartment = async (id, editedNameDepartment, departments, setDepartments, setEditingIdDepartment, setError) => {
  if (!editedNameDepartment.trim()) {
    setError('Error editing department. Must have a name.')
    return
  }
  try {
    const response = await fetch(`${BACKEND_URL}/department?id=${id}`, {
      credentials: 'include',
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

    setDepartments(departments.map(d =>
      d.id === id ? { ...d, name: editedNameDepartment } : d
    ))
    setError(null)
    setEditingIdDepartment(null)
  } catch (error) {
    if (error.message === '400') {
      setError('Bad request.')
    } else if (error.message === '409') {
      setError(`${editedNameDepartment} cannot be editted due to conflicts with other data. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error updating department: ${editedNameDepartment}.`)
    }
  }
}

export const handleAddDepartment = async (newDepartmentName, setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError) => {
  if (!newDepartmentName.trim()) {
    setError('Error adding department. Must have a name.')
    return
  }

  setLoadingDepartments(true)

  try {
    const response = await fetch(`${BACKEND_URL}/department`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDepartmentName })
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

export const handleDeleteDepartment = async (id, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError) => {
  setLoadingDepartments(true)

  const dept = departments.find(m => m.id === id)
  if (!dept) {
    setError('Department not found.')
    return
  }

  try {
    const response = await fetch(`${BACKEND_URL}/department?id=${id}`, {
      credentials: 'include',
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
      setError(`${dept.name} cannot be deleted because it has connections to other faculty. Please edit or remove those connections first. Remove connections, then try again.`)
    } else {
      setError(`Unexpected error deleting department: ${dept.name}.`)
    }
  } finally {
    setLoadingDepartments(false)
  }
}
