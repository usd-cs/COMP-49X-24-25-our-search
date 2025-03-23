import { handleAddDepartment } from '../../utils/adminFetching'
import { backendUrl } from '../../resources/constants'

describe('handleAddDepartment', () => {
  let setLoadingDepartments, fetchDepartments, setDepartments, setNewDepartmentName, setError

  beforeEach(() => {
    setLoadingDepartments = jest.fn()
    fetchDepartments = jest.fn()
    setDepartments = jest.fn()
    setNewDepartmentName = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if department name is empty', async () => {
    await handleAddDepartment('  ', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setError).toHaveBeenCalledWith('Error adding department. Must have a name.')
    expect(setLoadingDepartments).not.toHaveBeenCalled()
  })

  it('should set loading state while adding department', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    fetchDepartments.mockResolvedValue([{ id: 1, name: 'Engineering' }])

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setLoadingDepartments).toHaveBeenCalledWith(true)
    expect(setLoadingDepartments).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add department', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    fetchDepartments.mockResolvedValue([{ id: 1, name: 'Engineering' }])

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(fetch).toHaveBeenCalledWith(`${backendUrl}/department`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDepartmentName: 'Engineering' })
    })
  })

  it('should update departments after successfully adding a department', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    fetchDepartments.mockResolvedValue([{ id: 1, name: 'Engineering' }])

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setDepartments).toHaveBeenCalledWith([{ id: 1, name: 'Engineering' }])
    expect(setNewDepartmentName).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is not ok', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if fetchDepartments returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    fetchDepartments.mockResolvedValue([])

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setError).toHaveBeenCalledWith('Department added, but there was an error loading updated data.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding department: Engineering.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })

    await handleAddDepartment('Engineering', setNewDepartmentName, setDepartments, setLoadingDepartments, fetchDepartments, setError)

    expect(setLoadingDepartments).toHaveBeenCalledWith(false)
  })
})
