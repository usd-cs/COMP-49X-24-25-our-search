import { handleDeleteMajor } from '../../../utils/adminFetching'

describe('handleDeleteMajor', () => {
  let setLoadingDisciplinesMajors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError, majors

  beforeEach(() => {
    setLoadingDisciplinesMajors = jest.fn()
    setMajors = jest.fn()
    setDeletingIdMajor = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    // Sample majors
    majors = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Mathematics' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setLoadingDisciplinesMajors(true) to set loading state while deleting major', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(true)
    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the major', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/major'), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update majors after successfully deleting the major', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setMajors).toHaveBeenCalledWith([{ id: 2, name: 'Mathematics' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingIdMajor).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set error if the DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error if major has connections (409)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Engineering cannot be deleted because it has connections to other disciplines, projects, or students. Please edit or remove those connections first. Remove connections, then try again.')
  })

  it('should set an error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting major: Engineering.')
  })

  it('should call setLoadingDisciplinesMajors(false) after succesful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteMajor(1, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should NOT call setLoadingDisciplinesMajors(false) to keep loading if major not found', async () => {
    await handleDeleteMajor(3, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setLoadingDisciplinesMajors).not.toHaveBeenCalledWith(false)
  })

  it('should set error message if major not found', async () => {
    await handleDeleteMajor(3, setLoadingDisciplinesMajors, majors, setMajors, setDeletingIdMajor, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Major not found.')
  })
})
