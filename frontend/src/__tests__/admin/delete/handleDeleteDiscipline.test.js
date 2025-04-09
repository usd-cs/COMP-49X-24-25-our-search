import { handleDeleteDiscipline } from '../../../utils/adminFetching'

describe('handleDeleteDiscipline', () => {
  let setLoadingDisciplinesMajors, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, disciplines, fetchDisciplines, prepopulateMajorsWithDisciplines

  beforeEach(() => {
    setLoadingDisciplinesMajors = jest.fn()
    setDisciplines = jest.fn()
    setDeletingIdDiscipline = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()
    fetchDisciplines = jest.fn()
    prepopulateMajorsWithDisciplines = jest.fn()

    global.fetch = jest.fn()

    // Sample disciplines
    disciplines = [
      { id: 1, name: 'Life Sciences' },
      { id: 2, name: 'Arts' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setLoadingDisciplinesMajors(true) to set loading state while deleting discipline', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(true)
    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the discipline', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/discipline'), {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update disciplines after successfully deleting the discipline', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    const newDisciplines = [{ id: 1, name: 'Humanities', majors: [] }]
    fetchDisciplines.mockResolvedValue(newDisciplines)

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(fetchDisciplines).toHaveBeenCalled()
    expect(prepopulateMajorsWithDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(setDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingIdDiscipline).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set an error if fetchDisciplines returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    fetchDisciplines.mockResolvedValue([])

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Discipline deleted, but there was an error loading updated disciplines and majors data.')
  })

  it('should set error if the DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error if discipline has connections (409)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Life Sciences cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Remove connections, then try again.')
  })

  it('should set error if discipline is not allowed to be deleted (403)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403 })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Discipline is permanent and cannot be deleted.')
  })

  it('should set an error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting discipline: Life Sciences.')
  })

  it('should call setLoadingDisciplinesMajors(false) after succesful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDiscipline(1, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should NOT call setLoadingDisciplinesMajors(false) to keep loading if discipline not found', async () => {
    await handleDeleteDiscipline(3, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setLoadingDisciplinesMajors).not.toHaveBeenCalledWith(false)
  })

  it('should set error message if discipline not found', async () => {
    await handleDeleteDiscipline(3, setLoadingDisciplinesMajors, disciplines, setDisciplines, setDeletingIdDiscipline, setOpenDeleteDialog, setError, fetchDisciplines, prepopulateMajorsWithDisciplines)

    expect(setError).toHaveBeenCalledWith('Discipline not found.')
  })
})
