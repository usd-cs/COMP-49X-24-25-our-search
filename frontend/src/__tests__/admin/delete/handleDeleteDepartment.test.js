import { handleDeleteDepartment } from '../../../utils/adminFetching'

describe('handleDeleteDepartment', () => {
  let setLoadingDepartments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError, departments

  beforeEach(() => {
    setLoadingDepartments = jest.fn()
    setDepartments = jest.fn()
    setDeletingIdDepartment = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    // Sample departments
    departments = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Mathematics' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setLoadingDepartments(true) to set loading state while deleting department', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setLoadingDepartments).toHaveBeenCalledWith(true)
    expect(setLoadingDepartments).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the department', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/department'), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update departments after successfully deleting the department', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setDepartments).toHaveBeenCalledWith([{ id: 2, name: 'Mathematics' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingIdDepartment).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set error if the DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error if department has connections (409)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Engineering cannot be deleted because it has connections to other faculty. Please edit or remove those connections first. Remove connections, then try again.')
  })

  it('should set an error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting department: Engineering.')
  })

  it('should call setLoadingDepartments(false) after succesful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteDepartment(1, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setLoadingDepartments).toHaveBeenCalledWith(false)
  })

  it('should NOT call setLoadingDepartments(false) to keep loading if department not found', async () => {
    await handleDeleteDepartment(3, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setLoadingDepartments).not.toHaveBeenCalledWith(false)
  })

  it('should set error message if department not found', async () => {
    await handleDeleteDepartment(3, setLoadingDepartments, departments, setDepartments, setDeletingIdDepartment, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Department not found.')
  })
})
