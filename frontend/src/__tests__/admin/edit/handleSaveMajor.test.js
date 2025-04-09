import { handleSaveMajor } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSaveMajor', () => {
  let setEditingIdMajor, setMajors, setError

  const selectedDisciplines = {
    1: [{ id: 1, name: 'Science discipline', majors: [{ id: 1, name: 'Major' }] }], // mock that major with id 1 has 1 discipline
    2: [] // mock that major with id 2 has no discipline
  }

  beforeEach(() => {
    setEditingIdMajor = jest.fn()
    setMajors = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should show an error if major name is empty', async () => {
    await handleSaveMajor(1, '  ', setEditingIdMajor, [], [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('Error editing major. Must have a name.')
  })

  it('should make a PUT request to save major', async () => {
    const majors = [{ id: 1, name: 'Old Name', disciplines: [] }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/major'), {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        name: 'New Name',
        disciplines: [selectedDisciplines[1][0].name]
      })
    })
  })

  it('should update major successfully after successfully saving major', async () => {
    const majors = [{ id: 1, name: 'Old Name', disciplines: [selectedDisciplines[1][0]] }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)

    expect(setMajors).toHaveBeenCalledWith([{ id: 1, name: 'New Name', disciplines: [selectedDisciplines[1][0]] }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdMajor).toHaveBeenCalledWith(null)
  })

  it('works to save major if no disciplines are selected', async () => {
    const majors = [{ id: 2, name: 'Other Major', disciplines: [] }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveMajor(2, 'Other Major new name', setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)

    expect(setMajors).toHaveBeenCalledWith([{ id: 2, name: 'Other Major new name', disciplines: [] }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdMajor).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('New Name cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle 403 for Undeclared major', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403 })

    await handleSaveMajor(1, 'Undeclared', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith("'Undeclared' is permanent and cannot be editted.")
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating major: New Name.')
  })
})
