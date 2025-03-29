import { handleSaveDepartment } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSaveDepartment', () => {
  let setEditingIdDepartment, setDepartments, setError

  beforeEach(() => {
    setEditingIdDepartment = jest.fn()
    setDepartments = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should show an error if name is empty', async () => {
    await handleSaveDepartment(1, '', [], setDepartments, setEditingIdDepartment, setError)

    expect(setError).toHaveBeenCalledWith('Error editing department. Must have a name.')
  })

  it('should make a PUT request to save department', async () => {
    const departments = [{ id: 1, name: 'Old Name' }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveDepartment(1, 'New Name', departments, setDepartments, setEditingIdDepartment, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/department'), {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        name: 'New Name'
      })
    })
  })

  it('should update major successfully after successfully saving department', async () => {
    const departments = [{ id: 1, name: 'Old Name' }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveDepartment(1, 'New Name', departments, setDepartments, setEditingIdDepartment, setError)

    expect(setDepartments).toHaveBeenCalledWith([{ id: 1, name: 'New Name' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdDepartment).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSaveDepartment(1, 'New Name', [], setDepartments, setEditingIdDepartment, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSaveDepartment(1, 'New Name', [], setDepartments, setEditingIdDepartment, setError)

    expect(setError).toHaveBeenCalledWith('New Name cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSaveDepartment(1, 'New Name', [], setDepartments, setEditingIdDepartment, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating department: New Name.')
  })
})
